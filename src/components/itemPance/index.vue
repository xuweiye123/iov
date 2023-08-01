<template>
  <ul class="tab-content">
    <li v-for="(item,index) in list" :key="index"
     :style="{width:item.width?item.width +'px':num }">
      <p class="tab-content-info">
        <!-- :style='{maxWidth: item.leftWidth || myLeftWidth,minWidth: item.leftWidth || myLeftWidth}' -->
        <span class="info-name">
          {{item.name}}：{{item.value}}
        </span>
        <!-- <span class="info-value">{{item.value}}<span v-show="item.value!==''" style="margin-left:3px">{{item.unit}}</span>
        </span> -->
      </p>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'AppItemPance',
    props:{
      list:{
        type: Array,
        default: ()=>[]
      },
      number: {
        type: Number,
        default: 1
      },
      leftWidth: {
        type: [Number,String],
        default: 50
      },
      // textColor: {
      //   type: String,
      //   default:'#606266'
      // },
      leftColor: {
        type: String,
        default: "#ffffff"
      },
      rightColor: {
        type: String,
        default: "#ffffff"
      },
      textMargin:{
        type: Number,
         default: 5
      }
      
    },
    computed:{
      num(){
        
        return (1 / this.number).toFixed(3)*100 + '%'
      },
      myLeftWidth() {
        if(typeof this.leftWidth === 'string'){
          return this.leftWidth + 'px'
        }else{
          return this.leftWidth + '%'
        }
        
      }
    }
  }
</script>

<style lang="scss" scoped>
p{
  margin: 8px 0;
}
.tab-content{
    padding: 10px 15px;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    li{
      text-align: center;
      padding-right: 10px;
      // color: #fff;
      // font-size: 12px;
      .tab-content-info{
        // width: 100%;
        display: flex;
        flex-direction: row;
        // flex-wrap: nowrap;
        span{
          display: inline-block;
          // width: 50%;
          &.info-name{
            text-align: left;
            // font-weight: bold;
            color:#262834;
            flex: auto;
            word-break:break-all;
          }
          //  &.info-value{
          //   text-align: left;
          //   // font-weight: 400;
          //   flex: auto;
          //   word-break:break-all;
          //   color:#262834;
          // }

        }
      }
    }
  }
</style>