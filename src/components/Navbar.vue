<template>
  <div slot="header" class="toolbar">
    <router-link to="/">
      <img src="~assets/logo.png" class="avatar">
    </router-link>
    <q-autocomplete class="on-right" id="autocomplete" ref="autocomplete" :value="hash || value" :delay="0" :min-characters="0"
                    :max-results="Infinity" @search="search" @selected="selected" @close="close" @open="open">
      <q-search @keydown.native.stop.capture :value="opened ? magnet : filename || magnet" @input="input"
                @focus="focus" placeholder="magnet:?xt=urn:btih:..." class="primary" icon="sentiment_neutral" ref="search"/>
    </q-autocomplete>
    <uploader @response="response" class="on-right"/>
  </div>
</template>

<script>
  import Uploader from './Uploader.vue'
  import axios from 'axios'
  import {api} from '../config'

  function resp2popover (fileList, hash) {
    return fileList.map(file => ({
      label: file.filename,
      value: file.filename,
      filename: file.filename,
      hash: hash
    }))
  }

  export default {
    components: {
      Uploader
    },
    props: {
      filename: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    watch: {
      opened (val) {
        if (val) {
          setTimeout(() => this.$refs.autocomplete.trigger(), 0)
        }
        else {
          this.$refs.autocomplete.close()
        }
      },
      value (val) {
        this.hash = val
      }
    },
    data () {
      return {
        magnet: '',
        resp: {
          hash_hex: '',
          file_list: []
        },
        opened: false
      }
    },
    computed: {
      hash: {
        get () {
          let groups = /([\da-f]{40})/.exec(this.magnet)
          if (!groups) return ''
          return groups[0]
        },
        set (val) {
          this.magnet = val ? `magnet:?xt=urn:btih:${val}` : ''
        }
      }
    },
    methods: {
      input (val) {
        this.magnet = val
      },
      handleClick (e) {
        if (this.$refs.search.$el.querySelector('input') !== e.target) {
          this.opened = false
        }
        else {
          e.stopPropagation()
        }
      },
      response (resp) {
        this.resp = resp
        this.hash = resp.hash_hex
        this.opened = true
      },
      // PR #492
      open () {
        document.removeEventListener('click', this.$refs.autocomplete.$refs.popover.close, true)
        document.addEventListener('click', this.handleClick, true)
        this.opened = true
      },
      close () {
        document.removeEventListener('click', this.handleClick, true)
        this.opened = false
      },
      search (hash, done) {
        if (!hash) return []
        if (this.resp.hash_hex === hash) {
          done(resp2popover(this.resp.file_list, hash))
          return
        }
        axios.get(`${api}/${hash}`).then(resp => {
          this.resp = resp.data
          done(resp2popover(this.resp.file_list, hash))
        })
      },
      selected (item) {
        this.$router.push({
          name: 'player',
          params: {
            hash: item.hash,
            filename: item.filename
          }
        })
      },
      // PR #491
      focus () {
        this.opened = true
        setTimeout(() => this.$refs.search.$el.querySelector('input').select(), 0)
      }
    }
  }
</script>

<style>
  #autocomplete {
    width: 100%
  }

  #autocomplete ::selection {
    background-color: #027be3;
  }
</style>
