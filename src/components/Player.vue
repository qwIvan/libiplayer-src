<template>
  <video-player :options="videoOptions"/>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  export default {
    components: {
      videoPlayer
    },
    data () {
      return {
        videoOptions: {
          source: {
            type: 'video/mp4',
            src: 'http://7xkwa7.media1.z0.glb.clouddn.com/sample_video_H'
          },
          playbackRates: [0.5, 1, 2, 4, 8]
        }
      }
    }
  }
</script>

<style>
  #vjs_video_3 {
    height: 100%;
  }
</style>
