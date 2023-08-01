<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增状态码' : '编辑状态码'"
    width="40%"
    @close-drawer="closeDialog"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
    :isDrawerFoot="true"
  >
    <el-form
      slot="drawerContent"
      ref="formCenter"
      :rules="rules"
      :model="formInfo"
      :label-position="'right'"
      label-width="120px"
    >
      <el-form-item label="状态码来源类型：" prop="codeType">
        <el-select
          v-model="formInfo.codeType"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in codeTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态码名称：" prop="codeName">
        <el-input
          v-model="formInfo.codeName"
          clearable
          placeholder="请输入状态码名称"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="状态码：" prop="code">
        <el-input
          v-model="formInfo.code"
          clearable
          placeholder="请输入状态码"
          maxlength="9"
        />
      </el-form-item>
      <el-form-item label="状态码描述：" prop="codeDes">
        <el-input
          v-model="formInfo.codeDes"
          clearable
          placeholder="请输入状态码描述"
          maxlength="20"
        />
      </el-form-item>
    </el-form>
  </app-drawer>
</template>

<script>
// request
import { createCodeInfo, updateCodeInfo } from "@/api/diagnosisSys/statusCode"
import { partialForm } from "@/mixins/partialForm"
import { checkFormRule } from "@/mixins/validateOne"
export default {
  name: "addUpdateDrawer",
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
        this.formInfo = { ...this.data }
      },
      immediate: true,
    },
  },
  data() {
    return {
      formInfo: {},
      loading:false,
      codeTypeList: [
        { label: "平台", value: 1 },
        { label: "API", value: 2 },
        { label: "终端", value: 3 },
      ],
      rules: {
        codeType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入状态码来源类型",
            formObjName: "formInfo",
          },
        ],
        codeName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入状态码名称",
            formObjName: "formInfo",
          },
        ],
        code: [
          {
            required: true,
            trigger: ["blur", "change"],
            ruleReg: "number",
            tips: "请输入状态码",
            errorTips: "状态码必须为数字值",
            validator: this.validInput,
          },
        ],
        codeDes: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入状态码描述",
            formObjName: "formInfo",
          },
        ],
      },
    }
  },
  methods: {
    radioChange(e) {
      this.formInfo.buttonPosition = e
    },
    // 关闭dialog
    closeDialog() {
      this.$emit("update:visibles", false)
    },
    // 新增
    _buttonAdd(postData) {
      this.loading = true;
      createCodeInfo(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$emit("add-complete")
          this.closeDialog()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 编辑
    _buttonUpdate(postData) {
      this.loading = true;
      updateCodeInfo(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$emit("update-complete")
          this.closeDialog()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["codeType", "codeName", "code", "codeDes"],
      })
      if (!formcenter) {
        return
      }
      if (!this.isEdit) {
        this._buttonAdd(this.formInfo)
      } else {
        this._buttonUpdate(this.formInfo)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
