<template>
	<div>
		<app-drawer
			:visibles="visibles"
			:title="!isEdit ? '新增安全库' : '编辑安全库'"
			width="40%"
			@close-drawer="closeDialog"
			@ok-drawer="submitForm"
			:isOkButLoading="loading"
			:isDrawerFoot="true"
		>
			<el-form
				ref="form"
				slot="drawerContent"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="95px"
			>
				<el-form-item label="选择ECU：" prop="ecuNames">
					<el-input
						readonly
						v-model="formInfo.ecuNames"
						clearable
						@click.native="selectECU"
						placeholder="选择ECU"
					/>
				</el-form-item>
				<el-form-item label="安全库文件：" prop="fileName">
					<el-row type="flex" justify="start" align="middle">
						<el-col :span="6">
							<el-upload
								ref="upload"
								:data="formInfo"
								:headers="{ Authorization: token }"
								action=""
								:show-file-list="false"
								class="upload-demo"
								:auto-upload="false"
								:on-change="handleChange"
								:http-request="uploadFile"
								:accept="'.so'"
							>
								<el-button slot="trigger" type="primary">上传文件</el-button>
							</el-upload>
						</el-col>
						<el-col :span="18" class="titleColor">
							{{ formInfo.fileName }}
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input
						v-model="formInfo.remark"
						type="textarea"
						placeholder="请输入备注"
						maxlength="50"
						rows="4"
						show-word-limit
						resize="none"
					/>
				</el-form-item>
			</el-form>
		</app-drawer>
		<app-ecu-list
			:visibles.sync="ecuListVisible"
			:state="1"
			:data="ecuData"
			@carECU="loadECU"
		/>
	</div>
</template>

<script>
// request
import { createSecurityLib } from "@/api/diagnosisSys/securityLib";
import { partialForm } from "@/mixins/partialForm";
import AppEcuList from "./selectEcuDialog";
import store from "@/store";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm],
	components: {
		AppEcuList,
	},
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
			return store.getters.token;
		},
	},
	data() {
		// 按钮文本
		const validateEcuNames = (rule, value, cb) => {
			if (!this.formInfo.ecuNames) {
				return cb(new Error("请选择ECU"));
			}
		};
		const validateFileName = (rule, value, cb) => {
			if (!this.formInfo.fileName) {
				return cb(new Error("请上传文件"));
			}
		};
		return {
			formInfo: {
				ecuId: "",
				ecuNames: "",
				fileName: "",
				remark: "",
			},
			rules: {
				ecuNames: [
					{ required: true, trigger: "blur", validator: validateEcuNames },
					{ trigger: "change", validator: validateEcuNames },
				],
				fileName: [
					{ required: true, trigger: "blur", validator: validateFileName },
					{ trigger: "change", validator: validateFileName },
				],
			},
			fileName: "",
			loading: false,
			ecuListVisible: false,
			ecuData: {},
		};
	},
	methods: {
		radioChange(e) {
			this.formInfo.buttonPosition = e;
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {
				ecuId: "",
				ecuNames: "",
				fileName: "",
				remark: "",
			};
			this.ecuData={};
			this.$emit("update:visibles", false);
		},
		selectECU() {
			this.ecuListVisible = true;
		},
		uploadFile(param) {
			var file = param.file;
			const formData = new FormData();
			formData.append("file", file);
			formData.append("relationId", this.formInfo.ecuId);
			formData.append("ecuNames", this.formInfo.ecuNames);
			formData.append("fileName", this.formInfo.fileName);
			formData.append("remark", this.formInfo.remark);
			formData.append("type", 1);
			this.loading = true;
			createSecurityLib(formData)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.closeDialog();
						this.$emit("add-complete");
					} else {
						this.$message.error({
							message: response.message,
							duration: 2 * 1000,
						});
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const form = this.checkForm({
				formName: "form",
				formList: ["ecuNames", "fileName"],
			});
			if (!form) {
				return;
			}
			this.$refs.upload.submit();
		},
		handleChange(file) {
			// if (file.name.split(".").pop()=='so'){
			if (/\.(so)$/.test(file.name.toLowerCase())){
				this.formInfo.fileName = file.name;
			} else {
				this.$message.warning({
					message: "请上传后缀名为.so格式的文件！",
					duration: 2 * 1000,
				});
				this.$refs.upload.clearFiles();
				this.formInfo.fileName = "";
				return;
			}
		},
		loadECU(value) {
			this.formInfo.ecuNames = value.ecuName;
			this.formInfo.ecuId = value.id;
			this.ecuData = value;
		},
	},
};
</script>

<style lang="scss" scoped>
.upload-demo {
	margin-right: 10px;
}
</style>
