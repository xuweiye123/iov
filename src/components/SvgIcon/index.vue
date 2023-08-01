<template>
  <a>
    <svg :class="svgClass" aria-hidden="true" @mouseenter="isHover=true" @mouseleave="isHover=false">
      <use :xlink:href="iconName" />
    </svg>
  </a>
  
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: false
    },
    className: {
      type: String,
      default: ''
    },
    isChange: {
      type: Boolean,
      default: false
    },
    enterSvg:{
      type: Boolean,
      default: false
    },
    id:{
      type: Number,
      default: 999
    },
    chooseIndex:{
      type: Number,
      default: 999
    }
  },
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    iconName() {
       if(this.enterSvg){
        if(this.enterSvg && this.id==this.chooseIndex){
          return this.enterSvg?`#icon-${this.iconClass}_hover`:`#icon-${this.iconClass}`
        }else{
          return `#icon-${this.iconClass}`
        }
      }else{
        if(this.isChange){
          return this.isHover?`#icon-${this.iconClass}_hover`:`#icon-${this.iconClass}`
        }else{
          return `#icon-${this.iconClass}`
        }
      }
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
