<template>
  <app-dialog
      :visibles="visibles"
      :title="'导入'"
      width="35%"
      top="30vh"
      @close-dialog="closeDialog"
      @handle-submit="handleSubmit"
      :isFooter="true"
      :templateUrl="templateUrl"
      type='import'
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
            :on-error="fileError"
            :on-success="fileSuccess"
            :action="action"
            :data="data"
            class="el-upload-block"
          >
            <el-button type="primary">
              浏览
            </el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div style="display: flex;justify-content: center;">
				<div class="import-remark">
					<span class="textColor">注：</span>
					<div style="display: flex;justify-content: flex-start;flex-direction: column;">
						<div style="margin-bottom:10px;"> 1.仅支持 <span>{{ accept }} </span>格式的文件，一次只能选择一个；</div>
						<div> 2.若已上传过的文件需重新选择方可上传，最多导入<span class="textColor"> {{ maxNumber }} </span>行。</div>
					</div>
				</div>
			</div>
    </div>
  </app-dialog>
</template>

<script>
// 验证是否为excel
import readExcel from "@/utils/readExcel"
import { importCarInfo } from "@/api/carManageSys/carInform"
export default {
  name: "ImportDialog",
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "",
    },
    accept: {
			type: String,
			default: ".xls,.xlsx",
		},
    importName: {
      type: String,
      default: "",
    },
    importType: {
      type: Number,
      default: 0,
    },
    templateUrl: {
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
      leadingInPath: "",
      fileList: [],
      successList: [],
      failedList: [],
      uploadloading: null,
      uid: "",
      listQuery: {
        taskType: 3,
      },
      taskTypeList: [
        { text: "车辆状态查询", value: 1 },
        { text: "里程统计查询", value: 2 },
        { text: "车辆信息管理", value: 3 },
      ],
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
  },
  // components: { resultDialog },
  watch: {
    visibles(e1) {
      if (e1) {
        this.fileList = []
        this.leadingInPath = ""
        this.uid = ""
      }
    },
  },
  methods: {
    // 重置数据
    restStatus() {
      this.fileList = []
      this.leadingInPath = ""
      this.uploadloading.close()
    },
    // 上传之前得验证
    beforeupload(file) {
      this.uid = file.uid
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
      this.fileList = fileList.slice(-1)
      readExcel({ 0: file.raw })
        .then(() => {
          this.leadingInPath = file.name
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 导入车辆上传成功钩子
    fileSuccess(response) {
      if (response.code === 0 && response.data) {
        this.$notify({
          title: "成功",
          message: "文件上传成功",
          type: "success",
          duration: 3000,
        })
        // this.resultVisible = true
        // this.data = response.data
        this.$emit("upload-success", response.data)
      } else {
        this.$message.warning({
          message: response.message,
          duration: 2 * 1000,
        })
      }
      this.restStatus()
    },
    // 导入车辆上传失败钩子
    fileError(response, file, fileListt) {
      this.restStatus()
    },
    // 关闭
    closeDialog() {
      this.$emit("update:visibles", false)
    },
    // 取消
    handleCancel() {
      this.closeDialog()
    },
    // 提交
    handleSubmit() {
      console.log(this.importType);

      if (this.importType == 3) {
        if (this.fileList.length === 0) {
          this.$message.warning({
            message: "请选择上传文件",
            duration: 2 * 1000,
          })
          return
        }
        if (this.uid === this.fileList[0].uid) {
          this.$message.warning({
            message: "该文件已上传请重新选择上传文件",
            duration: 2 * 1000,
          })
          return false
        }
        console.log(this.fileList)
        let formData = new FormData()
        formData.append("file", this.fileList[0].raw)
        formData.append("taskType", this.listQuery.taskType)
        this.uploadloading = this.$loading({
          target: document.querySelector(".el-dialog-import-sim"),
          text: "文件上传中...",
          background: "rgba(1, 1, 1, 0.3)",
          customClass: "svg-otherColor",
        })
        this.restStatus()
        importCarInfo(formData).then((res) => {
          console.log(res)
          // debugger
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "文件上传成功",
              type: "success",
              duration: 3000,
            })
            // this.resultVisible = true
            // this.data = response.data
            this.$emit("upload-success", res.data.data)
          } else {
            this.$message.warning({
              message: res.message,
              duration: 2 * 1000,
            })
          }
          this.restStatus()
        })
      } else {
        if (this.fileList.length === 0) {
          this.$message.warning({
            message: "请选择上传文件",
            duration: 2 * 1000,
          })
          return
        }
        if (this.uid === this.fileList[0].uid) {
          this.$message.warning({
            message: "该文件已上传请重新选择上传文件",
            duration: 2 * 1000,
          })
          return false
        }
        this.$refs.upload.submit()
        this.uploadloading = this.$loading({
          target: document.querySelector(".el-dialog-import-sim"),
          text: "文件上传中...",
          background: "rgba(1, 1, 1, 0.3)",
          customClass: "svg-otherColor",
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.import-remark {
  display: flex;
  justify-content: flex-start;
}
::v-deep.el-icon-arrow-up:before {
  content: "";
}
</style>
