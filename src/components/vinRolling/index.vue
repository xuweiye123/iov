<!--
  vinNo-select 组件说明
  需特别注意*****若单个页面需使用多次，请增加自定义类名*****
-->
<template>
<div>
  <el-select 
    class="checkboxInput"
    v-model="currentValue"
    filterable
    :filter-method="loadMoreVINFilter"
    multiple 
    :multiple-limit="8"
    placeholder="请选择，最多可选择8个"
    v-loadmore="loadMoreVIN"
    clearable
    @clear="clearVINFilter"
    :loading="loadingDropVin" 
    @visible-change="visibleChangeVin($event)"  
    @focus="blurClear('a','select')"
    @change="selectVin"
    ref="select"
    >
    <div
      v-if="!canSearchVin"
      class="info-tips"
    >至少输入6位搜索</div>
    <el-option
      v-for="(item,index) in vinListArr"
      :key="index"
      :label="item"
      :value="item">
    </el-option>
    <div
        v-if="loadingDropVinMore"
        class="icon-loading"
    >
    </div>
  </el-select>
</div>
</template>

<script>
import { getComboxCarPageList } from '@/api/commont'
export default {
  name: 'vinRolling',
  model: {
    prop: 'value',
    event: 'returnValue'
  },
  props: {
    value: Array|String,
    // importVinList:{
    //   type: Array,
    // }
  },
  watch: {
    value(e1){
      this.currentValue = e1;
      if (e1.length < 6 && e1.length > 0) {
        this.canSearchVin = false;
      } else {
        this.canSearchVin = true;
        this.getVINMore()
        console.log(111)
      }
    }
  },
  mounted(){
  },
  data() {
    return {
      vinListArr:[],
      pageNum:1,
      pageSize:10,
      vin1:"",
      vinListSearch: [],
      vin_total: 11,
      vin_code: "",
      loadingDropVinMore: false,
      loadingDropCodeMore: false,
      loadingDropVin: false,
      canSearchVin: true,
      currentValue: this.value,
    }
  },
  methods: {
    selectVin(e){
      console.log(e,"2222222")
      this.$emit('returnValue', e)
    },
   /**
     * @name: 加载vin数据
     * @param {*}
     */
    loadMoreVIN() {
      this.pageNum += 1;
      // console.log(this.pageNum,"this.pageNum111111")
      this.getVINMore()
    },
    /**
     * @name: vin输入搜索
     * @param {*} value
     */
    loadMoreVINFilter(value) {
      this.vin_code = value;
      this.vin1 = this.vin_code;
      this.pageNum = 1;
      // console.log(11111)
      if (this.vin1.length < 6 && this.vin1.length > 0) {
        this.canSearchVin = false;
      } else {
        // console.log(2222)
        this.canSearchVin = true;
        // this.getVin();
        this.getVINList()
      }
    },
     // 任务号列表
    getVINList(){
      this.loadingDropVin = true;
      this.vin1 = this.vin_code;
      let params={
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        vinNo:this.vin1,
      }
      getComboxCarPageList(params).then(res=>{
        if(res.data.code==0){
         let dataList = res.data.data?res.data.data.map((item)=>{return item.vinNo}):[];

          this.loadingDropVinMore = false;
          this.vin_total = res.data.total;
          this.loadingDropVin = false;
          if(res.data.data&&res.data.data.length>0){
            this.vinListArr =[]
            this.vinListArr = [...this.vinListArr, ...dataList];
            // console.log(this.vinListArr,"dataList",dataList)
          }else{
            this.vinListArr =[]
          }
        }else{
           this.vinListArr=[]
        }
      })
    },
    /**
     * @name: 清空vin搜索
     * @param {*}
     */
    clearVINFilter() {
      this.pageNum = 1;
      this.vin_total = 100;
      this.vin_code = "";
      
      if (this.vin1.length < 6 && this.vin1.length > 0) {
        this.canSearchVin = false;
      } else {
        this.canSearchVin = true;
        this.getVINMore()
      }
    },
    /**
     * @name: 任务号列表 加载更多
     * @param {*}
     */
    getVINMore() {
      // console.log(this.pageNum,this.pageSize)
      if (this.pageNum  > Math.ceil(this.vin_total/this.pageSize)) {
        // console.log(this.pageNum,this.pageNum  > Math.ceil(this.vin_total/this.pageSize))
        return;
      }
      this.loadingDropVinMore = true;
      // console.log("vin_code", this.vin_code);
      this.vin1 = this.vin_code;
      let params={
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        vinNo:this.vin1,
      }
       getComboxCarPageList(params).then(res=>{
          if (res.data.code==0) {
            let dataList = res.data.data?res.data.data.map((item)=>{return item.vinNo}):[];
            this.vin_total = res.data.total;
            this.loadingDropVinMore = false;
            if(res.data.data&&res.data.data.length>0){
              if(this.pageNum==1){
                this.vinListArr=[]
              }
              this.vinListArr = [...this.vinListArr, ...dataList];
            }else{
              this.vinListArr =[]
            }
            // this.vinListArr = [...this.vinListArr, ...res.data.data];
          }
        })
        .catch(() => {});
    },
    visibleChangeVin(e) {
      // console.log('323333',e);
     if (e) {
        if (
          this.vin1.length < 6 &&
          this.vin1.length > 0
        ) {
          this.canSearchVin = false;
        } else {
          this.pageNum = 1;
          this.canSearchVin = true;
          this.getVINList();
        }
      }
    },
    blurClear(flag,ref){
      // console.log("获得")
      this.$refs[ref].$refs.input.blur=()=>{
        // console.log("失去")
        this.vin1='';
        this.vin_code = "";
        this.pageNum = 1;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.info-tips {
  padding: 3px 16px 6px;
  color: #999;
  border-bottom: 1px solid #e8e8e8;
}
.icon-loading {
  background: url("../../assets/images/loading.gif") no-repeat center;
  background-size: 100% 100%;
  width: 18px;
  height: 18px;
  margin: 0 auto;
}
  
</style>
