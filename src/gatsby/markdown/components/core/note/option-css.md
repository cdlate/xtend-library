---
type: "Components"
category: "Core"
parent: "Note"
title: "Option Css"
date: "2019-12-01"
---

## Variant

Classes for assigning variant (e.g.: border / background / color).

<div class="table-scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.note-{variant}`                        | `.note-default` `.note-primary` `.note-success` `.note-error` |
| Mixin                   | `.note-{variant}()`                      | `.note-default()` `.note-primary()`  `.note-success()` `.note-error()`   |

</div>

<demo>
  <demovanilla src="vanilla/components/core/note/variant">
  </demovanilla>
</demo>

## Size

Classes for assigning size (e.g.: padding or font size).

<div class="table-scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.note-{size}`                           | `.note-small` `.note-medium` `.note-large`|
| Mixin                   | `.note-{size}()`                         | `.note-small()` `.note-medium()`  `.note-large()`   |

</div>

<demo>
  <demovanilla src="vanilla/components/core/note/size">
  </demovanilla>
</demo>

#List

Use `.note-list` to make a list block inside contents.

<script type="text/plain" class="language-markup">
  <div class="note note-default">
    <div class="note-list">
      <!-- content -->
    </div>
  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/core/note/block">
  </demovanilla>
</demo>
