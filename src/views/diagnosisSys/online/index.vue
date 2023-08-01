<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<el-form
					style="width:100%"
					:model="listQuery"
					:rules="rules"
					ref="formLeft"
					label-width="80px"
				>
					<el-row :gutter="10">
						<el-col :span="6">
							<!-- readonly -->
							<el-form-item label="选择车辆：" prop="vin">
								<el-input
									v-model="listQuery.vin"
									placeholder="点击进行选择车辆"
									clearable
									@click.native="selectCar($event)"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item
								label="选择分系统："
								prop="subSystemName"
								label-width="85px"
							>
								<el-input
									v-model="listQuery.subSystemName"
									placeholder="点击进行选择分系统"
									clearable
									@click.native="selectSubSystem($event)"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="选择ECU：" prop="ecu">
								<el-input
									v-model="listQuery.ecu"
									placeholder="点击进行ECU选择"
									clearable
									@click.native="selectECU($event)"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</app-search>
		<!-- 授权按钮 -->
		<app-command-btn
			slot="footer"
			:buttonList="headersLeftList"
			@click-fault="readFault"
			@click-freeze="readFreezeFrame"
			@click-clear="clearFault"
			@click-stream="readDataSteam"
			@click-writeInParts="writeInParts"
			@click-hardware="handleFilter(0)"
			@click-software="handleFilter(1)"
			@click-reprotdig="selectZhenService"
		/>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- table -->
			<app-table
				slot="table"
				:showHeader="printTableVisible"
				:isTableNumber="printTableVisible"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'operateState'">{{
						scope.row[scope.item.prop] | getOperateState
					}}</span>
					<span
						v-else-if="
							queryFaultParamList &&
								queryFaultParamList.dxIntType === 6 &&
								scope.item.prop === 'result'
						"
					>
						{{ scope.row[scope.item.prop] | getResult }}
					</span>
					<span v-else>{{ scope.row[scope.item.prop] | processData }}</span>
				</template>
			</app-table>
		</div>
		<!-- 车辆列表 -->
		<app-car-list
			:visibles.sync="carListVisible"
			:data="carData"
			@carVinno="loadCarVinno"
		/>
		<!-- ecu列表 -->
		<select-multi-ecuDialog
			:visibles.sync="ecuListVisible"
			:data="ecuList"
			@carECU="loadECU"
		/>
		<!-- 分系统 -->
		<sub-system-select
			:visibles.sync="subSystemSelectVisible"
			:carTypeId="carTypeId"
			:data="subsystemData"
			@setSubSystemName="setSubSystemName"
		/>
		<!-- 选择诊断服务 -->
		<select-diagnosis-service-drawer
			:visibles.sync="selectDiagnosisServiceVisible"
			@setDigService="setZhenService"
			:ecuList="ecuList"
			:propServiceList="serviceIdList"
		/>
		<!-- 版本号 -->
		<app-version :visibles.sync="versionVisible" :data="versionData" />
		<!-- 写入零部件 -->
		<writeInPartsDialog
			:visibles.sync="writeInPartsVisible"
			:data="carData"
			:systemData="subsystemData"
		/>
		<!-- 查看解决方案 -->
		<viewSolutionDrawer
			:visibles.sync="viewSolutionVisible"
			:data="tableRow"
			:vinNo="queryFaultParamList.vin"
		/>
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { partialForm } from "@/mixins/partialForm";
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getDxByEcuOperLog,
	exportDxByEcuOperLog,
	readSoftwareVersion,
	readHardwareVersion,
	printDxReport,
	readCarDTC,
	clearCarDTC,
	dxByECU,
	readCarStream,
	getVersion,
} from "@/api/diagnosisSys/online";
import { getDxResultDataStream } from "@/api/diagnosisSys/digLog";
import { getGuid } from "@/utils/common";
//组件
import AppCarList from "@/components/diagnosisSys/selectCarDialog";
import selectMultiEcuDialog from "@/components/diagnosisSys/selectMultiEcuDialog";
import SubSystemSelect from "@/components/diagnosisSys/selectSubSystem";
import AppVersion from "./components/versionDialog";
import writeInPartsDialog from "./components/writeInPartsDialog";
import viewSolutionDrawer from "./components/viewSolutionDrawer";
import selectDiagnosisServiceDrawer from "./components/selectDiagnosisServiceDrawer";
import digResult from "@/components/diagnosisSys/queryDigResult";
import { clearInterval } from "timers";
// util
import { duplicateRemoval } from "@/utils/base";
export default {
	name: "online",
	doNotInit: true,
	mixins: [pagingMixin, otherHeight, partialForm, getPageButton],
	components: {
		AppCarList,
		selectMultiEcuDialog,
		SubSystemSelect,
		AppVersion,
		selectDiagnosisServiceDrawer,
		digResult,
		writeInPartsDialog,
		viewSolutionDrawer,
	},
	filters: {
		getOperateState(val) {
			let operateState = "失败";
			if (val === 1) {
				operateState = "成功";
			}
			return operateState;
		},
		getResult(val) {
			let result = "失败";
			if (val === "1") {
				result = "成功";
			}
			return result;
		},
	},
	data() {
		const validateVin = (rule, value, cb) => {
			if (!this.listQuery.vin) {
				return cb(new Error("请点击选择车辆"));
			}
		};
		const validateecu = (rule, value, cb) => {
			if (!this.listQuery.ecu) {
				return cb(new Error("请点击选择ECU"));
			}
		};
		const validateSubSystemName = (rule, value, cb) => {
			if (!this.listQuery.subSystemName) {
				return cb(new Error("请点击选择分系统"));
			}
		};
		return {
			listQuery: {
				vin: "",
				ecuClassId: "",
				subSystemName: "",
				ecuId: "",
				serviceIds: "",
				ecu: "",
				serviceName: "",
			},
			viewSolutionVisible: false,
			componentAuthouizeList: [],
			showfilter: false,
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: "故障码",
					prop: "result",
					checked: true,
					width: 120,
				},
				{
					value: "故障码描述",
					prop: "content",
					checked: true,
					width: 100,
				},
				{
					value: "负响应代码",
					prop: "errorCode",
					checked: true,
					width: 100,
				},
				{
					value: "负响应描述",
					prop: "errorMessage",
					checked: true,
					width: 100,
				},
				{
					value: "诊断时间",
					prop: "responseTime",
					checked: true,
					width: 160,
				},
			],
			// 当前故障，历史故障
			tableList1: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: "故障码",
					prop: "result",
					width: 120,
					checked: true,
				},
				{
					value: "故障码描述",
					prop: "content",
					width: 120,
					checked: true,
				},
				{
					value: "负响应代码",
					prop: "errorCode",
					checked: true,
					width: 100,
				},
				{
					value: "负响应描述",
					prop: "errorMessage",
					checked: true,
					width: 100,
				},
				{
					value: "诊断时间",
					prop: "responseTime",
					checked: true,
					width: 160,
				},
			],
			// 清除故障
			tableList2: [
				{
					value: "ECU名称",
					prop: "ecuName",
					width: 120,
					checked: true,
				},

				{
					value: "是否成功",
					prop: "result",
					width: 100,
					checked: true,
				},
				{
					value: "负响应代码",
					prop: "errorCode",
					width: 120,
					checked: true,
				},
				{
					value: "负响应描述",
					prop: "errorMessage",
					width: 120,
					checked: true,
				},
				{
					value: "诊断时间",
					prop: "responseTime",
					width: 160,
					checked: true,
				},
			],
			// 冻结帧
			tableList3: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 140,
				},
				{
					value: "故障码",
					prop: "content",
					checked: true,
					width: 140,
				},
				{
					value: "内容",
					prop: "name",
					checked: true,
					width: 140,
				},
				{
					value: "结果",
					prop: "value",
					checked: true,
					width: 140,
				},
			],
			// 数据流
			tableList4: [
				{
					value: "ECU",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: "读取内容",
					prop: "digContent",
					checked: true,
					width: 120,
				},
				{
					value: "读取结果",
					prop: "digResult",
					checked: true,
					width: 120,
				},
				{
					value: "原始数据流",
					prop: "rawData",
					checked: true,
					width: 120,
				},
				{
					value: "失败描述",
					prop: "digNRCDes",
					checked: true,
					width: 140,
				},
				{
					value: "读取时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
			],
			// 硬件版本
			tableList5: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 140,
				},
				{
					value: "硬件版本号",
					prop: "wareVersion",
					checked: true,
					width: 120,
				},
				{
					value: "原始报文",
					prop: "content",
					checked: true,
					width: 140,
				},
				{
					value: "响应代码",
					prop: "resultCode",
					checked: true,
					width: 140,
				},
				{
					value: "响应描述",
					prop: "rwData",
					checked: true,
					width: 140,
				},
				{
					value: "读取时间",
					prop: "createOn",
					checked: true,
					width: 140,
				},
				{
					value: "结果",
					prop: "analysisResult",
					checked: true,
					width: 140,
				},
			],
			// 软件版本
			tableList6: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 140,
				},
				{
					value: "软件版本号",
					prop: "wareVersion",
					checked: true,
					width: 120,
				},
				{
					value: "原始报文",
					prop: "content",
					checked: true,
					width: 140,
				},
				{
					value: "响应代码",
					prop: "resultCode",
					checked: true,
					width: 140,
				},
				{
					value: "响应描述",
					prop: "rwData",
					checked: true,
					width: 140,
				},
				{
					value: "读取时间",
					prop: "createOn",
					checked: true,
					width: 140,
				},
				{
					value: "结果",
					prop: "analysisResult",
					checked: true,
					width: 140,
				},
			],
			// 诊断报告
			tableList7: [
				{
					value: "故障码",
					prop: "content",
					checked: true,
					width: 140,
				},
				{
					value: "故障描述",
					prop: "result",
					checked: true,
					width: 240,
				},
			],
			printTableVisible: true,
			activeMessage: "",
			interval: null, // 存储定时器
			carListVisible: false, //车辆列表dialog
			ecuListVisible: false, //ecu列表dialog
			subSystemSelectVisible: false, //分系统dialog
			writeInPartsVisible: false, //写入部件dialog
			selectDiagnosisServiceVisible: false, // 选择诊断服务
			versionVisible: false,
			rules: {
				vin: [{ required: true, trigger: "change", validator: validateVin }],
				ecu: [{ required: false, trigger: "change", validator: validateecu }],
				subSystemName: [
					{
						required: false,
						trigger: "change",
						validator: validateSubSystemName,
					},
				],
			},
			queryFaultParamList: {},
			queryStreamParamList: {},
			faultTitle: "",
			faultContentList: "",
			ecuList: [],
			versionData: {},
			serviceIdList: [],
			carTypeId: "",
			ecuClassId: "",
			digResultVisible: false, //查看诊断结果dialog
			digServiceId: "",
			digTitle: "", //诊断标题
			digType: "", //诊断类型
			timersjl: null, // 读取数据流设置的定时器
			carData: {},
			subsystemData: {},
			ecuData: {},
			btnFlag: "",
		};
	},
	beforeDestroy() {
		window.clearInterval(this.timersjl);
		this.timersjl = null; //清空内存
	},
	methods: {
		writeInParts() {
			this.writeInPartsVisible = true;
		},
		// 导出
		handleExport() {
			exportDxByEcuOperLog({ operateType: "" });
		},
		selectCar(event) {
			if(event.target.tagName !== 'INPUT') return 
			this.carListVisible = true;
		},
		selectECU(event) {
			if (!this.listQuery.subSystemName) {
				this.$alert("请先选择分系统", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			if(event.target.tagName !== 'INPUT') return
			this.ecuListVisible = true;
		},
		loadCarVinno(row) {
			this.listQuery.vin = row.vinNo;
			this.listQuery.vinNoTotal = row.vinNoTotal;
			this.queryFaultParamList.vin = row.vinNo;
			this.queryFaultParamList.vinNoTotal = row.vinNoTotal;
			this.carTypeId = row.carTypeId;
			this.carData = row;
			this.clearSubSystem();
			this.clearECU();
		},
		loadECU(value) {
			this.ecuList = duplicateRemoval([...value], "id");
			let ecuIds = this.ecuList.map((obj) => obj.id).join(",");
			let ecuNames = this.ecuList.map((obj) => obj.ecuName).join(",");
			this.listQuery.ecu = ecuNames;
			this.queryFaultParamList.ecuId = ecuIds;
			this.listQuery.ecuId = ecuNames;
			this.faultContentList = "";
		},
		clearSubSystem() {
			this.listQuery.subSystemName = "";
			this.listQuery.ecuClassId = "";
			this.queryFaultParamList.ecuClassId = "";
			this.ecuClassId = "";
			this.subsystemData = {};
		},
		clearECU() {
			this.listQuery.ecu = "";
			this.ecuList = [];
			this.ecuData = {};
			this.queryFaultParamList.ecuId = "";
			this.faultContentList = "";
		},
		selectSubSystem(event) {
			if (!this.listQuery.vin) {
				this.$alert("请先选择车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			if(event.target.tagName !== 'INPUT') return 
			this.subSystemSelectVisible = true;
		},
		setSubSystemName(value) {
			this.listQuery.subSystemName = value.subSystemName;
			this.listQuery.ecuClassId = value.id;
			this.queryFaultParamList.ecuClassId = value.id;
			this.ecuClassId = value.id;
			this.subsystemData = value;
			this.clearECU();
		},
		// 选择诊断报告
		selectZhenService() {
			const checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["vin", "subSystemName", "ecu"],
			});
			if (!checkLeft) {
				return;
			}
			this.selectDiagnosisServiceVisible = true;
			let serviceIds = this.listQuery.serviceIds;
			let serveiceNames = this.listQuery.serviceName;
			if (!serviceIds || !serveiceNames) {
				this.serviceIdList = [];
			} else {
				let idList = serviceIds.split(",");
				let nameList = serveiceNames.split(",");
				let services = [];
				for (let i = 0; i < idList.length; i++) {
					services.push({
						id: idList[i],
						serviceName: nameList[i],
					});
				}
				this.serviceIdList = services;
			}
		},
		setZhenService(value) {
			let serviceNames = [];
			let serviceIdList = [];
			value.forEach((r) => {
				serviceNames.push(r.serviceName);
				serviceIdList.push(r.id);
			});
			this.listQuery.serviceName = serviceNames.join(",");
			this.listQuery.serviceIds = serviceIdList.join(",");
			this.reprotdig();
		},
		// 读取故障时处理数据
		getFaultContentList(data) {
			let faultContent = "";
			if (data.length > 0) {
				let faultContentList = [];
				data.forEach((item) => {
					if (!faultContentList.includes(item.appendContent)) {
						faultContentList.push(item.appendContent);
					}
				});
				faultContent = faultContentList.join(",");
			}
			return faultContent;
		},
		//读取故障
		readFault() {
			if (!this.validateData()) {
				return;
			}
			this.queryFaultParamList.dxIntType = 2;
			this.printTableVisible = true;
			this.tableList = this.tableList1;
			this.btnFlag = 1;
			window.clearInterval(this.timersjl);
			this.currentFaultAjax(this.queryFaultParamList);
		},
		viewSolution(row) {
			if (row) this.tableRow = row;
			this.viewSolutionVisible = true;
		},
		// 当前故障ajax
		currentFaultAjax(faultParamList) {
			let faultParam = faultParamList;
			if (!faultParam || !faultParam.vin || !faultParam.dxIntType) {
				return;
			}
			this.listLoading = true;
			readCarDTC(faultParam)
				.then(({ data }) => {
					if (data.code === 0 && this.btnFlag == 1) {
						this.list = data.data;
						let dxIntType = faultParam.dxIntType;
						if (dxIntType === 2 || dxIntType === 3) {
							this.setFaultContentList(this.getFaultContentList(data.data));
						}
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.listLoading = false;
				});
		},
		//清除故障
		clearFault() {
			if (!this.validateData()) {
				return;
			}
			this.queryFaultParamList.dxIntType = 6;
			this.printTableVisible = true;
			this.tableList = this.tableList2;
			this.btnFlag = 3;
			window.clearInterval(this.timersjl);
			this.clearFaultAjax(this.queryFaultParamList);
		},
		// 当前故障，历史故障ajax
		clearFaultAjax(faultParamList) {
			let faultParam = faultParamList;
			if (!faultParam || !faultParam.vin || !faultParam.dxIntType) {
				return;
			}
			this.listLoading = true;
			clearCarDTC(faultParam)
				.then(({ data }) => {
					if (data.code === 0 && this.btnFlag == 3) {
						this.list = data.data;
						let dxIntType = faultParam.dxIntType;
						if (dxIntType === 2 || dxIntType === 3) {
							this.setFaultContentList(this.getFaultContentList(data.data));
						}
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.listLoading = false;
				});
		},
		//获取故障码
		setFaultContentList(value) {
			this.faultContentList = value;
		},
		//读取冻结帧
		readFreezeFrame() {
			if (!this.validateData()) {
				return;
			}
			if (this.faultContentList.length === 0) {
				this.$alert("请先读取故障码", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.queryFaultParamList.dxIntType = 4;
			this.queryFaultParamList.withParams = this.faultContentList;
			this.printTableVisible = true;
			this.tableList = this.tableList3;
			window.clearInterval(this.timersjl);
			let faultParam = this.queryFaultParamList;
			if (!faultParam || !faultParam.vin || !faultParam.dxIntType) {
				return;
			}
			this.btnFlag = 4;
			this.listLoading = true;
			dxByECU(faultParam)
				.then(({ data }) => {
					if (data.code === 0 && this.btnFlag == 4) {
						this.list = this.createNewData(data.data);
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.listLoading = false;
				});
		},
		// 冻结帧数据处理
		createNewData(data) {
			if (data.length === 0) {
				return;
			}
			let newData = [];
			let index = 0;
			data.forEach((r) => {
				if (!r.result) {
					let item = {};
					item.isStartMultiRow = true;
					item.rowCount = 1;
					item.ecuName = r.ecuName;
					item.content = r.content;
					item.index = index;
					item.name = "";
					item.value = r.errorMessage;
					newData.push(item);
				} else {
					let result = JSON.parse(r.result);
					let len = result.length;
					for (let i = 0; i < len; i++) {
						let item = {};
						item.isStartMultiRow = i === 0 ? true : false;
						item.rowCount = len;
						item.ecuName = r.ecuName;
						item.content = r.content;
						item.index = index;
						item.name = result[i].NAME;
						item.value = result[i].VALUE; // + result[i].UNIT
						newData.push(item);
					}
				}
				index++;
			});
			return newData;
		},
		//读取数据流
		readDataSteam() {
			if (!this.validateData()) {
				return;
			}
			this.queryFaultParamList.dxIntType = 7;
			this.queryStreamParamList = this.queryFaultParamList;
			this.printTableVisible = true;
			this.tableList = this.tableList4;
			this.btnFlag = 5;
			this.streamListAjax(this.queryFaultParamList);
		},
		// 数据流ajax
		streamListAjax(faultParamList) {
			let token = getGuid();
			let params = { ...faultParamList, ...{ token: token } };
			this.listLoading = true;
			readCarStream(params)
				.then(({ data }) => {
					if (data.code === 0 && this.btnFlag == 5) {
						this.$message.success({
							message: "命令下发成功，等待结果上报……",
							duration: 2 * 1000,
						});
						if (this.timersjl != null) {
							window.clearInterval(this.timersjl);
							this.timersjl = null; //清空内存
						}
						this.timersjl = window.setInterval(() => {
							this.get_DxResultDataStream(data.data.token);
						}, 5000);
						// }
					} else {
						this.$message.warning({
							message: data.message,
							duration: 2 * 1000,
						});
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.listLoading = false;
				});
		},
		get_DxResultDataStream(token) {
			getDxResultDataStream({ token: token }).then(({ data }) => {
				if (data.code === 0) {
					this.list = data.data.result || [];
				}
			});
		},
		// 硬件，软件版本号
		handleFilter(type) {
			this.resultStr = "";
			const checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["vin"],
			});
			if (!checkLeft) {
				return;
			}
			this.printTableVisible = true;
			// 收集传输信息
			let requestParam = {
				vin: this.listQuery.vin,
			};
			this.isTableVisible = true;
			this.exportData = {};
			this.listLoading = true;
			if (type === 1) {
				this.tableList = this.tableList6;
				this.versionTitle = "软件版本号";
				readSoftwareVersion(requestParam).then(({ data }) => {
					if (data.code === 0) {
						this.listQuery.addressA = "";
						this.listQuery.addressB = "";
						this.isShow = false;
						this.$message.success({
							message: "命令下发成功，数据上报中……",
							duration: 2 * 1000,
						});
						this.versionData = JSON.parse(data.data);
						getVersionAjax(this.versionData);
					} else {
						this.listLoading = false;
						this.$message.warning({
							message: "命令下发失败！",
							duration: 2 * 1000,
						});
					}
				});
			} else {
				this.tableList = this.tableList5;
				this.versionTitle = "硬件版本号";
				readHardwareVersion(requestParam).then(({ data }) => {
					if (data.code === 0) {
						this.listQuery.addressA = "";
						this.listQuery.addressB = "";
						this.isShow = false;
						this.$message.success({
							message: "命令下发成功，数据上报中……",
							duration: 2 * 1000,
						});
						this.versionData = JSON.parse(data.data);
						getVersionAjax(this.versionData);
					} else {
						this.listLoading = false;
						this.$message.warning({
							message: "命令下发失败！",
							duration: 2 * 1000,
						});
					}
				});
			}
		},
		getVersionAjax(item) {
			let i = 0;
			//开始定时
			this.interval = setInterval(() => {
				//判断是否拿到所有报文。拿到所有报文后停止请求
				const data = {
					token: item.token,
					pageNum: 1,
					pageSize: 100,
				};
				// 请求报文数据
				getVersion(data)
					.then(({ data }) => {
						if (data.data) {
							let temp = [];
							temp = [...this.list];
							this.list = data.data;
							if (temp.length == this.list.length) {
								i++;
								if (i == 10) {
									clearInterval(this.interval);
									this.$message.success({
										message: "数据上报完毕",
										duration: 2 * 1000,
									});
								}
							} else {
								i = 0;
							}
						} else {
							i++;
							if (i == 10) {
								this.$message.warning({
									message: "暂无数据",
									duration: 2 * 1000,
								});
								clearInterval(this.interval);
							}
						}
						this.listLoading = false;
					})
					.catch((error) => {
						this.listLoading = false;
						this.$message.warning({
							message: "数据上报失败！",
							duration: 2 * 1000,
						});
					});
			}, 3000);
		},
		// 诊断报告
		reprotdig() {
			if (!this.validateData2()) {
				return;
			}
			this.listLoading = true;
			this.printTableVisible = false;
			this.tableList = this.tableList7;
			this.btnFlag = 6;
			window.clearInterval(this.timersjl);
			let requestParam = {
				vin: this.listQuery.vin,
				ecuId: this.queryFaultParamList.ecuId,
				ecuClassId: this.queryFaultParamList.ecuClassId,
				serviceIds: this.listQuery.serviceIds,
			};
			this.isTableVisible = true;
			this.exportData = {};
			printDxReport(requestParam)
				.then(({ data }) => {
					if (data.code === 0 && this.btnFlag == 6) {
						let dList = data.data.dtcList;
						let readList = data.data.readList;
						const dCount = dList.length;
						const readCount = readList.length;
						if (dCount === 0 && readCount === 0) {
							this.listLoading = false;
							return;
						}
						if (dCount === 0) {
							dList = [{ content: "暂无数据", result: "" }];
						}
						if (readCount === 0) {
							readList = [{ content: "暂无数据", result: "" }];
						}
						this.exportData = {
							vin: this.listQuery.vin,
							ecuName: this.listQuery.ecu,
							dtcCount: dCount,
							readCount: readCount,
							dtcList: dList,
							readList: readList,
						};
						let param = [
							{
								content:
									"诊断车辆：" +
									this.listQuery.vin +
									";诊断ECU：" +
									this.listQuery.ecu,
								result: "故障码数量：" + dCount + ";读取数量：" + readCount,
							},
							{
								result: "故障码",
								content: "故障描述",
							},
						];
						let title = [
							{
								content: "读取内容",
								result: "读取结果",
							},
						];
						this.list = [...param, ...dList, ...title, ...readList];
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.listLoading = false;
				});
		},

		validateData() {
			const checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["vin"],
			});
			return checkLeft;
		},
		validateData2() {
			const checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["vin", "subSystemName", "ecu"],
			});
			return checkLeft;
		},
		reset() {
			this.ecuList = [];
			this.handleClear();
		},
		queryResult(row) {
			this.digServiceId = row.token;
			this.digResultVisible = true;
			let title = row.operateModule;
			let type = "";
			switch (row.operateModule) {
				case "清除整车故障":
					title = "清除整车故障";
					type = "8";
					break;
				case "读取当前故障":
					type = "2";
					break;
				case "读取历史故障":
					type = "3";
					break;
				case "读取冻结帧":
					type = "4";
					break;
				case "读取整车数据流":
					type = "7";
					break;
			}
			title += "结果";
			this.digTitle = title;
			this.digType = type;
		},
	},
};
</script>

<style lang="scss" scoped></style>
