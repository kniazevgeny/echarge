<template lang="pug">
div
  google-map#map(
    v-if='google',
    :center='mapCenter',
    :zoom='mapZoom',
    ref='mapRef',
    style='height: 25vh; clear: left; z-index: 1; bottom: 0'
  )
    gmap-marker(
      v-for='(m, i) in markers',
      :key='i',
      :position='m.position',
      :clickable='true',
      :icon='getIcon()'
    )
    //- @click='toggleInfoWindow(m, i)',
  //- gmap-info-window(:position='infoWindowPos', :opened='infoWinOpen', @closeclick='infoWinOpen=false', :options='infoOptions')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')

import * as VueGoogleMaps from 'vue2-google-maps'
import { gmapApi } from 'vue2-google-maps'
import { loaded } from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCmPj3KPMsJ6uH-PyZ95BmfULmYExmUImg', //or paste your api key here
    //to create local env vars, create .env.local file in root folder, then add VUE_APP_*=value
    //libraries: Geocoder,
    v: '3.48',
    language: 'en',
  },
  // Demonstrating how we can customize the name of the components
  installComponents: false,
})

@Component({
  components: {
    'google-map': VueGoogleMaps.Map,
    'gmap-marker': VueGoogleMaps.Marker,
  },
})
export default class Gmaps extends Vue {
  mapMode = 0
  mapTheme = 0
  mapCenter = { lat: 33.9228, lng: -118.3304 }
  mapZoom = 12
  google = true
  markers = [
    {
      full_name: 'Erich  Kunze',
      position: {
        lat: 33.9228,
        lng: -118.3304,
      },
    },
  ]
  getIcon() {
    return {
      url: require('@/assets/echarge_marker.svg'),
      scaledSize: {
        height: 60,
        width: 60,
      },
    }
  }
}
</script>

<style>
.gm-style-iw.gm-style-iw-c {
  position: fixed;
  width: 250px;
  height: 300px;
}
/*   .gm-style-iw-t::after{
    width: 0px!important;
    height: 0px!important;
    }*/
.gmnoprint {
  display: none;
}
</style>
