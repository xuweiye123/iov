<template>
  <!--
       :http-request="uploadSectionFile" 
     -->
  <div class="upload-wrap">
    <el-upload
      :class="[isFile ? 'activeClass' : '']"
      ref="upload"
      :headers="{Authorization: token}"
      class="upload-demo"
      :action="action"
      :limit="1"
      :auto-upload="true"
      :show-file-list="true"
      :before-upload="beforeUpload"
      :accept="accept"
      :file-list="fileList"
      :on-change="fileChange"
      :on-progress="fileProgress"
      :on-remove="fileRemove"
      :on-success="fileSuccess"
      :on-error="fileError"
      :data="data"
      :disabled="!data.carModelId"
    >
      <!-- -->
      <el-button
        v-if="!isFile"
        :disabled="!data.carModelId"
        v-waves
      ><i class="iconfont icon-yunshangchuan mr-xs"></i>请选择导入文件</el-button>
      <div
        v-if="accept&&!isFile"
        slot="tip"
        class="el-upload__tip"
      >仅支持 <span>{{accept}}</span> 格式文件，一次只能选择一个
     </div>
    </el-upload>
  </div>
 <!-- ，且升级文件大小不超过<span>{{size}}{{unit}}</span> -->
  <!-- <el-upload
          ref="upload"
          :headers="{Authorization: token,language: lang}"
          :auto-upload="false"
          :show-file-list="false"
          :file-list="fileList"
          :multiple="true"
          :before-upload="beforeupload"
          :on-change="fileChange"
          :on-success="fileSuccess"
          :on-error="fileError"
          :action="action"
          :data="data"
          class="el-upload-block"
        >
          <el-button type="primary">
            浏览
          </el-button>
        </el-upload> -->
</template>

<script>
import { getUserLanguage } from "@/utils/auth";
// import resultDialog from './resultDialog'
export default {
  name: "uploadFile",
  props: {
    action: {
      type: String,
      default: "",
    },
    accept: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: {
        carModelId:'111'
      },
    },
    size: {
      type: Number,
      default: 4,
    },
    unit: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      lang: getUserLanguage(),
      fileList: [],
      isFile: false /* 是否有上传文件 */,
      fileName: "",
      uploadStart: false /* 是否开始上传 */,
      uploadEnd: false /* 上传完成 */,
      uploadSuspended: false /* 上传暂停 */,
    };
  },
  computed: {
    token() {
      return this.$store.getters.token;
    },
  },
  // components: { resultDialog },
  watch: { },
  methods: {
    /**
     * @name: 进度条的颜色值
     * @param {*} percentage
     */
    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
    /**
     * @name: 重置数据
     * @param {*}
     */
    restStatus() {
      this.fileList = [];
      this.isFile = false;
      this.uploadStart = false;
      this.uploadEnd = false;
      this.uploadSuspended = false;
    },
    uploadSectionFile(param) {
      console.log(param);
      var fileObj = param.file;
      // var FileController = "/file/item/upload";
      // FormData 对象
      var form = new FormData();
      // 文件对象
      form.append("file", fileObj);
      // 其他参数
      // form.append("xxx", xxx);
      // XMLHttpRequest 对象
      var xhr = new XMLHttpRequest();
      xhr.open("post", param.action, true);
      xhr.upload.addEventListener("progress", vm.progressFunction, false); //监听上传进度
      xhr.onload = function () {
        upload()
          .then(({ data }) => {
            if (data.code === 0) {
              console.log("1111");
            }
          })
          .catch(() => {
            console.log("2222");
          });
        // vm.Form.playUrl = xhr.response; //接收上传到阿里云的文件地址
        // vm.$message({
        //     message: '恭喜你，上传成功!',
        //     type: 'success'
        // });
      };
      xhr.send(form);
    },
    /**
     * @name: 上传前
     * @param {*} file
     */
    beforeUpload(file) {
      console.log(file);
      this.uploadStart = true;
      // var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      // const extension = testmsg === this.accept;
      // switch (this.unit) {
      //   case "GB":
      //     var isLt2M = file.size / 1024 / 1024 / 1024 < this.size;
      //     break;
      //   case "MB":
      //     var isLt2M = file.size / 1024 / 1024 < this.size;
      //     break;
      //   case "KB":
      //     var isLt2M = file.size / 1024 < this.size;
      //     break;
      //   default:
      //     break;
      // }
      // if (!extension) {
      //   this.$message.warning({
      //     message: "只能上传" + this.accept + "格式文件!",
      //     duration: 2 * 1000,
      //   });
      // }
      // if (!isLt2M) {
      //   this.$message.warning({
      //     message: "上传文件大小不能超过" + this.size + this.unit,
      //     duration: 2 * 1000,
      //   });
      // }
      // return extension && isLt2M;
      // return extension;
    },
    /**
     * @name: 文件状态改变时触发
     * @param {*}
     */
    // 文件状态改变时触发
    fileChange(file, fileList) {
      if (file.size === 0) {
        this.$message.warning({
          message: "上传文件不能为空!",
          duration: 2 * 1000,
        });
        this.restStatus();
      } else {
        this.fileName = file.name;
        if (this.fileName) {
          var testmsg = this.fileName.substring(
            this.fileName.lastIndexOf(".") + 1
          );
        }       
        // const extensionImg1 = testmsg === 'jpg'
        // const extensionImg2 = testmsg === 'png'
        // const extensionImg3 = testmsg === 'jpeg'
        const extensionFile1 = testmsg === 'zip'
        // const extensionFile2 = testmsg === 'xlsx'
        // const extension = testmsg === this.accept;
        this.fileList = fileList;

        /* 大小的限制 */
        // switch (this.unit) {
        //   case "GB":
        //     var isLt2M = file.size / 1024 / 1024 / 1024 < this.size;
        //     break;
        //   case "MB":
        //     var isLt2M = file.size / 1024 / 1024 < this.size;
        //     break;
        //   case "KB":
        //     var isLt2M = file.size / 1024 < this.size;
        //     break;
        //   default:
        //     break;
        // }
        if (!extensionFile1) {
          this.$message.warning({
            message: "只能上传" + this.accept + "格式文件!",
            duration: 2 * 1000,
          });
          this.restStatus();
        }
        // if (!isLt2M) {
        //   this.$message.warning({
        //     message: "上传文件大小不能超过" + this.size + this.unit,
        //     duration: 2 * 1000,
        //   });
        //   this.restStatus();
        // }
        else {
          if (this.fileList.length > 0) {
            this.isFile = true;
          }
        }
      }

      // return extension && isLt2M;
      // return extension;
    },

    fileProgress(file, fileList) {
      // console.log(file, fileList);
    },
    /**
     * @name: 删除
     * @param {*} file
     * @param {*} fileList
     */
    fileRemove(response, file, fileList) {
      console.log(response.data);
      console.log(file);
      this.$emit("upload-remove", file);
      this.restStatus();
    },
    /**
     * @name: 开始上传
     * @param {*}
     */
    submitUpload() {
      this.$refs.upload.submit();
    },
    /**
     * @name: 暂停
     * @param {*}
     */
    suspendedUpload(file) {
      console.log(file);
      this.uploadSuspended = true;
      this.$refs.upload.abort();
    },
    /**
     * @name: 继续
     * @param {*}
     */
    continueUpload(file) {
      console.log(file);
      this.uploadSuspended = false;
      this.submitUpload();
    },
    // 上传成功钩子
    fileSuccess(response, file, fileList) {
      this.uploadEnd = true;
      console.log(file, fileList);
      if (response.code === 0 && response.data) {
        this.$notify({
          title: '成功',
          message: '文件上传成功',
          type: "success",
          duration: 3000,
        });
        this.$emit("upload-success", response.data, file);
      } else {
        this.$message.warning({
          message: response.errmsg,
          duration: 2 * 1000,
        });
      }
    },
    // 上传失败钩子
    // eslint-disable-next-line no-unused-vars
    fileError(response, file, fileList) {
      this.uploadEnd = true;
      console.log(file);
    },
    // 关闭
    closeDialog() {
      this.$emit("update:visibles", false);
    },
    // 取消
    handleCancel() {
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
.el-upload__tip {
  color: $color-info;
  display: inline-block;
  margin-left:5px;
  span {
    color: $color-primary;
    margin: 0 2px;
  }
}
.table-file {
  p {
    margin: 0 0 10px 0;
    padding: 0;
    em {
      font-style: normal;
      color: $color-primary;
    }
  }
}
.upload-wrap ::v-deep {
  .table-file {
    p {
      margin: 0 0 10px 0;
      padding: 0;
      em {
        font-style: normal;
        color: $color-primary;
      }
    }
    .el-button {
      &.el-button--primary {
        height: 28px;
      }
    }
  }
  .el-table--mini td {
    padding: 5px 0;
  }
  .el-table--mini th {
    padding: 0;
  }
  .el-table--mini td,
  .el-table--mini th {
    border-right: 0;
  }
  .el-table--mini tr {
    background: none;
  }
  .activeClass {
    .el-upload {
      display: initial !important;
    }
  }
}
</style>
