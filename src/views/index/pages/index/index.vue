<style lang="less" scoped>
    @import (reference) '~@/assets/css/base.less';
    @import './index.less';
</style>

<template>
    <div @click="handleclick">{{getInfos}}</div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'getInfos'
    ])
  },
  methods: {
    ...mapActions([
      'test'
    ]),
    handleclick () {
      let payload = parseInt(Math.random() * 1000)
      this.test(payload)
    }
  }
}
</script>
