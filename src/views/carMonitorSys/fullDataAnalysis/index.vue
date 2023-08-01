<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<el-form :model="listQuery" label-width="80px" style="width:100%">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="VIN码：">
								<vin-select  @vinNoTotal="getVinNoTotal" :is-vin="true" v-model="listQuery.vin" />
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
						<el-col :span="6" v-show="collapse">
							<el-form-item label="文件名称：">
								<el-input
									v-model="listQuery.sourceFileName"
									placeholder="请输入文件名称"
									clearable
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10" v-show="collapse">
						<el-col :span="6">
							<el-form-item label="文件类型：">
								<el-select
									v-model="listQuery.fileType"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in commontData.fileTypeList"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="解析状态：">
								<el-select
									v-model="listQuery.isAnalysis"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in analysisStatus"
										:key="index"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				@click-collapse="handleCollapse"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button :data="authouize" @click-filter="showfilter = true">
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:buttonList="tableAction"
				:isShowOperation="true"
				:isTableNumber="true"
				@click-analysis="handleAnalysis"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'isAnalysis'">
						{{
							commontData.analysisStatus.find(
								(item) => item.value == scope.row[scope.item.prop]
							).label
						}}
					</span>
					<span v-else-if="scope.item.prop === 'analysisState'">
						{{
							commontData.analysisStatus1.find(
								(item) => item.value == scope.row[scope.item.prop]
							).label
						}}
					</span>
					<span v-else-if="scope.item.prop === 'type'">
						{{
							commontData.fileTypeList.find(
								(item) => item.value == scope.row[scope.item.prop]
							).label
						}}
					</span>
					<span v-else-if="scope.item.prop == 'sourceFileName'">
						<el-tooltip
							class="item"
							effect="dark"
							:content="'点击下载文件'"
							placement="top"
						>
							<a :href="scope.row['sourceFileAddress']" class="vinNo">{{
								scope.row[scope.item.prop]
							}}</a>
						</el-tooltip>
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { beginTimeAndEndTime } from "@/utils/base";
// utils
import { getList, analysis } from "@/api/carMonitorSys/fullDataAnalysis";
import { mapGetters } from "vuex";
// 辅助函数
export default {
	name: "fullDataAnalysis",
	components: {},
	filters: {},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				fileType: "",
				vin: "",
				sourceFileName: "",
				isAnalysis: "",
				startTime: "",
				endTime: "",
				timeRange:["",""]
			},
			fileType: null,
			showfilter: false,
			listLoading: false,
			authouizeList: [],
			tableHeight: 0,
			total: 0,
			list: [],
			tableRow: {}, // 缓存点击tableRow数据
			actionWidth: 0,
			actionFixed: "right",
			// 字段管理所需字段
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					position: "center",
					width: 170,
					checked: true,
					fixed: "left",
				},
				{
					value: "文件名称",
					prop: "sourceFileName",
					position: "center",
					width: 230,
					checked: true,
				},
				{
					value: "是否解析",
					prop: "isAnalysis",
					position: "center",
					width: 100,
					checked: true,
				},
				{
					value: "解析后文件名",
					prop: "analysisFileName",
					position: "center",
					width: 180,
					checked: true,
				},
				{
					value: "文件接收时间",
					prop: "fileTime",
					position: "center",
					width: 180,
					checked: true,
				},
				{
					value: "接收时间",
					prop: "receiveTime",
					position: "center",
					width: 140,
					checked: true,
				},
				{
					value: "解析时间",
					prop: "analysisTime",
					position: "center",
					width: 140,
					checked: true,
				},
				{
					value: "解析状态",
					prop: "analysisState",
					position: "center",
					width: 90,
					checked: true,
				},
				{
					value: "解析人员",
					prop: "loginName",
					position: "center",
					width: 100,
					checked: true,
				},
				{
					value: "文件类型",
					prop: "type",
					position: "center",
					width: 100,
					checked: true,
				},
			],
		};
	},
	watch: {},
	computed: {
		...mapGetters(["commontData"]), // 获取公共数据
		filterTableList() {
			return this.tableList.filter((item) => item.checked);
		},
		// 表格头部按钮
		authouize() {
			// return this.authouizeList.filter((item) => {
			// 	return item.url === 'analysis';
			// });
			return [];
		},
		// table内部的按钮
		tableAction() {
			const res = this.authouizeList.filter((item) => {
				return item.url === "analysis";
			});
			if (res.length > 0) {
				if (res.length === 1) {
					this.actionWidth = 60;
				} else {
					this.actionWidth = res.length * 45;
				}
				this.actionFixed = "right";
			} else {
				this.actionFixed = "false";
			}
			return res;
		},
	},
	mounted() {
		// 暂时强行添加
		// this.authouizeList = [
		// 	{
		// 		functionName: "解析",
		// 		functionNameEn: "解析",
		// 		functionType: 2,
		// 		url: "analysis",
		// 		icon: "ic_log",
		// 		isShow: 1,
		// 	},
		// ];
	},
	methods: {
		handleAnalysis(row) {
			let params = {
				id: row.id,
				userId: this.$store.state.user.userInfo.userId,
				fileName: row.sourceFileName,
			};
			analysis(params).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "解析成功",
						duration: 2 * 1000,
					});
				}
			});
		},
		// handleClear() {
		// 	this.listQuery = {
		// 		pageNum: 1,
		// 		pageSize: 10,
		// 		vinNo: "",
		// 		terminalCode: "",
		// 		iccid: "",
		// 		barcode: "",
		// 		startTime: "",
		// 		endTime: "",

		// 	};
		// 		this.listLoad();
		// },
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
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
