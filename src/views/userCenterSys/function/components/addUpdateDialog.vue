<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增菜单' : '编辑菜单'"
    width="800px"
    @close-drawer="closeDialog"
    @ok-drawer="submitForm"
    :loading="loading"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="140px"
      >
        <el-row  type="flex" justif="start" style="flex-wrap: wrap">
          <el-col :span="12">
            <el-form-item label="父级菜单：">
              <el-select
                ref="selectTree"
                v-model="formInfo.parentMenu"
                :disabled="formInfo.functionType == 2 || !isEdit"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in selectItemArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  style="display: none;"
                />
                <el-tree
                  ref="selecteltree"
                  :data="treeSelectArr"
                  node-key="value"
                  highlight-current
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  :current-node-key="formInfo.parentId"
                  :expand-on-click-node="false"
                  default-expand-all
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型：" required prop="functionType">
              <el-radio-group
                v-model="formInfo.functionType"
                :disabled="isInternal != 1 && isEdit"
                @change="changeRadio"
              >
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
                <el-radio :label="3">层级路径</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="
                formInfo.functionType == 1
                  ? '菜单名称(中文)：'
                  : formInfo.functionType == 2
                  ? '按钮名称(中文)：'
                  : formInfo.functionType == 3
                  ? '路由名称(中文)：'
                  : ''
              "
              prop="functionName"
            >
              <el-input
                v-model="formInfo.functionName"
                :maxlength="20"
                clearable
                :placeholder="
                  formInfo.functionType == 1
                    ? '请输入菜单名称(中文)'
                    : formInfo.functionType == 2
                    ? '请输入按钮名称(中文)'
                    : '请输入路由名称(中文)'
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="链接：" prop="url">
              <el-input
                v-model="formInfo.url"
                :maxlength="50"
                :disabled="isInternal != 1 && isEdit"
                clearable
                placeholder="请输入链接"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formInfo.functionType == 1">
            <el-form-item
              label="文件路径："
              prop="filePath"
            >
              <el-input
                v-model="formInfo.filePath"
                :maxlength="100"
                :disabled="isInternal != 1 && isEdit"
                clearable
                placeholder="请输入文件路径"
              />
            </el-form-item>
          </el-col>
          <el-col 
            :span="12"  
            v-if="formInfo.functionType == 2">
            <el-form-item
              label="按钮位置："
              prop="buttonPosition"
            >
              <el-radio-group
                v-model="formInfo.buttonPosition"
                :disabled="isInternal != 1 && isEdit"
              >
                <el-radio :label="1">表头左</el-radio>
                <el-radio :label="2">表头右</el-radio>
                <el-radio :label="3">表内</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formInfo.functionType == 1">
            <el-form-item
              label="接口前缀："
              prop="interfacePrefix"
            >
              <el-input
                v-model="formInfo.interfacePrefix"
                :maxlength="50"
                :disabled="isInternal != 1 && isEdit"
                clearable
                placeholder="请输入接口前缀"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号：" prop="sort">
              <el-input-number
                v-model="formInfo.sort"
                :min="0"
                :max="10000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识：" prop="permission">
              <el-input
                v-model="formInfo.permission"
                :disabled="isInternal != 1 && isEdit"
                clearable
                placeholder="请输入权限标识"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标：" prop="icon">
              <el-input
                v-model="formInfo.icon"
                :maxlength="50"
                :disabled="isInternal != 1 && isEdit"
                clearable
                placeholder="请输入图标"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否禁用：" required prop="isDisabled">
              <el-radio-group v-model="formInfo.isDisabled">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--  :required="!judgeValue" -->
          <el-col :span="12">
            <el-form-item label="图标类型：" required prop="iconType">
              <el-radio-group
                v-model="formInfo.iconType"
                :disabled="isInternal != 1 && isEdit"
              >
                <el-radio :label="1">iconfont</el-radio>
                <el-radio :label="2">svg</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formInfo.functionType != 2">
            <el-form-item label="是否显示：" required prop="isShow">
              <el-radio-group v-model="formInfo.isShow">
                <el-radio :label="0">隐藏</el-radio>
                <el-radio :label="1">显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input
                v-model="formInfo.remark"
                :rows="6"
                :maxlength="200"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入备注"
                show-word-limit
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </app-drawer>
</template>
<script>
import { createMenu, updateMenu } from "@/api/system/menuManager";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";

import reg from "@/utils/reg";

export default {
  name: "MenuAddUpdateDialog",
  mixins: [partialForm, checkFormRule],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    treeFatherArr: {
      type: Array,
      default: [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isInternal(){
      return this.$store.state.user.isInternal;
    },
    loginName() {
      return this.$store.state.user.loginName;
    },
  },
  data() {
    const validateFunctionName = (rule, value, cb) => {
      if (this.formInfo.functionType == 1 && !value) {
        return cb(new Error("请输入菜单名称(中文)"));
      } else if (this.formInfo.functionType == 2 && !value) {
        return cb(new Error("请输入按钮名称(中文)"));
      } else if (this.formInfo.functionType == 3 && !value) {
        return cb(new Error("请输入路由名称(中文)"));
      }
      if (!reg.functionNames1.test(value)) {
        return cb(new Error("支持汉字、字母、数字、空格、-"));
      }
    };
    return {
      loading: false,
      defaultFormInfo: {
        functionType: 1,
        buttonPosition: 1,
        isDisabled: 1,
        isShow: 1,
        sort: 1,
        iconType: 1,
      },
      formInfo: {},
      rules: {
        functionName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateFunctionName,
          },

          // {
          //   required: true,
          //   trigger: ["blur", "change"],
          //   validator: this.validInput,
          //   ruleReg: 'functionNames1',
          //   tips: "请输入中文菜单名称",
          //   errorTips: "支持汉字、字母、数字、空格、-",
          //   formObjName:'formInfo'
          // },
        ],
        sort: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入排序号",
            formObjName: "formInfo",
          },
        ],
        url: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "functionUrl",
            tips: "请输入链接",
            errorTips: "支持字母、数字、/",
            formObjName: "formInfo",
          },
        ],
        icon: [
          {
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "alphanline",
            errorTips: "支持字母、数字、-、_",
            formObjName: "formInfo",
          },
        ],
        filePath: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "filePath",
            tips: "请输入文件路径",
            errorTips: "支持字母、数字、/、_、-",
            formObjName: "formInfo",
          },
        ],
        interfacePrefix: [
          {
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "filePath",
            errorTips: "支持字母、数字、/、_、-",
            formObjName: "formInfo",
          },
        ],
        buttonPosition: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择钮位置",
            formObjName: "formInfo",
          },
        ],
      },
      treeSelectArr: [],
      selectItemArr: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.formInfo = { ...this.defaultFormInfo, ...this.data };
          console.log(this.formInfo, 123, this.defaultFormInfo);
          this.formInfo.functionId = this.formInfo.functionId
            ? this.formInfo.functionId
            : "顶层路由";
          let fir = {
            value: "顶层路由",
            label: "顶层路由",
            disabled: this.formInfo.functionType == 1 ? true : false,
          };
          this.treeSelectArr = this.adjustFc(this.treeFatherArr, [], 2);
          this.selectItemArr = this.adjustFc(this.treeFatherArr, [], 1);
          this.treeSelectArr.unshift(fir);
          this.selectItemArr.unshift(fir);
        }
      },
      immediate: true,
    },
  },
  methods: {
    changeRadio() {
      this.$refs["formCenter"].clearValidate();
    },
    adjustFc(arr, newArr, type) {
      arr.forEach((item) => {
        if (item.functionType == 3) {
          let obj = {
            label: item.functionName,
            value: item.functionId,
            disabled: item.disabled,
            children: [],
          };
          newArr.push(obj);
          if (item.children && item.children.length) {
            if (type == 1) {
              this.adjustFc(item.children, newArr, type);
            } else {
              this.adjustFc(item.children, obj.children, type);
            }
          }
        }
      });
      return newArr;
    },

    handleNodeClick(node) {
      // if(this.formInfo.functionType==1&&node.label=="顶层路由"){
      //   this.$message.warning({
      //     message: '菜单不可作为顶层路由',
      //     duration: 2 * 1000
      //   })
      // }else{
      // console.log(node.label,"handleNodeClick")
      this.formInfo.parentMenu = node.label;
      this.formInfo.parentId = node.label == "顶层路由" ? "" : node.value;
      this.$refs.selectTree.blur();
      // }
    },

    restData() {
      this.formInfo = { ...this.defaultFormInfo };
    },
    // 关闭dialog
    closeDialog() {
      this.restData();
      this.$emit("update:visibles", false);
    },
    // 点击取消
    headleCancel() {
      this.closeDialog();
    },
    // 点击确定按钮处理编辑和新增
    submitForm() {
      let checkForm;
      checkForm = this.checkForm({
        formName: "formCenter",
        formList: ["sort", "functionName", "icon", "filePath", "url"],
      });
      if (!checkForm) {
        return;
      }
      const { parentMenu, functionId, ...postData } = this.formInfo;
      if (!this.isEdit) {
        this._addMenu(postData);
      } else {
        this._updateMenu({ id: functionId, data: postData });
      }
    },
    // 新增
    _addMenu(postData) {
      this.loading = true;
      createMenu(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            postData.functionId = data.data;
            this.$emit("add-complete", { ...postData });
            this.closeDialog();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 更新
    _updateMenu(postData) {
      this.loading = true;
      updateMenu(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            if (postData.data.parentId == this.data.parentId) {
              this.$emit("update-complete", {
                ...{ functionId: postData.id },
                ...postData.data,
              });
            } else {
              this.$emit("get-menu", {
                ...{ functionId: postData.id },
                ...postData.data,
              });
            }
            this.closeDialog();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
