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
				@click-uploadRecord="handUploadLog"
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
				@click-import="handleClick"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop == 'uploadStatus'">
						<el-tag
							:type="
								scope.row.uploadStatus == '0'
									? 'success'
									: scope.row.uploadStatus == '1'
									? ''
									: scope.row.uploadStatus == '2'
									? 'success'
									: scope.row.uploadStatus == '3'
									? 'danger'
									: 'info'
							"
							effect="dark"
						>
							{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'uploadedBy'">
						{{
							scope.row[scope.item.prop]
								? scope.row[scope.item.prop].split("@")[0]
								: "-"
						}}
					</span>
					<span v-else> {{ scope.row[scope.item.prop] | processData }}</span>
				</template>
			</app-table>
		</div>
		<log-drawer :visibles.sync="uploadlogvisible" />
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getlogUpload,
	getcarTypeName,
	logUpload,
} from "@/api/diagnosisSys/tboxLog";
//组件
import logDrawer from "./components/logDrawer";
export default {
	name: "tboxLog",
	mixins: [pagingMixin, otherHeight, getPageButton],
	components: {
		logDrawer,
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
					type: "select",
					label: "下发状态",
					value: "uploadStatus",
					options: {
						data: this.uploadStatusList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
			];
		},
	},
	filters: {
		switchText(val, fieldName) {
			if (fieldName === "uploadStatus") {
				return val == 0
					? "初始"
					: val == 1
					? "下发中"
					: val == 2
					? "下发成功"
					: val == 3
					? "下发失败"
					: "-";
			} else {
				return val || (val === 0 ? val : "-");
			}
		},
	},
	data() {
		return {
			listQuery: {
				vinNo: "",
				carTypeId: "",
				uploadStatus: "",
			},
			uploadStatusList: [
				{ text: "初始", value: "0" },
				{ text: "下发中", value: "1" },
				{ text: "下发成功", value: "2" },
				{ text: "下发失败", value: "3" },
			],
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
					value: "下发状态",
					prop: "uploadStatus",
					checked: true,
					width: 140,
				},
				{
					value: "下发时间",
					prop: "uploadTime",
					checked: true,
					width: 140,
				},
				{
					value: "创建人",
					prop: "uploadedBy",
					checked: true,
					width: 140,
				},
				{
					value: "备注",
					prop: "uploadNote",
					checked: true,
					width: 140,
				},
			],
			carTypeNameList: [],
			uploadlogvisible: false,
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
			getlogUpload(this.listQuery)
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
		handleClick(e) {
			const postdata = {
				vin: e.vinNoTotal,
			};
			this.listLoading = true;
			logUpload(postdata)
				.then(({ data }) => {
					if (data.code === 0) {
						this.listLoad();
						this.$message.success({
							message: "上传命令下发成功",
						});
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		handUploadLog() {
			this.uploadlogvisible = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
