<template>
  <app-drawer
    :visibles="visibles"
    :title="'审核'"
    width="47%"
    :wrapperClosable="!stateVisibles"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <div class="improve-default clearfix">
        <app-item-pance :list="list" :number="1" :left-width="'100'" />
      </div>
      <div class="statistics-scroll">
        <el-scrollbar wrap-class="default-scrollbar__wrap">
          <ul class="upload-list-box">
            <li
              v-for="item in imgs"
              :key="item.fileId"
              @click="handleLookImg(item)"
            >
              {{ item.fileName }}
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div v-show="stateVisibles" class="improve-input">
        <el-row>
          <el-col :span="24">
            <el-form
              ref="formCenter"
              :rules="rules"
              :model="improveForm"
              :label-position="'right'"
              label-width="50px"
            >
              <el-form-item label="审核：" prop="status">
                <el-radio-group
                  v-model="improveForm.status"
                  @change="stateChange"
                >
                  <el-radio :label="1">
                    审核通过
                  </el-radio>
                  <el-radio :label="2">
                    审核不通过
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!--     :required="improveForm.status==3?true:false" -->
              <el-form-item label="备注：" prop="auditContent">
                <el-input
                  v-model.trim="improveForm.auditContent"
                  :rows="6"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  resize="none"
                  placeholder="请输入备注"
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <!-- 图片预览 -->
      <app-dialog
        :visibles="dialogVisible"
        :title="'预览'"
        width="50%"
        @close-dialog="dialogVisible = false"
        :isFooter="false"
      >
        <div slot="formContent">
          <!-- <el-scrollbar
            wrap-class="default-scrollbar__wrap"
            style="height:65vh"
          > -->
          <div
            style="display: flex;justify-content: center;align-items: center;height:65vh"
          >
            <img :src="dialogImageUrl" alt="" />
          </div>
          <!-- </el-scrollbar> -->
        </div>
      </app-dialog>
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import { auditHandle, getImgList } from "@/api/carManageSys/terminalReplace";
import AppItemPance from "@/components/itemPance";

export default {
  name: "approvalDialog",
  mixins: [partialForm, checkFormRule],
  components: { AppItemPance },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // const validateauditremark = (rule, value, cb) => {
    //   if(!value &&this.improveForm.status==2){
    //    return cb(new Error('请输入备注'))
    //  }
    // }
    return {
      improveForm: {},
      formInfo: {},
      imgs: [],
      list: [],
      stateVisibles: false,
      dialogVisible: false,
      loading: false,
      dialogImageUrl: "",
      rules: {
        status: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择审核状态",
            formObjName: "improveForm",
          },
        ],
        auditContent: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入备注",
            formObjName: "improveForm",
          },
        ],
        // auditContent: [
        //   { required: false, trigger: ["blur", "change"], validator: validateauditremark }
        // ]
      },
    };
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = { ...this.data };
        const {
          vinNo,
          iccid,
          barCode,
          oldIccidOne,
          newIccidOne,
          oldIccidTwo,
          newIccidTwo,
          status,
          stationName,
          auditContent,
        } = this.formInfo;
        const stateValue =
          status == 0
            ? "未审核"
            : status == 1
            ? "审核通过"
            : status == 2
            ? "审核不通过"
            : "";
        this.list = [
          { name: "VIN码", value: vinNo ? vinNo : "-" },
          // { name: "系统ICCID", value: iccid ? iccid : "-" },
          // { name: "系统TBOXSN", value: barCode ? barCode : "-" },
          { name: "原ICCID1", value: oldIccidOne ? oldIccidOne : "-" },
          { name: "原ICCID2", value: oldIccidTwo ? oldIccidTwo : "-" },
          { name: "新ICCID1", value: newIccidOne ? newIccidOne : "-" },
          { name: "新ICCID2", value: newIccidTwo ? newIccidTwo : "-" },
          { name: "审核状态", value: stateValue ? stateValue : "-" },
          { name: "服务站名称", value: stationName ? stationName : "-" },
          { name: "审核结果备注", value: auditContent ? auditContent : "-" },
        ];
        if (this.formInfo.status === 0) {
          this.stateVisibles = true;
        } else {
          this.stateVisibles = false;
        }
        if (this.improveForm.status == 2) {
          this.rules.auditContent[0].required = true;
        } else {
          this.rules.auditContent[0].required = false;
        }
        this.imgs = [];
        this.getImgList();
      }
    },
  },
  mounted() {},
  methods: {
    getImgList() {
      const postData = {
        id: this.formInfo.terminalAlterAuditId,
      };
      getImgList(postData).then(({ data }) => {
        if (data.code === 0) {
          this.imgs = data.data || [];
        }
      });
    },
    // 图片预览
    handleLookImg(file) {
      this.dialogImageUrl = file.filePath;
      this.dialogVisible = true;
    },
    // 判断是否选中
    tableRowIsSlect() {
      const { $index } = this.tableRow;
      if ($index === undefined) {
        return false;
      } else {
        return true;
      }
    },
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
    },
    // 关闭
    closeDrawer() {
      this.imgs = [];
      this.formInfo = {};
      this.improveForm = {};
      this.list = [];
      this.$emit("update:visibles", false);
    },
    //审核通过，审核不通过切换
    stateChange(val) {
      if (val == 2) {
        this.rules.auditContent[0].required = true;
      } else {
        this.rules.auditContent[0].required = false;
      }
    },

    // 提交
    submitForm() {
      let formlist = [];
      if (this.improveForm.status == 2) {
        formlist = ["status", "auditContent"];
      } else {
        formlist = ["status"];
      }
      const formCheck = this.checkForm({
        formName: "formCenter",
        formList: formlist,
      });
      if (!formCheck) {
        return;
      }
      const { status, auditContent } = this.improveForm;
      const postData = { status, auditContent };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      postData.id = this.formInfo.terminalAlterAuditId;
      this._submitSim(postData);
    },
    // 提交
    _submitSim(postData) {
      this.loading = true;
      auditHandle(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$message.success({
              message: "审核成功",
              duration: 2 * 1000,
            });
            this.$emit("approval-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-scrollbar {
	.el-scrollbar__wrap {
		padding: 0 5px 10px 0;
		max-height: calc(100vh - 485px);; // 最大高度
		overflow-x: hidden !important; // 隐藏横向滚动栏
	}
}
.improve-default {
  p {
    font-size: 12px;
    float: left;
    width: 50%;
    margin: 0;
    padding: 10px;
  }
}
.improve-input {
  margin-top: 10px;
  padding: 10px 20px 0 0;
  border-top: 1px solid #dcdfe6;
}
.upload-list-box {
  overflow:hidden;
  padding: 0;
  li {
    cursor: pointer;
    line-height: 25px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
