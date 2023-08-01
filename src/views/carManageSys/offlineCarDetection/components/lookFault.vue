<template>
  <app-drawer
    :visibles="visibles"
    :wrapperClosable="true"
    :title="'故障信息'"
    width="55%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :collapse="collapse"
            :spanNumber="8"
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
          @click-filter="showfilter = true"
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
          :isPagination="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          :actionWidth="actionWidth"
          :actionFixed="actionFixed"
          :isShowOperation="false"
          @row-dblclick="rowDblclick"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span
              v-if="scope.item.prop === 'dictionarystatus'"
              :style="{
                color: scope.row[scope.item.prop] == 0 ? 'teal' : '#FF0000',
              }"
            >
              {{ scope.row[scope.item.prop] == 0 ? "启用" : "禁用" }}
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
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";

// request
import { selectTroubleRecordPageList } from "@/api/carManageSys/offlineCarDetection";

export default {
  name: "lookFault",
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
        timeRange:["",""],
        // startTime: "",
        // endTime: "",
      },
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "故障名称",
          prop: "faultCodeName",
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
          width: 100,
          checked: true,
        },
        {
          value: "故障等级",
          prop: "faultLevel",
          width: 100,
          checked: true,
        },
        {
          value: "零部件",
          prop: "carPartName",
          width: 110,
          checked: true,
        },
        {
          value: "故障开始时间",
          prop: "startTime",
          width: 140,
          checked: true,
        },
        {
          value: "故障结束时间",
          prop: "endTime",
          width: 140,
          checked: true,
        },
        {
          value: "车速",
          prop: "params",
          width: 120,
          checked: true,
        },
      ],
    };
  },
  filters: {
    switchText(val, type) {
      if (type === 'faultType') {
        return val === 1 ? '国标故障' :val === 2 ? '自定义故障':'-'
      } else if (type === 'faultLevel') {
        return val === 1 ? '一级' : val === 2 ? '二级' : val === 3 ? '三级' :val === 4 ? '四级':'-'
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
          type: 'input',
          disabled:true,
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end',
        // },
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
  },
  methods: {
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
      this.list = [];
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      // this.listQuery.vinNo = this.formInfo.vinNo;
      this.listQuery.vinNo = this.formInfo.vinNoTotal;
      this.listLoading = true;
      selectTroubleRecordPageList(this.listQuery)
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
    // 关闭
    closeDrawer() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        vinNo: "",
        timeRange:["",""],
        // startTime: "",
        // endTime: "",
      };
      this.collapse = false;
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
    rowDblclick(row) {
      this.$emit("dblclick-select", row);
      this.closeDrawer();
    },
  },
};
</script>

<style scoped>

</style>
