<template>
	<div class="js-basedata-cargroup app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<el-form
					:label-position="'right'"
					:model="listQuery"
					label-width="100px"
				>
					<el-row :gutter="10" type="flex" justif="start" style="flex-wrap: wrap">
						<el-col :span="6">
							<el-form-item label="VIN码：">
								<vin-select  @vinNoTotal="getVinNoTotal" :is-vin="true" v-model="listQuery.vinNo" />
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
								<!-- 	:picker-options="pickerOptions" -->
                </el-date-picker>
              </el-form-item>
            </el-col>
						<!-- <el-col :span="6">
							<el-form-item label="开始时间：" prop="startTime">
								<el-date-picker
									v-model="listQuery.startTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="结束时间：" prop="endTime">
								<el-date-picker
									v-model="listQuery.endTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-form-item>
						</el-col> -->
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="车型名称：">
								<el-select
									v-model="listQuerys.carTypeId"
									multiple
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
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="项目代号：">
								<el-select
									v-model="listQuerys.batchId"
									:disabled="xmdisabled"
									multiple
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
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="VCU零部件号：">
								<el-input
									v-model="listQuery.vcuPartNumber"
									filterable
									clearable
									placeholder="请输入VCU零部件号"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="MCU零部件号：">
								<el-input
									v-model="listQuery.mcuPartNumber"
									filterable
									clearable
									placeholder="请输入MCU零部件号"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6" v-show="collapse">
							<el-form-item label="故障名称：">
								<el-input
									v-model="listQuery.faultName"
									filterable
									clearable
									placeholder="请输入故障名称"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="故障码：">
								<el-input
									v-model="listQuery.faultCode"
									filterable
									clearable
									placeholder="请输入故障码"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="故障类型：">
								<el-select
									v-model="listQuery.faultType"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in faultTypeList"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="自定义故障等级：">
								<el-select
									v-model="listQuerys.faultLevel"
									multiple
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in faultLevelList"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="国标故障等级：">
								<el-select
									v-model="listQuerys.gbFaultLevel"
									multiple
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in gbFaultLevelList"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" v-show="collapse">
              <el-form-item label="创建时间范围：" prop="timeRange1">
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
						<!-- <el-col :span="6"  v-show="collapse">
							<el-form-item label="创建开始时间：" prop="cStartTime">
								<el-date-picker
									v-model="listQuery.cStartTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6"  v-show="collapse">
							<el-form-item label="创建结束时间：" prop="cEndTime">
								<el-date-picker
									v-model="listQuery.cEndTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-form-item>
						</el-col> -->
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
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-filter="showfilter = true"
				@click-export="handleExport"
				@click-exportData="handleExportData"
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
				@row-click="rowClick"
				@sort-change="sortChange"
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
		<!-- 导出记录 -->
		<export-data-drawer
			:file-type="fileType"
			:visibles.sync="exportDataVisible"
		/>
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
import { getTodayTime0, getTodayEndTime, getDaysBetween,beginTimeAndEndTime } from "@/utils/base";
// request
import {
	gethistoryfaultpagelist,
	exportHitToExcel,
	downloadExcel,
} from "@/api/carMonitorSys/historyError";
import {
	getCarTypeListMultiple,
	getBatchCodeInfoMultiple,
} from "@/api/commont";
import exportDataDrawer from "@/components/exportDataDrawer";
export default {
	name: "historyError",
	CN_name: "历史故障记录",
	doNotInit: true,
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	components: { exportDataDrawer },
	data() {
		return {
			listQuerys: {
				batchId: [],
				carTypeId: [],
				gbFaultLevel: [],
				faultLevel: [],
			},
			listQuery: {
				vinNo: "",
				gbFaultLevelStr: "",
				faultLevelStr: "",
				carTypeIdStr: "",
				batchIdStr: "",
				// batchId: "",
				// carTypeId: "",
				// gbFaultLevel: "",
				// faultLevel: "",
				faultName: "",
				faultType: null,
				// startTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:["",""],
				faultCode: "",
				vcuPartNumber: "",
				mcuPartNumber: "",
				cStartTime: "",
				cEndTime: "",
				timeRange1:["",""],
				defaultValue: "",
			},
			fileType: null,
			gbFaultLevelList: [
				{ label: "一级", value: 1 },
				{ label: "二级", value: 2 },
				{ label: "三级", value: 3 },
			],
			faultLevelList: [
				{ label: "一级", value: 1 },
				{ label: "二级", value: 2 },
				{ label: "三级", value: 3 },
				{ label: "四级", value: 4 },
			],
			faultTypeList: [
				{ label: "国标故障", value: 1 },
				{ label: "自定义故障", value: 2 },
			],
			carTypeList: [],
			batchList: [],
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
					width: 95,
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
					prop: "carPartCode",
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
			authouizeList: [],
			xmdisabled: true, // 控制项目代号是否可点击
			importVisible: false,
			resultVisible: false,
			importResult: {},
			exportDataVisible: false,
			selectDate:'',
      // pickerOptions: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.selectDate = minDate? minDate.getTime():''
      //     if (maxDate) {
      //       this.selectDate = ''
      //     }
      //   },
      //   disabledDate: (time) => {
      //    if (this.selectDate !== '') {
      //       const one = 0 * 24 * 3600 * 1000
      //       const minTime = this.selectDate - one
      //       const maxTime = this.selectDate + one
      //       return time.getTime() < minTime || time.getTime() > maxTime
      //     }
      //   }
      // },
		};
	},
	computed: {
	},
	created() {},
	mounted() {
		// 获取车辆型号
		this.carTypeListHandle();
	},
	methods: {
		// 车辆型号
		carTypeListHandle() {
			getCarTypeListMultiple().then(({ data }) => {
				if (data.code === 0) {
					this.carTypeList = data.data || [];
				}
			});
		},
		// 项目代码
		carBatchListHandle(postdata) {
			getBatchCodeInfoMultiple(postdata).then(({ data }) => {
				if (data.code === 0) {
					this.batchList = data.data || [];
				}
			});
		},
		// 选择车型名称
		carTypeChange(e) {
			this.listQuerys.batchId = [];
			this.listQuery.batchIdStr = "";
			this.batchList = [];
			const cartypeString = e.join(",");
			const postdata = {
				carTypeId: cartypeString,
			};
			if (cartypeString === "") {
				this.batchList = [];
				this.xmdisabled = true;
			} else {
				this.xmdisabled = false;
				this.carBatchListHandle(postdata);
			}
		},
		// 导入成功之后刷新list
		reloadList(data) {
			this.importResult = data;
			this.importVisible = false;
			this.$alert(
				"导入成功且查找到" + data.successList.length + "条数据",
				"提示",
				{
					confirmButtonText: "下载",
				}
			)
				.then(() => {
					downloadExcel().then(({ data }) => {
						if (data.code === 0) {
							//
						}
					});
				})
				.catch(() => {});
			// this.listLoad()
		},
		// 清空
		handleClearFault() {
			this.listQuerys = {
				batchId: [],
				carTypeId: [],
				gbFaultLevel: [],
				faultLevel: [],
			};
				this.listQuery = {
					vinNo: "",
					gbFaultLevelStr: "",
					faultLevelStr: "",
					carTypeIdStr: "",
					batchIdStr: "",
					// batchId: "",
					// carTypeId: "",
					// gbFaultLevel: "",
					// faultLevel: "",
					faultName: "",
					faultType: null,
					// startTime: getTodayTime0(),
					// endTime: getTodayEndTime(),
					timeRange:["",""],
					faultCode: "",
					vcuPartNumber: "",
					mcuPartNumber: "",
					cStartTime: "",
					cEndTime: "",
					timeRange1:["",""],
					defaultValue: "",
					pageNum: 1,
					pageSize: 10,
				};
			this.xmdisabled = true;
			this.list = [];
			this.total = 0;
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listQuery.cStartTime=this.listQuery.timeRange1?this.listQuery.timeRange1[0]:''
      this.listQuery.cEndTime=this.listQuery.timeRange1?this.listQuery.timeRange1[1]:''
			// if (!this.listQuery.vinNo) {
			// 	this.$message.warning({
			// 		message: "请填写VIN码",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (!this.listQuery.startTime || !this.listQuery.endTime) {
			// 	this.$message.warning({
			// 		message: "请填写开始时间和结束时间！",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (
			// 	getDaysBetween(this.listQuery.startTime, this.listQuery.endTime) > 1
			// ) {
			// 	this.$message.warning({
			// 		message: "查询日期超过一天，请前往历史故障离线查询！",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			if (this.listQuerys.batchId.length) {
				this.listQuery.batchIdStr = this.listQuerys.batchId.join(",");
			} else {
				this.listQuery.batchIdStr = "";
			}
			if (this.listQuerys.carTypeId.length) {
				this.listQuery.carTypeIdStr = this.listQuerys.carTypeId.join(",");
			} else {
				this.listQuery.carTypeIdStr = "";
			}
			if (this.listQuerys.gbFaultLevel.length) {
				this.listQuery.gbFaultLevelStr = this.listQuerys.gbFaultLevel.join(",");
			} else {
				this.listQuery.gbFaultLevelStr = "";
			}
			if (this.listQuerys.faultLevel.length) {
				this.listQuery.faultLevelStr = this.listQuerys.faultLevel.join(",");
			} else {
				this.listQuery.faultLevelStr = "";
			}
			this.listLoading = true;
			// if (this.listQuery.faultcodeString != "") {
			// 	this.listQuery.faultCode = this.listQuery.faultcodeString.split(",");
			// } else {
			// 	this.listQuery.faultCode = [];
			// }

			gethistoryfaultpagelist(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.list = data.data || [];
						this.total = data.total || 0;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 点击列
		rowClick(row) {
			this.tableRow = {};
			this.list.some((item, index) => {
				if (item.carpartid === row.carpartid) {
					row.$index = index;
				}
			});
			this.tableRow = row;
		},
		// 判断是否选中
		tableRowIsSlect() {
			const { $index } = this.tableRow;
			if ($index === undefined) {
				return false;
			} else {
				return true;
			}
		},

		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listQuery.cStartTime=this.listQuery.timeRange1?this.listQuery.timeRange1[0]:''
      this.listQuery.cEndTime=this.listQuery.timeRange1?this.listQuery.timeRange1[1]:''
			if (this.listQuerys.batchId.length) {
				this.listQuery.batchIdStr = this.listQuerys.batchId.join(",");
			} else {
				this.listQuery.batchIdStr = "";
			}
			if (this.listQuerys.carTypeId.length) {
				this.listQuery.carTypeIdStr = this.listQuerys.carTypeId.join(",");
			} else {
				this.listQuery.carTypeIdStr = "";
			}
			if (this.listQuerys.gbFaultLevel.length) {
				this.listQuery.gbFaultLevelStr = this.listQuerys.gbFaultLevel.join(",");
			} else {
				this.listQuery.gbFaultLevelStr = "";
			}
			if (this.listQuerys.faultLevel.length) {
				this.listQuery.faultLevelStr = this.listQuerys.faultLevel.join(",");
			} else {
				this.listQuery.faultLevelStr = "";
			}
			this.exportLoading = true;
			exportHitToExcel(this.listQuery).then(({ data }) => {
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
		//导出记录
		handleExportData() {
			this.fileType = 8;
			this.exportDataVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
