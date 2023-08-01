<template>
	<app-drawer
		:visibles.sync="visibles"
		width="60%"
		:title="'历史故障列表'"
		:wrapperClosable="true"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search>
				<div slot="content">
					<el-form
						:label-position="'right'"
						:model="listQuery"
						label-width="90px"
					>
						<el-row :gutter="10" type="flex" justif="start" style="flex-wrap: wrap">
							<el-col :span="8">
								<el-form-item label="VIN码：">
									<vin-select  @vinNoTotal="getVinNoTotal" :is-vin="true" v-model="listQuery.vinNo" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="车型名称：">
									<el-select
										v-model="listQuery.carTypeId"
										filterable
										clearable
										placeholder="请选择"
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
							<el-col :span="8" v-show="collapse">
								<el-form-item label="项目代号：">
									<el-select
										v-model="listQuery.carBatchId"
										:disabled="xmdisabled"
										filterable
										clearable
										placeholder="请选择"
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
							<el-col :span="16" v-show="collapse">
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
						<!-- <el-col :span="8">	
              <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker
                  v-model="listQuery.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                  default-time="00:00:00">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="collapse" >
              <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                  v-model="listQuery.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                  default-time="23:59:59">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
							<el-col v-show="collapse" :span="8">
								<el-form-item label="故障名称：">
									<el-input
										v-model="listQuery.faultName"
										filterable
										clearable
										placeholder="请输入故障名称"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8" v-show="collapse">
								<el-form-item label="故障码：">
									<el-input
										v-model="listQuery.faultCodes"
										filterable
										clearable
										placeholder="请输入故障码"
									/>
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
					@click-clear="handleClearFault"
				/>
			</app-search>
			<div class="section-wrap">
				<app-authorize-button
				  :buttonLeft="[]"
          :buttonRight="headersRightList"
					:exportLoading="exportLoading"
					@click-export="handleExport"
					@click-filter="showfilter = true"
				>
					<checked-Filter
						slot="check-filter"
						:show.sync="showfilter"
						:list="tableList"
						:scroll-line="8"
					/>
				</app-authorize-button>
				<app-table
					ref="tableList"
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:tableHeights="tableHeight"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</template>
				</app-table>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { partialForm } from "@/mixins/partialForm";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

import { beginTimeAndEndTime } from "@/utils/base";
// request
import { getTaskDetail, exportHandle } from "@/api/carMonitorSys/historySearch";
import { getCarTypeList, getBatchCodeInfo } from "@/api/commont";
export default {
	doNotInit: true,
	name: "historyDetailDrawer",
	mixins: [pagingMixin, partialForm, drawerOtherHeight, tableStyle,getPageButton],
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
	data() {
		return {
			listQuery: {
				vinNo: "",
				carBatchId: "",
				carTypeId: "",
				startTime: "",
				endTime: "",
				faultName: "",
				faultCodes: "",
        timeRange:["",""],
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "车牌号码",
					prop: "licensePlate",
					width: 100,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					width: 95,
					checked: true,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					width: 95,
					checked: true,
				},
				{
					value: "VCU零部件号",
					prop: "vcuPartNumber",
					width: 120,
					checked: true,
				},
				{
					value: "MCU零部件号",
					prop: "mcuPartNumber",
					width: 123,
					checked: true,
				},
				{
					value: "故障名称",
					prop: "faultName",
					width: 95,
					checked: true,
				},
				{
					value: "故障码",
					prop: "faultCode",
					width: 90,
					checked: true,
				},
				{
					value: "故障类型",
					prop: "faultType",
					width: 90,
					checked: true,
				},
				{
					value: "自定义故障等级",
					prop: "faultLevel",
					width: 130,
					checked: true,
				},
				{
					value: "国标故障等级",
					prop: "gbFaultLevel",
					width: 120,
					checked: true,
				},
				{
					value: "零部件",
					prop: "partName",
					width: 90,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createTime",
					width: 140,
					checked: true,
				},
				{
					value: "故障开始时间",
					prop: "startTime",
					width: 160,
					checked: true,
				},
				{
					value: "故障结束时间",
					prop: "endTime",
					width: 160,
					checked: true,
				},
			],
			carTypeList: [],
			batchList: [],
			xmdisabled: true,
		};
	},
	computed: {

	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.carTypeListHandle();
				this.listLoad();
			}
		},
	},
	mounted() {
		this.headersRightList=[
			{
        functionName: "导出",
        functionNameEn: "导出",
        functionType: 2,
        iconType: 2,
        url: "export",
        icon: "export",
        isShow: 1,
      },
		]
	},
	methods: {
		restData() {
			this.listQuery = {
				vinNo: "",
				carBatchId: "",
				carTypeId: "",
				startTime: "",
				endTime: "",
				faultName: "",
				faultCodes: "",
				timeRange:["",""],
				pageNum:1,
				pageSize:10
			};
			this.collapse=false
			this.xmdisabled = true
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
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
		// 选择车型名称
		carTypeChange(e) {
			this.listQuery.carBatchId = "";
			this.batchList = [];
			const postdata = {
				carTypeId: e,
			};
			if (e == "") {
				this.batchList = [];
				this.xmdisabled = true;
			} else {
				this.xmdisabled = false;
				this.carBatchListHandle(postdata);
			}
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			this.listQuery.taskId = this.data.id;
			getTaskDetail(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.tableRow = {};
						this.list = data.data;
						this.total = data.total;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 清空
		handleClearFault() {
			this.listQuery = {
				vinNo: "",
				carBatchId: "",
				carTypeId: "",
				startTime: "",
				endTime: "",
				faultName: "",
				faultCodes: "",
				pageNum: 1,
				pageSize: 10,
				timeRange:["",""],
			};
			this.xmdisabled = true;
			this.listLoad()
			this.list = [];
			this.total = 0;
		},
		// 导出
		handleExport() {
			if(!this.total){
				this.$message.warning({
					message: "暂无数据，无法导出",
					duration: 2 * 1000,
				});
				return;
			}
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportHandle(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					//
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss" scoped></style>
