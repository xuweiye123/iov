<template>
  <div>
    <div class="s3Box">
      <el-tabs class="unsetHeight" v-model="carTypeActiveName" @tab-click="tabsClick">
        <el-tab-pane label="按项目代号添加" name="first">
          <el-input
            v-if="isEdit!==4"
            v-model="carTypeValue"
            @keyup.enter.native="getBatchListFc"
            class="borderRadius borderInput"
            placeholder="输入车型/项目代号搜索"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              type="primary"
              @click="getBatchListFc"
            ></el-button>
          </el-input>
          <div
            class="divScroll firstCot"
            :style="isEdit===3?'max-height: calc(100vh - 273px);':'max-height: calc(100vh - 358px);'"
          >
            <el-checkbox
              class="allCheckBox"
              v-if="carTypeData.length&&isEdit!=4"
              :indeterminate="isIndeterminate"
              v-model="isAllChecked"
              @change="allCheckedChange"
              style="margin-left: 24px;"
            >全选</el-checkbox>
            <el-tree
              ref="carTypeTree"
              :data="carTypeData"
              v-loading="carTypeLoading"
              node-key="id"
              :props="carTypeDefaultProps"
              :expand-on-click-node="false"
              :default-expand-all="true"
              :check-on-click-node="true"
              show-checkbox
              @check-change="carTypeCheckChange">
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按车辆添加" name="second">
          <div
            class="divScroll tabs2Content"
            :style="isEdit===3?'max-height: calc(100vh - 203px);':'max-height: calc(100vh - 288px);'"
          >
            <app-search style="margin: 12px 0;">
              <div slot="content">
                <el-form :model="listQuery" label-width="70px" style="width: 100%">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="VIN码：">
                        <el-input
                          v-model="listQuery.vinNo"
                          @keyup.enter.native="listLoad"
                          placeholder="请输入VIN码"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="终端编号：">
                        <el-input
                          v-model="listQuery.terminalCode"
                          @keyup.enter.native="listLoad"
                          placeholder="请输入终端编号"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="collapse">
                      <el-form-item label="车型名称：">
                        <el-select
                          v-model="listQuery.carTypeName"
                          @change="getBatchByCarTypeFc"
                          placeholder="请选择"
                          filterable
                          clearable
                        >
                          <el-option
                            v-for="(item,index) in carTypeNameList"
                            :key="index"
                            :label="item.carTypeName"
                            :value="item.carTypeId"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="collapse">
                      <el-form-item label="项目代号：">
                        <el-select
                          v-model="listQuery.carBatchCode"
                          placeholder="请先选车型名称"
                          filterable
                          clearable
                        >
                          <el-option
                            v-for="(item,index) in carBatchCodeList"
                            :key="index"
                            :label="item.carBatchCode"
                            :value="item.carBatchCode"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <!-- 清空按钮 -->
              <app-search-button
                slot="bottom"
                @click-collapse="handleCollapse"
                @click-filter="handleFilter"
                @click-clear="handleClear"
                :isdisabled="listLoading"
              />
            </app-search>

              <!-- @select="select" -->
            <app-table
              slot="table"
              class="secondTable"
              ref="carTable"
              :isTableSelection="true"
              :list="list"
              :listLoading="listLoading"
              :filterTableList="filterTableList"
              :pageObj="listQuery"
              :total="total"
              :rowKey="'carId'"
              :selectable="selectable"
              :cellClass="cellClass"
              :isClickRowSelected="isEdit!==4"
              @row-click="rowClick"
              @select="select"
              @select-all="selectAll"
              @handle-selection-change="handleSelectionChange"
              @sort-change="sortChange"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
            >
              <template slot="tableContent" slot-scope="scope">
                <span>
                  {{
                    scope.row[scope.item.prop] | processData
                  }}
                </span>
              </template>
            </app-table>

            <div class="selectedCarBox">
              <div class="leftText">已选车辆</div>
              <div class="rightContent divScroll">
                <!-- {{selectedCars}} -->
                <el-tag
                  v-for="(item,index) in q.userCarList"
                  :key="index"
                  :closable="isEdit!==4"
                  type="info"
                  :disable-transitions="false"
                  @close="handleClose(item)"
                  style="margin: 3px;"
                >
                  {{item.vinNo}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footerBut">
      <div v-if="isEdit===3">
        <el-button
          v-waves
          @click="close"
        >取消</el-button>
        <el-button
          v-waves
          v-preventReClick
          :loading="setCarButLoading"
          type="primary"
          @click="setUserCarOk"
          :disabled="false"
        >确认</el-button>
      </div>
      <div v-if="isEdit!==3">
        <el-button
          v-waves
          v-preventReClick
          type="primary"
          @click="preStep"
        >上一步</el-button>
        <el-button
          v-waves
          v-preventReClick
          type="primary"
          :loading="butLoading"
          @click="nextStep"
          :disabled="false"
        >{{isEdit===4?'关闭':'下一步'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// request
import {
  getCarType,
  getBatchByCarType,
  getBatchList,
  getCarList,
  createUser,
  updateUser,
  setUserBatchAndCar
} from '@/api/system/user'
// 混入
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
export default {
  // 组件名称
  name: 'step3',
  mixins: [pagingMixin, tableStyle, getPageButton],
  // 组件参数 接收来自父组件的数据
  props: {
    active: {
      type: Number,
    },
    q:{
      type:Object,
    },
    isEdit: {
      type: Number,
      default: 0,
    },
    reLoad: {
      type: Object,
    },
  },
  doNotInit: true,
  watch: {
    active(e){
      // console.log('watch3',e)
      if (e==2) {
        if(this.active===2 && this.reLoad.step3){
          if(this.isEdit && this.q.userCarList && this.q.userCarList.length>0){
            this.q.carIdList = this.q.userCarList.map((item)=>{return item.carId});
            // this.selectedCars = this.q.userCarList.map((item)=>{return item.vinNo}).join('、');
          }
          this.getBatchListFc();
          this.getCarTypeFc();
          this.listLoad();
        }
      }
  
    },
  },
  created() {
    // console.log('created3',this.active,this.reLoad.step3)
    if(this.active===2 && this.reLoad.step3){
      if(this.isEdit && this.q.userCarList && this.q.userCarList.length>0){
        this.q.carIdList = this.q.userCarList.map((item)=>{return item.carId});
        // this.selectedCars = this.q.userCarList.map((item)=>{return item.vinNo}).join('、');
      }
      this.getBatchListFc();
      this.getCarTypeFc();
      this.listLoad();
    }
  },
  data() {
    return {
      carTypeActiveName: 'first',
      carTypeValue:'',
      carTypeLoading: false,
      isAllChecked: false,
      isIndeterminate: false,
      treeLength: 0,
      carTypeData: [],
      carTypeDefaultProps: {
        label: 'label',
        children: 'children'
      },
      batchIdList: [],//项目代号id集合
      carIdList: [],//车辆列表多选id集合

      carTypeNameList: [],
      carBatchCodeList: [],
      listLoading: false,
      isFirstIn: true,//用于编辑时第一次进来表格多选复显
      listQuery: {
        vinNo: "",
        terminalCode: "",
        carTypeName: "",
        carBatchCode: "",
      },
      total: 0,
      list: [],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
          fixed: "left",
          position: "center",
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: 100,
          checked: true,
          position: "center",
        },
        {
          value: "车型名称",
          prop: "carTypeName",
          width: 100,
          checked: true,
          position: "center",
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 70,
          checked: true,
          position: "center",
        },
        {
          value: "营运区域",
          prop: "area",
          width: 70,
          checked: true,
          position: "center",
        }
      ],
      // selectedCars: '',
      butLoading: false,
      setCarButLoading: false,
    }
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
    },
  },
  mounted(){

  },
  methods: {
    /**
     * @name: tabs切换
     * @param {*}
     */
    tabsClick(e){
      
    },
    /**
     * @name: 获取项目信息-tab1-树结构
     * @param {*}
     */
    getBatchListFc(){
      let params = {
        name: this.carTypeValue
      }
      this.carTypeLoading = true;
      this.carTypeData = [];
      getBatchList(params).then(({ data }) => {
        this.carTypeLoading = false;
        if (data.code === 0) {
          // console.log("获取项目信息-tab1-树结构", data.data);
          if(data.data && data.data.length>0){
            this.carTypeData = data.data;
            this.treeLength = this.carTypeData.length;
            this.carTypeData.forEach((item,i)=>{
              item.label = item.carTypeName;
              item.id = i;
              item.children = item.batchList;
              if(item.batchList && item.batchList.length>0){
                item.batchList.forEach((item2)=>{
                  item2.label = item2.carBatchCode;
                  item2.id = item2.carBatchId;
                  this.treeLength = this.treeLength + 1; 
                })
              }
            })
            if(this.isEdit==4){
              this.setDisable(this.carTypeData);
            }
            if(this.isEdit && this.q.batchIdList){
              this.$nextTick(function () {
                this.$refs.carTypeTree.setCheckedKeys(this.q.batchIdList);
                this.changeState();
              });
            }
          }
        }
      }).catch(()=>{
        this.carTypeLoading = false;
      });
    },
    /**
     * @name: 车型树选择
     * @param {*}
     */
    carTypeCheckChange(e){
      this.changeState();
      this.batchIdList = this.$refs.carTypeTree.getCheckedKeys().filter((item)=>{ return item.length > 10 });
      this.q.batchIdList = this.batchIdList;
    },
    /**
     * @name: 树结构全选改变
     * @param {*}
     */
    allCheckedChange(e){
      this.isIndeterminate = false;
      if(e){
        let idList = [];
        this.carTypeData.forEach((item)=>{
          item.children&&item.children.forEach((item2)=>{
            idList.push(item2.id);
          })
        })
        this.$refs.carTypeTree.setCheckedKeys(idList);
      }else{
        this.$refs.carTypeTree.setCheckedKeys([])
      }
    },
    /**
     * @name: 全选状态
     * @param {*}
     */
    changeState(){
      let checkedCount = this.$refs.carTypeTree.getCheckedKeys().length;
      this.isAllChecked = checkedCount === this.treeLength;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.treeLength;
    },
    
    /**
     * @name: 获取车型下拉
     * @param {*}
     */
    getCarTypeFc(){
      getCarType().then(({ data }) => {
        if (data.code === 0) {
          this.carTypeNameList = data.data || [];
        }
      })
    },
    /**
     * @name: 根据车型获取项目代号下拉
     * @param {*}
     */
    getBatchByCarTypeFc(id){
      this.carBatchCodeList = [];
      this.listQuery.carBatchCode = '';
      if(id){
        this.carTypeNameList.forEach((item)=>{ 
          if(item.carTypeId == id){
            this.listQuery.carTypeName = item.carTypeName;
          }
        })
        let params = {
          carTypeId: id
        }
        getBatchByCarType(params).then(({ data }) => {
          if (data.code === 0) {
            this.carBatchCodeList = data.data || [];
          }
        })
      }
    },
    /**
     * @name: 列表清空
     * @param {*}
     */
    handleClear(){
      this.listQuery.vinNo = '';
      this.listQuery.terminalCode = '';
      this.listQuery.carTypeName = '';
      this.listQuery.carBatchCode = '';
      this.carBatchCodeList = [];
      this.listLoad();
    },
    /**
     * @name: 车辆列表数据请求
     * @param {*}
     */
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getCarList(this.listQuery).then(({ data }) => {
        this.listLoading = false;
        if (data.code === 0) {
          this.list = data.data || [];
          this.total = data.total;

          if(this.isEdit && this.q.userCarList.length){
            // this.isFirstIn = false;

            let selectedMarkList = this.q.userCarList.map((item) => item.carId);
            this.list.forEach((row) => {
              if (selectedMarkList.includes(row.carId)) {
                this.$nextTick(() => {
                  this.$refs.carTable.refTable().toggleRowSelection(row, true);
                });
              }else{
                this.$nextTick(() => {
                  this.$refs.carTable.refTable().toggleRowSelection(row, false);
                });
              }
            })
          }
        }
      }).catch(()=>{
        this.listLoading = false;
      })
    },
    /**
     * @name:设置禁用
     * @param {*}
     */
    setDisable(data) {
      data.forEach((v) => {
        v.disabled = true;
        if (v.batchList && v.batchList.length > 0) {
          this.setDisable(v.batchList);
        }
      });
    },
    /**
     * @name: 勾选全部
     * @param {*}
     */
    selectAll(selectedRows){
      // console.log(222,selectedRows)
      let selectedMarkList = this.q.userCarList.map((item) => item.carId);
      // 当前页选中行的标记列表
      let pageSelectedMarkList = Array.isArray(selectedRows)
        ? selectedRows.map((item) => item.carId)
        : [];

      this.list.forEach((row) => {
        if (pageSelectedMarkList.includes(row.carId)) {
          if (!selectedMarkList.includes(row.carId)) {
            this.addItem(row);
          }
        } else if (selectedMarkList.includes(row.carId)) {
          this.removeItem(row);
        }
      });
    },
    /**
     * @name: 点击选中行
     * @param {*}
     */
    rowClick(e){
      if(this.isEdit===4){
        return true
      }

      let arr = this.q.userCarList.map((item)=>{return item.carId});
      if(arr.length){
        let selected = arr.indexOf(e.row.carId) == -1 ? true: false;
        if(selected){
          this.addItem(e.row);
        }else{
          this.removeItem(e.row);
        }
      }else{
        this.addItem(e.row);
      }
    },
    /**
     * @name: 点击关闭tag标签（删除选中车辆）
     * @param {*}
     */
    handleClose(obj){
      this.q.userCarList.forEach((e,i)=>{
        if(e.carId == obj.carId){
          this.q.userCarList.splice(i, 1);
          this.q.carIdList = this.q.userCarList.map((item)=>{return item.carId});
          // this.selectedCars = this.q.userCarList.map((item)=>{return item.vinNo}).join('、');
        }
      })
      this.list.forEach((item)=>{
        if(item.carId == obj.carId){
          this.$refs.carTable.refTable().toggleRowSelection(item, false);
        }
      })
    },
    /**
     * @name: 用户手动勾选
     * @param {*}
     */
    select(selection, row){
      let selected = selection.length && selection.indexOf(row) !== -1;
      if(selected){
        this.addItem(row);
      }else{
        this.removeItem(row);
      }
    },
    /**
     * @name: 添加勾选-更新data
     * @param {*}
     */
    addItem(item){
      this.q.userCarList.push(item);
      this.q.carIdList = this.q.userCarList.map((item)=>{return item.carId});
      // this.selectedCars = this.q.userCarList.map((item)=>{return item.vinNo}).join('、');
    },
    /**
     * @name: 取消勾选-更新data
     * @param {*}
     */
    removeItem(item){
      for(let [index, itemTemp] of this.q.userCarList.entries()){
        if(itemTemp.carId===item.carId){
          this.removeItemByIndex(index);
          break;
        }
      }
    },
    /**
     * @name: 根据下标移除选中项
     * @param {*}
     */
    removeItemByIndex(index) {
      this.q.userCarList.splice(index, 1);
      this.q.carIdList = this.q.userCarList.map((item)=>{return item.carId});
      // this.selectedCars = this.q.userCarList.map((item)=>{return item.vinNo}).join('、');
    },
    /**
     * @name:表格列class
     * @param {row, index}
     */
    cellClass(row){
      if((this.isEdit===4||this.list.length==0)&&row.columnIndex===0){
        return 'disabledSelection'
      }
    },
    /**
     * @name:表格多选是否禁用
     * @param {*}
     */
    selectable(row, index){
      if(this.isEdit===4){
        return false
      }else{
        return true
      }
    },
    /**
     * @name: 多选发生变化
     * @param {*}
     */
    handleSelectionChange(val){
      // console.log('多选发生变化',val)
    },
    /**
    * @name: 取消
    * @param {*}
    */
    close(){
      this.$emit('closeDrawer');
    },
    /**
     * @name: 上一步
     * @param {*}
     */
    preStep(){
      this.reLoad.step3 = 0;
      this.$emit('update:active', 1)
    },
    /**
     * @name: 下一步
     * @param {*}
     */
    nextStep(){
      console.log('step3-nextStep-this.q',this.q)
      if(this.isEdit===4){
        this.$emit('closeDrawer');
        return
      }
      this.butLoading = true;
      this.batchIdList = this.$refs.carTypeTree.getCheckedKeys().filter((item)=>{ return item.length > 10 });
      this.q.batchIdList = this.batchIdList;
      const {
        email,
        loginName,
        userName,
        mobile,
        // userType,
        isAdmin,
        // expiredTime,
        // isSmsLoginVerif,
        isLocationDesensitized,
        isLicensePlateDesensitized,
        isSimIccidDesensitized,
        isNameDesensitized,
        isIdentificationDesensitized,
        isPhoneDesensitized,
        isVinDesensitized,
        userIdList,
        roleIdList,
        batchIdList,
        carIdList,
      } = this.q
      const obj = {
        email,
        loginName,
        userName,
        mobile,
        // userType,
        isAdmin,
        // expiredTime,
        // isSmsLoginVerif,
        isLocationDesensitized,
        isLicensePlateDesensitized,
        isSimIccidDesensitized,
        isNameDesensitized,
        isIdentificationDesensitized,
        isPhoneDesensitized,
        isVinDesensitized,
        userIdList,
        roleIdList,
        batchIdList,
        carIdList,
      }
      if(this.isEdit){
        let params = {
          id: this.q.userId,
          data: obj
        }
        // console.log('step3-nextStep-params',params)
        updateUser(params).then(({ data }) => {
          this.butLoading = false;
          if (data.code === 0) {
            this.reLoad.step3 = 0;
            this.$emit('update:active', 3)
          }
        }).catch(()=>{
          this.butLoading = false;
        });
      }else{
        // console.log('step3-nextStep-obj',obj)
        createUser(obj).then(({ data }) => {
          this.butLoading = false;
          if (data.code === 0) {
            this.reLoad.step3 = 0;
            this.$emit('update:active', 3)
          }
        }).catch(()=>{
          this.butLoading = false;
        });
      }
    },
    /**
     * @name: 分配车辆权限
     * @param {*}
     */
    setUserCarOk(){
      this.setCarButLoading = true;
      this.batchIdList = this.$refs.carTypeTree.getCheckedKeys().filter((item)=>{ return item.length > 10 });
      let params= {
        userId: this.q.userId,
        carIdList: this.q.carIdList,
        batchIdList: this.batchIdList,
      }
      setUserBatchAndCar(params).then(({ data }) => {
        this.setCarButLoading = false;
        if (data.code === 0) {
          this.$emit('addUpdateClose');
        }
      }).catch(()=>{
        this.setCarButLoading = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.s3Box {
  padding: 8px;
}
::v-deep .unsetHeight{
  .el-tabs__header.is-top{
    padding: 0 8px;
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap,
  .el-tabs__nav.is-top{
    height: unset;
    line-height: unset;
  }
  // .el-tabs__nav-wrap::after{
  //   height: 1px;
  // }
  .tabs2Content{
    margin-top: -10px;
  }
  .borderRadius{
    margin-bottom: 8px;
    padding: 10px 350px 10px 10px;
    .el-input__inner {
      border-radius: 4px 0 0 4px !important;
    }
  }
}
.firstCot{
  padding-top: 8px;
}
.secondTable{
  padding: 8px;
}
.selectedCarBox{
  margin-top: 8px;
  display: flex;
  align-items: center;
  .leftText{
    padding: 16px;
  }
  .rightContent{
    padding: 8px;
    flex: 1;
    max-height: 150px;
    overflow: auto;
  }
}
.footerBut {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    max-height: calc(100vh - 280px); // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}
::v-deep .disabledSelection > .cell{
  display: none !important;
}
</style>
