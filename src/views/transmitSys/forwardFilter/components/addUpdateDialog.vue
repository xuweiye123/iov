<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增转发过滤规则' : '修改转发过滤规则'"
		width="30%"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<div :style="{ 'min-height': '15vh' }" class="divScroll contentBox">
				<el-row type="flex" justify="center">
					<el-col :span="24">
						<el-form
							ref="formCenter"
							:model="formInfo"
							:label-position="'right'"
							label-width="95px"
							:rules="rules"
						>
							<vue-linetitle>
								<el-form-item label="协议数据项：" prop="variableId">
									<el-select
										v-model="formInfo.variableId"
										placeholder="请选择"
										clearable
										filterable
									>
										<el-option
											v-for="(item, index) in protocolIdList"
											:label="item.text"
											:value="item.value"
											:key="index"
										/>
									</el-select>
								</el-form-item>
								<el-form-item label="公式名称：" prop="formulaName">
									<el-input
										v-model="formInfo.formulaName"
										placeholder="请输入公式名称"
										maxlength="20"
										clearable
									></el-input>
								</el-form-item>
								<el-form-item label="显示公式：" prop="formulaValue">
									<el-input
										v-model="formInfo.formulaValue"
										placeholder="请输入显示公式"
										maxlength="20"
										clearable
									></el-input>
								</el-form-item>
								<el-form-item label="备注：">
									<el-input
										v-model="formInfo.remark"
										:maxlength="50"
										:rows="3"
										:autosize="{ minRows: 3, maxRows: 3 }"
										resize="none"
										placeholder="请输入备注"
										type="textarea"
										:show-word-limit="true"
									></el-input>
								</el-form-item>
							</vue-linetitle>
						</el-form>
					</el-col>
				</el-row>
			</div>
		</div>
	</app-drawer>
</template>
<script>
// request
import {
	getProtocolVariableOption,
	createFileTerRule,
	updateFileTerRule,
} from "@/api/transmitSys/forwardFilter";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";

export default {
	name: "roleAddUpdateDialog",
	mixins: [partialForm, checkFormRule],
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
		const validateOldpwd = (rule, value, cb) => {
			if (!value) {
				return cb("请输入协议数据项");
			}
		};
		return {
			rules: {
				formulaName: [
					{
						required: true,
						message: "请输入公式名称",
						trigger: "change",
					},
				],
				variableId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validateOldpwd,
					},
				],
				formulaValue: [
					{
						required: true,
						message: "请输入显示公式",
						trigger: "blur",
					},
				],
			},
			formCenter: {
				formulaName: "",
				variableId: "",
				formulaValue: "",
			},
			postData: {},
			importVisible: false,
			resultVisible: false,
			importResult: {},
			loading: false,
			importCarVisible: false,
			selectCarVisible: false,
			formInfo: {
				extractTaskName: "",
				startTime: "",
				endTime: "",
				protocolId: "",
				cardIdList: [],
				remark: "",
				taskType: 2,
			},
			defaultCheckedKeys: [],
			protocolIdList: [],
			lists: [],
		};
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					if (this.isEdit) {
						this.formInfo = { ...this.data };
						this._getProtocolList();
					} else {
						this.formInfo = {
							variableId: "",
							formulaName: "",
							formulaValue: "",
							remark: "",
						};
						this._getProtocolList();
					}
				}
			},
		},
	},
	created() {},
	methods: {
		_getProtocolList() {
			getProtocolVariableOption()
				.then(({ data }) => {
					if (data.code === 0) {
						this.protocolIdList = data.data;
						this.tableRow = {};
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {};
			this.treeData = [];
			this.defaultCheckedKeys = [];
			this.collapse = false;
			this.$emit("update:visibles", false);
		},
		// 点击取消
		headleCancel() {
			this.closeDialog();
		},
		// 新增
		_Add(postData) {
			if (
				this.formInfo.protocolId === "" ||
				this.formInfo.variableId === "" ||
				this.formInfo.formulaValue === ""
			) {
				return;
			}
			this.loading = true;
			createFileTerRule(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "新增成功",
							duration: 2 * 1000,
						});
						this.$emit("add-complete");
						this.closeDialog();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateFileTerRule(postData)
				.then(({ data }) => {
					if (data.code === 0) {	
						this.$message.success({
							message: "编辑成功",
							duration: 2 * 1000,
						});
						this.$emit("update-complete");
						this.closeDialog();
					} 
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList: ["variableId", "formulaValue", "formulaName"],
			});
			if (!formcenter) {
				return;
			}
			if (!this.isEdit) {
				const param = {
					variableId: this.formInfo.variableId,
					formulaName: this.formInfo.formulaName,
					formulaValue: this.formInfo.formulaValue,
					remark: this.formInfo.remark,
				};
				this._Add(param);
			} else {
				const param = {
					filterRulesId: this.formInfo.filterRulesId,
					variableId: this.formInfo.variableId,
					formulaName: this.formInfo.formulaName,
					formulaValue: this.formInfo.formulaValue,
					remark: this.formInfo.remark,
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.contentBox{
	max-height: calc(100vh - 142px);
	overflow: auto;
}
.car_title {
	color: #1890ff;
	padding: 0 0 10px 0;
	margin-top: 0;
	font-size: 14px !important;
	border-bottom: 1px dashed #dcdfe6;
}
</style>
