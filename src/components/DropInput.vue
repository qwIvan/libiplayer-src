<template>
  <q-autocomplete id="autocomplete" ref="autocomplete" :value="hash || value" :delay="0" :min-characters="0"
                  :max-results="Infinity" @search="search" @selected="selected" @close="close" @open="open">
    <q-search @keydown.native.stop.capture :value="opened ? magnet : filename || magnet" @input="input"
              @focus="focus" placeholder="magnet:?xt=urn:btih:..." class="primary" :icon="face" ref="search"/>
  </q-autocomplete>
</template>

<script>
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
        opened_: false
      }
    },
    computed: {
      face () {
        return 'sentiment_neutral'
      },
      opened: {
        get () {
          return this.opened_
        },
        set (val) {
          this.opened_ = val
          if (val) {
            setTimeout(() => this.$refs.autocomplete.trigger(), 0)
            this.$refs.search.$el.querySelector('input').focus()
            this.$refs.search.$el.querySelector('button.q-search-clear').style.display = ''
          }
          else {
            setTimeout(() => {
              this.$refs.search.$el.querySelector('button.q-search-clear').style.display = 'none'
            }, 0)
            this.$refs.autocomplete.close()
            this.$refs.search.$el.querySelector('input').blur()
          }
        }
      },
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
        if (this.$refs.search.$el.querySelector('input') === e.target) {
          e.stopPropagation()
        }
        else if (this.$refs.search.$el.querySelector('button.q-search-clear i') === e.target) {
          e.stopPropagation()
          this.magnet = ''
          this.$refs.search.$el.querySelector('input').focus()
        }
        else {
          this.opened = false
        }
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
