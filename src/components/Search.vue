<template>
  <q-autocomplete ref="autocomplete" v-model="magnet" :min-characters="40" :max-results="Infinity" @search="search"
                  @selected="selected">
    <q-search :value="focused? magnet : filename || magnet" @input="magnet = arguments[0]" @focus="focus"
              @blur="focused = false" placeholder="magnet:?xt=urn:btih:..." class="primary" icon="sentiment_neutral"/>
  </q-autocomplete>
</template>

<script>
  import * as Resource from '../resource'

  export default {
    data () {
      return {
        magnet: '',
        focused: false,
        filename: '',
      }
    },
    methods: {
      search (magnet, done) {
        let groups = /magnet:\?xt=urn:btih:([\da-f]{40})/.exec(magnet) || /([\da-f]{40})/.exec(magnet)
        if (!groups) {
          done([])
          return
        }
        let hash = groups[1]
        Resource.File.get({hash: hash}).then(response => {
          done(response.body.file_list.map(file => ({
            label: file.filename,
            value: 'magnet:?xt=urn:btih:' + hash,
            hash: hash
          })))
        })
      },
      selected (item) {
        this.filename = item.label
        this.$emit('result', item)
      },
      focus () {
        this.focused = true
        this.$refs.autocomplete.trigger()
      }
    }
  }
</script>
