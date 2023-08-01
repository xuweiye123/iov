<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <el-form :model="listQuery" label-width="50px" style="width:100%">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="VIN码：" >
                <vin-rolling
                  :isImport="isImport"
                  v-model="listQuery.vinList"
                  :importVinList="importVinList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <!-- <el-tooltip class="item" effect="dark" content="批量导入" placement="top"> -->
                <el-button 
                  v-waves
                  v-preventReClick
                  size="small"
                  class="dialogButton"
                  @click="importCar"
                >
                批量导入
                  <!-- <i class="iconfont icon-downLoad">
                    <span style="margin-left:5px">
                    批量导入
                    </span>
                  </i> -->
                </el-button>
              <!-- </el-tooltip> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClearVIN"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        @click-filter="showfilter = true"
        @click-monitorSearch="handleMonitorSearch"
        @click-saveAll="handleSaveAll"
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
        @click-look="lookInfo"
        @click-save="saveInfo"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop==='isGpsPosition'">
            <svg-icon icon-class="icon-gps" :class="scope.row['isOnline']==1&&scope.row[scope.item.prop]==1 ? 'yesgps':'nogps'" />
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span>
          <span v-else-if="scope.item.prop==='isDriving'">
            <svg-icon :icon-class="scope.row['isOnline']==1&&scope.row[scope.item.prop]==1 ? 'drive-start':'drive-end'" :class="scope.row['isOnline']==1&&scope.row[scope.item.prop]==1 ? 'yesgps':'nogps'" />
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span>
          <span v-else-if="scope.item.prop==='isOnline'">
            <svg-icon :icon-class="scope.row[scope.item.prop]==1 ? 'online-start':'online-end'" :class="scope.row[scope.item.prop]==1 ? 'yesgps':'nogps'" />
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span>
          <span v-else-if="scope.item.prop==='isCan'">
            <svg-icon :icon-class="scope.row['isOnline']==1&&scope.row[scope.item.prop]==1 ? 'can-yes':'can-no'" :class="scope.row['isOnline']==1&&scope.row[scope.item.prop]==1 ? 'yesgps':'nogps'" />
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
      <!-- 查看dialog弹窗 -->
    <look-fault
      :visibles.sync="detailVisible"
      :data="tableRow"
      @dblclick-select="dblclickSelect"
    />
    <!-- 导入车辆 -->
    <import-dialog
      :title="'批量导入'"
      action="api/vehicle/offlineCheck/importBatchVin"
      :template-url="
        'api/vehicle/fileStatics/ImportVinBatchQuery.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'VIN码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
      />
    </import-dialog>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

import { handleExportFailInfo } from "@/utils/exportFailInfo";
// 组件
import lookFault from './components/lookFault'
import vinRolling from './components/vinRolling'
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
// request
import { getPageList, saveMessage } from '@/api/carManageSys/offlineCarDetection'
import {
  exportCheckCar,
} from "@/api/carManageSys/carInform";
// 辅助函数
export default {
  doNotInit:true,
  name: "offlineCarDetection",
  components: { lookFault,vinRolling,importDialog,resultDialog },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      vin: "",
      listQuery: {
        vinList: [],
      },
      startsList: [
        { text: "成功", value: "0" },
        { text: "失败", value: "201,203,204,300" },
      ],
      detailVisible: false,
      importVinList:[],
      isImport: false,
      importVisible: false, // 导入
      resultVisible: false,
      importResult: {},
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
          checked: true,
          width: 100,
        },
        {
          value: "是否行驶",
          prop: "isDriving",
          checked: true,
          width: 100,
        },
        {
          value: "终端在线状态",
          prop: "isOnline",
          width: 100,
          checked: true,
        },
        {
          value: "终端绑定时间",
          prop: "startTime",
          width: 150,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "batchCode",
          width: 110,
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
          width: 100,
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
          prop: "partName",
          width: 110,
          checked: true,
        },
        {
          value: "故障开始时间",
          position: "center",
          width: 140,
          checked: true,
        },
        {
          value: "故障结束时间",
          prop: "faultEndTime",
          width: 140,
          checked: true,
        },
      ],
    };
  },
  watch:{
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
  },
  mounted() {
  },
  methods: {
    importCar(){
      this.importVisible=true
    },
    reloadList(data) {
      this.isImport=true
      this.importResult = data;
      this.vinListArr=data.successList
      this.importVinList= this.vinListArr ||[];
      this.listQuery.vinList = this.vinListArr.map((obj) => obj.vinNoTotal)||[];
      if (data.failedList.length > 0) {
        this.resultVisible = true;
      }else{
        this.resultVisible = false;
        this.importVisible = false;
      }
    },
    // 导出失败信息
    exportFail(data) {
      // handleExportFailInfo(data,"vinNo");
      exportCheckCar(data)
        .then(() => {})
        .catch(() => {});
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
      if (this.listQuery.vinList.length > 0) {
        this.list = [];
        this.listLoading = true;
        getPageList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data ||[];
            this.total = data.total ||0;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
      } else {
        this.$message.warning({
          message: "请选择VIN码进行查询！",
          duration: 2 * 1000,
        });
      }
    },
    // 查看故障信息
    lookInfo(row) {
      this.tableRow = row;
      this.detailVisible = true;
    },
    // 查看回调
    dblclickSelect(item) {
      this.list.forEach((element) => {
        if (element.vinNo === this.tableRow.vinNo) {
          this.$set(element, "batchCode", item.carBatchCode);
          this.$set(element, "faultName", item.faultCodeName);
          this.$set(element, "faultCode", item.faultCode);
          this.$set(element, "faultType", item.faultType);
          this.$set(element, "faultLevel", item.faultLevel);
          this.$set(element, "partName", item.carPartName);
          this.$set(element, "faultStartTime", item.startTime);
          this.$set(element, "faultEndTime", item.endTime);
        }
      });
    },
    // 保存全部
    handleSaveAll() {
      let vinLists = this.list.length?JSON.parse(JSON.stringify(this.list)): []
      if(vinLists&&vinLists.length){
        vinLists.forEach(i=>{
          i.vinNo = i.vinNoTotal
        })
      }
      const postData = {
        vinList: vinLists,
      };
      saveMessage(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "保存成功",
            duration: 2 * 1000,
          });
        }
      });
    },
    // 保存
    saveInfo(row) {
      let vinLists = { ...row } || {}
      vinLists.vinNo = vinLists.vinNoTotal
      const postData = {
        vinList: [],
      };
      postData.vinList.push(vinLists);
      saveMessage(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "保存成功",
            duration: 2 * 1000,
          });
        }
      });
    },

    // 检测记录查询
    handleMonitorSearch() {
      this.$router.push({ name: "offlineCarQuery" });
    },
    // // 重置
    handleClearVIN() {
      this.listQuery = {
        vinList: [],
        pageNum: 1,
        pageSize: 10,
      };
      this.isImport=false
      this.importVinList = [];
      this.listQuery.vinList = [];
      this.vinListArr=[];
    },
  },
};
</script>

<style lang="scss" scoped>
.yesgps{
  color: #00e56c
}
.nogps{
  color: #98a3af
}
.dialogButton{
  background: #fff;
  border: 1px solid #dcdfe6;
}
.dialogButton:hover{
  color: #409eff;
  border: 1px solid #c6e2ff;
  background-color: #ecf5ff;
  i{
    color: #409eff;
  }
}
</style>
