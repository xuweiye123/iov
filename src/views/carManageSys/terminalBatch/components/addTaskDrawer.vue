<template>
  <app-drawer
    :visibles="visibles"
    :title="'添加任务'"
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称：" prop="operationName">
                <el-input
                  v-model="formInfo.operationName"
                  placeholder="请输入任务名称"
                  clearable
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="命令包名称：" prop="commond">
                <div style="position:relative;">
                  <div
                    style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer"
                    @click="selectCommondVisible = true"
                  />
                  <el-input v-model.trim="selectCommondStr" placeholder="当前未选择任何命令包" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="选择车辆：" prop="car">
                <el-tooltip
                  :disabled="this.selectCarList.length <= 1"
                  class="item"
                  effect="dark"
                  :content="selectCarStr"
                  placement="top-start"
                >
                  <div style="position:relative;">
                    <div
                      style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer"
                      @click="showTaskList"
                    />
                    <el-input
                      v-model="selectCarStr"
                      placeholder="当前未选择任何车辆"
                      clearable
                    />
                  </div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="2" type="flex" justify="center" align="center">
              <el-button
                type="primary"
                @click="importVisible = true"
                style="margin:0 10px;"
              >
                导入
              </el-button>
            </el-col>
            <el-col
              :span="2"
              type="flex"
              align="start"
              style="margin:0 10px;"
            >
              <el-button class="dialog-cancel" type="default" @click="handleClear">
                重置
              </el-button>
            </el-col>
            <el-col :span="7">
              <div style="margin-top:8px;">
                <span v-if="selectCarNumber > 0"
                  >车辆信息：已选择
                  <span style="color:red">{{ selectCarNumber }} </span
                  >辆车</span
                >
                <span class="titleColor" v-else>车辆信息：当前未选择任何车辆</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input
                  v-model.trim="formInfo.remark"
                  :rows="8"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  resize="none"
                  placeholder="请输入备注"
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>

      <!-- 选择车辆 -->
      <select-car-dialog
        :visibles.sync="selectCarVisibles"
        :data="selectCarList"
        @select-complete="selectCarComplete"
      />
      <!-- 导入 -->
      <import-dialog
        ref="importDialog"
        action="api/vehicle/common/ImportCarInfo"
        :template-url="'api/vehicle/fileStatics/ImportVinBatchQuery.xlsx'"
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="importCarComplete"
      >
        <result-dialog
          :visibles.sync="resultVisible"
          :data="importResult"
          :text="'VIN码'"
          :keys="'vinNo'"
          :message="'无导入失败信息'"
          :is-show="false"
        >
        </result-dialog>
      </import-dialog>
      <!-- 选择命令 -->
      <select-commond-dialog
        :visibles.sync="selectCommondVisible"
        @select-complete="selectCommondComplete"
      />
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// 组件
import selectCarDialog from "@/components/carManageSys/selectCarDialog";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";
import selectCommondDialog from "./selectCommondDialog";

import { createCommond } from "@/api/carManageSys/terminalBatch";

import { duplicateRemoval } from "@/utils/base";
import { mapGetters } from "vuex";
// request
export default {
  name: "addTaskDrawer",
  mixins: [partialForm,checkFormRule],
  components: {
    selectCarDialog,
    importDialog,
    resultDialog,
    selectCommondDialog,
  },
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
  computed: {
    ...mapGetters(["commontData"]),
    selectCarNumber() {
      return this.selectCarList.length;
    },
    selectCarStr() {
      return this.selectCarList.map((obj) => obj.vinNo).join(",");
    },
    selectCommondStr() {
      return this.selectCommond.packetName;
    },
  },
  created() {},
  data() {
    const validateCar = (rule, value, cb) => {
      if (this.selectCarList.length === 0) {
        return cb(new Error("请选择车辆"));
      }
    };
    const validateCommond = (rule, value, cb) => {
      if (!this.selectCommond.packetName) {
        return cb(new Error("请选择命令包名称"));
      }
    };
    return {
      formInfo: {
        operationName: "",
        remark: "",
      },
      loading:false,
      total: 0,
      list: [],
      listLoading: false,
      selectCarList: [],
      selectCarVisibles: false,
      selectCommondVisible: false,
      importVisible: false,
      resultVisible: false,
      importResult: {},
      selectCommond: {},
      rules: {
        operationName: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入任务名称",
            formObjName: "formInfo",
          },
        ],
        car: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateCar,
          },
        ],
        commond: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateCommond,
          },
        ],
      },
    };
  },
  methods: {
    showTaskList() {
      this.selectCarVisibles = true;
    },
    selectCarComplete(e) {
      this.selectCarList = duplicateRemoval([...e], "carId");
    },
    importCarComplete(e) {
      if (e.failedList&&e.failedList.length > 0) {
        this.resultVisible = true;
        this.importResult = e;
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      this.selectCarList = duplicateRemoval(
        [...this.selectCarList, ...e.successList],
        "carId"
      );
    },
    // 导出失败信息
    exportFail(data) {
      // exportCheckCar(data)
    },
    //重置
    handleClear() {
      this.selectCarList = [];
    },
    selectCommondComplete(e) {
      this.selectCommond = { ...e };
      console.log(this.selectCommond);
    },
    // 重置数据
    restData() {
      this.total = 0;
      this.list = [];
      this.selectCarList = [];
      this.selectCommond = {};
      this.formInfo.remark = "";
      this.formInfo.operationName = "";
    },
    // 关闭dialog
    closeDrawer() {
      this.restData();
      this.$emit("update:visibles", false);
    },
    submitForm() {
      const formCenter = this.checkForm({
        formName: "formCenter",
        formList: ["operationName", "car","commond"],
      });
      if (!formCenter) {
        return;
      }
      const postData = {
        operationName: this.formInfo.operationName,
        commandName: this.selectCommond.packetName,
        packetId: this.selectCommond.packetId,
        // vinList: this.selectCarList.map((obj) => obj.vinNo).join(","),
        vinList: this.selectCarList.map((obj) => obj.vinNoTotal).join(","),
        carIdList: this.selectCarList.map((obj) => obj.carId).join(","),
        remark: this.formInfo.remark,
        maxExecuteNumber: "10",
      };
      if (this.selectCarList.length === 0) {
        this.$message.warning({
          message: "请选择车辆",
          duration: 2 * 1000,
        });
        return;
      }
      this.loading=true
      createCommond(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$emit("add-complete");
          this.closeDrawer();
        }
        this.loading=false
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search_list {
  padding-top: 0;
}
</style>
