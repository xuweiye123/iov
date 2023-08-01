<template>
	<app-drawer
		:visibles.sync="visibles"
		width="55%"
		:title="'车辆信息列表'"
		@close-drawer="closeDrawer"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
					  :spanNumber="8"
						:listQuery="listQuery"
						:searchList="searchList"
					/>
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					:is-collapse="false"
					slot="bottom"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<app-table
				ref="tableList"
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:tableHeights="tableHeight"
				:filterTableList="filterTableList"
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
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request
import { selectCarInfoPageList } from "@/api/carMonitorSys/offlineReporting";
export default {
	name: "lookFaultCarDialog",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle],
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
			},
			tableList: [
				{ 
					value: "VIN码", 
			  	prop: "vinNo", 
					checked: true,
					width:170,
				},
				{
					value: "车牌号码",
					prop: "licensePlate",
					checked: true,
					width:120,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					checked: true,
					width:120,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					checked: true,
					width:120,
				},
			],
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: 'vin',
        },
      ];
    },
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				vinNo: "",
				pageNum:1,
				pageSize:10
			};
			this.$emit("update:visibles", false);
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.vinList = this.data.vinList;
			this.listQuery.taskName = this.data.taskName;
			selectCarInfoPageList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.tableRow = {};
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
