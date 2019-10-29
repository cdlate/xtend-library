---
type: "Core"
parent: "Column"
title: "Column"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis."
categories: ["200-Layout"]
---

##Usage

Columns specify a size relative to how many columns you have in a row (**by default 12**).

Columns are placed in a column/row layout using @TODO link to row.

Use `.col` to create a <strong>column</strong>, by default columns have **automatic width** inside the flexbox.

<script type="text/plain" class="language-markup">
  <div class="col">
    <!-- content -->
  </div>
</script>

You can set **column's width** specifying a number between 1 and 12, for example `.col-6` will take 50% width.

<div class="table--scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.col-{number}`                          | `.col-6`                     |
| Class responsive        | `.col-{number}--{breakpoint}`             | `.col-6--sm`                  |
| Mixin                   | `.col({number})`                          | `.col(6)`                     |
| Mixin responsive min    | `.col({number}, {breakpoint})`            | `.col(6, sm)`                 |

</div>

If you used a responsive columns you can set back automatic width in a bigger breakpoint using `auto` instead of the number.

You can nest `.row`, but a flex children can't be a flex itself.

<div class="alert">
  <div class="alert-content">
    You can set grid's count and breakpoints in the `_variables.less` file.
  </div>
</div>

<demo>
  <div class="gatsby_demo-inline">
    <div class="gatsby_demo_item gatsby_demo_preview" data-name="columns">
      <div class="gatsby_demo_source gatsby_demo_source--from gatsby_demo-cols" data-lang="language-markup">
        <div class="row">
          <div class="col-4"></div>
          <div class="col-8"></div>
          <div class="col-12 col-8--sm"></div>
          <div class="col-12 col-4--sm"></div>
          <div class="col-auto col-2--sm"></div>
          <div class="col-auto"></div>
          <div class="col-auto col-2--sm col-auto--lg"></div>
        </div>
      </div>
    </div>
  </div>
</demo>

<demo>
  <div class="gatsby_demo-inline">
    <div class="gatsby_demo_item gatsby_demo_preview" data-name="nested">
      <div class="gatsby_demo_source gatsby_demo_source--from gatsby_demo-cols-nested" data-lang="language-markup">
        <div class="row">
          <div class="col-4">
            <div class="row">
              <div class="col-4"></div>
              <div class="col-8"></div>
              <div class="col-8"></div>
              <div class="col-4"></div>
            </div>
          </div>
          <div class="col-8">
            <div class="row">
              <div class="col-12 col-8--sm"></div>
              <div class="col-12 col-4--sm"></div>
              <div class="col-auto"></div>
              <div class="col-auto col-2--sm col-auto--lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</demo>

To have custom width columns use `width` and `max-width`.

<demo>
  <demovanilla src="inline/core/grid/custom">
  </demovanilla>
</demo>