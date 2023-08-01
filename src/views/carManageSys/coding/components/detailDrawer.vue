<template>
  <app-drawer
    :visibles="visibles"
    :title="'电池电机编码记录查询'"
    :wrapperClosable="true"
    width="60%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :labelWidth="'90px'"
            :spanNumber="8"
            :collapse="collapse"
            :listQuery="listQuery"
            :searchList="searchList"
          />
        </div>
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>

      <div class="section-wrap">
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
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop == 'faultlevel'">
              {{
                scope.row[scope.item.prop] == 1
                  ? "一级"
                  : scope.row[scope.item.prop] == 2
                  ? "二级"
                  : scope.row[scope.item.prop] == 3
                  ? "三级"
                  : scope.row[scope.item.prop] == 4
                  ? "四级"
                  : "-"
              }}
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
// request
import {
  getBatteryCodeRecordList,
  exportBmscodechange,
} from "@/api/carManageSys/coding";
export default {
  name: "detailDrawer",
  mixins: [pagingMixin, drawerOtherHeight, tableStyle,getPageButton],
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
        vinNo: "",
        terminalCode: "",
        iccid: "",
        bmsCode: "",
        motorCode: "",
      },
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: 120,
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          width: 160,
          checked: true,
        },
        {
          value: "动力电池编码",
          prop: "bmsCode",
          width: 220,
          checked: true,
        },
        {
          value: "驱动电机编码",
          prop: "motorCode",
          width: 240,
          checked: true,
        },
        {
          value: "变更时间",
          prop: "changedTime",
          width: 140,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdTime",
          width: 140,
          checked: true,
        },
      ],
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
        {
          label: "ICCID",
          value: "iccid",
          type: "input",
        },
        {
          label: "动力电池编码",
          value: "bmsCode",
          type: "input",
        },
        {
          label: "驱动电机编码",
          value: "motorCode",
          type: "input",
        },
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad();
      }
    },
  },
  mounted() {
    // 暂时强行添加1
    this.headersRightList = [
      {
        functionName: "导出",
        functionNameEn: "导出",
        functionType: 1,
        url: "export",
        icon: "export",
        iconType:2,
        isShow: 1,
      },
    ];
  },
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.listQuery = {
        vinNo: "",
        terminalCode: "",
        iccid: "",
        bmsCode: "",
        motorCode: "",
        pageNum: 1,
        pageSize: 10
      };
      this.collapse=false
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },

    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.vinNo = this.data.vinNo;
      getBatteryCodeRecordList(this.listQuery)
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
      exportBmscodechange(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          //
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.search_list {
  padding-top: 0;
}
</style>
