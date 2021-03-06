---
type: "Components"
category: "Core"
parent: "Card"
title: "Content Horizontal"
date: "2020-10-05"
---

## Block

Sequential `.card-block` stack vertically.

<demo>
  <demovanilla src="vanilla/components/core/card/horizontal-multiple">
  </demovanilla>
</demo>

You can add custom `.card-block` modifiers and style them as you like (e.g.: `.card-block-intro`).

If you put it **outside** `.card-content` it will be rendered vertically.

<demo>
  <demovanilla src="vanilla/components/core/card/horizontal-block">
  </demovanilla>
</demo>

## Asset

If you want full width assets use `.card-asset`.

If you put it **outside** `.card-content` it will be rendered vertically.

<div class="table-scroll">

|                         | Class                                     | Mixin                         | Description                   |
| ----------------------- | ----------------------------------------- | ----------------------------- | ----------------------------- |
| Option                  | `.card-asset`                | Not Possible        | Full width block with responsive full assets            |

</div>

<demo>
  <demovanilla src="vanilla/components/core/card/horizontal-asset">
  </demovanilla>
</demo>

## Overflow

You can set vertical overflow using `.card-overflow-y` in `.card-inner` or `.card-block`.

<div class="table-scroll">

|                         | Class                                     | Mixin                         | Description                   |
| ----------------------- | ----------------------------------------- | ----------------------------- | ----------------------------- |
| Option                  | `.card-overflow-y`                | `.card-overflow-y()`        | Vertical overflow with max-height and scrollbar            |

</div>

<demo>
  <demovanilla src="vanilla/components/core/card/horizontal-overflow-y">
  </demovanilla>
</demo>
