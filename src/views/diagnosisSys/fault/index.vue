<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <div slot="bottom">
        <!-- 清空查询按钮 -->
        <app-search-button
          :isCollapse="false"
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
        @click-filter="showfilter = true"
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
import { getFaultRateList } from "@/api/diagnosisSys/report";

export default {
  name: "fault",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  components: {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "故障码",
          value: "faultCode",
          type: "input",
        },
        {
          label: "故障码描述",
          value: "keyName",
          type: "input",
        },
      ];
    },
  },
  data() {
    return {
      listQuery: {
        faultCode: "",
        keyName: "",
      },
      tableList: [
        {
          value: "故障码",
          prop: "digContent",
          checked: true,
          width: 80,
        },
        {
          value: "故障码描述",
          prop: "digResult",
          checked: true,
          width: 300,
        },
        {
          value: "诊断车辆数量(辆)",
          prop: "carCount",
          checked: true,
          width: 120,
        },
        {
          value: "出现次数",
          prop: "dxCount",
          checked: true,
          width: 70,
        },
        {
          value: "占比",
          prop: "rateNum",
          checked: true,
          width: 70,
        },
      ],
    };
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getFaultRateList(this.listQuery)
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
  },
};
</script>

<style lang="scss" scoped></style>
