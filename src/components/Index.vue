<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <img src="~assets/logo.png" class="avatar">
      <q-toolbar-title :padding="0">
        LibiPlayer
      </q-toolbar-title>
      <search class="on-right"/>
      <uploader/>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
      <player id="player"/>
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
  }
}
</script>
<style>
  #player {
    height: 100%;
  }
</style>
