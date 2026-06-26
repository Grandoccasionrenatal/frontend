#!/usr/bin/env python3
"""
One-time script to backfill cover images for existing blog posts
that are missing an image or have a mismatched one.
Run locally: STRAPI_URL=... STRAPI_TOKEN=... PEXELS_API_KEY=... python scripts/backfill_images.py
"""
import os, json, io, re, time
import requests

STRAPI_URL   = os.environ["STRAPI_URL"]
STRAPI_TOKEN = os.environ["STRAPI_TOKEN"]
PEXELS_API_KEY = os.environ["PEXELS_API_KEY"]

STRAPI_HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}

# Keyword -> Pexels search query (same logic as generate_blog_post.py)
PEXELS_QUERIES = {
    "marquee":        "outdoor marquee tent event",
    "wedding":        "outdoor wedding reception marquee",
    "birthday":       "birthday party outdoor celebration",
    "communion":      "holy communion family celebration",
    "confirmation":   "confirmation celebration family",
    "bouncy castle":  "children bouncy castle party",
    "inflatable":     "children bouncy castle inflatable party",
    "en14960":        "children bouncy castle inflatable party",
    "safety":         "children party outdoor safety",
    "soft play":      "children soft play indoor",
    "flower wall":    "flower wall backdrop event",
    "table":          "elegant event table setting outdoor",
    "chair":          "chiavari chairs wedding banquet",
    "linen":          "white tablecloth event table",
    "glassware":      "event glassware champagne flutes",
    "corporate":      "corporate outdoor event tent",
    "garden party":   "garden party outdoor celebration",
    "garden":         "garden party outdoor celebration",
    "flooring":       "outdoor event flooring marquee",
    "lighting":       "marquee fairy lights event",
    "summer party":   "summer outdoor party celebration",
    "summer":         "summer outdoor party garden celebration",
    "castlecomer":    "outdoor event rural ireland countryside",
    "abbeyleix":      "outdoor event ireland garden marquee",
    "athy":           "outdoor garden marquee kildare ireland",
    "naas":           "outdoor corporate marquee event kildare",
    "default":        "outdoor event hire marquee Ireland garden",
}

CATEGORY_FALLBACK = {
    "seasonal-local":      "outdoor marquee tent event",
    "event-planning-tips": "outdoor event planning marquee",
    "product-spotlight":   "event hire equipment party",
    "real-event-showcase": "outdoor party celebration garden",
}


def best_query(title: str, category: str) -> str:
    t = title.lower()
    for keyword, query in PEXELS_QUERIES.items():
        if keyword in t:
            return query
    return CATEGORY_FALLBACK.get(category, PEXELS_QUERIES["default"])


def fetch_pexels(query: str, page: int = 1):
    r = requests.get(
        "https://api.pexels.com/v1/search",
        params={"query": query, "per_page": 5, "page": page, "orientation": "landscape"},
        headers={"Authorization": PEXELS_API_KEY},
        timeout=15,
    )
    r.raise_for_status()
    photos = r.json().get("photos", [])
    if not photos:
        r2 = requests.get(
            "https://api.pexels.com/v1/search",
            params={"query": "outdoor event celebration marquee", "per_page": 3, "orientation": "landscape"},
            headers={"Authorization": PEXELS_API_KEY},
            timeout=15,
        )
        r2.raise_for_status()
        photos = r2.json().get("photos", [])
    return photos


def download_photo(photo: dict):
    img_bytes = requests.get(photo["src"]["large2x"], timeout=30).content
    filename  = f"blog-cover-{photo['id']}.jpg"
    photographer = photo.get("photographer", "Pexels")
    return img_bytes, filename, photographer


def upload_to_strapi(img_bytes: bytes, filename: str, alt_text: str) -> int:
    r = requests.post(
        f"{STRAPI_URL}/api/upload",
        headers=STRAPI_HEADERS,
        files={"files": (filename, io.BytesIO(img_bytes), "image/jpeg")},
        data={"fileInfo": json.dumps({"alternativeText": alt_text, "caption": ""})},
        timeout=60,
    )
    r.raise_for_status()
    uploaded = r.json()
    return (uploaded[0] if isinstance(uploaded, list) else uploaded)["id"]


def patch_post(post_id: int, media_id: int):
    r = requests.put(
        f"{STRAPI_URL}/api/blog-posts/{post_id}",
        json={"data": {"cover_image": {"id": media_id}}},
        headers=STRAPI_HEADERS,
        timeout=30,
    )
    if not r.ok:
        print(f"  PATCH error: {r.status_code} {r.text[:300]}")
    r.raise_for_status()


def all_posts():
    r = requests.get(
        f"{STRAPI_URL}/api/blog-posts"
        "?sort=id:asc&pagination[pageSize]=100"
        "&populate=cover_image&fields[0]=title&fields[1]=category",
        headers=STRAPI_HEADERS,
        timeout=20,
    )
    r.raise_for_status()
    return r.json()["data"]


# Posts whose images are wrong (mismatched) and should be replaced
MISMATCH_IDS = {10}   # inflatable safety post got a table-setting photo


def main():
    posts = all_posts()
    used_photo_ids = set()  # avoid reusing the same Pexels photo across posts

    for p in posts:
        pid   = p["id"]
        attr  = p["attributes"]
        title = attr["title"]
        cat   = attr.get("category", "")
        img   = attr.get("cover_image", {})
        has_image = bool(img.get("data") if isinstance(img, dict) else None)

        needs_image = (not has_image) or (pid in MISMATCH_IDS)
        if not needs_image:
            print(f"#{pid} OK - {title[:55]}")
            continue

        reason = "MISSING" if not has_image else "MISMATCH"
        query  = best_query(title, cat)
        print(f"#{pid} {reason} - {title[:55]}")
        print(f"  Query: {query}")

        # Try pages 1-3 to find a photo not already used
        photo = None
        for page in range(1, 4):
            photos = fetch_pexels(query, page=page)
            for ph in photos:
                if ph["id"] not in used_photo_ids:
                    photo = ph
                    break
            if photo:
                break

        if not photo:
            print(f"  WARNING: no unused Pexels photo found, skipping")
            continue

        used_photo_ids.add(photo["id"])
        img_bytes, filename, photographer = download_photo(photo)
        alt_text = f"{title} - Grand Occasion Rental"
        media_id = upload_to_strapi(img_bytes, filename, alt_text)
        print(f"  Uploaded media #{media_id} (by {photographer})")

        patch_post(pid, media_id)
        print(f"  Patched post #{pid} with cover image #{media_id}")
        time.sleep(1)   # be gentle on the API

    print("\nDone.")


if __name__ == "__main__":
    main()
