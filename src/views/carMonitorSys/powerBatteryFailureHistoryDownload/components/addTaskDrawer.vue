<template>
	<app-drawer
		:visibles.sync="visibles"
		width="55%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="true"
		:title="'添加任务'"
		:isFooter="true"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form ref="formCenter" :model="formInfo" :rules="rules"  :label-position="'right'" label-width="70px">
				<el-row type="flex" justify="start" align="top">
					<el-col :span="11">
						<el-form-item label="任务名称：" prop="taskName">
							<el-input
								v-model="formInfo.taskName"
								maxlength="50"
								placeholder="请输入任务名称"
								clearable
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="10">
						<el-form-item label="电池编码：" prop="carStr">
							<div style="position:relative;">
								<div
									style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer"
									@click="showTaskList"
								/>
								<el-input v-model.trim="selectCarStr" />
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="3" type="flex" justify="center" align="center">
						<el-button type="primary" @click="carImport">导入</el-button>
					</el-col>
					<el-col :span="2" type="flex" align="start">
						<el-button @click="handleClear" class="dialog-cancel" type="default"
							>重置</el-button
						>
					</el-col>
					<el-col :span="9">
						<el-form-item label-width="10px">
							<span v-if="selectCarNumber > 0"
								>电池编码信息：已选择<span style="color:red">{{
									selectCarNumber
								}}</span
								>电池编码</span
							>
							<span v-else>电池编码信息：当前未选择任何电池编码</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="10">
						<el-form-item label="故障码：" prop="faultStr">
							<div style="position:relative;">
								<div
									style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:999;cursor:pointer"
									@click="showFaultTaskList"
								/>
								<el-input v-model.trim="selectFaultStr" />
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="3" type="flex" justify="center" align="center">
						<el-button type="primary" @click="faultImport">导入</el-button>
					</el-col>
					<el-col :span="2" type="flex" align="start">
						<el-button
							@click="handleFaultClear"
							class="dialog-cancel"
							type="default"
							>重置</el-button
						>
					</el-col>
					<el-col :span="9">
						<el-form-item label-width="10px">
							<span v-if="selectFaultNumber > 0"
								>故障码信息：已选择<span style="color:red">{{
									selectFaultNumber
								}}</span
								>故障码</span
							>
							<span v-else>故障码信息：当前未选择任何故障码</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="space-between" align="top">
					<el-col :span="24">
						<el-form-item label="任务时间：" prop="timeRange">
							<el-date-picker
								v-model="formInfo.timeRange"
								type="datetimerange"
								range-separator="~"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="yyyy-MM-dd HH:mm:ss"
								:default-time="currentTime"
								:picker-options="pickerOptions"
								unlink-panels
							>
							<!-- :default-time="['00:00:00', '23:59:59']" -->
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row type="flex" justify="space-between" align="top">
					<el-col :span="11">
						<el-form-item label="开始时间：" prop="beginTime">
							<el-date-picker
								:picker-options="pickerOptions"
								v-model="formInfo.beginTime"
								filterable
								clearable
								placeholder="请选择"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="结束时间：" prop="endTime">
							<el-date-picker
								align="right"
								:picker-options="pickerOptions"
								v-model="formInfo.endTime"
								filterable
								clearable
								placeholder="请选择"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</el-form-item>
					</el-col>
				</el-row> -->
		  </el-form>
			<!-- 选择电池编码 -->
			<bm-code-dialog
				:visibles.sync="selectCarVisibles"
				:data="selectCarList"
				@select-complete="selectCarComplete"
			/>
			<!-- 选择故障码 -->
			<fault-code-dialog
				:visibles.sync="selectFaultVisibles"
				:data="selectFaultList"
				@select-complete="selectFaultComplete"
			/>
			<!-- 导入 -->
			<import-dialog
				ref="importDialog"
				:action="importURL.action"
				:template-url="importURL.template"
				:append-to-body="true"
				:visibles.sync="importVisible"
				@upload-success="importComplete"
			>
				<result-dialog
					:visibles.sync="resultVisible"
					:data="importResult"
					:text="importURL.text"
					:keys="importURL.keys"
					:message="'无导入失败信息'"
					:is-show="false"
				>
				</result-dialog>
			</import-dialog>
		</div>
	</app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
// 组件
import bmCodeDialog from "./bmCodeDialog";
import faultCodeDialog from "./faultCodeDialog";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import { createTask } from "@/api/carMonitorSys/powerBatteryFailureHistoryDownload";
import { mapGetters } from "vuex";
import { beginTimeAndEndTime, duplicateRemoval } from "@/utils/base";
import { getNowFormatTime } from "@/utils/common";
// request
export default {
	name: "addTaskDrawer",
	mixins: [partialForm],
	components: { bmCodeDialog, faultCodeDialog, importDialog, resultDialog },
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
	computed: {
		...mapGetters(["commontData"]),
		selectCarNumber() {
			return this.selectCarList.length;
		},
		selectCarStr() {
			return this.selectCarList.map((obj) => obj.bmsCode).join(",");
		},
		selectFaultNumber() {
			return this.selectFaultList.length;
		},
		selectFaultStr() {
			return this.selectFaultList.map((obj) => obj.faultCode).join(",");
		},
		loginName() {
			return this.$store.state.user.userInfo.loginName?this.$store.state.user.userInfo.loginName:'';
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.currentTime = ["00:00:00", getNowFormatTime()];
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; // 得到月份
				let date = myDate.getDate(); // 得到日期
				let hour = myDate.getHours(); // 得到小时
				let minits = myDate.getMinutes(); // 得到分钟
				let second = myDate.getSeconds();
				month = month.toString().padStart(2, "0");
				date = date.toString().padStart(2, "0");
				hour = hour.toString().padStart(2, "0");
				minits = minits.toString().padStart(2, "0");
				second = second.toString().padStart(2, "0");
				// let str = `admin${year}${month}${date}${hour}${minits}${second}`
				let str = `${this.loginName}${year}${month}${date}${hour}${minits}${second}`;
				this.formInfo.taskName = str;
			}
		},
	},
	// created() {
	// },
	data() {
		const validateTask = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入任务名称"));
			}
		};
		const validatecarStr = (rule, value, cb) => {
			if (!this.selectCarStr || this.selectCarStr === undefined) {
				return cb(new Error("请选择电池编码"));
			}
		};
		const validatefaultStr = (rule, value, cb) => {
			if (!this.selectFaultStr || this.selectFaultStr === undefined) {
				return cb(new Error("请选择故障码"));
			}
		};
		const validateTimeRange = (rule, value, cb) => {
			if (!this.formInfo.timeRange||(this.formInfo.timeRange&&!this.formInfo.timeRange[0])) {
				return cb(new Error("请选择任务时间"));
			}
		};
		// const validatebegintime = (rule, value, cb) => {
		// 	if (!value) {
		// 		return cb(new Error("请选择开始时间"));
		// 	}
		// };
		// const validateendtime = (rule, value, cb) => {
		// 	if (!value) {
		// 		return cb(new Error("请选择结束时间"));
		// 	}
		// };
		return {
			formInfo: {
				taskName: "",
				timeRange:["",""],
			},
			currentTime:[],
			selectCarList: [],
			selectCarVisibles: false,
			importVisible: false,
			resultVisible: false,
			loading: false,
			importResult: {},
			selectFaultList: [],
			selectFaultVisibles: false,
			// paramsVisible: false,
			// selectParamsList: [],
			// selectParamsItemList: [],
			importURL: {
				action: "",
				template: "",
				text: "",
				keys: "",
			},
			rules: {
				taskName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validateTask,
					},
				],
				carStr: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatecarStr,
					},
				],
				faultStr: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatefaultStr,
					},
				],
				timeRange: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator:validateTimeRange,
						// validator: this.validInput,
						// tips: "请选择时间",
						// formObjName: "formInfo",
					},
				],
				// beginTime: [
				// 	{
				// 		required: true,
				// 		trigger: ["blur", "change"],
				// 		validator: validatebegintime,
				// 	},
				// ],
				// endTime: [
				// 	{
				// 		required: true,
				// 		trigger: ["blur", "change"],
				// 		validator: validateendtime,
				// 	},
				// ],
			},
			pickerOptions:{
				disabledDate(time){
					return time.getTime()>Date.now()
				}
			}
		};
	},
	mounted() {},
	methods: {
		// 显示车辆列表
		showTaskList() {
			this.selectCarVisibles = true;
		},
		// 选择车辆列表完成
		selectCarComplete(e) {
			this.selectCarList = duplicateRemoval([...e], "oid");
		},
		//导入电池编码
		carImport() {
			this.importVisible = true;
			this.importURL = {
				name: "carImport",
				// action: "api/monitor/fault/batteryFaultDown/importBatteryCode",
				action: "api/monitor/batteryFaultDown/importBatteryCode",
				template: "api/monitor/fileStatics/ImportBatteryCodeBatch.xlsx",
				text: "电池编码",
				keys: "bmsCode",
			};
		},
		// 导入车辆完成
		importComplete(e) {
			if (e.failedList&&e.failedList.length > 0) {
        this.resultVisible = true;
        this.importResult = e;
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
			if (this.importURL.name == "carImport") {
				this.selectCarList = duplicateRemoval(
					[...this.selectCarList, ...e.successList],
					"bmsCode"
				);
			} else if (this.importURL.name == "faultImport") {
				this.selectFaultList = duplicateRemoval(
					[...this.selectFaultList, ...e.successList],
					"faultCode"
				);
			}
		},
		// 清除
		handleClear() {
			this.selectCarList = [];
		},
		//故障码 显示
		showFaultTaskList() {
			this.selectFaultVisibles = true;
		},
		// 故障码 清除
		handleFaultClear() {
			this.selectFaultList = [];
		},
		//故障码 选择完成
		selectFaultComplete(e) {
			this.selectFaultList = duplicateRemoval([...e], "faultCode");
		},
		//导入故障码
		faultImport() {
			this.importVisible = true;
			this.importURL = {
				name: "faultImport",
				// action: "api/monitor/fault/batteryFaultDown/importFaultCode",
				action: "api/monitor/batteryFaultDown/importFaultCode",
				template: "api/monitor/fileStatics/ImportFaultCodeBatch.xlsx",
				text: "故障码",
				keys: "faultCode",
			};
		},
		// 清空数据
		restData() {
			for (let keys in this.formInfo) {
				this.formInfo[keys] = "";
			}
			this.formInfo.timeRange=["",""]
			this.selectCarList = [];
			this.selectFaultList = [];
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		// 点击取消
		handleCancel() {
			this.closeDrawer();
		},
		// 提交
		submitForm() {
			this.formInfo.beginTime=this.formInfo.timeRange?this.formInfo.timeRange[0]:''
      this.formInfo.endTime=this.formInfo.timeRange?this.formInfo.timeRange[1]:''
			
			let formcenter = this.checkForm({
				formName: "formCenter",
				formList: [
					"taskName",
					"carStr",
					"faultStr",
					"timeRange"
				],
			});
      if (!formcenter) {
        return;
      }

			if (
				!beginTimeAndEndTime({
					startTime: this.formInfo.beginTime,
					endTime: this.formInfo.endTime,
					message: "开始时间不能大于结束时间，请重新选择",
				})
			) {
				return;
			}
			if(new Date(this.formInfo.endTime).getTime()>new Date().getTime()){
				this.$message.warning({
					message: "所选时间范围不能大于当前时间",
					duration: 2 * 1000,
				});
				return;
			}
			const postData = {
				taskName: this.formInfo.taskName,
				batteryList: this.selectCarList.map((obj) => obj.bmsCode).join(","),
				faultCodeList: this.selectFaultList
					.map((obj) => obj.faultCode)
					.join(","),
				startTime: this.formInfo.beginTime,
				endTime: this.formInfo.endTime,
			};
			this.loading = true;
			createTask(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "新增完成",
							duration: 2 * 1000,
						});
						this.$emit("add-complete");
						this.closeDrawer();	
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.search_list {
	padding-top: 0;
}
</style>
