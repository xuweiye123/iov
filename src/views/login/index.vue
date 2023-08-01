<template>
	<div>
		<div class="df_login">
			<div class="df_left">
				<div class="login-logo" />
			</div>
			<div class="df_right">
				<div class="loginFormDiv">
					<div class="formContent">
						<p class="loginTxet">欢迎登录</p>
						<el-form ref="form" :model="loginForm" :rules="rules">
							<el-form-item
								prop="loginName"
								style="margin-bottom:30px;min-width: 120px"
							>
								<el-input
									class="inputBox"
									v-model="loginForm.loginName"
									size="large"
									clearable
									maxlength="35"
									placeholder="请输入用户名"
									auto-complete="on"
									@keyup.enter.native="handleLogin"
								>
								</el-input>
							</el-form-item>
							<el-form-item
								prop="loginPwd"
								style="margin-bottom:30px;min-width: 120px"
							>
								<el-input
									class="inputBox"
									v-model="loginForm.loginPwd"
									size="large"
									clearable
									type="password"
									show-password
									maxlength="40"
									placeholder="请输入登录密码"
									auto-complete="on"
									@keyup.enter.native="handleLogin"
								>
								</el-input>
							</el-form-item>
							<el-form-item prop="verification">
								<el-row>
									<el-col
										class="identifyDiv"
										style="width:calc(100% - 120px);min-width: 120px"
									>
										<el-input
											class="inputBox"
											v-model="loginForm.verification"
											size="large"
											placeholder="请输入验证码"
											maxlength="10"
											@keyup.enter.native="handleLogin"
										>
										</el-input>
									</el-col>
									<el-col style="width:100px; margin-left:20px;">
										<div v-loading="codeLoading">
											<img
												v-if="randCodeImage"
												class="img-code"
												:src="randCodeImage"
												@click="verifyCodeRefresh"
											/>
											<img
												v-else
												class="img-code"
												src="../../assets/images/checkcode.png"
												@click="verifyCodeRefresh"
											/>
										</div>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
						<el-button
							class="login-button"
							type="success"
							:loading="loading"
							size="large"
							@click="handleLogin"
						>
							登 录
						</el-button>
						<div class="login-remember">
							<el-checkbox v-model="remember">记住密码</el-checkbox>
							<a class="forgetPws" @click="forgetPwsFc">忘记密码？</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<app-dialog
			:visibles="show"
			:title="$t('components.HeaderSetting.changethepassword')"
			width="40%"
			@close-dialog="closeDia"
			@handle-submit="updatePwd"
			:isFooter="true"
			class="ordinary"
		>
			<div slot="formContent">
				<vue-linetitle>
					<el-form
						ref="form1"
						:label-position="'right'"
						:model="formInfo"
						:rules="rules1"
						:label-width="$t('components.HeaderSetting.inputlabelwidth')"
					>
						<el-form-item
							:label="$t('components.HeaderSetting.enter1') + '：'"
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
						<el-form-item prop="newpwd">
							<template slot="label">
								{{ $t("components.HeaderSetting.enter2") }}
								<el-tooltip
									class="item"
									effect="dark"
									:content="'8位及以上，要同时包含字母、数字及特殊字符'"
									placement="top"
								>
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
							:label="$t('components.HeaderSetting.enter3') + '：'"
							prop="agianNewpwd"
						>
							<el-input
								v-model="formInfo.agianNewpwd"
								type="password"
								maxlength="20"
								clearable
								:placeholder="$t('components.HeaderSetting.enter3')"
								@keyup.enter.native="updatePwd"
							/>
						</el-form-item>
					</el-form>
				</vue-linetitle>
				<div style="height: 8px"></div>
			</div>
		</app-dialog>
		<div style="height:100vh;">
			<forget-password :visibles.sync="isForgetPws" v-if="isForgetPws" />
			<msg-check
				:visibles.sync="isMsgCheck"
				:loginInfo="loginInfo"
				v-if="isMsgCheck"
				@option-fc="optionFc"
			/>
		</div>
	</div>
</template>
<script>
import reg from "@/utils/reg";
import { overdueChangedPwd, getCheckCode, getVerifyCode } from "@/api/login";
import { partialForm } from "@/mixins/partialForm";
import { setSelectedSys } from "@/utils/auth";
import forgetPassword from "./components/forgetPassword";
import msgCheck from "./components/msgCheck";
export default {
	name: "Login",
	components: { forgetPassword, msgCheck },
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
		const validatelUseName = (rule, value, cb) => {
			if (!value) {
				return cb(new Error(this.$t("login.userPlaceholderName")));
			}
		};
		const validatelPwd = (rule, value, cb) => {
			if (!value) {
				return cb(new Error(this.$t("login.pwdError")));
			}
		};
		const validatelVerification = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入验证码"));
			}
		};
		return {
			// ------股份平台------
			currdatetime: null,
			requestCodeSuccess: false,
			randCodeImage: "",
			systemList: [
				{ label: "智能车云平台", value: "dataCloudControlPlatform" },
				{ label: "北汽新能源", value: "newEnergyPlatform" },
				{ label: "北汽股份", value: "sharesPlatform" },
			],
			// ------股份平台------
			loginForm: {
				loginName: "",
				loginPwd: "",
				verification: "",
			},
			verifyToken: "",
			codeLoading: false,
			show: false,
			formInfo: {
				oldpwd: "",
				newpwd: "",
				agianNewpwd: "",
			},
			rules1: {
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
			loginInfo: {},
			identifyingNum: "Number",
			remember: false,
			loading: false,
			isForgetPws: false,
			isMsgCheck: false,
			rules: {
				loginName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatelUseName,
					},
				],
				loginPwd: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatelPwd,
					},
				],
				verification: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatelVerification,
					},
				],
			},
		};
	},
	mounted() {
		this.$store.commit("setInfo", "");
		this.$store.commit("setExpired", "");
		//获取主题，设置主题
		this.$store.dispatch("app/load");
		this.verifyCodeRefresh();
		this.timer();
		if (localStorage.apollo_loginName && localStorage.apollo_loginPwd) {
			this.loginForm.loginName = window.atob(localStorage.apollo_loginName);
			this.loginForm.loginPwd = window.atob(localStorage.apollo_loginPwd);
			this.remember = true;
		}
	},
	methods: {
		// 获取验证码
		handleChangeCheckCode() {
			this.currdatetime = new Date().getTime();
			getCheckCode(this.currdatetime)
				.then((res) => {
					if (res.data.success) {
						this.randCodeImage = res.data.result;
						this.requestCodeSuccess = true;
					} else {
						this.$message.error(res.data.message);
						this.requestCodeSuccess = false;
					}
				})
				.catch(() => {
					this.requestCodeSuccess = false;
				});
		},
		// 验证码
		verifyCodeRefresh() {
			this.codeLoading = true;
			getVerifyCode()
				.then(({ data }) => {
					this.codeLoading = false;
					if (data.code === 0) {
						this.verifyToken = data.data.kaptchaToken;
						this.randCodeImage = data.data.kaptchaImage;
					}
				})
				.catch(() => {
					this.codeLoading = false;
				});
		},
		restForm() {
			this.$refs["form1"].resetFields();
		},
		closeDia() {
			this.restForm();
			this.show = false;
		},
		//
		updatePwd() {
			const check = this.checkForm({
				formName: "form1",
				formList: ["oldpwd", "newpwd", "agianNewpwd"],
			});
			if (!check) {
				return;
			}
			const data = {
				loginName: this.loginForm.loginName,
				oldPwd: this.formInfo.oldpwd,
				newPwd: this.formInfo.newpwd,
			};
			overdueChangedPwd(data)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: this.$t("components.HeaderSetting.message1"),
							duration: 2 * 1000,
						});
						this.show = false;
						this.restForm();
					}
				})
				.catch(() => {
					this.$message.warning({
						message: this.$t("components.HeaderSetting.message2"),
						duration: 2 * 1000,
					});
					this.show = false;
					this.restForm();
				});
		},
		clickNum() {
			clearInterval(this.times);
			this.times = null;
			this.timer();
		},
		timer() {
			this.identifyingNum = this.code();
			if (this.times) {
				clearInterval(this.times);
			} else {
				this.times = setInterval(() => {
					this.identifyingNum = this.code();
				}, 60000);
			}
		},
		code() {
			let chars = "23456789qwertyuipasdfghjkzxcvbnmQWERTYUPLKJHGFDSAZXCVBNM";
			/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
			let maxPos = chars.length;
			let code = "";
			for (let i = 0; i < 4; i++) {
				code += chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return code;
		},
		//忘记密码
		forgetPwsFc() {
			this.isForgetPws = true;
		},
		handleLogin() {
			const loginForm = this.checkForm({
				formName: "form",
				formList: ["loginName", "loginPwd", "verification"],
				// formList: ["loginName", "loginPwd"],
			});

			if (!loginForm) {
				// this.$message.warning("请输入账户名、密码与验证码");
				return;
			}
			setSelectedSys("快速入口");
			this.$store.commit("setSysSelected", "快速入口");
			this.$store.dispatch("delAllViews");
			this.loading = true;
			this.loginInfo.loginName = this.loginForm.loginName;
			this.loginInfo.loginPwd = this.loginForm.loginPwd;
			//暂时不校验
			this.loginForm.verifyToken = this.verifyToken;
			this.loginForm.verifyCode = this.loginForm.verification;
			this.loginForm.currdatetime = this.currdatetime;
			this.loginInfo.remember = this.remember;
			this.$store
				.dispatch("login", this.loginForm)
				.then((data) => {
					console.log("进入登录接口", data);
					this.loading = false;
					if (data.code == 0) {
						if (this.remember) {
							localStorage.setItem(
								"apollo_loginName",
								window.btoa(this.loginForm.loginName)
							);
							localStorage.setItem(
								"apollo_loginPwd",
								window.btoa(this.loginForm.loginPwd)
							);
						} else {
							localStorage.removeItem("apollo_loginName");
							localStorage.removeItem("apollo_loginPwd");
						}
						this.optionFc(1);
					} else {
						this.optionFc(2);
						if (data.code === 205) {
							this.isMsgCheck = true;
						}
						// if (data.code === 206) {
						//   this.show = true;
						// }
					}
				})
				.catch(() => {
					this.loading = false;
					this.optionFc(2);
				});
		},
		optionFc(type) {
			if (type == 1) {
				this.$router.push({ name: "fastEntry" }); //√

				// isPromptPwdWillExpire().then(({ data }) => {
				//   if (data.code === 0) {
				//     let day = data.data*1;
				//     this.GLOBAL.daysRemaining = day;
				//   }
				// });
			} else if (type == 2) {
				this.verifyCodeRefresh();
			}
		},
	},
};
</script>
<style rel="stylesheet/scss" lang="scss">
.login-remember {
	.el-checkbox__input {
		line-height: 0;
	}
}
.df_login * {
	font-size: 12px;
}
.login-logo {
	width: 392px;
	height: 44px;
	position: absolute;
	top: 40px;
	left: 60px;
	background: url(../../assets/images/logo.png) no-repeat center;
	background-size: 100% 100%;
}
.loginFormDiv {
	width: 28.75vw;
	height: 100vh;
	.formContent {
		width: 74.56%;
		height: 366px;
		margin: 0 auto;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	p.loginTxet {
		text-align: center;
		font-size: 28px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		margin-bottom: 30px;
		// color: #2D8CF0;
		line-height: 40px;
	}
	.el-button {
		&.el-button--success.el-button--large {
			width: 100%;
			height: 40px;
			cursor: pointer;
			border: none;
			span {
				font-size: 16px;
			}
		}

		.el-input__inner {
			color: #ccc;
			padding-left: 30px;
			border-radius: 28px !important;
		}

		.prefix-left {
			text-align: center;
			line-height: 38px;
			width: 30px;
			height: 38px;
			margin-top: 1px;
			margin-left: -4px;
		}

		.identifyDiv {
			width: calc(90% - 100px);
		}

		.el-checkbox {
			color: #9ea8b2;
			.el-checkbox__input.is-checked + .el-checkbox__label {
				color: #9ea8b2;
			}
			.el-checkbox__input .el-checkbox__inner {
				z-index: 0;
			}
		}
	}
}
.login-remember {
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.forgetPws {
		white-space: nowrap;
		color: #333;
	}
}
.df_login {
	display: flex;
}
.df_left {
	width: 66vw;
	height: 100vh;
	position: relative;
}
.df_right {
	width: 34vw;
	height: 100vh;
	background-color: #fff;
	position: relative;
	.df_top {
		display: flex;
		position: absolute;
		top: 3vh;
		left: 50%;
		transform: translateX(-50%);
	}
}
.w_h {
	width: 11vw;
	height: 11vh;
}
.wh_100 {
	width: 100%;
	height: 100%;
}
.img-code {
	width: 100px;
	height: 38px;
}
</style>
<style scoped>
::v-deep .el-input--small .el-input__inner {
	height: 40px;
	line-height: 40px;
}
</style>
