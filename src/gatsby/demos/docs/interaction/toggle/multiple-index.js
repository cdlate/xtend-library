export const htmlSource = `
  <div class="list list-space--small align-items--center" data-xt-toggle>
    <button type="button" class="btn">
      <span>Toggle 0</span>
    </button>
    <button type="button" class="btn">
      <span>Toggle 1</span>
    </button>
    <button type="button" class="btn">
      <span>Toggle 2</span>
    </button>
    <div class="alert toggle--block">
      <div class="alert_content">
        Target 0
        <div class="alert toggle--block">
          <div class="alert_content">
            Nested not toggled
          </div>
        </div>
      </div>
    </div>
    <div class="alert toggle--block">
      <div class="alert_content">
        Target 1
        <div class="alert toggle--block">
          <div class="alert_content">
            Nested not toggled
          </div>
        </div>
      </div>
    </div>
    <div class="alert toggle--block">
      <div class="alert_content">
        Target 2
        <div class="alert toggle--block">
          <div class="alert_content">
            Nested not toggled
          </div>
        </div>
      </div>
    </div>
  </div>
`
