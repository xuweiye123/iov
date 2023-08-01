<template>
  <div class="js-car-manage app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <el-form :model="listQuery" label-width="65px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="退役电池编码：" label-width="90px">
                <el-input
                  v-model="listQuery.batteryCode"
                  @input="clearVINno"
                  filterable
                  clearable
                  placeholder="请输入退役电池编码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品类型：">
                <el-select
                  v-model="listQuery.productType"
                  @change="clearVINno"
                  placeholder="请选择"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(item, index) in productTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="上传状态：">
                <el-select
                  v-model="listQuery.code"
                  @change="clearVINno"
                  placeholder="请选择"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(item, index) in vehicleModel"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--折叠 过滤 清空 -->
      <app-search-button
        slot="bottom"
        :is-collapse="false"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear1"
      />
    </app-search>
    <!-- 按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-export="handleExport"
        @click-import="handleImport"
        @click-import-select="handleImportCar"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>
      <!-- table -->
      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :isShowOperation="true"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="insideList"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'code'">
            <el-tag
              :type="
                scope.row.code == '初始'
                  ? 'info'
                  : scope.row.code == '成功'
                  ? 'success'
                  : scope.row.code == '失败'
                  ? 'danger'
                  : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </el-tag>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
					<el-tooltip
						v-for="(l, index) in insideList"
						:key="index"
						:open-delay="250"
						class="item"
						effect="dark"
						:content="l.functionName"
						placement="top"
					>
						<span
							class="card-action"
							v-if="l.url == 'lifeCycle' &&
                scope.row['productType'] === '电池包'"
							@click="LookStyle(scope.row)"
						>
							<i :class="'iconfont icon-' + l.icon"></i>
						</span>
					</el-tooltip>
				</template>
      </app-table>
    </div>
    <!--导入-->
    <import-dialog
      action="api/battery/batretire/import"
      :template-url="
        'api/battery/fileStatics/ImportBatteryPlantDecommissioningInformationBatch.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'退役电池编码'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        :is-show="true"
      />
    </import-dialog>
    <dcstyle-drawer
      :visibles.sync="styleVisible"
      :data="this.cellcode"
      @add-complete="addComplete"
    >
    </dcstyle-drawer>
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/batretire/importCode'"
      :title="'导入查询'"
      :template-url="
        'api/battery/fileStatics/BatteryPlantDecommissioningInformationImportQuery.xlsx'
      "
      :visibles.sync="importCarVisible"
      @upload-success="reloadCarList"
    />
    <result-dialog
      :visibles.sync="resultCarVisible"
      :data="importResult"
      :text="'退役电池编码'"
      :keys="'vinNo'"
      :message="'无导入失败信息'"
      @export-fail="exportCarFail"
    />
  </div>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
//组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import dcstyleDrawer from "./components/dcstyleDrawer";
import {
  getBatrecycsList,
  getBatrecycsExport,
  exportCheck,
  exportByCode,
} from "@/api/batterySys/batRetire";
import { exportCarCheck } from "@/api/batterySys/commont";
export default {
  name: "batRetire",
  components: {
    importDialog,
    resultDialog,
    dcstyleDrawer,
  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      cellcode: "",
      vehicleModel: [
        { label: "初始", value: "2" },
        { label: "成功", value: "0" },
        { label: "失败", value: "1" },
      ],
      listQuery: { batteryCode: "" },
      tableList: [
        {
          value: "退役电池编码",
          prop: "batteryCode",
          width: "190px",
          checked: true,
        },
        {
          value: "产品类型",
          prop: "productType",
          width: "150px",
          checked: true,
        },
        {
          value: "退役日期",
          prop: "retireDate",
          width: "140px",
          checked: true,
        },
        {
          value: "退役厂商名称",
          prop: "supplierName",
          width: "120px",
          checked: true,
        },
        {
          value: "退役去向单位名称",
          prop: "unitName",
          width: "120px",
          checked: true,
        },
        {
          value: "电池类型",
          prop: "batteryType",
          width: "100px",
          checked: true,
        },
        {
          value: "电池质量(kg)",
          prop: "batteryWeight",
          width: "100px",
          checked: true,
        },
        {
          value: "上传状态",
          prop: "code",
          width: "100px",
          checked: true,
        },
      ],
      importVisible: false, // 导入
      styleVisible: false,
      resultVisible: false,
      importResult: {},
      productTypeList: [
        { label: "电池包", value: "电池包" },
        { label: "电池模块", value: "电池模块" },
        { label: "电池单体", value: "电池单体" },
      ],
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "退役电池编码",
          value: "batteryCode",
          type: "input",
          inputEvent:this.clearVINno
        },
        {
          label: "产品类型",
          value: "productType",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.productTypeList, //下拉数组
          },
          inputEvent:this.clearVINno
        },
        {
          label: "上传状态",
          value: "code",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.vehicleModel, //下拉数组
          },
          inputEvent:this.clearVINno
        },
      ];
    },
  },
  mounted() {},
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    clearVINno() {
      this.$route.query.vinNo = "";
    },
    //清空
    handleClear1() {
      for (const k in this.listQuery) {
        if (k === "pageNum" || k === "pageSize") {
          continue;
        } else {
          this.listQuery[k] = "";
        }
      }
      this.$route.query.vinNo = "";
      this.listLoad();
    },
    LookStyle(row) {
      this.cellcode = row.batteryCode;
      this.styleVisible = true;
    },
    //加载数据
    listLoad() {
      this.listLoading = true;
      if (this.$route.query.vinNo != "" && this.$route.query.vinNo != undefined)
        this.listQuery.batteryCode = this.$route.query.vinNo;
      getBatrecycsList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //导出
    handleExport() {
      // this.uploadloading = this.$loading({
      //   target: document.querySelector(".el-dialog-import-sim"),
      //   text: "正在导出，请稍候...",
      //   background: "rgba(1,1,1,0.3)",
      //   customClass: "svg-otherColor",
      // });
      this.exportLoading = true;
      getBatrecycsExport(this.listQuery).then(() => {
        // this.uploadloading.close();
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 导入
    handleImport() {
      this.importVisible = true;
    },
    // 跳转成功
    addComplete() {
      this.listLoad();
    },
    reloadList(data) {
      this.importResult = data;
      if (data.failedList.length > 0) {
        this.resultVisible = true;
      }else{
        this.importVisible = false
       }
      this.listLoad();
    },
    // 导入查询
    handleImportCar() {
      this.importCarVisible = true;
    },
    reloadCarList(data) {
      this.importResult = data;
      if (data.failedList.length > 0) {
        this.resultCarVisible = true;
      }
      this.importCarVisible = false;
      if (data.successList.length == 0) {
        return;
      }
      this.$alert("导入成功" + data.successList.length + "条", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            codeList,
          };
          exportByCode(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "电池厂退役信息",
        key: "退役电池编码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss"></style>
