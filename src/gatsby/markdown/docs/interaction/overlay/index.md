---
path: "/docs/interaction/overlay"
type: "docs"
date: "2000-04-01"
title: "Overlay"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis."
categories: ["300-Interaction"]
parent: "Overlay"
---

##Usage

Use this markup to create a overlay.

<script type="text/plain" class="language-markup">
  <button type="button" data-xt-overlay='{"targets": "#overlay-custom"}'>
    <span><!-- content --></span>
  </button>
  <div class="overlay_outer" id="overlay-custom">
    <div class="overlay">
      <div class="overlay_inner">
        <div class="overlay_design"></div>
        <button type="button" class="btn btn--close overlay_dismiss" aria-label="Close"><span></span></button>
        <div class="overlay_content">
          <!-- content -->
        </div>
      </div>
    </div>
  </div>
</script>

You can use this markup to create a overlay with **no id**.

<script type="text/plain" class="language-markup">
  <div data-xt-overlay>
    <button type="button">
      <span><!-- content --></span>
    </button>
    <div class="overlay_outer">
      <div class="overlay">
        <div class="overlay_inner">
          <div class="overlay_design"></div>
          <button type="button" class="btn btn--close overlay_dismiss" aria-label="Close"><span></span></button>
          <div class="overlay_content">
            <!-- content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</script>

You can use this markup to create a overlay with **no toggle**. Be sure to add `.overlay_content.event-limit`.

<script type="text/plain" class="language-markup">
  <div class="overlay_outer" data-xt-overlay>
    <div class="overlay">
      <div class="overlay_inner">
        <div class="overlay_design"></div>
        <button type="button" class="btn btn--close overlay_dismiss" aria-label="Close"><span></span></button>
        <div class="overlay_content event-limit">
          <!-- content -->
        </div>
      </div>
    </div>
  </div>
</script>

You can initialize **overlay** by javascript omitting `[data-xt-overlay]`.

```jsx
let self = Xt.init('xt-overlay', document.querySelector('.my-overlay'), {
  // option
});
```

<div class="alert alert--primary">
  <div class="alert_content">
    Overlays are moved to **body** to prevent **z-index** problems. Use `"appendTo": false` to prevent that.
  </div>
</div>