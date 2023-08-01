
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    iconType: {
      type: String,
      default: 'i'
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { iconType, icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (iconType === 'i') {
        vnodes.push(<i class={icon}/>)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }
     if(title==="首页"){
        vnodes.push(<span class="home secendText" slot='title'>{(title)}</span>)
      }else{
        vnodes.push(<span class="secendText" slot='title'>{(title)}</span>)
      }
    return vnodes
  }
}
</script>
<style lang="scss">
.secendText{
  margin-left: 3px;
}
</style>
