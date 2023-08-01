<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增故障规则' : '编辑故障规则'"
		width="50%"
		@close-drawer="closeDrawer"
		@ok-drawer="handleSubmit"
		:isOkButLoading="loading"
		:isDrawerFoot="true"
	>
		<div slot="drawerContent">
			<el-row type="flex" justify="center" align="top">
				<el-col :span="12">
					<el-form
						ref="formLeft"
						size="mini"
						:model="formInfo"
						:rules="rules"
						:label-position="'right'"
						label-width="95px"
					>
						<el-form-item label="故障码：" prop="faultCode">
							<div style="position:relative;">
								<div
									style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer;text-align:right;padding-right:10px;"
									@click="showFaultList"
								>
								</div>
								<el-input
									v-model.trim="formInfo.faultCode"
									placeholder="请输入故障码"
									readonly
								/>
							</div>
						</el-form-item>
						<el-form-item label="车速：" prop="speed">
							<el-input-number
								v-model="formInfo.speed"
								@keyup.native="expression1($event)"
								@change="expression"
								placeholder="请输入车速"
								clearable
							/>
						</el-form-item>
						<el-form-item label="DBC参数名称：" prop="parameterName">
							<el-input
								maxlength="30"
								v-model="formInfo.parameterName"
								placeholder="请输入DBC参数名称"
								clearable
							/>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="12">
					<el-form
						ref="formRight"
						size="mini"
						:model="formInfo"
						:rules="rules"
						:label-position="'right'"
						label-width="130px"
					>
						<el-form-item prop="ruleSymbols" label="规则符号：">
							<el-select
								v-model="formInfo.ruleSymbols"
								filterable
								clearable
								placeholder="请选择"
								@change="expression"
							>
								<el-option
									v-for="(item, index) in fuhaoList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
						<el-form-item prop="ruleExpression" label="规则表达式：">
							<el-input
								v-model="formInfo.ruleExpression"
								placeholder="请输入规则表达式"
								clearable
								:disabled="true"
							/>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<select-fault-dialog
				:visibles.sync="selectFaultVisibles"
				@dblclick-select-fault="selectFault"
			/>
		</div>
	</app-drawer>
</template>
<script>
// request
import { addFaultRules, editFaultRules } from "@/api/carMonitorSys/faultRule";
// 混入
import { partialForm } from "@/mixins/partialForm";
// 验证
// 组件
import selectFaultDialog from "./selectFaultDialog";
import { mapGetters } from "vuex";
export default {
	name: "addUpdateDrawer",
	components: { selectFaultDialog },
	mixins: [partialForm],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		isEdit: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		token() {
			return this.$store.getters.token;
		},
		...mapGetters(["commontData"]),
	},
	data() {
		// 登录账户
		const validateLoginName = (rule, value, cb) => {
			if (!this.formInfo.faultCode) {
				return cb(new Error("请输入故障码"));
			}
		};
		// 真实姓名
		const validatelRealName = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入规则符号"));
			}
		};
		// 登录密码
		const validateLoginPassword = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入车速"));
			}
		};
		//
		const validateStation = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入DBC参数名称"));
			}
		};
		// 规则表达式
		const confirmPassword = (rule, value, cb) => {
			if (!this.formInfo.ruleExpression) {
				return cb(new Error("请输入规则表达式"));
			}
		};
		return {
			roleVisibles: false,
			faultCode: [],
			formInfo: {},
			loading: false,
			rules: {
				faultCode: [
					{ required: true, trigger: "blur", validator: validateLoginName },
					{ trigger: "change", validator: validateLoginName },
				],
				ruleSymbols: [
					{ required: true, trigger: "blur", validator: validatelRealName },
					{ trigger: "change", validator: validatelRealName },
				],
				speed: [
					{ required: true, trigger: "blur", validator: validateLoginPassword },
					{ trigger: "change", validator: validateLoginPassword },
				],
				ruleExpression: [
					{ required: true, trigger: "blur", validator: confirmPassword },
					{ trigger: "change", validator: confirmPassword },
				],
				parameterName: [
					{ required: true, trigger: "blur", validator: validateStation },
					{ trigger: "change", validator: validateStation },
				],
			},
			faultcodeList: [],
			fuhaoList: [
				{ text: ">", value: ">" },
				{ text: ">=", value: ">=" },
				{ text: "<", value: "<" },
				{ text: "<=", value: "<=" },
			],
			selectFaultVisibles: false,
		};
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.formInfo = { ...this.data };
				}
			},
			immediate: true,
		},
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		expression1(e) {
			this.formInfo.speed = e.target.value;
			this.formInfo.ruleExpression = "";
			if (this.formInfo.ruleSymbols && this.formInfo.speed) {
				this.formInfo.ruleExpression =
					"var " + this.formInfo.ruleSymbols + " " + this.formInfo.speed;
			}
			this.$refs.formLeft.validate((vaild) => {
				if (!vaild) {
					// check2 = false
				}
			});
			this.$refs.formRight.validate((vaild) => {
				if (!vaild) {
					// check2 = false
				}
			});
		},
		expression() {
			this.formInfo.ruleExpression = "";
			if (this.formInfo.ruleSymbols && this.formInfo.speed) {
				this.formInfo.ruleExpression =
					"var " + this.formInfo.ruleSymbols + " " + this.formInfo.speed;
			}
			this.$refs.formLeft.validate((vaild) => {
				if (!vaild) {
				}
			});
			this.$refs.formRight.validate((vaild) => {
				if (!vaild) {
				}
			});
		},
		showFaultList() {
			this.selectFaultVisibles = true;
		},
		selectFault(item) {
			this.formInfo.faultCode = item.faultCode;
		},
		// 点击确定
		handleSubmit() {
			let checkLeft;
			let checkRight;
			checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["faultCode", "speed", "parameterName"],
			});
			checkRight = this.checkForm({
				formName: "formRight",
				formList: ["ruleSymbols", "ruleExpression"],
			});
			if (!checkLeft || !checkRight) {
				return;
			}
			const {
				ruleId,
				faultCode,
				speed,
				parameterName,
				ruleSymbols,
				ruleExpression,
			} = this.formInfo;
			if (!this.isEdit) {
				const postData = {
					faultCode,
					speed,
					parameterName,
					ruleSymbols,
					ruleExpression,
				};
				this._addFaultRules(postData);
			} else {
				const postData = {
					ruleId,
					faultCode,
					speed,
					parameterName,
					ruleSymbols,
					ruleExpression,
				};
				this._editFaultRules(postData);
			}
		},
		// 新增
		_addFaultRules(postData) {
			this.loading = true;
			addFaultRules(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_editFaultRules(postData) {
			this.loading = true;
			editFaultRules(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>
<style lang="scss">
// .textareaStyle textarea{
//   height: 80px!important;
// }
</style>
