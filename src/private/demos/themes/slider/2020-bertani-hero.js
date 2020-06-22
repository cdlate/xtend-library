import { Xt } from 'xtend-library/src/xt.js'
import 'xtend-library/src/vars.js'
import 'xtend-library/src/extensions/slider/slider.js'
import 'xtend-library/src/addons/slider/navigation-sides.js'
import gsap from 'gsap'

Xt.mount.push({
  matches: '#iframe--2020-bertani-hero .slider',
  mount: object => {
    // vars

    const assetMaskTimeOn = Xt.vars.timeBig
    const assetMaskEaseOn = 'quint.inOut'
    const assetMaskTimeOff = Xt.vars.timeBig
    const assetMaskEaseOff = 'quint.inOut'

    const assetZoom = 0.25
    const assetTimeOn = Xt.vars.timeBig
    const assetEaseOn = 'quint.inOut'

    const contentX = 50
    const contentTimeOn = Xt.vars.timeBig
    const contentEaseOn = 'quint.inOut'
    const contentEaseOnDragging = 'quint.out'

    const lineSizeMin = 120
    const lineSizeMax = 200
    const lineDelayMin = Xt.vars.timeMedium
    const lineDelayMax = Xt.vars.timeLarge

    // slider

    let self = new Xt.Slider(object, {
      instant: true,
      durationOn: Xt.vars.timeBig,
      durationOff: Xt.vars.timeBig,
      auto: {
        time: 4000,
        pause: '.slide_text',
      },
      autoHeight: false,
      groupMq: false,
      drag: {
        duration: Xt.vars.timeBig,
        overflow: false,
      },
    })

    // dragstart

    const eventDragStart = () => {
      const nexts = self.targets.filter(x => x.classList.contains('next'))
      for (const next of nexts) {
        clearTimeout(Xt.dataStorage.get(next, 'dragNextTimeout'))
      }
    }

    self.dragger.addEventListener('dragstart.xt', eventDragStart)

    // dragend

    const eventDragEnd = () => {
      const nexts = self.targets.filter(x => x.classList.contains('next'))
      for (const next of nexts) {
        Xt.dataStorage.set(
          next,
          self.componentNamespace + 'dragNextTimeout',
          setTimeout(() => {
            next.classList.remove('next')
          }, assetMaskTimeOn)
        )
      }
    }

    self.dragger.addEventListener('dragend.xt', eventDragEnd)

    // drag

    const eventDrag = () => {
      const target = self.targets.filter(x => self.hasCurrent(x))[0]
      // assetMask
      const assetMask = target.querySelector('.slide_item')
      gsap.set(assetMask, { x: -100 * self.detail.dragRatio * self.direction + '%' })
      const assetMaskInner = assetMask.querySelector('.slide_inner')
      gsap.set(assetMaskInner, { x: (100 * self.detail.dragRatio * self.direction) / 2 + '%' })
      // next
      const nexts = self.direction > 0 ? self.getTargets(self.getNext()) : self.getTargets(self.getPrev())
      for (const next of nexts) {
        next.classList.add('next')
        // assetMask
        const assetMask = next.querySelector('.slide_item')
        gsap.set(assetMask, { x: 100 * self.detail.dragRatioInverse * self.direction + '%' })
        const assetMaskInner = assetMask.querySelector('.slide_inner')
        gsap.set(assetMaskInner, { x: (-100 * self.detail.dragRatioInverse * self.direction) / 2 + '%' })
        // asset
        const asset = next.querySelector('.slide_asset img')
        gsap.set(asset, { scale: 1 + assetZoom * self.detail.dragRatioInverse })
        // content
        const content = next.querySelector('.slide_text')
        gsap.set(content, { x: contentX * self.detail.dragRatioInverse * self.direction })
      }
    }

    self.dragger.addEventListener('drag.xt', eventDrag)

    // dragreset

    const eventDragReset = () => {
      const target = self.targets.filter(x => self.hasCurrent(x))[0]
      // assetMask
      const assetMask = target.querySelector('.slide_item')
      gsap.to(assetMask, { x: 0, duration: assetMaskTimeOff, ease: assetMaskEaseOff })
      const assetMaskInner = assetMask.querySelector('.slide_inner')
      gsap.to(assetMaskInner, { x: 0, duration: assetMaskTimeOff, ease: assetMaskEaseOff })
      // next
      const nexts = self.targets.filter(x => x.classList.contains('next'))
      for (const next of nexts) {
        // assetMask
        const assetMask = next.querySelector('.slide_item')
        const xCurrent = assetMask.clientWidth * self.direction
        gsap.to(assetMask, { x: xCurrent, duration: assetMaskTimeOff, ease: assetMaskEaseOff })
        const assetMaskInner = assetMask.querySelector('.slide_inner')
        gsap.to(assetMaskInner, { x: -xCurrent / 2, duration: assetMaskTimeOff, ease: assetMaskEaseOff })
      }
    }

    self.dragger.addEventListener('dragreset.xt', eventDragReset)

    // on

    const eventOn = e => {
      const target = e.target
      // useCapture delegation
      if (self.targets.includes(target)) {
        if (self.initial) {
          // assetMask
          const assetMask = target.querySelector('.slide_item')
          gsap.killTweensOf(assetMask)
          gsap.set(assetMask, { x: 0 })
          const assetMaskInner = assetMask.querySelector('.slide_inner')
          gsap.killTweensOf(assetMaskInner)
          gsap.set(assetMaskInner, { x: 0 })
          // asset
          const asset = target.querySelector('.slide_asset img')
          gsap.killTweensOf(asset)
          gsap.set(asset, { scale: 1 })
          // content
          const content = target.querySelector('.slide_text')
          gsap.killTweensOf(content)
          gsap.set(content, { x: 0 })
          // line
          const lineSmall = target.querySelector('.slide_line_small')
          gsap.killTweensOf(lineSmall)
          gsap.set(lineSmall, { height: lineSizeMax, bottom: 0, opacity: 1 })
          const lineBig = target.querySelector('.slide_line_big')
          gsap.killTweensOf(lineBig)
          gsap.set(lineBig, { height: lineSizeMin, bottom: lineSizeMax - lineSizeMin })
        } else {
          // assetMask
          const assetMask = target.querySelector('.slide_item')
          if (!self.detail.dragging) {
            gsap.set(assetMask, { x: 100 * self.direction + '%' })
          }
          gsap.to(assetMask, { x: 0, duration: assetMaskTimeOn, ease: assetMaskEaseOn })
          const assetMaskInner = assetMask.querySelector('.slide_inner')
          if (!self.detail.dragging) {
            gsap.set(assetMaskInner, { x: -((100 * self.direction) / 2) + '%' })
          }
          gsap.to(assetMaskInner, { x: 0, duration: assetMaskTimeOn, ease: assetMaskEaseOn })
          // asset
          const asset = target.querySelector('.slide_asset img')
          if (!self.detail.dragging) {
            gsap.set(asset, { scale: 1 + assetZoom })
          }
          gsap.to(asset, { scale: 1, duration: assetTimeOn, ease: assetEaseOn })
          // content
          const content = target.querySelector('.slide_text')
          if (!self.detail.dragging) {
            gsap.set(content, { x: contentX * self.direction })
          }
          gsap.to(content, { x: 0, duration: contentTimeOn, ease: self.detail.dragging ? contentEaseOnDragging : contentEaseOn })
          // line
          const lineSmall = target.querySelector('.slide_line_small')
          gsap.set(lineSmall, { height: 0, bottom: 0, opacity: 1 })
          gsap.to(lineSmall, { height: lineSizeMax, bottom: 0, opacity: 0.3, duration: Xt.vars.timeSmall, ease: 'expo.in', delay: lineDelayMin })
          const lineBig = target.querySelector('.slide_line_big')
          gsap.set(lineBig, { height: 0, bottom: 0 })
          gsap.to(lineBig, { height: lineSizeMax, bottom: 0, duration: Xt.vars.timeSmall, ease: 'expo.in', delay: lineDelayMax })
          gsap.to(lineBig, {
            height: lineSizeMin,
            bottom: lineSizeMax - lineSizeMin,
            duration: Xt.vars.timeMedium,
            ease: 'expo.out',
            delay: lineDelayMax + Xt.vars.timeSmall,
          })
        }
      }
    }

    self.object.addEventListener('on.xt', eventOn, true)

    // off

    const eventOff = e => {
      const target = e.target
      // useCapture delegation
      if (self.targets.includes(target)) {
        // assetMask
        const assetMask = target.querySelector('.slide_item')
        gsap.to(assetMask, { x: -100 * self.direction + '%', duration: assetMaskTimeOff, ease: assetMaskEaseOff })
        const assetMaskInner = assetMask.querySelector('.slide_inner')
        gsap.to(assetMaskInner, { x: (100 * self.direction) / 2 + '%', duration: assetMaskTimeOff, ease: assetMaskEaseOff })
      }
    }

    self.object.addEventListener('off.xt', eventOff, true)

    // unmount

    const unmount = () => {
      self.destroy()
      self = null
    }
    return unmount
  },
})
