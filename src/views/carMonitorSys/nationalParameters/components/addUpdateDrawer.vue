<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增国标参数' : '编辑国标参数'"
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
            <el-form-item label="参数名称：" prop="parameterName">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.parameterName"
                clearable
                placeholder="请输入参数名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数类型：" prop="parameterTypeId">
              <el-select
                v-model="formInfo.parameterTypeId"
                filterable
                clearable
                placeholder="请选择"
              >
              <!-- commontData.paramTypeList -->
                <el-option
                  v-for="(item, index) in paramTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数单位：" prop="parameterUnit">
              <el-input
                maxlength="10"
                v-model.trim="formInfo.parameterUnit"
                clearable
                placeholder="请输入参数单位"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注说明：">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                type="textarea"
                placeholder="请输入备注说明"
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
import { getDropList } from "@/mixins/dictionaryDropList";
// import { mapGetters } from "vuex";
// request
import {
  createParam,
  updateParam,
} from "@/api/carMonitorSys/nationalParameters";

// 组件
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm, checkFormRule,getDropList],
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
  computed: {
    // ...mapGetters(["commontData"]),
  },
  data() {
    return {
      loading: false,
      formInfo: {},
      tableRow: {},
      fileList: [],
      paramTypeList:[],
      dropList: [{ postData: { dicCode: 1012 }, key: "paramTypeList" }],
      rules: {
        parameterName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入参数名称",
            ruleReg: "functionName",
            errorTips: "支持汉字、字母、数字",
            formObjName: "formInfo",
          },
        ],
        parameterTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择参数类型",
            formObjName: "formInfo",
          },
        ],
        parameterUnit: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入参数单位",
            ruleReg: "alphanumeric",
            errorTips: "支持字母、数字",
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
          // 数据字典下拉
          this.getDropList(this.dropList)
          if(this.isEdit){
            this.formInfo = { ...this.data };
          }
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
      createParam(postData)
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
      updateParam(postData)
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
        formList: ["parameterName", "parameterTypeId", "parameterUnit"],
      });
      if (!formcenter) {
        return;
      }
      const {
        parameterName,
        parameterTypeId,
        parameterUnit,
        nationalStandardParameterId,
        remark,
      } = this.formInfo;
      const postData = {
        parameterName,
        parameterTypeId,
        parameterUnit,
        remark,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.nationalStandardParameterId = nationalStandardParameterId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
