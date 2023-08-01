<template>
  <div>
    <div class="s2Box">
      <div
        class="s2Left"
        :style="isEdit===2?'height: calc( 100vh - 165px );':'height: calc( 100vh - 251px );'"
      >
        <el-input
          v-if="isEdit!==4"
          v-model="inputRoleValue"
          class="input-with-select borderInput"
          style="padding: 8px;"
          placeholder="请输入"
        >
          <el-select v-model="roleByType" slot="prepend">
            <el-option label="角色名称" value="角色名称"></el-option>
            <el-option label="用户名" value="用户名"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            type="primary"
            @click="searchFc"
          ></el-button>
        </el-input>
        <div v-if="isEdit==4" class="see input-with-select">所选角色</div>
        <el-scrollbar
          wrap-class="default-scrollbar__wrap"
          style="padding-top: 8px;"
          :style="isEdit===2?'height: calc( 100vh - 230px );':'height: calc( 100vh - 314px );'"
        >
          <el-tree
            ref="leftTree"
            :data="leftData"
            v-loading="leftLoading"
            node-key="id"
            :props="leftDefaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            show-checkbox
            @check-change="leftCheckChange">
          </el-tree>
        </el-scrollbar>
      </div>
      <div
        class="s2Right"
        :style="isEdit===2?'height: calc( 100vh - 165px );':'height: calc( 100vh - 251px );'"
      >
        <div class="rightTop"><span style="color:#262834;font-weight: bold;">权限展示</span>（勾选左侧角色名称后显示菜单权限）</div>
        <div
          class="divScroll"
          :style="isEdit===2?'height: calc( 100vh - 237px );':'height: calc( 100vh - 321px );'"
        >
          <!-- :check-strictly="true" -->
          <el-tree
            ref="rightTree"
            :data="rightData"
            v-loading="rightLoading"
            node-key="functionId"
            :props="rightDefaultProps"
            :default-checked-keys="rightDefaultCheckedKeys"
            :default-expand-all="false"
            show-checkbox>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="footerBut">
      <div v-if="isEdit===2">
        <el-button
          v-waves
          @click="close"
        >取消</el-button>
        <el-button
          v-waves
          v-preventReClick
          :loading="butLoading"
          type="primary"
          @click="setRoleOk"
          :disabled="false"
        >确认</el-button>
      </div>
      <div v-if="isEdit!==2">
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
          @click="nextStep"
          :disabled="false"
        >下一步</el-button>
      </div>
      
      
    </div>
  </div>
</template>
<script>
// request
import {
  getUserByLoginName,
  getRoleFunctionByRole,
  getRoleFunctionByUser,
  setUserRole,
} from '@/api/system/user'
import {
  getRoleByName,
  getAllRoleMenu,
} from '@/api/system/role'
import { isValue } from "@/utils/common";

export default {
  // 组件名称
  name: 'step2',
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
  watch: {
    active(e){
      // console.log('watch2',this.active,this.reLoad.step2)
      if (e==1) {
        if(this.active===1&&this.reLoad.step2){
          this.leftLoading = true;
          getAllRoleMenu().then(({ data }) => {
            this.leftLoading = false;
            if (data.code === 0) {
              // console.log("data.data", data.data);
              this.treeDataBase = data.data;
              this.hasAuthority(this.treeDataBase);
              this.searchFc();
            }
          }).catch(()=>{
            this.leftLoading = false;
          })
        }
      }
  
    },
  },
  created() {
    // console.log('created2',this.active,this.reLoad.step2)
    if(this.active===1&&this.reLoad.step2){
      //获取所有菜单权限树结构
      this.leftLoading = true;
      getAllRoleMenu().then(({ data }) => {
        this.leftLoading = false;
        if (data.code === 0) {
          // console.log("data.data", data.data);
          this.treeDataBase = data.data;
          this.hasAuthority(this.treeDataBase);       
          this.searchFc();
        }
      }).catch(()=>{
        this.leftLoading = false;
      })
    }
  },
  data() {
    return {
      leftData: [],
      leftDefaultProps: {
        label: 'label',
        // children: 'children'
      },
      roleByType: '角色名称',
      inputRoleValue: '',
      leftLoading: false,
      isRole: true,
      leftSelectedIdArr: [],

      treeDataBase: [],
      rightData: [],      
      rightDefaultProps: {
        label: "functionName",
        children: "children",
      },
      rightLoading: false,
      isFirst: true,
      rightDefaultCheckedKeys:[],

      butLoading: false,
      
    };
  },
  mounted(){

  },
  methods: {
    
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
     * @name:获取tree  functionId
     * @param {*}
     */
    getTreeId(data, idArr) {
      data.forEach((v) => {
        idArr.push(v.functionId);
        if (v.children && v.children.length > 0) {
          this.getTreeId(v.children, idArr);
        }
      });
    },
    /**
     * @name: 查询
     * @param {*}
     */
    searchFc(){
      // console.log('roleByType:',this.roleByType)
      this.rightData = [];
      if(this.roleByType=="角色名称"){
        this.isRole = true;
        this.getRoleByNameFc()
      }else if(this.roleByType=="用户名"){
        this.isRole = false;
        this.getUserByLoginNameFc()
      }
    },
    /**
     * @name: 根据名称获取角色
     * @param {*}
     */
    getRoleByNameFc(){
      let params={
        roleName: this.inputRoleValue
      }
      this.leftLoading = true;
      this.leftData = [];
      getRoleByName(params).then(({ data }) => {
        this.leftLoading = false;
        if (data.code === 0) {
          // console.log('角色列表', data.data)
          this.leftData = data.data;
          this.leftData.forEach((item)=>{
            item.label = item.roleName;
            item.id = item.roleId;
          })
          if(this.isEdit==4){
            this.setDisable(this.leftData);
          }
          this.leftSelectedIdArr = [];
          this.$refs.leftTree.setCheckedKeys(this.leftSelectedIdArr);
          if(this.isEdit && this.isFirst){
            this.isFirst = false;
            //编辑复显
            this.leftSelectedIdArr = this.q.userRoleList.map((item)=>{return item.roleId})
            this.$nextTick(function () {
              this.$refs.leftTree.setCheckedKeys(this.leftSelectedIdArr);
            });
          }
        }
      }).catch(()=>{
        this.leftLoading = false;
      })
    },
    /**
     * @name: 通过用户名查找用户列表
     * @param {*}
     */
    getUserByLoginNameFc(){
      let params={
        loginName: this.inputRoleValue
      }
      this.leftLoading = true;
      this.leftData = [];
      getUserByLoginName(params).then(({ data }) => {
        this.leftLoading = false;
        if (data.code === 0) {
          // console.log('邮箱列表', data.data)
          this.leftData = data.data;
          this.leftData = this.leftData.filter(i=>{
            return  i.userId != this.q.userId;
          })
          // console.log(this.leftData,data.data)
          this.leftData.forEach((item)=>{
            item.label = item.loginName;
            item.id = item.userId;
          })
        }
      }).catch(()=>{
        this.leftLoading = false;
      })
    },
    /**
     * @name: 左侧树多选
     * @param {*}
     */
    leftCheckChange(data, checked, indeterminate) {
      // console.log('左侧树多选',this.$refs.leftTree.getCheckedKeys());
      this.leftSelectedIdArr = this.$refs.leftTree.getCheckedKeys();
      this.rightData = [];
      if(this.leftSelectedIdArr.length>0){
        if(this.isRole){
          this.q.roleIdList = this.leftSelectedIdArr;
          this.q.userIdList = [];
          this.getRoleFunctionByRoleFC()
        }else{
          this.q.userIdList = this.leftSelectedIdArr;
          this.q.roleIdList = [];
          this.getRoleFunctionByUserFC()
        }
      }
    },
    /**
     * @name: 多选角色获取合并菜单权限
     * @param {*}
     */
    getRoleFunctionByRoleFC(){
      this.rightLoading = true;
      getRoleFunctionByRole(this.leftSelectedIdArr).then(({ data }) => {
        this.rightLoading = false;
        if (data.code === 0 && data.data) {
          this.rightData = JSON.parse(JSON.stringify(this.treeDataBase));
          // console.log('多选角色获取合并菜单权限', data.data)
          let idArr = [];
            data.data.forEach((item)=>{
              idArr.push(item.functionId);
              let parentIdArr = item.parentIds?item.parentIds.split(","):[];
              idArr = [...new Set(idArr.concat(parentIdArr))];
            }) 
          this.detNoSelect(this.rightData, idArr);
          this.rightDefaultCheckedKeys = idArr;
          this.$nextTick(function () {
            this.$refs.rightTree.setCheckedKeys(this.rightDefaultCheckedKeys);
          });
        }
      }).catch(()=>{
        this.rightLoading = false;
      })
    },
    /**
     * @name: 多选邮箱用户获取合并菜单权限
     * @param {*}
     */
    getRoleFunctionByUserFC(){
      this.rightLoading = true;
      getRoleFunctionByUser(this.leftSelectedIdArr).then(({ data }) => {
        this.rightLoading = false;
        if (data.code === 0) {
          this.rightData = JSON.parse(JSON.stringify(this.treeDataBase));
          // console.log('多选邮箱用户获取合并菜单权限', data.data)
          let idArr = [];
          if(data.data){
            data.data.forEach((item)=>{
              idArr.push(item.functionId);
              let parentIdArr = item.parentIds?item.parentIds.split(","):[];
              idArr = [...new Set(idArr.concat(parentIdArr))];
            })
            this.detNoSelect(this.rightData, idArr);
          }else{//超级管理员
            this.getTreeId(this.treeDataBase, idArr);
          }
          this.rightDefaultCheckedKeys = idArr;    
          this.$nextTick(function () {
            this.$refs.rightTree.setCheckedKeys(this.rightDefaultCheckedKeys);
          });
        }
      }).catch(()=>{
        this.rightLoading = false;
      })
    },
    //过滤出未被禁用的菜单（isDisabled），并设置树结构禁用状态（disabled） +  非开发人员菜单去掉
    hasAuthority(arr){
      if(isValue(arr)){
        for (var i = arr.length - 1; i >= 0; i--) {
          arr[i].disabled = true;
          // if(arr[i].isDisabled == 0  || (arr[i].url == 'function' && this.$store.state.user.loginName !== 'developer')) {
          if(arr[i].isDisabled == 0 ) {
            arr.splice(i, 1);
          }else {
            this.hasAuthority(arr[i].children);
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
      this.reLoad.step2 = 0;
      this.$emit('update:active', 0)
    },
    /**
     * @name: 下一步
     * @param {*}
     */
    nextStep(){
      // console.log('step2--this.q',this.q);
      if(
        this.$refs.leftTree.getCheckedKeys().length==0
      ){
        this.$message.warning({
          message: '角色列表不能为空！',
          duration: 2 * 1000,
        });
      }else{
        this.reLoad.step2 = 0;
        this.$emit('update:active', 2)
      }
    },
    /**
     * @name: 分配角色
     * @param {*}
     */
    setRoleOk(){
      this.butLoading = true;
      let params= {
        userId: this.q.userId,
        userIdList: this.q.userIdList,
        roleIdList: this.q.roleIdList,
      }
      setUserRole(params).then(({ data }) => {
        this.butLoading = false;
        if (data.code === 0) {
          this.$emit('addUpdateClose');
        }
      }).catch(()=>{
        this.butLoading = false;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.s2Box{
  padding: 8px;
  display: flex;
  .s2Left{
    width: 350px;
    // padding: 8px;//20px
    margin-right: 8px;
    border-radius: 4px 0px 0px 4px;
    .see{
      padding: 17px 10px;
    }
  }
  .s2Right{
    flex: 1;
    border-radius: 0px 4px 4px 0px;
    .rightTop{
      padding: 17px 10px;
      margin-bottom: 8px;
      color: #262834;
    }
  }
}
::v-deep .el-input-group__prepend{
  width: 100px;
  padding: 0;
}
::v-deep .el-input-group__prepend .el-select{
  margin: -10px 0;
}
.footerBut{
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
</style>
