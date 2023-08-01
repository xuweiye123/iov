

<template>
  <app-drawer
      :visibles="visibles"
      :title="isEdit===0? '新增用户':isEdit===1? '编辑用户':isEdit===2? '分配角色':isEdit===3? '分配车辆':isEdit===4? '查看用户':''"
      :width="'800px'"
      @close-drawer="closeDrawer"
      :isDrawerFoot="false"
    >
    <div slot="drawerContent">
      <!-- <el-scrollbar wrap-class="default-scrollbar__wrap" style="padding-bottom:10px;"> -->
        <div v-if="isReset" style="position: relative;">
          <!-- <el-steps v-if="isEdit===0||isEdit===1||isEdit===4" :active="active" finish-status="success" align-center class="stepTop">
            <el-step :title="isEdit===0?'新增用户信息':isEdit===1?'编辑用户信息':isEdit===4?'用户信息':''">
              <template slot="icon">
                <svg-icon
                  :icon-class="`${this.$store.state.theme.activeName}_addUser_step1`"
                  class="headerRight"
                  :isChange="true"
                />
                <img src="@/assets/images/default_addUser_step1.png" style="width:34px;">
              </template>
            </el-step>
            <el-step v-if="isAdminFc" :title="isEdit===4?'角色权限':'分配角色'"></el-step>
            <el-step v-if="isAdminFc" :title="isEdit===4?'车辆权限':'分配车辆权限'"></el-step>
            <el-step  v-if="isEdit!==4" :title="isEdit===0?'创建结果':isEdit===1?'编辑结果':''"></el-step>
          </el-steps> -->
          <div v-if="isEdit===0||isEdit===1||isEdit===4" class="stepTop">
            <div class="stepTopItem">
              <div class="itemLeft">
                <img v-if="active!=0" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser.png`)" style="width:34px;">
                <img v-if="active==0" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser_active.png`)" style="width:34px;">
                <i class="iconfont icon-step1 min"></i>
                <p :class="active==0 ?'activeTitle':''">{{isEdit===0?'新增用户信息':isEdit===1?'编辑用户信息':isEdit===4?'用户信息':''}}</p>
              </div>
              <div class="itemRight" v-if="q.isAdmin!=1 || (q.isAdmin && isEdit!==4)">--------------------------</div>
            </div>
            <div class="stepTopItem" v-if="isAdminFc">
              <div class="itemLeft">
                <img v-if="active!=1" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser.png`)" style="width:34px;">
                <img v-if="active==1" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser_active.png`)" style="width:34px;">
                <i class="iconfont icon-step2 min"></i>
                <p :class="active==1 ?'activeTitle':''">{{isEdit===4?'角色权限':'分配角色'}}</p>
              </div>
              <div class="itemRight">--------------------------</div>
            </div>
            <div class="stepTopItem" v-if="isAdminFc">
              <div class="itemLeft">
                <img v-if="active!=2" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser.png`)" style="width:34px;">
                <img v-if="active==2" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser_active.png`)" style="width:34px;">
                <i class="iconfont icon-step3 min"></i>
                <p :class="active==2 ?'activeTitle':''">{{isEdit===4?'车辆权限':'分配车辆权限'}}</p>
              </div>
              <div class="itemRight" v-if="isEdit!==4">--------------------------</div>
            </div>
            <div class="stepTopItem" v-if="isEdit!==4">
              <div class="itemLeft">
                <img v-if="active!=3" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser.png`)" style="width:34px;">
                <img v-if="active==3" :src="require(`@/assets/images/theme/${this.$store.state.theme.activeName}/addUser_active.png`)" style="width:34px;">
                <i class="iconfont icon-step4 min"></i>
                <p :class="active==3 ?'activeTitle':''">{{isEdit===0?'查看创建结果':isEdit===1?'查看编辑结果':''}}</p>
              </div>
            </div>
          </div>
          <Step1 v-show="active==0" :active.sync="active" :q.sync="q" :isEdit="isEdit" @closeDrawer="closeDrawer" :reLoad.sync = reLoad></Step1>
          <Step2 v-show="active==1" :active.sync="active" :q.sync="q" :isEdit="isEdit" @addUpdateClose="addUpdateClose" @closeDrawer="closeDrawer" :reLoad.sync = reLoad></Step2>
          <Step3 v-show="active==2" :active.sync="active" :q.sync="q" :isEdit="isEdit" @addUpdateClose="addUpdateClose" @closeDrawer="closeDrawer" :reLoad.sync = reLoad></Step3>
          <Step4 v-show="active==3" :q.sync="q" :isEdit="isEdit" @addUpdateClose="addUpdateClose"></Step4>
        </div>
      <!-- </el-scrollbar> -->
      </div>
  </app-drawer>
</template>
<script>
import Step1 from "./step1"
import Step2 from "./step2"
import Step3 from "./step3"
import Step4 from "./step4"
export default {
  name: "addUser",
  components: { 
    Step1,
    Step2,
    Step3,
    Step4,
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {//0:新增；1：编辑；2：角色分配；3：车辆权限分配；4：查看用户
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isAdminFc() {
      return !this.q.isAdmin;
    },
    activeName(){
      return this.$store.state.theme.activeName;
    }
  },
  data() {
    return {
      isReset: true,
      reLoad: {
        step1: 1,
        step2: 1,
        step3: 1,
      },
      active: 0,
      q: {
        email: '',//电子邮箱
        loginName: '',//用户名
        userName: '',//姓名
        mobile: '',//手机号码
        // userType: 0,//用户类型(0:内部账户 1:外部账户)
        isAdmin: 0,//是否管理员(0:普通用户 1:管理员)
        // expiredTime: '',//使用期限
        // isSmsLoginVerif: 0,//是否登录短信验证(0:否 1:是)
        isLocationDesensitized: 0,
        isLicensePlateDesensitized: 0,
        isSimIccidDesensitized: 0,
        isNameDesensitized: 0,
        isIdentificationDesensitized: 0,
        isPhoneDesensitized: 0,
        isVinDesensitized: 0,
        roleIdList: [],//角色id列表
        userIdList: [],//用户id(邮箱查询分配角色使用)
        batchIdList: [],//项目列表
        carIdList: [],//车辆列表
        userCarList: [],//车辆列表选中
      },
    }
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          if (this.isEdit) {
            this.active = this.isEdit===2?1:this.isEdit===3?2:0;
            this.q = JSON.parse(JSON.stringify({...this.data }));
            // this.q.userRoleList = this.q.userRoleList.map((item) => {
            //     return item.roleId
            // })
            console.log(this.q)
          }
        }
      },
    },
  },
  created() {},
  mounted(){

  },
  methods: {
    addUpdateClose(){
      this.closeDrawer();
      this.$emit('userComplete');
    },

    // 关闭dialog
    closeDrawer() {
      this.active = 0;
      this.q.email = '';
      this.q.loginName = '';
      this.q.userName = '';
      this.q.mobile = '';
      // this.q.userType = 0;
      this.q.isAdmin = 0;
      // this.q.expiredTime = '';
      // this.q.isSmsLoginVerif = 0;
      this.q.isLocationDesensitized = 0;
      this.q.isLicensePlateDesensitized = 0;
      this.q.isSimIccidDesensitized = 0;
      this.q.isNameDesensitized = 0;
      this.q.isIdentificationDesensitized = 0;
      this.q.isPhoneDesensitized = 0;
      this.q.isVinDesensitized = 0;
      this.q.roleIdList = [];
      this.q.userIdList = [];
      this.q.batchIdList = [];
      this.q.carIdList = [];
      this.q.userCarList = [];
      this.reLoad.step1 = 1;
      this.reLoad.step2 = 1;
      this.reLoad.step3 = 1;
      this.$emit("update:visibles", false);
    },
    // 点击取消
    headleCancel() {
      this.closeDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
.stepTop{
  margin: 10px auto 24px;
  display: flex;
  justify-content: center;
  .stepTopItem{
    display: flex;
    .itemLeft{
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        margin-bottom: 8px;
      }
      p{
        font-weight: 700;
      }
    }
    .itemRight{
      margin-top: 8px;
    }
  }

  .iconfont.min{
    color: #fff;
    position: absolute;
    top: 10px;
    font-size: 12px !important;
  }

}
</style>