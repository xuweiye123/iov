<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增生产厂商信息' : '编辑生产厂商信息'"
    width="55%"
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
            label-width="120px"
          >
            <el-form-item label="厂商名称：" prop="supplierName">
              <el-input
                v-model="formInfo.supplierName"
                placeholder="请输入厂商名称"
                maxlength="30"
                clearable
                :disabled="isEdit ? true : false"
              />
            </el-form-item>
            <el-form-item label="厂商代码：" prop="supplierCode">
              <el-input
                v-model="formInfo.supplierCode"
                maxlength="40"
                placeholder="请输入厂商代码"
                clearable
              />
            </el-form-item>
            <el-form-item label="厂商类型：" prop="supplierType">
              <el-select
                v-model="formInfo.supplierType"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in firmList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="creditCode">
              <el-input
                v-model="formInfo.creditCode"
                placeholder="请输入统一社会信用代码"
                maxlength="18"
                clearable
                :disabled="isEdit ? true : false"
              />
            </el-form-item>
            <el-form-item label="厂商联系人：" prop="supplierContacts">
              <el-input
                v-model="formInfo.supplierContacts"
                placeholder="请输入厂商联系人"
                maxlength="40"
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
            label-width="110px"
          >
            <el-form-item label="厂商联系人电话：" prop="supplierContactsPhone">
              <el-input
                v-model="formInfo.supplierContactsPhone"
                maxlength="11"
                placeholder="请输入厂商联系人电话"
                clearable
                @input="setContactsPhone"
                @focus="clearContactsPhone"
              />
            </el-form-item>
            <el-form-item label="厂商联系人邮箱：" prop="supplierContactsMail">
              <el-input
                v-model="formInfo.supplierContactsMail"
                clearable
                maxlength="50"
                placeholder="请输入厂商联系人邮箱"
              />
            </el-form-item>
            <el-form-item label="厂商地址：" prop="supplierAddress">
              <el-input
                v-model="formInfo.supplierAddress"
                clearable
                maxlength="40"
                placeholder="请输入厂商地址"
              />
            </el-form-item>
            <el-form-item label="推送邮件：" prop="pushMail">
              <el-input
                v-model="formInfo.pushMail"
                clearable
                maxlength="40"
                placeholder="请输入推送邮件"
              />
            </el-form-item>
            <el-form-item label="是否推送：" prop="isPush">
              <el-radio-group v-model="formInfo.isPush">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form
            :model="formInfo"
            :label-position="'right'"
            :label-width="'120px'"
          >
            <!-- 备注 -->
            <el-form-item :label="'备注：'">
              <el-input
                v-model="formInfo.note"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                :placeholder="'请输入备注'"
                type="textarea"
                maxlength="200"
                :show-word-limit="true"
              />
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
import { createSupplier, updateSupplier } from "@/api/batterySys/supplier";
//组件
export default {
  name: "addUpdateDrawer",
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
    },
    firmList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formInfo: { isPush: 0 },
      isSetPhone:false,
      firstBluePhone:true,
      rules: {
        supplierName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入厂商名称",
            formObjName:'formInfo'
          }
        ],
        supplierCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入厂商代码",
            formObjName:'formInfo'
          }
        ],
        supplierType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择厂商类型",
            formObjName:'formInfo'
          }
        ],
        creditCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入统一社会信用代码",
            formObjName:'formInfo'
          }
        ],
        supplierContacts: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入厂商联系人",
            formObjName:'formInfo'
          },
        ],
        supplierContactsPhone: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "tel",
            errorTips: "请输入正确的电话",
            tips: "请输入厂商联系人电话",
            formObjName:'formInfo'
          }
        ],
        supplierContactsMail: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            ruleReg: "mail",
            errorTips: "请输入正确的邮箱",
            tips: "请输入厂商联系人邮箱",
            formObjName:'formInfo'
          }
        ],
        supplierAddress: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入厂商地址",
            formObjName:'formInfo'
          },
        ],
      },
      loading: false,
    };
  },
  watch: {
    visibles: {
      handler() {
        this.firstBluePhone = true
        this.formInfo = { ...{ isPush: 0 }, ...this.data };
      }
    },
  },
  created() {},
  methods: {
    // 关闭Drawer
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
      this.isSetPhone = false
    },

    // 新增
    _proAdd(postData) {
      this.loading = true;
      createSupplier(postData)
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
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _proUpdate(postData) {
      this.loading = true;
      let postData2 = JSON.parse(JSON.stringify(postData))
      if(!this.isSetPhone){
       postData2.supplierContactsPhone = this.data.supplierContactsPhoneAll
      }
      updateSupplier(postData2)
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
          "supplierName",
          "supplierCode",
          "supplierType",
          "creditCode",
          "supplierContacts",
        ],
      });
      let formList2 = [
          "supplierContactsPhone",
          "supplierContactsMail",
          "supplierAddress"
        ]
        if(this.isEdit&&!this.isSetPhone){
            formList2.shift()
        }
      const checkRight = this.checkForm({
        formName: "formRight",
        formList: formList2
      });
      if (!checkLeft) {
        return;
      }
      if (!checkRight) {
        return;
      }
      const postData = this.formInfo;
      if (!this.isEdit) {
        this._proAdd(postData);
      } else {
        postData.id = this.formInfo.oid;
        this._proUpdate(postData);
      }
    },
    setContactsPhone(){
     this.isSetPhone = true
    },
    clearContactsPhone(){
      if(this.firstBluePhone&&this.formInfo.supplierContactsPhone&&this.formInfo.supplierContactsPhone.indexOf('*')!=-1&&this.isEdit){
        this.formInfo.supplierContactsPhone = ''
        this.firstBluePhone = false
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
