<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'85px'" 
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
        :buttonList="insideList"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="scope.item.prop === 'isdeleted'"
            :style="{
              color: scope.row[scope.item.prop] == 0 ? 'teal' : '#FF0000',
            }"
          >
          <svg-icon :icon-class="scope.row[scope.item.prop] ==0?'isBind':'noBind'" />&nbsp;
            {{ scope.row[scope.item.prop] == 0 ? "已绑定" : "已解绑" }}
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
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// 组件

import { getCarRealist, exportData } from "@/api/carManageSys/realname";

// 辅助函数
export default {
  name: "unicomRealname",
  components: {},
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        iccid: "",
        ownerName: "",
        ownerCertificateType: "",
        customerType: "",
        timeRange:["",""],
        // startTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
      },
      customerTypeList: [
        { label: "对私用户", value: "2" },
        { label: "对公用户", value: "4" },
      ],
      ownerCertificateTypeList: [
        { label: "居民身份证", value: "IDCARD" },
        { label: "港澳军民来往内定通行证", value: "HKIDCARD" },
        { label: "台湾居民来往大陆通行证", value: "TAIBAOZHENG" },
        { label: "警官证", value: "POLICEPAPER" },
        { label: "军官证", value: "PLA" },
        { label: "护照", value: "PASSPORT" },
        { label: "统一社会信用代码", value: "UNITCREDITCODE" },
        { label: "其他", value: "OTHERLICENCE" },
      ],
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          width: 160,
          checked: true,
        },
        {
          value: "姓名",
          prop: "ownerName",
          width: 95,
          checked: true,
        },
        {
          value: "联系电话",
          prop: "contactNumber",
          width: 110,
          checked: true,
        },
        {
          value: "证件类型",
          prop: "ownerCertificateType",
          width: 180,
          checked: true,
        },
        {
          value: "证件号码",
          prop: "ownerCertificateNumber",
          width: 160,
          checked: true,
        },
        {
          value: "认证类型",
          prop: "customerType",
          width: 90,
          checked: true,
        },
        {
          value: "认证通过时间",
          prop: "certificationTime",
          width: 140,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
        {
          value: "流水号",
          prop: "serialNumber",
          width: 230,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 150,
          checked: true,
        },
      ],
    };
  },
  watch: {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: 'vin',
          labelWidth:"65px",
        },
        {
          label: "创建时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "创建开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "创建结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
        {
          label: "ICCID",
          value: "iccid",
          type: 'input',
          labelWidth:"65px"
        },
        {
          label: "姓名",
          value: "ownerName",
          type: 'input',
          labelWidth:"65px",
        },
        {
          label: "证件类型",
          value: "ownerCertificateType",
          type: 'select',
          options: {
            data: this.ownerCertificateTypeList,
          },
        },
        {
          label: "认证类型",
          value: "customerType",
          type: 'select',
          options: {
            data: this.customerTypeList,
          },
        },
      ];
    },
  },
  mounted() {
  },
  methods: {
    // handleClear() {
    //   this.listQuery = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     vinNo: "",
    //     iccid: "",
    //     ownerName: "",
    //     ownerCertificateType: "",
    //     customerType: "",
    //     // startTime: getTodayTime0(),
    //     // endTime:getTodayEndTime(),
    //     timeRange:[getTodayTime0(),getTodayEndTime()],
    //   };
    //     this.listLoad();
    // },

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
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.list = [];
      this.listLoading = true;
      getCarRealist(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            this.tableRow = {};
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
      exportData(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
            duration: 2 * 1000,
          });
          //
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
