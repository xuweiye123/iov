<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form :listQuery="listQuery" :searchList="searchList" />
			</div>
			<div slot="bottom">
				<!-- 清空查询按钮 -->
				<app-search-button
					:isCollapse="false"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</div>
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
				:buttonList="insideList"
				:tableHeights="tableHeight"
				:isShowOperation="true"
				@click-detail="handleDetail"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop == 'uploadStatus'">
						<el-tag
							:type="
								scope.row.uploadStatus == 0
									? 'dark'
									: scope.row.uploadStatus == 1
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'sourceFileName'">
						<el-tooltip
							v-if="scope.row.sourceFileAddress"
							class="item"
							effect="dark"
							:content="'点击下载文件'"
							placement="top"
						>
							<a :href="scope.row.sourceFileAddress" class="vinNo">{{
								scope.row[scope.item.prop] | processData
							}}</a>
						</el-tooltip>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</span>
					<span v-else> {{ scope.row[scope.item.prop] | processData }}</span>
				</template>
			</app-table>
		</div>
		<detail-drawer :visibles.sync="detailVisible" :data="tableRow" />
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getTboxLogList,
	getcarTypeName,
} from "@/api/diagnosisSys/tboxDiagnosisLog";
//组件
import detailDrawer from "./components/detailDrawer";
export default {
	name: "tboxDiagnosisLog",
	mixins: [pagingMixin, otherHeight, getPageButton],
	components: {
		detailDrawer,
	},
	computed: {
		searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vin",
				},
				{
					type: "select",
					label: "车型名称",
					value: "carTypeId",
					options: {
						data: this.carTypeNameList, //下拉数组
						extraProps: {
							label: "carTypeName",
							value: "carTypeId",
						},
					},
				},
				{
					type: "input",
					label: "操作模块",
					value: "operateModule",
				},
			];
		},
	},
	filters: {
		switchText(val, fieldName) {
			if (fieldName === "uploadStatus") {
				return val == 0 ? "上传中" : val == 1 ? "成功" : "-";
			} else {
				return val || (val === 0 ? val : "-");
			}
		},
	},
	data() {
		return {
			listQuery: {
				vin: "",
				carTypeId: "",
				operateModule: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: 160,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					checked: true,
					width: 100,
				},
				{
					value: "操作模块",
					prop: "operateModule",
					checked: true,
					width: 140,
				},
				{
					value: "文件名称",
					prop: "sourceFileName",
					checked: true,
					width: 300,
				},
				{
					value: "上传时间",
					prop: "receiveTime",
					checked: true,
					width: 140,
				},
				{
					value: "上传状态",
					prop: "uploadStatus",
					checked: true,
					width: 140,
				},
				// {
				// 	value: "备注",
				// 	prop: "remark",
				// 	checked: true,
				// 	width: 250,
				// },
			],
			carTypeNameList: [],
			detailVisible: false,
		};
	},
	mounted() {
		this.getcarTypeNameList();
	},
	methods: {
		// 车型名称
		getcarTypeNameList() {
			getcarTypeName(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.carTypeNameList = data.data;
				}
			});
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getTboxLogList(this.listQuery)
				.then(({ data }) => {
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
		handleDetail(row) {
			if (!row.id) {
				this.$message.warning({
					message: "文件未上传",
					duration: 2 * 1000,
				});
				return;
			}
			this.tableRow = row;
			this.detailVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
