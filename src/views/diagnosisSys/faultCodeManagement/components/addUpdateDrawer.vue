<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增故障码' : '编辑故障码'"
		width="600px"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		:isDrawerFoot="true"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				slot="drawerContent"
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="90px"
			>
				<el-form-item label="故障码：" prop="faultCode">
					<el-input
						v-model="formInfo.faultCode"
						clearable
						placeholder="请输入故障码"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item label="故障码描述：" prop="codeDescription">
					<el-input
						v-model="formInfo.codeDescription"
						clearable
						placeholder="请输入故障码描述"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item label="关联车型：" prop="carTypeName">
					<el-input
						v-model="formInfo.carTypeName"
						placeholder="点击进行选择关联车型"
						@click.native="selectCarTypeId"
						readonly
					/>
				</el-form-item>
				<el-form-item label="ECU：" prop="ecuName">
					<el-input
						v-model="formInfo.ecuName"
						placeholder="点击进行选择ECU"
						@click.native="selectECU"
						readonly
					/>
				</el-form-item>
				<el-form-item label="解决方案：">
					<el-input
						v-model="formInfo.solution"
						placeholder="请输入解决方案"
						type="textarea"
						maxlength="50"
						rows="4"
						show-word-limit
						resize="none"
					/>
				</el-form-item>
			</el-form>
			<!-- 车型列表 -->
			<app-car-type-list
				:visibles.sync="carTypeListVisible"
				:data="formInfo"
				@carTypeId="loadCarTypeId"
			/>
			<app-ecu-list
				:visibles.sync="ecuListVisible"
				:data="formInfo"
				:carTypeId="formInfo.carTypeId"
				@ecuId="loadEcuId"
			/>
		</div>
	</app-drawer>
</template>

<script>
// request
import {
	createFaultCode,
	updateFaultCode,
} from "@/api/diagnosisSys/faultCodeManagement";
import AppCarTypeList from "@/components/diagnosisSys/carTypeListDialog";
import AppEcuList from "@/components/diagnosisSys/ecuListDialog";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
export default {
	name: "addUpdateDrawer",
	components: {
		AppCarTypeList,
		AppEcuList,
	},
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
	watch: {
		visibles: {
			handler(e1) {
				this.formInfo = { ...this.data };
			},
			immediate: true,
		},
	},
	data() {
		return {
			formInfo: {
				faultCode: "",
				codeDescription: "",
				carTypeId: "",
				carTypeName: "",
				ecuId: "",
				ecuName: "",
				solution: "",
			},
			carTypeListVisible: false,
			ecuListVisible: false,
			loading: false,
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
				codeDescription: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入故障描述",
						formObjName: "formInfo",
					},
				],
				carTypeName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择关联车型",
						formObjName: "formInfo",
					},
				],
				ecuName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择ECU",
						formObjName: "formInfo",
					},
				],
			},
		};
	},
	methods: {
		loadCarTypeId(data) {
			this.formInfo.carTypeId = data.id;
			this.formInfo.carTypeName = data.carTypeName;
		},
		loadEcuId(data) {
			this.formInfo.ecuId = data.id;
			this.formInfo.ecuName = data.ecuName;
		},
		selectCarTypeId() {
			this.carTypeListVisible = true;
		},
		selectECU() {
			if (!this.formInfo.carTypeId) {
				this.$alert("请先选择关联车型", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.ecuListVisible = true;
		},
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
		// 点击取消
		headleCancel() {
			this.closeDialog();
		},
		// 新增
		_buttonAdd(postData) {
			this.loading = true;
			createFaultCode(postData)
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
		_buttonUpdate(postData) {
			this.loading = true;
			updateFaultCode(postData)
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
				formList: ["faultCode", "codeDescription", "carTypeId", "ecuId"],
			});
			if (!formcenter) {
				return;
			}
			let {
				id,
				faultCode,
				codeDescription,
				carTypeId,
				ecuId,
				solution,
			} = this.formInfo;
			let postData = {};
			if (!this.isEdit) {
				postData = {
					faultCode,
					codeDescription,
					carTypeId,
					ecuId,
					solution,
				};
				this._buttonAdd(postData);
			} else {
				postData = {
					id,
					faultCode,
					codeDescription,
					carTypeId,
					ecuId,
					solution,
				};
				this._buttonUpdate(postData);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
