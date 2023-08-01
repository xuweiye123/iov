<template>
	<div class="js-basedata-faultCode app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<el-form
					:label-position="'right'"
					:model="listQuery"
					label-width="90px"
				>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="VIN码：" label-width="65px">
								<vin-select :is-vin="true" @vinNoTotal="getVinNoTotal" v-model="listQuery.vinNo" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
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
						<!-- <el-col :span="6">
							<el-form-item label="开始时间：" prop="startDate">
								<el-date-picker
									v-model="listQuery.startDate"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="结束时间：" prop="endDate">
								<el-date-picker
									v-model="listQuery.endDate"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-form-item>
						</el-col> -->
						<el-col :span="6" v-show="collapse">
							<el-form-item label="车型名称：">
								<el-select
									v-model="listQuery.carTypeId"
									filterable
									clearable
									placeholder="请选择"
									@change="carTypeChange"
									@clear="carTypeClear"
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
					</el-row>
					<el-row
						:gutter="10"
						v-show="collapse"
					>
						<el-col :span="6">
							<el-form-item label="项目代号：" label-width="65px">
								<el-select
									v-model="listQuery.carBatchId"
									:disabled="xmdisabled"
									filterable
									clearable
									placeholder="请先选择车型名称"
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
						<el-col :span="6">
							<el-form-item label="CAN是否异常：">
								<el-select
									v-model="listQuery.canIsException"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in canList"
										:key="index"
										:label="item.text"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="DBC是否异常：">
								<el-select
									v-model="listQuery.dbcIsException"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in dbcList"
										:key="index"
										:label="item.text"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="GPS是否异常：">
								<el-select
									v-model="listQuery.gpsIsException"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in gpsList"
										:key="index"
										:label="item.text"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row
						:gutter="10"
						v-show="collapse"
					>
						<el-col :span="6">
							<el-form-item label="占位符" style="visibility: hidden;">
								<el-input />
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
				@click-clear="handleClearSearch"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-filter="showfilter = true"
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
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:tableHeights="tableHeight"
				:isTableNumber="true"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'vinNo'">
						{{ scope.row[scope.item.prop] }}
					</span>
					<span
						v-else-if="
							scope.item.prop === 'canIsException' ||
								scope.item.prop === 'gpsIsException'
						"
					>
						<el-tag
							:type="scope.row[scope.item.prop] == 0 ? 'success' : 'danger'"
							effect="dark"
							style="width: 80px;"
						>
							{{
								scope.row[scope.item.prop] == 0
									? "正常"
									: scope.row[scope.item.prop] == 1
									? "异常"
									: scope.row[scope.item.prop] == 2
									? "无历史数据"
									: scope.row[scope.item.prop]
							}}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'dbcIsException'">
						<el-tag
							:type="scope.row[scope.item.prop] == 0 ? 'success' : 'danger'"
							effect="dark"
							style="width: 100px;"
						>
							{{
								scope.row[scope.item.prop] == 0
									? "正常"
									: scope.row[scope.item.prop] == 1
									? "无DBC异常"
									: scope.row[scope.item.prop] == 2
									? "无历史数据"
									: scope.row[scope.item.prop] == 3
									? "未绑定终端异常"
									: scope.row[scope.item.prop]
							}}
						</el-tag>
					</span>
					<span v-else>{{
						scope.row[scope.item.prop] | processData
					}}</span>
				</template>
			</app-table>
		</div>
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
import { getYesterdayTime0, getYesterdayTime1 } from "@/utils/base";
// 组件
// request
import { getList } from "@/api/carMonitorSys/abnormalCar";
import { getBatchCodeInfo } from "@/api/carManageSys/carInform";
import { getCarTypeList } from "@/api/commont";
// 辅助函数
export default {
	name: "abnormalCar",
	CN_name: "异常车辆统计",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle,getPageButton],
	data() {
		return {
			listQuery: {
				vinNo: "",
				// startDate: getYesterdayTime0(),
				// endDate: getYesterdayTime1(),
				timeRange:[getYesterdayTime0(),getYesterdayTime1()],
				carTypeId: "",
				carBatchId: "",
				gpsIsException: "",
				canIsException: "",
				dbcIsException: "",
			},
			xmdisabled: true,
			batchList: [],
			carTypeList: [],
			gpsList: [
				{ text: "正常", value: "0" },
				{ text: "异常", value: "1" },
				{ text: "无历史数据", value: "2" },
			],
			canList: [
				{ text: "正常", value: "0" },
				{ text: "异常", value: "1" },
				{ text: "无历史数据", value: "2" },
			],
			dbcList: [
				{ text: "正常", value: "0" },
				{ text: "无DBC异常", value: "1" },
				{ text: "无历史数据", value: "2" },
				{ text: "未绑定终端异常", value: "3" },
			],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carTypeCode",
					checked: true,
					width: 120,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					checked: true,
					width: 120,
				},
				{
					value: "CAN是否异常",
					prop: "canIsException",
					checked: true,
					width: 120,
				},
				{
					value: "DBC是否异常",
					prop: "dbcIsException",
					checked: true,
					width: 140,
				},
				{
					value: "GPS是否异常",
					prop: "gpsIsException",
					checked: true,
					width: 120,
				},
				{
					value: "统计日期",
					prop: "date",
					width: 140,
					checked: true,
				},
			],
			detailVisible: false,
		};
	},
	computed: {
	},
	created() {},
	mounted() {
		getCarTypeList().then(({ data }) => {
			if (data.code === 0) {
				this.carTypeList = data.data || [];
			}
		});
	},
	methods: {
		carTypeChange(e) {
			if (!e) {
				return;
			}
			this.listQuery.carBatchId = "";
			this.batchList = [];
			const postData = {
				carTypeId: e,
			};
			this.xmdisabled = false;
			getBatchCodeInfo(postData).then(({ data }) => {
				if (data.code === 0) {
					this.batchList = data.data || [];
				}
			});
		},
		// 清空车型名称
		carTypeClear() {
			this.listQuery.carBatchId = "";
			this.batchList = [];
			this.xmdisabled = true;
		},
		// handleFilter() {
		//   this.listQuery.pageNum = 1;
		//   this.listQuery.orderfield && (this.listQuery.orderfield = "");
		//   this.listLoad();
		// },
		handleClearSearch() {
			this.listQuery.vinNo = "";
			this.listQuery.carTypeId = "";
			this.listQuery.carBatchId = "";
			this.listQuery.gpsIsException = "";
			this.listQuery.canIsException = "";
			this.listQuery.dbcIsException = "";
			this.listQuery.timeRange=[getYesterdayTime0(),getYesterdayTime1()];
			// this.listQuery.startDate = getYesterdayTime0();
			// this.listQuery.endDate = getYesterdayTime1();
			this.xmdisabled = true;
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listQuery.startDate=this.listQuery.timeRange?this.listQuery.timeRange[0]:'';
      this.listQuery.endDate=this.listQuery.timeRange?this.listQuery.timeRange[1]:'';
			this.listLoading = true;
			getList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
