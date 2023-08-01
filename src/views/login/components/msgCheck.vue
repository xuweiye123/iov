<template>
  <app-dialog
    :visibles="visibles"
    :title="'短信验证'"
    width='45%'
    top="8vh"
    v-if="visibles"
    @close-dialog="closeDialog"
    @handle-submit="handleConfirm"
    :isFooter="true"
    :loading="loading1"
    class="ordinary"
  >
    <div class="bgForm" slot="formContent" style="padding: 20px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <div class="" style="text-align: center;margin-bottom:10px;">为保障账户使用安全，需要输入手机验证码，登录验证</div>
        <el-form-item label="请输入验证码：" prop="vCode">
          <div style="display: flex;">
            <el-input
             class="borderInput"
              v-model.trim="form.vCode"
              maxlength="11"
              clearable
              placeholder="请输入验证码"
              @keyup.enter.native="handleSend"
            />
            <el-button 
              v-waves 
              type="primary"
              :loading="loading"
              :disabled="isSendDis"
              @click="handleSend"
              style="min-width:130px; margin-left: 10px"
            >{{isFirst?'发送验证码':'重新发送'}}<span v-if="num >= 0">（{{num}}s）</span>
            </el-button>
          </div>
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
  sendPhoneCode,
} from "@/api/login"
export default {
  name: 'msgCheck',
  mixins: [partialForm],
  props: {
    visibles: {
      type: Boolean,
      default: false
    },
    loginInfo: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      form: {
        vCode: '',
      },
      isFirst: true,
      isSendDis: false,
      loading: false,
      loading1: false,
      num: -1,
      timer: null,
      rules: {
        vCode: [
          { required: true, trigger:  ['blur', 'change'], message: '请输入验证码',}
        ],
      },
    }
  },
  mounted() {
    
  },
  methods: {
    //发送短信
    handleSend(){
      let params = {
        loginName: this.loginInfo.loginName
      }
      this.loading = true;
      sendPhoneCode(params).then(({ data }) => {
        this.loading = false;
        if (data.code === 0) {
          this.$message.success({
            message: '验证码已发送',
            duration: 2 * 1000
          })
         
          //倒计时
          this.num = 60;
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
    handleConfirm() {
      const formCheck = this.checkForm({
        formName: "form",
        formList: ["vCode"]
      });
      if (!formCheck) {
        return;
      }
      let params = {
        loginName: this.loginInfo.loginName,
        loginPwd: this.loginInfo.loginPwd,
        emailCode: this.form.vCode,
      }
      console.log('params',params)
      this.loading1 = true;
      this.$store.dispatch("msgCheckLogin", params).then((data) => {
        this.loading1 = false;
        if(data.code==0){
          this.$message.success({
            message: '验证成功',
            duration: 2 * 1000
          });
          if(this.loginInfo.remember){
            localStorage.setItem("bjev_cloud_loginName",window.btoa(this.loginInfo.loginName));
            localStorage.setItem("bjev_cloud_loginPwd", window.btoa(this.loginInfo.loginPwd));
          }else{
            localStorage.removeItem("bjev_cloud_loginName");
            localStorage.removeItem("bjev_cloud_loginPwd");
          }
          this.$emit('option-fc',1);
          this.closeDialog();
        }else{
          this.$emit('option-fc',2);
        }
      })
      .catch(() => {
        this.loading1 = false;
        this.$emit('option-fc',2);
      });
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
