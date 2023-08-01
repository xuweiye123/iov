<template>
  <app-drawer
    :visibles="visibles"
    :title="'设置车辆'"
    width="55%"
    @close-drawer="closeDrawer"
    :type="'footerSpecial'"
    @ok-drawer="handleSubmit"
    @ok-drawer1="handleSubmit1"
    :isOkButLoading="loading"
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
          @click-import="showImport"
          @click-allCheck="handleAllCheck"
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
          ref="setCarTable"
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
              {{
                scope.row[scope.item.prop] | processData
              }}
            </span>
          </template>
        </app-table>
      </div>
       <!-- 导入dialog弹窗 -->
      <import-dialog
        action="api/monitor/geofenceRulesCar/importCar"
        :template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
        :data="postData"
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      >
        <result-dialog
          :visibles.sync="resultVisible"
          :data="importResult"
          :text="'VIN码'"
          :keys="'vinNo'"
          @export-fail="exportFail"
        
        />
        <!--   :is-show="false"
          @close="importClose"
          @export-fail="exportFail" -->
      </import-dialog>
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
import { getSelectCarlist, createSetCar,exportFail } from '@/api/carMonitorSys/geofencingManage'
import { getCarTypeList, getBatchAll } from '@/api/commont'
// 组件
import importDialog from '@/components/importDialog'
import resultDialog from '@/components/resultDialog'

export default {
  doNotInit: true,
  name: "setCarDrawer",
  components: { importDialog, resultDialog },
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
        return val || (val===0 ? val:'-');
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
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width: 170,
        },
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
      loading:false,
      importVisible: false,
      resultVisible: false,
      importResult: {},
      postData: {},
      carTypeList: [], // 车型名称
      batchList: [], // 项目代码
      tableRowdata: {}, // 导入时传递的参数
      isAll: 0
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.carTypeListHandle()
        this.carBatchListHandle()
        this.isAll = 0
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
        functionName: "导入",
        functionNameEn: "导入",
        functionType: 1,
        iconType:2,
        url: "import",
        icon: "templateImport",
        isShow: 1,
      },
      {
        functionName: "一键全选",
        functionNameEn: "一键全选",
        functionType: 1,
        iconType:2,
        url: "allCheck",
        icon: "allCheck",
        isShow: 1,
      },
    ];
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportFail(data);
    },
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
    // 导入成功之后刷新list
    reloadList(data) {
      this.$emit("add-complete");
      if (data.failedList&&data.failedList.length > 0) {
        this.importResult = data;
        this.resultVisible = true; 
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      this.listLoad();
    },
    // 关闭导入弹出层
    importClose() {
      this.importVisible = false;
      this.closeDrawer();
    },
    showImport() {
      this.postData = {
        userId: this.$store.state.user.userInfo.userId,
        geofenceRulesId: this.formInfo.geofenceRulesId,
        isAdmin: this.$store.state.user.userInfo.isAdmin,
        alarmsType: 1,
      };
      console.log(this.$store.state.user.userInfo,"this.$store.state.user.userInfo",this.formInfo)
      this.importVisible = true;
    },
    handleSelectionChange(val) {
      // console.log(val,111)
      this.multipleSelection = val;
      this.isAll = 0
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
    // 一键全选
    handleAllCheck() {
       this.$confirm(`请谨慎操作，确定要全部添加吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listQuery.geofenceRulesId = this.formInfo.geofenceRulesId
        this.listQuery.isSelectedAll = this.formInfo.isSelectedAll
        this.listQuery.pageSize=this.total
        console.log(this.listQuery,"this.listQuery")
        getSelectCarlist(this.listQuery).then(({ data }) => {
          if (data.code === 0) {
            data.data.forEach((r) => {
              this.multipleSelection.push(r);
            })
          }
          this.listLoading = false
          this.listQuery.pageSize=10
          this.submit(0)
        })
      }).catch(() => {})
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
      getSelectCarlist(this.listQuery)
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
      this.collapse=false;
      this.formInfo = {};
      this.multipleSelection = [];
      this.list = [];
      this.$emit("update:visibles", false);
    },
    // 清空选择的值
    clearSelect () {
      let tableCheck=this.$refs.setCarTable.refTable()
      console.log(this.$refs.setCarTable,"aaaaa",this.$refs.setCarTable.refTable())
      tableCheck.clearSelection();
    },
    submit(e) {
       if(this.isAll == 0){
        if(this.multipleSelection.length == 0){
          this.$message.warning({
            message: '请选择要添加的车辆',
            duration: 2 * 1000
          })
          return
        }
      }
      const caridArry = []
      this.multipleSelection.forEach((r) => {
        caridArry.push(r.carId)
      })
      const postData = {
        geofenceRulesId: this.formInfo.geofenceRulesId
      }
      if (this.isAll === 1) {
        postData.isAll = 1
        postData.carId = ''
      } else {
        postData.isAll = 0
        postData.carId = caridArry.join(',')
      }
      postData.alarmsType = 1
      console.log(postData,"postData")
      this.loading = true
      createSetCar(postData).then(({ data }) => {
        if (data.code === 0) {        
          this.clearSelect()
          this.listLoad()
          this.$emit('set-complete') 
          console.log(e,"ee")
          if(e===0){
            this.closeDrawer()
            console.log(e,"ee11")
          }
          this.$message.success({
            message: '设置成功',
            duration: 2 * 1000
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      });
    },
    handleSubmit() {
      this.submit(1)
    },
    handleSubmit1() {
      this.submit(0)
    },

  },
};
</script>

<style scoped>

</style>
