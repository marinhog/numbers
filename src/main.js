import Vue from 'vue'
import I18n from 'vue-i18n'
import App from './components/app.vue'
import Locales from './locales.js'

import "./libraries/turret.min.css"
import "./libraries/animate.min.css"

var browserLanguage = (navigator.language || navigator.browserLanguage).split('-')[0];
var lang = browserLanguage in Locales ? browserLanguage : 'pt';

Vue.use(I18n, {
    lang: lang,
    locales: Locales
});

new Vue({
  el: 'body',
  components: {
    app: App
  }
})