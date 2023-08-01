<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<el-form
					:label-position="'right'"
					:model="listQuery"
					:label-width="collapse ? '160px' : '80px'"
				>
					<el-row :gutter="10">
						<el-col :span="collapse ? 8 : 6">
							<el-form-item label="VIN码：">
								<vin-select  @vinNoTotal="getVinNoTotal" :is-vin="true" v-model="listQuery.vinNo" />
							</el-form-item>
						</el-col>
						<el-col :span="collapse ? 16 : 12">
              <el-form-item label="时间范围：" prop="timeRange">
                <el-date-picker
                  v-model="listQuery.timeRange"
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

						<!-- <el-col :span="collapse ? 8 : 6">
							<el-form-item label="开始日期：">
								<el-date-picker
									v-model="listQuery.startTime"
									filterable
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="collapse ? 8 : 6">
							<el-form-item label="结束日期：">
								<el-date-picker
									v-model="listQuery.endTime"
									filterable
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								/>
							</el-form-item>
						</el-col> -->
					</el-row>
					<el-row v-show="collapse" :gutter="10">
						<el-col :span="8">
							<el-form-item label="项目代号：">
								<el-select
									v-model="listQuery.batchId"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in allBatchList"
										:key="index"
										:label="item.carBatchCode"
										:value="item.carBatchId"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="16">
              <el-form-item label="最后有效ODO里程时间范围：" prop="timeRange1">
                <el-date-picker
                  v-model="listQuery.timeRange1"
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
						<!-- <el-col :span="8">
							<el-form-item label="最后有效ODO里程开始时间：">
								<el-date-picker
									v-model="listQuery.odoMileStartTime"
									filterable
									placeholder="请选择"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="最后有效ODO里程结束时间：">
								<el-date-picker
									v-model="listQuery.odoMileEndTime"
									filterable
									placeholder="请选择"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
								/>
							</el-form-item>
						</el-col> -->
					</el-row>
					<el-row v-show="collapse" :gutter="10">
						<el-col :span="8">
							<el-form-item label="GPS累计总里程大于：">
								<el-input
									v-model="listQuery.accumulatedMileage"
									controls-position="right"
									type="number"
									clearable
								/>
								<i class="mileage-i">公里</i>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="ODO累计总里程大于：">
								<el-input
									v-model="listQuery.ecuMileage"
									controls-position="right"
									type="number"
									clearable
								/>
								<i class="mileage-i">公里</i>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="ODO日行驶里程大于：">
								<el-input
									v-model="listQuery.dayOfEcuMileage"
									controls-position="right"
									type="number"
									clearable
								/>
								<i class="mileage-i">公里</i>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="collapse" :gutter="10">
						<el-col :span="8">
							<el-form-item label="GPS日行驶里程大于：">
								<el-input
									v-model="listQuery.dayOfMileage"
									controls-position="right"
									type="number"
									clearable
								/>
								<i class="mileage-i">公里</i>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="ODO累计计算里程大于：">
								<el-input
									v-model="listQuery.accOdoMileage"
									controls-position="right"
									type="number"
									clearable
								/>
								<i class="mileage-i">公里</i>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				@click-collapse="handleCollapse"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- <p style="margin: 12px 0 0 10px">里程统计查询</p> -->
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-filter="showfilter = true"
				@click-export="handleExport"
				@click-exportData="handExportData"
				@click-import-select="importVisible = true"
				@click-exportQuery="handExportQuery"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
				/>
			</app-authorize-button>
			<!-- table -->
			<app-table
				:listLoading="listLoading"
				size="mini"
				:isTableSelection="false"
				:list="list"
				:pageObj="listQuery"
				:isTableNumber="true"
				:filterTableList="filterTableList"
				:total="total"
				:tableHeights="tableHeight"
				@sort-change="sortChange"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<!-- <span v-if="scope.item.prop === 'ecuMileage'">
						<span v-if="scope.row.remark" class="vinNo" @click="seeRemark(scope.row)">
							 {{ scope.row[scope.item.prop] }}
						</span>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</span> -->
					<span>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<export-data-drawer :visibles.sync="exportDataVisible" :file-type="fileType" />
		<export-query-drawer :taskType="2" :visibles.sync="exportQueryVisible"/>
		<!-- 导入dialog弹窗 -->
		<import-dialog
		  :title="'导入查询'"
			action="api/monitor/car/importCarInfo"
			:template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
			:visibles.sync="importVisible"
			@upload-success="reloadList"
			:append-to-body="true"
			:data="{ taskType: 2 }"
			:maxNumber='5000'
		>
			<result-dialog
				:visibles.sync="resultVisible"
				:data="importResult"
				:text="'VIN码'"
				:keys="'vinNo'"
				:is-show="false"
			>
			</result-dialog>
		</import-dialog>

			<app-dialog
				:title="'里程统计异常描述'"
				:visibles.sync="remarkVisable"
				@close-dialog="remarkVisable = false"
				style="margin-top: 20vh; min-height: 100px"
				width="40%"
				:append-to-body="true"
				class="ordinary"
			>
			<div slot="formContent">
				<div style="word-break: break-all; white-space: pre-line">
					{{ tableRow.remark }}
				</div>
			</div>
		</app-dialog>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import {
	// getToday,
	// getYesterday,
	getDaysBetween,
	getTodayTime0,
	getTodayEndTime,
	beginTimeAndEndTime
} from "@/utils/base";
// request
import {
	getMileagePageList,
	mileageExport,
	downloadExcel,
} from "@/api/carMonitorSys/odoMileage";
// 组件
import exportDataDrawer from "@/components/exportDataDrawer";
import exportQueryDrawer from "@/components/exportQueryDrawer";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import { getBatchAll } from "@/api/commont";
export default {
	name: "mileageSearch",
	CN_name: "里程统计查询",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	components: {
		exportDataDrawer,
		importDialog,
		resultDialog,
		exportQueryDrawer,
	},
	data() {
		return {
			listQuery: {
				batchId: "",
				vinNo: "",
				licensePlate: "",
				ecuMileage: "",
				accumulatedMileage: "",
				dayOfMileage: "",
				dayOfEcuMileage: "",
				// startTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:["",""],
				timeRange1:["",""],
				odoMileStartTime: null,
				odoMileEndTime: null,
				accOdoMileage: "",
			},
			allBatchList: [],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "统计日期",
					prop: "dateTime",
					width: 140,
					checked: true,
				},
				{
					value: "项目代号",
					prop: "batchCode",
					width: 100,
					checked: true,
				},
				{
					value: "GPS日行驶里程(km)",
					prop: "dayOfMileage",
					width: 160,
					checked: true,
				},
				{
					value: "GPS累计总里程(km)",
					prop: "accumulatedMileage",
					width: 160,
					checked: true,
				},
				{
					value: "ODO日行驶里程(km)",
					prop: "dayOfEcuMileage",
					width: 160,
					checked: true,
				},
				{
					value: "ODO累计总里程(km)",
					prop: "ecuMileage",
					width: 160,
					checked: true,
				},
				{
					value: "ODO累计计算里程(km)",
					prop: "accOdoMileage",
					width: 160,
					checked: true,
				},
				{
					value: "最后有效ODO里程时间",
					prop: "lastMeterTravelTime",
					width: 160,
					checked: true,
				},
				{
					value: "最后的仪表里程",
					prop: "lastEcuMileage",
					width: 170,
					checked: true,
				},
			],
			exportDataVisible: false,
			exportQueryVisible: false,
			importVisible: false,
			resultVisible: false,
			remarkVisable: false,
			importResult: {},
			fileType:null
		};
	},
	computed: {
		
	},
	created() {},
	mounted() {
		getBatchAll().then(({ data }) => {
			if (data.code === 0) {
				this.allBatchList = data.data || [];
			}
		});
	},
	methods: {
		// 导入成功之后刷新list
		reloadList(data) {
			// this.importResult = data;
			this.importVisible = false;
			// this.$alert(
			// 	"导入成功且查找到" + data.successList.length + "条数据",
			// 	"提示",
			// 	{
			// 		confirmButtonText: "下载",
			// 	}
			// )
			// 	.then(() => {
			// 		downloadExcel().then(({ data }) => {
			// 			if (data.code === 0) {
			// 				this.$message.success({
			// 					message: "下载成功",
			// 					duration: 2 * 1000,
			// 				});
			// 			}
			// 		});
			// 	})
			// 	.catch(() => {});
			// this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listQuery.odoMileStartTime=this.listQuery.timeRange1?this.listQuery.timeRange1[0]:''
      this.listQuery.odoMileEndTime=this.listQuery.timeRange1?this.listQuery.timeRange1[1]:''
			this.list = [];
			// if (
			// 	!this.listQuery.vinNo &&
			// 	!this.listQuery.endTime &&
			// 	!this.listQuery.startTime
			// ) {
			// 	this.$message.warning({
			// 		message: "请输入VIN,否则只能查询一天之内的数据!",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (this.listQuery.endTime && !this.listQuery.startTime) {
			// 	this.$message.warning({
			// 		message: "请选择开始日期!",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (!this.listQuery.endTime && this.listQuery.startTime) {
			// 	this.$message.warning({
			// 		message: "请选择结束日期!",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (!this.listQuery.vinNo) {
			// 	if (
			// 		getDaysBetween(this.listQuery.startTime, this.listQuery.endTime) > 1
			// 	) {
			// 		this.$message.warning({
			// 			message: "请输入VIN,否则只能查询一天之内的数据!",
			// 			duration: 2 * 1000,
			// 		});
			// 		return;
			// 	}
			// }
			this.listLoading = true;
			getMileagePageList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						if (data.data && data.data.length > 0) {
							this.list.forEach((item) => {
								item.dateTime = item.dateTime.substring(0, 11);
							});
						}
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 导入任务详情
		handExportQuery() {
			this.exportQueryVisible = true;
		},
		//导出记录
		handExportData() {
			this.exportDataVisible = true;
			this.fileType = 6;
		},
		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listQuery.odoMileStartTime=this.listQuery.timeRange1?this.listQuery.timeRange1[0]:''
      this.listQuery.odoMileEndTime=this.listQuery.timeRange1?this.listQuery.timeRange1[1]:''
			let postData = { ...this.listQuery };
			delete postData["pageNum"];
			delete postData["pageSize"];
			this.exportLoading = true;
			mileageExport(postData).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "任务创建成功，请在导出记录中查看生成进度",
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// handleClearSearch() {
		// 	this.listQuery = {
		// 		pageNum: 1,
		// 		pageSize: 10,
		// 		batchId: "",
		// 		vinNo: "",
		// 		licensePlate: "",
		// 		ecuMileage: "",
		// 		accumulatedMileage: "",
		// 		dayOfMileage: "",
		// 		dayOfEcuMileage: "",
		// 		// startTime: getTodayTime0(),
		// 		// endTime: getTodayEndTime(),
		// 		timeRange:[getTodayTime0(), getTodayEndTime()],
		// 		timeRange1:["",""],
		// 		odoMileStartTime: "",
		// 		odoMileEndTime: "",
		// 		accOdoMileage: "",
		// 	};
		// 	this.list = [];
		// 	this.total = 0;
		// 	this.listLoad();
		// },
		seeRemark(row) {
			console.log(row,"row")
			this.tableRow=row
			this.remarkVisable = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.mileage-i {
	position: absolute;
	right: 25px;
	top: 0;
	font-style: normal;
	font-size: 12px;
}

a,
a:hover,
a:active {
	text-decoration: none;
	cursor: pointe;
	cursor: pointer;
}
// a {
// 	color: red;
// }
::v-deep .el-dialog {
	min-height: 100px;
}
::v-deep .el-dialog__body {
	font-size: 14px;
	text-align: left;
}
::v-deep .el-dialog__headerbtn {
	background: linear-gradient(#0bc9ff, #014fff);
	margin-top: -16px;
	margin-right: -10px;
}
::v-deep .el-dialog__title {
	font-size: 14px;
}

.el-table .cell div {
	white-space: pre-line !important;
}
</style>