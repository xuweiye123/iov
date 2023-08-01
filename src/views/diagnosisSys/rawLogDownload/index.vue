<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:labelWidth="'80px'"
					:collapse="collapse"
					:listQuery="listQuery"
					:searchList="searchList"
				/>
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:buttonList="insideList"
				:isShowOperation="true"
				:isTableNumber="true"
				@click-analysis="handleAnalysis"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'isAnalysis'">
						<el-tag
							:type="
								scope.row.isAnalysis == '0'
									? 'info'
									: scope.row.isAnalysis == '1'
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							{{
								commontData.analysisStatus.find(
									(item) => item.value == scope.row[scope.item.prop]
								).label
							}}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'analysisState'">
						<el-tag
							:type="
								scope.row.analysisState === 0
									? 'info'
									: scope.row.analysisState === 1
									? 'success'
									: scope.row.analysisState === -1
									? 'danger'
									: 'info'
							"
							effect="dark"
						>
							{{
								commontData.analysisStatus1.find(
									(item) => item.value == scope.row[scope.item.prop]
								).label
							}}
						</el-tag>
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
								scope.row[scope.item.prop] | processData
							}}</a>
						</el-tooltip>
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
				<template slot="tableOperation" slot-scope="scope">
					<el-tooltip
						v-for="(l, index) in insideList"
						:key="index"
						:open-delay="250"
						class="item"
						effect="dark"
						:disabled="$store.state.app.isDisTooltip"
						:content="l.functionName"
						placement="top"
					>
						<span
							class="card-action"
							v-if="scope.row['type'] == 0"
							@click="handleAnalysis(scope.row)"
						>
							<i :class="'iconfont icon-' + l.icon"></i>
						</span>
					</el-tooltip>
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
// utils
import { beginTimeAndEndTime } from "@/utils/base";
import { getList, analysis } from "@/api/diagnosisSys/rawLogDownload";
import { mapGetters } from "vuex";
// 辅助函数
export default {
	name: "rawLogDownload",
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
				timeRange:["",""],
			},
			fileType: null,
			// 字段管理所需字段
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 160,
					checked: true,
				},
				{
					value: "文件名称",
					prop: "sourceFileName",
					width: 330,
					checked: true,
				},
				{
					value: "是否解析",
					prop: "isAnalysis",
					width: 80,
					checked: true,
				},
				{
					value: "解析后文件名",
					prop: "analysisFileName",
					width: 350,
					checked: true,
				},
				{
					value: "文件接收时间",
					prop: "fileTime",
					width: 140,
					checked: true,
				},
				{
					value: "接收时间",
					prop: "receiveTime",
					width: 140,
					checked: true,
				},
				{
					value: "解析时间",
					prop: "analysisTime",
					width: 140,
					checked: true,
				},
				{
					value: "解析状态",
					prop: "analysisState",
					width: 100,
					checked: true,
				},
				{
					value: "解析人员",
					prop: "loginName",
					width: 120,
					checked: true,
				},
				{
					value: "文件类型",
					prop: "type",
					width: 70,
					checked: true,
				},
			],
		};
	},
	computed: {
		...mapGetters(["commontData"]), // 获取公共数据
		searchList() {
			return [
				{
					label: "VIN码",
					value: "vin",
					type: "vin",
				},
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
				// {
				// 	label: "开始时间",
				// 	value: "startTime",
				// 	type: "dateTime",
				// },
				// {
				// 	label: "结束时间",
				// 	value: "endTime",
				// 	type: "dateTime",
				// 	defaultType: "end",
				// },
				{
					label: "文件名称",
					value: "sourceFileName",
					type: "input",
				},
				{
					label: "文件类型",
					value: "fileType",
					type: "select",
					options: {
						data: this.commontData.fileTypeList,
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
				{
					label: "解析状态",
					value: "isAnalysis",
					type: "select",
					options: {
						data: this.commontData.analysisStatus,
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
			];
		},
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
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
		
			this.listLoading = true;
			getList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					this.total = 0;
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
