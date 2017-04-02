<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <router-link to="/">
        <img src="~assets/logo.png" class="avatar">
      </router-link>
      <drop-input ref="dropInput" :filename="filename" :value="hash" class="on-right"/>
      <uploader @response="response" class="on-right"/>
    </div>

    <div class="layout-view">
      <player v-if="videoUrl" :videoUrl="videoUrl" id="player"/>
    </div>
  </q-layout>
</template>

<script>
  import Player from './Player.vue'
  import DropInput from './DropInput.vue'
  import Uploader from './Uploader.vue'
  import {api} from '../config'

  function init (vm, route) {
    if (route.name === 'player') {
      vm.filename = route.params.filename
      vm.hash = route.params.hash
      vm.$refs.dropInput.opened = false
    }
    else if (route.name === 'list') {
      vm.filename = ''
      vm.hash = route.params.hash
      vm.$refs.dropInput.opened = true
    }
    else {
      vm.filename = ''
      vm.hash = ''
      vm.$refs.dropInput.opened = false
    }
    return true
  }

  export default {
    beforeRouteEnter (to, from, next) {
      next(vm => init(vm, to))
    },
    beforeRouteUpdate (to, from, next) {
      init(this, to)
      next(true)
    },
    computed: {
      videoUrl () {
        if (!this.hash || !this.filename) return ''
        return `${api}/${this.hash}/${this.filename}`
      }
    },
    components: {
      Player,
      DropInput,
      Uploader
    },
    data () {
      return {
        hash: '',
        filename: ''
      }
    },
    watch: {
      filename (val) {
        document.title = val
      }
    },
    methods: {
      response (resp) {
        this.$refs.dropInput.resp = resp
        this.$refs.dropInput.hash = resp.hash_hex
        this.$refs.dropInput.opened = true
      }
    }
  }
</script>

<style>
  #player {
    height: 100%;
  }
</style>
