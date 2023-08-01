<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增公式' : '编辑公式'"
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
								@change="_getProtocolParamList"
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
						<el-form-item label="协议数据项：" prop="variableId">
							<el-select
								v-model="formInfo.variableId"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in protocolParamList"
									:label="item.text"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="公式名称：" prop="formulaName">
							<el-input
								v-model="formInfo.formulaName"
								placeholder="请输入公式名称"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="入口参数：" prop="formulaParam">
							<el-input
								v-model="formInfo.formulaParam"
								placeholder="请输入入口参数"
								clearable
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="24">
							<el-form-item label="公式值：" prop="formulaValue">
								<el-input
									v-model="formInfo.formulaValue"
									placeholder="请输入公式值"
									clearable
									maxlength="30"
								/>
							</el-form-item>
						</el-col> -->
					<el-col :span="24">
						<el-form-item label="显示公式：" prop="formulaText">
							<el-input
								v-model="formInfo.formulaText"
								:maxlength="300"
								:rows="3"
								:autosize="{ minRows: 3, maxRows: 3 }"
								resize="none"
								placeholder="请输入显示公式"
								type="textarea"
								:show-word-limit="true"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="公式值：" prop="formulaValue">
							<el-input
								v-model="formInfo.formulaValue"
								:maxlength="300"
								:rows="3"
								:autosize="{ minRows: 3, maxRows: 3 }"
								resize="none"
								placeholder="请输入公式值"
								type="textarea"
								:show-word-limit="true"
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
import { addFormula, updateFormula } from "@/api/transmitSys/protocolEquation";
import {
	getProtocolParamList,
} from "@/api/transmitSys/commont";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule, getProtocolListMixin],
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
		return {
			loading: false,
			formInfo: {
				protocolId: "",
				variableId: "",
				formulaName: "", // 公式名称
				formulaText: "", // 显示公式
				formulaValue: "", // 公式值
				formulaParam: "", // 入口
				remark: "", // 备注
			},
			oldFormulaName: "",
			protocolList: [],
			protocolParamList: [],
			tableRow: {},
			rules: {
				protocolId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择协议名称",
						formObjName: "formInfo",
					},
				],
				variableId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择协议数据项",
						formObjName: "formInfo",
					},
				],
				formulaName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入公式名称",
						formObjName: "formInfo",
					},
				],
				formulaText: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入显示公式",
						formObjName: "formInfo",
					},
				],
				formulaValue: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入公式值",
						formObjName: "formInfo",
					},
				],
				formulaParam: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入入口参数",
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
						this.oldFormulaName = this.formInfo.formulaName;
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

							const params = {
								protocolId: this.formInfo.protocolId,
								selectType: 1,
								isFormula: 1,
							};
							getProtocolParamList(params).then(({ data }) => {
								if (data.code === 0) {
									this.protocolParamList = data.data;
									// 协议数据项列表如果没有协议数据项id则显示为空
									if (
										this.protocolParamList.some((item) => {
											return item.value == this.formInfo.variableId;
										})
									) {
										this.formInfo.variableId = this.formInfo.variableId;
									} else {
										this.formInfo.variableId = "";
									}
								}
							});
						} else {
							this.formInfo.variableId = "";
							this.protocolParamList = [];
						}
					}
				}
			},
		},
	},
	methods: {
		// 获取协议数据项
		_getProtocolParamList(val) {
			this.formInfo.variableId = "";
			if (val) {
				const params = {
					protocolId: val,
					selectType: 1,
					isFormula: 1,
				};
				getProtocolParamList(params).then(({ data }) => {
					if (data.code === 0) {
						this.protocolParamList = data.data || [];
					}
				});
			} else {
				this.protocolParamList = [];
			}
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {
				protocolId: "",
				variableId: "",
				formulaName: "", // 公式名称
				formulaText: "", // 显示公式
				formulaValue: "", // 公式值
				formulaParam: "", // 入口
				remark: "", // 备注
			};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			addFormula(postData)
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
			updateFormula(postData)
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
				formList: [
					"protocolId",
					"variableId",
					"formulaName",
					"formulaText",
					"formulaValue",
					"formulaParam",
				],
			});
			if (!formcenter) {
				return;
			}
			if (!this.isEdit) {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					variableId: this.formInfo.variableId || "",
					formulaName: this.formInfo.formulaName || "",
					formulaText: this.formInfo.formulaText || "",
					formulaValue: this.formInfo.formulaValue || "",
					formulaParam: this.formInfo.formulaParam || "",
					remark: this.formInfo.remark || "",
				};
				this._Add(param);
			} else {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					variableId: this.formInfo.variableId || "",
					formulaName: this.formInfo.formulaName || "",
					formulaText: this.formInfo.formulaText || "",
					formulaValue: this.formInfo.formulaValue || "",
					formulaParam: this.formInfo.formulaParam || "",
					remark: this.formInfo.remark || "",
					oldFormulaName: this.oldFormulaName || "",
					formulaId: this.formInfo.formulaId || "",
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
