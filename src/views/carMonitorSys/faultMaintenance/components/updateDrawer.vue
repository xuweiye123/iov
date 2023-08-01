<template>
  <app-drawer
    :visibles="visibles"
    :title="'编辑'"
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
        label-width="125px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="故障等级：" prop="faultLevel">
              <el-select
                v-model="formInfo.faultLevel"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in faultLevelList"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="允许处置时长(分钟)：" prop="continueTime">
              <el-input
                v-model.trim="formInfo.continueTime"
                clearable
                placeholder="请输入允许处置时长(分钟)"
                :maxlength="20"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="处置措施：" prop="disposalWay">
              <el-input
                v-model.trim="formInfo.disposalWay"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入处置措施"
                type="textarea"
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
import { updateHandle } from "@/api/carMonitorSys/faultMaintenance";

// 组件
export default {
  name: "updateDrawer",
  mixins: [partialForm, checkFormRule],
  components: {},
  props: {
    visibles: {
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
      faultLevelList: [
        { text: "一级", value: 1 },
        { text: "二级", value: 2 },
        { text: "三级", value: 3 },
      ],
      tableRow: {},
      rules: {
        faultLevel: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择故障等级",
            formObjName: "formInfo",
          },
        ],
        continueTime: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入处置时长",
            errorTips: "只能输入数字",
            ruleReg: "number",
            formObjName: "formInfo",
          },
        ],
        disposalWay: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入处置措施",
            // ruleReg: 'functionName',
            // errorTips: "支持汉字、字母、数字",
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
    // 编辑
    _Update(postData) {
      this.loading = true;
      updateHandle(postData)
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
        formList: ["faultLevel", "continueTime", "disposalWay"],
      });
      if (!formcenter) {
        return;
      }
      const { id, faultLevel, continueTime, disposalWay } = this.formInfo;
      const postData = { id, faultLevel, continueTime, disposalWay };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      this._Update(postData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
