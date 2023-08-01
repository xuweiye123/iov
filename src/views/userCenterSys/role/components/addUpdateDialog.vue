

<template>
  <app-drawer
      :visibles="visibles"
      :title="isSeePermisson?'查看角色':!isEdit? '新增角色':'编辑角色'"
      :wrapperClosable="isSeePermisson"
      :width="'700px'"
      @close-drawer="closeDialog"
      @ok-drawer="submitForm"
      :isOkButLoading="loading"
      :isDrawerFoot="!isSeePermisson"
    >
    <div slot="drawerContent">
      <div :style="{ 'min-height': '15vh' }">
        <el-row
          type="flex"
          justify="center"
          >
          <el-col :span="24">
            <el-form
              ref="formCenter"
              :rules="rules"
              :model="formInfo"
              :label-position="'right'"
              label-width="95px"
            >
              <!-- <vue-linetitle> -->
                <el-form-item
                  label="角色名称："
                  prop="roleName"
                >
                  <el-input
                    v-model="formInfo.roleName"
                    :maxlength="20"
                    clearable
                    placeholder="请输入角色名称"
                    :disabled="isSeePermisson"
                  />
                </el-form-item>
                <el-form-item label="角色描述：">
                  <el-input
                    v-model="formInfo.remark"
                    :maxlength="200"
                    :rows="4"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    resize="none"
                    placeholder="请输入角色描述"
                    type="textarea"
                    :show-word-limit="true"
                    :disabled="isSeePermisson"
                  />
                </el-form-item>
                <el-form-item label="权限设置：" required style="margin-bottom: 0;">
                  <div class="tree-wrap divScroll" :style="{maxHeight: (drawerBodyHeightPx - 160) +'px'}">
                    <!-- <el-scrollbar
                      style="height:100%"
                      wrap-class="default-scrollbar__wrap"
                    > -->
                      <el-row
                        type="flex"
                        justify="center"
                      >
                        <el-col :span="24">
                          <el-checkbox
                            class="allCheckBox"
                            v-if="treeData.length&&!isSeePermisson"
                            :indeterminate="isIndeterminate"
                            v-model="isAllChecked"
                            @change="allCheckedChange"
                            style="margin-left: 24px;"
                          >全选</el-checkbox>
                          <!-- check-strictly 关联选择-->
                          <!-- :filter-node-method="filterNode" -->
                          <el-tree
                            ref="tree"
                            v-loading="treeLoading"
                            :data="treeData"
                            show-checkbox
                            node-key="functionId"
                            :default-expand-all="false"
                            :expand-on-click-node="isSeePermisson"
                            :check-on-click-node="true"
                            :props="defaultProps"
                            :default-checked-keys="defaultCheckedKeys"
                            @check="treeCheck"
                            :check-strictly="true"
                          >
                            <span
                              class="custom-tree-node"
                              slot-scope="{node, data }"
                            >
                              <span v-if="node.level===1">
                                <span class="ml-xs">{{ node.title }}</span>
                              </span>
                              <span>{{ data.functionName }}</span>
                            </span>
                          </el-tree>
                            
                        </el-col>
                      </el-row>
                    <!-- </el-scrollbar> -->
                  </div>
                  
                </el-form-item>
              <!-- </vue-linetitle> -->
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </app-drawer>
</template>
<script>
// request
import { createRole, updateRole, getAllRoleMenu, getRoleSetMenu } from "@/api/system/role";
import { partialForm } from "@/mixins/partialForm";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";

import { isValue } from "@/utils/common";
import { checkFormRule } from "@/mixins/validateOne";
export default {
  name: "roleAddUpdateDialog",
  mixins: [partialForm, drawerOtherHeight, checkFormRule],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isSeePermisson: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      treeLoading: false,
      formInfo: {},
      isAllChecked: false,
      isIndeterminate: false,
      treeLength: 0,
      treeData: [],
      treeDataBefore: [],
      treeDataBaseItem: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: "children",
        label: "functionName",
      },
      treeDataLevel: [],
      rules: {
        roleName: [
          {
            required: true,
            trigger: ["blur", "change"],
            ruleReg: 'functionName',
            tips:'请输入角色名称',
            errorTips: '支持汉字、字母、数字',
            validator: this.validInput,
          },
        ],
      },
    };
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          if (this.isEdit) {
            this.formInfo = { ...this.data };
            this.formInfo.roleId = this.data.roleId;
          } else {
            this.formInfo = { ...{ roleName: "" } };
          }
          this._getTreeData(this.isSeePermisson);
        }
      },
    },
  },
  created() {},
  methods: {
    // 关闭dialog
    closeDialog() {
      this.formInfo = {};
      this.treeData = [];
      this.defaultCheckedKeys = [];
      this.$emit("update:visibles", false);
    },
    // 点击取消
    headleCancel() {
      this.closeDialog();
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createRole(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.loading = false;
            this.$message.success({
              message: "新增成功",
              duration: 2 * 1000,
            });
            this.$emit("add-complete");
            this.closeDialog();
          }else{
            this.loading = false;
            // this.closeDialog();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _Update(postData) {
      this.loading = true;
      updateRole(postData).then(({ data }) => {
        if (data.code === 0) {
          this.loading = false;
          this.$message.success({
            message: "编辑成功",
            duration: 2 * 1000,
          });
          this.$emit("update-complete");
          this.closeDialog();
        }else{
          this.loading = false;
          // this.closeDialog();
        }
      }).catch(() => {
          this.loading = false;
        });
    },


    
    /**
     * 获取角色下的菜单-编辑或查看
     */
    _getTreeDataRoleId(){
      this.treeLoading = true;
      getRoleSetMenu(this.formInfo.roleId).then(({data}) =>{
          this.treeLoading = false;
          if(data.code === 0){
             console.log("getRoleSetMenu-data.data",data.data);
            if(isValue(data.data)){
                let idArr = []
                data.data.map((item)=>{
                  idArr.push(item.functionId);
                  let parentIdArr = item.parentIds?item.parentIds.split(","):[];
                  idArr = [...new Set(idArr.concat(parentIdArr))];
                })
                this.defaultCheckedKeys = idArr;
                // this.defaultCheckedKeys.forEach((item)=>{
                //   this.$refs.tree.filter(item)  
                // })
                if(this.isSeePermisson){
                  this.treeData = this.treeDataBefore;
                  let idAndParentId = [];
                  data.data.forEach((item)=>{
                    idAndParentId.push(item.functionId);
                    let parentIdArr = item.parentIds?item.parentIds.split(","):[];
                    idAndParentId = [...new Set(idAndParentId.concat(parentIdArr))];
                  })
                  this.detNoSelect(this.treeData, idAndParentId);
                  this.setDisable(this.treeData);
                }
                this.$nextTick(function () {
                  this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
                  this.changeState();
                });
            }
             
          }
      })

    },
    
    /**
     * @name: 获取所有角色菜单树
     * @param {*} see
     */
    _getTreeData(see) {
      this.treeLoading = true;
      getAllRoleMenu().then(({ data }) => {
        this.treeLoading = false;
        if (data.code === 0) {
          console.log("data.data", data.data);
          let dataAfter = JSON.parse(JSON.stringify(data.data));
          this.detIsDisabled(dataAfter);//数据过滤-删除禁用
          this.treeDataBaseItem = this.treeLengthFc(dataAfter, [], 1);//树数据的每一项
          if(see){
            this.treeDataBefore = dataAfter;
          }else{
            this.treeData = dataAfter;
            this.treeLength = this.treeDataBaseItem.length;
          }
          this.treeDataLevel = [];
          this.levelFc(this.treeData,1);  
          this.changeState();
          // console.log("1111this.treeData", this.treeData);
          if(this.isEdit){
            this._getTreeDataRoleId();
          }
          
        }
      }).catch(()=>{
         this.treeLoading = false;
      })
    },
    /**
     * @name:设置禁用
     * @param {*}
     */
    setDisable(data) {
      data.forEach((v) => {
        v.disabled = true;
        if (v.children && v.children.length > 0) {
          this.setDisable(v.children);
        }
      });
    },
    /**
     * @name: 树层级赋值
     * @param {*} 
     */
    levelFc(arr, i){
      if(isValue(arr)){
        arr.forEach((item)=>{
          item.level = i;//设置层级
          this.treeDataLevel.push(item);
          this.levelFc(item.children,i+1)
        })
      }
    },
    //获取树结构子元素id
    getTreeChildId(arrList,arrNew){
      if(isValue(arrList)){
          arrList.forEach((res1) => {
            arrNew.push(res1.functionId);
            this.getTreeChildId(res1.children, arrNew)
        });
      }
    },
    /**
     * @name: 去掉isDisabled = 0 的项  +  非开发人员菜单去掉
     * @param {*} 
     */
    detIsDisabled(arr){
      if(isValue(arr)){
        for (var i = arr.length - 1; i >= 0; i--) {
          // if(arr[i].isDisabled == 0 || (arr[i].url == 'function' && this.$store.state.user.loginName !== 'developer')) {
          if(arr[i].isDisabled == 0 ) {
            arr.splice(i, 1);
          }else {
            this.detIsDisabled(arr[i].children);
          }
        }
      }
    },
    //仅显示选中项
    detNoSelect(arr,idArr){
      if(isValue(arr)){
        for (var i = arr.length - 1; i >= 0; i--) {
          if(
            idArr.every((one)=>{return one!=arr[i].functionId})
          ) {
            arr.splice(i, 1);
          }else {
            this.detNoSelect(arr[i].children,idArr);
          }
        }
      }
    },
    //仅显示选中项-此方案渲染太慢
    filterNode(value, data) {
      if (!value) return true;
      return data.functionId.indexOf(value) !== -1;
    },
    /**
     * @name: 点节点check
     * @param {*}
     */
    treeCheck(currentNode, currentCheck) {
      //关联选择-check-strictly="false"
      // this.changeState();


     //非关联选择-check-strictly="true"
      let check = currentCheck.checkedKeys.indexOf(currentNode.functionId);
      if (check > -1) {//选择
        this.defaultCheckedKeys.push(currentNode.functionId);
        if(isValue(currentNode.parentIds)){
          currentNode.parentIds.split(',').forEach((item)=>{//父级id
            this.defaultCheckedKeys.push(item);
          })
        }
        
        
        if(isValue(currentNode.children)){
          let idList = this.treeLengthFc(currentNode.children, [], 2);
          this.defaultCheckedKeys = this.defaultCheckedKeys.concat(idList);
        }
        this.defaultCheckedKeys = [...new Set(this.defaultCheckedKeys)];
        this.$nextTick(function () {
          this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
          this.changeState();
        });
        // console.log("选择", this.defaultCheckedKeys);
      } else {//取消选择
        if(currentNode.functionType!=2){//菜单
          let arrData = [];
          if(isValue(currentNode.children)){
            arrData = JSON.parse(JSON.stringify(currentNode.children));
          }
          let arr = [];
          this.getTreeChildId(arrData,arr);

          let keys = currentCheck.checkedKeys;
          keys = keys.filter((item) => !arr.some((ele) => ele === item));
          this.defaultCheckedKeys = keys;
          this.defaultCheckedKeys = [...new Set(this.defaultCheckedKeys)];

          //当子集所有菜单取消选中，父级取消
          this.parentUnCheck(currentNode.parentId, currentCheck.checkedKeys, currentCheck.checkedNodes);
         
        }else{//按钮
          this.defaultCheckedKeys = currentCheck.checkedKeys;
        }
        
        this.$nextTick(function () {
          this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
          this.changeState();
        });
        // console.log("取消选择", this.defaultCheckedKeys);
      }
    },
    // 父级取消选中
    parentUnCheck(parentId, checkedKeys, checkedNodes){
      if(parentId){
        let parentCheck = checkedKeys.indexOf(parentId);
        if(parentCheck>-1){
          let parentNode = checkedNodes.filter((item)=>{return item.functionId == parentId})[0];
          let arr2 = parentNode.children.map((item)=>{return item.functionId});//当前节点的父级的子集的id
          let keys2 = JSON.parse(JSON.stringify(this.defaultCheckedKeys));
          keys2 = keys2.filter((item) => arr2.some((ele) => ele === item));
          if(keys2.length==0){//子集全部取消选中
            let i = this.defaultCheckedKeys.indexOf(parentId);
            if(i>-1){
              this.defaultCheckedKeys.splice(i, 1);
              this.parentUnCheck(parentNode.parentId, checkedKeys, checkedNodes);
            }
          }
        }
      }
    },
    /**
     * @name: 树结构全选改变
     * @param {*}
     */
    allCheckedChange(e){
      this.isIndeterminate = false;
      if(e){
        let idList = this.treeLengthFc(this.treeData, [], 2);
        this.$refs.tree.setCheckedKeys(idList);
      }else{
        this.$refs.tree.setCheckedKeys([])
      }
    },
    /**
     * @name: 全选状态
     * @param {*}
     */
    changeState(){
      let checkedCount = this.$refs.tree.getCheckedKeys().length;
      this.isAllChecked = checkedCount === this.treeLength;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.treeLength;
    },
    /**
     * @name: 获取树结构所有节点数
     * @param {*}
     */
    treeLengthFc(data,arr,n){
      for(let item of data){
        if(n==1){
          arr.push(item);
        }else{
          arr.push(item.functionId)
        }
        if(item.children&&item.children.length){
          this.treeLengthFc(item.children, arr, n)
        }
      }
      return arr;
    },

    // 点击提交
    submitForm() {
      if(this.isSeePermisson){
        this.closeDialog();
        return 
      }
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["roleName"],
      });
      if (!formcenter) {
        return;
      }
      this.defaultCheckedKeys = this.$refs.tree.getCheckedKeys();
      if(this.defaultCheckedKeys.length==0){
        this.$message.warning({
          message: "请分配权限！",
          duration: 2 * 1000,
        });
        return;
      }

      let muneArr = []
      this.defaultCheckedKeys.forEach((item)=>{
        this.treeDataBaseItem.forEach((obj)=>{
          if(obj.functionId == item && obj.functionType != 3){
            muneArr.push(item);
          }
        })
      })
      if (!this.isEdit) {
        const param = {
          remark: this.formInfo.remark,
          roleName: this.formInfo.roleName,
          functionIdList: muneArr
        };
        this._Add(param);
      } else {
        const param = {
          remark: this.formInfo.remark,
          roleId: this.formInfo.roleId,
          roleName: this.formInfo.roleName,
          functionIdList: muneArr
        };
        this._Update(param);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-wrap{
  // max-height: calc(100vh - 320px);
  // margin-top: 10px;
  overflow: auto;
}
</style>