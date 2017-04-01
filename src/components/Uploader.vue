<template>
  <div>
    <q-uploader name="torrent" ref="uploader" @upload="upload" @add="add" @start="start" @finish="finish" :url="url"
                hide-upload-button :labels="labels" @fail="fail"/>
    <q-tooltip max-height="500px" anchor="top left">上传torrent</q-tooltip>
  </div>
</template>

<script>
  import {Loading, Dialog} from 'quasar'
  import {api} from '../config'

  export default {
    data () {
      return {
        labels: {
          add: '<i>cloud_upload</i>'
        },
        url: `${api}/torrent`
      }
    },
    methods: {
      add (files) {
        let uploader = this.$refs.uploader
        uploader.files = uploader.files.concat(files)
        uploader.upload()
      },
      start () {
        this.$refs.uploader.uploading = false
        Loading.show({
          spinnerSize: 250,
          spinner: 'hourglass'
        })
      },
      // PR #496
      fail () {
        Loading.hide()
        Dialog.create({
          title: '上传失败!',
          message: '请确认上传的是torrent文件'
        })
        this.$refs.uploader.files = []
      },
      finish () {
//        this.$refs.uploader.$refs.file.value = ''  # PR #484 resolve it
        Loading.hide()
      },
      upload (name, response) {
        // PR #483
        this.$emit('response', JSON.parse(response))
      }
    }
  }
</script>

<style>
  i {
    animation: inherit !important
  }
</style>
