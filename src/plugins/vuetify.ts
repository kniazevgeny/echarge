import Vue from 'vue'
import Vuetify, {
  VApp,
  VSpacer,
  VBtn,
  VIcon,
  VFlex,
  VLayout,
  VSnackbar,
  VSparkline,
  VRow,
  VImg,
  VMain,
} from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VSpacer,
    VBtn,
    VIcon,
    VFlex,
    VLayout,
    VSnackbar,
    VSparkline,
    VRow,
    VImg,
    VMain,
  },
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})
