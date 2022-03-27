<template lang="pug">
.v-container.pa-4
  // Main content
  h1 Charging Session
  Gmaps.mt-3
  v-layout.mt-6(column)
    v-layout(row)
      v-flex(xs8)
        .block
          h4 battery %
      v-flex.pl-3.pr-0(xs4)
        .block
          h4 cost
    v-layout.mt-3(row)
      v-flex.pl-0.pr-3(xs4)
        .block
          h4.pt-6 current charging speed
      v-flex(xs4)
        .block
          h4.pt-6 energy delivered
      v-flex.pl-3.pr-0(xs4)
        .block
          h4.pt-6 CO2 emissions savings
    v-layout.mt-3(row)
      v-flex.pl-0.pr-3(xs4)
        .block
          h4.pt-6 * mins until full charge
      v-flex(xs8)
        .block
          v-sparkline(
            v-if='isSparklineReady',
            :value='sparklineValue',
            smooth,
            auto-draw,
            :line-width='10',
            stroke-linecap='round',
            :gradient="gradient"
          )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'

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

  mounted() {
    window.setTimeout(() => {
      this.isSparklineReady = true
    }, 250)
    window.setTimeout(() => {
      window.setInterval(() => {
        if (this.sparklineValue[this.sparklineValue.length - 1] > 16) return
        let factor = Math.random() / 1.3 + 0.45
        this.sparklineValue.push(
          this.sparklineValue[this.sparklineValue.length - 1] *
            (factor < 1 ? 1.05 : factor)
        )
      }, 3000)
    }, 700)
  }

  @Watch('sparklineValue')
  onSparklineValueChange() {
    if (this.sparklineValue[this.sparklineValue.length - 1] > 16) {
      window.clearInterval();
      this.gradient = ['#2af', '#3ff']
    }
  }
}
</script>

<style>
.block {
  background: #ddd;
  border-radius: 15px;
  padding: 10px;
  height: 100%;
  width: 100%;
}
.block > svg {
  /* Sparkline*/
  height: 100%;
  width: 100%;
}
.row {
  height: 17vh;
  width: 100%;
  margin: 0 !important;
}
</style>
