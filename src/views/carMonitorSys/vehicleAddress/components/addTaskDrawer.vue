<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'添加任务'"
		width="55%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="true"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formLeft"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="90px"
			>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="24">
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
					<el-col :span="12">
						<el-form-item label="选择车辆：" prop="car">
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
						<el-button
							class="dialog-cancel"
							type="default"
							@click="handleClear"
						>
							重置
						</el-button>
					</el-col>
					<el-col :span="8">
						<el-form-item label-width="10px">
							<span v-if="selectCarNumber > 0" 
								>车辆信息：已选择<span style="color:red"> {{
									selectCarNumber
								}} </span
								>辆车</span
							>
							<span v-else 
								>车辆信息：当前未选择任何车辆</span
							>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" justify="start" align="top">
					<el-col :span="24">
						<el-form-item label="备注：">
							<el-input
								v-model.trim="formInfo.remark"
								:rows="8"
								:autosize="{ minRows: 5, maxRows: 5 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								:maxlength="200"
								show-word-limit
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 选择车辆 -->
			<select-car-dialog
				:visibles.sync="selectCarVisibles"
				:data="selectCarList"
				@select-complete="selectCarComplete"
			/>
			<import-dialog
				ref="importDialog"
				action="api/monitor/common/ImportCarInfo"
				:template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
				:visibles.sync="importVisible"
				:append-to-body="true"
				@upload-success="importCarComplete"
			>
				<result-dialog
					:visibles.sync="resultVisible"
					:data="importResult"
					:text="'VIN码'"
					:keys="'vinNo'"
					:message="'无导入失败信息'"
					@export-fail="exportFail"
					@close="resultClose"
				>
				</result-dialog>
			</import-dialog>
		</div>
	</app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { duplicateRemoval } from "@/utils/base";
import { mapGetters } from "vuex";

// 混入
import selectCarDialog from "@/components/selectCarDialog";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import { addHandle } from "@/api/carMonitorSys/vehicleAddress";
import { exportFailCars } from "@/api/commont";

// request
export default {
	name: "AddTaskDialog",
	mixins: [partialForm, checkFormRule],
	components: { selectCarDialog, importDialog, resultDialog },
	props: {
		visibles: {
			type: Boolean,
			default: false,
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
	},
	watch: {
		visibles(e1) {
			if (e1) {
				// this.formInfo = { ...this.data }
			}
		},
	},
	created() {},
	data() {
		const validatecarStr = (rule, value, cb) => {
			if (this.selectCarList.length == 0) {
				return cb(new Error("请选择车辆"));
			}
		};
		return {
			formInfo: {},
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
						validator: this.validInput,
						tips: "请输入任务名称",
						formObjName: "formInfo",
					},
				],
				car: [
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
		// 关闭dialog
		closeDrawer() {
			this.formInfo = {};
			this.selectCarList = [];
			this.$emit("update:visibles", false);
		},
		showTaskList() {
			this.selectCarVisibles = true;
		},
		selectParams(e) {
			this.selectParamsList = [...e.idList];
			this.selectParamsItemList = [...e.itemList];
		},
		selectCarComplete(e) {
			this.selectCarList = duplicateRemoval([...e], "vinNo");
		},
		importCarComplete(data) {
			this.selectCarList = duplicateRemoval(
				[...this.selectCarList, ...data.successList],
				"vinNo"
			);
			if (data.failedList&&data.failedList.length > 0) {
        this.resultVisible = true;
        this.importResult = data;
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
		},
		exportFail(data) {
			exportFailCars(data)
		},
		resultClose() {
			this.$refs.importDialog.closeDialog();
		},
		handleClear() {
			this.selectCarList = [];
		},
		submitForm() {
			const formCheckLeft = this.checkForm({
				formName: "formLeft",
				formList: ["taskName", "car"],
			});
			if (!formCheckLeft) {
				return;
			}
			const postData = this.formInfo;
			const carId = [];
			const vinList = [];
			this.selectCarList.forEach((item) => {
				carId.push(item.carId);
				// vinList.push(item.vinNo);
				vinList.push(item.vinNoTotal);
			});
			postData.carInfos = carId.join(",");
			postData.vinList = vinList.join(",");
			this._createTask(postData);
		},
		// 新增
		_createTask(postData) {
			this.loading = true;
			addHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "新增成功",
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
