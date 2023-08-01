<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'50px'"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
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
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :isShowOperation="false"
        :buttonList="insideList"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isGpsPosition'">
            <svg-icon
              icon-class="icon-gps"
              :class="
                scope.row['isOnline'] == 1 && scope.row[scope.item.prop] == 1
                  ? 'yesgps'
                  : 'nogps'
              "
            />
            {{
              scope.row[scope.item.prop]
                | switchText(scope.item.prop, scope.row)
            }}
          </span>
          <span v-else-if="scope.item.prop === 'isDriving'">
            <svg-icon
              :icon-class="
                scope.row['isOnline'] == 1 && scope.row[scope.item.prop] == 1
                  ? 'drive-start'
                  : 'drive-end'
              "
              :class="
                scope.row['isOnline'] == 1 && scope.row[scope.item.prop] == 1
                  ? 'yesgps'
                  : 'nogps'
              "
            />
            {{
              scope.row[scope.item.prop]
                | switchText(scope.item.prop, scope.row)
            }}
          </span>
          <span v-else-if="scope.item.prop === 'isOnline'">
            <svg-icon
              :icon-class="
                scope.row[scope.item.prop] == 1 ? 'online-start' : 'online-end'
              "
              :class="scope.row[scope.item.prop] == 1 ? 'yesgps' : 'nogps'"
            />
            {{
              scope.row[scope.item.prop]
                | switchText(scope.item.prop, scope.row)
            }}
          </span>
          <span v-else-if="scope.item.prop==='isCan'">
            <svg-icon :icon-class="scope.row['isOnline']===1&&scope.row[scope.item.prop]===1 ? 'can-yes':'can-no'" />
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span>
          <span v-else-if="scope.item.prop==='faultType' || scope.item.prop==='faultLevel' ">
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
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
import { getPageList, exportsData } from "@/api/carManageSys/offlineCarQuery";

// 辅助函数
export default {
  // doNotInit:true,
  name: "offlineCarQuery",
  components: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      vin: "",
      listQuery: {
        vinNo: "",
      },
      startsList: [
        { text: "成功", value: "0" },
        { text: "失败", value: "201,203,204,300" },
      ],
      detailVisible: false,
      vinNumber: 0,
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "数据上报时间",
          prop: "travelTime",
          width: 150,
          checked: true,
        },
        {
          value: "是否有CAN",
          prop: "isCan",
          width: 100,
          checked: true,
        },
        {
          value: "是否定位",
          prop: "isGpsPosition",
          width: 90,
          checked: true,
        },
        {
          value: "是否行驶",
          prop: "isDriving",
          width: 90,
          checked: true,
        },
        {
          value: "终端在线状态",
          prop: "isOnline",
          width: 120,
          checked: true,
        },
        {
          value: "故障名称",
          prop: "faultName",
          width: 110,
          checked: true,
        },
        {
          value: "故障码",
          prop: "faultCode",
          width: 110,
          checked: true,
        },
        {
          value: "故障类型",
          prop: "faultType",
          width: 90,
          checked: true,
        },
        {
          value: "故障等级",
          prop: "faultLevel",
          checked: true,
          width: 90,
        },
        {
          value: "零部件",
          prop: "carPart",
          width: 110,
          checked: true,
        },
        {
          value: "故障开始时间",
          prop: "startTime",
          width: 150,
          checked: true,
        },
        {
          value: "故障结束时间",
          prop: "endTime",
          width: 150,
          checked: true,
        },
        {
          value: "查询时间",
          prop: "createdOn",
          width: 150,
          checked: true,
        },
      ],
    };
  },
  filters: {
    switchText(val, type, row) {
      if (type === 'isOnline') {
        return val === 1 ? '在线' : '离线'
      } else if (type === 'isGpsPosition') {
        if (row.isOnline === 0) {
          return '未定位'
        } else {
          return val === 1 ? '已定位' : '未定位'
        }
      } else if (type === 'isDriving') {
        if (row.isOnline === 0) {
          return '停止'
        } else {
          return val === 1 ? '行驶' : '停止'
        }
      } else if (type === 'isCan') {
        if (row.isOnline === 0) {
          return '无CAN'
        } else {
          return val === 1 ? '有CAN' : '无CAN'
        }
      } else if (type === 'faultType') {
        return val === 1 ? '国标故障' :val === 2 ? '自定义故障':'-'
      } else if (type === 'faultLevel') {
        return val === 1 ? '一级' : val === 2 ? '二级' : val === 3 ? '三级' :val === 4 ? '四级':'-'
      } else {
        return val || (val===0 ? val:'-');
      }
    }
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
      ];
    },
  },
  mounted() {
  },
  methods: {
    // 导出
    handleExport() {
      this.exportLoading = true;
      exportsData(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          //
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
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
      this.list = [];
      this.listLoading = true;
      getPageList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.tableRow = {};
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

<style lang="scss" scoped>
.yesgps {
  color: #00e56c;
}
.nogps {
  color: #98a3af;
}
</style>
