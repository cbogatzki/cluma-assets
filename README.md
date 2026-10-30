# cluma-assets

Public static assets for cluma.design, served via jsDelivr.

- `tools/` inline blog tools (self-contained JS, no external deps)
- `case-studies/` the Our Work case study popup: one script tag (`cs.js`) loads `cs.css`, injects the dialog and opens it for any element with `data-open-case="<id>"`. Pin a tag (`cs-v*`) in the Webflow page footer.
