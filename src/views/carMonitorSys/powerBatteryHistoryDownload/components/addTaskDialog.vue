<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'添加任务'"
		width="55%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="true"
		@ok-drawer="submitForm"
		:isOkButLoading="submitLoading"
	>
		<div slot="drawerContent">
			<el-form ref="formCenter" :model="formInfo" :rules="rules"  :label-position="'right'" label-width="70px">
				<el-row type="flex" justify="start" align="top">
					<el-col :span="11">
						<el-form-item label="任务名称：" prop="taskName">
							<el-input
								v-model="formInfo.taskName"
								:maxlength="20"
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
						<el-button type="primary" @click="importVisible = true"
							>导入</el-button
						>
					</el-col>
					<el-col :span="2" type="flex" align="start">
						<el-button @click="handleClear" class="dialog-cancel" type="default"
							>重置</el-button
						>
					</el-col>
					<el-col :span="9">
						<el-form-item label-width="10px">
							<span v-if="selectCarNumber > 0"
								>电池编码信息：已选择<span style="color:red">
									{{ selectCarNumber }} </span
								>个电池编码</span
							>
							<span v-else>电池编码信息：当前未选择任何电池编码</span>
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
				</el-row>
				<el-row>
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
				<!-- 导入 -->
				<import-dialog
					ref="importDialog"
					action="api/monitor/batteryFaultDown/importBatteryCode"
					:template-url="'api/monitor/fileStatics/ImportBatteryCodeBatch.xlsx'"
					:append-to-body="true"
					:visibles.sync="importVisible"
					@upload-success="importCarComplete"
				>
					<result-dialog
						:visibles.sync="resultVisible"
						:data="importResult"
						:text="'电池编码'"
						:keys="'bmsCode'"
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
import { checkFormRule } from "@/mixins/validateOne";
// 混入
import bmCodeDialog from "./bmCodeDialog";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
// import paramsDialog from './paramsDialog'
import { createTask } from "@/api/carMonitorSys/powerBatteryHistoryDownload";
import { mapGetters } from "vuex";
import { beginTimeAndEndTime, duplicateRemoval } from "@/utils/base";
import { getNowFormatTime } from "@/utils/common";
// request
export default {
	name: "AddTaskDialog",
	mixins: [partialForm, checkFormRule],
	components: { bmCodeDialog, importDialog, resultDialog },
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
		paramsStr() {
			return this.selectParamsItemList.map((obj) => obj.label).join(",");
		},
		loginName() {
			// return this.$store.state.user.userInfo.loginName;
			return this.$store.state.user.userInfo.loginName
				? this.$store.state.user.userInfo.loginName
				: this.$store.state.user.userInfo.email
				? this.$store.state.user.userInfo.email.split("@")[0]
				: "";
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
				let str = `${this.loginName}${year}${month}${date}${hour}${minits}${second}`;
				this.formInfo.taskName = str;
			}
		},
	},
	// created() {
	// },
	data() {
		const validatecarStr = (rule, value, cb) => {
			if (!this.selectCarStr || this.selectCarStr === undefined) {
				return cb(new Error("请选择电池编码"));
			}
		};
		const validateTimeRange = (rule, value, cb) => {
			if (!this.formInfo.timeRange||(this.formInfo.timeRange&&!this.formInfo.timeRange[0])) {
				return cb(new Error("请选择任务时间"));
			}
		};
		return {
			formInfo: {
				taskName: "",
				timeRange:["",""],
			},
			currentTime:[],
			// , "form4"
			submitLoading: false,
			selectCarList: [],
			selectCarVisibles: false,
			importVisible: false,
			resultVisible: false,
			importResult: {},
			paramsVisible: false,
			selectParamsList: [],
			selectParamsItemList: [],
			rules: {
				taskName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入任务名称",
						formObjName: "formInfo",
            ruleReg: 'alphanumeric',
            errorTips:"请输入数字或字母",
					},
				],
				carStr: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatecarStr,
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
				// 		validator: this.validInput,
				// 		tips: "请选择开始时间",
				// 		formObjName: "formInfo",
				// 	},
				// ],
				// endTime: [
				// 	{
				// 		required: true,
				// 		trigger: ["blur", "change"],
				// 		validator: this.validInput,
				// 		tips: "请选择结束时间",
				// 		formObjName: "formInfo",
				// 	},
				// ],
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
		};
	},
	mounted() {},
	methods: {
		// 显示车辆列表
		showTaskList() {
			this.selectCarVisibles = true;
		},
		// 显示参数
		showParams() {
			this.paramsVisible = true;
		},
		// 选择参数
		selectParams(e) {
			this.selectParamsList = [...e.idList];
			this.selectParamsItemList = [...e.itemList];
		},
		// 选择车辆列表完成
		selectCarComplete(e) {
			this.selectCarList = duplicateRemoval([...e], "id");
		},
		// 导入车辆完成
		importCarComplete(e) {
			if (e.failedList && e.failedList.length > 0) {
				this.importResult = e;
				this.resultVisible = true;
			} else {
				this.resultVisible = false;
				this.importVisible = false;
			}
			this.selectCarList = duplicateRemoval(
				[...this.selectCarList, ...e.successList],
				"id"
			);
		},
		// 清除
		handleClear() {
			this.selectCarList = [];
		},
		// 清空数据
		restData() {
			for (let keys in this.formInfo) {
				this.formInfo[keys] = "";
			}
			this.formInfo.timeRange=["",""]
			this.selectCarList = [];
			this.selectParamsList = [];
			this.selectParamsItemList = [];
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
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
					"timeRange",
				],
			});
      if (!formcenter) {
        return;
      }

			// console.log(this.formInfo.beginTime,this.formInfo.endTime,"11111")
			if (
				!beginTimeAndEndTime({
					startTime: this.formInfo.beginTime,
					endTime: this.formInfo.endTime,
					message: "开始时间不能大于结束时间，请重新选择",
				})
			) {
				return;
			}
			if (new Date(this.formInfo.endTime).getTime() > new Date().getTime()) {
				this.$message.warning({
					message: "所选时间范围不能大于当前时间",
					duration: 2 * 1000,
				});
				return;
			}
			const postData = {
				taskName: this.formInfo.taskName,
				bmsCodes: this.selectCarList.map((obj) => obj.bmsCode), //.join(",")
				beginTime: this.formInfo.beginTime,
				endTime: this.formInfo.endTime,
				// fileType: this.formInfo.fileType
			};
			// if(this.selectCarList.length === 1){
			//   postData.fieldlist = this.selectParamsItemList.map(obj => obj.label)
			// }
			this.submitLoading = true;
			createTask(postData).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "新增完成",
						duration: 2 * 1000,
					});
					this.$emit("add-complete");
					this.closeDrawer();
				}
				this.submitLoading = false;
			}).catch(() => {
				this.submitLoading = false;
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
