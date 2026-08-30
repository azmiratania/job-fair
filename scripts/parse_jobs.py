"""Parse the e2i job listing booklet text into structured JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = (ROOT / "_raw.txt").read_text(encoding="utf-8")

LOCATION_RE = re.compile(
    r"^(city hall|shenton way|telok ayer|potong pasir|jurong east|rochor|"
    r"raffles place|tanjong pagar|paya lebar|one-?north|buona vista|"
    r"harbourfront|alexandra|orchard|novena|bugis|chinatown|outram|"
    r"anson road|robinson road|cecil street|marina boulevard|"
    r"mapletree|fusionopolis|science park|changi|tuas|woodlands|"
    r"ang mo kio|toa payoh|macpherson|ubi|kallang|lavender|"
    r"yio chu kang|fort canning|pasir panjang|keppel|labrador|"
    r"client site|hybrid|islandwide)$",
    re.I,
)

HOURS_RE = re.compile(
    r"(office hours|9 to 6|9\s*[-–]\s*6|8\.30|9\.00|9:00|8:30|"
    r"monday to friday|mon(?:day)? to fri|shift based|rotating shift|"
    r"5[- ]day|flexible)",
    re.I,
)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"&", " and ", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def pretty_company(name: str) -> str:
    special = {
        "e2i": "e2i",
        "e2i services": "e2i Services",
        "ncs group": "NCS Group",
        "rsm singapore": "RSM Singapore",
        "kbx resources": "KBX Resources",
        "lit strategy": "LiT Strategy",
        "forvis mazars": "Forvis Mazars",
        "apar technologies": "Apar Technologies",
        "red alpha cybersecurity": "Red Alpha Cybersecurity",
        "tangspac consulting": "Tangspac Consulting",
        "accenture": "Accenture",
    }
    return special.get(name.strip().lower(), name.title())


def tidy(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = text.replace("prioject", "project")
    text = text.replace("excutive", "executive")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    return text.strip(" \n\t")


def is_header_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    low = s.lower()
    if low in {
        "job listing booklet",
        "www.e2i.com.sg",
        "job positions pre-requisites",
        "working hours /",
        "working hours / location",
        "location",
        "job positions pre-requisites working hours /",
    }:
        return True
    if re.fullmatch(r"={5,} PAGE \d+ ={5,}", s):
        return True
    if re.fullmatch(r"\d{1,3}", s):
        return True
    return False


def strip_headers(text: str) -> str:
    return "\n".join(ln for ln in text.splitlines() if not is_header_line(ln))


def parse_toc(raw: str) -> list[dict]:
    m = re.search(r"===== PAGE 6 =====", raw)
    toc = raw[: m.start()] if m else raw[:12000]
    companies: list[dict] = []
    current = None
    for line in toc.splitlines():
        s = line.strip()
        cm = re.match(r"#(\d+)\s+(.+?)(?:\s*\.{2,}.*|\s{2,}\d+\s*)?$", s)
        if cm and re.match(r"#\d+", s):
            name = re.sub(r"\.{2,}.*", "", cm.group(2))
            name = re.sub(r"\s+\d+\s*$", "", name)
            name = re.sub(r"\s+", " ", name).strip(" .")
            if not name or name.lower().startswith("content"):
                continue
            current = {
                "id": slugify(name),
                "number": int(cm.group(1)),
                "name": pretty_company(name),
                "jobs": [],
            }
            companies.append(current)
            continue
        jm = re.match(r"•\s*(\d+)\.\s+(.+)", s)
        if jm and current is not None:
            title = re.sub(r"\.{2,}.*$", "", jm.group(2))
            title = re.sub(r"\s+\d+\s*$", "", title)
            title = re.sub(r"\s+", " ", title).strip(" .")
            current["jobs"].append({"number": int(jm.group(1)), "title": title})
    return companies


def split_company_bodies(raw: str) -> dict[int, str]:
    m = re.search(r"===== PAGE 6 =====", raw)
    body = raw[m.start() :] if m else raw
    parts = re.split(r"\n(?=#\d+\s+[A-Za-z])", body)
    out: dict[int, str] = {}
    for part in parts:
        hm = re.match(r"#(\d+)\s+([^\n]+)", part.strip())
        if not hm:
            continue
        out[int(hm.group(1))] = part.strip()
    return out


def extract_about(company_body: str) -> str:
    text = re.sub(r"^#\d+\s+[^\n]+\n", "", company_body, count=1)
    m = re.search(r"(?:^|\n)\s*1\.\s+", text)
    about = text[: m.start()] if m else text
    about = strip_headers(about)
    about = tidy(about)
    about = re.sub(r"\n+", " ", about)
    about = re.sub(r"\s{2,}", " ", about)
    about = re.sub(r"\[\s*", "", about)
    about = re.sub(r"\s*\]", ".", about)
    return about.strip(" .")


def job_spans(company_body: str, jobs: list[dict]) -> list[tuple[dict, str]]:
    matches = list(re.finditer(r"(?:^|\n)\s*(\d+)\.\s+", company_body))
    by_num: dict[int, list[int]] = {}
    for m in matches:
        by_num.setdefault(int(m.group(1)), []).append(m.start())

    spans = []
    used: set[int] = set()
    for i, job in enumerate(jobs):
        n = job["number"]
        starts = [s for s in by_num.get(n, []) if s not in used]
        if not starts:
            spans.append((job, ""))
            continue
        start = starts[0]
        used.add(start)
        end = len(company_body)
        if i + 1 < len(jobs):
            nxt = jobs[i + 1]["number"]
            later = [s for s in by_num.get(nxt, []) if s > start]
            if later:
                end = later[0]
        spans.append((job, company_body[start:end]))
    return spans


def pull_meta(lines: list[str]) -> tuple[list[str], str, str, str]:
    hours: list[str] = []
    location: list[str] = []
    eligibility: list[str] = []
    kept: list[str] = []
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.strip(" •\t")
        low = line.lower().strip()
        if not line:
            i += 1
            continue

        if LOCATION_RE.match(low) or (len(line) < 42 and LOCATION_RE.search(low)):
            location.append(tidy(line))
            i += 1
            continue

        if low in {"sc + pr", "sc/pr", "sc & pr"} or (
            len(line) < 48 and any(x in low for x in ["singaporean", "permanent resident", "sc + pr"])
        ):
            eligibility.append(tidy(line))
            i += 1
            continue

        if re.fullmatch(r"\d{2}\s*[-–]\s*\d{2}", line):
            hours.append(f"{re.sub(r'\s+', '', line)} hrs/week")
            i += 1
            continue

        if HOURS_RE.search(line) and len(line) < 90:
            chunk = tidy(line)
            look = i + 1
            while look < len(lines):
                nxt = lines[look].strip(" •\t")
                nlow = nxt.lower()
                if not nxt:
                    look += 1
                    continue
                if nlow in {"depending on", "depending on project", "project", "prioject"} or nlow.startswith(
                    "depending on"
                ):
                    chunk = (chunk + " " + tidy(nxt)).replace("prioject", "project")
                    look += 1
                    continue
                break
            hours.append(chunk)
            i = look
            continue

        if low in {"depending on", "project"} and hours:
            hours[-1] = (hours[-1] + " " + tidy(line)).strip()
            i += 1
            continue

        kept.append(raw)
        i += 1

    def uniq(items: list[str]) -> str:
        out = []
        for item in items:
            item = re.sub(r"\s+", " ", item).strip(" •")
            if item and item.lower() not in {x.lower() for x in out}:
                out.append(item)
        return " / ".join(out)

    hours_s = uniq(hours)
    hours_s = hours_s.replace("depending on project", "depending on project")
    if hours_s.endswith("depending on"):
        hours_s += " project"
    return kept, uniq(hours), uniq(location), uniq(eligibility)


LABELS = {
    "job description:": "desc",
    "job description": "desc",
    "job requirement:": "req",
    "job requirement": "req",
    "job requirements:": "req",
    "requirements": "req",
    "requirement:": "req",
    "qualifications:": "req",
    "qualifications": "req",
    "responsibilities": "desc",
    "responsibilities:": "desc",
    "what you'll do": "desc",
    "what you will do": "desc",
    "what you'll bring": "req",
    "what you will bring": "req",
    "about the role": "desc",
    "the role:": "desc",
    "key responsibilities:": "desc",
    "key responsibilities": "desc",
}


def parse_job_text(span: str, title: str) -> tuple[list[str], list[str], str, str, str]:
    text = strip_headers(span)
    text = re.sub(r"^\s*\d+\.\s+", "", text.strip(), count=1)
    lines = text.splitlines()

    # Drop title words that the PDF wrapped onto following lines
    title_tokens = [t.lower() for t in re.findall(r"[A-Za-z0-9+./&-]+", title)]
    consumed = 0
    seen = 0
    for line in lines:
        line_tokens = re.findall(r"[A-Za-z0-9+./&-]+", line.lower())
        if not line_tokens:
            consumed += 1
            continue
        take = len(line_tokens)
        if seen < len(title_tokens) and title_tokens[seen : seen + take] == line_tokens:
            consumed += 1
            seen += take
            continue
        compact_title = "".join(title_tokens[seen:])
        compact_line = "".join(line_tokens)
        if compact_title and compact_line and compact_title.startswith(compact_line[: min(12, len(compact_line))]):
            consumed += 1
            seen = min(len(title_tokens), seen + take)
            continue
        break
    lines = lines[consumed:]

    lines, hours, location, eligibility = pull_meta(lines)

    desc_lines: list[str] = []
    req_lines: list[str] = []
    mode = "desc"
    for raw in lines:
        low = raw.strip().lower().strip(":")
        key = raw.strip().lower()
        if key in LABELS:
            mode = LABELS[key]
            continue
        if low in LABELS:
            mode = LABELS[low]
            continue
        if mode == "req":
            req_lines.append(raw)
        else:
            desc_lines.append(raw)

    return to_bullets(desc_lines), to_bullets(req_lines), hours, location, eligibility


def to_bullets(lines: list[str]) -> list[str]:
    if not lines:
        return []
    text = "\n".join(lines)
    text = tidy(text)
    # Split on bullet characters, keeping paragraph flow
    chunks = re.split(r"(?:\n\s*[•●▪]\s*|\s+[•●▪]\s+)", text)
    items: list[str] = []
    for chunk in chunks:
        chunk = re.sub(r"\n+", " ", chunk)
        chunk = re.sub(r"\s{2,}", " ", chunk).strip(" •-")
        if not chunk:
            continue
        # Split glued section headers
        chunk = re.sub(r"(?<=[a-z])(?=[A-Z][a-z]+ [A-Z])", ". ", chunk)
        if len(chunk) > 420:
            # Prefer sentence splits for very long blobs
            sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z•])", chunk)
            buf = ""
            for sent in sentences:
                if not buf:
                    buf = sent
                elif len(buf) + len(sent) < 280:
                    buf += " " + sent
                else:
                    items.append(buf.strip())
                    buf = sent
            if buf:
                items.append(buf.strip())
        else:
            items.append(chunk)

    merged: list[str] = []
    for item in items:
        item = item.replace("prioject", "project")
        item = re.sub(r"\s+", " ", item).strip()
        if not item or len(item) < 3:
            continue
        if merged and (item[0].islower() or len(item) < 24) and not item.endswith(":"):
            merged[-1] = (merged[-1].rstrip(" .") + " " + item).strip()
        else:
            merged.append(item)
    # Drop leftover table crumbs
    skip = {"job positions pre-requisites", "working hours / location"}
    return [i for i in merged if i.lower() not in skip]


def classify(title: str, blob: str) -> str:
    rules = [
        ("AI & Data", ["ai ", "artificial intelligence", "machine learning", "agentic", "agentops", "generative ai", "data management", "data scientist", "forward deployed ai"]),
        ("Cybersecurity", ["cyber", "security", "vapt", "penetration", "data protection", "iam "]),
        ("Cloud & Infrastructure", ["cloud", "infra", "network", "oracle dba", "linux", "desktop", "workplace support", "systems engineer", "devops", "end user support"]),
        ("Software Engineering", ["engineer", "developer", "full stack", "fullstack", "software", "java", ".net", "servicenow"]),
        ("Audit & Tax", ["audit", "tax", "gst", "assurance"]),
        ("Finance & Accounting", ["accountant", "finance", "accounting", "procurement", "corporate finance"]),
        ("Legal & Compliance", ["counsel", "legal", "compliance", "regulatory", "governance", "risk consulting", "policy"]),
        ("Graduate / Early Career", ["graduate analyst", "talent advancement", "junior "]),
        ("Project & Delivery", ["project manager", "programme", "program/", "service delivery", "project management"]),
        ("Business Analysis", ["business analyst", "business system", "functional business", "health tech analyst"]),
        ("Sales & Customer", ["sales", "customer success", "customer service", "business development", "market advisor", "events manager"]),
        ("Operations & Admin", ["operations", "admin", "coordinator", "kyc", "backoffice", "knowledge management", "corporate secretarial", "grant process"]),
    ]

    def match(text: str) -> str | None:
        t = f" {text.lower()} "
        for label, keys in rules:
            if any(k in t for k in keys):
                return label
        return None

    return match(title) or match(f"{title} {blob}") or "General"


def seniority(title: str, req: str) -> str:
    t = f"{title} {req}".lower()
    if any(k in t for k in ["associate director", "deputy director"]):
        return "Director"
    if "graduate" in t or "junior" in t or "no experience is required" in t:
        return "Entry"
    if "assistant director" in t or "senior manager" in t:
        return "Senior"
    if re.search(r"\blead\b", title.lower()) or "manager" in title.lower():
        return "Manager / Lead"
    if "senior" in title.lower():
        return "Senior"
    return "Professional"


EXTRAS = {
    "accenture": {
        "website": "https://www.accenture.com/sg-en",
        "tagline": "Global professional services. Technology, data, and human ingenuity.",
        "sector": "Professional Services",
    },
    "apar-technologies": {
        "website": "https://www.apartechnologies.com",
        "tagline": "Global consulting and technology services.",
        "sector": "Technology Services",
    },
    "forvis-mazars": {
        "website": "https://www.forvismazars.com/sg",
        "tagline": "Audit, tax and advisory across 100+ countries.",
        "sector": "Accountancy",
    },
    "kbx-resources": {
        "website": "",
        "tagline": "Cybersecurity, data protection and business development roles.",
        "sector": "Cybersecurity",
    },
    "lit-strategy": {
        "website": "",
        "tagline": "Singapore consulting firm for SME strategy, AI and transformation.",
        "sector": "Consulting",
    },
    "ncs-group": {
        "website": "https://www.ncs.co",
        "tagline": "AI tech services across Asia Pacific. A Singtel company.",
        "sector": "Technology Services",
    },
    "red-alpha-cybersecurity": {
        "website": "https://www.redalpha.sg",
        "tagline": "Cybersecurity, cloud, AI and systems engineering.",
        "sector": "Cybersecurity",
    },
    "rsm-singapore": {
        "website": "https://www.rsm.global/singapore",
        "tagline": "Largest professional services firm outside the Big Four in Singapore.",
        "sector": "Professional Services",
    },
    "tangspac-consulting": {
        "website": "https://www.tangspac.com",
        "tagline": "Talent and technology consulting across operations and IT.",
        "sector": "Consulting",
    },
    "e2i": {
        "website": "https://www.e2i.com.sg",
        "tagline": "NTUC's Employment and Employability Institute.",
        "sector": "Public / Social",
    },
    "e2i-services": {
        "website": "https://www.e2i.com.sg",
        "tagline": "Career coaching, job matching and SkillsFuture advice.",
        "sector": "Career Services",
        "about": "Walk-in or book a career coach for job matching and SkillsFuture advice. e2i career centres at Jurong East, Marina Boulevard, and Our Tampines Hub can help you prepare for interviews at this fair and beyond.",
    },
}


def parse() -> dict:
    companies_toc = parse_toc(RAW)
    bodies = split_company_bodies(RAW)
    companies_out = []
    jobs_out = []

    for co in companies_toc:
        body = bodies.get(co["number"], "")
        extra = EXTRAS.get(co["id"], {"website": "", "tagline": "", "sector": "General"})
        companies_out.append(
            {
                "id": co["id"],
                "number": co["number"],
                "name": co["name"],
                "about": extract_about(body) if body else "",
                **extra,
                "jobCount": len(co["jobs"]),
            }
        )
        if co["id"] == "e2i-services":
            continue
        for job, span in job_spans(body, co["jobs"]):
            desc, req, hours, location, eligibility = parse_job_text(span, job["title"])
            jobs_out.append(
                {
                    "id": f"{co['id']}-{job['number']}",
                    "companyId": co["id"],
                    "company": co["name"],
                    "number": job["number"],
                    "title": job["title"],
                    "hours": hours,
                    "location": location,
                    "eligibility": eligibility,
                    "category": classify(job["title"], " ".join(desc[:4])),
                    "seniority": seniority(job["title"], " ".join(req[:5])),
                    "description": desc,
                    "requirements": req,
                }
            )

    return {
        "event": {
            "name": "Tech & Accountancy Talent Career Fair 2026",
            "organizer": "e2i (Employment and Employability Institute)",
            "date": "1 September 2026",
            "dateIso": "2026-09-01",
            "day": "Tuesday",
            "venue": "The Exchange, Singapore Land Tower",
            "address": "50 Raffles Place, Level 4, Singapore 048623",
            "website": "https://www.e2i.com.sg",
            "about": "e2i is the empowering network for workers and employers seeking employment and employability solutions. e2i serves as a bridge between workers and employers, connecting with workers to offer job security through job-matching, career guidance and skills upgrading services, and partnering employers to address their manpower needs through recruitment, training and job redesign solutions. e2i is a tripartite initiative of the National Trades Union Congress.",
        },
        "centres": [
            {
                "name": "e2i Career Centre (DNI)",
                "address": "Devan Nair Institute for Employment and Employability, 80 Jurong East St 21, Level 2, Singapore 609607",
                "mrt": "Jurong East",
            },
            {
                "name": "e2i Career Centre (OMB)",
                "address": "1 Marina Boulevard, #B1-03, Singapore 018989",
                "mrt": "Raffles Place / Downtown",
            },
            {
                "name": "e2i Career Centre (OTH)",
                "address": "ServiceSG Centre Our Tampines Hub, 1 Tampines Walk, #01-21, Singapore 528523",
                "mrt": "Tampines",
            },
        ],
        "hoursNote": "Career centres: Mondays 2:30pm–5:00pm; Tuesdays–Fridays 9:00am–5:00pm; Saturdays 9:00am–1:00pm.",
        "companies": companies_out,
        "jobs": jobs_out,
    }


def main() -> None:
    data = parse()
    out_dir = ROOT / "website" / "src" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "fair.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"companies {len(data['companies'])}")
    print(f"jobs {len(data['jobs'])}")
    for c in data["companies"]:
        n = sum(1 for j in data["jobs"] if j["companyId"] == c["id"])
        print(f"  {c['number']:02d} {c['name']}: toc={c['jobCount']} parsed={n} about={len(c['about'])}")
    empty_desc = [j["id"] for j in data["jobs"] if not j["description"]]
    empty_loc = [j["id"] for j in data["jobs"] if not j["location"]]
    print("empty desc", empty_desc)
    print("empty loc", len(empty_loc), empty_loc[:12])
    print("sample hours", {j["id"]: j["hours"] for j in data["jobs"][:5]})
    print("sample desc0", data["jobs"][0]["description"][:3])
    print("sample req0", data["jobs"][0]["requirements"][:3])


if __name__ == "__main__":
    main()
