<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增联系人' : '编辑联系人'"
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
            <el-form-item label="联系人名称：" prop="name">
              <el-input
                v-model.trim="formInfo.name"
                clearable
                placeholder="请输入联系人名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人类型：" prop="contactType">
              <el-select
                v-model="formInfo.contactType"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in contactTypeList"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属单位：" prop="contractCompanyId">
              <el-select
                v-model="formInfo.contractCompanyId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in contractcompanyList"
                  :key="index"
                  :label="item.companyName"
                  :value="item.contractCompanyId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位：" prop="position">
              <el-input
                v-model.trim="formInfo.position"
                clearable
                placeholder="请输入职位"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" prop="buyDate">
            <el-form-item label="购车时间：">
              <el-date-picker
                v-model="formInfo.buyDate"
                filterable
                clearable
                placeholder="请选择"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobilePhone">
              <el-input
                v-model.trim="formInfo.mobilePhone"
                clearable
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭电话：" prop="homePhone">
              <el-input
                v-model.trim="formInfo.homePhone"
                clearable
                placeholder="请输入家庭电话"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日：" prop="birthdate">
              <el-date-picker
                v-model="formInfo.birthdate"
                filterable
                clearable
                placeholder="请选择"
                type="datetime"
                align="right"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭地址：" prop="homeAddress">
              <el-input
                v-model.trim="formInfo.homeAddress"
                clearable
                placeholder="请输入家庭地址"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="gender">
              <el-radio-group v-model="formInfo.gender">
                <el-radio :label="1">
                  男
                </el-radio>
                <el-radio :label="2">
                  女
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注说明：" prop="remark">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                type="textarea"
                placeholder="请输入备注说明"
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
import { createContact, updateContact } from "@/api/carManageSys/contact";
import { getCompanyInfo } from "@/api/carManageSys/commont";
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
      contactTypeList: [
        { text: "单位联系人", value: 2 },
        { text: "用车人", value: 3 },
      ],
      contractcompanyList: [],
      terminalVisbles: false,
      tableRow: {},
      rules: {
        name: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入联系人名称",
            formObjName: "formInfo",
          },
        ],
        contactType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择联系人类型",
            formObjName: "formInfo",
          },
        ],
        // contractCompanyId: [
        //   {
        //     required: true,
        //     trigger: ["blur", "change"],
        //     validator: this.validInput,
        //     tips: "请选择所属单位",
        //     formObjName: "formInfo",
        //   },
        // ],
        mobilePhone: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入手机号码",
            errorTips: "请输入正确的电话号码",
            ruleReg: "tel",
            formObjName: "formInfo",
          },
        ],
        homePhone: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入家庭电话",
            errorTips: "请输入正确的电话号码",
            ruleReg: "tel",
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
          this.formInfo = { ...{ gender: "" }, ...this.data };
          getCompanyInfo().then(({ data }) => {
            if (data.code === 0) {
              this.contractcompanyList = data.data || [];
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
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createContact(postData)
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
      updateContact(postData)
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
          "name",
          // "contractCompanyId",
          "contactType",
          "mobilePhone",
          "homePhone",
        ],
      });
      if (!formcenter) {
        return;
      }
      const {
        contactId,
        name,
        contactType,
        position,
        buyDate,
        gender,
        birthdate,
        mobilePhone,
        homePhone,
        homeAddress,
        remark,
        contractCompanyId,
      } = this.formInfo;
      const postData = {
        name,
        contactType,
        position,
        buyDate,
        gender,
        birthdate,
        mobilePhone,
        homePhone,
        homeAddress,
        remark,
        contractCompanyId,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.contactId = contactId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
