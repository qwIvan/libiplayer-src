<template>
  <div slot="header" class="toolbar">
    <router-link to="/">
      <img src="~assets/logo.png" class="avatar">
    </router-link>
    <q-autocomplete class="on-right" id="autocomplete" ref="autocomplete" :value="hash" :delay="0" :min-characters="0"
                    :max-results="Infinity" @search="search" @selected="selected" @close="close" @open="open">
      <q-search @keydown.native.stop.capture :value="focused ? magnet : filename || magnet" @input="input"
                @focus="focus" @blur="blur" placeholder="magnet:?xt=urn:btih:..." class="primary"
                icon="sentiment_neutral" ref="search"/>
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
    data () {
      return {
        magnet: '',
        focused: false,
        resp: {
          hash_hex: '',
          file_list: []
        }
//        triggered: false
      }
    },
    computed: {
      hash: {
        get () {
          let groups = /([\da-f]{40})/.exec(this.magnet)
          if (!groups) return this.value
          return groups[0]
        },
        set (val) {
          this.magnet = `magnet:?xt=urn:btih:${val}`
//          this.$refs.autocomplete.trigger()
        }
      }
    },
    methods: {
      input (val) {
        this.magnet = val
      },
      handleClick (e) {
        if (this.$refs.search.$el.querySelector('input') !== e.target) {
          this.$refs.autocomplete.$refs.popover.close()
        }
        else {
          e.stopPropagation()
        }
      },
      response (resp) {
        this.resp = resp
        this.hash = resp.hash_hex
        setTimeout(() => this.$refs.search.focus(), 0)
      },
      // PR #492
      open () {
        document.removeEventListener('click', this.$refs.autocomplete.$refs.popover.close, true)
        document.addEventListener('click', this.handleClick, true)
//        this.triggered = true
      },
      close () {
        document.removeEventListener('click', this.handleClick, true)
//        this.triggered = false
      },
      search (hash, done) {
        if (!hash) return []
        if (this.resp.hash_hex === hash) {
          done(resp2popover(this.resp.file_list, this.hash))
          return
        }
        axios.get(`${api}/${hash}`).then(resp => {
          done(resp2popover(resp.data.file_list, this.hash))
          this.resp = resp.data
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
//        alert('focus')
        this.focused = true
        this.$refs.autocomplete.trigger()
        let vm = this
        setTimeout(() => vm.$refs.search.$el.querySelector('input').select(), 0)
      },
      blur () {
        this.focused = false
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
