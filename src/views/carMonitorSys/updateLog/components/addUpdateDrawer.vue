<template>
  <app-drawer
    :visibles="visibles"
    :title="isEdit ? '编辑版本' : isDetail ? '查看版本' : '新增版本'"
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
            <el-form-item label="版本号：" prop="versionNumber">
              <el-input
                v-model="formInfo.versionNumber"
                clearable
                placeholder="请输入版本号"
                :disabled="isEdit || isDetail"
                :maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块：" prop="moduleId">
              <el-select
                v-model="formInfo.moduleId"
                placeholder="请选择"
                filterable
                clearable
                :disabled="isEdit || isDetail"
              >
                <el-option
                  v-for="(item, index) in moduleList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新时间：" prop="updateTime">
              <el-date-picker
                v-model="formInfo.updateTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                :disabled="isEdit || isDetail"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新简介：" prop="updateTitle">
              <el-input
                v-model="formInfo.updateTitle"
                placeholder="请输入更新简介"
                clearable
                :disabled="isDetail"
                :maxlength="20"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="更新详情：" prop="updateContent">
              <el-input
                v-model.trim="formInfo.updateContent"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 10 }"
                resize="none"
                type="textarea"
                placeholder="请输入更新详情"
                maxlength="500"
                show-word-limit
                :disabled="isDetail"
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
import { addVersion, updateVersion } from "@/api/carMonitorSys/updateLog";

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
    isDetail: {
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
        versionNumber: "",
        updateTime: "",
        updateTitle: "",
        updateContent: "",
        moduleId:""
      },
      moduleList: [],
      // 字典下拉
			dropList:[
        { postData:{dicCode:1015},key:'moduleList' }
      ],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        versionNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入版本号",
            formObjName: "formInfo",
            ruleReg: 'versionNumber',
            errorTips: "请输入正确的版本号。例：V1.0.0", 
          },
        ],
        moduleId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择模块",
            formObjName: "formInfo",
          },
        ],
        updateTime: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择更新时间",
            formObjName: "formInfo",
          },
        ],
        updateTitle: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入更新简介",
            formObjName: "formInfo",
          },
        ],
        updateContent: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入更新详情",
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
          this.formInfo = {  ...this.data };
          // 获取字典下拉
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
      addVersion(postData)
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
      updateVersion(postData)
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
          "versionNumber",
          "updateTime",
          "updateTitle",
          "updateContent",
          "moduleId"
        ],
      });
      if (!formcenter) {
        return;
      }
      const {
        versionNumber,
        moduleId,
        updateTime,
        updateTitle,
        updateContent,
        versionId
      } = this.formInfo;
      const postData = {
        versionNumber,
        moduleId,
        updateTime,
        updateTitle,
        updateContent,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.versionId = versionId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
