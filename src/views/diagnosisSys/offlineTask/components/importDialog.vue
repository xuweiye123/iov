<template>
	<app-dialog
		class="ordinary"
		:visibles="visibles"
		:title="'导入'"
		width="35%"
		top="30vh"
		@close-dialog="closeDialog"
		@handle-submit="submitForm"
		:loading="loading"
		:isFooter="true"
	>
		<div slot="formContent">
			<!-- <el-form
				ref="form"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="50px"
			>
				<el-form-item label="文件：" prop="fileName"> -->
					<el-row :gutter="10" type="flex" justify="center">
						<el-col :span="16">
							<!-- :rules="rules" -->
							<el-form  
								ref="form"
								:model="formInfo">
								<el-form-item
									label-position="'right'"
									label-width="50px"
									label="文件："
									prop="fileName"
								>
									<el-input v-model="fileName" disabled />
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="4">
							<el-upload
								ref="upload"
								:headers="{ Authorization: token }"
								action="/api/diagnosis/offlineConfig/importConfig"
								:show-file-list="false"
								class="upload-demo"
								:auto-upload="false"
								:on-change="handleChange"
								:on-success="handleSuccess"
								:on-error="handleError"
								:accept="'.xls,.xlsx'"
							>
								<el-button class="import-btn" slot="trigger" type="primary"
									>浏览</el-button
								>
							</el-upload>
						</el-col>
					</el-row>
				<!-- </el-form-item>
			</el-form> -->
			<div style="display: flex;justify-content: center;">
				<div class="import-remark">
					<span class="textColor">注：</span>
					<div style="display: flex;justify-content: flex-start;flex-direction: column;">
						<div style="margin-bottom:10px;"> 1.仅支持 .xls,.xlsx 格式的文件，一次只能选择一个；</div>
						<div> 2.若已上传过的文件需重新选择方可上传。</div>
					</div>
				</div>
			</div>
		</div>
	</app-dialog>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
// request
import { downloadTemplate } from "@/api/diagnosisSys/offlineTask";
import store from "@/store";
export default {
	name: "importDialog",
	mixins: [partialForm],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		token() {
			return store.getters.token;
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				this.fileName = "";
			},
			immediate: true,
		},
	},
	data() {
		// 按钮文本
		const validateButtonName = (rule, value, cb) => {
			if (!this.fileName) {
				return cb(new Error("请选择文件"));
			}
		};
		return {
			formInfo: {},
			fileName: "",
			isError: false,
			loading: false,
			rules: {
				fileName: [
					{ required: true, trigger: "blur", validator: validateButtonName },
					{ trigger: "change", validator: validateButtonName },
				],
			},
		};
	},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
		submitForm() {
			// const form = this.checkForm({ formName: "form", formList: ["fileName"] });
			// if (!form) {
			// 	return;
			// }
			if (!this.fileName) {
				this.$message.warning({
					message: "请选择上传文件",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.isError) {
				this.$message.warning({
					message: "请重新上传文件",
				});
				return;
			}
			this.loading = true;
			this.$refs.upload.submit();
		},
		download() {
			downloadTemplate();
		},
		handleChange(file) {
			if (
				file.name.split(".").pop()!="xlsx" && this.fileName.split(".").pop()!="xls"
			) {
				this.$message.warning({
					message: "您选择的文件格式不正确！",
				});
				return;
			}
			if (file.response && file.response.code) {
				this.isError = true;
			} else {
				this.fileName = file.name;
				this.isError = false;
			}
		},
		handleSuccess(response, file) {
			this.loading = false;
			if (response.code === 0) {
				this.$emit("upload-success", response.data);
				this.closeDialog();
			} else {
				this.$message.warning({
					message: response.message,
				});
			}
		},
		handleError(err, file) {
			this.$message.warning("系统繁忙，请稍后再试");
		},
	},
};
</script>

<style lang="scss" scoped>
.import-remark {
  display: flex;
  justify-content: flex-start;
}
.import-btn {
	margin-left: 10px;
}
</style>
