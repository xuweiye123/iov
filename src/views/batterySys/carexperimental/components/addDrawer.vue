<template>
  <app-drawer
    :visibles="visibles"
    :title="'实验车辆报废信息'"
    :icon="'icon-dialog-add'"
    :width="'450px'"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form
        ref="formLeft"
        size="mini"
        :model="formInfo"
        :rules="rules"
        :label-position="'right'"
        label-width="90px"
      >
        <el-row justify="center" align="top">
          <el-col :span="24">
            <el-form-item label="VIN码：" prop="vinNo">
              <el-input
                maxlength="17"
                v-model="formInfo.vinNo"
                autocomplete="off"
                placeholder="请输入VIN码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报废时间：" prop="scrapTime">
              <el-date-picker
                v-model="formInfo.scrapTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { add } from "@/api/batterySys/carexperimental";

export default {
  name: "addDrawer",
  mixins: [partialForm,checkFormRule],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formInfo: {},
      loading: false,
      rules: {
        vinNo: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg:"vinno",
            tips: "请输入VIN码",
            errorTips: "请输入17位的字母或数字",   
            formObjName:'formInfo'
          },
        ],
        scrapTime: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择报废时间",  
            formObjName:'formInfo'
          },
        ],
      },
    };
  },
  methods: {
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
    },
    // 点击取消
    headleCancel() {
      this.closeDrawer();
    },
    //提交
    submitForm() {
      // 点击提交
      const checkLeft = this.checkForm({
        formName: "formLeft",
        formList: ["vinNo", "scrapTime"],
      });
      if (!checkLeft) {
        return;
      }
      this.loading = true;
      add(this.formInfo)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            this.$message.success({
              message: "新增成功",
              duration: 2 * 1000,
            });
            this.$emit("add-complete");
            this.closeDrawer();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped></style>
