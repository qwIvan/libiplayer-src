<template>
  <video-player :options="videoOptions"/>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  export default {
    components: {
      videoPlayer
    },
    computed: {
      videoOptions () {
        return {
          source: {
            type: 'video/mp4',
//            src: 'http://7xkwa7.media1.z0.glb.clouddn.com/sample_video_H'
            src: this.videoUrl
          },
          playbackRates: [0.5, 1, 2, 4, 8]
        }
      }
    },
    props: {
      videoUrl: String
    }
  }
</script>

<style>
  .video-js.vjs-custom-skin {
    height: 100%;
  }
</style>
