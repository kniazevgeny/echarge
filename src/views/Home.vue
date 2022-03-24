<template lang="pug">
.v-container.pa-4
  // Main content
  v-layout.text-center(column, justify-center, align-center)
    v-flex(xs12, md10)
      .headline.pb-4
        span(v-html='$t("home.info")')
      p {{ $t("home.rules.register") }}
      p {{ $t("home.rules.money") }}
      p {{ $t("home.rules.success") }}

    v-flex.pt-4

    v-flex.pt-4
      .caption
        router-link(to='/privacy') {{ $t("home.privacy") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '@/plugins/i18n'
import { namespace } from 'vuex-class'

const AppStore = namespace('AppStore')
const SnackbarStore = namespace('SnackbarStore')

@Component({})
export default class Home extends Vue {
  @SnackbarStore.Mutation setSnackbarError!: (error: string) => void
}
</script>

<style></style>
