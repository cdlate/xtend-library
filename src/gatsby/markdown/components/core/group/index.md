---
type: "Components"
category: "Core"
parent: "Group"
title: "Group"
description: "Css component to group up buttons and form inputs."
---

## Setup

To use this component import the **less** files accordingly:

```less
@import 'xtend-library/src/core/group/group.less';
```

Or just import **core**:

```less
@import 'xtend-library/src/xtend-core.less';
```

[[noteDefault]]
| To modify a **less** or **js** file add [webpack resolve](/introduction/setup#usage-webpack) and fork the file copying it in your project.

## Usage

#### Button

Use this markup to create a **button group as line**.

<script type="text/plain" class="language-markup">
  <div class="group">

    <button type="button" class="btn btn-default">
      <!-- content -->
    </button>

    <button type="button" class="btn btn-default">
      <!-- content -->
    </button>

  </div>
</script>

Use this markup to create a button group as stack.

<script type="text/plain" class="language-markup">
  <div class="group">

    <div class="group-inner">
      <button type="button" class="btn btn-default">
        <!-- content -->
      </button>
      <button type="button" class="btn btn-default">
        <!-- content -->
      </button>
    </div>

  </div>
</script>

<demo>
  <demovanilla src="vanilla/components/core/group/button-line">
  </demovanilla>
  <demovanilla src="vanilla/components/core/group/button-stack">
  </demovanilla>
</demo>

#### Input

Use this markup to create a input group as line.

<script type="text/plain" class="language-markup">
<form class="form-default">
  <div class="form-group">
    <div class="group">

      <div class="group-inner">
        <button type="button" class="btn btn-default">
          <!-- content -->
        </button>
      </div>

      <div class="group-inner">
        <input type="text" class="form-item"/>
      </div>

    </div>
  </div>
</form>
</script>

Use this markup to create a input group as stack.

<script type="text/plain" class="language-markup">
<form class="form-default">
  <div class="form-group">
    <div class="group">

      <div class="group-inner">
        <button type="button" class="btn btn-default">
          <!-- content -->
        </button>
        <button type="button" class="btn btn-default">
          <!-- content -->
        </button>
      </div>

      <div class="group-inner">
        <input type="text" class="form-item"/>
      </div>

    </div>
  </div>
</form>
</script>

<demo>
  <demovanilla src="vanilla/components/core/group/input-line">
  </demovanilla>
  <demovanilla src="vanilla/components/core/group/input-stack">
  </demovanilla>
</demo>
