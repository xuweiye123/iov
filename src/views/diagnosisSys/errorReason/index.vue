<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <div slot="bottom">
        <!-- 清空查询按钮 -->
        <app-search-button
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </div>
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-export="handleExport"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
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
        :tableHeights="tableHeight"
        :isShowOperation="false"
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
  </div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import {
  getSystem,
  getCarmoel,
  getError,
  exporterror,
} from "@/api/diagnosisSys/report";

export default {
  name: "errorReason",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "关键字",
          value: "keyName",
          type: "input",
        },
        {
          label: "分系统",
          value: "systemId",
          type: "select",
          options: {
            data: this.systemList,
            extraProps: {
              label: "systemName",
              value: "id",
            },
          },
        },
        {
          label: "ECU名称",
          value: "ecuName",
          type: "input",
        },
        {
          label: "车型名称",
          value: "carTypeId",
          type: "select",
          options: {
            data: this.carmodelList,
            extraProps: {
              label: "carTypeName",
              value: "carTypeId",
            },
          },
        },
      ];
    },
  },
  data() {
    return {
      listQuery: {
        keyName: "",
        systemId: "",
        ecuName: "",
        carTypeId: "",
      },
      systemList: [],
      carmodelList: [],
      tableList: [
        {
          value: "失败原因",
          prop: "errorDes",
          checked: true,
          width: 220,
        },
        { value: "分系统", prop: "systemName", checked: true, width: 160 },
        { value: "ECU名称", prop: "ecuName", checked: true, width: 100 },
        { value: "车型名称", prop: "carTypeName", checked: true, width: 120 },
        { value: "出现次数", prop: "errorCount", checked: true, width: 100 },
      ],
    };
  },
  created() {
    this._getSystem();
    this._getCarmoel();
  },
  methods: {
    _getSystem() {
      getSystem().then((data) => {
        if (data.data.code == 0) {
          this.systemList = data.data.data || [];
        }
      });
    },
    _getCarmoel() {
      getCarmoel().then(({ data }) => {
        if (data.code == 0) {
          this.carmodelList = data.data || [];
        }
      });
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getError(this.listQuery)
        .then(({ data }) => {
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
    // 导出
    handleExport() {
      this.exportLoading = true;
      exporterror(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
