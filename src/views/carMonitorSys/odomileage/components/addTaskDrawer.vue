<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'添加任务'"
		width="55%"
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
								maxlength="20"
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
						<el-button type="primary" @click="importVisible = true">
							导入
						</el-button>
					</el-col>
					<el-col :span="2" type="flex" align="start">
						<el-button class="dialog-cancel" type="default" @click="handleClear">
							重置
						</el-button>
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
						<el-form-item label="开始时间：">
							<el-date-picker
								v-model="formInfo.startTime"
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
						<el-form-item label="结束时间：">
							<el-date-picker
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
				<el-row :gutter="10">
					<el-col :span="24">
						<el-form-item label="备注：">
							<el-input
								v-model.trim="formInfo.remark"
								:rows="8"
								:autosize="{ minRows: 5, maxRows: 5 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								maxlength="200"
								show-word-limit
							/>
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
				action="api/monitor/common/importOdoCarInfo"
				:template-url="
					'api/monitor/fileStatics/ImportODOMileageCalculation.xlsx'
				"
				:append-to-body="true"
				:visibles.sync="importVisible"
				@upload-success="importCarComplete"
				:data="{ taskType: 2 }"
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
// 组件
import selectCarDialog from "@/components/selectCarDialog";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import { create } from "@/api/carMonitorSys/odoMileage";
import { mapGetters } from "vuex";
import { duplicateRemoval, beginTimeAndEndTime } from "@/utils/base";
// request
export default {
	name: "AddTaskDrawer",
	mixins: [partialForm],
	components: { selectCarDialog, importDialog, resultDialog },
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
				const myDate = new Date();
				const year = myDate.getFullYear();
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
				// const str = `admin${year}${month}${date}${hour}${minits}${second}`
				let str = `${this.loginName}${year}${month}${date}${hour}${minits}${second}`;
				this.formInfo.taskName = str;
			}
		},
	},
	created() {},
	data() {
		const validateTask = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入任务名称"));
			} else if (value.length > 50) {
				return cb(new Error("最大长度不能超过50"));
			}
		};
		const validatecarStr = (rule, value, cb) => {
			if (!this.selectCarStr || this.selectCarStr === undefined) {
				return cb(new Error("请选择车辆"));
			}
		};
		return {
			formInfo: {
				taskName: "",
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
			},
		};
	},
	mounted() {},
	methods: {
		showTaskList() {
			this.selectCarVisibles = true;
		},
		showParams() {
			this.paramsVisible = true;
		},
		selectParams(e) {
			this.selectParamsList = [...e.idList];
			this.selectParamsItemList = [...e.itemList];
		},
		selectCarComplete(e) {
			this.selectCarList = duplicateRemoval([...e], "carId");
		},
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
		},
		handleClear() {
			this.selectCarList = [];
			// this.$refs.slist.reset();
		},
		restData() {
			for (let keys in this.formInfo) {
				this.formInfo[keys] = "";
			}
			this.formInfo.timeRange=["",""]
			this.selectCarList = [];
			this.selectParamsItemList = [];
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		submitForm() {
			this.formInfo.startTime=this.formInfo.timeRange?this.formInfo.timeRange[0]:''
      this.formInfo.endTime=this.formInfo.timeRange?this.formInfo.timeRange[1]:''
			
			let formcenter = this.checkForm({
				formName: "formCenter",
				formList: [
					"taskName",
					"carStr",
				],
			});
      if (!formcenter) {
        return;
      }

			if (
				!beginTimeAndEndTime({
					startTime: this.formInfo.startTime,
					endTime: this.formInfo.endTime,
					message: "开始时间不能大于结束时间，请重新选择",
				})
			) {
				return;
			}
			const arr = [];
			this.selectCarList.forEach((item) => {
				arr.push({
					carId: item.carId,
					terminalCode: item.terminalCode,
					// vinNo: item.vinNo,
					vinNo: item.vinNoTotal,
					startTime: item.startTime,
					endTime: item.endTime,
				});
			});
			if (arr.length === 0) {
				this.$message.warning({
					message: "请选择车辆",
					duration: 2 * 1000,
				});
				return;
			}
			const postData = {
				taskName: this.formInfo.taskName,
				vinNoList: arr,
				startTime: this.formInfo.startTime,
				endTime: this.formInfo.endTime,
				carId: this.selectCarList.map((obj) => obj.carId),
				// fieldlist: this.selectCarList.length === 1 ? this.selectParamsItemList.map(obj => obj.label) : '',
				remark: this.formInfo.remark,
			};
			this.loading = true;
			create(postData)
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
