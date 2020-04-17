---
type: "Components"
badge: "Core"
parent: "Overlay"
title: "Content"
date: "2019-06-01"
---

[[notePrimary]]
| Overlay uses card to style it's content, refer to [card's content](/components/card/content) for all **content**.

## Block

You can add custom `.card-block` modifiers and style them as you like (e.g.: `.card-block-head`).

<script type="text/plain" class="language-markup">
  <div class="card card-overlay">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="btn btn-close" aria-label="Close"></div>
      <div class="card-content">

        <div class="card-block card-block-head">
          <!-- content -->
        </div>

      </div>
    </div>
  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/overlay/block">
  </demovanilla>
</demo>

## Multiple

Sequential `.card-item` stack vertically.

They have a separator automatically styled with [variants](/components/card/option#variant). Just be sure to style `.card-item-{variant}` as in the **card.less** to not break css specificity.

<script type="text/plain" class="language-markup">
  <div class="card card-overlay">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="btn btn-close" aria-label="Close"></div>
      <div class="card-content">

        <div class="card-block card-item">
          <!-- content -->
        </div>

        <div class="card-block card-item">
          <!-- content -->
        </div>

      </div>
    </div>
  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/overlay/multiple">
  </demovanilla>
</demo>

## Group

To stack `.card-item` horizontally use `.card-item-nested` and `.card-group` with responsive classes if you need them.

<div class="table-scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.card-group`                           | `.card-group`                      |
| Class responsive        | `.card-group-{breakpoint}`              | `.card-group-sm`                   |

</div>

<script type="text/plain" class="language-markup">
  <div class="card card-overlay">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="btn btn-close" aria-label="Close"></div>
      <div class="card-content">

        <div class="card-item-nested card-item card-group">
          <div class="card-block card-item">
             <!-- content -->
          </div>
          <div class="card-block card-item">
             <!-- content -->
          </div>
        </div>

      </div>
    </div>
  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/overlay/group">
  </demovanilla>
</demo>

## Asset

If you want full width assets use `.card-asset`.

<script type="text/plain" class="language-markup">
  <div class="card card-overlay">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="btn btn-close" aria-label="Close"></div>
      <div class="card-content">

        <div class="card-asset">
          <!-- content -->
        </div>

      </div>
    </div>
  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/overlay/asset">
  </demovanilla>
</demo>

## Overflow

You can set vertical overflow using `.card-overflow-y` in `.card-inner` or `.card-block`.

<demo>
  <demovanilla src="vanilla/components/overlay/overflow-y">
  </demovanilla>
</demo>