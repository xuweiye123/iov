<template>
	<div>
		<app-drawer
			:visibles="visibles"
			:title="!isEdit ? '新增任务' : '编辑任务'"
			width="600px"
			@close-drawer="closeDialog"
			@ok-drawer="submitForm"
			:isOkButLoading="loading"
		>
			<div slot="drawerContent">
				<el-form
					ref="form"
					:rules="rules"
					:model="formInfo"
					:label-position="'right'"
					label-width="130px"
				>
					<el-form-item label="任务名称：" prop="taskName">
						<el-input v-model="formInfo.taskName" clearable maxlength="20" />
					</el-form-item>
					<el-form-item label="选择诊断周期配置：" prop="configName">
						<el-row type="flex" justify="start" align="middle" :gutter="20">
							<el-col :span="14">
								<el-input
									readonly
									v-model="formInfo.configName"
									placeholder="点击选择诊断周期配置"
									clearable
									@click.native="selectCycleConfig"
								/>
							</el-col>
							<el-col :span="4">
								<el-button type="primary" @click="importConfig">导入</el-button>
							</el-col>
							<el-col :span="7">
								<span>{{ formInfo.importMessage }}</span>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="选择车辆：" prop="vinList">
						<el-input
							readonly
							v-model="formInfo.vinLists"
							placeholder="点击进行选择车辆"
							@click.native="selectCar"
						/>
					</el-form-item>
					<el-form-item label="任务有效期：" prop="dateRange">
						<el-date-picker
								v-model="timeRange"
								type="datetimerange"
								range-separator="~"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="yyyy-MM-dd HH:mm:ss"
								:default-time="['00:00:00', '23:59:59']"
								unlink-panels
							>
							</el-date-picker>
						<!-- <el-row type="flex" justify="start" align="middle" :gutter="20">
							<el-col :span="12">
								<el-date-picker
									v-model="formInfo.startTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择开始日期"
								>
								</el-date-picker>
							</el-col>
							<el-col :span="12">
								<el-date-picker
									v-model="formInfo.endTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime"
									placeholder="选择结束日期"
								>
								</el-date-picker>
							</el-col>
						</el-row> -->
					</el-form-item>
					<el-form-item label="备注：">
						<el-input
							v-model="formInfo.remark"
							type="textarea"
							placeholder="请输入备注"
							maxlength="50"
							rows="4"
							show-word-limit
							resize="none"
						/>
					</el-form-item>
				</el-form>
			</div>
		</app-drawer>
		<app-car-list
			:visibles.sync="carListVisible"
			:primaryIdList="primaryIdList"
			:carTypeId="carTypeId"
			@carVinno="loadCarVinno"
		/>
		<app-cycle-config
			:visibles.sync="cycleConfigVisible"
			:data="cycleData"
			@setConfigName="setConfigName"
		/>
		<app-import-dialog
			:visibles.sync="importDialogVisible"
			@upload-success="uploadSuccess"
		/>
	</div>
</template>

<script>
// request
import { createTask } from "@/api/diagnosisSys/offlineTask";
import { partialForm } from "@/mixins/partialForm";
//组件
import AppCarList from "@/components/diagnosisSys/selectMultiCarDialog";
import AppCycleConfig from "./selectCycleConfig";
import AppImportDialog from "./importDialog";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm],
	components: {
		AppCarList,
		AppCycleConfig,
		AppImportDialog,
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		isEdit: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => [],
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					let date = new Date();
					let taskConfig = {
						taskName:
							this.$store.state.user.loginName + date.format("yyyyMMddhhmmss"),
						// startTime: date.format("yyyy-MM-dd hh:mm:ss"),
						// endTime: new Date(date.setDate(date.getDate() + 1)).format(
						// 	"yyyy-MM-dd hh:mm:ss"
						// ),
					};
					this.timeRange=[date.format("yyyy-MM-dd hh:mm:ss"),new Date(date.setDate(date.getDate() + 1)).format(
						"yyyy-MM-dd hh:mm:ss"
					)]
					this.formInfo = { ...this.data, ...taskConfig };
				}
			},
			immediate: true,
		},
	},
	data() {
		const validateTaskName = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入任务名称"));
			}
		};
		const validateConfigName = (rule, value, cb) => {
			if (!this.formInfo.configName) {
				return cb(new Error("请选择周期诊断配置"));
			}
		};
		const validateVinList = (rule, value, cb) => {
			if (!this.formInfo.vinList) {
				return cb(new Error("请选择车辆"));
			}
		};
		const validateDateRange = (rule, value, cb) => {
			if (!this.timeRange||(this.timeRange&&!this.timeRange[0])) {
				return cb(new Error("请选择任务有效期"));
			}
			// if (!this.formInfo.startTime || !this.formInfo.endTime) {
			// 	return cb(new Error("请选择日期"));
			// }
		};
		return {
			cycleData: {},
			formInfo: {
				configName: "",
				startTime: "",
				endTime: "",
				vinList: "",
				configId: "",
			},
			timeRange:["",""],
			carListVisible: false, //车辆dialog
			loading: false,
			primaryIdList: [], //选中车辆的idList
			carTypeId: "", //车型ID
			cycleConfigVisible: false, //诊断周期dialog,
			importDialogVisible: false, //导入诊断周期dialog
			configName: "",
			rules: {
				taskName: [
					{ required: true, trigger: "blur", validator: validateTaskName },
					{ trigger: "change", validator: validateTaskName },
				],
				configName: [
					{ required: true, trigger: "blur", validator: validateConfigName },
					{ trigger: "change", validator: validateConfigName },
				],
				vinList: [
					{ required: true, trigger: "blur", validator: validateVinList },
					{ trigger: "change", validator: validateVinList },
				],
				dateRange: [
					{ required: true, trigger: "blur", validator: validateDateRange },
					{ trigger: "change", validator: validateDateRange },
				],
			},
			importMessage: "",
		};
	},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
			this.carTypeId = "";
			this.timeRange=["",""]
			this.primaryIdList = [];
		},
		// 点击提交
		submitForm() {
			// const form = this.checkForm({
			// 	formName: "form",
			// 	formList: ["taskName", "configName", "vinList", "dateRange"],
			// });
			// if (!form) {
			// 	return;
			// }
			this._createTask(0);
		},
		_createTask(confirmValue) {
			// if (
			// 	!beginTimeAndEndTime({
			// 		startTime: this.listQuery.startTime,
			// 		endTime: this.listQuery.endTime,
			// 	})
			// ){
			// 	return;
      // }
			this.formInfo.startTime=this.timeRange?this.timeRange[0]:""
			this.formInfo.endTime=this.timeRange?this.timeRange[1]:""
			// let date = new Date();
			// this.formInfo.startTime = date.format("yyyy-MM-dd hh:mm:ss");
			// this.formInfo.endTime = new Date(date.setDate(date.getDate() + 1)).format(
			// 	"yyyy-MM-dd hh:mm:ss"
			// );
			this.formInfo.confirm = confirmValue || 0;
			this.loading = true;
			createTask(this.formInfo)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDialog();
					} else if (data.code === 401 && confirmValue === 0) {
						let vins = data.data;
						this.$confirm(
							"当前新建任务包含有正在执行诊断或将要执行诊断的车辆[" +
								vins +
								"]，您确定要覆盖历史诊断吗？",
							"提示",
							{
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning",
							}
						)
							.then(() => {
								this.closeDialog();
								this._createTask(1);
							})
							.catch(() => {});
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		selectCar() {
			if (
				!this.formInfo.configName
			) {
				this.$alert("请先选择诊断周期配置信息", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.carListVisible = true;
		},
		loadCarVinno(value) {
			let vinNo = [];
			let vinNoTotal = [];
			let idList = [];
			value.forEach((item) => {
				vinNo.push(item.vinNo);
				vinNoTotal.push(item.vinNoTotal);
				idList.push(item.vinNo);
			});
			this.formInfo.vinList = vinNoTotal.join(",");
			this.formInfo.vinLists = vinNo.join(",");
			this.primaryIdList = idList;
		},
		//选择诊断周期配置
		selectCycleConfig() {
			this.cycleConfigVisible = true;
		},
		setConfigName(val) {
			this.formInfo.configName = val.configName;
			this.formInfo.configId = val.id;
			this.carTypeId = val.carTypeId;
			this.cycleData = val;
			if (this.formInfo.vinList) {
				this.formInfo.vinList = "";
			}
		},
		importConfig() {
			this.importDialogVisible = true;
		},
		//成功导入诊断周期后填充字段
		uploadSuccess(data) {
			this.formInfo.importMessage =
				"已自动载入" + data.serviceList.length + "个诊断服务";
			this.formInfo.configName = data.configName;
			this.formInfo.configId = data.configId;
		},
	},
};
</script>

<style lang="scss" scoped></style>
