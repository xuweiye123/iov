<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '解绑配置号信息' : '编辑配置号信息'"
    :icon="!isEdit ? 'icon-dialog-add' : 'icon-dialog-update'"
    :width="'500px'"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-row type="flex" justify="center" align="top">
        <el-col :span="20">
          <el-form
            ref="formLeft"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
            label-width="110px"
          >
            <el-form-item label="配置号：" prop="configureNumber" required>
              <el-input
                v-model="formInfo.configureNumber"
                placeholder="请输入配置号"
                maxlength="30"
                clearable
                disabled
              />
            </el-form-item>

            <el-form-item label="电池包厂商规格：" prop="packSpec" required>
              <el-select
                v-model="formInfo.packSpec"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in packageList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import { unbindConfig, bindPackages } from "@/api/batterySys/configure";
//组件
export default {
  name: "AddUpdateDialog",
  mixins: [partialForm,checkFormRule],
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
    }
  },
  data() {
    return {
      formInfo: { configureNumber: "" },
      loading: false,
      rules: {
        packSpec: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择电池包厂商规格",
            formObjName:'formInfo'
          }
        ],
      },
      packageList: [],
    };
  },
  watch: {
    visibles: {
      handler(v) {
        if (v) {
          this.formInfo = { ...this.data };
          let params = {
            configNum: this.formInfo.configureNumber,
            configureNumber: this.formInfo.configureNumber,
            productModel: this.formInfo.productModel,
          };
          //获取电池包规格
          bindPackages(params).then(({ data }) => {
            if (data.code === 0) {
              this.packageList = data.data || [];
            }
          });
        }
      },
    },
  },
  created() {},
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
    },
    // 解绑
    _proAdd(postData) {
      this.loading = true;
      unbindConfig(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            this.$message.success({
              message: "解绑成功",
              duration: 2 * 1000,
            });
            this.$emit("add-complete");
            this.closeDrawer();
          } else {
            this.$message.error({
              message: data.message,
              duration: 2 * 1000,
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 点击提交
    submitForm() {
      const checkLeft = this.checkForm({
        formName: "formLeft",
        formList: ["packSpec"],
      });
      if (!checkLeft) {
        return;
      }
      const postData = {};
      postData.packSpec = this.formInfo.packSpec;
      postData.configNum = this.formInfo.configureNumber;
      if (!this.isEdit) {
        this._proAdd(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.car_title {
  color: #409eff;
  padding: 0 0 10px 0;
  margin-top: 0;
  font-size: 14px !important;
  border-bottom: 2px solid #e2f1ff;
}
</style>
