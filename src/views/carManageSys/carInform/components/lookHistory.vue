<template>
  <app-drawer
    :visibles="visibles"
    :title="'车辆详情'"
    :wrapperClosable="true"
    width="55%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
    :loading="loading"
  >
    <div slot="drawerContent">
      <el-tabs v-model="activeName">
        <el-tab-pane label="车辆基本信息" name="1">
          <div class="boxList"> 
           <app-item-pance :list="data1List" :number="2" :left-width="'110'" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="终端信息" name="2">
          <div class="boxList"> 
           <app-item-pance :list="data1List1" :number="2" :left-width="'130'" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="终端换绑记录" name="3">
          <!-- table -->
          <div class="section-wrap">
            <app-table
              slot="table"
              :isTableSelection="false"
              :list="list"
              :listLoading="listLoading"
              :filterTableList="filterTableList"
              :tableHeights="tableHeight -105"
              :pageObj="listQuery"
              :total="total"
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
        </el-tab-pane>
        <el-tab-pane label="SIM信息" name="4">
          <div class="boxList">
           <app-item-pance :list="data1List2" :number="2" :left-width="'100'" />
          </div>
          <div class="boxList" style="margin-top:10px;">
           <app-item-pance :list="data1List2s" :number="2" :left-width="'100'" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import AppItemPance from "@/components/itemPance";
// request
import { getCarHistory,getTerminalSim,getCarDetails } from "@/api/carManageSys/carInform";

export default {
  doNotInit: true,
  name: "lookHistory",
  components: { AppItemPance },
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
    vehicleTypeList:{
      type:Array,
      default: () => ([]),
    }
  },
  data() {
    return {
      listQuery: {},
      formInfo: {},
      dataObject:{},
      activeName: "1",
      loading:false,
      data1List: [],
      data1List1: [],
      data1List2: [],
      data1List2s: [],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width: 180,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width: 220,
        },
        {
          value: "开始时间",
          prop: "startTime",
          width: 140,
          checked: true,
        },
        {
          value: "结束时间",
          prop: "endTime",
          width: 140,
          checked: true,
        },
      ],
    };
  },
  computed: {
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listQuery.carId = this.data.carId;
        this.formInfo = { ...this.data };
        this.listLoad();
        const params={
          terminalId:this.data.terminalId?this.data.terminalId:'',
          machineId:this.data.machineId?this.data.machineId:''
        }
        this.loading=true
        getTerminalSim(params).then(({ data }) => {
          if (data.code === 0) {
            this.dataObject=data.data||{}
          }
       }).finally(() => {
          const {
              vinNo,
              brand,
              sensitiveLicensePlate,
              productTypeNumber,
              carAlias,
              barCode,
              // iccid,
              dataSource,
              createdOn,
              // simNumber,
              // carrierType,
              // activationStatus,
              carTypeName,
              carBatchCode,
              vehicleTypeId,
              areaName,
              companyName,
              // rtmSaleStatus,
              createdBy,
              powerPartNumber,
              driverPartNumber,
              terminalCode,
              firmware,
              fullDbcName,
              checkDbcStatus,
              mpuVersion,
              mpuAppVersion,
              // terminalType              
            } = this.formInfo;
            // const rtmSaleStatusValue =
            //   rtmSaleStatus == "XT"
            //     ? "销售退货"
            //     : rtmSaleStatus == "XS"
            //     ? "实销"
            //     : rtmSaleStatus == "DK"
            //     ? "经销商在库"
            //     : rtmSaleStatus == "TC"
            //     ? "总部出库"
            //     : rtmSaleStatus == "ZT"
            //     ? "在途"
            //     : rtmSaleStatus == "ZZ"
            //     ? "总部在库"
            //     : "-";
            const createNameValue =
              createdBy 
                ? createdBy
                : "-";
            const carrierTypeValue =
              this.dataObject.carrierTypeOne == 1
                ? "移动"
                : this.dataObject.carrierTypeOne == 2
                ? "联通"
                : "-";
            const carrierTypeValue2 =
              this.dataObject.carrierTypeTwo== 1
                ? "移动"
                : this.dataObject.carrierTypeTwo== 2
                ? "联通"
                : "-";
            const dataSourceValue =
              dataSource == 0
                ? "平台录入"
                : dataSource == 2
                ?"MES同步":
                '-';
            const vehicleTypeIdValue =
              this.vehicleTypeList &&
              this.vehicleTypeList.length &&
              this.vehicleTypeList.find((item) => item.value == vehicleTypeId)
                ? this.vehicleTypeList.find(
                    (item) => item.value == vehicleTypeId
                  ).label
                : "-"
            this.data1List = [
              { name: "VIN码", value: vinNo ? vinNo : "-" },
              { name: "整车物料号", value: carAlias ? carAlias : "-" },
              { name: "车牌号码", value: sensitiveLicensePlate ? sensitiveLicensePlate : "-" },    
              { name: "车型名称", value: carTypeName ? carTypeName : "-" },
              { name: "项目代号", value: carBatchCode ? carBatchCode : "-" },
              { name: "车辆类型", value: vehicleTypeIdValue ? vehicleTypeIdValue : "-" },
              { name: "使用区域", value: areaName ? areaName : "-" },
              { name: "使用单位", value: companyName ? companyName : "-" },
              // { name: "销售状态", value: rtmSaleStatusValue ? rtmSaleStatusValue : "-" },
              {
                name: "产品型号",
                value: productTypeNumber ? productTypeNumber : "-",
              },
              { name: "品牌", value: brand? brand : "-" },
              { name: "数据来源", value: dataSourceValue ? dataSourceValue : "-" },
              { name: "创建人", value: createNameValue ? createNameValue : "-" },
              { name: "创建时间", value: createdOn ? createdOn : "-" },
              { name: "动力电池编码", value: powerPartNumber ? powerPartNumber : "-" },
              { name: "驱动电机编码", value: driverPartNumber ? driverPartNumber : "-" },
            ];
            this.data1List1 = [
              { name: "终端编号", value: terminalCode ? terminalCode : "-" },
              { name: "TBOXSN", value: barCode ? barCode : "-" },
              { name: "固件版本", value: firmware ? firmware : "-" },
              { name: "DBC文件名", value: fullDbcName ? fullDbcName : "-" },
              { name: "DBC检测结果", value: checkDbcStatus? checkDbcStatus : "-" },
              { name: "MPU固件版本号", value: mpuVersion ? mpuVersion : "-" },
              { name: "MPU APP版本号", value: mpuAppVersion ? mpuAppVersion : "-" },
              // { name: "TBOX供应商", value: terminalTypeValue ? terminalTypeValue : "-" },
            ];
            this.data1List2 = [
              { name: "手机号码", value: this.dataObject.simNumberOne ? this.dataObject.simNumberOne : "-" },
              { name: "ICCID", value: this.dataObject.iccidOne ? this.dataObject.iccidOne : "-" },
              { name: "运营商", value: carrierTypeValue ? carrierTypeValue : "-" },
              { name: "创建人", value: this.dataObject.createdByOne? this.dataObject.createdByOne: "-" },
              { name: "创建时间", value: this.dataObject.createdOnOne? this.dataObject.createdOnOne: "-" },
            ];
            this.data1List2s = [
              { name: "手机号码", value: this.dataObject.simNumberTwo ? this.dataObject.simNumberTwo : "-" },
              { name: "ICCID", value: this.dataObject.iccidTwo ? this.dataObject.iccidTwo : "-" },
              { name: "运营商", value: carrierTypeValue2 ? carrierTypeValue2 : "-" },
              { name: "创建人", value: this.dataObject.createdByTwo? this.dataObject.createdByTwo: "-" },
              { name: "创建时间", value: this.dataObject.createdOnTwo? this.dataObject.createdOnTwo: "-" },
            ];
          
          getCarDetails({carId:this.data.carId}).then(({ data }) => {
            this.loading=false
            if (data.code === 0) {
                let checkDbcStatus = data.data&&data.data.checkDbcStatus?data.data.checkDbcStatus:'-'
                let fullDbcName = data.data&&data.data.fullDbcName?data.data.fullDbcName:'-'
                this.data1List1.forEach(i => {
                  if(i.name=="DBC检测结果"){
                    i.value=checkDbcStatus
                  }
                  if(i.name=="DBC文件名"){
                    i.value=fullDbcName
                  }
                });
                console.log(checkDbcStatus,"checkDbcStatus",fullDbcName,this.data1List1)
              }
          })
      })
      }
    },
  },
  mounted() {},
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
    lookDetail() {},
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      getCarHistory(this.listQuery)
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
      this.activeName = "1";
      this.data1List = [];
      this.data1List1 = [];
      this.data1List2 = [];
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>
::v-deep .el-tabs__item{
  line-height: unset;
}
</style>
