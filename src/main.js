import Vue from 'vue'
import App from './components/app.vue'

import "./libraries/turret.min.css"
import "./libraries/animate.min.css"

new Vue({
  el: 'body',
  components: {
    app: App
  }
})