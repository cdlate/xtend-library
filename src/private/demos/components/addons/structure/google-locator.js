/* global google */
import { Xt } from 'xtend-library'
import 'xtend-library/src/addons/structure/google-locator.js'

/**
 * google-locator
 */

Xt.addScript(
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSZt9TUgS20QyAbAAL-X3tJIKVLEaCrts&v=3&libraries=places,geometry&language=en&&region=US&callback=demoGoogleLocator'
)

window.demoGoogleLocator = function () {
  Xt.mount.push({
    matches: '.demo--google-locator',
    mount: (object) => {
      // init

      let self = new Xt.GoogleLocator(object, {
        events: {
          animateMarkerResultClick: google.maps.Animation.BOUNCE,
          infoWindowMarkerClick: true,
        },
        map: {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
        },
        formatData: {
          filter: function (self, marker, filter) {
            return marker[filter] || (marker.type && marker.type.includes(filter))
          },
        },
      })

      // unmount

      const unmount = () => {
        self.destroy()
        self = null
      }
      return unmount
    },
  })
}
