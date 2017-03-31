<template>
  <q-autocomplete @click.native="click" @close="close" @open="open" ref="autocomplete" v-model="magnet" :min-characters="0"
                  :max-results="Infinity" @search="search" @selected="selected">
    <q-search :value="(focused || triggered)? magnet : filename || magnet" @input="magnet = arguments[0]" @focus="focus"
              @blur="focused = false" placeholder="magnet:?xt=urn:btih:..." class="primary" icon="sentiment_neutral"/>
  </q-autocomplete>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        magnet: '',
        focused: false,
        filename: '',
        triggered: false
      }
    },
    created () {
      let params = this.$route.params
      if (params.hasOwnProperty('hash') && params.hasOwnProperty('file')) {
        this.magnet = 'magnet:?xt=urn:btih:' + params.hash
        this.filename = params.file
        document.title = this.filename
        this.$emit('result', this)
      }
    },
    computed: {
      hash () {
        let groups = /magnet:\?xt=urn:btih:([\da-f]{40})/.exec(this.magnet) || /([\da-f]{40})/.exec(this.magnet)
        if (!groups) return ''
        return groups[1]
      }
    },
    methods: {
      // PR #492
      open () {
        this.triggered = true
      },
      close () {
        this.triggered = false
      },
      trigger (resp) {
        this.magnet = 'magnet:?xt=urn:btih:' + resp.hash_hex
        this.$refs.autocomplete.results = resp.file_list.map(file => ({
          label: file.filename,
          value: this.magnet,
          hash: this.hash
        }))
        this.$refs.autocomplete.$refs.popover.open()
      },
      search (magnet, done) {
        if (!this.hash) {
          done([])
          return
        }
        axios.get('http://libivan.com:8888/' + this.hash).then(resp => {
          done(resp.data.file_list.map(file => ({
            label: file.filename,
            value: 'magnet:?xt=urn:btih:' + this.hash,
            filename: file.filename,
            hash: this.hash
          })))
        })
      },
      selected (item) {
        this.filename = item.filename
        this.$router.push({
          name: 'player',
          params: {
            hash: item.hash,
            file: item.filename
          }
        })
        this.$emit('result', item)
        document.title = this.filename
      },
      // PR #491
      focus () {
        this.focused = true
      },
      click  () {
        this.$refs.autocomplete.trigger()
      }
    }
  }
</script>
