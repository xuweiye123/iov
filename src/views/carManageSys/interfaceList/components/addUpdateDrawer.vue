<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增接口' : '编辑接口'"
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
          <el-col :span="12">
            <el-form-item label="接口名称：" prop="interfaceName">
              <el-input
                v-model.trim="formInfo.interfaceName"
                clearable
                placeholder="请输入接口名称"
                :maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口地址：" prop="interfaceAddress">
              <el-input
                v-model.trim="formInfo.interfaceAddress"
                clearable
                placeholder="请输入接口地址"
                :maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对接系统：" prop="dockingSystem">
              <el-input
                v-model.trim="formInfo.dockingSystem"
                clearable
                placeholder="请输入对接系统"
                :maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传输方式：" prop="transmissionMethod">
              <el-select
                v-model="formInfo.transmissionMethod"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in interfaceTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传输频率："  prop="transmissionFrequency">
              <el-select
                v-model="formInfo.transmissionFrequency"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in callFrequencyList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用方式："  prop="callMethod">
              <el-select
                v-model="formInfo.callMethod"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in callWayList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="鉴权方式："  prop="authMethod">
              <el-select
                v-model="formInfo.authMethod"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in authenticationWayList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口状态：" prop="status">
              <el-select
                v-model="formInfo.status"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" prop="remark">
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

// request
import { create, update } from "@/api/carManageSys/interfaceList";

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
      formInfo: {
        interfaceName: "",
        interfaceAddress: "",
        dockingSystem: "",
        transmissionMethod: null,
        transmissionFrequency: null,
        callMethod: null,
        authMethod: null,
        status: null,
        remark: "",
      },
      interfaceTypeList: [
        { label: "查询", value: 1 },
        { label: "同步", value: 2 },
        // { label: "推送", value: 3 },
      ],
      callFrequencyList: [
        { label: "实时", value: 1 },
        { label: "定时", value: 2 },
      ],
      callWayList: [
        { label: "post", value: 1 },
        { label: "get", value: 2 },
      ],
      authenticationWayList: [
        { label: "账号密码", value: 1 },
        { label: "token", value: 2 },
        { label: "其他", value: 3 },
      ],
      statusList: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        interfaceName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入接口名称",
            formObjName: "formInfo",
          },
        ],
        interfaceAddress: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入接口地址",
            formObjName: "formInfo",
          },
        ],
        dockingSystem: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入对接系统",
            formObjName: "formInfo",
          },
        ],
        transmissionMethod: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择传输方式",
            formObjName: "formInfo",
          },
        ],
        transmissionFrequency: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择传输频率",
            formObjName: "formInfo",
          },
        ],
        callMethod: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择调用方式",
            formObjName: "formInfo",
          },
        ],
        authMethod: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择鉴权方式",
            formObjName: "formInfo",
          },
        ],
        status: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择接口状态",
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
          this.formInfo.status==true?this.formInfo.status=1:
          this.formInfo.status==false?this.formInfo.status=0:this.formInfo.status
          console.log(this.formInfo,"fullScreenFault")
        }
      },
    },
  },
  created() {},
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.formInfo = {
        interfaceName: "",
        interfaceAddress: "",
        dockingSystem: "",
        transmissionMethod: null,
        transmissionFrequency: null,
        callMethod: null,
        authMethod: null,
        status: null,
        remark: "",
      }
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      create(postData)
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
      update(postData)
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
          "interfaceName",
          "interfaceAddress",
          "dockingSystem",
          "transmissionMethod",
          "transmissionFrequency",
          "callMethod",
          "authMethod",
          "status"
        ],
      });
      if (!formcenter) {
        return;
      }
      const {
        id,
        interfaceName,
        interfaceAddress,
        dockingSystem,
        transmissionMethod,
        transmissionFrequency,
        callMethod,
        authMethod,
        status,
        remark,
      } = this.formInfo;

      const postData = {
        interfaceName,
        interfaceAddress,
        dockingSystem,
        transmissionMethod,
        transmissionFrequency,
        callMethod,
        authMethod,
        status,
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
        postData.id = id;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
