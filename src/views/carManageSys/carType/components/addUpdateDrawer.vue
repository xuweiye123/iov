<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增车型' : '编辑车型'"
    width="40%"
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
            <el-form-item label="车型名称：" prop="carTypeName">
              <el-input
                v-model.trim="formInfo.carTypeName"
                clearable
                placeholder="请输入车型名称"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="品牌：" prop="brandId">
              <el-select
                v-model.trim="formInfo.brandId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in brandList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目代号：" prop="carBatchCode">
              <el-input
                maxlength="20"
                v-model.trim="formInfo.carBatchCode"
                clearable
                placeholder="请输入项目代号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="VCU零部件号：">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.vcuPartNumber"
                clearable
                placeholder="请输入VCU零部件号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="MCU零部件号：">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.mcuPartNumber"
                clearable
                placeholder="请输入MCU零部件号"
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
                placeholder="请输入备注"
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
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import { createCarGroup, updateCarGroup } from "@/api/carManageSys/carType";
// 组件
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm, checkFormRule, getDropList],
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
      formInfo: {
        carTypeName: "",
        carBatchCode: "",
        brandId: "",
        mcuPartNumber: "",
        vcuPartNumber: "",
        remark: "",
      },
      tableRow: {},
      brandList: [
        // { label: "百度", value: 1 }
      ],
      // 下拉
      dropList: [
        { postData: { dicCode: 1001 }, key: "brandList" }
      ],
      rules: {
        carTypeName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入车型名称",
            formObjName: "formInfo",
          },
        ],
        brandId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择品牌",
            formObjName: "formInfo",
          },
        ],
        carBatchCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入项目代号",
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
          // 数据字典下拉
          this.getDropList(this.dropList)
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
      createCarGroup(postData)
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
      updateCarGroup(postData)
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
        formList: ["carTypeName", "carBatchCode", "brandId"],
      });
      if (!formcenter) {
        return;
      }
      const {
        carTypeName,
        carBatchCode,
        remark,
        vcuPartNumber,
        mcuPartNumber,
        carBatchId,
        carTypeId,
        brandId,
      } = this.formInfo;
      const postData = {
        carTypeName,
        carBatchCode,
        remark,
        vcuPartNumber,
        mcuPartNumber,
        brandId,
      };
      for (let k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.carBatchId = carBatchId;
        postData.carTypeId = carTypeId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
