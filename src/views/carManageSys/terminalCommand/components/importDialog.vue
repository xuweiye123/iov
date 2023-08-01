<template>
  <app-dialog
    :visibles="visibles"
    :title="title"
    width="35%"
    @close-dialog="closeDialog"
    @handle-submit="handleSubmit"
    :isFooter="true"
    class="ordinary"
  >
    <div slot="formContent">
      <div v-for="(item, index) in myItems" :key="index">
        <el-row
          v-if="item.name === 'fileName'"
          :gutter="10"
          type="flex"
          justify="center"
        >
          <el-col :span="20">
            <el-form
              ref="fileName"
              label-position="'right'"
              :label-width="item.labelWidth"
              :model="formInfo"
            >
              <el-form-item
                :rules="rulesFun(/.+/, item.errorText)"
                :prop="item.name"
                :label="item.fieldLabel"
              >
                <el-input :placeholder="item.fieldLabel.replace('：','')" disabled clearable v-model="formInfo.fileName" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4">
            <el-upload
              id="upload"
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
              :accept="data&&data.reservedField2?data.reservedField2:''"
              action="api/vehicle/terminalCommandPacket/uploadFile"
            >
            <!-- accept=".pdf" -->
              <el-button type="primary">浏览 </el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-form
          v-else-if="item.name === 'isDefault'"
          label-position="'right'"
          :label-width="item.labelWidth"
        >
          <el-form-item :label="item.fieldLabel" :prop="item.name">
            <el-checkbox v-model="formInfo.isDefault">是</el-checkbox>
          </el-form-item>
        </el-form>
        <el-form
          ref="fileVersion"
          v-else-if="item.name === 'fileVersion'"
          label-position="'right'"
          :label-width="item.labelWidth"
          :model="formInfo"
        >
          <el-form-item
            :label="item.fieldLabel"
            :rules="rulesFun(/.+/, '')"
            :prop="item.name"
          >
            <el-input :placeholder="item.fieldLabel.replace('：','')" clearable v-model="formInfo.fileVersion" maxlength="15" />
          </el-form-item>
        </el-form>
        <el-form
          v-else-if="item.name === 'fileRemark'"
          label-position="'right'"
          :label-width="item.labelWidth"
        >
          <el-form-item :label="item.fieldLabel" :prop="item.name">
            <el-input :placeholder="item.fieldLabel.replace('：','')" clearable v-model="formInfo.fileRemark" maxlength="100" />
          </el-form-item>
        </el-form>
        <el-form
          v-else-if="item.name === 'terminalFilePath'"
          label-position="'right'"
          :label-width="item.labelWidth"
          :model="formInfo"
        >
          <el-form-item
            :model="formInfo"
            :label="item.fieldLabel"
            :prop="item.name"
          >
            <el-input :placeholder="item.fieldLabel.replace('：','')" clearable v-model="formInfo.terminalFilePath" maxlength="100" />
          </el-form-item>
        </el-form>

        <el-form
          v-else-if="item.name === 'fileLable1'"
          :ref="'fileLable1'"
          label-position="'right'"
          :label-width="item.labelWidth"
          :model="formInfo"
        >
          <el-form-item
            :rules="rulesFun(item.regex, item.errorText)"
            :prop="item.name"
            :label="item.fieldLabel"
          >
            <el-input
              clearable
              v-model="formInfo.fileLable1"
              :value="item.value"
              :placeholder="item.fieldLabel.replace('：','')"
              maxlength="100"
            />
          </el-form-item>
        </el-form>
        <el-form
          v-else-if="item.name === 'fileLable2'"
          :ref="'fileLable2'"
          :model="formInfo"
          label-position="'right'"
          :label-width="item.labelWidth"
        >
          <el-form-item
            :rules="rulesFun(item.regex, item.errorText)"
            :prop="item.name"
            :label="item.fieldLabel"
          >
            <el-input
              clearable
              v-model="formInfo.fileLable2"
              :value="item.value"
              :placeholder="item.fieldLabel.replace('：','')"
              maxlength="100"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </app-dialog>
</template>

<script>
const urlReg = /^(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@@)|\/|\?)*)?$/i;
const portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
export default {
  name: "ImportDialog",
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "上传",
    },
  },
  watch: {
    visibles(e1) {
      this.formInfo.fileName = "";
      if (e1) {
        this.uid = "";
        this.myItems = [];
        let items = [];
        if (this.data.commandType === 1) {
          // console.log(this.data.reservedField3)
          if (this.data.reservedField3 == "bin") {
            //升级程序
            items = [
              {
                name: "fileName",
                labelWidth: "60px",
                fieldLabel: "文件：",
                errorText: "请选择文件",
              },
              {
                name: "fileVersion",
                labelWidth: "60px",
                fieldLabel: "版本号：",
              },
              { name: "fileRemark", labelWidth: "60px", fieldLabel: "说明：" },
            ];
          } else if (this.data.reservedField3 == "dbc") {
            //升级dbc
            items = [
              {
                name: "fileName",
                labelWidth: "100px",
                fieldLabel: "文件：",
                errorText: "请选择文件",
              },
              {
                name: "isDefault",
                fieldLabel: "是否设置默认：",
                boxLabel: "是",
                labelWidth: "100px",
              },
              {
                name: "terminalFilePath",
                fieldLabel: "上传路径：",
                labelWidth: "100px",
                regex: /^(\/[a-zA-Z_0-9]+)*$/i,
                regexText: "请填写DBC存放路径。如：/flash或/dbc/01",
                emptyText: "/flash",
                allowBlank: false,
                value: "/flash",
                maxLength: 100,
              },
              {
                name: "fileRemark",
                fieldLabel: "说明：",
                maxLength: 100,
                labelWidth: "100px",
              },
            ];
            this.formInfo.isDefault = true;
          } else {
            //上传其它文件
            items = [
              {
                name: "fileName",
                labelWidth: "50px",
                fieldLabel: "文件：",
                errorText: "请选择文件",
              },
              {
                name: "fileRemark",
                labelWidth: "50px",
                fieldLabel: "说明：",
                maxLength: 100,
              },
            ];
            if (this.data.reservedField3 == "pkg") {
              items.splice(1, 0, {
                name: "terminalFilePath",
                labelWidth: "60px",
                fieldLabel: "上传路径：",
                regex: /^(\/[a-zA-Z_0-9]+)*$/i,
                regexText: "请填写pkg存放路径。如：/flash",
                emptyText: "/flash",
                allowBlank: false,
                value: "/flash",
                maxLength: 100,
              });
              this.formInfo.terminalFilePath = "/flash";
            }
          }

          this.myItems = items;
        } else {
          let nameArray = this.data.commandName.split(","),
            regStrArray = this.data.reservedField2.split("\n"),
            reg1 =
              regStrArray[0] == "url" ? urlReg : new RegExp(regStrArray[0]),
            reg2 =
              regStrArray[1] == "port" ? portReg : new RegExp(regStrArray[1]),
            errorText1 = "输入值非法",
            errorText2 = "输入值非法";
          // errorText1 = this.data.remark.split('；')[0] || '输入值非法',
          // errorText2 = this.data.remark.split('；')[1] || '输入值非法';
          this.myItems = [
            {
              name: "fileLable1",
              fieldLabel: nameArray[0] + "：",
              labelWidth: "100px",
              regex: reg1,
              errorText: errorText1,
            },
            {
              name: "fileLable2",
              fieldLabel: nameArray[1] + "：",
              labelWidth: "100px",
              regex: reg2,
              errorText: errorText2,
            },
          ];
        }
      }
    },
  },
  data() {
    return {
      fileList: [],
      uploadloading: null,
      uid: "",
      list: [],
      myItems: [],
      formInfo: {
        isDefault: true, // 是否默认
        fileName: "",
      },
    };
  },
  computed: {
    token() {
      return this.$store.getters.token;
    },
  },
  methods: {
    rulesFun(reg, errorText) {
      const validate = (rule, value, cb) => {
        if (value === "" || value === undefined) {
          return cb(new Error("该项为必填项"));
        }
        if (!reg.test(value)) {
          return cb(new Error(errorText));
        }
        if (value === 0) {
          return cb(new Error("该项不能为0"));
        }
      };
      return [
        { required: true, trigger: ["blur", "change"], validator: validate },
      ];
    },
    // 重置数据
    restStatus() {
      this.fileList = [];
      this.uploadloading.close();
    },
    // 上传之前得验证
    beforeupload(file) {
      this.uid = file.uid;
    },
    // 文件状态改变时触发
    fileChange(file, fileList) {
      // 获取最新的文件
      this.fileList = fileList.slice(-1);
      if (this.data.reservedField2 == null) {
        this.formInfo.fileName = file.name;
      } else {
        if (this.fileList[0].name.indexOf(this.data.reservedField2) > -1) {
          this.formInfo.fileName = file.name;
        } else {
          this.$message.warning({
            message: this.data.remark,
            duration: 2000,
          });
        }
      }
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
        if (response.code === 0) {
          try {
            let result = JSON.parse(response.data);
            let postData = this.getPostData();
            postData.newFileName = result[0].NEWNAME;
            postData.oldFileName = result[0].OLDNAME;
            postData.filePath = result[0].FILEPATH;
            this.$emit("uploadSuccess", postData);
            this.closeDialog();
          } catch (err) {
            console.log(err);
            this.uploadloading.close();
          }
        }
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
    getPostData() {
      let postData = {};
      for (let keys in this.formInfo) {
        const index = this.myItems.findIndex((item) => item.name === keys);
        if (index > -1) {
          if (keys === "fileName") {
            postData.param = this.formInfo[keys];
          } else {
            postData[keys] = this.formInfo[keys];
          }
        }
      }
      return postData;
    },
    restData() {
      this.fileList = [];
      this.uid = "";
      this.list = [];
      this.myItems = [];
      for (let keys in this.formInfo) {
        this.formInfo[keys] = "";
      }
    },
    // 关闭
    closeDialog() {
      this.restData();
      this.$emit("update:visibles", false);
    },
    upLoadFile() {
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
      this.$refs.upload[0].submit();
      this.uploadloading = this.$loading({
        target: document.querySelector(".el-dialog-import-sim"),
        text: "文件上传中...",
        background: "rgba(1, 1, 1, 0.3)",
        customClass: "svg-otherColor",
      });
    },

    // 提交
    handleSubmit() {
      // 还需要判断
      const index = this.myItems.findIndex((item) => item.name === "fileName");
      // 处理文件上传
      if (index > -1) {
        let check1 = true;
        let check0 = true;
        if (this.data.reservedField3 == "bin") {
          this.$refs["fileVersion"][0].validate((valid) => {
            if (!valid) {
              check0 = false;
            }
          });
        }
        this.$refs["fileName"][0].validate((valid) => {
          if (!valid) {
            check1 = false;
          }
        });
        if (!check1 || !check0) return;
        this.upLoadFile();
      } else {
        let check1 = true;
        this.$refs["fileLable1"][0].validate((valid) => {
          if (!valid) {
            check1 = false;
          }
        });
        let check2 = true;
        this.$refs["fileLable2"][0].validate((valid) => {
          console.log(valid);
          if (!valid) {
            check2 = false;
          }
        });
        if (!check1 || !check2) return;
        let postData = this.getPostData();
        postData.param = "";
        for (let keys in this.formInfo) {
          if (postData[keys]) {
            postData.param += postData[keys] + ",";
          }
        }
        postData.param = postData.param.substr(0, postData.param.length - 1);
        this.restData();
        this.$emit("params-edit-success", postData);
        this.closeDialog();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
