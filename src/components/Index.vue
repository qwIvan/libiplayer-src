<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <img src="~assets/logo.png" class="avatar">
      <q-toolbar-title :padding="0"/>
      <search ref="search" @result="result" id="search" class="on-right"/>
      <uploader @response="response"/>
    </div>

    <div class="layout-view">
      <player :videoUrl="videoUrl" id="player"/>
    </div>
  </q-layout>
</template>

<script>
  import Player from './Player.vue'
  import Uploader from './Uploader.vue'
  import Search from './Search.vue'

  export default {
    components: {
      Player,
      Uploader,
      Search
    },
    methods: {
      response (resp) {
        this.$refs.search.trigger(resp)
      },
      result (item) {
        this.videoUrl = `http://libivan.com:8888/${item.hash}/${item.filename}`
      }
    },
    data () {
      return {
        videoUrl: ''
      }
    }
  }
</script>

<style>
  #player {
    height: 100%;
  }

  #search {
    width: 100%;
  }
</style>
