<template>
  <app-drawer
    :visibles="visibles"
    :wrapperClosable="true"
    :title="'任务命令详细表'"
    width="65%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :spanNumber="8"
            :collapse="collapse"
            :listQuery="listQuery"
            :searchList="searchList"
          />
        </div>
        <!-- 清空按钮 -->
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <div class="section-wrap">
        <!-- 授权按钮 -->
        <app-authorize-button
          :buttonLeft="[]"
          :buttonRight="headersRightList"
          :exportLoading="exportLoading"
          @click-filter="showfilter = true"
          @click-export="handleExport"
          :showRightMore="false"
        >
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="tableList"
            :scroll-line="8"
          />
        </app-authorize-button>

        <el-table
          size="mini"
          v-loading="listLoading"
          :data="list"
          :max-height="tableHeight"
          :header-row-style="headerRowStyle"
          :row-style="rowStyle"
          :header-cell-style="headerCellStyle"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column :label="$t('table.id')" align="center" min-width="65">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (listQuery.pageNum - 1) * listQuery.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableList"
            :key="index"
            :label="item.value"
            :prop="item.prop"
            :align="item.position"
            :min-width="item.width"
            show-overflow-tooltip
          >
            <el-table-column
              v-for="(v, i) in item.children || []"
              :key="i"
              :label="v.value"
              :prop="v.prop"
              :align="v.position"
              :min-width="v.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- <span
                  :style="styleObject(scope.row[v.prop])"
                  v-if="v.prop.indexOf('operationStatus') > -1"
                  >{{ scope.row[v.prop] | switchText }}</span
                > -->
                <span v-if="v.prop.indexOf('operationStatus') > -1">
                  <el-tag
                    :type="
                      scope.row[v.prop] == -1
                        ? 'warning'
                        : scope.row[v.prop] == 1
                        ? ''
                        : scope.row[v.prop] == 2 || scope.row[v.prop] == 5 ||scope.row[v.prop] == 6 
                        ? 'success'
                        : scope.row[v.prop] == 3 || scope.row[v.prop] == 4
                        ? 'danger'
                        : 'info'
                    "
                    effect="dark"
                  >
                    {{ scope.row[v.prop] | switchText }}
                  </el-tag>
                </span>
                <span v-else>
                  {{
                    scope.row[v.prop] ||
                      (scope.row[v.prop] == "0" ? scope.row[v.prop] : "-")
                  }}
                </span>
              </template>
            </el-table-column>
            <template slot-scope="scope">
              <!-- <span
                :style="styleObject(scope.row[item.prop])"
                v-if="item.prop === 'status'"
                >{{ scope.row[item.prop] | switchText }}</span
              > -->
              <span v-if="item.prop === 'status'">
                <el-tag
                  :type="
                    scope.row[item.prop] == -1
                      ? 'warning'
                      : scope.row[item.prop] == 1
                      ? ''
                      : scope.row[item.prop] == 2
                      ? 'success'
                      : scope.row[item.prop] == 3 || scope.row[item.prop] == 4
                      ? 'danger'
                      : 'info'
                  "
                  effect="dark"
                  style="width: 65px;"
                >
                  {{ scope.row[item.prop] | switchText }}
                </el-tag>
              </span>
              <span v-else-if="item.prop === 'isOnline'">
                <el-tag
                  :type="scope.row[item.prop] == 0 ? 'danger' : 'success'"
                  effect="dark"
                  style="width: 65px;"
                >
                  {{ scope.row[item.prop] == 0 ? "不在线" : "在线" }}
                </el-tag>
              </span>
              <!-- <span
                v-else-if="item.prop === 'isOnline'"
                :style="{
                  color: scope.row[item.prop] == 0 ? 'red' : 'green',
                }"
                >{{ scope.row[item.prop] == 0 ? "不在线" : "在线" }}</span
              > -->
              <span v-else>{{
                scope.row[item.prop] | processData
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div
          style="padding:10px"
          :class="[total > 0 ? 'visible' : 'hidden', 'pagination-container']"
        >
          <el-pagination
            :current-page="listQuery.pageNum"
            :page-sizes="[10, 50, 100, 500]"
            :page-size="listQuery.pageSize"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

// request
import {
  getBatchRemoteSettingDetailsPageList,
  getParamCount,
  exportTask,
} from "@/api/carManageSys/terminalBatch";
import { getCarTypeList, getBatchAll } from "@/api/carManageSys/commont";

export default {
  name: "lookTaskDrawer",
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
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
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        vinNo: "",
        carTypeId: "",
        carBatchId: "",
        terminalCode: "",
      },
      carTypeList: [],
      batchList: [],
      tableList: [
        { value: "VIN码", prop: "vinNo", width: 170 },
        {
          value: "整体完成情况",
          prop: "status",
          width: 100,
        },
        { value: "在线状态", prop: "isOnline",  width: 100 },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
        },
      ],
    };
  },
  filters: {
    switchText(val, type) {
      switch (val) {
        case -1:
          return "已撤销";
        case 0:
          return "未执行";
        case 1:
          return "执行中";
        case 2:
          return "完成";
        case 3:
          return "执行失败";
        case 4:
          return "暂停执行";
        case 5:
          return "已加载";
        case 6:
          return "收到终端响应";
        default:
          return "-";
      }
    },
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "车型名称",
          value: "carTypeId",
          type: "select",
          options: {
            data: this.carTypeList,
            extraProps: { 
              label: "carTypeName",
              value: "carTypeId",
            },
          },
        },
        {
          label: "项目代号",
          value: "carBatchId",
          type: "select",
          options: {
            data: this.batchList,
            extraProps: { 
              label: "carBatchCode",
              value: "carBatchId",
            },
          },
        },
        {
          label: "任务终端",
          value: "terminalCode",
          type: 'input',
        },
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = { ...this.data };
        // this.listQuery.vinNo = this.formInfo.vinNo
        this.listLoad();
      }
    },
  },
  mounted() {
    getCarTypeList().then(({ data }) => {
      if (data.code === 0) {
        this.carTypeList = data.data || [];
      }
    });
    getBatchAll().then(({ data }) => {
      if (data.code === 0) {
        this.batchList = data.data || [];
      }
    });
    // 暂时强行添加1
    this.headersRightList = [
      {
        functionName: "导出",
        functionNameEn: "导出",
        functionType: 2,
        iconType: 2,
        url: "export",
        icon: "export",
        isShow: 1,
      },
    ];
  },
  methods: {
    styleObject(e) {
      return {
        color:
          e == -1
            ? "gray"
            : e == 1
            ? "green"
            : e === 2
            ? "#28a7f0"
            : e === 3 || e === 4
            ? "red"
            : "#606266",
      };
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
      getParamCount({ taskId: this.data.taskId }).then(({ data }) => {
        if (data.code === 0) {
          const fileNum = data.data;
          this.listLoading = true;
          this.listQuery.taskId = this.data.taskId;
          this.tableList = [
            { value: "VIN码", prop: "vinNo", width: 170, },
            {
              value: "整体完成情况",
              prop: "status",
              width: 100,
            },
            {
              value: "在线状态",
              prop: "isOnline",
              width: 100,
            },
            {
              value: "创建时间",
              prop: "createdOn",
              width: 140,
            },
          ];

          getBatchRemoteSettingDetailsPageList(this.listQuery)
            .then(({ data }) => {
              this.list = [];
              if (data.code === 0) {
                const dataList = data.data;
                dataList.forEach((i) => {
                  if (i.params && i.params.length == 1) {
                    console.log(1111);
                    i.commandName = i.params[0].commandName;
                    i.param = i.params[0].param;
                    i.operationStatus = i.params[0].operationStatus;
                    i.remark = i.params[0].remark;
                  } else if (i.params && i.params.length > 1) {
                    i.params.forEach((j, index) => {
                      i["commandName" + Number(index + 1)] = j.commandName;
                      i["param" + Number(index + 1)] = j.param;
                      i["operationStatus" + Number(index + 1)] = j.operationStatus;
                      i["remark" + Number(index + 1)] = j.remark;
                    });
                  }
                });
                console.log(dataList, "dataList");

                if (fileNum == 1) {
                  let obj = {
                    value: "命令1",
                    position: "center",
                    children: [
                      {
                        value: "命令名称",
                        prop: "commandName",
                        width: 120,
                      },
                      {
                        value: "命令参数",
                        prop: "param",
                        width: 150,
                      },
                      {
                        value: "完成情况",
                        prop: "operationStatus",
                        width: 100,
                      },
                      {
                        value: "备注",
                        prop: "remark",
                        width: 130,
                      },
                    ],
                  };
                  this.tableList.splice(this.tableList.length - 1, 0, obj);
                } else {
                  for (let i = 1; i < fileNum + 1; i++) {
                    let obj = {
                      value: "命令" + i,
                      position: "center",
                      children: [
                        {
                          value: "命令名称",
                          prop: "commandName" + i,
                          width: 120,
                        },
                        {
                          value: "命令参数",
                          prop: "param" + i,
                          width: 150,
                        },
                        {
                          value: "完成情况",
                          prop: "operationStatus" + i,
                          width: 100,
                        },
                        {
                          value: "备注",
                          prop: "remark" + i ,
                          width: 130,
                        },
                      ],
                    };
                    this.tableList.splice(this.tableList.length - 1, 0, obj);
                  }
                }
                this.list = dataList;
                this.total = data.total;
              }
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
            });
        }
      });
    },
    restData() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        vinNo: "",
        carTypeId: "",
        carBatchId: "",
        terminalCode: "",
      };
        // this.batchCodeList = [];
        // this.carTypeList = [];
        (this.list = []);
      this.tableList = [
        { value: "VIN码", prop: "vinNo", width: 170 },
        {
          value: "整体完成情况",
          prop: "status",
          width: 100,
        },
        { value: "在线状态", prop: "isOnline", width: 100 },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
        },
      ];
    },
    // 关闭
    closeDrawer() {
      this.restData();
      this.collapse = false;
      this.$emit("update:visibles", false);
    },
    handleExport() {
      this.exportLoading = true;
      exportTask(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style scoped>

</style>
