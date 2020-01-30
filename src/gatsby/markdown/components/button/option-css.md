---
type: "Components"
badge: "Core"
parent: "Button"
title: "Option Css"
date: "2019-12-01"
---

## Variant

Classes for assigning variant (e.g.: border / background / color). Add or remove selectors at your discretion.

<div class="table-scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.btn-{variant}`                        | `.btn-default` `.btn-primary` `.btn-text` `.btn-link` |
| Mixin                   | `.btn-{variant}()`                      | `.btn-default()` `.btn-primary()`  `.btn-text()` `.btn-link()`   |

</div>

<demo>
  <demovanilla src="vanilla/components/button/variant">
  </demovanilla>
</demo>

On containers use `.text-inverse` to have white buttons (needs `color: inherit`).

<demo>
  <demovanilla src="vanilla/components/button/inverse">
  </demovanilla>
</demo>

## Size

Classes for assigning size (e.g.: padding or font size). Add or remove selectors at your discretion.

Sizes uses `em` padding that depends on font size.

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.btn-{size}`                        | `.btn-tiny` `.btn-small` `.btn-medium` `.btn-big` `.btn-giant` |
| Mixin                   | `.btn-{size}()`                      | `.btn-tiny()` `.btn-small()`  `.btn-medium()` `.btn-big()` `.btn-giant()`   |

<demo>
  <demovanilla src="vanilla/components/button/size">
  </demovanilla>
</demo>