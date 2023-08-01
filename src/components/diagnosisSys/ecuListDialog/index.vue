<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择ECU'"
		width="70%"
		top="5vh"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:loading="false"
		:isFooter="true"
	>
		<div class="box-list" slot="formContent">
			<app-search
				:show-title="false"
				style="border:none"
				:custom-class="'custom-search'"
			>
				<div slot="content">
					<el-row type="flex" justify="start" align="middle">
						<el-col :span="8">
							<el-form
								:label-position="'right'"
								:model="listQuery"
								label-width="90px"
								@submit.native.prevent
							>
								<el-form-item label="所属ECU名称：">
									<el-input
										v-model="listQuery.ecuName"
										placeholder="请输入ECU名称"
										clearable
										@keyup.enter.native="handleFilter"
									/>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</div>
				<div slot="bottom">
					<app-search-button
						:isCollapse="false"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<div class="section-wrap">
				<div class="section-flex">
						<div style="padding-left:10px">
							已选中ECU：
							<span class="textColor">
								{{ ecuName }}
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
					ref="singleTable1"
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
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span>
							{{
								scope.row[scope.item.prop] | processData
							}}</span
						>
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
import { getOdxList } from "@/api/diagnosisSys/faultCodeManagement";
export default {
	name: "carTypeListDialog",
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
		carTypeId: {
			type: String,
			default: "",
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.ecuName = this.data.ecuName;
					this.listLoad();
				}
			},
		},
	},
	data() {
		return {
			listQuery: {
				ecuName: "",
			},
			tableList: [
				{
					value: "ODX文件名",
					prop: "odxName",
					position: "center",
					checked: true,
					width: 300,
				},
				{
					value: "PDX文件名",
					prop: "pdxFileName",
					position: "center",
					checked: true,
					width: 220,
				},
				{
					value: "所属ECU名称",
					prop: "ecuName",
					position: "center",
					checked: true,
					width: 120,
				},
				{
					value: "波特率",
					prop: "baudrate",
					position: "center",
					checked: true,
					width: 100,
				},
				{
					value: "发送地址",
					prop: "sendAddress",
					position: "center",
					checked: true,
					width: 100,
				},
				{
					value: "接收地址",
					prop: "responseAddress",
					position: "center",
					checked: true,
					width: 100,
				},
				{
					value: "版本号",
					prop: "version",
					position: "center",
					checked: true,
					width: 60,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					position: "center",
					checked: true,
					width: 140,
				},
			],
			ecuName: "",
			tableRow: null,
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			if(this.carTypeId){
				this.listQuery.carTypeId = this.carTypeId;
			}
			getOdxList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.list.forEach((row) => {
							if (row.id == this.data.ecuId) {
								this.$refs.singleTable1.refTable().setCurrentRow(row);
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
			this.ecuName = row.ecuName;
			this.tableRow = row;
		},
		rowDblClick(row) {
			this.handleConfirm();
		},
		handleConfirm() {
			if (!this.tableRow) {
				this.$alert("请选中ECU", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("ecuId", this.tableRow);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.tableRow = null;
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
