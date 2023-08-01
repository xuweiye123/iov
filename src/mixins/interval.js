export default {
  data() {
    return {
      interval: 10 * 1000,
      timeout: null
    }
  },
  methods: {
    doRefresh() {
      this.clearTimeout()
      this.refresh().finally(() => {
        this.timeout = window.setTimeout(() => {
          this.doRefresh()
        }, this.interval)
      })
    },
    clearTimeout() {
      window.clearTimeout(this.timeout)
    }
  },
  beforeDestroy() {
    this.clearTimeout()
  }
}
