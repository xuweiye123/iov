<template>
	<app-dialog
		:visibles="visibles"
		:title="title"
		width="40%"
		top="26vh"
		@close-dialog="closeDialog"
		@handle-submit="handleSubmit"
		:isFooter="true&&templateUrl"
		:templateUrl="templateUrl"
		type="import"
		class="ordinary"
	>
		<div slot="formContent">
			<el-row :gutter="10" type="flex" justify="center">
				<el-col :span="16">
					<el-form>
						<el-form-item
							label-position="'right'"
							label-width="50px"
							label="文件："
						>
							<el-input v-model="leadingInPath" disabled />
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="4">
					<el-upload
						ref="upload"
						:headers="{ Authorization: token }"
						:auto-upload="false"
						:show-file-list="false"
						:file-list="fileList"
						:multiple="true"
						:before-upload="beforeupload"
						:on-change="fileChange"
						:on-success="fileSuccess"
						:on-error="fileError"
						:action="action"
						:data="fileTime"
						:accept="accept"
						class="el-upload-block"
					>
						<el-button type="primary">
							浏览
						</el-button>
					</el-upload>
				</el-col>
			</el-row>
			<div style="display: flex;justify-content: center;margin-bottom: 15px;">
				<div class="import-remark">
					<span class="textColor">注：</span>
					<div style="display: flex;justify-content: flex-start;flex-direction: column;">
						<div style="margin-bottom:10px;"> 1.仅支持 <span>{{ accept }}</span> 格式的文件，一次只能选择一个；</div>
						<div> 2.若已上传过的文件需重新选择方可上传，最多导入<span class="textColor"> {{ maxNumber }} </span>行。</div>
					</div>
				</div>
			</div>
			<el-row :gutter="10" type="flex" justify="center">
      <el-col :span="24">
        <el-form :label-position="'right'" :model="fileTime" label-width="80px">
					<el-form-item label="任务时间：" prop="timeRange">
							<el-date-picker
								v-model="timeRange"
								type="datetimerange"
								range-separator="~"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="yyyy-MM-dd HH:mm:ss"
								:default-time="['00:00:00', '23:59:59']"
								unlink-panels
							>
							</el-date-picker>
						</el-form-item>
          <!-- <el-form-item label="开始时间：">
            <el-date-picker
              v-model="fileTime.startTime"
              filterable
              clearable
              placeholder="请选择"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item> -->
        </el-form>
      </el-col>
      <!-- <el-col :span="12">
        <el-form :label-position="'right'" :model="fileTime" label-width="80px">
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="fileTime.endTime"
              filterable
              clearable
              placeholder="请选择"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form>
      </el-col> -->
    </el-row>
			<!-- 导入失败信息插槽 -->
			<slot />
			<span slot="footerButton" v-if="!templateUrl" class="dialog-footer">
				<el-button v-waves @click="downloadTemplate">
					<span class="templateUrl"
						><i
							class="iconfont icon-import"
							style="font-size: 12px !important"
						></i
						>下载模板</span
					>
				</el-button>
				<el-button
					:loading="loading"
					v-waves
					type="primary"
					@click="handleSubmit"
					>确定</el-button
				>
			</span>
		</div>
	</app-dialog>
</template>

<script>
// 验证是否为excel
import readExcel from "@/utils/readExcel";
// import resultDialog from './resultDialog'
export default {
	name: "ImportDialog",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "导入",
		},
		action: {
			type: String,
			default: "",
		},
		accept: {
			type: String,
			default: ".xls,.xlsx",
		},
		templateUrl: {
			type: String,
			default: "",
		},
		templateDownloadUrl: {
			type: String,
			default: "",
		},
		appendToBody: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: null,
		},
		maxNumber:{
      type: Number,
			default: 1000,
		}
	},
	data() {
		return {
			fileTime:{
        startTime:'',
        endTime:'',
        // faultcode:''
      },
			timeRange:["",""],
			leadingInPath: "",
			fileList: [],
			successList: [],
			failedList: [],
			loading:false,
			uploadloading: null,
			uid: "",
			// resultVisible: false,
			// data: {}
		};
	},
	computed: {
		token() {
			return this.$store.getters.token;
		},
	},
	// components: { resultDialog },
	watch: {
		visibles(e1) {
			if (e1) {
				this.fileList = [];
				this.leadingInPath = "";
				this.uid = "";
				this.fileTime = {
          startTime:'',
          endTime:'',
          // faultcode:''
        };
				this.timeRange=["",""];
			}
		},
		'timeRange':{
       handler(e1){
				// console.log(e1,123)
				if(e1){
					this.fileTime.startTime=e1[0]
					this.fileTime.endTime=e1[1]
				}else{
					this.fileTime.startTime=""
					this.fileTime.endTime=""
				}
			}
		}
	},
	methods: {
		//模板下载
		downloadTemplate() {
			
		},
		// 重置数据
		restStatus() {
			this.fileList = [];
			this.leadingInPath = "";
			this.uploadloading.close();
		},
		// 上传之前得验证
		beforeupload(file) {
			this.uid = file.uid;
		},
		// 文件状态改变时触发
		fileChange(file, fileList) {
			// if (file.size / 1024 > 300) {
			//   this.$message({
			//     message: "上传文件大小不应超过300KB，请重新上传",
			//     type: "error"
			//   });
			//   return;
			// }
			// 获取最新的文件
			this.fileList = fileList.slice(-1);
			readExcel({ 0: file.raw })
				.then(() => {
					this.leadingInPath = file.name;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 导入车辆上传成功钩子
		fileSuccess(response) {
			if (response.code === 0 && response.data) {
				this.$notify({
					title: "成功",
					message: "文件上传成功",
					type: "success",
					duration: 3000,
				});
				response.data.fileTime=this.fileTime
				this.$emit("upload-success", response.data);
			} else {
				this.$message.warning({
					message: response.message,
					duration: 2 * 1000,
				});
			}
			this.restStatus();
		},
		// 导入车辆上传失败钩子
		fileError(response, file, fileListt) {
			this.restStatus();
		},
		// 关闭
		closeDialog() {
			this.fileTime = {
        startTime:'',
        endTime:'',
        // faultcode:''
      };
			this.timeRange=["",""];
			this.$emit("update:visibles", false);
		},
		// 取消
		handleCancel() {
			this.closeDialog();
		},
		// 提交
		handleSubmit() {
			if (this.fileList.length === 0) {
				this.$message.warning({
					message: "请选择上传文件",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.uid === this.fileList[0].uid) {
				this.$message.warning({
					message: "该文件已上传请重新选择上传文件",
					duration: 2 * 1000,
				});
				return false;
			}
			this.$refs.upload.submit();
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-import-sim"),
				text: "文件上传中...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.import-remark {
  display: flex;
  justify-content: flex-start;
}
</style>
