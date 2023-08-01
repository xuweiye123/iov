<template>
  <app-drawer
    :visibles="visibles"
    :title="'解除绑定'"
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
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="VIN码：" prop="vinNo">
              <el-input
                v-model.trim="formInfo.vinNo"
                clearable
                placeholder="请选择VIN码"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
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
import { unbindData } from "@/api/carManageSys/testVehicle";

// 组件
export default {
  name: "unBindDrawer",
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
      contractcompanyList: [],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        remark: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入备注",
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
    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["remark"],
      });
      if (!formcenter) {
        return;
      }
      const { remark, vinNo, terminalCode, terminalId, carId } = this.formInfo;
      const postData = { remark, vinNo, terminalCode, terminalId, carId };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }

      this._unbindContact(postData);
    },

    _unbindContact(postData) {
      this.loading=true
      unbindData(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "解绑成功",
            duration: 2 * 1000,
          });
          this.$emit("unbind-complete");
          this.closeDrawer();
        }
      }).finally(() => {
        this.loading = false
      })
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
