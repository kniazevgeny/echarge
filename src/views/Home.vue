<template lang="pug">
.v-container.pa-4.d-flex.justify-center(
  style='height: 100vh; align-items: center'
)
  // Main content
  .hidden-md-and-up(
    :style='$vuetify.breakpoint.name === "sm" ? "margin: 0 21%; transform: scale(1.25)" : "max-width: 100%"'
  )
    h1 Charging Session
    Gmaps#map.mt-6
    v-layout.mt-6(column)
      v-row#row-1(:style='"opacity:" + opacity')
        .wide
          .block
            #b0
              #b1
                #b2
                  #b3 {{ battery }}%
        div
          #cost.block
            h4 {{ cost }}$
      v-row#row-2(:style='"opacity:" + opacity')
        div
          .chiffre.block
            h4 {{ (deltaEnergyChange * 1000).toFixed(1) }} kWh/s
        div
          .chiffre.block
            h4 {{ energyDelivered }} kWh
        div
          .block
            h4 CO2 emissions savings: {{pounds}} pounds
      v-row#row-3(:style='"opacity:" + opacity')
        div
          #inverted.block
            h4 # mins until full charge
        .wide
          .block
            
  .hidden-sm-and-down.mt-n12
    v-img(
      style='margin: auto; height: 80vh; width: calc(80vh * 0.49)',
      :src='require("@/assets/mockup-wh_x2.png")'
    )
      .d-flex.justify-center(
        style='height: 100%'
      )
        iframe.embed(
          scrolling='no',
          src='https://kniazevgeny.github.io/echarge/'
        )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'
import gsap from 'gsap'

import Gmaps from '@/components/Gmaps.vue'

const AppStore = namespace('AppStore')
const SnackbarStore = namespace('SnackbarStore')

@Component({
  components: {
    Gmaps,
  },
})
export default class Home extends Vue {
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void

  opacity = 0

  tweenedBattery = 1
  get battery() {
    let b = this.tweenedBattery.toFixed(0).toString()
    // update gradient position
    document
      .getElementById('b1')
      ?.style.setProperty(
        '--gradient-start',
        (this.tweenedBattery - 1).toFixed(5).toString() + '%'
      )
    document
      .getElementById('b1')
      ?.style.setProperty(
        '--gradient-end',
        this.tweenedBattery.toFixed(5).toString() + '%'
      )
    // update gradient color
    document
      .getElementById('b1')
      ?.style.setProperty(
        '--gradient-hue',
        this.tweenedBattery.toFixed(3).toString()
      )
    document
      .getElementById('b1')
      ?.style.setProperty(
        '--gradient-saturation',
        (90 - this.tweenedBattery / 5).toFixed(3).toString() + '%'
      )

    // return value
    if (b.length == 3) return b[0] + b[1] + ' ' + b[2] + ' '
    if (b.length == 1) return b[0] + ' '
    if (b.length > 1 && b[0] == '1') return b + ' '
    return b[0] + ' ' + b[1] + ' '
  }

  costPerkWh = 0.31 // $
  poundsPerkWh = 0.85 // pounds of CO2 saved
  get cost() {
    return (this.tweenedenergyDelivered * this.costPerkWh).toFixed(1)
  }

  get pounds() {
    return (this.tweenedenergyDelivered * this.poundsPerkWh).toFixed(1)
  }

  timestamp = 0
  deltaEnergyChange_ = 0
  deltaEnergyChange = 0

  tweenedenergyDelivered = 0
  get energyDelivered() {
    return this.tweenedenergyDelivered.toFixed(1)
  }

  mounted() {
    if (
      window.location.hash === '#rec422536037' ||
      window.location.pathname.includes('echarge') ||
      window.location.host === 'localhost:8080'
    )
      window.setTimeout(this.animate, 500)
  }

  animate() {
    // Set opcaity while animation is on
    window.setTimeout(() => {
      this.opacity = 1
    }, 500)

    // Update Sparkline
    window.setTimeout(() => {
      gsap.to(this.$data, { duration: 20, tweenedenergyDelivered: 60 })
      gsap.to(this.$data, { duration: 20, tweenedBattery: 100 })
    }, 1200)

    window.setInterval(() => {
      let to = this.deltaEnergyChange_
       gsap.to(this.$data, { duration: 0.45, deltaEnergyChange: to })
    }, 500)
  }

  get isWindowHashCorrect() {
    // return if the button at echarge has been clicked
    return window.location.hash === '#rec422536037'
  }

  @Watch('isWindowHashCorrect')
  onLoad(value: boolean) {
    if (!value) return

    window.setTimeout(this.animate, 500)
  }

  @Watch('tweenedenergyDelivered')
  onTweenedenergyDeliveredChange(value: number, oldValue: number) {
    this.deltaEnergyChange_ = (value - oldValue) / (Date.now() - this.timestamp)
    this.timestamp = Date.now()
  }
}
</script>

<style>
.column {
  --gap: 7px;
  gap: var(--gap);
}
.block {
  background: #eee;
  border-radius: 15px;
  padding: 10px;
  height: 100%;
  display: flex;
  /* neumorphic shadows & background */
  /* background: linear-gradient(145deg, #ffffff, #d6d6d6); */
  /* box-shadow:  6px 6px 12px #e4e4e4, */
  /* -6px -6px 12px #f8f8f8; */
}
.block > svg {
  /* Sparkline*/
  height: 100%;
  width: 100%;
}
.block > h4 {
  margin: 0;
  align-self: center;
  justify-self: center;
}
@media screen and (min-width: 960px) and (max-width: 1300px) {
  .block > h4 {
    font-size: min(11px, .9em) !important;
  }
}
#inverted {
  background: #333;
  color: white;
}
#cost {
  justify-content: center;
}
#cost > h4 {
  font-size: 2rem;
  background: -webkit-linear-gradient(135deg, #2af, #3ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.chiffre > h4 {
  font-size: 1.5rem;
}
.row {
  height: calc(100vw / 3.35);
  width: 100%;
  margin: 0 !important;
  opacity: 0;
  gap: var(--gap);
  flex-wrap: nowrap !important;
}
@media screen and (min-width: 600px) and (max-width: 960px) {
  .row {
    height: calc(60vw / 3.35);
    width: 100%;
    margin: 0 !important;
    opacity: 0;
    gap: var(--gap);
    flex-wrap: nowrap !important;
  }
}
.row > .wide {
  flex: 2;
}
.row > div:not(.wide) {
  flex: 1;
}
:root {
  --background: #eee;
  --accent: #333;
}
#row-1 > .wide > .block {
  background: var(--background);
}
@media screen and (min-width: 600px) and (max-width: 960px) {
  #row-1 > .wide > .block {
    padding: 20px 30px;
  }
}
#b0 {
  border: solid 3.5px var(--background);
  width: 100%;
  position: relative;
  margin-left: -5px;
}
#b0::before {
  position: absolute;
  content: '';
  /* width: 100%; */
  aspect-ratio: 1;
  border-radius: 6px;
  right: -5%;
  z-index: 0;
  margin: 0;
  /* bottom: 0; */
  /* padding-top: 10px; */
  margin-top: 17.5%;
  /* margin-bottom: 12.5%; */
  /* top: 0; */
  height: 25%;
  background: var(--accent);
  z-index: 0;
}
#b1 {
  position: relative;
  border-radius: 20px;
  --gradient-start: 0%;
  --gradient-end: 1%;
  --gradient-hue: 0;
  --gradient-saturation: 90%;
  --gradient-color: hsl(var(--gradient-hue), var(--gradient-saturation), 52%);
  /* color: hsl(0, 90%, 52%);  */
  /* background: hsl(49, 90%, 52%); */
  /* text-decoration-color: hsl(104, 55%, 52%); */
  background: linear-gradient(
    90deg,
    var(--gradient-color) var(--gradient-start),
    var(--background) var(--gradient-end)
  );
  transition: 100ms ease-in;
  border: solid 3px var(--accent);
  outline: solid 4px var(--background);
  width: 100%;
  height: 100%;
  margin: 1px;
}
#b2 {
  border-radius: 17px;
  position: absolute;
  top: 0;
  border: solid 4px var(--background);
  bottom: 0;
  /* margin: 2px; */
  left: 0;
  width: auto;
  right: 0;
}
#b3 {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  font-size: min(2.5em, 30px);
  font-family: 'helios';
  font-weight: 600;
  color: var(--accent);
  letter-spacing: -5px;
}

iframe {
  border: none;
  height: 100%;
  aspect-ratio: 0.5;
  transform: scale(0.88);
  border-radius: 20px;
}
.embed > #app {
  padding: 1px;
}
html {
  overflow-y: hidden !important;
}
.vue-map {
  border-radius: 17px;
}
.v-image {
  filter: drop-shadow(15px 20px 30px #a8a8a8)
}
</style>