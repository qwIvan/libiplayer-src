<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <img src="~assets/logo.png" class="avatar">
      <q-toolbar-title :padding="0"/>
      <search ref="search" @result="result" id="search" class="on-right"/>
      <uploader @response="response"/>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
      <player :videoUrl="videoUrl" id="player"/>
    </div>
  </q-layout>
</template>

<script>
  import Player from './Player.vue'
  import Uploader from './Uploader.vue'
  import Search from './Search.vue'
  import Request from 'vue-resource/src/http/request'

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
        this.videoUrl = new Request({
          url: 'http://libivan.com:8888{/hash}{/filename}',
          method: 'GET',
          params: {
            hash: item.hash,
            filename: item.label
          }
        }).getUrl()
//        Resource.File.get({
//          hash: item.value,
//          filename: item.label
//        })
      }
    },
    data () {
      return {
//        videoUrl: 'http://7xkwa7.media1.z0.glb.clouddn.com/sample_video_H'
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
