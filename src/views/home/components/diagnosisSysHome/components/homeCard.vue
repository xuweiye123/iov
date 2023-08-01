<template>
  <div class="home-card">
    <div class="home-card-box-title">
      <p class="box-title box-title-left">
        <svg-icon :icon-class="iconName"/>&nbsp;
        <span>{{ titleLeft }}</span>
      </p>
      <p class="box-title box-title-right">
        <slot name="title-right">
          <span @click="getMore">{{ titleRight }}</span>
        </slot>
        <span>{{yesterday}}</span>
        <span>{{lastWeek}}</span>
        <span>{{lastMonth}}</span>
      </p>
    </div>
    <div class="box-content">
      <slot name="content"></slot>
    </div>
    
  </div>
</template>

<script>
import { Stream } from 'stream';
  export default {
    name: 'HomeCard',
    props:{
      iconName:{
        type: String,
        default: ''
      },
      titleLeft: {
        type: String,
        default: ''
      },
      titleRight: {
        type: String,
        default: ''
      },
      yesterday:{
        type: String,
        default: ''
      },
      lastWeek: {
        type: String,
        default: ''
      },
      lastMonth: {
        type: String,
        default: ''
      },
      titleCenter: {
        type:String,
        default:''
      },
      compareCount: {
        type:String,
        default:''
      },
      comparePercent: {
        type:String,
        default:''
      },
      compareContent: {
        type:String,
        default:''
      }
    },
    methods:{
      getMore(){
        this.$emit('click-more')
      }
    }
  }
</script>

<style lang="scss" scoped>
P{
  margin: 0;
}
.home-card{
  height: 100%;
   border-radius: 10px;
  .home-card-box-title{
    padding: 10px 15px;
    // border-bottom: 1px solid #f6f6f6;
    p{
      &.box-title{
        // font-size: 15px;
        display: inline-block;
        vertical-align: middle;
      }
      &.box-title-left{
        // font-weight: bold;
        span{
          font-size: 12px;
        }
        svg{
          font-size:14px;
        }
      }
      &.box-title-right{
        float: right;
        font-size: 12px;
        color:  #0FA5F6;
        margin-top: 5px;
        cursor: pointer;
      }
    }
    span{
      padding-left: 10px;
    }
  }
}


</style>