<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择车辆'"
		width="70%"
		top="8vh"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:isFooter="true"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<el-form :model="listQuery" label-width="85px">
						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="VIN码：">
									<vin-select
										:is-vin="true"
										v-model="listQuery.vinNo"
										@vinNoTotal="getVinNoTotal"
									></vin-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="车型名称：" prop="carTypeId">
									<el-select
										v-model="listQuery.carTypeId"
										filterable
										clearable
										placeholder="请选择"
										@change="loadBatch"
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
								<el-form-item label="TBOXSN：">
									<el-input
										v-model="listQuery.barcode"
										placeholder="请输入TBOXSN"
										clearable
										maxlength="20"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="collapse">
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
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<div class="section-flex">
					<div style="padding-left:10px">
						已选中车辆：
						<span class="textColor">
							{{ rowVinno }}
						</span>
					</div>
					<app-authorize-button @click-filter="showfilter = true">
						<checked-Filter
							slot="check-filter"
							:show.sync="showfilter"
							:list="tableList"
							:scroll-line="8"
						/>
					</app-authorize-button>
				</div>
				<!-- table -->
				<app-table
					slot="table"
					rowKey="id"
					ref="singleTable"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
					:tableHeights="tableHeight"
					@row-click="rowClick"
					@row-dblclick="rowDblClick"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop === 'isOnline'">
							<el-tag
								:type="
									scope.row.isOnline === '0'
										? 'info'
										: scope.row.isOnline === '1'
										? 'success'
										: 'info'
								"
								effect="dark"
							>
								{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
							</el-tag>
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</template>
				</app-table>
			</div>
		</div>
	</app-dialog>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import {
	getSupportCarTypeList,
	getBachCodeList,
	getCarList,
} from "@/api/diagnosisSys/commont";
export default {
	name: "selectCarDialog",
	doNotInit: true,
	mixins: [pagingMixin, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: {},
		},
	},
	filters: {
		switchText(val, fieldName) {
			if (fieldName === "isOnline") {
				let onlineStr = "离线";
				if (val === "1") {
					onlineStr = "在线";
				}
				return onlineStr;
			}
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.listLoad();
					this._getSupportCarTypeList();
					if (this.data.vinNo) {
						this.rowVinno = this.data.vinNo;
						this.tableRow = this.data;
					}
				}
			},
		},
	},
	data() {
		return {
			listQuery: {
				vinNo: "",
				carTypeId: "",
				barcode: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: 160,
				},
				{
					value: "是否在线",
					prop: "isOnline",
					checked: true,
					width: 80,
				},
				{
					value: "TBOXSN",
					prop: "barcode",
					checked: true,
					width: 160,
				},
				{
					value: "车型名称",
					prop: "carTypeCode",
					checked: true,
					width: 120,
				},
				{
					value: "项目代号",
					prop: "batchCode",
					checked: true,
					width: 120,
				},
			],
			rowVinno: "",
			carTypeList: "",
			batchList: "",
			tableRow: null,
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo",
				},
				{
					type: "select",
					label: "车型名称",
					value: "carTypeId",
					options: {
						data: this.carTypeList, //下拉数组
						extraProps: {
							label: "carTypeName",
							value: "carTypeId",
						},
					},
				},
				{
					type: "input",
					label: "TBOXSN",
					value: "barcode",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getCarList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.list.forEach((row) => {
							if (row.vinNo == this.data.vinNo) {
								this.$refs.singleTable.refTable().setCurrentRow(row);
							}
						});
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 点击列
		rowClick({ row }) {
			if (row) this.tableRow = row;
			this.rowVinno = row.vinNo;
		},
		rowDblClick(row) {
			if (row) this.tableRow = row;
			this.handleConfirm();
		},
		handleConfirm() {
			if (!this.tableRow) {
				this.$alert("请选中授权车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("carVinno", this.tableRow);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.handleClear();
			this.tableRow = null;
			this.rowVinno = "";
			this.$emit("update:visibles", false);
		},
		_getSupportCarTypeList() {
			getSupportCarTypeList().then(({ data }) => {
				if (data.code === 0) {
					this.carTypeList = data.data || [];
				}
			});
		},
		loadBatch(val) {
			if (this.listQuery.batchId) {
				this.listQuery.batchId = "";
			}
			getBachCodeList({ carTypeId: val }).then(({ data }) => {
				if (data.code === 0) {
					this.batchList = data.data;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
