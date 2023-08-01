<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增协议' : '编辑协议'"
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
				label-width="80px"
			>
				<el-row :gutter="10">
					<el-col :span="24">
						<el-form-item label="协议名称：" prop="protocolName">
							<el-input
								v-model="formInfo.protocolName"
								placeholder="请输入协议名称"
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
// request
import { addProtocol, updateProtocol } from "@/api/transmitSys/protocol";
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
		return {
			loading: false,
			formInfo: {
				protocolName: "",
				remark: "",
			},
			tableRow: {},
			rules: {
				protocolName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入协议名称",
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
						this.oldProtocolName = this.formInfo.protocolName;
					}
				}
			},
		},
	},
	created() {},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.formInfo = {};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			addProtocol(postData)
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
			updateProtocol(postData)
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
				formList: ["protocolName"],
			});
			if (!formcenter) {
				return;
			}
			let { protocolName = "", remark = "", protocolId = "" } = this.formInfo;
			if (!this.isEdit) {
				const param = {
					protocolName,
					remark,
				};
				this._Add(param);
			} else {
				const param = {
					protocolId,
					protocolName,
					oldProtocolName: this.oldProtocolName || "",
					remark,
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
