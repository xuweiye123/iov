<template>
  <app-drawer
    :visibles="visibles"
    :title="'删除车辆'"
    width="55%"
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
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <!-- table -->
      <div class="section-wrap">
        <app-authorize-button
          :buttonLeft="headersLeftList"
          :buttonRight="[]"
          @click-filter="showfilter = false"
          :showRightButton="false"
          @click-delete="handleDelete"
          @click-allCheck="handleDeleteAll"
        >
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="tableList"
            :scroll-line="8"
          />
        </app-authorize-button>
        <p class="textColor" style="margin: 0 0 10px 10px">
          已选中 {{ multipleSelection.length }} 条数据
        </p>
        <app-table
          slot="table"
          :isTableSelection="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          rowKey="carId"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
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
  getCarPagelist,
  deleteSetCar,
} from "@/api/carMonitorSys/geofencingManage";
import { getCarTypeList, getBatchAll } from "@/api/commont";
export default {
  doNotInit: true,
  name: "deleteCarDrawer",
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
  filters: {
    switchText(val, type) {
      if (type === "taskstate") {
        return val === 0
          ? "下载中"
          : val === 1
          ? "进行中"
          : val === 2
          ? "已完成"
          : val === 3
          ? "异常"
          : "-";
      } else {
        return val || (val === 0 ? val : "-");
      }
    },
  },
  data() {
    return {
      multipleSelection: [],
      formInfo: {},
      listQuery: {
        vinNo: "",
        carTypeNameId: "",
        carBatchCodeId: "",
      },
      changdu: 0,
      selectList: [],
      addCarVisible: false,
      sendData: {},
      carTypeList: [], // 车型名称
      batchList: [], // 项目代码
      postdata: {},
      tableList: [
        { value: "VIN码", prop: "vinNo", checked: true, width: 170 },
        {
          value: "车型名称",
          prop: "carTypeName",
          checked: true,
          width: 120,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          checked: true,
          width: 120,
        },
      ],
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.carTypeListHandle();
        this.carBatchListHandle();
        this.formInfo = { ...this.data };
        // 传递给子页面的参数
        this.sendData.geofenceRulesId = this.data.geofenceRulesId;
        this.listLoad();
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
          value: "carTypeNameId",
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
          value: "carBatchCodeId",
          type: "select",
          options: {
            data: this.batchList,
            extraProps: {
              label: "carBatchCode",
              value: "carBatchId",
            },
          },
        },
      ];
    },
  },
  mounted() {
    // 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "删除",
        functionNameEn: "删除",
        functionType: 1,
        iconType: 2,
        url: "delete",
        icon: "ic_delete",
        isShow: 1,
      },
      {
        functionName: "一键全删",
        functionNameEn: "一键全删",
        functionType: 1,
        iconType: 2,
        url: "allCheck",
        icon: "deleteAll",
        isShow: 1,
      },
    ];
  },
  methods: {
    // 车辆型号
    carTypeListHandle() {
      getCarTypeList().then(({ data }) => {
        if (data.code === 0) {
          this.carTypeList = data.data || [];
        }
      });
    },
    // 项目代码
    carBatchListHandle() {
      getBatchAll().then(({ data }) => {
        if (data.code === 0) {
          this.batchList = data.data || [];
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    handleDelete() {
      if (this.multipleSelection.length == 0) {
        this.$alert("请选中需要删除项", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }
      const caridArry = [];
      // const idArry = [];
      this.multipleSelection.forEach((r) => {
        caridArry.push(r.carId);
        // idArry.push(r.geofenceRulesId);
      });
      this.postdata = {
        geofenceRulesId: this.formInfo.geofenceRulesId,
        carId: caridArry.join(","),
        // id: idArry.join(","),
        isSelectedAll: this.formInfo.isSelectedAll,
        alarmsType: 1,
      };
      console.log(this.postdata, "postdata");
      this.$confirm(`是否删除选中车辆?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSetCar(this.postdata).then(({ data }) => {
            if (data.code === 0) {
              this.closeDrawer();
              this.$emit("delete-complete");
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    //删除所有
    handleDeleteAll() {
      this.$confirm("是否删除所有数据", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            geofenceRulesId: this.formInfo.geofenceRulesId,
            isSelectedAll: this.formInfo.isSelectedAll,
            alarmsType: 1,
            isDeleteAll: 1,
          };
          console.log(data, "data", this.formInfo);
          deleteSetCar(data).then((res) => {
            if (res.data.code == 0) {
              this.closeDrawer();
              this.$emit("delete-complete");
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            } else {
              this.$message.warning({
                message: "删除失败",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.list = [];
      this.listQuery.geofenceRulesId = this.formInfo.geofenceRulesId;
      this.listQuery.isSelectedAll = this.formInfo.isSelectedAll;
      this.listLoading = true;
      getCarPagelist(this.listQuery)
        .then(({ data }) => {
          this.tableRow = {};
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
        vinNo: "",
        carTypeNameId: "",
        carBatchCodeId: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.collapse = false;
      this.formInfo = {};
      this.multipleSelection = [];
      this.list = [];
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped></style>
