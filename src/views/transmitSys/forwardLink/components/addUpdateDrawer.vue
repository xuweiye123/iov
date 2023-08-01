<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增转发链路' : '编辑转发链路'"
		width="550px"
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
				label-width="95px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="目标平台名称：" prop="targetId">
							<el-select
								v-model="formInfo.targetId"
								filterable
								placeholder="请选择"
								clearable
								@change="selectChange"
							>
								<el-option
									v-for="(item, index) in forwardTargetList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="链路名称：" prop="linkName">
							<el-input
								v-model="formInfo.linkName"
								placeholder="请输入链路名称"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="链路端口：" prop="linkPort">
							<el-input
								v-model="formInfo.linkPort"
								placeholder="请输入链路端口"
								clearable
								maxlength="10"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="唯一识别码：" prop="uniqueCode">
							<el-input
								v-model="formInfo.uniqueCode"
								placeholder="请输入唯一识别码"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="转发服务主机：" prop="serverIp">
							<el-select
								v-model="formInfo.serverIp"
								filterable
								placeholder="请选择"
								clearable
								@change="change"
							>
								<el-option
									v-for="(item, index) in serverIpList"
									:label="item.text"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务器端口：" prop="serverPort">
							<el-input
								v-model="formInfo.serverPort"
								placeholder="请输入服务器端口"
								clearable
								maxlength="10"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="formInfo.isPassword == 1">
						<el-form-item label="链路账号：" prop="linkUser">
							<el-input
								v-model="formInfo.linkUser"
								placeholder="请输入链路账号"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="formInfo.isPassword == 1">
						<el-form-item label="链路密码：" prop="linkPassword">
							<el-input
								v-model="formInfo.linkPassword"
								placeholder="请输入链路密码"
								clearable
								maxlength="20"
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
	createForwardLink,
	updateForwardLink,
} from "@/api/transmitSys/forwardLink";
import { getForwardTargetList, getServerList } from "@/api/transmitSys/commont";
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
			default: () => [],
		},
	},
	data() {
		const uniqueCode = (rule, value, cb) => {
			let regs = /[\u4E00-\u9FA5]/g;
			if (!value) {
				return cb(new Error("请输入唯一识别码"));
			}
			if (regs.test(value)) {
				return cb(new Error("请勿输入汉字"));
			}
		};
		const linkPort = (rule, value, cb) => {
			let regs = /^[1-9]\d*$/;
			if (!value) {
				return cb(new Error("请输入链路端口"));
			}
			if (!regs.test(value) || value < 0 || value > 65535) {
				return cb(new Error("请输入正确的链路端口"));
			}
		};
		const serverPort = (rule, value, cb) => {
			let regs = /^[1-9]\d*$/;
			if (!value) {
				return cb(new Error("请输入服务器端口"));
			}
			if (!regs.test(value) || value < 0 || value > 65535) {
				return cb(new Error("请输入正确的服务器端口"));
			}
		};
		return {
			loading: false,
			formInfo: {
				targetId: "",
				linkName: "",
				linkPort: "",
				serverIp: "",
				serverPort: "",
				uniqueCode: "",
				isPassword: 0,
				linkUser: "",
				linkPassword: "",
				remark: "",
			},
			oldLinkName: "",
			forwardTargetList: [],
			serverIpList: [],
			tableRow: {},
			rules: {
				linkPort: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: linkPort,
					},
				],
				serverPort: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: serverPort,
					},
				],
				targetId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择目标平台名称",
						formObjName: "formInfo",
					},
				],
				linkName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入链路名称",
						formObjName: "formInfo",
					},
				],
				serverIp: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择转发服务主机",
						formObjName: "formInfo",
					},
				],
				uniqueCode: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: uniqueCode,
					},
				],
				linkUser: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入链路账号",
						formObjName: "formInfo",
					},
				],
				linkPassword: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入链路密码",
						formObjName: "formInfo",
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
						this.oldLinkName = this.formInfo.linkName
							? this.formInfo.linkName
							: "";
						// 目标平台名称如果没有目标平台id则显示为空
						if (this.formInfo.targetId) {
							if (
								this.forwardTargetList.some(
									(item) => item.value == this.formInfo.targetId
								)
							) {
								this.formInfo.targetId = this.formInfo.targetId;
								this.forwardTargetList.some((item) => {
									if (item.value === this.formInfo.targetId) {
										this.formInfo.isPassword = item.isPassword;
									}
								});
							}
						}
						// 转发服务主机如果没有转发服务主机id则显示为空
						if (this.formInfo.serverIp) {
							this.formInfo.serverIp = this.formInfo.serverIp;
						} else {
							this.formInfo.serverIp = "";
						}
					}
				}
			},
		},
	},
	mounted() {
		this._getForwardTargetList();
		this._getServerList();
	},
	methods: {
		change() {
			this.$forceUpdate();
		},
		// 获取目标平台名称
		_getForwardTargetList() {
			getForwardTargetList().then(({ data }) => {
				if (data.code === 0) {
					this.forwardTargetList = data.data;
				}
			});
		},
		// 获取转发服务主机
		_getServerList() {
			getServerList().then(({ data }) => {
				if (data.code === 0) {
					this.serverIpList = data.data;
				}
			});
		},
		selectChange(v) {
			if (v) {
				this.forwardTargetList.some((item, index) => {
					if (item.value === v) {
						this.formInfo.isPassword = item.isPassword;
					}
				});
			} else {
				this.formInfo.isPassword = 0;
				this.formInfo.linkUser = "";
				this.formInfo.linkPassword = "";
			}
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {
				targetId: "",
				linkName: "",
				linkPort: "",
				serverIp: "",
				serverPort: "",
				uniqueCode: "",
				isPassword: 0,
				linkUser: "",
				linkPassword: "",
				remark: "",
			};
			this.collapse = false;
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			createForwardLink(postData)
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
			updateForwardLink(postData)
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
			if (this.formInfo.isPassword == 1) {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"targetId",
						"linkName",
						"linkPort",
						"serverIp",
						"serverPort",
						"uniqueCode",
						"registerKey",
						"linkUser",
						"linkPassword",
					],
				});

				if (!formcenter) {
					return;
				}
			} else {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"targetId",
						"linkName",
						"linkPort",
						"serverIp",
						"serverPort",
						"uniqueCode",
						"registerKey",
					],
				});
				if (!formcenter) {
					return;
				}
			}
			if (!this.isEdit) {
				const param = {
					targetId: Number(this.formInfo.targetId)
						? Number(this.formInfo.targetId)
						: "",
					linkName: this.formInfo.linkName || "",
					linkPort: this.formInfo.linkPort || "",
					serverIp: this.formInfo.serverIp || "",
					serverPort: this.formInfo.serverPort || "",
					uniqueCode: this.formInfo.uniqueCode || "",
					isPassword:
						this.formInfo.isPassword + "" ? this.formInfo.isPassword : 0,
					linkUser: this.formInfo.linkUser || "",
					linkPassword: this.formInfo.linkPassword || "",
					remark: this.formInfo.remark || "",
				};
				this._Add(param);
			} else {
				const param = {
					targetId: Number(this.formInfo.targetId)
						? Number(this.formInfo.targetId)
						: "",
					serverId: this.formInfo.serverId || "",
					linkName: this.formInfo.linkName || "",
					linkPort: this.formInfo.linkPort || "",
					serverIp: this.formInfo.serverIp || "",
					serverPort: this.formInfo.serverPort || "",
					uniqueCode: this.formInfo.uniqueCode || "",
					isPassword:
						this.formInfo.isPassword + "" ? this.formInfo.isPassword : 0,
					linkUser: this.formInfo.linkUser || "",
					linkPassword: this.formInfo.linkPassword || "",
					remark: this.formInfo.remark || "",
					linkId: Number(this.formInfo.linkId)
						? Number(this.formInfo.linkId)
						: "",
					oldLinkName: this.oldLinkName || "",
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
