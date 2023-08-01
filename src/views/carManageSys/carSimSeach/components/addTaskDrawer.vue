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
          <el-col :span="12">
            <el-form-item label="任务名称：" prop="taskName">
              <el-input
                v-model="formInfo.taskName"
                placeholder="请输入任务名称"
                clearable
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
                  <!-- <div style="position:relative;">
                    <div
                      style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer"
                      @click="showTaskList"
                    />
                    <el-input v-model.trim="selectCarStr" />
                  </div> -->
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
                    >车辆信息：已选择 <span style="color:red">{{
                      selectCarNumber
                    }} </span
                    >辆车</span
                  >
                  <span class="titleColor" v-else>车辆信息：当前未选择任何车辆</span>
                </div>
              </el-col>
            </el-row>
          </el-col>
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
        :visibles.sync="importVisible"
        :append-to-body="true"
        @upload-success="importCarComplete"
      >
        <result-dialog
          :visibles.sync="resultVisible"
          :data="importResult"
          :text="'VIN码'"
          :keys="'vinNo'"
          :message="'无导入失败信息'"
          @export-fail="exportFail"
          @close="resultClose"
        >
        </result-dialog>
      </import-dialog>
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { duplicateRemoval } from "@/utils/base";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// 组件
import selectCarDialog from "@/components/carManageSys/selectCarDialog";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";
// import { create } from '@/api/dataAnalyse/odoMileage'
import { createSIMsearch } from "@/api/carManageSys/carSimSearch";
import { exportFailCars } from "@/api/commont";
import { mapGetters } from "vuex";
// request
export default {
  name: "addTaskDrawer",
  components: { selectCarDialog, importDialog, resultDialog },
  mixins: [partialForm,checkFormRule],
  props: {
    visibles: {
      type: Boolean,
      default: false,
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
    paramsStr() {
      return this.selectParamsItemList.map((obj) => obj.label).join(",");
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = {};
        // this.selectCarStr = ''
        this.selectCarList = [];
      }
    },
  },
  created() {},
  data() {
    const validateCar = (rule, value, cb) => {
      if (this.selectCarList.length === 0) {
        return cb(new Error("请选择车辆"));
      }
    };
    return {
      formInfo: {},
      total: 0,
      list: [],
      listLoading: false,
      selectCarList: [],
      loading: false,
      selectCarVisibles: false,
      importVisible: false,
      resultVisible: false,
      importResult: {},
      paramsVisible: false,
      selectParamsList: [],
      selectParamsItemList: [],
      rules: {
        taskName: [
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
      },
    };
  },
  mounted() {},
  methods: {
    showTaskList() {
      this.selectCarVisibles = true;
    },
    showParams() {
      this.paramsVisible = true;
    },
    selectParams(e) {
      this.selectParamsList = [...e.idList];
      this.selectParamsItemList = [...e.itemList];
    },
    selectCarComplete(e) {
      this.selectCarList = duplicateRemoval([...e], "vinNo");
    },
    importCarComplete(data) {
      console.log([...this.selectCarList, ...data.successList],"11111111")
      this.selectCarList = duplicateRemoval(
        [...this.selectCarList, ...data.successList],
        "vinNo"
      );
      if (data.failedList&&data.failedList.length > 0) {
        this.resultVisible = true;
        this.importResult = data;
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      console.log(this.selectCarList,data.successList,"2222222")
    },
    exportFail(data) {
      exportFailCars(data)
    },
    resultClose() {
      this.$refs.importDialog.closeDialog();
    },
    handleClear() {
      this.selectCarList = [];
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
    },
    submitForm() {
      const formCenter = this.checkForm({
        formName: "formCenter",
        formList: ["taskName", "car"],
      });
      if (!formCenter) {
        return;
      }
      const arr = [];
      this.selectCarList.forEach((item) => {
        // arr.push(item.vinNo);
        arr.push(item.vinNoTotal);
      });
      const postData = {
        taskName: this.formInfo.taskName,
        vinNo: arr.join(","),
        remark: this.formInfo.remark,
      };
      if (arr.length === 0) {
        this.$message.warning({
          message: "请选择车辆",
          duration: 2 * 1000,
        });
        return;
      }
      this.loading = true;
      createSIMsearch(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.closeDrawer();
            this.$emit("add-complete");
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
.search_list {
  padding-top: 0;
}
</style>
