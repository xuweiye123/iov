<template>
  <app-drawer
    :visibles="visibles"
    :title="'获取CAN报文目录'"
		:wrapperClosable="true"
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
        label-width="80px"
      >
        <el-row :gutter="10" style="padding:10px 5px;">
          <el-col :span="24">
            <el-form-item label="VIN码：" prop="vinNo">
              <vin-select
                customClass="canDialog"
                :isVin="true"
                v-model="formInfo.vinNo"
                @vinNoTotal="getVinNoTotal"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="note">
              <el-input
                v-model="formInfo.note"
                :maxlength="200"
                :rows="3"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入备注"
                type="textarea"
                :show-word-limit="true"
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
  getCanFile,
} from "@/api/carMonitorSys/remoteCall";
// 组件
import vinSelect from "./vinSelect";
export default {
  name: "getMessageDrawer",
  mixins: [partialForm, checkFormRule],
  components: { vinSelect },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      formInfo: {
        vinNo: "",
        note: "",
      },
      tableRow: {},
      rules: {
        vinNo: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择VIN码",
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
        }
      },
    },
  },
  created() {},
  methods: {
    getVinNoTotal(e){
			if(e){
        this.formInfo.vinNoTotal=e
			}else{
        if(this.formInfo&&this.formInfo.hasOwnProperty('vinNoTotal')){
          delete this.formInfo.vinNoTotal
        } 
			}
      console.log(this.formInfo.vinNoTotal,"this.formInfo.vinNoTotal")
		},
    // 关闭dialog
    closeDrawer() {
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["vinNo"],
      });
      if (!formcenter) {
        return;
      }
      console.log(this.formInfo.vinNoTotal,111)
      const param = {
        vinNo:this.formInfo.vinNoTotal?this.formInfo.vinNoTotal:this.formInfo.vinNo,
        note: this.formInfo.note,
      };
      this.loading = true;

      getCanFile(param)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("get-success");
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

<style lang="scss" scoped>

table.table-info {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e8e8e8;
  tr {
    td {
      border-collapse: collapse;
      border: 1px solid #e8e8e8;
      font-size: 12px;
      padding: 12px;
      &:nth-child(odd) {
        background-color: #f5f7fa;
        width: 120px;
        text-align: right;
      }
      &:nth-child(even) {
        background-color: #fff;
        color: rgba(0, 0, 0, 0.5);
      }
      .des-info {
        white-space: normal;
        word-break: break-all;
        line-height: 20px;
      }
    }
  }
}
</style>
