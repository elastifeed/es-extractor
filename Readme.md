[![Docker Repository on Quay](https://quay.io/repository/elastifeed/es-extractor/status "Docker Repository on Quay")](https://quay.io/repository/elastifeed/es-extractor)
# es-extractor

Provides an REST API to [the mercury webparser](https://github.com/postlight/mercury-parser). Able to retrieve content from web pages and return in them in JSON.

## Endpoints
Both endpoints return a JSON object with the following fiels.
```json
{
  "title": "Thunder (mascot)",
  "raw_content": "... Thunder is the stage name for the...",
  "markdown_content": "![ThunderII.jpg](https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/ThunderII.jpg/220px-ThunderII.jpg)\n\nThunder\n\n[](https://en.wikipedia.org/wiki/File:ThunderII.jpg)\n\nThunder II and Ann Judge\n\nBreed[Arabian horse](https://en.wikipedia.org/wiki/Arabian_horse)Discipline...",
  "author": "Wikipedia Contributors",
  "date_published": "2016-09-16T20:56:00.000Z",
  "lead_image_url": null,
  "dek": null,
  "next_page_url": null,
  "url": "https://en.wikipedia.org/wiki/Thunder_(mascot)",
  "domain": "en.wikipedia.org",
  "excerpt": "Thunder Thunder is the stage name for the horse who is the official live animal mascot for the Denver Broncos",
  "word_count": 4677,
  "direction": "ltr",
  "total_pages": 1,
  "rendered_pages": 1
}
```

#### `/mercury/url`
Takes a request JSON object with a single `url` field. Downloades the page, retrieves raw and markdown content and returns.

#### `/mercury/html`
Takes a request JSON object with an `url` and a `html` field. The `html` field must contain the properly escaped html content of the url web page. This is done to prevent loading a page twice. Retrieves raw and markdown content and returns.
