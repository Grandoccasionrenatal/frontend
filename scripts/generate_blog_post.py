#!/usr/bin/env python3
"""
Daily blog post generator for grandoccasionrental.ie
Calls Claude API to write SEO-optimised content then publishes to Strapi.

Topic research based on competitor blogs:
  - marqueehire.ie (All in One Event Hire)
  - irishmarqueehireltd.com (S&G Party Hire)
  - caterhire.ie
  - rentatentni.com
  - entertainmentsolutions.ie
  - iihf.ie (Irish Inflatable Hirers Federation)
"""
import os, json, re, io
from datetime import datetime, timezone
import requests

STRAPI_URL = os.environ["STRAPI_URL"]
STRAPI_TOKEN = os.environ["STRAPI_TOKEN"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
PEXELS_API_KEY = os.environ["PEXELS_API_KEY"]

# -- Location pool (within ~90 min of Co. Kildare) --------------------------
LOCATIONS = [
    # Kildare
    "Naas, Co. Kildare", "Newbridge, Co. Kildare", "Athy, Co. Kildare",
    "Kildare town", "Maynooth, Co. Kildare", "Celbridge, Co. Kildare",
    "Leixlip, Co. Kildare", "Kilcock, Co. Kildare", "Clane, Co. Kildare",
    "Monasterevin, Co. Kildare", "Kilcullen, Co. Kildare", "Castledermot, Co. Kildare",
    "Sallins, Co. Kildare", "Prosperous, Co. Kildare", "Rathangan, Co. Kildare",
    # Dublin
    "Dublin city centre", "Tallaght, Dublin", "Lucan, Dublin", "Clondalkin, Dublin",
    "Blanchardstown, Dublin", "Swords, Co. Dublin", "Rathfarnham, Dublin",
    "Dundrum, Dublin", "Terenure, Dublin", "Dun Laoghaire, Co. Dublin",
    "Malahide, Co. Dublin", "Balbriggan, Co. Dublin", "Clonskeagh, Dublin",
    "Ballsbridge, Dublin", "Stillorgan, Co. Dublin",
    # Carlow
    "Carlow town", "Tullow, Co. Carlow", "Muinebheag, Co. Carlow",
    "Graiguecullen, Co. Carlow", "Bagenalstown, Co. Carlow",
    # Laois
    "Portlaoise, Co. Laois", "Abbeyleix, Co. Laois", "Mountrath, Co. Laois",
    "Portarlington, Co. Laois", "Mountmellick, Co. Laois", "Rathdowney, Co. Laois",
    "Durrow, Co. Laois", "Stradbally, Co. Laois",
    # Wicklow
    "Blessington, Co. Wicklow", "Arklow, Co. Wicklow", "Greystones, Co. Wicklow",
    "Baltinglass, Co. Wicklow", "Wicklow town", "Bray, Co. Wicklow",
    "Rathdrum, Co. Wicklow",
    # Kilkenny
    "Kilkenny city", "Castlecomer, Co. Kilkenny", "Thomastown, Co. Kilkenny",
    "Callan, Co. Kilkenny", "Graiguenamanagh, Co. Kilkenny", "Piltown, Co. Kilkenny",
    # Tipperary
    "Thurles, Co. Tipperary", "Templemore, Co. Tipperary", "Roscrea, Co. Tipperary",
    "Clonmel, Co. Tipperary", "Nenagh, Co. Tipperary", "Cashel, Co. Tipperary",
    "Tipperary town",
    # Waterford
    "Waterford city", "Dungarvan, Co. Waterford", "Carrick-on-Suir, Co. Tipperary",
    "Tramore, Co. Waterford",
    # Offaly / Meath / Westmeath
    "Tullamore, Co. Offaly", "Edenderry, Co. Offaly", "Birr, Co. Offaly",
    "Trim, Co. Meath", "Navan, Co. Meath", "Dunshaughlin, Co. Meath",
    "Mullingar, Co. Westmeath",
    # Wexford
    "Wexford town", "Enniscorthy, Co. Wexford", "Gorey, Co. Wexford",
]

# -- Topic pool (researched from competitor blogs) --------------------------
# Format: (category, topic_idea)
# Categories: seasonal-local | event-planning-tips | product-spotlight |
#             real-event-showcase | safety-guide
TOPIC_IDEAS = [
    # -- From marqueehire.ie --
    ("product-spotlight",    "Table size guide: which table fits how many guests and what tablecloth size you need"),
    ("product-spotlight",    "Chiavari chairs vs folding chairs: which is right for your event?"),
    ("event-planning-tips",  "How to choose the right marquee size for your guest count"),
    ("event-planning-tips",  "10 tips for planning a successful outdoor event with a marquee"),
    ("product-spotlight",    "Why eco-friendly event hire is growing in Ireland"),
    # -- From caterhire.ie --
    ("event-planning-tips",  "Frame marquee vs traditional pole marquee: which is best for an Irish garden?"),
    ("event-planning-tips",  "Marquee wedding guide: furniture, lighting, flooring, and climate control"),
    ("event-planning-tips",  "How to decorate the inside of a marquee: lighting, draping, and centrepieces"),
    ("event-planning-tips",  "Flooring options for marquees: grass, wooden floor, or carpet?"),
    # -- From rentatentni.com --
    ("event-planning-tips",  "Ground conditions for marquees: what to check before you book"),
    ("event-planning-tips",  "How to plan power and lighting for an outdoor marquee event"),
    ("event-planning-tips",  "Marquee setup time: how early should the marquee go up before your event?"),
    ("event-planning-tips",  "Emergency exits and accessibility in marquee events: what you need to know"),
    # -- From iihf.ie (bouncy castle safety) --
    ("safety-guide",         "Bouncy castle hire safety in Ireland: what to check before you book"),
    ("safety-guide",         "EN14960 safety standard: what it means when hiring inflatables in Ireland"),
    ("safety-guide",         "Supervising a bouncy castle at a birthday party: a parent's guide"),
    # -- From entertainmentsolutions.ie --
    ("event-planning-tips",  "Holy Communion party planning guide: marquees, games, and decorations"),
    ("event-planning-tips",  "Kids birthday party hire ideas: bouncy castles, soft play, and flower walls"),
    ("product-spotlight",    "Flower wall hire: why it's the most photographed item at Irish parties"),
    ("product-spotlight",    "Soft play hire for toddlers: what to expect and how to set it up safely"),
    # -- General Irish event planning --
    ("event-planning-tips",  "Garden party checklist: everything you need to hire for an outdoor celebration"),
    ("event-planning-tips",  "How far in advance should you book a marquee in Ireland?"),
    ("event-planning-tips",  "Outdoor wedding reception checklist: marquee, furniture, linen, and logistics"),
    ("event-planning-tips",  "How to plan a 21st birthday party: hire equipment, themes, and tips"),
    ("event-planning-tips",  "Corporate outdoor events: how to set up a professional marquee function"),
    ("event-planning-tips",  "What to do if it rains at your outdoor event: marquee tips for Irish weather"),
    ("product-spotlight",    "Round tables vs rectangular tables: which works best for your event layout?"),
    ("product-spotlight",    "Table linen hire: how to choose colours and styles for your event"),
    ("product-spotlight",    "Glassware hire for events: how much do you need and what types to order?"),
    ("product-spotlight",    "Marquee flooring hire: wooden dance floors, carpets, and outdoor matting"),
    ("real-event-showcase",  "Real event: a beautiful Confirmation celebration in a Kildare garden"),
    ("real-event-showcase",  "Real event: a 40th birthday garden party in Co. Dublin"),
    ("real-event-showcase",  "Real event: a summer wedding reception in a Wicklow estate garden"),
    ("real-event-showcase",  "Real event: a corporate summer party in Co. Carlow"),
]

# Authoritative outbound link sources per county/topic
OUTBOUND_LINKS = {
    "kildare":   "https://www.visitkildare.ie/",
    "dublin":    "https://www.visitdublin.com/",
    "carlow":    "https://www.carlowtourism.com/",
    "laois":     "https://www.laoistourism.ie/",
    "wicklow":   "https://www.visitwicklow.ie/",
    "kilkenny":  "https://www.visitkilkenny.ie/",
    "tipperary": "https://www.tipperary.com/",
    "waterford": "https://www.visitwaterford.com/",
    "wexford":   "https://www.visitwexford.ie/",
    "meath":     "https://www.meath.ie/tourism",
    "offaly":    "https://www.offaly.ie/",
    "wedding":   "https://www.confetti.ie/",
    "safety":    "https://iihf.ie/",
    "general":   "https://www.ireland.ie/en/",
}


def strapi_get(path):
    r = requests.get(
        f"{STRAPI_URL}{path}",
        headers={"Authorization": f"Bearer {STRAPI_TOKEN}"},
        timeout=20,
    )
    r.raise_for_status()
    return r.json()


def strapi_post(data):
    r = requests.post(
        f"{STRAPI_URL}/api/blog-posts",
        json={"data": data},
        headers={"Authorization": f"Bearer {STRAPI_TOKEN}"},
        timeout=30,
    )
    if not r.ok:
        print("Strapi error response:", r.status_code, r.text[:1000])
    r.raise_for_status()
    return r.json()


def claude(prompt):
    r = requests.post(
        "https://api.anthropic.com/v1/messages",
        json={
            "model": "claude-opus-4-8",
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}],
        },
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        timeout=90,
    )
    r.raise_for_status()
    return r.json()["content"][0]["text"]


# -- Keyword map for Pexels image search -----------------------------------
# Maps category + keywords to the best Pexels search query
PEXELS_QUERIES = {
    "marquee":        "outdoor marquee tent event",
    "wedding":        "outdoor wedding reception marquee",
    "birthday":       "birthday party outdoor celebration",
    "communion":      "holy communion family celebration",
    "confirmation":   "confirmation celebration family",
    "bouncy castle":  "children bouncy castle party",
    "soft play":      "children soft play indoor",
    "flower wall":    "flower wall backdrop event",
    "table":          "elegant event table setting",
    "chair":          "chiavari chairs wedding banquet",
    "linen":          "white tablecloth event table",
    "glassware":      "event glassware champagne flutes",
    "corporate":      "corporate outdoor event tent",
    "garden party":   "garden party outdoor celebration",
    "safety":         "outdoor event safety children",
    "flooring":       "outdoor event flooring marquee",
    "lighting":       "marquee fairy lights event",
    "default":        "outdoor event hire marquee Ireland",
}


def pexels_query_for_post(title: str, category: str) -> str:
    title_lower = title.lower()
    for keyword, query in PEXELS_QUERIES.items():
        if keyword in title_lower:
            return query
    # Fall back by category
    cat_map = {
        "seasonal-local":      "outdoor marquee tent event",
        "event-planning-tips": "outdoor event planning marquee",
        "product-spotlight":   "event hire equipment party",
        "real-event-showcase": "outdoor party celebration garden",
        "safety-guide":        "outdoor event safety children",
    }
    return cat_map.get(category, PEXELS_QUERIES["default"])


def fetch_pexels_image(query: str):
    """Search Pexels and return (image_bytes, filename, photographer_credit)."""
    r = requests.get(
        "https://api.pexels.com/v1/search",
        params={"query": query, "per_page": 5, "orientation": "landscape"},
        headers={"Authorization": PEXELS_API_KEY},
        timeout=15,
    )
    r.raise_for_status()
    photos = r.json().get("photos", [])
    if not photos:
        # fallback query
        r2 = requests.get(
            "https://api.pexels.com/v1/search",
            params={"query": "outdoor event celebration", "per_page": 3, "orientation": "landscape"},
            headers={"Authorization": PEXELS_API_KEY},
            timeout=15,
        )
        r2.raise_for_status()
        photos = r2.json().get("photos", [])

    if not photos:
        return None, None, None

    photo = photos[0]
    img_url = photo["src"]["large2x"]  # 1880px wide, good quality
    photographer = photo.get("photographer", "Pexels")
    photo_id = photo["id"]
    filename = f"blog-cover-{photo_id}.jpg"

    img_bytes = requests.get(img_url, timeout=30).content
    return img_bytes, filename, photographer


def upload_image_to_strapi(img_bytes: bytes, filename: str, alt_text: str) -> int:
    """Upload image bytes to Strapi media library, return media ID."""
    r = requests.post(
        f"{STRAPI_URL}/api/upload",
        headers={"Authorization": f"Bearer {STRAPI_TOKEN}"},
        files={"files": (filename, io.BytesIO(img_bytes), "image/jpeg")},
        data={"fileInfo": json.dumps({"alternativeText": alt_text, "caption": ""})},
        timeout=60,
    )
    r.raise_for_status()
    uploaded = r.json()
    # Strapi returns a list
    if isinstance(uploaded, list):
        return uploaded[0]["id"]
    return uploaded["id"]


def slugify(title):
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s]+", "-", s.strip())
    return s[:80]


def pick_outbound_links(location: str, category: str) -> str:
    links = []
    loc_lower = location.lower()
    for county, url in OUTBOUND_LINKS.items():
        if county in loc_lower:
            links.append(f'{url} (local tourism / county authority for {county.title()})')
            break
    else:
        links.append(f'{OUTBOUND_LINKS["general"]} (Tourism Ireland)')

    if category in ("event-planning-tips", "real-event-showcase"):
        links.append(f'{OUTBOUND_LINKS["wedding"]} (Irish wedding planning resource - confetti.ie)')
    if category == "safety-guide":
        links.append(f'{OUTBOUND_LINKS["safety"]} (Irish Inflatable Hirers Federation - safety standards body)')
    links.append("https://www.grandoccasionrental.ie/products (internal - our products page)")
    return "\n".join(f"  - {l}" for l in links)


def main():
    # -- 1. Fetch recent posts ----------------------------------------------
    recent = strapi_get(
        "/api/blog-posts?sort=createdAt:desc"
        "&pagination[pageSize]=30"
        "&fields[0]=title&fields[1]=slug&fields[2]=category"
    )
    recent_posts = recent.get("data") or []
    recent_titles = [p["attributes"]["title"] for p in recent_posts]
    recent_categories = [p["attributes"].get("category", "") for p in recent_posts[:5]]
    recent_titles_block = "\n".join(f"  - {t}" for t in recent_titles)

    # Filter topic ideas not used recently
    used_titles_lower = " ".join(recent_titles).lower()
    fresh_topics = [
        (cat, idea) for cat, idea in TOPIC_IDEAS
        if not any(kw in used_titles_lower for kw in idea.lower().split()[:3])
        and cat not in recent_categories[:2]
    ] or TOPIC_IDEAS  # fallback to full list if everything used

    # Filter locations not used recently
    fresh_locations = [
        loc for loc in LOCATIONS
        if loc.split(",")[0].lower() not in used_titles_lower
    ] or LOCATIONS

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    outbound_hint = pick_outbound_links(fresh_locations[0], fresh_topics[0][0])

    # -- 2. Generate post ---------------------------------------------------
    prompt = f"""You are an expert SEO content writer for Grand Occasion Rental Limited, an event equipment hire company based in Co. Kildare, Ireland.

Today: {today}

BUSINESS:
- Services: marquee hire, tables, chairs, linen, flower walls, bouncy castles, soft play, Chiavari chairs, glassware
- Phone/WhatsApp: 085 156 3498 | Email: info@grandoccasionrental.ie | Web: https://www.grandoccasionrental.ie
- Delivery: Co. Kildare from EUR20 | Carlow/Laois/Wicklow from EUR40 | Dublin/Kilkenny/Wexford/Tipperary from EUR60 | Waterford/Offaly/Meath from EUR80+
- All marquees: professional setup and takedown included

RECENT POSTS - do NOT repeat these topics or locations:
{recent_titles_block}

RECENT CATEGORIES USED - vary from these:
{recent_categories}

YOUR TASK:
Pick ONE combination from the following lists that is NOT covered in recent posts:

LOCATION OPTIONS (pick one):
{chr(10).join(f"  - {loc}" for loc in fresh_locations[:15])}

TOPIC OPTIONS (pick one - these are researched from competitor blogs in Ireland):
{chr(10).join(f"  - [{cat}] {idea}" for cat, idea in fresh_topics[:20])}

WRITING RULES:
1. 750-1000 words, rich and useful - not thin filler content
2. Use Irish spelling and context (e.g. "colour", "organisation", "Co. Kildare", GAA, communions, etc.)
3. For seasonal-local posts: weave the location naturally throughout - mention local landmarks, roads, venues, or community events where they add credibility
4. For event-planning-tips: give specific, actionable advice based on real Irish event hire challenges (rain, soft ground, access on Irish country lanes, etc.)
5. For safety-guide posts: reference the EN14960 standard and IIHF (Irish Inflatable Hirers Federation) where relevant
6. For real-event-showcase: make it feel authentic - give the family a plausible Irish name, a real-sounding local venue, believable guest count

SEO REQUIREMENTS:
- Primary keyword: include it in the title and naturally 4-6 times in the body
- H2 section headings (3-5 of them), H3 sub-headings where useful
- Excerpt: under 160 chars, includes the primary keyword
- DO NOT put the H1/title inside the content field

OUTBOUND LINKS (include 2-3 of these in the article body - use natural anchor text):
{outbound_hint}
Format: <a href="URL" target="_blank" rel="noopener">anchor text</a>

INTERNAL LINK: Link naturally to one of these once in the article:
  - https://www.grandoccasionrental.ie/products
  - https://www.grandoccasionrental.ie/faq
  - https://www.grandoccasionrental.ie/delivery-policy
  - https://www.grandoccasionrental.ie/contact

CTA: End with a paragraph inviting readers to call 085 156 3498 or email info@grandoccasionrental.ie

OUTPUT - return ONLY valid JSON, no markdown fences, no commentary outside the JSON:
{{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...full HTML...",
  "category": "seasonal-local|event-planning-tips|product-spotlight|real-event-showcase|safety-guide",
  "read_time": "X min read"
}}"""

    raw = claude(prompt)
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)

    post_data = json.loads(raw.strip())

    if not post_data.get("slug"):
        post_data["slug"] = slugify(post_data["title"])
    # Append date to guarantee slug uniqueness across daily runs
    post_data["slug"] = f"{slugify(post_data['slug'])}-{today}"

    # Strapi only accepts these 4 category values - remap any extras
    VALID_CATEGORIES = {"event-planning-tips", "product-spotlight", "real-event-showcase", "seasonal-local"}
    if post_data.get("category") not in VALID_CATEGORIES:
        post_data["category"] = "event-planning-tips"

    post_data["author"] = "Grand Occasion Rentals"
    post_data["publishedAt"] = f"{today}T09:00:00.000Z"

    # -- 3. Fetch and upload cover image ------------------------------------
    title = post_data.get("title", "")
    category = post_data.get("category", "")
    query = pexels_query_for_post(title, category)
    print(f"Searching Pexels: {query}")

    img_bytes, filename, photographer = fetch_pexels_image(query)
    if img_bytes:
        alt_text = f"{title} - Grand Occasion Rental"
        media_id = upload_image_to_strapi(img_bytes, filename, alt_text)
        post_data["cover_image"] = {"id": media_id}
        print(f"Uploaded cover image #{media_id} (photo by {photographer} via Pexels)")
    else:
        print("Warning: no Pexels image found, posting without cover image")

    # -- 4. Publish ---------------------------------------------------------
    result = strapi_post(post_data)
    new_id = result["data"]["id"]
    new_title = result["data"]["attributes"]["title"]
    print(f"Published post #{new_id}: {new_title}")
    print(f"Slug: {result['data']['attributes']['slug']}")
    print(f"Category: {result['data']['attributes'].get('category')}")


if __name__ == "__main__":
    main()
