<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择车辆'"
		:icon="'icon_car'"
		width="65%"
		top="5vh"
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
								<el-form-item label="项目代号：" prop="carTypeId">
									<el-select
										ref="batchId"
										v-model="listQuery.batchId"
										filterable
										clearable
										placeholder="请选择"
									>
										<el-option
											v-for="(item, index) in batchList"
											:key="index"
											:label="item.batchCode"
											:value="item.batchId"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10" v-show="collapse">
							<el-col :span="8">
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
					</el-form>
				</div>
				<app-search-button
					slot="bottom"
					@click-collapse="handleCollapse"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<div class="section-flex">
					<div style="padding-left:10px">
						车辆列表：
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
					rowKey="carId"
					ref="multiTable"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
					:tableHeights="tableHeight"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop === 'isOnline'">
							<svg-icon
								:icon-class="
									scope.row[scope.item.prop] === '1'
										? 'icon_online'
										: 'icon_offline'
								"
								style="font-size:14px;margin-right:4px"
							></svg-icon>
							<span>{{
								scope.row[scope.item.prop] | switchText(scope.item.prop)
							}}</span>
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
	doNotInit: true,
	name: "selectMultiCarDialog",
	mixins: [pagingMixin, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		primaryIdList: {
			type: Array,
			default: () => {
				return [];
			},
		},
		carTypeId: {
			type: String,
			default: "",
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
		visibles(e1) {
			if (e1) {
				if (this.primaryIdList.length === 0) {
					this.listQuery.pageNum = 1;
				}
				this.listLoad();
				this._getSupportCarTypeList();
			}
		},
	},
	data() {
		return {
			listQuery: { carTypeId: "" },
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
			itemList: [],
			carTypeList: [],
			batchList: [],
		};
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
						if (this.primaryIdList.length > 0) {
							let tableList = this.list;
							for (let i = 0; i < tableList.length; i++) {
								if (this.primaryIdList.indexOf(tableList[i].vinNo) > -1) {
									this.$refs.multiTable
										.refTable()
										.toggleRowSelection(tableList[i], true);
								}
							}
						}
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		handleSelectionChange(val) {
			this.itemList = val;
			if (val !== []) {
				this.rowVinno = "已选中" + val.length + "辆车";
			}
		},
		handleConfirm() {
			if (this.itemList === []) {
				this.$alert("请选中车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("carVinno", this.itemList);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery = {
				pageNum: 1,
				pageSize: 10,
				carTypeId: "",
				batchId: "",
				barcode: "",
				vinNo: "",
			};
			this.rowVinno = "";
			this.$refs.multiTable.refTable().clearSelection();
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
