# Tech & Accountancy Talent Career Fair 2026

Searchable companion site for the e2i job listing booklet: 106 roles across 10 employers, plus career-centre details.

Live site: [https://azmiratania.github.io/job-fair/](https://azmiratania.github.io/job-fair/)

## Run locally

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
cd website
npm run build
npm run preview
```

`npm run build` writes static files to `website/dist/`.

## GitHub Pages

The site is a Vite static build. After you push this repo to GitHub:

1. **Settings → Pages** → Source: **GitHub Actions**
2. Push to `main` (or run the **Deploy to GitHub Pages** workflow)

The workflow publishes `website/dist/`. For this project repo the site is at `https://azmiratania.github.io/job-fair/`.

## Update listings

Job and employer data lives in `website/src/data/fair.json`. To regenerate it from the booklet text dump:

```bash
python scripts/parse_jobs.py
```
