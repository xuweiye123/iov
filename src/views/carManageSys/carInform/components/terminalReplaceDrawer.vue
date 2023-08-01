<template>
  <app-drawer
    :visibles="visibles"
    :title="'更换终端设备'"
    width="45%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <p class="small_title">
        <svg-icon
          style="font-size:15px"
          :icon-class="`${$store.state.theme.activeName}_currentVehicle`"
        />&nbsp;车辆基本信息
      </p>
      <div class="improve-default clearfix">
        <app-item-pance :list="baseList" :number="2" :leftWidth="'120'" />
      </div>
      <p style="margin:10px 0; " class="small_title">
        <svg-icon
          style="font-size:15px"
          :icon-class="`${$store.state.theme.activeName}_newEquipment`"
        />&nbsp;新设备信息
      </p>
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="TBOXSN：" prop="newBarCode">
              <el-input
                v-model.trim="formInfo.newBarCode"
                clearable
                placeholder="请点击选择"
                :readonly="true"
                class="pointerInput"
                @focus="showTerminalList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端编号：">
              <span>{{ formInfo.newTerminalCode | processData }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-show="formInfo.isBindTerminal == 0"
          type="flex"
          justify="start"
          align="middle"
        >
          <el-col :span="12">
            <el-form-item label="车牌号码：">
              <span>{{ formInfo.licensePlate | processData }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;">
          <el-col :span="24">
            <el-form-item label="更换原因：" prop="remark1">
              <el-input
                v-model.trim="formInfo.remark1"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入更换原因"
                type="textarea"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <select-terminal-dialog
        :visibles.sync="terminalVisbles"
        @dblclick-select-terminal="selectTerminal"
      />
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import { changeTerminal } from "@/api/carManageSys/carInform";

// 组件
import AppItemPance from "@/components/itemPance";
import selectTerminalDialog from "./selectTerminalDialog";

export default {
  name: "terminalReplaceDialog",
  mixins: [partialForm, checkFormRule],
  components: { AppItemPance, selectTerminalDialog },
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
    return {
      formInfo: {
        newBarCode: "",
        remark1: "",
      },
      loading:false,
      showfilter: false,
      tableHeight: 0,
      total: 0,
      list: [],
      listLoading: false,
      tableRow: {},
      activeNames: ["1", "2"],
      baseList: [],
      terminalVisbles: false,
      rules: {
        newBarCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择TBOXSN",
            formObjName: "formInfo",
          },
        ],
        remark1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入更换原因",
            formObjName: "formInfo",
          },
        ],
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
        console.log(this.data, "this.data");
        this.formInfo = { ...{ newBarCode: "" }, ...this.data };
        const {
          vinNo,
          licensePlate,
          terminalCode,
          barCode,
          startTime,
          createdBy,
          isBindTerminal,
        } = this.formInfo;
        const cartoterminalstatusTXT =
          isBindTerminal == 0 ? "未绑定" : isBindTerminal == 1 ? "已绑定" : "";
        this.baseList = [
          { name: "VIN码", value: vinNo ? vinNo : "-", leftWidth: "90px" },
          {
            name: "车牌号码",
            value: licensePlate ? licensePlate : "-",
            leftWidth: "70px",
          },
          {
            name: "绑定状态",
            value: cartoterminalstatusTXT ? cartoterminalstatusTXT : "-",
            leftWidth: "90px",
          },
          {
            name: "终端编号",
            value: terminalCode ? terminalCode : "-",
            leftWidth: "70px",
          },
          { name: "TBOXSN", value: barCode ? barCode : "-", leftWidth: "90px" },
          {
            name: "绑定时间",
            value: startTime ? startTime : "-",
            leftWidth: "70px",
          },
          {
            name: "操作人员",
            value: createdBy ? createdBy : "-",
            leftWidth: "90px",
          },
        ];
      }
    },
  },
  mounted() {},
  methods: {
    // 显示终端list
    showTerminalList() {
      this.terminalVisbles = true;
    },
    // 获取终端
    selectTerminal(e) {
      const { barCode, terminalCode, terminalId } = e;
      this.formInfo.newBarCode = barCode;
      this.formInfo.newTerminalCode = terminalCode;
      this.formInfo.newTerminalId = terminalId;
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
    lookDetail() {},
    // 加载数据
    listLoad() {
    },
    // 关闭
    closeDrawer() {
      this.baseList = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["newBarCode", "remark1"],
      });
      if (!formcenter) {
        return;
      }
      const postData = {
        carId: this.formInfo.carId,
        newTerminalId: this.formInfo.newTerminalId,
        newTerminalCode: this.formInfo.newTerminalCode,
        oldTerminalId: this.formInfo.terminalId,
        remark: this.formInfo.remark1,
      };
      this.loading=true
      changeTerminal(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "终端换绑成功",
            duration: 2 * 1000,
          });
          this.$emit("terminal-replace-complete");
          this.closeDrawer();
        }
      }).finally(() => {
        this.loading=false
      })
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-form-item__label {
  font-weight: bold;
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
  padding-top: 10px;
  border-top: 1px solid #dcdfe6;
}
.upload-list-box {
  padding: 0;
  li {
    cursor: pointer;
    line-height: 25px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
