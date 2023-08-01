<template>
  <div class="d-flex align-items-center">

    <!-- 用户-登录退出 -->
    <div class="user-setting">
      <div class="user-setting-box">
        <el-dropdown
          trigger="click"
          @command="clickDown"
          style="height: 43px"
        >
          <div class="el-dropdown-link">
            <!-- <img class="user" src="../../assets/images/user.png" alt=""> -->
            <span class="iconBg" style="display: flex;justify-content: start;align-items: center;padding-right:5px;" :style="{color: $store.state.theme.activeName==='default'? '#768089': '#262834'}">
              <i class="iconfont icon-ic_username pl-sm pr-sm"></i>
              {{ loginName }}（{{userName}}）
              <!-- {{ loginName }} -->
            <i class="el-icon-caret-bottom el-icon--right" /></span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="1">
              <svg-icon icon-class="password" />&nbsp;{{$t('components.HeaderSetting.changethepassword')}}
            </el-dropdown-item> -->
            <el-dropdown-item command="2">
              <svg-icon icon-class="exit" />&nbsp;{{$t('components.HeaderSetting.logout')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <app-dialog
        :visibles="show"
        :showClose="showClose"
        :title="$t('components.HeaderSetting.changethepassword')"
        width="40%"
        :loading="loading"
        @close-dialog="closeDia"
        @handle-submit="submitForm"
        :isFooter="true"
        class="ordinary"
        >
        <div slot="formContent">
          <vue-linetitle>
            <el-form
              ref="form"
              :label-position="'right'"
              :model="formInfo"
              :rules="rules"
              :label-width="$t('components.HeaderSetting.inputlabelwidth')"
            >
              <el-form-item
                :label="$t('components.HeaderSetting.enter1')+'：'"
                prop="oldpwd"
              >
                <el-input
                  v-model="formInfo.oldpwd"
                  type="password"
                  maxlength="20"
                  clearable
                  :placeholder="$t('components.HeaderSetting.enter1')"
                />
              </el-form-item>
              <el-form-item
                prop="newpwd"
              >
                <template slot="label">
                  {{$t('components.HeaderSetting.enter2')}}<el-tooltip 
                      class="item" 
                      effect="dark" 
                      :content="'8位及以上，要同时包含字母、数字及特殊字符'"
                      placement="top">
                      <i class="iconfont icon-info"></i>
                  </el-tooltip>
                  ：
                </template>
                <el-input
                  v-model="formInfo.newpwd"
                  type="password"
                  maxlength="20"
                  clearable
                  :placeholder="$t('components.HeaderSetting.enter2')"
                />
              </el-form-item>
              <el-form-item
                :label="$t('components.HeaderSetting.enter3')+'：'"
                prop="agianNewpwd"
              >
                <el-input
                  v-model="formInfo.agianNewpwd"
                  type="password"
                  maxlength="20"
                  clearable
                  :placeholder="$t('components.HeaderSetting.enter3')"
                  @keyup.enter.native="submitForm"
                />
              </el-form-item>
            </el-form>
          </vue-linetitle>
          <div style="height: 8px"></div>
        </div>
        <div slot="footerButton" v-if="!showClose">
          <el-button v-waves @click="logout">不用了，退出登录</el-button>
            <el-button 
              v-waves 
              type="primary" 
              @click="submitForm"
              :loading="loading"
              > 确定 </el-button>
        </div>
      </app-dialog>
    </div>

    <!-- <el-divider direction="vertical"></el-divider> -->

    <!-- 版本号 -->
    <!-- <div class="px-sm">
        <span>
            <i class="iconfont icon-bate mr-xs"></i>
            V&nbsp;&nbsp;{{version}}
        </span>
    </div> -->
  </div>
</template>
<script>
import reg from '@/utils/reg'
import { partialForm } from "@/mixins/partialForm";
import { changedpwd } from "@/api/login";
export default {
  name: "Headersetting",
  mixins: [partialForm],
  data() {
    const validateOldpwd = (rule, value, cb) => {
      if (!value) {
        return cb(new Error(this.$t("components.HeaderSetting.error1")));
      }
    };
    const validateNewpwd = (rule, value, cb) => {
      if (!value) {
        return cb(new Error(this.$t("components.HeaderSetting.error2")));
      }
      // 8位以上，同时包含字母、数字及特殊字符
      if (!reg.newPwd.test(value)) {
        return cb(new Error("8~20位，同时包含字母、数字及特殊字符"));
      }
    };
    const validateAgianNewpwd = (rule, value, cb) => {
      if (value !== this.formInfo.newpwd) {
        return cb(new Error(this.$t("components.HeaderSetting.error4")));
      }
      if (!value) {
        return cb(new Error(this.$t("components.HeaderSetting.error5")));
      }
    };
    return {
      loginName: this.$store.state.user.loginName,
      userName: this.$store.state.user.userName,
      collapse: false,
      show: false,
      showClose: true,
      loading:false,
      version:'',
      formInfo: {
        oldpwd: "",
        newpwd: "",
        agianNewpwd: "",
      },
      rules: {
        oldpwd: [
          { required: true, trigger: "blur", validator: validateOldpwd },
          { trigger: "change", validator: validateOldpwd },
        ],
        newpwd: [
          { required: true, trigger: "blur", validator: validateNewpwd },
          { trigger: "change", validator: validateNewpwd },
        ],
        agianNewpwd: [
          { required: true, trigger: "blur", validator: validateAgianNewpwd },
          { trigger: "change", validator: validateAgianNewpwd },
        ],
      },
    };
  },
  mounted(){
    // if(this.$store.state.user.expiredInfo&&this.$store.state.user.expiredInfo.isExpired){
    //    this.show= true;
    //    this.showClose =false;
    // }
    // console.log(this.$store.state.user.expiredInfo.passwordExpirationDay,124)
    // if(this.$store.state.user.expiredInfo&&this.$store.state.user.expiredInfo.passwordExpirationDay&&this.$store.state.user.expiredInfo.passwordExpirationDay>0){
    //   const h = this.$createElement;
    //    this.$notify({
    //     title: "提示",
    //     message: h("div", [
    //       h("span", "您的密码"),
    //       h(
    //         "strong",
    //         {
    //           style: "color:red;margin:0 5px",
    //         },
    //         this.$store.state.user.expiredInfo.passwordExpirationDay
    //       ),
    //       h(
    //         "span",
    //         { style: "margin-right:10px" },
    //         "天后过期，是否要修改?"
    //       ),
    //       h(
    //         "button",
    //         {
    //           class: "el-button  el-button--mini",
    //           on: {
    //             click: () => {
    //               this.show = true;
    //             },
    //           },
    //         },
    //         "修改"
    //       ),
    //     ]),
    //     type: 'warning',
    //     duration: 10*1000,
    //   });
    // }
    this.versionFc();
  },
  computed: {
  },
  methods: {
    // 退出登录
    logout(){ 
      this.$store.dispatch("fedLogout",{}).then(() => {
        this.closeDia()
        location.reload();
      });
    },
    /**
		 * @name: 获取版本号
		 * @param {*}
		 */
		versionFc() {
		  // version()
		  //   .then(({ data }) => {
		  //     if (data.code === 0) {
		  //       console.log(data.data);
		  //       this.version = data.data.version;
		  //     }
		  //   })
		  //   .catch(() => {});
		},
    restForm() {
      this.$refs["form"].resetFields();
    },
    clickDown(e) {
      switch (e) {
        // case "1":
        //   this.show = true;
        //   this.collapse = !this.collapse;
        //   break;
        case "2": // 退出登录
          this.$confirm("确定要退出系统么？", "退出", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
                this.$store.dispatch("logout",{})
            })
            .catch(() => {});

          break;
        default:
          break;
      }
    },
    closeDia() {
      this.restForm();
      this.show = false;
      this.showClose = true;
    },
    submitForm() {
      const check = this.checkForm({
        formName: "form",
        formList: ["oldpwd", "newpwd", "agianNewpwd"],
      });
      if (!check) {
        return;
      }
      const data = {
        userId: this.$store.state.user.userInfo.userId,
        oldPwd: this.formInfo.oldpwd,
        newPwd: this.formInfo.newpwd,
      };
      this.loading = true
      changedpwd(data)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$message.success({
              message: this.$t("components.HeaderSetting.message1"),
              duration: 2 * 1000,
            });
            this.show = false;
            this.restForm();
            // 修改密码后重新登录
              this.$store.dispatch("logout",{});
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$message.warning({
            message: this.$t("components.HeaderSetting.message2"),
            duration: 2 * 1000,
          });
          this.show = false;
          this.restForm();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.user-setting {
  .user-setting-box {
    display: inline-block;
    padding: 0 12px 0 0;
    line-height: 53px;
    span {
      font-size: 14px;
    }
    ::v-deep .el-dropdown{
      height: 30px !important;
    }
    .el-dropdown-link {
      line-height: 30px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .user {
        margin-right: 5px;
        width: 29px;
        height: 29px;
        border-radius: 50%;
      }
    }
  }
}
</style>
