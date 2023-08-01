<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增协议插件' : '编辑协议插件'"
		width="450px"
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
				label-width="100px"
			>
				<el-row :gutter="10">
					<el-col :span="24">
						<el-form-item label="协议名称：" prop="protocolId">
							<el-select
								v-model="formInfo.protocolId"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in protocolList"
									:label="item.text"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="协议插件名称：" prop="moduleName">
							<el-input
								v-model="formInfo.moduleName"
								placeholder="请输入协议插件名称"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="协议插件模块：" prop="moduleValue">
							<el-input
								v-model="formInfo.moduleValue"
								placeholder="请输入协议插件模块"
								maxlength="20"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="协议插件版本：" prop="moduleVersion">
							<el-input
								v-model="formInfo.moduleVersion"
								placeholder="请输入协议插件版本"
								maxlength="20"
								clearable
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
import { getProtocolListMixin } from "@/mixins/dropList";
// request
import {
	createProtocolModule,
	updateProtocolModule,
} from "@/api/transmitSys/protocolPlug";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule, getProtocolListMixin],
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
		const moduleVersion = (rule, value, cb) => {
			let param = /^[^\.][A-Za-z0-9\.]+$/;
			if (!value) {
				return cb(new Error(this.$t("请输入协议插件版本")));
			}
			if (!param.test(value)) {
				return cb(new Error(this.$t("请输入正确的版本号")));
			}
		};
		return {
			loading: false,
			formInfo: {
				protocolId: "",
				moduleName: "",
				moduleValue: "",
				moduleVersion: "",
				remark: "",
			},
			oldModuleName: "",
			protocolList: [],
			tableRow: {},
			rules: {
				protocolId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入协议名称",
						formObjName: "formInfo",
					},
				],
				moduleName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入协议插件名称",
						formObjName: "formInfo",
					},
				],
				moduleValue: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入协议插件模块",
						formObjName: "formInfo",
					},
				],
				moduleVersion: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: moduleVersion,
						tips: "请输入协议插件模块",
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
						this.oldModuleName = this.formInfo.moduleName;
					}
				}
			},
		},
	},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.formInfo = {};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			createProtocolModule(postData)
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
			updateProtocolModule(postData)
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
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList: ["protocolId", "moduleName", "moduleValue", "moduleVersion"],
			});
			if (!formcenter) {
				return;
			}
			if (!this.isEdit) {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					moduleName: this.formInfo.moduleName || "",
					moduleValue: this.formInfo.moduleValue || "",
					moduleVersion: this.formInfo.moduleVersion || "",
					remark: this.formInfo.remark || "",
					isExtitem: 0,
				};
				this._Add(param);
			} else {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					moduleName: this.formInfo.moduleName || "",
					moduleValue: this.formInfo.moduleValue || "",
					moduleVersion: this.formInfo.moduleVersion || "",
					oldModuleName: this.oldModuleName || "",
					remark: this.formInfo.remark || "",
					moduleId: this.formInfo.moduleId || "",
					isExtitem: 0,
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
