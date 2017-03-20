<template>
  <div>
    <q-uploader @add="add" :url="url" hide-upload-button :labels="labels"></q-uploader>
    <q-tooltip max-height="500px" anchor="top left">上传torrent</q-tooltip>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labels: {
        add: '<i>cloud_upload</i>'
      },
      url: 'libivan.com:888/torrent'
    }
  },
  methods: {
    add: (what) => {
      this.upload()
    }
  }
}
</script>

<style>
i {
  animation: inherit!important
}
</style>
