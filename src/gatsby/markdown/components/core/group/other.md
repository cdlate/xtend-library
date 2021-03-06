---
type: "Components"
category: "Core"
parent: "Group"
title: "Other"
date: "2019-03-15"
---

## Full

Use `.full` to have full width fluid group. Use `.group-inner.flex-auto` to expand groups.

<demo>
  <demovanilla src="vanilla/components/core/group/options-full-line">
  </demovanilla>
  <demovanilla src="vanilla/components/core/group/options-full-stack">
  </demovanilla>
</demo>

## Merge

You can merge buttons in a single interactive object.

Use this markup to merge multiple `.btn` in one `[button]` as line.

[[notePrimary]]
| Needs [propagate-interaction](/components/addons/animation/propagate-interaction) extension

<script type="text/plain" class="language-markup">
  <button type="button" class="group">

    <div class="group-inner">
      <div class="btn btn-default">
        <!-- content -->
      </div>
    </div>

    <div class="group-inner">
      <div class="btn btn-default">
        <!-- content -->
      </div>
    </div>

  </button>
</script>

Use this markup to merge multiple `.btn` in one `[button]` as stack.

<script type="text/plain" class="language-markup">
  <button type="button" class="group">

    <div class="group-inner">
      <div class="btn btn-default">
        <!-- content -->
      </div>
      <div class="btn btn-default">
        <!-- content -->
      </div>
    </div>

  </button>
</script>

<demo>
  <demovanilla src="vanilla/components/core/group/merge-line">
  </demovanilla>
  <demovanilla src="vanilla/components/core/group/merge-stack">
  </demovanilla>
</demo>
