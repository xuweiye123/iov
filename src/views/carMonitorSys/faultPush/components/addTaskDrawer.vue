<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="!isEdit ? '添加任务' : '编辑任务'"
		width="55%"
		@close-drawer="closeDrawer"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formLeft"
				:rules="rulesCenter"
				:model="formInfo"
				:label-position="'right'"
				label-width="90px"
			>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="24">
						<el-form-item label="任务名称：" prop="name">
							<el-input
								v-model="formInfo.name"
								placeholder="请输入任务名称"
								clearable
								:maxlength="50"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="8">
						<el-form-item label="是否启用：" prop="enabled">
							<el-radio-group v-model="formInfo.enabled" class="radio-color">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="补传时间(分)：" prop="fillTime">
							<el-input
								maxlength="5"
								v-model="formInfo.fillTime"
								placeholder="请输入补传时间(分)"
								clearable
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="8">
						<el-form-item label="邮件推送：" prop="isEmail">
							<el-radio-group
								@change="isemailChange"
								v-model="formInfo.isEmail"
								class="radio-color"
							>
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="邮箱：" prop="email">
							<el-input
								:maxlength="50"
								v-model="formInfo.email"
								placeholder="请输入邮箱"
								clearable
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="24">
						<el-form-item label="备注：">
							<el-input
								v-model.trim="formInfo.mark"
								:rows="8"
								:autosize="{ minRows: 5, maxRows: 5 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								:maxlength="200"
								show-word-limit
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { addHandle, editHandle } from "@/api/carMonitorSys/faultPush";
import { mapGetters } from "vuex";
// request
export default {
	name: "addTaskDrawer",
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
			default: () => ({}),
		},
	},
	computed: {
		...mapGetters(["commontData"]),
	},
	watch: {
		visibles(e1) {
			if (e1) {
				if (!this.isEdit) {
					this.formInfo = {
						name: "",
						mark: "",
						fillTime: "",
						email: "",
						enabled: 1,
						isEmail: 0,
					};
				} else {
					this.formInfo = { ...this.data };
				}
				if (this.formInfo.isEmail == 1) {
					this.rulesCenter.email[0].required = true;
				} else {
					this.rulesCenter.email[0].required = false;
				}
			}
		},
	},
	created() {},
	data() {
		const validatetime = (rule, value, cb) => {
			if (value === "" || value === undefined) {
				return cb(new Error("请输入补传时间"));
			}
			const regs = /^[0-9]*[1-9][0-9]*$/;
			if (!regs.test(value)) {
				return cb(new Error("请输入数字"));
			}
		};
		return {
			loading: false,
			formInfo: {},
			rulesCenter: {
				name: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入任务名称",
						formObjName: "formInfo",
					},
				],
				fillTime: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatetime,
					},
				],
				enabled: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择是否启用",
						formObjName: "formInfo",
					},
				],
				isEmail: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择邮件推送",
						formObjName: "formInfo",
					},
				],
				email: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入邮箱",
            ruleReg: 'mail',
            errorTips:"请输入格式正确的邮箱",
						formObjName: "formInfo",
					},
				],
			},
		};
	},
	mounted() {},
	methods: {
		//是否邮箱推送
		isemailChange(val) {
			if (val == 1) {
				this.rulesCenter.email[0].required = true;
			} else {
				this.rulesCenter.email[0].required = false;
			}
		},
		// 关闭dialog
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		// 点击取消
		handleCancel() {
			this.closeDrawer();
		},
		submitForm() {
			let formLists = [];
			if ( this.formInfo.isEmail == 0) {
				formLists = [
					"name",
					"fillTime",
					"enabled",
				];
			} else {
				formLists = [
					"name",
					"fillTime",
					"enabled",
					"email",
					"isEmail",
				];
			} 
			const formCheckLeft = this.checkForm({
				formName: "formLeft",
				formList: formLists,
			});
			if (!formCheckLeft) {
				return;
			}
			const postData = this.formInfo;
			if (!this.isEdit) {
				this._createTask(postData);
			} else {
				postData.id = this.data.id;
				this._updateTask(postData);
			}
		},
		// 新增
		_createTask(postData) {
			this.loading = true;
			addHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "新增成功",
							duration: 2 * 1000,
						});
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		_updateTask(postData) {
			this.loading = true;
			editHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "编辑成功",
							duration: 2 * 1000,
						});
						this.$emit("add-complete");
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

<style lang="scss" scoped></style>
