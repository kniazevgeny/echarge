<template lang="pug">
.v-container.pa-4
  // Main content
  h1 Charging Session
  Gmaps#map.mt-3
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
        .block
          h4 current charging speed
      div
        .block
          h4 energy delivered
      div
        .block
          h4 CO2 emissions savings
    v-row#row-3(:style='"opacity:" + opacity')
      div
        #inverted.block
          h4 # mins until full charge
      .wide
        .block
          v-sparkline(
            v-if='isSparklineReady',
            :value='sparklineValue',
            smooth,
            auto-draw,
            :line-width='10',
            stroke-linecap='round',
            :gradient='gradient'
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

  sparklineValue = [0, 2, 3, 3.5, 4.5, 6, 7, 7.5]
  isSparklineReady = false
  gradient = ['#f72047', '#ffd200', '#1feaea']

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

  tweenedCost = 0
  get cost() {
    return this.tweenedCost.toFixed(1)
  }

  mounted() {
    if (
      window.location.hash === '#rec422536037' ||
      window.location.host === 'kniazevgeny.github.io' ||
      window.location.host === 'localhost:8080'
    )
      this.animate()
  }

  animate() {
    // Set opcaity while animation is on
    window.setTimeout(() => {
      this.opacity = 1
    }, 500)

    // Animate Sparkline
    window.setTimeout(() => {
      this.isSparklineReady = true
    }, 850)

    // Update Sparkline
    window.setTimeout(() => {
      window.setInterval(() => {
        if (this.sparklineValue[this.sparklineValue.length - 1] > 16) return
        let factor = Math.random() + 0.55
        this.sparklineValue.push(
          this.sparklineValue[this.sparklineValue.length - 1] *
            (factor < 1 ? 1.15 : factor)
        )
      }, 2200)
      gsap.to(this.$data, { duration: 10, tweenedCost: 5 })
      gsap.to(this.$data, { duration: 10, tweenedBattery: 100 })
    }, 1200)
  }

  get isWindowHashCorrect() {
    // return if the button at echarge has been clicked /#rec433089158
    return window.location.hash === '#rec422536037'
  }

  @Watch('sparklineValue')
  onSparklineValueChange() {
    if (this.sparklineValue[this.sparklineValue.length - 1] > 16) {
      window.clearInterval()
      this.gradient = ['#2af', '#3ff']
    }
  }

  @Watch('isWindowHashCorrect')
  onLoad(value: boolean) {
    if (!value) return

    this.animate()
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
.row {
  height: calc(100vw / 3.35);
  width: 100%;
  margin: 0 !important;
  animation: fadeIn 0.6s;
  opacity: 0;
  gap: var(--gap);
  flex-wrap: nowrap !important;
}
.row > .wide {
  flex: 2;
}
.row > div:not(.wide) {
  flex: 1;
}
#row-1 {
  animation-delay: 0.2s;
}
#row-2 {
  animation-delay: 0.35s;
}
#row-3 {
  animation-delay: 0.5s;
}
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}
:root {
  --background: #eee;
  --accent: #333;
}
#row-1 > .wide > .block {
  background: var(--background);
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
  font-size: 2.5em;
  font-family: 'helios';
  font-weight: 600;
  color: var(--accent);
  letter-spacing: -7px;
}
</style>
