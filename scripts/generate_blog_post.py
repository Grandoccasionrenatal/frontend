#!/usr/bin/env python3
"""
Daily blog post generator for grandoccasionrental.ie
Calls Claude API to write SEO-optimised content then publishes to Strapi.
"""
import os, json, sys, re
from datetime import datetime, timezone
import urllib.request, urllib.error

STRAPI_URL = os.environ["STRAPI_URL"]
STRAPI_TOKEN = os.environ["STRAPI_TOKEN"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]

# ── Location pool (within ~90 min of Co. Kildare) ──────────────────────────
LOCATIONS = [
    # Kildare
    "Naas, Co. Kildare", "Newbridge, Co. Kildare", "Athy, Co. Kildare",
    "Kildare town", "Maynooth, Co. Kildare", "Celbridge, Co. Kildare",
    "Kilcock, Co. Kildare", "Clane, Co. Kildare", "Monasterevin, Co. Kildare",
    "Kilcullen, Co. Kildare", "Castledermot, Co. Kildare", "Sallins, Co. Kildare",
    # Dublin
    "Dublin city", "Tallaght, Dublin", "Lucan, Dublin", "Clondalkin, Dublin",
    "Blanchardstown, Dublin", "Swords, Dublin", "Rathfarnham, Dublin",
    "Dundrum, Dublin", "Terenure, Dublin", "Dún Laoghaire, Dublin",
    # Carlow
    "Carlow town", "Tullow, Co. Carlow", "Muinebheag, Co. Carlow",
    "Graiguecullen, Co. Carlow",
    # Laois
    "Portlaoise, Co. Laois", "Abbeyleix, Co. Laois", "Mountrath, Co. Laois",
    "Portarlington, Co. Laois", "Mountmellick, Co. Laois", "Rathdowney, Co. Laois",
    "Durrow, Co. Laois",
    # Wicklow
    "Blessington, Co. Wicklow", "Arklow, Co. Wicklow", "Greystones, Co. Wicklow",
    "Baltinglass, Co. Wicklow", "Wicklow town",
    # Kilkenny
    "Kilkenny city", "Castlecomer, Co. Kilkenny", "Thomastown, Co. Kilkenny",
    "Callan, Co. Kilkenny", "Graiguenamanagh, Co. Kilkenny",
    # Tipperary
    "Thurles, Co. Tipperary", "Templemore, Co. Tipperary", "Roscrea, Co. Tipperary",
    "Clonmel, Co. Tipperary", "Nenagh, Co. Tipperary",
    # Waterford
    "Waterford city", "Carrick-on-Suir, Co. Tipperary",
    # Offaly / Meath
    "Tullamore, Co. Offaly", "Edenderry, Co. Offaly",
    "Trim, Co. Meath", "Navan, Co. Meath",
]

CATEGORIES = [
    "seasonal-local",
    "event-planning-tips",
    "product-spotlight",
    "real-event-showcase",
]


def strapi_get(path):
    req = urllib.request.Request(
        f"{STRAPI_URL}{path}",
        headers={"Authorization": f"Bearer {STRAPI_TOKEN}"},
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def strapi_post(data):
    body = json.dumps({"data": data}).encode()
    req = urllib.request.Request(
        f"{STRAPI_URL}/api/blog-posts",
        data=body,
        headers={
            "Authorization": f"Bearer {STRAPI_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def claude(prompt):
    body = json.dumps({
        "model": "claude-opus-4-8",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        resp = json.loads(r.read())
    return resp["content"][0]["text"]


def slugify(title):
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s]+", "-", s.strip())
    return s[:80]


def main():
    # ── 1. Fetch recent posts to avoid repetition ──
    recent = strapi_get(
        "/api/blog-posts?sort=createdAt:desc"
        "&pagination[pageSize]=20"
        "&fields[0]=title&fields[1]=slug&fields[2]=category"
    )
    recent_posts = recent.get("data") or []
    recent_titles = [p["attributes"]["title"] for p in recent_posts]
    recent_categories = [p["attributes"].get("category", "") for p in recent_posts[:4]]
    used_locations = " | ".join(recent_titles[-14:])  # last 14 post titles

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # ── 2. Ask Claude to pick topic & write post ──
    prompt = f"""You are an expert SEO content writer for Grand Occasion Rental Limited, an event equipment hire company based in Co. Kildare, Ireland.

Today's date: {today}

BUSINESS DETAILS:
- Services: marquee hire, tables, chairs, linen, flower walls, bouncy castles, soft play, Chiavari chairs, glassware
- Phone/WhatsApp: 085 156 3498
- Email: info@grandoccasionrental.ie
- Website: https://www.grandoccasionrental.ie
- Delivery zones: Co. Kildare from €20 | Carlow/Laois/Wicklow from €40 | Dublin/Kilkenny/Wexford/Tipperary from €60 | Waterford/Offaly/Meath/Westmeath from €80+
- All marquees include professional setup and takedown by our team

RECENT POSTS (do NOT repeat these topics):
{chr(10).join(f"- {t}" for t in recent_titles)}

RECENT CATEGORIES USED (avoid repeating for variety):
{recent_categories}

AVAILABLE LOCATIONS POOL:
{chr(10).join(f"- {loc}" for loc in LOCATIONS)}

CATEGORIES:
- seasonal-local: target a specific town/area (e.g. "Marquee Hire in Naas")
- event-planning-tips: practical party planning advice
- product-spotlight: focus on one hire item
- real-event-showcase: fictional-but-realistic customer success story in a local area

YOUR TASK:
1. Choose ONE location from the pool NOT covered in recent posts
2. Choose ONE category for variety
3. Write a complete, SEO-optimised blog post (700-950 words)

SEO & BACKLINK REQUIREMENTS (very important):
- Target ONE primary keyword phrase (e.g. "marquee hire in Naas") and use it naturally 4-6 times
- Include 2-4 OUTBOUND links to real, authoritative local resources that will help build topical authority and encourage reciprocal links. Examples:
    * Local county council tourism page (e.g. kildare.ie, kilkenny.ie, carlow.ie, laois.ie, waterford.ie, tipperary.ie, wicklow.ie)
    * Local GAA club or community venue relevant to events
    * Ireland's national tourism board: https://www.ireland.ie/en/
    * Irish wedding planning resource: https://www.confetti.ie/
    * Outdoor events Ireland resource: https://www.discoveireland.ie/ (adjust URL pattern)
    * CCPC consumer rights (relevant for policy posts): https://www.ccpc.ie/
  Format outbound links as: <a href="URL" target="_blank" rel="noopener">anchor text</a>
- Add ONE internal link to a relevant page on https://www.grandoccasionrental.ie (e.g. /products, /faq, /delivery-policy, /contact)
- Use a clear H1 equivalent in the title (do not put H1 in content), H2 section headings, and H3 sub-headings where appropriate
- Include a meta-description-quality excerpt (under 160 chars, includes primary keyword)
- End with a strong CTA paragraph including phone number and email

CONTENT FORMAT — return ONLY valid JSON (no markdown, no commentary):
{{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "...full HTML using h2/h3/p/ul/li/a tags, no inline styles...",
  "category": "...",
  "read_time": "X min read"
}}"""

    raw = claude(prompt)

    # Strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)

    post_data = json.loads(raw.strip())

    # Ensure slug is safe
    if not post_data.get("slug"):
        post_data["slug"] = slugify(post_data["title"])

    post_data["author"] = "Grand Occasion Rentals"
    post_data["publishedAt"] = f"{today}T09:00:00.000Z"

    # ── 3. Publish to Strapi ──
    result = strapi_post(post_data)
    new_id = result["data"]["id"]
    new_title = result["data"]["attributes"]["title"]
    print(f"✅ Published post #{new_id}: {new_title}")
    print(f"   Slug: {result['data']['attributes']['slug']}")
    print(f"   Category: {result['data']['attributes'].get('category')}")


if __name__ == "__main__":
    main()
