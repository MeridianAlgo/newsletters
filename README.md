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
