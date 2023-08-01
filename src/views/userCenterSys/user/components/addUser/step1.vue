<template>
  <div class="formBox">
    <el-form ref="form" class="divScroll" :style="'max-height: calc(100vh - 235px);'" :model="form" :rules="rules" label-width="126px">
        <!-- <el-alert
          v-if="isEdit===0 || isEdit===1"
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom:20px;"
        >
          <template slot="title">
            <p v-if="isEdit===0">1.新建用户默认密码为<a style="cursor:text;">baidu.web.123</a></p>
            <p>{{isEdit===0?'2.':'' }}<a style="cursor:text;">超级管理员</a>无需分配权限，默认拥有所有菜单和车辆权限！</p>
          </template>
        </el-alert> -->
       <div
        class="userAlert"
         v-if="isEdit===0 || isEdit===1"
         style="margin-bottom:20px;color:#262834"
        >
        <!-- <p style="margin-bottom:5px;" v-if="isEdit===0">1.新建用户默认密码为<a style="cursor:text;">baidu.web.123</a></p> -->
        <p style="margin-bottom:5px;" v-if="isEdit===0">1.用户名和工作邮箱请务必与百度账号/邮箱保持一致！</p>
        <p>{{isEdit===0?'2.':'' }}<a style="cursor:text;">超级管理员</a>无需分配权限，默认拥有所有菜单和车辆权限！</p>
      </div>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="用户名：" prop="loginName">
            <el-input
              v-model="form.loginName"
              placeholder="请输入用户名"
              maxlength="20"
              clearable
              :disabled="isEdit===1||isEdit===4"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="请输入姓名"
              maxlength="20"
              clearable
              :disabled="isEdit===1||isEdit===4"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户类别：" prop="isAdmin">
            <el-select
              v-model="form.isAdmin"
              @change="adminChange"
              placeholder="请选择"
              filterable
              clearable
              :disabled="isEdit===4"
            >
              <el-option
                v-for="(item,index) in isAdminList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作邮箱：" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入工作邮箱"
              maxlength="30"
              clearable
              :disabled="isEdit===4"
            >
            <!--  @blur="changeEmail" -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：" prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入手机号码"
              maxlength="11"
              clearable
              :disabled="isEdit===4"
            >
            <!--   @blur="changeMobile" -->
           </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="用户类型：" prop="userType">
            <el-select
              v-model="form.userType"
              placeholder="请选择"
              filterable
              clearable
              :disabled="isEdit===4"
            >
              <el-option
                v-for="(item,index) in userTypeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->      
        <!-- <el-col :span="12">
          <el-form-item label="账户有效期：" prop="expiredTime">
            <el-date-picker
              v-model="form.expiredTime"
              type="datetime"
              popper-class="no-atTheMoment"
              placeholder="请选择"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="'23:59:59'"
              :picker-options="dateDis"
              :disabled="isEdit===4"
            >
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        </el-row>
        <el-row :gutter="10">
        <!-- <el-col :span="12">
          <el-form-item label="登录短信验证：" prop="isSmsLoginVerif">
            <el-radio-group v-model="form.isSmsLoginVerif" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="地理位置信息脱敏：" prop="isLocationDesensitized">
            <el-radio-group v-model="form.isLocationDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号码脱敏：" prop="isLicensePlateDesensitized">
            <el-radio-group v-model="form.isLicensePlateDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SIM卡号及ICCID脱敏：" prop="isSimIccidDesensitized">
            <el-radio-group v-model="form.isSimIccidDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名脱敏：" prop="isNameDesensitized">
            <el-radio-group v-model="form.isNameDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码脱敏：" prop="isIdentificationDesensitized">
            <el-radio-group v-model="form.isIdentificationDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话脱敏：" prop="isPhoneDesensitized">
            <el-radio-group v-model="form.isPhoneDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="VIN码脱敏：" prop="isVinDesensitized">
            <el-radio-group v-model="form.isVinDesensitized" :disabled="isEdit===4">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footerBut">
      <el-button
        v-waves
        @click="close"
      >取消</el-button>
      <!--    !(form.userType===0||form.userType===1) || -->
      <el-button
        v-waves
        v-preventReClick
        type="primary"
        @click="nextStep"
        :loading="butLoading"
        :disabled="
          // !form.email ||
          !form.loginName ||
          !form.userName ||
          // !form.mobile ||
          // isRepeat1 ||
          // isRepeat2 ||
          isRepeat3 ||
          !(form.isAdmin===0||form.isAdmin===1)
        "
      >{{q.isAdmin===1&&isEdit===4?'关闭':'下一步'}}</el-button>
    </div>
  </div>
</template>
<script>
  import reg from '@/utils/reg'
  import { partialForm } from "@/mixins/partialForm";
  import { checkFormRule } from "@/mixins/validateOne";
  // request
  import {
    checkUserLoginName,
    // checkUserMobile,
    // checkUserEmail,
    createUser,
    updateUser,
  } from '@/api/system/user'
  
  export default {
    // 组件名称
    name: 'step1',
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
    mixins: [partialForm,checkFormRule],
    data() {
      const emailValidator = (rule, value, cb) => {
        if(value){
          // console.log(this.q,123,this.q.email)
          // if(this.isEdit===0){
          if (!reg.mail.test(value)) {
            return cb(new Error("请输入格式正确的邮箱！"))
          }
          // if(this.isEdit==0 || (this.isEdit===1 && this.q.email != value)){
          //   if (this.timer1) {
          //     clearTimeout(this.timer1)
          //   }
          //   this.timer1 = setTimeout(() => {
          //     let params={
          //       operationType: 0,
          //       email: value
          //     }
          //     checkUserEmail(params).then(({ data }) => {
          //       if (data.code === 0) {
          //         if(data.data==='0'){
          //           this.isRepeat1 = false;
          //           return
          //         }else if(data.data==='-1'){
          //           this.isRepeat1 = true;
          //           return cb(new Error('该工作邮箱已注册，请重新输入！'));
          //         }
          //       }
          //     })
          //   }, 300);
          // }
          // }
        }
        // else{
        //   return cb(new Error('请输入工作邮箱！'));
        // }
      };
      const mobileValidator = (rule, value, cb) => {
        if(value){
          // if(this.isEdit===0){
          if (!reg.tel.test(value)) {
            return cb(new Error("请输入11位手机号码！"))
          }
          // if(this.isEdit==0 || (this.isEdit===1 && this.q.mobile != value)){
          //   if (this.timer2) {
          //     clearTimeout(this.timer2)
          //   }
          //   this.timer2 = setTimeout(() => {
          //     let params={
          //       operationType: 0,
          //       mobile: value
          //     }
          //     checkUserMobile(params).then(({ data }) => {
          //       if (data.code === 0) {
          //         if(data.data==='0'){
          //           this.isRepeat2 = false;
          //           return
          //         }else if(data.data==='-1'){
          //           this.isRepeat2 = true;
          //           return cb(new Error('该手机号码已注册，请重新输入！'));
          //         }
          //       }
          //     })
          //   }, 300);
          // }
          // }
        }
        // else{
        //   return cb(new Error('请输入手机号码！'));
        // }
      };
      const loginNameValidator = (rule, value, cb) => {
        if(this.form.loginName){
          if(this.isEdit===0){
            if (this.timer3) {
              clearTimeout(this.timer3)
            }
            this.timer3 = setTimeout(() => {
              let params={
                operationType: 0,
                loginName: this.form.loginName
              }
              checkUserLoginName(params).then(({ data }) => {
                if (data.code === 0) {
                  if(data.data==='0'){
                    this.isRepeat3 = false;
                    return
                  }else if(data.data==='-1'){
                    this.isRepeat3 = true;
                    return cb(new Error('该用户名已注册，请重新输入！'));
                  }
                }
              })
            }, 300);
          }
        }else{
          return cb(new Error(this.$t('login.userPlaceholder')));
        }
      };
      return {
        form: {
          loginName: this.q.loginName,
          userName: this.q.userName,
          email: this.q.email,
          mobile: this.q.mobile,
          // userType:this.q.userType,
          isAdmin: this.q.isAdmin,
          // expiredTime: this.q.expiredTime,
          // isSmsLoginVerif: this.q.isSmsLoginVerif,
          isLocationDesensitized: this.q.isLocationDesensitized,
          isLicensePlateDesensitized: this.q.isLicensePlateDesensitized,
          isSimIccidDesensitized: this.q.isSimIccidDesensitized,
          isNameDesensitized: this.q.isNameDesensitized,
          isIdentificationDesensitized: this.q.isIdentificationDesensitized,
          isPhoneDesensitized: this.q.isPhoneDesensitized,
          isVinDesensitized: this.q.isVinDesensitized,
        },
        // userTypeList: [
        //   {
        //     name: '内部用户',
        //     id: 0
        //   },
        //   {
        //     name: '外部用户',
        //     id: 1
        //   },
        // ],
        isAdminList: [
          {
            name: '普通用户',
            id: 0
          },
          {
            name: '超级管理员',
            id: 1
          },
        ],
        timer1: null,
        timer2: null,
        timer3: null,
        // isRepeat1:false,
        // isRepeat2:false,
        isRepeat3:false,
        butLoading:false,
        rules: {
          loginName: [
            { required: true, trigger: ['blur', 'change'], validator: loginNameValidator  }
          ],
          userName: [
            {
              required: true,
              trigger: ["blur", "change"],
              tips:'请输入姓名',
              // ruleReg: 'functionName',
              // errorTips: '支持汉字、字母、数字',
              validator: this.validInput,
            },
          ],
          email: [
            { required: false, trigger:  ['blur', 'change'], validator: emailValidator }
          ],
          mobile: [
            { required: false, trigger: ['blur', 'change'], validator: mobileValidator }
          ],
          // userType: [
          //   { required: true, message: '请选择用户类型', trigger: ['blur', 'change'] }
          // ],
          isAdmin: [
            { required: true, message: '请选择用户类别', trigger: ['blur', 'change'] }
          ],
        },
        dateDis: {
          disabledDate(time){
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          },
          selectableRange: new Date(new Date().setHours(new Date().getHours() + 1)).format('hh') + ':00:00 - 23:59:59'
        },
      }
    },
    mounted() {
      if(this.isEdit===0){
        // this.form.userType = this.userTypeList[0].id;
        this.form.isAdmin = this.isAdminList[0].id;
      }
    },
    methods: {
      // changeMobile(e){
      //   if(this.isEdit===1 && this.q.mobile == this.form.mobile){
      //     this.isRepeat2 = false;
      //   }
      // },
      // changeEmail(){
      //   if(this.isEdit===1 && this.q.email == this.form.email){
      //     this.isRepeat1 = false;
      //   }
      // },
      adminChange(e){
        this.q.isAdmin = e;
      },
      /**
      * @name: 取消
      * @param {*}
      */
      close(){
        this.$emit('closeDrawer');
      },
      /**
      * @name: 下一步
      * @param {*}
      */
      nextStep() {
        if(this.q.isAdmin===1 && this.isEdit===4){
          this.$emit('closeDrawer');
          return
        }
        const formCheck = this.checkForm({
          formName: "form",
          // formList: ["loginName","email", "mobile", "userType", "isAdmin"]
          formList: ["loginName","userName","email", "mobile", "isAdmin"]
        });
        if (!formCheck) {
          return;
        }
        for(var i in this.form){
          this.q[i] = this.form[i];
        }
        if(this.q.isAdmin && this.isEdit!=4){//超级管理员直接新增、编辑提交信息
          this.butLoading = true;
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
          }
          if(this.isEdit){
            let params = {
              id: this.q.userId,
              data: obj
            }
            updateUser(params).then(({ data }) => {
              this.butLoading = false;
              if (data.code === 0) {
                this.reLoad.step1 = 0;
                this.$emit('update:active', 3)
              }
            }).catch(()=>{
              this.butLoading = false;
            });
          }else{
            createUser(obj).then(({ data }) => {
              this.butLoading = false;
              if (data.code === 0) {
                this.reLoad.step1 = 0;
                this.$emit('update:active', 3)
              }
            }).catch(()=>{
              this.butLoading = false;
            });
          }
        }else{//否则进入下一步分配权限
          this.reLoad.step1 = 0;
          this.$emit('update:active', 1)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
// .formBox{
//   margin: 0 120px;
// }
.footerBut{
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>
