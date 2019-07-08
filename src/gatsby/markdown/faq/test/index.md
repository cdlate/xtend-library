---
path: "/faq/test"
type: "faq"
date: "2000-01-01"
title: "Test"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis."
categories: ["100-Test"]
---

##Markdown

Lorem ipsum `.btn.test`.

See [Group button's page](/docs/content/group/button).

<script type="text/plain" class="language-markup">
  <a href="#" class="btn">
    <span><!-- content --></span>
  </a>
  
  <button type="button" class="btn">
    <span><!-- content --></span>
  </button>
</script>

```
$ mkdir -p xtend-library/
$ cp -r node_modules/xtend-library/dist/ xtend-library/
```

```less
// test comment

@import (reference) "../../../../dist/styles/xtend.less";

.drop--disable-example {
  @media @min-sm {
    .drop--disable();
  }
}

body {
  background: #ff0000;
}
```

```jsx
let self = Xt.init('xt-scroll', document.documentElement, {
  // option
});
```

##Tables

<div class="table--scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.col--{number}`                          | `.col--6`                     |
| Class responsive        | `.col--{number}-{breakpoint}`             | `.col--6-sm`                  |
| Mixin                   | `.col({number})`                          | `.col(6)`                     |
| Mixin responsive min    | `.col({number}, {breakpoint})`            | `.col(6, sm)`                 |

</div>

##Demos

###Inline demos

<demo>
  <div class="demo-inline">
    <div class="demo_item demo_preview" data-name="vanilla">
      <div class="demo_source demo_source--from" data-lang="language-markup">
        <div class="form-item">
          <input type="checkbox" class="unstyled" id="checkbox-block-unstyled">
          <label class="form-label" for="checkbox-block-unstyled">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
          </label>
        </div>
  
        <div class="form-item">
          <input type="radio" class="unstyled" id="radio-block-unstyled-0" name="radio-block-unstyled">
          <label class="form-label" for="radio-block-unstyled-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
          </label>
        </div>
  
        <div class="form-item">
          <input type="radio" class="unstyled" id="radio-block-unstyled-1" name="radio-block-unstyled">
          <label class="form-label" for="radio-block-unstyled-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
          </label>
        </div>
      </div>
    </div>
  </div>
</demo>

###Demos

<demo>
  <demovanilla src="demos/inline/faq/test-vanilla" name="vanilla">
    <div class="demo_text">
      <div class="alert_content">
        Test
      </div>
    </div>
  </demovanilla>
  <demoreact src="demos/inline/faq/test-react" name="react">
    <div class="demo_text">
      <div class="alert_content">
        Test
      </div>
    </div>
  </demoreact>
</demo>

###Iframe demos

<demo>
  <div class="demo_item" data-iframe="demos/faq/test-vanilla-iframe" data-name="vanilla">
    <div class="demo_text">
      <div class="alert_content">
        Test
      </div>
    </div>
  </div>
  <div class="demo_item" data-iframe="demos/faq/test-react-iframe" data-name="react">
    <div class="demo_text">
      <div class="alert_content">
        Test
      </div>
    </div>
  </div>
</demo>