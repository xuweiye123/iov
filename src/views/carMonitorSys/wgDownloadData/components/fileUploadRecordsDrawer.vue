<template>
	<app-drawer
		:visibles.sync="visibles"
		width="60%"
		:title="'配置文件上传记录'"
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
						<el-row
							:gutter="10"
							type="flex"
							justif="start"
							style="flex-wrap: wrap"
						>
						  <el-col :span="8" >
								<el-form-item label="VIN码：">
									<vin-select
										@vinNoTotal="getVinNoTotal"
										:is-vin="true"
										v-model="listQuery.vinNo"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="文件名称：">
									<el-input
										v-model="listQuery.uploadFileName"
										filterable
										clearable
										placeholder="请输入文件名称"
									/>
								</el-form-item>
							</el-col>

							<el-col :span="8" v-show="collapse">
								<el-form-item label="上传状态：">
									<el-select
										v-model="listQuery.uploadStatus"
										filterable
										clearable
										placeholder="请选择"
									>
										<el-option
											v-for="(item, index) in uploadStatusList"
											:key="index"
											:label="item.label"
											:value="item.value"
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
			<div class="section-wrap">
				<app-authorize-button
					:buttonLeft="[]"
					:buttonRight="[]"
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
						<span v-if="scope.item.prop === 'uploadStatus'">
							<el-tag
								:type="
									scope.row[scope.item.prop] === 0
										? 'danger'
										: scope.row[scope.item.prop] === 1
										? 'success'
										: 'info'
								"
								effect="dark"
							>
								{{
									scope.row[scope.item.prop] === 0
										? "异常"
										: scope.row[scope.item.prop] === 1
										? "成功"
										: "-"
								}}
							</el-tag>
						</span>
						<span v-else-if="scope.item.prop == 'uploadFileSize'">
							{{ fileSizeConversion(scope.row[scope.item.prop]) }}
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
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
// request
import { getConfigUploadRecordList } from "@/api/carMonitorSys/wgDownloadData";
export default {
	doNotInit: true,
	name: "fileUploadRecordsDrawer",
	mixins: [pagingMixin, partialForm, drawerOtherHeight, tableStyle],
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
				startTime: "",
				endTime: "",
				uploadFileName: "",
				uploadStatus: "",
				timeRange: ["", ""],
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "文件名称",
					prop: "uploadFileName",
					width: 250,
					checked: true,
				},
				{
					value: "文件大小",
					prop: "uploadFileSize",
					width: 95,
					checked: true,
				},
				{
					value: "上传时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "操作人",
					prop: "createdBy",
					width: 120,
					checked: true,
				},
				{
					value: "上传状态",
					prop: "uploadStatus",
					width: 120,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 180,
					checked: true,
				},
			],
			uploadStatusList: [
				{
					label: "异常",
					value: 0,
				},
				{
					label: "成功",
					value: 1,
				},
			],
		};
	},
	computed: {},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {},
	methods: {
		//文件大小B转KB
		fileSizeConversion(limit) {
			const arr = [null, "", undefined, "undefined", "null"];
			if (limit <= 0) {
				return "0KB";
			}
			if (arr.includes(limit) || !limit) {
				return "-";
			}
			let kb = 1024;
			var kilobytes = limit / kb;
			return +kilobytes.toFixed(2) + "KB";
		},
		restData() {
			this.listQuery = {
				vinNo: "",
				uploadFileName: "",
				uploadStatus: "",
				startTime: "",
				endTime: "",
				timeRange: ["", ""],
				pageNum: 1,
				pageSize: 10,
			};
			this.collapse = false;
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime = this.listQuery.timeRange
				? this.listQuery.timeRange[0]
				: "";
			this.listQuery.endTime = this.listQuery.timeRange
				? this.listQuery.timeRange[1]
				: "";
			this.listLoading = true;
			getConfigUploadRecordList(this.listQuery)
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
		handleClear() {
			this.listQuery = {
				vinNo: "",
				startTime: "",
				endTime: "",
				uploadFileName: "",
				uploadStatus: "",
				pageNum: 1,
				pageSize: 10,
				timeRange: ["", ""],
			};
			this.listLoad();
			this.list = [];
			this.total = 0;
		},
	},
};
</script>

<style lang="scss" scoped></style>
