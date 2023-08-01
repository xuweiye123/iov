<template>
  <div>
    <app-drawer
      :visibles="visible"
      :title="!isEdit ? '新增分系统' : '编辑分系统'"
      width="40%"
      @close-drawer="closeDialog"
      @ok-drawer="handleSubmit"
      :isOkButLoading="loading"
      :isDrawerFoot="true"
    >
      <el-form
        slot="drawerContent"
        ref="formInfo"
        :model="formInfo"
        :rules="rules"
        :label-position="'right'"
        label-width="100px"
      >
        <el-form-item label="分系统名称：" prop="subSystemName">
          <el-input
            v-model="formInfo.subSystemName"
            placeholder="请输入分系统名称"
            maxlength="20"
            clearable
          />
        </el-form-item>
        <el-form-item label="车型名称：" prop="carTypeId">
          <el-select
            placeholder="请选择"
            v-model="formInfo.carTypeId"
            filterable
            clearable
            @change="selectGet"
          >
            <el-option
              v-for="(item, index) in carTypeList"
              :key="index"
              :label="item.carTypeName"
              :value="item.carTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联ECU：" prop="ecuNames">
          <el-input
            readonly
            v-model="formInfo.ecuNames"
            filterable
            clearable
            placeholder="点击进行ECU选择"
            @click.native="selectECU"
          />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="formInfo.remark"
            type="textarea"
            placeholder="请输入备注"
            maxlength="50"
            rows="4"
            show-word-limit
            resize="none"
          />
        </el-form-item>
      </el-form>
    </app-drawer>
    <app-ecu-list
      :visibles.sync="ecuListVisible"
      :data="ecuList"
      @carECU="loadECU"
    />
  </div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// util
import { duplicateRemoval } from "@/utils/base";
// 组件
import AppEcuList from "./multiSelectEcuDialog";
// request
import { createSubsystem, updateSubsystem } from "@/api/diagnosisSys/subsystem";
import { getSupportCarTypeList } from "@/api/diagnosisSys/commont";
export default {
  name: "addUpdateDrawer",
  components: {
    AppEcuList,
  },
  mixins: [partialForm, checkFormRule],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rules: {
        subSystemName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入分系统名称",
            formObjName: "formInfo",
          },
        ],
        carTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入车型名称",
            formObjName: "formInfo",
          },
        ],
        ecuNames: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择ECU",
            formObjName: "formInfo",
          },
        ],
      },
      formInfo: {
        ecuIds: "",
        ecuNames: "",
        carTypeName: "",
      },
      loading: false,
      ecuidList: [],
      ecuListVisible: false,
      carTypeList: [],
      ecuList: [],
    };
  },
  mounted() {},
  watch: {
    visible(e1) {
      if (e1) {
        this._getCarType();
        this.formInfo = { ...this.data };
        if (this.isEdit) {
          let ecuList = this.data.ecuIdList.split(",");
          let ecunameList = this.data.ecuNameList.split(",");
          ecuList.forEach((item, i) => {
            this.ecuList.push({
              id: item,
              ecuName: ecunameList[i],
            });
          });
          this.formInfo.ecuIds = this.data.ecuIdList;
          this.formInfo.ecuNames = this.data.ecuNameList;
        }
      }
    },
  },
  methods: {
    _getCarType() {
      getSupportCarTypeList().then(({ data }) => {
        if (data.code === 0) {
          this.carTypeList = data.data || [];
        }
      });
    },
    // 关闭dialog
    closeDialog() {
      this.$emit("update:visible", false);
      this.ecuidList = [];
      this.ecuList = [];
    },
    // 点击确定
    handleSubmit() {
      const checkForm = this.checkForm({
        formName: "formInfo",
        formList: ["subSystemName", "carTypeId", "ecuNames"],
      });
      if (!checkForm) {
        return;
      }
      if (this.isEdit) {
        this.formInfo.subSystemId = this.formInfo.id;
        this._updateSubsystem(this.formInfo);
      } else {
        this._createSubsystem(this.formInfo);
      }
    },
    _updateSubsystem(params) {
      this.loading = true;
      updateSubsystem(params)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("update-complete");
            this.closeDialog();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    _createSubsystem(params) {
      this.loading = true;
      createSubsystem(params)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("add-complete");
            this.closeDialog();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    selectECU() {
      this.ecuListVisible = true;
    },
    loadECU(value) {
      this.ecuList = duplicateRemoval([...value], "id");
      let ecuIds = "";
      let ecuNames = "";
      value.forEach((r) => {
        ecuIds += r.id + ",";
        ecuNames += r.ecuName + ",";
      });
      ecuIds = ecuIds.substring(0, ecuIds.lastIndexOf(","));
      ecuNames = ecuNames.substring(0, ecuNames.lastIndexOf(","));
      this.formInfo.ecuNames = ecuNames;
      this.formInfo.ecuIds = ecuIds;
    },
    selectGet(val) {
      let obj = this.carTypeList.find((item) => {
        return item.carTypeId === val;
      });
      this.formInfo.carTypeName = obj.carTypeName;
    },
  },
};
</script>
<style lang="scss" scoped></style>
