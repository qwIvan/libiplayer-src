import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.http.options.crossOrigin = true

export const File = Vue.resource('http://libivan.com:8888{/hash}{/filename}')
