<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增数据字典' : '编辑数据字典'"
    width="45%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-scrollbar wrap-class="default-scrollbar__wrap">
        <el-form
          ref="formCenter"
          :rules="rules"
          :model="formInfo"
          :label-position="'right'"
          label-width="110px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="字典编号：" prop="dicCode">
                <el-input-number 
                   step-strictly
                  :disabled="!isEdit ? false : true"
                  v-model="formInfo.dicCode"
                  :min="1001"
                  :max="9999"
                >
                </el-input-number>
                <!-- <el-input
                  maxlength="20"
                  v-model.trim="formInfo.dicCode"
                  :disabled="!isEdit ? false : true"
                  clearable
                  placeholder="请输入字典编号"
                /> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字典名称：" prop="dicName">
                <el-input
                  maxlength="20"
                  v-model.trim="formInfo.dicName"
                  clearable
                  placeholder="请输入字典名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字典状态：" required prop="isDisabled">
                <el-radio-group v-model="formInfo.isDisabled">
                  <el-radio :label="0">禁用</el-radio>
                  <el-radio :label="1">启用</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="字典状态：" prop="isDisabled">
                <el-select
                  v-model="formInfo.isDisabled"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in isDisabledList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item> -->
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
      </el-scrollbar>
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";

// request
import { getDictionaryCode, createDictionary, updateDictionary } from "@/api/system/dataDictionary";

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
      tableRow: {},
      // isDisabledList: [
      //   { label: "启用", value: 1 },
      //   { label: "禁用 ", value: 0 },
      // ],
      rules: {
        dicCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入字典编号",
            // number:true,
            formObjName: "formInfo",
          },
        ],
        isDisabled: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择字典状态",
            formObjName: "formInfo",
          },
        ],
        dicName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入字典名称",
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
          if(this.isEdit){
            this.formInfo = { ...this.data };
          }else{
            this._getDictionaryCode()
            this.formInfo = { ...{ isDisabled: 1 } };
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
    // 获取字典编号
    _getDictionaryCode() {
      let postData ={
        dicType:1
      }
      getDictionaryCode(postData)
      .then(({ data }) => {
        if (data.code === 0) {
          this.formInfo.dicCode=data.data?data.data:null
        }
      })
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createDictionary(postData)
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
      updateDictionary(postData)
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
        formList: [
          "dicCode",
          "isDisabled",
          "dicName",
        ],
      });
      if (!formcenter) {
        return;
      }
      const {
        dicCode,
        dicName,
        isDisabled,
        remark,
        dicId,
      } = this.formInfo;
      const postData = {
        dicCode,
        dicName,
        isDisabled,
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
        postData.dicId = dicId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    padding-right: 15px;
    max-height: 75vh; // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}
</style>
