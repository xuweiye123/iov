<template>
	<app-drawer
		:visibles.sync="visibles"
		width="60%"
		:title="'添加任务'"
		@close-drawer="closeDrawer"
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
								:maxlength="50"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="24">
						<el-form-item label="选择车辆：" prop="carStr">
							<el-row>
								<el-col :span=0>
									<el-input v-model.trim="selectCarStr" />
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
								<el-col :span="8">
									<el-form-item label-width="10px">
										<span v-if="selectCarNumber > 0"
											>车辆信息：已选择<span style="color:red">{{
												selectCarNumber
											}}</span
											>辆车</span
										>
										<span v-else>车辆信息：当前未选择任何车辆</span>
									</el-form-item>
								</el-col>
							</el-row>
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
						<el-form-item label="开始时间：" prop="startTime">
							<el-date-picker
								v-model="formInfo.startTime"
								:picker-options="pickerOptions"
								filterable
								clearable
								placeholder="请选择"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="车型名称：">
							<el-select
								v-model="formInfo.carTypeId"
								filterable
								clearable
								placeholder="请选择"
								:disabled="cartypedisabled"
								@change="carTypeChange"
							>
								<el-option
									v-for="(item, index) in carTypeList"
									:key="index"
									:label="item.carTypeName"
									:value="item.carTypeId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="项目代号：">
							<el-select
								v-model="formInfo.carBatchId"
								filterable
								clearable
								placeholder="请先选择车型名称"
								:disabled="xmdisabled"
							>
								<el-option
									v-for="(item, index) in batchList"
									:key="index"
									:label="item.carBatchCode"
									:value="item.carBatchId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="space-between" align="top">
					<el-col :span="11">
						<el-form-item label="结束时间：" prop="endTime">
							<el-date-picker
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
				<el-row type="flex" justify="space-between" align="top">
					<el-col :span="11">
						<el-form-item label="故障名称：">
							<el-input
								v-model="formInfo.faultNames"
								@keyup.native="faultnameKeyup"
								@change="faultnameKeyup"
								placeholder="多个故障名称请用逗号(,)隔开"
								:disabled="faultnamedisabled"
								clearable
								:maxlength="200"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="11">
						<el-form-item label="故障码：">
							<el-input
								v-model="formInfo.faultCodes"
								@keyup.native="faultcodesKeyup"
								@change="faultcodesKeyup"
								placeholder="多个故障码请用逗号(,)隔开"
								:disabled="faultcodedisabled"
								clearable
								:maxlength="200"
							/>
						</el-form-item>
					</el-col>
				</el-row>
		  </el-form>
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
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
// 导入
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import { createTask } from "@/api/carMonitorSys/historySearch";
import { getCarTypeList, getBatchCodeInfo } from "@/api/commont";
import { mapGetters } from "vuex";
import { beginTimeAndEndTime, duplicateRemoval } from "@/utils/base";
import { getNowFormatTime } from "@/utils/common";
// request
export default {
	name: "addTaskBatchDrawer",
	mixins: [partialForm],
	components: { importDialog, resultDialog },
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
			if (this.selectCarList.length > 0) {
				this.xmdisabled = true;
				this.cartypedisabled = true;
				// this.formInfo.carTypeId = "";
				// this.formInfo.carBatchId = "";
			}
			return this.selectCarList.length;
		},
		selectCarStr() {
			return this.selectCarList.map((obj) => obj.vinNo).join(",");
		},
		loginName() {
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
				this.carTypeListHandle();
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

				this.formInfo.fileType = 1;
			}
		},
	},
	data() {
		const validateTask = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入任务名称"));
			}
		};
		const validateTimeRange = (rule, value, cb) => {
			if (!this.formInfo.timeRange||(this.formInfo.timeRange&&!this.formInfo.timeRange[0])) {
				return cb(new Error("请选择任务时间"));
			}
		};
		const validatecarStr = (rule, value, cb) => {
			// console.log(this.selectCarList,1234,this.selectCarList.length)
			if (!this.selectCarStr || this.selectCarStr === undefined) {
				return cb(new Error("请选择车辆"));
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
				// carTypeId: "",
				// carBatchId: "",
				startTime: "",
				endTime: "",
				faultNames: "",
				faultCodes: "",
				timeRange:["",""],
			},
			loading: false,
			currentTime: [],
			selectCarList: [],
			importVisible: false,
			resultVisible: false,
			importResult: {},
			rules: {
				taskName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validateTask,
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
				carStr: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatecarStr,
					},
				],
				// startTime: [
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
			carTypeList: [],
			batchList: [],
			xmdisabled: true,
			cartypedisabled: false,
			faultnamedisabled: false,
			faultcodedisabled: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
		};
	},
	mounted() {},
	methods: {
		// 项目代码
		carBatchListHandle(postdata) {
			getBatchCodeInfo(postdata).then(({ data }) => {
				if (data.code === 0) {
					this.batchList = data.data || [];
				}
			});
		},
		// 车辆型号
		carTypeListHandle() {
			getCarTypeList().then(({ data }) => {
				if (data.code === 0) {
					this.carTypeList = data.data || [];
				}
			});
		},
		// // 选择车型名称
		// carTypeChange(e) {
		// 	this.formInfo.carBatchId = "";
		// 	this.batchList = [];
		// 	const postdata = {
		// 		carTypeId: e,
		// 	};
		// 	if (e == "") {
		// 		this.batchList = [];
		// 		this.xmdisabled = true;
		// 	} else {
		// 		this.xmdisabled = false;
		// 		this.carBatchListHandle(postdata);
		// 	}
		// },
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
			// if (this.selectCarList.length == 1) {
			// 	this.formInfo.taskName = this.selectCarList[0].vinNo;
			// } else {
			// 	this.formInfo.taskName = "";
			// }
		},
		//故障名称
		faultnameKeyup() {
			if (!this.formInfo.faultNames) {
				this.faultcodedisabled = false;
			} else {
				this.faultcodedisabled = true;
			}
		},
		//故障码
		faultcodesKeyup() {
			if (!this.formInfo.faultCodes) {
				this.faultnamedisabled = false;
			} else {
				this.faultnamedisabled = true;
			}
		},
		// 清除
		handleClear() {
			this.selectCarList = [];
			this.cartypedisabled = false;
			// this.faultnamedisabled = false;
			// this.faultcodedisabled = false;
		},
		// 清空数据
		restData() {
			for (let keys in this.formInfo) {
				this.formInfo[keys] = "";
			}
			this.formInfo.timeRange=["",""]
			this.xmdisabled = true;
			this.cartypedisabled = false;
			this.faultnamedisabled = false;
			this.faultcodedisabled = false;
			this.selectCarList = [];
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		// 提交
		submitForm() {
			this.formInfo.startTime=this.formInfo.timeRange?this.formInfo.timeRange[0]:''
      this.formInfo.endTime=this.formInfo.timeRange?this.formInfo.timeRange[1]:''
			
      let formcenter = this.checkForm({
				formName: "formCenter",
				formList: [
					"taskName",
					"carStr",
					"timeRange"
				],
			});
      if (!formcenter) {
        return;
      }

			if (
				!beginTimeAndEndTime({
					startTime: this.formInfo.startTime,
					endTime: this.formInfo.endTime,
				})
			) {
				return;
			}
			if (new Date(this.formInfo.endTime).getTime() > new Date().getTime()) {
				this.$message.warning({
					message: "所选时间不能大于当前时间",
					duration: 2 * 1000,
				});
				return;
			}
			// if (this.selectCarList.length <= 0 && !this.formInfo.carTypeId) {
			// 	this.$message.warning({
			// 		message: "请导入车辆或者选择车型名称",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			const postData = {
				taskName: this.formInfo.taskName,
				// vinNoList: this.selectCarList.map((obj) => obj.vinNo),
				vinNoList: this.selectCarList.map((obj) => obj.vinNoTotal),
				startTime: this.formInfo.startTime,
				endTime: this.formInfo.endTime,
				// carTypeId: this.formInfo.carTypeId,
				// carBatchId: this.formInfo.carBatchId,
				faultNames: this.formInfo.faultNames.replace(/，/gi, ","),
				faultCodes: this.formInfo.faultCodes.replace(/，/gi, ","),
			};
			// if(this.selectCarList.length === 1){
			//   postData.fieldlist = this.selectParamsItemList.map(obj => obj.label)
			// }
			this.loading = true;
			createTask(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "创建完成",
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
