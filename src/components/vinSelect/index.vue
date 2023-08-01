<!--
  vin-select 组件说明
  需特别注意*****若单个页面需使用多次，请增加自定义类名*****
-->
<template>
<div :class="['custom-vin-select',customClass]">
  <el-input
    :size="size"
    :loading="loading"
    :disabled="disabled"
    v-model="currentValue"
    placeholder="请输入VIN码"
    @input="getVinNoList"
    @clear="clearData"
    @focus="inputFocus"
    :clearable="clearable"
    :maxlength="17"
  >
    <i slot="suffix" :class=" vinNoList.length>0 && !hidden ? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
  </el-input>
  <div v-show=" vinNoList.length>0 && !hidden" 
    class="custom-vin-select-list">
        <ul>
          <li 
          class="custom-vin-select-item"
          v-for="(item,index) in vinNoList" :key="index" 
          @click="selectValue(item)">
            <span>{{ item.vinNo }}</span>
          </li>
        </ul>
        <div class="popper-arrow"></div>
        <div class="vin-select-pagination">
          <a>
            <el-pagination
              small
              style="padding: 0 10px"
              background
              :current-page="vinQuery.pageNum"
              :page-size="vinQuery.pageSize"
              :total="vinTotal"
              layout="total, prev, next "
              @current-change="vinNoCurrentChange"
            />
          </a>
        </div>
        </div>
  </div>
</template>

<script>
import { 
  getComboxCarPageList,
  getComboxAllCarPageList
} from '@/api/commont'

import {
  getSelectedSys,
} from '@/utils/auth'
export default {
  name: 'VinSelect',
  model: {
    prop: 'value',
    event: 'returnValue'
  },
  props: {
    value: String|Object|Number,
    isVin: { // 返回vin码 或者 obj对象 默认返回obj对象
      type: Boolean,
      default: false
    },
    clearable: { // 是否可以清除
      type: Boolean,
      default: true
    },
    disabled: { // 返回vin码 或者 obj对象 默认返回obj对象
      type: Boolean,
      default: false
    },
    numberSearch: { // 默认从第n位开始查询
      type: Number,
      default: 6
    },
    customClass: {
      type: String,
      default: 'custom-vin'
    },
    size: {
       type: String,
      default: 'small'
    }
  },
  watch: {
    // currentValue(e1){
    //   if(!e1 || e1===undefined || e1 === ''){
    //     this.clearData()
    //   }
    // },
    value(e1){
      if(this.isCall){
        this.$emit('vinNoTotal', "")
      }
      this.currentValue = e1;
      if(!e1 || e1===undefined || e1 === ''){
        this.currentValue = ''
        this.clearData()
        this.$emit('returnValue', '')
      }
      // if(e1.length>this.numberSearch){
      //   if(!this.localData){
      //     return this.vinNoList = []
      //   }
      //   this.vinNoList = this.localData.filter((item)=>{
      //     return item.vinNo.indexOf(e1) != -1
      //   })
      // }
    }
  },
  data() {
    return {
      sysValue: '',
      localData: null,
      loading: false,
      currentValue: this.value,
      vinQuery: {
        pageNum: 1,
        pageSize: 5
      },
      vinTotal: 0,
      vinNoList: [],
      hidden: false,
      isCall:true,
      
    }
  },
  mounted(){
    this.sysValue = getSelectedSys();

    // console.log(this.sysValue,"this.sysValue")

    document.addEventListener('mouseup',(e)=>{
      let customCalss = this.customClass ? `.${this.customClass}` : ''
      let _dom = document.querySelector(`${customCalss}.custom-vin-select`)
      let _select = document.querySelector(`${customCalss} .custom-vin-select-list`)
      let _pagition = document.querySelector(`${customCalss} .vin-select-pagination`)
      if(_pagition && _pagition.contains(e.target)){
        return
      }
      if(_select && _select.contains(e.target)){
        this.hidden = true
        return
      }
      if(_dom){
        if(!_dom.contains(e.target)){
          this.hidden = true
          if (!this.isVin) {
            const index = this.vinNoList.findIndex(item=>item.vinNo===this.currentValue)
            if(index<0){
              this.currentValue = ''
              this.$emit('returnValue', '')
            }
          }
        }else{
          this.hidden = false
        }
      }
    })

  },
  methods: {
    // 获取数据
    getVinNoList(e='') {
      this.$emit('returnValue', e)
      //  if(e.length == this.numberSearch||e.length==17){
      if(e.length >=this.numberSearch && e.length <18){
        this.hidden=false
        this.vinQuery.vinNo = e
        this.vinQuery.pageNum = 1
        this.getComboxCarPageList()
      }
    },
    // // 节流函数
    // throttle(fn, delay = 200) {
    //   let timer = null
    //   return function() {
    //     if (timer) return
    //     timer = setTimeout(() => {
    //       fn.apply(this.arguments)
    //     }, delay)
    //   }.bind(this)
    // },
    getComboxCarPageList() {
      this.isCall=true
      this.loading = true
      if(this.sysValue=="数字钥匙" || this.sysValue=="远程控制"){
        return getComboxAllCarPageList(this.vinQuery).then(({ data }) => {
          if (data.code === 0) {
            this.localData = data.data || []
            this.vinNoList = data.data || []
            this.vinTotal = data.total
          }
        }).finally(() => {
          this.loading = false
        })
      }else{
        return getComboxCarPageList(this.vinQuery).then(({ data }) => {
          if (data.code === 0) {
            this.localData = data.data || []
            this.vinNoList = data.data || []
            this.vinTotal = data.total
          }
        }).finally(() => {
          this.loading = false
        }) 
      }
      
    },
    // 点击item
    selectValue(e){
      let val = ''
      if (e ) {
        if (this.isVin) {
          val = e.vinNo
        } else {
          val = e
        }
        this.currentValue = e.vinNo
      }
      this.hidden=true
      this.isCall=false
      this.$emit('returnValue', val)
      console.log(e,111)
      this.$emit('vinNoTotal', e.vinNoTotal)
    },
    // 获取焦点重新加载数据
    inputFocus(){
      console.log(this.hidden)
      this.hidden = false
      this.getVinNoList(this.currentValue)
    },
    // 清除
    clearData() {
      this.vinNoList = []
      this.vinTotal = 0
      this.$emit('clearData')
    },
    // 分页器改变
    vinNoCurrentChange(value) {
      this.vinQuery.pageNum = value
      this.getComboxCarPageList()
    }
  }
}
</script>

<style lang="scss" scoped>
ul{
  padding: 0 !important;
}
.custom-vin-select{
  position:relative;
  height:auto
}

.custom-vin-select-list{
  position:absolute;
  top:35px;
  left:0;
  width:100%;
  height:auto;
  z-index:999;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .custom-vin-select-item{
    cursor:pointer;
    span{
      margin-left:20px
    }
  }
  
  .vin-select-pagination{
    position: sticky;
    height:30px;
    top:0;
    z-index:999;
  }
}

  
</style>
