<template>
  <q-layout>
    <navbar slot="header" :filename="filename" :value="hash" class="toolbar"/>

    <div class="layout-view">
      <player v-if="hash && filename" :videoUrl="videoUrl" id="player"/>
    </div>
  </q-layout>
</template>

<script>
  import Player from './Player.vue'
  import Navbar from './Navbar.vue'
  import {api} from '../config'

  function init (vm, route) {
    let file = ''
    let hash = ''
    let title = 'LibiPlayer'
    if (route.name === 'player') {
      file = route.params.filename
      hash = route.params.hash
      title = file
    }
    vm.filename = file
    vm.hash = hash
    document.title = title
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
        if (!this.hash || !this.filename) return []
        return `${api}/${this.hash}/${this.filename}`
      }
    },
    components: {
      Player,
      Navbar
    },
    data () {
      return {
        hash: '',
        filename: ''
      }
    }
  }
</script>

<style>
  #player {
    height: 100%;
  }
</style>
