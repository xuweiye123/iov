<template>
  <div class="car-titke-div">
    <h3 v-show="title" class="car-title">
      <svg-icon
        v-if="!iconConfig.isIcon"
        :icon-class="iconConfig.icon"
        style="margin-left: 8px"
      />
      <i v-else :class="iconConfig.icon" />
    &nbsp;{{ title }}
      <div style="float: right">
        <slot name="right" />
      </div>
    </h3>
    <div style="padding:10px 5px">
      <slot ></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VueLinetitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    iconConfig: {
      // isSvg: true
      //  font-size: 12px
      // color: default
      //
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="scss" scoped>
.car-titke-div{
  border-radius: 5px;
  margin-bottom: 5px;
  .car-title{
    padding: 0 5px;
    margin: 0;
    color: #109CFF;
    padding: 5px 0;
    line-height: 30px;
    margin-top:0;
    font-size: 14px!important;
    border-bottom: 2px solid #E2F1FF;
    svg{
      font-size: 14px!important;
    }
  }

}

</style>
