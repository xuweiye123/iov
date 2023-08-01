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
// utils
import { beginTimeAndEndTime } from "@/utils/base";
// request
import {
  getOnlineCarList,
  getCarmoel,
  exportOnlineCar,
} from "@/api/diagnosisSys/report";

export default {
  name: "carOnline",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          // type: "input",
          type: "vin",
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
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: "dateTime",
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: "dateTime",
        //   defaultType: "end",
        // },
      ];
    },
  },
  data() {
    return {
      listQuery: {
        vinNo: "",
        cartypeid: "",
        startTime: "",
        endTime: "",
        timeRange:["",""],
      },
      carmodelList: [],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width: 160,
        },
        {
          value: "车型名称",
          prop: "carTypeName",
          checked: true,
          width: 120,
        },
        {
          value: "诊断模块",
          prop: "moduleName",
          checked: true,
          width: 120,
        },
        {
          value: "诊断次数",
          prop: "dxCount",
          checked: true,
          width: 120,
        },
        {
          value: "成功次数",
          prop: "successCount",
          checked: true,
          width: 120,
        },
        {
          value: "失败次数",
          prop: "failCount",
          checked: true,
          width: 120,
        },
      ],
    };
  },
  created() {
    this._getCarmoel();
  },
  methods: {
    _getCarmoel() {
      getCarmoel().then(({ data }) => {
        if (data.code == 0) {
          this.carmodelList = data.data || [];
        }
      });
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listLoading = true;
      getOnlineCarList(this.listQuery)
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
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportOnlineCar(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
