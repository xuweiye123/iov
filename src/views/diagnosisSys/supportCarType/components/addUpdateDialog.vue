<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增车型' : '编辑车型'"
    width="40%"
    @close-drawer="closeDialog"
    :isOkButLoading="loading"
    @ok-drawer="submitForm"
    :isDrawerFoot="true"
  >
    <el-form
      slot="drawerContent"
      ref="formCenter"
      :rules="rules"
      :model="formInfo"
      :label-position="'right'"
      label-width="82px"
    >
      <el-form-item label="车型名称：" prop="carTypeId">
        <el-select
          v-model="formInfo.carTypeId"
          placeholder="请选择"
          filterable
          clearable
          @change="changeCarType"
        >
          <el-option
            v-for="(item, index) in carTypeList"
            :key="index"
            :value="item.carTypeId"
            :label="item.carTypeName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-row type="flex" justify="start" align="middle">
        <el-col :span="18">
          <el-form-item label="PDX文件：" prop="fileName">
            <el-input
              v-model="fileName"
              placeholder="请上传PDX文件"
              clearable
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-upload
            ref="upload"
            :headers="{ Authorization: token }"
            :action="uploadUrl"
            :show-file-list="false"
            class="upload-demo-type"
            :data="formInfo"
            :auto-upload="false"
            :on-progress="handleProgess"
            :on-error="handleError"
            :on-change="handleChange"
            :on-success="handleSuccess"
          >
            <el-button slot="trigger" type="primary">选择文件</el-button>
          </el-upload>
        </el-col>
      </el-row> -->
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
</template>

<script>
// request
import {
  createSupportCarType,
  updateSupportCarType,
} from "@/api/diagnosisSys/supportCarType";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { getCarTypeList } from "@/api/diagnosisSys/commont";
import store from "@/store";
export default {
  name: "addUpdateDialog",
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
        if (e1) {
          this.setCarTypeName();
          if (this.isEdit) {
            this.formInfo = { ...this.data };
            // this.uploadUrl = "/api/diagnosis/carType/updateSupportCarTypePdx";
            // this.fileName = this.data.pdxFileName;
          } else {
            // this.fileName = "";
            // this.uploadUrl = "/api/diagnosis/carType/createCarTypePdx";
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    token() {
      return store.getters.token;
    },
  },
  data() {
    return {
      formInfo: {
        carTypeId: "",
      },
      carTypeList: "",
      rules: {
        carTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车型名称",
            formObjName: "formInfo",
          },
        ],
      },
      // fileName: "",
      listLoading: false,
      loading: false,
      // uploadUrl: "",
      // fileFlag: false,
      // pdxVisble: false,
    };
  },
  methods: {
    setCarTypeName() {
      getCarTypeList().then(({ data }) => {
        if (data.code === 0) {
          this.carTypeList = data.data || [];
        }
      });
    },
    changeCarType(val) {
      let obj = this.carTypeList.find((item) => {
        return item.carTypeId === val;
      });
      this.formInfo.carTypeName = obj.carTypeName;
    },
    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["carTypeId"],
      });
      if (!formcenter) {
        return;
      }
      if (!this.isEdit) {
        this._createSupportCarType();
      } else {
        this._updateSupportCarType();
      }
    },
    // 新增
    _createSupportCarType() {
      this.loading = true;
      // if (!this.fileFlag) {
        createSupportCarType(this.formInfo)
          .then(({ data }) => {
            this.loading = false;
            if (data.code === 0) {
              this.$emit("add-complete");
              this.closeDialog();
            }
          })
          .catch(() => {
            this.loading = false;
          });
      // } else {
      //   this.$refs.upload.submit();
      // }
    },
    // 编辑
    _updateSupportCarType() {
      this.loading = true;
      // if (!this.fileFlag) {
        const postdata = {
          carTypeName: this.formInfo.carTypeName,
          carTypeId: this.formInfo.carTypeId,
          id: this.formInfo.id,
          remark: this.formInfo.remark,
        };
        updateSupportCarType(postdata)
          .then(({ data }) => {
            this.loading = false;
            if (data.code === 0) {
              this.$emit("update-complete");
              this.closeDialog();
            }
          })
          .catch(() => {
            this.loading = false;
          });
      // } else {
      //   this.$refs.upload.submit();
      // }
    },
    // 关闭dialog
    closeDialog() {
      // this.fileName = "";
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // handleProgess() {
    //   this.listLoading = true;
    // },
    // handleChange(file) {
    //   if (file.name.indexOf(".pdx") > -1) {
    //     this.fileName = file.name;
    //     this.fileFlag = true;
    //   } else {
    //     this.$alert("您选择的文件格式不正确！", "提示", {
    //       confirmButton: "确定",
    //     });
    //     this.$refs.upload.clearFiles();
    //   }
    // },
    // handleError() {
    //   this.listLoading = false;
    //   this.$message.warning("系统繁忙，请稍后再试");
    // },
    // handleSuccess(response) {
    //   this.loading = false;
    //   if (response.code != 0) {
    //     this.$message.warning({
    //       message: response.message,
    //     });
    //   }
    //   if (!this.isEdit) {
    //     this.$emit("add-complete");
    //   } else {
    //     this.$emit("update-complete");
    //   }
    //   this.closeDialog();
    // },
  },
};
</script>

<style lang="scss" scoped>
.upload-demo-type {
  margin: 0 0 18px 10px;
}
</style>
