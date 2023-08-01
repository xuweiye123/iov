export default {
    bind(el, binding) {
        el.__vueSetTimeoutIndex__ = setTimeout(() => {
            // 清除当前tabIndex
            el.removeAttribute('tabindex')
            clearTimeout(el.__vueSetTimeoutIndex__)
          }, 0)
    },
    unbind(el) {
        clearTimeout(el.__vueSetTimeoutIndex__)
      }
  }
  