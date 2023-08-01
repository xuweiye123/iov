<template>
	<app-dialog
		:visibles="visibles"
		:title="'诊断结果'"
		width="900px"
		top="8vh"
		@close-dialog="closeDialog"
		:isFooter="false"
		class="ordinary"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<el-row type="flex" justify="start" align="middle">
						<el-col :span="9" :style="{ 'font-weight': 'bold' }">
							<el-form>
								<el-form-item label="">
									{{ digResult }}
								</el-form-item>
							</el-form>
						</el-col>
						<!-- <el-col :span="6">
							<el-form
								:label-position="'right'"
								:rules="rules"
								:model="listQuery"
								ref="formLeft"
								label-width="54px"
							>
								<el-form-item label="周期：" prop="periodNum">
									<el-select
										v-model="listQuery.periodNum"
										placeholder="请选择"
										filterable
										clearable
										style="width:150px;"
									>
										<el-option
											v-for="item in periodNumOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
											style="width:150px;"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-form>
						</el-col> -->
						<el-col :span="6">
							<el-form
								:label-position="'right'"
								:model="listQuery"
								label-width="68px"
							>
								<el-form-item label="次数序号：">
									<el-select
										v-model="listQuery.countNum"
										placeholder="请选择"
										filterable
										clearable
										style="width:150px;"
									>
										<el-option
											v-for="item in countNumOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</div>
				<app-search-button
					slot="bottom"
					:isCollapse="false"
					:buttonName="'搜索'"
					@click-filter="handleFilter"
					:isdisabled="listLoading"
					:showEmpty="false"
				/>
			</app-search>
			<!-- table -->
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:tableHeights="tableHeight"
				:isShowOperation="false"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
	</app-dialog>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { partialForm } from "@/mixins/partialForm";
import { commonExport } from "@/mixins/getExportData";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import { getConfigData, getResult } from "@/api/diagnosisSys/offlineTask";
import { exportExcel } from "@/api/diagnosisSys/commont";
export default {
	doNotInit: true,
	name: "queryResult",
	mixins: [pagingMixin, partialForm, commonExport, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		subTaskId: {
			type: String,
			default: "",
		},
	},
	filters: {
		switchText(val) {
			return val == -1
				? "失效(被替换)"
				: val == 1
				? "待下发"
				: val == 2
				? "已下发"
				: val == 3
				? "执行中"
				: val == 4
				? "执行完成"
				: "执行异常";
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.clearData();
					this._getConfigData();
				}
			},
		},
	},
	data() {
		const validatePeriodNum = (rule, value, cb) => {
			if (!this.listQuery.periodNum) {
				return cb(new Error("请选择周期"));
			}
		};
		return {
			listQuery: { periodNum: "", countNum: "" },
			tableList: [
				{
					value: "诊断序号",
					prop: "num",
					checked: true,
					needMerge: true,
					width: 80,
				},
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					needMerge: false,
					width: 120,
				},
				{
					value: "诊断内容",
					prop: "digContent",
					checked: true,
					needMerge: false,
					width: 200,
				},
				{
					value: "诊断结果",
					prop: "digResult",
					checked: true,
					needMerge: false,
					width: 250,
				},
				{
					value: "异常描述",
					prop: "digNrcdes",
					checked: true,
					needMerge: false,
					width: 200,
				},
			],
			rowECUName: "",
			digResult: "已执行0次，每次执行0个诊断服务", //诊断结果
			periodNumOptions: [],
			countNumOptions: [],
			rules: {
				// periodNum: [
				// 	{ required: true, trigger: "change", validator: validatePeriodNum },
				// ],
			},
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.listQuery.subTaskId = this.subTaskId;
			getResult(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.total = data.total;
						this.list = this.getNewData(data.data);
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		clearData() {
			this.periodNumOptions.length = 0;
			this.countNumOptions.length = 0;
			this.list = [];
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery.periodNum = "";
			this.listQuery.countNum = "";
			this.listQuery.periodNum = 1;
			this.listQuery.pageNum = 1;
			this.list = [];
			this.total = 0;
			this.$emit("update:visibles", false);
		},
		_getConfigData() {
			getConfigData({ subTaskId: this.subTaskId }).then(({ data }) => {
				if (data.code === 0) {
					let d = data.data;
					if (d.uploadPeriodCount != "") {
						this.setPeriodNumOptions(d.uploadPeriodCount);
					}
					this.setCountNumOptions(d.dxCount);
					this.digResult =
						"已执行" +
						d.dxCount +
						"次，每次执行" +
						d.serviceCount +
						"个诊断服务";
					// if (d.uploadPeriodCount > 0) {
						// this.listQuery.periodNum = 1;
						this.listLoad();
					// }
				}
			});
		},
		setPeriodNumOptions(uploadPeriodCount) {
			if (uploadPeriodCount > 0) {
				for (let i = 1; i <= uploadPeriodCount; i++) {
					let obj = {};
					obj.value = i;
					obj.label = `第${i}周期`;
					this.periodNumOptions.push(obj);
				}
			}
		},
		setCountNumOptions(dxCount) {
			if (dxCount > 0) {
				for (let j = 1; j <= dxCount; j++) {
					let obj = {};
					obj.value = j;
					obj.label = j;
					this.countNumOptions.push(obj);
				}
			}
		},
		getNewData(data) {
			let nums = [];
			let count = 0;
			let p = {};
			data.forEach((item) => {
				let isStartMultiRow = false;
				if (!nums.includes(item.dxNum)) {
					count = 0;
					isStartMultiRow = true;
					nums.push(item.dxNum);
				}
				count++;
				p.dxNum = count;
				item.isStartMultiRow = isStartMultiRow;
			});
			data.forEach((r) => {
				if (r.isStartMultiRow) {
					r.rowCount = p.dxNum;
				}
			});
			return data;
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				if (row.isStartMultiRow) {
					return {
						rowspan: row.rowCount,
						colspan: 1,
					};
				} else {
					return {
						rowspan: 0,
						colspan: 0,
					};
				}
			}
		},
		handleExport() {
			if (this.list.length === 0) {
				this.$alert("暂无结果可导出", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			let tableData = [];
			this.list.forEach((element) => {
				let item = { ...element };
				tableData.push(item);
			});
			exportExcel(
				this.getExportData("离线任务诊断结果", this.filterTableList, tableData)
			);
		},
	},
};
</script>

<style lang="scss" scoped></style>
