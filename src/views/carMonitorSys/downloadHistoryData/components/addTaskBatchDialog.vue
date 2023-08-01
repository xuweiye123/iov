<template>
	<app-drawer
		:visibles.sync="visibles"
		width="55%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="true"
		:title="'添加批量任务'"
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
								placeholder="请输入任务名称"
								clearable
								:maxlength="20"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="11">
						<el-form-item label="选择车辆：" prop="carStr">
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
					<el-col :span="8" >
						<el-form-item label-width="10px">
							<span v-if="selectCarNumber > 0"
								>车辆信息：已选择<span style="color:red">
									{{ selectCarNumber }} </span
								>辆车</span
							>
							<span v-else>车辆信息：当前未选择任何车辆</span>
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
								:default-time="['00:00:00', '23:59:59']"
								unlink-panels
							>
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row type="flex" justify="space-between" align="top">
					<el-col :span="11">		
						<el-form-item label="开始时间：" prop="beginTime">
							<el-date-picker
								v-model="formInfo.beginTime"
								filterable
								clearable
								placeholder="请选择"
								type="datetime"
								:picker-options="beginTimeOptions"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="11">
						<el-form-item label="结束时间：" prop="endTime">
							<el-date-picker
								v-model="formInfo.endTime"
								filterable
								clearable
								placeholder="请选择"
								type="datetime"
								:picker-options="endTimeOptions"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-row type="flex" justify="center" align="top">
					<el-col :span="24">
						<el-form-item label="下载类型：" prop="fileType">
							<el-select
								v-model="formInfo.fileType"
								filterable
								clearable
								placeholder="请选择"
							>
								<el-option
									v-for="(item, index) in commontData.downLoadType"
									:key="index"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="center" align="top">
					<el-col :span="24">
						<el-form-item label="打包下载：" prop="packDownload">
							<el-checkbox v-model="formInfo.isPack"></el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
		  </el-form>
			<!-- 选择车辆 -->
			<select-car-dialog
				ref="slist"
				:visibles.sync="selectCarVisibles"
				:data="selectCarList"
				@select-complete="selectCarComplete"
			/>
			<!-- 导入 -->
			<import-dialog
				ref="importDialog"
				action="api/monitor/common/ImportCarInfo"
				:template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
				:append-to-body="true"
				:visibles.sync="importVisible"
				@upload-success="importCarComplete"
			>
				<result-dialog
					:visibles.sync="resultVisible"
					:data="importResult"
					:text="'VIN码'"
					:keys="'vinNo'"
					:message="'无导入失败信息'"
					:is-show="false"
				>
				</result-dialog>
			</import-dialog>
			<!-- 查看参数 -->
			<params-dialog
				:visibles.sync="paramsVisible"
				:data="paramsList"
				:default-params="selectParamsList"
				@selcet-complete="selectParams"
			/>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// 组件
import selectCarDialog from "@/components/selectCarDialog";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import paramsDialog from "./paramsDialog";
import { createTask } from "@/api/carMonitorSys/downloadHistory";
import { mapGetters } from "vuex";
import { beginTimeAndEndTime, duplicateRemoval } from "@/utils/base";
// request
export default {
	name: "AddTaskDialog",
	mixins: [partialForm, checkFormRule],
	components: { selectCarDialog, importDialog, resultDialog, paramsDialog },
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
			return this.selectCarList.map((obj) => obj.vinNo).join(",");
		},
		paramsStr() {
			return this.selectParamsItemList.map((obj) => obj.label).join(",");
		},
		loginName() {
			return this.$store.state.user.loginName;
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
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
				this.formInfo.isPack = false;
			}
		},
	},
	data() {
		const validatecarStr = (rule, value, cb) => {
			if (!this.selectCarStr || this.selectCarStr === undefined) {
				return cb(new Error("请选择车辆"));
			}
		};
		const validateTimeRange = (rule, value, cb) => {
			if (!this.formInfo.timeRange||(this.formInfo.timeRange&&!this.formInfo.timeRange[0])) {
				return cb(new Error("请选择任务时间"));
			}
		};
		const self = this;
		return {
			formInfo: {
				taskName: "",
				endTime: "",
				beginTime: "",
				isPack: false,
				timeRange:["",""],
			},
			loading: false,
			selectCarList: [],
			selectCarVisibles: false,
			importVisible: false,
			resultVisible: false,
			importResult: {},
			paramsVisible: false,
			selectParamsList: [],
			selectParamsItemList: [],
			paramsList: {},
			rules: {
				taskName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入任务名称",
            errorTips:"请输入数字或字母",
            ruleReg: 'alphanumeric',
						formObjName: "formInfo",
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
				fileType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择下载类型",
						formObjName: "formInfo",
					},
				],
			},
			beginTimeOptions: {
				// 限制开始时间
				disabledDate: (time) => {
					if (self.formInfo.endTime) {
						return (
							time.getTime() <
								new Date(self.formInfo.endTime).getTime() -
									92 * 24 * 60 * 60 * 1000 ||
							time.getTime() > new Date(self.formInfo.endTime).getTime()
						);
					}
				},
			},
			endTimeOptions: {
				// 限制结束时间
				disabledDate: (time) => {
					if (self.formInfo.beginTime) {
						return (
							time.getTime() < new Date(self.formInfo.beginTime).getTime() ||
							time.getTime() >
								new Date(self.formInfo.beginTime).getTime() +
									92 * 24 * 60 * 60 * 1000
						);
					}
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
			this.formInfo.beginTime=this.formInfo.timeRange?this.formInfo.timeRange[0]:''
      this.formInfo.endTime=this.formInfo.timeRange?this.formInfo.timeRange[1]:''
			if (this.selectCarList.length === 0) {
				this.$alert("请选择车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			if (!this.formInfo.beginTime || !this.formInfo.endTime) {
				this.$alert("请选择任务时间", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.paramsList = {
				selectCarList: this.selectCarList,
				startTime: this.formInfo.beginTime,
				endTime: this.formInfo.endTime,
			};
			this.paramsVisible = true;
		},
		// 选择参数
		selectParams(e) {
			this.selectParamsList = [...e.idList];
			this.selectParamsItemList = [...e.itemList];
		},
		// 选择车辆列表完成
		selectCarComplete(e) {
			console.log(3333333333);
			this.selectCarList = duplicateRemoval([...e], "carId");
			console.log(e, "111");
		},
		// 导入车辆完成
		importCarComplete(e) {
			if (e.failedList && e.failedList.length > 0) {
				this.resultVisible = true;
				this.importResult = e;
			} else {
				this.resultVisible = false;
				this.importVisible = false;
			}

			this.selectCarList = duplicateRemoval(
				[...this.selectCarList, ...e.successList],
				"carId"
			);
			if (this.selectCarList.length == 1) {
				this.formInfo.taskName = this.selectCarList[0].vinNo;
			}
		},
		// 清除
		handleClear() {
			this.selectCarList = [];
			// this.$refs.slist.reset();
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
					"fileType",
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
			if (this.selectCarList.length > 100) {
				this.$alert("车辆数不能超过100", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			const postData = {
				taskName: this.formInfo.taskName,
				// vinNoList: this.selectCarList.map((obj) => obj.vinNo),
				vinNoList: this.selectCarList.map((obj) => obj.vinNoTotal),
				beginTime: this.formInfo.beginTime,
				endTime: this.formInfo.endTime,
				fileType: this.formInfo.fileType,
				isPack: this.formInfo.isPack,
			};
			if (this.selectCarList.length === 1) {
				postData.fieldlist = this.selectParamsItemList.map((obj) => obj.label);
			}
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

<style lang="scss" scoped></style>
