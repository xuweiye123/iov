<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增产品型号信息' : '编辑产品型号信息'"
    :icon="!isEdit ? 'icon-dialog-add' : 'icon-dialog-update'"
    :width="'650px'"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-row type="flex" justify="center" align="top">
        <el-col :span="12">
          <el-form
            ref="formLeft"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
            label-width="90px"
          >
            <el-form-item label="产品型号：" prop="productModel" required>
              <el-input
                v-model="formInfo.productModel"
                placeholder="请输入产品型号"
                maxlength="30"
                clearable
              />
            </el-form-item>
            <el-form-item label="项目代号：" prop="projectCode">
              <el-input
                v-model="formInfo.projectCode"
                maxlength="20"
                placeholder="请输入项目代号"
                clearable
              />
            </el-form-item>
            <el-form-item label="通用名称：" prop="genericName" required>
              <el-input
                v-model="formInfo.genericName"
                placeholder="请输入通用名称"
                maxlength="30"
                clearable
              />
            </el-form-item>
            <el-form-item label="产品名称：" prop="vehmodelName" required>
              <el-input
                v-model="formInfo.vehmodelName"
                placeholder="请输入产品名称"
                maxlength="30"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form
            ref="formRight"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
            label-width="100px"
          >
            <el-form-item label="公告资质：" prop="qualifications">
              <el-input
                v-model="formInfo.qualifications"
                clearable
                maxlength="50"
                placeholder="请输入公告资质"
              />
            </el-form-item>

            <el-form-item label="公告批次：" prop="batchNumber">
              <!-- <el-input v-model="formInfo.fPhone" placeholder="联系电话" type="number" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" clearable oninput="if(value.length>11)value=value.slice(0,11)" /> -->
              <el-input
                v-model="formInfo.batchNumber"
                type="number"
                onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                oninput="if(value.length>5)value=value.slice(0,5)"
                placeholder="请输入公告批次"
                clearable
              />
            </el-form-item>
            <el-form-item label="电池类型：" prop="batteryType" >
              <!-- <el-input v-model="formInfo.fPhone" placeholder="联系电话" type="number" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" clearable oninput="if(value.length>11)value=value.slice(0,11)" /> -->
              <el-select
                v-model="formInfo.batteryType"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in celltypeList"
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
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import { ProductmodelAdd, ProductmodelUpdate } from "@/api/batterySys/model";

export default {
  name: "AddUpdateDialog",
  mixins: [partialForm,checkFormRule,getDropList],
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
      isclick: false,
      formInfo: {},
      rules: {
        productModel: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入产品型号",
            formObjName:'formInfo'
          }
        ],
        projectCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入项目代号",
            formObjName:'formInfo'
          }
        ],
        genericName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入通用名称",
            formObjName:'formInfo'
          }
        ],
        vehmodelName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入产品名称",
            formObjName:'formInfo'
          }
        ],
        qualifications: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入公告资质",
            formObjName:'formInfo'
          }
        ],
        batchNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入公告批次",
            formObjName:'formInfo'
          }
        ],
        batteryType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择电池类型",
            formObjName:'formInfo'
          }
        ],
      },
      loading: false,
      celltypeList: [],
       // 下拉
      dropList:[
        { postData:{dicCode:2006},key:'celltypeList' }
      ],
    };
  },
  watch: {
    visibles: {
      handler() {
        this.formInfo = { ...this.data };
        // 数据字典下拉
        this.getDropList(this.dropList)
      },
      immediate: true,
    },
  },
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
    },
    // 新增
    _proAdd(postData) {
      this.loading = true;
      ProductmodelAdd(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            this.$message.success({
              message: "新增成功",
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
          this.isclick = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _proUpdate(postData) {
      this.loading = true;
      ProductmodelUpdate(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            this.$message.success({
              message: "编辑成功",
              duration: 2 * 1000,
            });
            this.$emit("update-complete");
            this.closeDrawer();
          } else {
            this.$message.error({
              message: data.message,
              duration: 2 * 1000,
            });
          }
          this.isclick = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 点击提交
    
    submitForm() {
      const checkLeft = this.checkForm({
        formName: "formLeft",
        formList: [
          "productModel",
          "projectCode",
          "genericName",
          "vehmodelName",
        ],
      });
      const checkRight = this.checkForm({
        formName: "formRight",
        formList: ["qualifications", "batchNumber","batteryType"],
      });
      if (!checkLeft) {
        return;
      }
      if (!checkRight) {
        return;
      }
      this.isclick = true;
      const {
        productModel,
        projectCode,
        genericName,
        vehmodelName,
        qualifications,
        batchNumber,
        batteryType
      } = this.formInfo;
      const postData = {
        productModel,
        projectCode,
        genericName,
        vehmodelName,
        qualifications,
        batchNumber,
        batteryType
      };

      if (!this.isEdit) {
        this._proAdd(postData);
      } else {
        postData.id = this.formInfo.id;
        this._proUpdate(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
