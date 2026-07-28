# MeridianAlgo Newsletters

Every issue we've published, plus the metadata that describes it. This repo is
the source of truth — [meridianalgo.org/newsletters](https://meridianalgo.org/newsletters)
reads `manifest.json` from here at page load, so **publishing an issue means
pushing to this repo**. No website deploy needed.

```
manifest.json      index of every issue + series metadata
issues/            the PDFs
thumbnails/        one cover image per series
validate.mjs       checks the manifest against what's on disk
```

## Publishing a new issue

1. Drop the PDF in `issues/` named `<series>-week-<NN>.pdf`
   (e.g. `smart-cents-weekly-week-19.pdf` — zero-padded, lowercase, no spaces).
2. Add an entry to the top of the `newsletters` array in `manifest.json`.
3. `node validate.mjs`
4. Commit and push to `main`.

The site picks it up within ~5 minutes (raw.githubusercontent CDN cache).

## Manifest format

Top level:

| Field | Meaning |
|---|---|
| `version` | Manifest schema version. Bump only on a breaking change. |
| `updated` | `YYYY-MM-DD` of the last edit. |
| `readBase` | jsDelivr base URL. Serves `application/pdf`, so PDFs render inline in the browser. |
| `downloadBase` | raw.githubusercontent base URL. Forces a file download. |
| `series` | One entry per publication (`id`, `name`, `description`, `thumbnail`). |
| `newsletters` | The issues, newest first. |

Each issue:

```json
{
  "id": "smart-cents-weekly-week-19",
  "title": "Smart Cents Weekly — Week 19",
  "description": "One sentence on what this issue covers.",
  "series": "smart-cents-weekly",
  "seriesName": "Smart Cents Weekly",
  "week": 19,
  "category": "Budgeting",
  "publishedDate": "2024-03-27",
  "file": "issues/smart-cents-weekly-week-19.pdf",
  "thumbnail": "thumbnails/smart-cents-weekly.png"
}
```

`id` must be unique and `file` must exist — `validate.mjs` enforces both.
`category` is free text; the site turns the distinct values into filter chips.

Two optional fields are written by the bot (see below) and safe to add by hand:

| Field | Meaning |
|---|---|
| `topics` | Array of short tags for what the issue covered. This is what stops the bot writing the same issue twice — the more accurate it is, the better the next issue. |
| `headline` | The issue's own headline, as distinct from `title` (which is always `<Series> — Week N`). |

## Automated issues

[MeridianAlgo/newsletter-bot](https://github.com/MeridianAlgo/newsletter-bot)
writes Smart Cents Weekly on a schedule and pushes here. It reads this manifest
first and passes the recent issues' titles, descriptions and `topics` to the
model as a don't-repeat list, so **this file is the bot's memory** — there is no
other database. It validates the manifest against disk before committing, the
same checks `validate.mjs` runs.

Hand-written issues and bot issues are the same shape; you can add, edit or
delete either without telling the bot. It picks up the next week number from the
highest `week` already present in the series.


## Consuming this feed

The manifest is public and CORS-enabled — anything can read it:

```js
const res = await fetch('https://raw.githubusercontent.com/MeridianAlgo/newsletters/main/manifest.json');
const { readBase, newsletters } = await res.json();
const latest = newsletters[0];
console.log(latest.title, readBase + latest.file);
```

## License

Newsletter content © MeridianAlgo. Free to read and share with attribution.
