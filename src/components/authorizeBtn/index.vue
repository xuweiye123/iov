<!--

  按钮权限
  <app-authorize-button
  @click-add="fn"
   />
   attributes:
    customClass
   method:
     click-add
     click-update
     click-delete
     click-export
     click-filter
-->
<template>
  <div :class="[customClass, 'add-btn']">
    <slot name="left">
      <div class="add-btn-left">
        <div v-for="(item, index) in leftBtn" :key="index">
          <div
            style="margin: 0 8px"
            @mouseenter="enterSvgOpen(index)"
            @mouseleave="enterSvgClose(index)"
          >
            <!-- 去掉空的判断&&this.total>0 -->
            <!-- <el-dropdown trigger="click" v-if="this.data.filter((item) =>item.url === 'export').length>0" @command="btnClick">
              <el-button style="margin-right:10px">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="this.multipleSelection.length===0" command="export">导出选中</el-dropdown-item>
                <el-dropdown-item command="exportAll">导出查询结果</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-button
              v-waves
              class="filter-item"
              size="mini"
              :type="
                item.icon == 'ic_add' || item.icon == 'addTask'
                  ? 'primary'
                  : 'info'
              "
              @click="btnClick(item.buttonevent || item.url)"
            >
              <i
                :class="'iconfont icon-' + item.icon"
                style="font-size: 12px !important;"
              ></i>
              <span style="margin-left:3px">{{ item.functionName }}</span>
            </el-button>
            <slot name="btn-info"></slot>
          </div>
        </div>
      </div>
    </slot>

    <slot name="right">
      <div v-show="showRightButton" class="add-btn-right">
        <div v-for="(item, index) in rightBtn" :key="index">
          <div
            style="margin: 0 8px"
            @mouseenter="enterSvgOpen(index + 100)"
            @mouseleave="enterSvgClose(index + 100)"
          >
            <!-- type="text"  -->
            <el-button
              v-waves
              class="filter-item"
              type="info"
              size="mini"
              :loading="item.url == 'export' ? exportLoading : false"
              @click.stop="btnClick(item.url)"
            >
              <i
                :class="'iconfont icon-' + item.icon"
                style="font-size: 12px !important;"
              ></i>
              <span style="margin-left:3px">{{ item.functionName }}</span>
            </el-button>
          </div>
        </div>
        <slot name="check-filter" />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "AuthorizeBtn",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    buttonLeft: {
      type: Array,
      default: () => [],
    },
    buttonRight: {
      type: Array,
      default: () => [],
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    customClass: {
      type: String,
      default: "",
    },
    showRightButton: {
      type: Boolean,
      default: true,
    },
    showRightMore: {
      type: Boolean,
      default: true,
    },
    exportLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enterSvg: false,
      chooseIndex: 999,
    };
  },
  mounted() {
  },
  computed: {
    leftBtn() {
      if (this.data.length > 0) {
      return this.data.filter(
          (item) =>
            item.url != "export" &&
            item.url != "exportData" &&
            // item.url != "exportright" &&
            item.url != "setInterval" &&
            item.url != "rightUpdate" &&
            item.url != "search"
        );
      } else {
        if (this.buttonLeft.length === 0) return [];
        return this.buttonLeft;
      }
      // return this.data.filter(item => item.isShow && (item.url != 'export' && item.url != 'import' && item.url!='setInterval' && item.url!='rightUpdate' && item.url!='search'))
    },
    rightBtn() {
      let filterRB = [];
      if (this.data.length > 0) {
        filterRB = this.data.filter(
          (item) =>
            item.url === "setInterval" ||
            item.url === "rightUpdate" ||
            item.url === "export" ||
            // item.url === "exportright" ||
            item.url === "exportData" ||
            item.url === "search"
        );
        if (this.showRightMore) {
          filterRB.push({
            functionName: "更多",
            url: "FILTER",
            icon: "more",
            iconType: 2,
          });
        }
        return filterRB;
      } else {
        if (this.buttonRight.length === 0) {
          if (this.showRightMore) {
            return [
              {
                functionName: "更多",
                url: "FILTER",
                icon: "more",
                iconType: 2,
              },
            ];
          }
        } else {
          filterRB = [...this.buttonRight];
          if (this.showRightMore) {
            filterRB.push({
              functionName: "更多",
              url: "FILTER",
              icon: "more",
              iconType: 2,
            });
          }
          return filterRB;
        }
      }
    },
    lang() {
      return this.$store.getters.language;
    },
    activeName() {
      return this.$store.state.theme.activeName;
    },
  },
  methods: {
    enterSvgOpen(index) {
      this.enterSvg = true;
      this.chooseIndex = index;
    },
    enterSvgClose(index) {
      this.enterSvg = false;
      this.chooseIndex = index;
    },
    // allbtnMethods
    btnClick(type) {
      // console.log(type)
      switch (type.toUpperCase()) {
        case "CREATE":
          this.handleAdd();
          break;
        case "UPDATE":
          this.handleUpdate();
          break;
        case "DELETE":
          this.handleDelete();
          break;
        case "EXPORT":
          this.handleExport();
          break;
        case "EXPORTLEFT":
          this.handleExport();
          break;
        case "EXPORTALL":
          this.handlExportAll();
          break;
        case "IMPORT":
          this.handleImport();
          break;
        case "RIGHTUPDATE":
          this.handleRightUpdate();
          break;
        case "FILTER":
          this.handlFilter();
          break;
        case "APPROVAL":
          this.handleApproval();
          break;
        case "CLEAR":
          this.handleClear();
          break;
        case "IMPORTSELECT":
          this.handleImportSelect();
          break;
        case "USERFUNCPERMISSON":
          this.handleUserFuncPermisson();
          break;
        case "USERCARPERMISSON":
          this.handleUserCarPermisson();
          break;
        case "REFRESHPASSWORD":
          this.handleUpDatePassWord();
          break;
        case "PARTTIMEJOB":
          this.handlePartTimeJob();
          break;
        case "REFRESHLIST":
          this.handleRefreshList();
          break;

        case "LOOKDICTIONARY":
          this.handleLookDictionary();
          break;
        case "BINDSIM":
          this.bindSim();
          break;
        case "BINDTERMINALSIM":
          this.bindTerminalSim();
          break;
        case "BINDIMPROVE":
          this.bindImprove();
          break;
        case "BINDHISTORY":
          this.lookBindHistory();
          break;
        case "TERMINALREPLACE":
          this.terminalReplace();
          break;
        case "VEHICLECAR":
          this.handlevehicleCar();
          break;
        case "SWITCHCAR":
          this.handleSwitchCar();
          break;
        case "ADDCHILDREN":
          this.handleAddChildren();
          break;
        case "ADDPEOPLE":
          this.handleAddPeople();
          break;
        case "DETAILPEOPLE":
          this.handleDetailPeople();
          break;
        case "TESTING":
          this.handleTesting();
          break;
        case "DETAILCAR":
          this.handleDetailCar();
          break;
        case "MONITORSEARCH":
          this.handleMonitorSearch();
          break;
        case "GETCANFILE":
          this.handleGetCanFile();
          break;
        case "CANUPDATE":
          this.handleCanUpdate();
          break;
        case "DOWNLOADFILE":
          this.handleDownLoadFile();
          break;
        case "LOOKDOWNLOAD":
          this.handleLookDownload();
          break;
        case "SETCAR":
          this.setCarHandle();
          break;
        case "SETORDINARYTASK":
          this.handledsetCommonTask();
          break;
        // setEmergencyTask
        case "SETEMERGENCYTASK":
          this.handledsetSelfTask();
          break;
        case "LOOKBOOK":
          this.handleLookBook();
          break;
        case "ADDTASK":
          this.handleAddTask();
          break;
        case "DELETETASK":
          this.handleDeleteTask();
          break;
        case "ALLCHECK":
          this.handleAllCheck();
          break;
        case "SETPARAM":
          this.handleSetParam();
          break;
        case "CARNUMBERIMPORT":
          this.handleCarNumberImport();
          break;
        case "POWERIMPORT":
          this.handlePowerImport();
          break;
        case "FLOWIMPORT":
          this.handleFlowImport();
          break;
        case "SAVE":
          this.handleSave();
          break;
        case "SAVEALL":
          this.handleSaveall();
          break;
        case "LOOK":
          this.handleLook();
          break;
        case "LOOKHISTORY":
          this.handleLookHistory();
          break;
        case "RENEW":
          this.handleRenew();
          break;
        case "BATCHRENEW":
          this.handleBatchRenew();
          break;
        case "DOWNLOADFILELOG":
          this.handDownloadFileLog();
          break;
        case "SETFAULTCODE":
          this.handSetFaultCode();
          break;
        case "SETFAULTCAR":
          this.handSetFaultCar();
          break;
        case "SETFAULTRULE":
          this.handSetFaultRule();
          break;
        case "SEEPUSHLOG":
          this.handSeePushLog();
          break;
        case "SEETASK":
          this.handleSeeTask();
          break;
        case "SEEPACKAGE":
          this.handleSeePackage();
          break;
        case "TODEALWITH":
          this.handtoDealWith();
          break;
        case "VIEWHISTORY":
          this.handViewHistory();
          break;
        case "SETBATTERYPACK":
          this.handSetBatteryPack();
          break;
        case "SETALLBATTERYPACK":
          this.handSetAllBatteryPack();
          break;
        case "EXPORTDATA":
          this.handExportData();
          break;
        case "CREATOUTRULE":
          this.handCreatOutRule();
          break;
        case "CREATINRULE":
          this.handCreatInRule();
          break;
        case "OVERSPEEDALARMDETAIL":
          this.handleoverspeeddetail();
          break;
        case "SETODOMILEAGE":
          this.handSetODOmileage();
          break;
        case "CALCULATE":
          this.handCalculate();
          break;
        case "RESTRICTIONS":
          this.handRestrictions();
          break;
        case "REMOVERESTRICTIONS":
          this.handRemoveRestrictions();
          break;
        case "LIMITFASTCHARGING":
          this.handLimitFastCharging();
          break;
        case "LIMITCHARGINGON":
          this.handLimitChargingOn();
          break;
        case "LIMITCHARGINGOFF":
          this.handLimitChargingOFF();
          break;
        case "LOOKDETAILS":
          this.handLookDetails();
          break;
        case "ADDMULTITASK":
          this.handleBatchAddTask();
          break;
        case "OPERTODAYSCATTERMAP":
          this.handleOperTodayScatterMap();
          break;
        case "OPERLASTWEEKSCATTERMAP":
          this.handleOperLastWeekScatterMap();
          break;
        case "OPERUNBIND":
          this.handleoperUnBind();
          break;
        case "OPERHISTORY":
          this.handleoperHistory();
          break;
        case "OPERIMPORTCARS":
          this.handleoperImportCars();
          break;
        case "OPERIMPORTAREAS":
          this.handleoperImportAreas();
          break;
        case "OPERDOWNLOADODOHELP":
          this.handleoperDownloadODOHelp();
          break;
        case "DELETECAR":
          this.handledeleteCar();
          break;
        case "EXPORTQUERY":
          this.handexportquery();
          break;
        case "SEETRIP":
          this.handeSeeTrip();
          break;
        case "SEEELETRIC":
          this.handeSeeEletric();
          break;
        case "CHARGEDIAGRAM":
          this.handeChargeDiagram();
          break;
        case "POWERDIAGRAM":
          this.handePowerDiagram();
          break;
        case "PACKAGING":
          this.handePackaging();
          break;
        case "UPLOAD":
          this.handleUploadFile();
          break;
        case "ANALYSIS":
          this.handleAnalysis();
          break;
        case "ZHUXIAO":
          this.handleZhuxiao();
          break;
        case "ALARMLOG":
          this.handleAlarmLog();
          break;
        case "REFRESH":
          this.handleRefresh();
          break;
        case "TIMEDREFRESH":
          this.handleTimedRefresh();
          break;
        case "TASKDETAILS":
          this.handleTaskDetails();
          break;
        case "CARSTATUSSEARCH":
          this.handleCarStatusSearch();
          break;
        case "OPENFORWARD":
          this.handleOpenForward();
          break;
        case "STOPFORWARD":
          this.handleStopForward();
          break;
        case "BATCHOPENFORWARD":
          this.handleBatchOpenForward();
          break;
        case "BATCHSTOPFORWARD":
          this.handleBatchStopForward();
          break;
        case "BATCHDELETEFORWARD":
          this.batchDeleteForward();
          break;
        case "OFFLINEEXPORT": 
          this.handleOfflineExport();
          break;
        case "LOOKEXPORTTASK":
          this.handleLookExportTask();
          break;
        case "LOOKIMPORTTASK":
          this.handleLookImportTask();
          break;
        case "RECOMBINATION":
          this.handlerecombination();
          break;
        case "UPLOADRECORD":
          this.handleUploadRecord();
          break;
        case "FLINKRULEENTITY":
          this.handleFLinkRuleEntity();
          break;
        case "IMPORTCAR":
          this.handleImportCar();
          break;
        case "FILEUPLOAD":
          this.handleFileUpload();
          break;
      }
    },
    // 新增
    handleAdd() {
      this.$emit("click-add");
    },
    // 编辑
    handleUpdate() {
      this.$emit("click-update");
    },
    // 删除
    handleDelete() {
      this.$emit("click-delete");
    },
    // 导出
    handleExport() {
      this.$emit("click-export");
    },
    // 导出全部
    handlExportAll() {
      this.$emit("click-export-all");
    },
    handleSearch() {
      this.$emit("click-search");
    },
    // 导入
    handleImport() {
      this.$emit("click-import");
    },
    // 更新
    handleRightUpdate() {
      this.$emit("click-right-import");
    },
    // 过滤
    handlFilter() {
      this.$emit("click-filter");
    },
    // 清空
    handleClear() {
      this.$emit("click-clear");
    },
    // 文件上传
    handleUploadFile() {
      this.$emit("click-upload");
    },
    //配置故障码
    handSetFaultCode() {
      this.$emit("click-setFaultCode");
    },
    //配置车辆
    handSetFaultCar() {
      this.$emit("click-setFaultCar");
    },
    //配置故障规则
    handSetFaultRule() {
      this.$emit("click-setFaultRule");
    },
    //查看推送日志
    handSeePushLog() {
      this.$emit("click-seePushLog");
    },
    //导入查询
    handleImportSelect() {
      this.$emit("click-import-select");
    },
    // 审核
    handleApproval() {
      this.$emit("click-approval");
    },
    // 查看用户功能权限
    handleUserFuncPermisson() {
      this.$emit("click-user-func-perimssion");
    },
    // 查看用户车辆权限
    handleUserCarPermisson() {
      this.$emit("click-user-car-perimssion");
    },
    // 重设密码
    handleUpDatePassWord() {
      this.$emit("click-updatepwd");
    },
    // 兼职岗位
    handlePartTimeJob() {
      this.$emit("click-part-time-job");
    },
    // 刷新列表
    handleRefreshList() {
      this.$emit("click-refresh-list");
    },
    // 查看字典子项
    handleLookDictionary() {
      this.$emit("click-lookDictionary");
    },
    // 绑定Sim
    bindSim() {
      this.$emit("click-bind-sim");
    },
    // 终端导入&绑定sim
    bindTerminalSim() {
      this.$emit("click-bind-terminal-sim");
    },
    // 审核
    bindImprove() {
      this.$emit("click-bind-improve");
    },
    // 查看绑定记录
    lookBindHistory() {
      this.$emit("click-carBindHistory");
    },
    // 终端换绑
    terminalReplace() {
      this.$emit("click-terminalReplace");
    },
    //解除绑定
    handleoperUnBind() {
      this.$emit("click-operUnBind");
    },
    // 报废车辆处置
    handlevehicleCar() {
      this.$emit("click-vehicleCar");
    },
    // 商品车转换
    handleSwitchCar() {
      this.$emit("click-switchCar");
    },
    // 新增子字典项
    handleAddChildren() {
      this.$emit("click-add-child");
    },
    // 新增单位联系人
    handleAddPeople() {
      this.$emit("click-add-people");
    },
    // 查看单位联系人
    handleDetailPeople() {
      this.$emit("click-detail-people");
    },
    // 检测
    handleTesting() {
      this.$emit("click-testing");
    },
    // 查看车辆信息
    handleDetailCar() {
      this.$emit("click-detailCar");
    },
    // 检测记录查询
    handleMonitorSearch() {
      this.$emit("click-monitorSearch");
    },
    // 获取can报文目录
    handleGetCanFile() {
      this.$emit("click-getCanFile");
    },
    // can立即更新
    handleCanUpdate() {
      this.$emit("click-canUpdate");
    },
    // 下载文件
    handleDownLoadFile() {
      this.$emit("click-downLoadFile");
    },
    // 查看下载明细
    handleLookDownload() {
      this.$emit("click-lookDownload");
    },
    // 设置车辆
    setCarHandle() {
      this.$emit("click-setCar");
    },
    // 设置普通任务
    handledsetCommonTask() {
      this.$emit("click-setCommonTask");
    },
    // 设置紧急任务
    handledsetSelfTask() {
      this.$emit("click-setSelfTask");
    },
    // 查看说明书
    handleLookBook() {
      this.$emit("click-look-book");
    },
    // 添加任务
    handleAddTask() {
      this.$emit("click-add-task");
    },
    // 添加批量任务
    handleBatchAddTask() {
      this.$emit("click-batch-addtask");
    },
    // 删除任务
    handleDeleteTask() {
      this.$emit("click-delete-task");
    },
    // 一键全选
    handleAllCheck() {
      this.$emit("click-allCheck");
    },
    // 设置参数权限
    handleSetParam() {
      this.$emit("click-setParam");
    },
    // 车牌号导入
    handleCarNumberImport() {
      this.$emit("click-carNumberImport");
    },
    // 动力电池信息导入
    handlePowerImport() {
      this.$emit("click-powerImport");
    },
    // 流量导入
    handleFlowImport() {
      this.$emit("click-flowImport");
    },
    // 保存
    handleSave() {
      this.$emit("click-save");
    },
    // 保存全部
    handleSaveall() {
      this.$emit("click-saveAll");
    },
    // 查看
    handleLook() {
      this.$emit("click-look");
    },
    // 查看历史记录
    handleLookHistory() {
      this.$emit("click-lookHistory");
    },
    //续费
    handleRenew() {
      this.$emit("click-renew");
    },
    //批量续费
    handleBatchRenew() {
      this.$emit("click-batchRenew");
    },
    //下载
    handDownloadFileLog() {
      this.$emit("click-downloadFileLog");
    },
    //查看任务详情
    handleSeeTask() {
      this.$emit("click-seeTask");
    },
    //查看命令包
    handleSeePackage() {
      this.$emit("click-seePackage");
    },
    //处置
    handtoDealWith() {
      this.$emit("click-to-dealwith");
    },
    //查看历史记录
    handViewHistory() {
      this.$emit("click-view-history");
    },
    //配置电池包
    handSetBatteryPack() {
      this.$emit("click-setBatteryPack");
    },
    //配置所有电池包
    handSetAllBatteryPack() {
      this.$emit("click-setAllBatteryPack");
    },
    //导出记录
    handExportData() {
      this.$emit("click-exportData");
    },
    //新增场外规则
    handCreatOutRule() {
      this.$emit("click-creatOutRule");
    },
    //新增场内规则
    handCreatInRule() {
      this.$emit("click-creatInRule");
    },
    handleoverspeeddetail() {
      this.$emit("click-overspeeddetail");
    },
    //设置ODO里程
    handSetODOmileage() {
      this.$emit("click-setODOmileage");
    },
    //计算
    handCalculate() {
      this.$emit("click-calculate");
    },
    //限行
    handRestrictions() {
      this.$emit("click-restrictions");
    },
    //解除限行
    handRemoveRestrictions() {
      this.$emit("click-removeRestrictions");
    },
    //限制快充ODO里程
    handLimitFastCharging() {
      this.$emit("click-limitFastCharging");
    },
    //限制充电ODO里程
    handLimitChargingOn() {
      this.$emit("click-limitChargingOn");
    },
    //解除充电限制
    handLimitChargingOFF() {
      this.$emit("click-limitChargingOFF");
    },
    //查看变更明细
    handLookDetails() {
      this.$emit("click-lookDetails");
    },
    //每日充电散点图
    handleOperTodayScatterMap() {
      this.$emit("click-operTodayScatterMap");
    },
    //最近一周充电散点图
    handleOperLastWeekScatterMap() {
      this.$emit("click-operLastWeekScatterMap");
    },
    //查看历史轨迹
    handleoperHistory() {
      this.$emit("click-operHistory");
    },
    //车辆导入
    handleoperImportCars() {
      this.$emit("click-operImportCars");
    },
    //车辆区域导入
    handleoperImportAreas() {
      this.$emit("click-operImportAreas");
    },
    // ODO里程计算说明书及指导文档
    handleoperDownloadODOHelp() {
      this.$emit("click-operDownloadODOHelp");
    },
    //删除车辆
    handledeleteCar() {
      this.$emit("click-deleteCar");
    },
    // 导出查询
    handexportquery() {
      this.$emit("click-exportQuery");
    },
    //查看推送行程
    handeSeeTrip() {
      this.$emit("click-seeTrip");
    },
    //查看充电推送
    handeSeeEletric() {
      this.$emit("click-seeEletric");
    },
    // 查看充电热力图
    handeChargeDiagram() {
      this.$emit("click-chargeDiagram");
    },
    // 查看换电热力图
    handePowerDiagram() {
      this.$emit("click-powerDiagram");
    },
    // 打包
    handePackaging() {
      this.$emit("click-packaging");
    },
    //解析
    handleAnalysis() {
      this.$emit("click-analysis");
    },
    //注销
    handleZhuxiao() {
      this.$emit("click-zhuxiao");
    },
    //报警日志
    handleAlarmLog() {
      this.$emit("click-alarmLog");
    },
    //刷新
    handleRefresh() {
      this.$emit("click-refresh");
    },
    //定时刷新
    handleTimedRefresh() {
      this.$emit("click-timedRefresh");
    },
    //查看详情 
    handleTaskDetails() {
      this.$emit("click-taskDetails");
    },
    //离线导出
    handleOfflineExport() {
      this.$emit("click-offlineExport");
    },
     //查看导出任务
    handleLookExportTask() {
      this.$emit("click-look-export-task");
    },
    //查看导入任务
    handleLookImportTask() {
      this.$emit("click-look-import-task");
    },
    //车辆状态查询
    handleCarStatusSearch() {
      this.$emit("click-carStatusSearch");
    },
    // 开启转发
    handleOpenForward() {
      this.$emit("click-openForward");
    },
    // 停止转发
    handleStopForward() {
      this.$emit("click-stopForward");
    },
    // 批量开启转发
    handleBatchOpenForward() {
      this.$emit("click-batchOpenForward");
    },
    // 批量停止转发
    handleBatchStopForward() {
      this.$emit("click-batchStopForward");
    },
    // 批量停止转发
    batchDeleteForward() {
      this.$emit("click-batchDeleteForward");
    },
    //导入（重组）
    handlerecombination() {
      this.$emit("click-recombination");
    },
    //批量导入
    handleImportCar() {
      this.$emit("click-import-car");
    },
    //添加链路规则
    handleFLinkRuleEntity() {
      this.$emit("click-fLinkRuleEntity");
    },
    //上传记录
    handleUploadRecord(){
      this.$emit("click-uploadRecord");
    },
    //配置文件上传
    handleFileUpload(){
      this.$emit("click-fileUpload");
    }
  },
};
</script>
<style lang="scss" scoped>
svg {
  font-size: 12px;
}
ul {
  margin: 0;
}
.add-btn-right .el-button--small {
  padding: 8px 10px;
  font-size: 12px;
  color: #515c60;
}
.add-btn-right .el-button--small:hover {
  background: #fff;
  border: 1px solid #fff;
}
.authouize-info {
}
</style>
