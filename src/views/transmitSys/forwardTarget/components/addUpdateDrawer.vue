<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增转发目标平台' : '编辑转发目标平台'"
		width="600px"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="105px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="协议名称：" prop="moduleId">
							<el-select
								v-model="formInfo.moduleId"
								filterable
								placeholder="请选择"
								clearable
								@change="getProtocolId"
							>
								<el-option
									v-for="(item, index) in protocolModuleList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="目标平台名称：" prop="targetName">
							<el-input
								v-model="formInfo.targetName"
								placeholder="请输入目标平台名称"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="目标平台IP：" prop="targetIp">
							<el-input
								v-model="formInfo.targetIp"
								placeholder="请输入目标平台IP"
								clearable
								maxlength="30"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="目标平台性质：" prop="targetType">
							<el-select
								v-model="formInfo.targetType"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in targetTypeList"
									:label="item.label"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务类型：" prop="serviceType">
							<el-select
								v-model="formInfo.serviceType"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in serviceTypeList"
									:label="item.label"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否需要密码：'"
							prop="isPassword"
						>
							<el-radio-group v-model="formInfo.isPassword">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否需要注册：'"
							prop="isRegister"
						>
							<el-radio-group v-model="formInfo.isRegister">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否需要加密：'"
							prop="isEncrypt"
						>
							<el-radio-group v-model="formInfo.isEncrypt">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-show="formInfo.isRegister == 1">
						<el-form-item label="注册URL：" prop="registerUrl">
							<el-input
								v-model="formInfo.registerUrl"
								placeholder="请输入注册URL"
								clearable
								maxlength="200"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="formInfo.isRegister == 1">
						<el-form-item label="注册公钥：" prop="registerKey">
							<el-input
								v-model="formInfo.registerKey"
								placeholder="请输入注册公钥"
								clearable
								maxlength="200"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" v-show="formInfo.isEncrypt == 1">
						<el-form-item label="加密方式：" prop="encryptType">
							<el-input
								v-model="formInfo.encryptType"
								placeholder="请输入加密方式"
								clearable
								maxlength="30"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formInfo.remark"
								:maxlength="50"
								:rows="3"
								:autosize="{ minRows: 3, maxRows: 3 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								:show-word-limit="true"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import {
	createForwardTarget,
	updateForwardTarget,
} from "@/api/transmitSys/forwardTarget";
import { getProtocolModuleList } from "@/api/transmitSys/commont";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule],
	components: {},
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
	data() {
		const targetIp = (rule, value, cb) => {
			if (!value) {
				return cb(new Error(this.$t("请输入目标平台IP")));
			}
			if (/[\u4E00-\u9FA5]/g.test(value)) {
				return cb(new Error(this.$t("请输入正确IP")));
			}
		};
		return {
			loading: false,
			formInfo: {
				protocolId: "",
				moduleId: "",
				targetName: "",
				targetIp: "",
				serviceType: "",
				targetType: "",
				isPassword: 0,
				isEncrypt: 0,
				encryptType: "",
				isRegister: 0,
				registerUrl: "",
				registerKey: "",
				remark: "",
			},
			oldTargetName: "",
			protocolModuleList: [],
			targetTypeList: [
				{
					label: "国家平台",
					value: "0",
				},
				{
					label: "地方平台",
					value: "1",
				},
				{
					label: "企业平台",
					value: "2",
				},
			],
			serviceTypeList: [
				{
					label: "对公平台",
					value: "0",
				},
				{
					label: "对私平台",
					value: "1",
				},
			],
			protocolParamList: [],
			tableRow: {},
			rules: {
				moduleId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择协议名称",
						formObjName: "formInfo",
					},
				],
				targetName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入目标平台名称",
						formObjName: "formInfo",
					},
				],
				targetIp: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: targetIp,
						formObjName: "formInfo",
					},
				],
				targetType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择目标平台性质",
						formObjName: "formInfo",
					},
				],
				registerUrl: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入注册URL",
						formObjName: "formInfo",
					},
				],
				registerKey: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入注册公钥",
						formObjName: "formInfo",
					},
				],
				encryptType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入加密方式",
						formObjName: "formInfo",
					},
				],
				serviceType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择服务类型",
						formObjName: "formInfo",
					},
				],
			},
		};
	},
	mounted() {
		this._getProtocolModuleList();
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					if (this.isEdit) {
						this.formInfo = { ...this.data };
						this.oldTargetName = this.formInfo.targetName;
						this.formInfo.targetType = this.formInfo.targetType + "";
						this.formInfo.serviceType = this.formInfo.serviceType + "";
						if (this.formInfo.moduleId) {
							// 协议名称列表如果没有协议id则显示为空
							if (
								this.protocolModuleList.some((item) => {
									return item.value == this.formInfo.moduleId;
								})
							) {
								this.formInfo.moduleId = this.formInfo.moduleId;
							} else {
								this.formInfo.moduleId = "";
							}
						}
					}
				}
			},
		},
	},
	created() {},
	methods: {
		// 获取协议名称
		_getProtocolModuleList() {
			getProtocolModuleList().then(({ data }) => {
			  if (data.code === 0) {
			    this.protocolModuleList = data.data;
			  }
			});
		},
		// 获取
		getProtocolId(v) {
			if (v) {
				this.protocolModuleList.some((item, index) => {
					if (item.value === v) {
						this.formInfo.protocolId = item.protocolId;
					}
				});
			} else {
				this.formInfo.protocolId = "";
			}
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {
				protocolId: "",
				moduleId: "",
				targetName: "",
				targetIp: "",
				serviceType: "",
				targetType: "",
				isPassword: 0,
				isEncrypt: 0,
				encryptType: "",
				isRegister: 0,
				registerUrl: "",
				registerKey: "",
				remark: "",
			};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			createForwardTarget(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDialog();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateForwardTarget(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDialog();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			if (this.formInfo.isRegister == "1") {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"moduleId",
						"targetName",
						"targetIp",
						"serviceType",
						"targetType",
						// "encryptType",
						"registerUrl",
						"registerKey",
					],
				});

				if (!formcenter) {
					return;
				}
			} else if (this.formInfo.isEncrypt == "1") {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"moduleId",
						"targetName",
						"targetIp",
						"serviceType",
						"targetType",
						"encryptType",
						// "registerUrl",
						// "registerKey",
					],
				});

				if (!formcenter) {
					return;
				}
			} else {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"moduleId",
						"targetName",
						"targetIp",
						"serviceType",
						"targetType",
						// "encryptType",
						// "registerUrl",
						// "registerKey",
					],
				});

				if (!formcenter) {
					return;
				}
			}

			if (!this.isEdit) {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					moduleId: this.formInfo.moduleId || "",
					targetName: this.formInfo.targetName || "",
					targetIp: this.formInfo.targetIp || "",
					serviceType: this.formInfo.serviceType
						? this.formInfo.serviceType * 1
						: null,
					targetType: this.formInfo.targetType
						? this.formInfo.targetType * 1
						: null,
					isEncrypt: this.formInfo.isEncrypt,
					isPassword: this.formInfo.isPassword,
					isRegister: this.formInfo.isRegister,
					encryptType: this.formInfo.encryptType || "",
					registerUrl: this.formInfo.registerUrl || "",
					registerKey: this.formInfo.registerKey || "",
					remark: this.formInfo.remark || "",
				};
				this._Add(param);
			} else {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					moduleId: this.formInfo.moduleId || "",
					targetName: this.formInfo.targetName || "",
					targetIp: this.formInfo.targetIp || "",
					serviceType: this.formInfo.serviceType
						? this.formInfo.serviceType * 1
						: null,
					targetType: this.formInfo.targetType
						? this.formInfo.targetType * 1
						: null,
					isEncrypt: this.formInfo.isEncrypt,
					isPassword: this.formInfo.isPassword,
					isRegister: this.formInfo.isRegister,
					encryptType: this.formInfo.encryptType || "",
					registerUrl: this.formInfo.registerUrl || "",
					registerKey: this.formInfo.registerKey || "",
					targetId: this.formInfo.targetId || "",
					remark: this.formInfo.remark || "",
					oldTargetName: this.oldTargetName || "",
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
