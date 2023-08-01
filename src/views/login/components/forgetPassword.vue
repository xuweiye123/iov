<template>
  <app-dialog
    :visibles="visibles"
    :title="'忘记密码'"
    width='45%'
    top="8vh"
    v-if="visibles"
    @close-dialog="closeDialog"
    :isFooter="false"
    class="ordinary"
  >
    <div class="bgForm" slot="formContent">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="85px"
      >
        <el-form-item label="" prop="pwdEmail" style="margin-left:-85px">
          <div>请输入需要找回密码的工作邮箱：</div>
          <div style="display: flex;">
            <el-input
              class="borderInput"
              v-model.trim="form.pwdEmail"
              :disabled="loading||isSendDis"
              clearable
              placeholder="请输入工作邮箱"
              @keyup.enter.native="handleSend"
            />
            <el-button 
              v-waves 
              type="primary"
              :loading="loading"
              :disabled="isSendDis"
              @click="handleSend"
              style="min-width:130px; margin-left: 10px"
            >{{isFirst?'发送邮件':'重新发送'}}<span v-if="num >= 0">（{{num}}s)</span>
            </el-button>
          </div>
        </el-form-item>
        <!-- 邮箱校验码 -->
        <template v-if="!isStep1">
          <el-divider></el-divider>
          <el-form-item label="工作邮箱：">
            {{info.email}}
          </el-form-item>
          <el-form-item label="手机号码：">
            <span v-if="info.mobile">
              {{info.mobile.substring(0,3)+'****'+info.mobile.substring(7)}}
            </span>
            <span v-else>-</span>
          </el-form-item>
          <el-form-item label="邮箱验证码：" prop="emailVerCode">
            <div style="display: flex;">
              <el-input
                v-model.trim="form.emailVerCode"
                clearable
                placeholder="请输入邮箱验证码"
                @keyup.enter.native="checkCode"
              />
              <el-button 
                v-waves 
                type="primary"
                :loading="loading1"
                @click="checkCode"
                style="min-width: 70px; margin-left: 10px"
              >验证</el-button>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <el-form
        v-if="ischeckOk"
        ref="form1"
        :model="form"
        :rules="rules"
        label-width="85px"
      >
        <!-- 新密码 8位及以上，要同时包含字母、数字及特殊字符-->
        <el-divider></el-divider>
        <el-form-item label="新密码：" prop="newPwd">
          <el-input
            v-model.trim="form.newPwd"
            maxlength="20"
            type="password"
            show-password
            autocomplete="off"
            clearable
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码：" prop="reNewPwd">
          <el-input
            v-model.trim="form.reNewPwd"
            maxlength="20"
            type="password"
            show-password
            autocomplete="off"
            @paste.native.capture.prevent
            clearable
            placeholder="请确认新密码"
            @keyup.enter.native="editPwd"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            v-waves 
            type="primary"
            :loading="loading2"
            @click="editPwd"
          >
            确定修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </app-dialog>
</template>

<script>
import reg from '@/utils/reg'
// 混入
import { partialForm } from "@/mixins/partialForm";
import{
  emailVerify,
  emailVerifyCode,
} from "@/api/system/user"
export default {
  name: 'forgetPassword',
  mixins: [partialForm],
  computed: {

  },
  props: {
    visibles: {
      type: Boolean,
      default: false
    },
  },
  filters:{
    
  },
  watch: {
    visibles:{
      handler(e1){
        if(e1){
          
        }
      }
    }
  },
  data() {
    const pwdEmailValidator = (rule, value, cb) => {
      if(this.form.pwdEmail){
        if (!reg.mail.test(this.form.pwdEmail)) {
          return cb(new Error("请输入格式正确的邮箱！"))
        }
      }else{
        return cb(new Error('请输入工作邮箱！'));
      }
    };
    const newPwdValidator = (rule, value, cb) => {
      if(this.form.newPwd){
        if (!reg.newPwd.test(this.form.newPwd)) {
          return cb(new Error("8~20位，同时包含字母、数字及特殊字符"))
        }
      }else{
        return cb(new Error('请输入新密码！'));
      }
    };
    const reNewPwdValidator = (rule, value, cb) => {
      if(this.form.reNewPwd){
        if (this.form.reNewPwd!==this.form.newPwd) {
          return cb(new Error("密码不一致！"))
        }
      }else{
        return cb(new Error('请确认密码！'));
      }
    };
    return {
      form: {
        pwdEmail: '',
        emailVerCode: '',
        newPwd: '',
        reNewPwd: '',
      },
      isFirst: true,
      isSendDis: false,
      loading: false,
      loading1: false,
      loading2: false,
      isStep1: true,
      ischeckOk: false,
      num: -1,
      timer: null,
      info:{},
      rules: {
        pwdEmail: [
          { required: true, trigger:  ['blur', 'change'], validator: pwdEmailValidator }
        ],
        emailVerCode: [
          { required: true, trigger:  ['blur', 'change'], message: '请输入邮箱验证码'}
        ],
        newPwd: [
          { required: true, trigger:  ['blur', 'change'], validator: newPwdValidator }
        ],
        reNewPwd: [
          { required: true, trigger:  ['blur', 'change'], validator: reNewPwdValidator }
        ],
      },
    }
  },
  mounted() {
    
  },
  methods: {
    //发送邮件
    handleSend(){
      const formCheck = this.checkForm({
        formName: "form",
        formList: ["pwdEmail"]
      });
      if (!formCheck) {
        return;
      }
      this.isStep1 = true;
      this.ischeckOk = false;
      this.form.emailVerCode = '';
      this.form.newPwd = '';
      this.form.reNewPwd = '';
      let params = {
        email: this.form.pwdEmail
      }
      this.loading = true;
      emailVerify(params).then(({ data }) => {
        this.loading = false;
        if (data.code === 0) {
          this.info = data.data;
          this.isStep1 = false;
          //倒计时
          this.num = 30;
          this.isSendDis = true;
          if(this.timer){
            clearInterval(this.timer);
            this.timer  = null;
          }
          this.timer = setInterval(()=>{
            this.num = this.num - 1;
            if(this.num < 0){
              this.isFirst = false;
              this.isSendDis = false;
              clearInterval(this.timer);
              this.timer  = null;
            }
          },1000)
        }
      })
    },
    //验证码检验
    checkCode(){
      const formCheck2 = this.checkForm({
        formName: "form",
        formList: ["emailVerCode"]
      });
      if (!formCheck2) {
        return;
      }
      this.ischeckOk = false;
      this.info.verifyCode = this.form.emailVerCode;
      this.form.newPwd = '';
      this.form.reNewPwd = '';
      let params = {
        verifyCode: this.form.emailVerCode,
        userId: this.info.userId,
        operateType: 1,
      }
      this.loading1 = true;
      emailVerifyCode(params).then(({ data }) => {
        this.loading1 = false;
        if (data.code === 0) {
          this.ischeckOk = true;
        }
      })
    },
    //确认修改密码
    editPwd(){
      const formCheck3 = this.checkForm({
        formName: "form1",
        formList: ["newPwd","reNewPwd"]
      });
      if (!formCheck3) {
        return;
      }
      let params = {
        operateType: 2,
        userId: this.info.userId,
        verifyCode: this.info.verifyCode,
        newPwd: this.form.newPwd
      }
      this.loading2 = true;
      emailVerifyCode(params).then(({ data }) => {
        this.loading2 = false;
        if (data.code === 0) {
          this.$message.success({
            message: "修改成功",
            duration: 2 * 1000,
          });
          this.closeDialog();
        }
      })
    },
    // 关闭dialog
    closeDialog() {
      this.$emit('update:visibles', false)
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
