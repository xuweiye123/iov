<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增零部件' : '编辑零部件'"
    width="45%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="110px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="部件名称：" prop="carPartName">
              <el-input
                v-model.trim="formInfo.carPartName"
                clearable
                placeholder="请输入部件名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部件代码：" prop="carPartCode">
              <el-input
                v-model.trim="formInfo.carPartCode"
                clearable
                placeholder="请输入部件代码"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部件全称：" prop="fullPartName">
              <el-input
                v-model.trim="formInfo.fullPartName"
                clearable
                placeholder="请输入部件全称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                type="textarea"
                placeholder="请输入备注"
                maxlength="200"
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
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";

// request
import { createCarPart, updateCarPart } from "@/api/carMonitorSys/partsManage";

// 组件
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
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      formInfo: {},
      contractcompanyList: [],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        carPartName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入部件名称",
            ruleReg: "functionName",
            errorTips: "支持汉字、字母、数字",
            formObjName: "formInfo",
          },
        ],
        carPartCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入部件代码",
            ruleReg: "functionName",
            errorTips: "支持汉字、字母、数字",
            formObjName: "formInfo",
          },
        ],
        fullPartName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入部件全称",
            ruleReg: "functionName",
            errorTips: "支持汉字、字母、数字",
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
          this.formInfo = { ...this.data };
        }
      },
    },
  },
  created() {},
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createCarPart(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("add-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _Update(postData) {
      this.loading = true;
      updateCarPart(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("update-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["carPartName", "carPartCode", "fullPartName"],
      });
      if (!formcenter) {
        return;
      }
      const {
        carPartId,
        carPartName,
        carPartCode,
        fullPartName,
        remark,
      } = this.formInfo;

      const postData = { carPartName, carPartCode, fullPartName, remark };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.carPartId = carPartId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
