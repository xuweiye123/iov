<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增SIM卡' : '编辑SIM卡'"
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
            <el-form-item label="运营商：" prop="carrierType">
              <el-radio-group v-model="formInfo.carrierType">
                <el-radio :label="1">
                  移动
                </el-radio>
                <el-radio :label="2">
                  联通
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码：" prop="simNumber">
              <el-input
                :maxlength="20"
                v-model.trim="formInfo.simNumber"
                clearable
                placeholder="请输入手机号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ICCID：" prop="iccid">
              <el-input
                :maxlength="20"
                v-model.trim="formInfo.iccid"
                clearable
                placeholder="请输入ICCID"
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

import reg from "@/utils/reg";

// request
import { createSim, updateSim } from "@/api/carManageSys/simManage";

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
    const validatesimnum = (rule, value, cb) => {
      if (this.formInfo.carrierType === "" || this.formInfo.carrierType === undefined) {
        return cb(new Error("请输入手机号码"));
      }
      if (this.formInfo.carrierType === 1 && !reg.ydSim.test(value)) {
        return cb(new Error("移动手机号为11位或13位数字"));
      }
      if (this.formInfo.carrierType === 2 && !reg.iccid.test(value)) {
        return cb(new Error("联通手机号20位字母和数字"));
      }
    };
    return {
      loading: false,
      formInfo: {},
      contractcompanyList: [],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        simNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validatesimnum,
          },
        ],
        carrierType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择运营商",
            formObjName: "formInfo",
          },
        ],
        iccid: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            errorTips:"请输入20位的字母、数字",
            ruleReg: 'iccid',
            tips: "请输入ICCID",
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
          this.formInfo = { ...{ gender: "" }, ...this.data };
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
      createSim(postData)
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
      updateSim(postData)
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
        formList: ["simNumber", "carrierType", "iccid"],
      });
      if (!formcenter) {
        return;
      }
      const { simNumber, simId, iccid, carrierType, remark } = this.formInfo;
      const postData = { simNumber, iccid, carrierType, remark };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.simId = simId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
