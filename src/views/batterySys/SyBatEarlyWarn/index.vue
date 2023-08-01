<template>
  <div class="js-basedata-cargroup app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!--折叠 过滤 清空 -->
      <app-search-button
        slot="bottom"
        :is-collapse="true"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <!-- 按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-import-select="handleImportCar"
        @click-export="handleExport"
        @click-exportData="lookExportTask"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>

      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :isShowOperation="false"
        :actionFixed="actionFixed"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!--导入或导出任务dialog弹窗-->
    <look-export-import-drawer
      :visibles.sync="exportImportTaskVisible"
      :is-export="isExport"
      :category="'earlyWarn'"
    />
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/earlywarn/importVin'"
      :title="'导入查询'"
      :template-url="'api/battery/fileStatics/ImportVINInformation.xlsx'"
      :visibles.sync="importCarVisible"
      @upload-success="reloadCarList"
    />
    <result-dialog
      :visibles.sync="resultCarVisible"
      :data="importResult"
      :text="'VIN码'"
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
import {
  getList,
  exportBatEarlyWarn,
  exportByVin,
} from "@/api/batterySys/SyBatEarlyWarn";
import { exportCarCheck } from "@/api/batterySys/commont";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
//引入导入组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import lookExportImportDrawer from "@/components/lookExportImportDrawer";
export default {
  name: "SyBatEarlyWarn",
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  components: { importDialog, resultDialog, lookExportImportDrawer },
  data() {
    return {
      listQuery: {
        startTime: "",
        endTime: "",
        timeRange:["",""],
      },
      isRepairList: [
        { label: "车辆维修", value: 0 },
        {
          label: "车辆生产",
          value: 1,
        },
      ],
      noteList: [
        {
          label: "电池供应商未上传电池备案信息",
          value: "电池供应商未上传电池备案信息",
        },
        {
          label: "电池供应商未上传电池三级编码信息",
          value: "电池供应商未上传电池三级编码信息",
        },
        {
          label: "电池模块供应商未上传电池模块备案信息",
          value: "电池模块供应商未上传电池模块备案信息",
        },
        { label: "未找到电池模块", value: "未找到电池模块" },
      ],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "170px",
          checked: true,
        },
        {
          value: "电池编码",
          prop: "psn",
          width: "200px",
          checked: true,
        },
        {
          value: "数据来源",
          prop: "isRepair",
          width: "100px",
          checked: true,
        },
        {
          value: "产品类型",
          prop: "type",
          width: "100px",
          checked: true,
        },
        {
          value: "发证日期",
          prop: "userTime",
          width: "140px",
          checked: true,
        },
        {
          value: "错误提示",
          prop: "note",
          width: "160px",
          checked: true,
        },
      ],
      importResult: {},
      importCarVisible: false,
      resultCarVisible: false,
      isExport: false,
      exportImportTaskVisible: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          labelWidth: "65px",
          type: "vin",
        },
        {
          label: "电池编码",
          value: "psn",
          type: "input",
          labelWidth: "65px",
        },
        {
          label: "数据来源",
          value: "isRepair",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.isRepairList, //下拉数组
          },
        },
        {
          label: "错误类型",
          value: "note",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.noteList, //下拉数组
          },
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
          labelWidth: "65px",
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: "dateTime",
        //   labelWidth: "65px",
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: "dateTime",
        //   defaultType: "end",
        //   labelWidth: "65px",
        // },
      ];
    },
  },
  mounted() {},
  methods: {
    //导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      // this.uploadloading = this.$loading({
      //   target: document.querySelector(".el-dialog-import-sim"),
      //   text: "正在导出，请稍候...",
      //   background: "rgba(1,1,1,0.3)",
      //   customClass: "svg-otherColor",
      // });
      this.exportLoading = true;
      exportBatEarlyWarn(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$message.success({
              message: "任务创建成功，请在导出记录中查看生成进度",
              duration: 2 * 1000,
            });
          }
        })
        .finally(() => {
          this.exportLoading = false;
        })
    },
    //查看导出任务按钮
    lookExportTask() {
      this.isExport = true;
      this.exportImportTaskVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listLoading = true;
      getList(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0;
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
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
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
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
          exportByVin(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "电池信息预警",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

<style scoped></style>
