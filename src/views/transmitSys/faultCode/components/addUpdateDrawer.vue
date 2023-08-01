<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增故障码' : '编辑故障码'"
		width="450px"
		@close-drawer="closeDrawer"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="80px"
			>
				<el-row>
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
						<el-form-item label="故障名称：" prop="faultName">
							<el-input
								v-model="formInfo.faultName"
								placeholder="请输入故障名称"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="故障码：" prop="faultCode">
							<el-input
								v-model="formInfo.faultCode"
								placeholder="请输入故障码"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item :label="'故障等级：'" prop="faultLevel">
							<el-select
								v-model="formInfo.faultLevel"
								placeholder="请选择"
								clearable
								filterable
							>
								<el-option
									v-for="(item, index) in faultLevelList"
									:key="index"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
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
import { addFaultCode, updateFaultCode } from "@/api/transmitSys/faultCode";
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
			default: () => ({}),
		},
	},
	data() {
		return {
			loading: false,
			formInfo: {
				protocolId: "",
				faultLevel: "",
				faultName: "",
				faultCode: "",
				remark: "",
			},
			oldFaultName: "",
			protocolList: [],
			faultLevelList: [
				{ label: "不报警", value: "0" },
				{ label: "一级故障", value: "1" },
				{ label: "二级故障", value: "2" },
				{ label: "三级故障", value: "3" },
			],
			tableRow: {},
			rules: {
				faultCode: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入故障码",
						formObjName: "formInfo",
					},
				],
				faultName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入故障名称",
						formObjName: "formInfo",
					},
				],
				protocolId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择协议名称",
						formObjName: "formInfo",
					},
				],
				faultLevel: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择故障等级",
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
						this.formInfo.faultLevel = this.formInfo.faultLevel + "";
						this.oldFaultName = this.formInfo.faultName;
						if (this.formInfo.protocolId) {
							// 协议名称列表如果没有协议id则显示为空
							if (
								this.protocolList.some((item) => {
									return item.value == this.formInfo.protocolId;
								})
							) {
								this.formInfo.protocolId = this.formInfo.protocolId;
							} else {
								this.formInfo.protocolId = "";
							}
						}
					}
				}
			},
		},
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.formInfo = {
				protocolId: "",
				faultLevel: "",
				faultName: "",
				faultCode: "",
				remark: "",
			};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			addFaultCode(postData)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDrawer();
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateFaultCode(postData)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDrawer();
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList: ["faultCode", "protocolId", "faultLevel", "faultName"],
			});
			if (!formcenter) {
				return;
			}
			if (!this.isEdit) {
				const param = {
					remark: this.formInfo.remark || "",
					faultCode: this.formInfo.faultCode || "",
					faultName: this.formInfo.faultName || "",
					protocolId: this.formInfo.protocolId || "",
					faultLevel: this.formInfo.faultLevel
						? this.formInfo.faultLevel * 1
						: null,
				};
				this._Add(param);
			} else {
				const param = {
					remark: this.formInfo.remark || "",
					faultCode: this.formInfo.faultCode || "",
					faultName: this.formInfo.faultName || "",
					protocolId: this.formInfo.protocolId || "",
					faultId: this.formInfo.faultId || "",
					faultLevel: this.formInfo.faultLevel
						? this.formInfo.faultLevel * 1
						: null,
					oldFaultName: this.oldFaultName || "",
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
