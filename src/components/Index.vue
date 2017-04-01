<template>
  <q-layout>
    <navbar slot="header" :filename="filename" v-model="edit_hash" class="toolbar"/>

    <div class="layout-view">
      <player v-if="play_hash && filename" :videoUrl="videoUrl" id="player"/>
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
      file = route.params.file
      hash = route.params.hash
      title = file
    }
    vm.filename = file
    vm.edit_hash = hash
    vm.play_hash = hash
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
        if (!this.play_hash || !this.filename) return []
        return `${api}/${this.play_hash}/${this.filename}`
      }
    },
    components: {
      Player,
      Navbar
    },
    data () {
      return {
        edit_hash: '',
        play_hash: '',
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
