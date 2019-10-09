---
type: "Core"
parent: "Overlay"
title: "Size"
description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis."
categories: ["300-Interaction"]
---

##Size

Optional classes for assigning width.

You can change the **default size** @TODO less path

<div class="table--scroll">

|                         | Syntax                                    | Example                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Class                   | `.overlay--{size}`                        | `.overlay--small`             |
| Mixin                   | `.overlay--size({size})`                  | `.overlay--size(small)`       |

</div>

<div class="alert">
  <div class="alert_content">
    You can set overlay's size in the `_variables.less`.
  </div>
</div>

`.overlay--tiny` `.overlay--small` `.overlay--medium` `.overlay--big` `.overlay--giant` `.overlay--full`
        
<demo>
  <demovanilla src="inline/demo/overlay/size">
  </demovanilla>
</demo>