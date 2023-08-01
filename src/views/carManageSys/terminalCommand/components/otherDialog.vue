<template>
  <app-dialog
    :visibles="visibles"
    :title="'参数设置'"
    width="80%"
    @close-dialog="closeDialog"
    @handle-submit="submit"
    :isFooter="true"
    >
    <div slot="formContent">
      <el-table
        size="mini"
        :data="list"
        :header-row-style="headerRowStyle"
        :row-style="rowStyle"
        :header-cell-style="headerCellStyle"
        :show-header="false"
        border
        fit
        style="width: 100%">
        
        <el-table-column
          v-for="(item,index) in tableList"
          :key="index"
          :label="item.value"
          :prop="item.prop"
          :align="item.position"
          :min-width="item.width"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.prop==='param'">
              <el-input clearable v-model="formInfo.param" maxlength="100"></el-input>
            </span>
            <span v-else>
              {{
                scope.row[item.prop] | processData
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </app-dialog>
</template>

<script>
import { tableStyle } from '@/mixins/tableStyle'
export default {
  name: "otherDialog",
  props: {
    visibles: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: ()=>({})
    }
  },
  mixins: [ tableStyle ],
  watch:{
    visibles(e1){
      if(e1){
        this.list = [this.data]
      }
   }
  },
  data() {
    return {
     tableList: [
        { value: "命令名称", prop: "commandName",position: "center",width:150 },
        { value: "参数", prop: "param",position: "center",width:200 },
        { value: "备注", prop: "remark",position: "center",width:300 },
      ],
      list: [],
      formInfo: {
        param: ''
      }
    };
  },
  methods: {
    restData(){
     this.list = []
     this.formInfo.param = ''
    },
    // 关闭
    closeDialog() {
      this.restData()
      this.$emit("update:visibles", false)
    },
    // 取消
    handleCancle() {
      this.closeDialog();
    },
    // 提交
    submit() {
      let reg = new RegExp(this.data.reservedField2)
      // let reg = new RegExp(this.data.reservedField2.split("\n")[0])
     if(!reg.test(this.formInfo.param)){
       this.$message.warning({
         message: '请按正确格式填写',
          duration: 2000
       })
       return 
     }
     const postData = {
       param: this.formInfo.param
     }
      this.$emit('params-edit-success',postData)
      this.closeDialog()
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table .cell div{
 overflow: visible !important;
}
</style>