---
type: "Components"
category: "Extensions"
parent: "Breadcrumbs"
title: "Breadcrumbs"
description: "Dynamic breadcrumbs that looks awesome in all responsive breakpoints."
---

## Setup

To use this component import the **less** files accordingly:

```less
@import 'xtend-library/src/extensions/breadcrumbs/breadcrumbs.less';
```

Or just import **core**:

```less
@import 'xtend-library/src/xtend-core.less';
```

[[noteDefault]]
| To modify a **less** or **js** file add [webpack resolve](/introduction/setup#usage-webpack) and fork the file copying it in your project.

## Usage

Use this markup to create a **breadcrumb**.

<script type="text/plain" class="language-markup">
  <div class="breadcrumbs">
    <div class="container">
      <div class="breadcrumbs-inner">
        <nav class="breadcrumbs-list">
          <a href="/" class="btn">
            <!-- content -->
          </a>
          <span class="separator"></span>
          <a href="/link" class="btn">
            <!-- content -->
          </a>
          <span class="separator"></span>
          <div class="btn">
            <!-- content -->
          </div>
        </nav>
      </div>
    </div>
  </div>
</script>

Use this markup to add **json-ld** metadata to **breadcrumb**.

```html
<script type="application/ld+json">
  {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
          {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "#"
          },
          {
              "@type": "ListItem",
              "position": 2,
              "name": "Lorem ipsum dolor sit amet",
              "item": "#"
          },
          {
              "@type": "ListItem",
              "position": 3,
              "name": "Lorem ipsum"
          }
      ]
  }
</script>
```

<demo>
  <demovanilla src="vanilla/components/extensions/breadcrumbs/default">
  </demovanilla>
  <demovanilla src="vanilla/components/extensions/breadcrumbs/background-title">
  </demovanilla>
</demo>
