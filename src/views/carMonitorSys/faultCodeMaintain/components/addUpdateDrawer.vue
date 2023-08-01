<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增故障码' : '编辑故障码'"
    width="55%"
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
            <el-form-item label="故障类型：" required>
              <el-radio-group
                v-model="formInfo.faultType"
                @change="faulttypeChange"
              >
                <el-radio :label="1">
                  国标故障
                </el-radio>
                <el-radio :label="2">
                  自定义故障
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否弹屏：" required>
              <el-radio-group v-model="formInfo.isPopup">
                <el-radio :label="0">
                  否
                </el-radio>
                <el-radio :label="1">
                  是
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障码：" prop="faultCode">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.faultCode"
                :disabled="isEdit ? true : false"
                clearable
                placeholder="请输入故障码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障名称：" prop="faultCodeName">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.faultCodeName"
                clearable
                placeholder="请输入故障名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="自定义故障等级："
              :prop="'faultLevel'"
              :required="formInfo.faultType == 2"
            >
              <el-select
                v-model="formInfo.faultLevel"
                filterable
                placeholder="请选择"
                clearable
                :disabled="formInfo.faultType == 1"
              >
                <el-option
                  v-for="(item, index) in faultLevelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="国标故障等级："
              prop="gbFaultLevel"
              :required="formInfo.faultType == 1"
            >
              <el-select
                v-model="formInfo.gbFaultLevel"
                filterable
                clearable
                placeholder="请选择"
                :disabled="formInfo.faultType == 2"
              >
                <el-option
                  v-for="(item, index) in gbFaultLevelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统归类：" :prop="'systemType'">
              <el-select
                v-model="formInfo.systemType"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in systemTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="零部件：" :prop="'carPartId'">
              <el-select
                v-model="formInfo.carPartId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in carPartList"
                  :key="index"
                  :label="item.carPartName"
                  :value="item.carPartId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="维修提示：" prop="maintainInfo">
              <el-input
                v-model.trim="formInfo.maintainInfo"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                type="textarea"
                clearable
                placeholder="请输入维修提示"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解决方案：" prop="solutions">
              <el-input
                v-model.trim="formInfo.solutions"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                type="textarea"
                placeholder="请输入解决方案"
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
import {
  getCarPartList,
  createFaultCode,
  updateFaultCode,
} from "@/api/carMonitorSys/faultCodeMaintain";

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
    const validatefaultlevel = (rule, value, cb) => {
      if (this.formInfo.faultType == 2) {
        if (value === "" || value === undefined) {
          return cb(new Error("请选择自定义故障等级"));
        }
      }
    };
    const validategbfaultlevel = (rule, value, cb) => {
      if (this.formInfo.faultType == 1) {
        if (value === "" || value === undefined) {
          return cb(new Error("请选择国标故障等级"));
        }
      }
    };
    return {
      loading: false,
      formInfo: {},
      faultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级 ", value: 2 },
        { label: "三级", value: 3 },
        { label: " 四级 ", value: 4 },
      ],
      gbFaultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级 ", value: 2 },
        { label: "三级", value: 3 },
      ],
      systemTypeList: [
        { label: "信息娱乐域", value: 1 },
        { label: "车身域系统 ", value: 2 },
        { label: "TBOX", value: 3 },
        { label: "智能驾驶域", value: 4 },
      ],
      carPartList: [],
      tableRow: {},
      rules: {
        faultCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入故障码",
            formObjName: "formInfo",
          },
        ],
        faultLevel: [
          { required: false, trigger: "blur", validator: validatefaultlevel },
          { trigger: "change", validator: validatefaultlevel },
        ],
        gbFaultLevel: [
          { required: false, trigger: "blur", validator: validategbfaultlevel },
          { trigger: "change", validator: validategbfaultlevel },
        ],
        faultCodeName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入故障名称",
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
          this.formInfo = { ...{ isPopup: 1, faultType: 1 }, ...this.data };

          getCarPartList().then(({ data }) => {
            if (data.code === 0) {
              this.carPartList = data.data || [];
            }
          });
        }
      },
    },
  },
  created() {},
  methods: {
    faulttypeChange(val) {
      // 获取项目代码
      if (val === 2) {
        this.formInfo.gbFaultLevel = null;
      } else {
        this.formInfo.faultLevel = null;
      }
    },
    // 关闭dialog
    closeDrawer() {
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createFaultCode(postData)
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
      updateFaultCode(postData)
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
      let formLists = [];
      if (this.formInfo.faultType == 1) {
        formLists = ["faultCode", "faultCodeName", "gbFaultLevel"];
      } else if (this.formInfo.faultType == 2) {
        formLists = ["faultCode", "faultCodeName", "faultLevel"];
      }
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: formLists,
      });
      if (!formcenter) {
        return;
      }
      const {
        faultCode,
        faultCodeName,
        faultLevel,
        faultType,
        maintainInfo,
        solutions,
        isPopup,
        carPartId,
        gbFaultLevel,
        faultCodeId,
        systemType,
      } = this.formInfo;
      const postData = {
        faultCode,
        faultCodeName,
        faultLevel,
        faultType,
        maintainInfo,
        solutions,
        isPopup,
        carPartId,
        gbFaultLevel,
        systemType,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.faultCodeId = faultCodeId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
