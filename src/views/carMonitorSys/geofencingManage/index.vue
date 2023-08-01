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
        @click-filter="showfilter = true"
        @click-add="handleAdd"
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
        :isShowOperation="true"
        :buttonList="insideList"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @click-setCar="setCarHandle"
        @click-deleteCar="handledeleteCar"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="scope.item.prop === 'alarmType'"
          >
            <el-tag
              :type="
                scope.row[scope.item.prop] == 1
                 ?'success'
                : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop === 'rulesType'">
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
          </span>
          <span
            v-else-if="scope.item.prop == 'carCount'"
            :class="scope.row[scope.item.prop] !== 0 ? 'vinNo' : ''"
          >
            {{ scope.row[scope.item.prop] | processData}}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>

    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
     <!-- 设置车辆dialog弹窗 -->
    <set-car-drawer
      :visibles.sync="setCarVisible"
      :data="tableRow"
      @set-complete="setComplete"
      @add-complete="setComplete"
    />
    <!-- 删除车辆dialog弹窗 -->
    <delete-car-drawer
      :visibles.sync="deleteCarVisible"
      :data="tableRow"
      @delete-complete="deleteComplete"
    />
    <!-- 车辆明细dialog弹窗 -->
    <detail-car-drawer
      :visibles.sync="carCountVisible"
      :data="tableRow"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import detailCarDrawer from './components/detailCarDrawer'
import deleteCarDrawer from './components/deleteCarDrawer'
import setCarDrawer from './components/setCarDrawer'

import { beginTimeAndEndTime } from "@/utils/base";
// request
import { getPagelist, deleteList } from "@/api/carMonitorSys/geofencingManage";
// 辅助函数
export default {
  name: "geofencingManage",
  CH_name:"地理围栏管理",
  components: {
    addUpdateDrawer,
    deleteCarDrawer,
    detailCarDrawer,
    setCarDrawer
  },
  filters: {
    switchText(val, type) {
      if (type === "rulesType") {
        return val === 0
          ? "行政区域"
          : val === 1
          ? "多边形"
          : val === 2
          ? "圆形"
          : "-";
      } else if (type === "alarmType") {
        return val === 0 ? "驶出" : val === 1 ? "驶入" : "-";
      } else {
        return val || (val===0 ? val:'-');
      }
    },
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        geofenceRulesName: "",
        endTime: "",
        startTime: "",
        rulesType: "",
        timeRange:["",""],
      },
      rulesTypeList: [
        { label: "行政区域", value: 0 },
        { label: "多边形", value: 1 },
        { label: "圆形", value: 2 },
      ],
      addUpdateVisible: false /* 查看导出记录*/,
      carCountVisible: false, // 车辆明细
      setCarVisible: false, // 设置车辆
      deleteCarVisible: false, //删除车辆
      isEdit: false, //是否编辑
      // 字段管理所需字段
      tableList: [
        {
          value: "报警名称",
          prop: "geofenceRulesName",
          width: 150,
          checked: true,
        },
        {
          value: "规则类型",
          prop: "rulesType",
          width: 100,
          checked: true,
        },
        {
          value: "报警类型",
          prop: "alarmType",
          width: 90,
          checked: true,
        },
        {
          value: "车速阈值",
          prop: "maxSpeed",
          width: 90,
          checked: true,
        },
        {
          value: "报警车辆",
          prop: "carCount",
          width: 120,
          checked: true,
        },
        {
          value: "描述",
          prop: "remark",
          width: 120,
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 180,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
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
          label: "报警名称",
          value: "geofenceRulesName",
          type: "input",
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
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
        {
          label: "规则类型",
          value: "rulesType",
          type: 'select',
          options: {
            data: this.rulesTypeList,
          },
        },
      ];
    },
  },
  mounted() {
  
  },
  methods: {
    // 点击列
    rowClick({ row, column }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
      const label = column.label;
      if (label === "报警车辆" && row.carCount !== 0) {
        this.carCountVisible = true;
      }
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
      this.listLoading = true;
      getPagelist(this.listQuery)
        .then(({ data }) => {
        this.list = [];
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
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.tableRow = row;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // 设置车辆
    setCarHandle(row) {
      this.tableRow = row;
      this.setCarVisible = true;
    },
    // 设置成功
    setComplete() {
      this.listLoad();
    },
    // 删除车辆
    handledeleteCar(row) {
      this.tableRow = row;
      this.deleteCarVisible = true;
    },
    //删除车辆成功
    deleteComplete() {
      this.listLoad();
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        geofenceRulesId: row.geofenceRulesId,
        geofenceRulesName: row.geofenceRulesName,
      };
      this.$confirm(`是否删除${row.geofenceRulesName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteList(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
