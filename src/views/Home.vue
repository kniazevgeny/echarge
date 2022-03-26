<template lang="pug">
.v-container.pa-4
  // Main content
  h1 Charging Session
  Gmaps
  h2.pt-6 current charging speed
  h2.pt-3 cost

  //- v-sparkline(:value='sparklineValue', smooth, auto-draw)
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'

import Gmaps from '@/components/Gmaps.vue'

const AppStore = namespace('AppStore')
const SnackbarStore = namespace('SnackbarStore')

@Component({
  components: {
    Gmaps
  }
})
export default class Home extends Vue {
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
  sparklineValue = [0, 10, 10, 10, 10, 10, 10, 10]
}
</script>

<style></style>
