<template>
	<app-dialog
		:visibles.sync="visibles"
		width="62.5%"
		top="6vh"
		:title="'双击选择一个故障码'"
		@close-dialog="closeDialog"
		:isFooter="false"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form
					  :labelWidth="'60px'"
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
				</div>
				<app-search-button
					slot="bottom"
					:isdisabled="listLoading"
					:is-collapse="false"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<!-- table -->
			<div class="section-wrap">
				<app-table
					ref="tableList"
					size="mini"
					:listLoading="listLoading"
					:isTableSelection="false"
					:list="list"
					:pageObj="listQuery"
					:isTableNumber="true"
					:filterTableList="filterTableList"
					:total="total"
					:tableHeights="tableHeight"
					@row-dblclick="rowDblclick"
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
		</div>
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request

import { getfaultcode } from "@/api/carMonitorSys/faultRule";
// 组件
export default {
	name: "selectFaultDialog",
	mixins: [pagingMixin, tableStyle, dialogOtherHeight],
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
				faultCode: "",
			},
			tableList: [
				{
					value: "故障码",
					width: "100px",
					prop: "faultCode",
					checked: true,
				},
				{
					value: "故障名称",
					width: "130px",
					prop: "faultCodeName",
					checked: true,
				},
			],
		};
	},
	computed: {
     // 查询区数据
    searchList() {
      return [
        {
          label: "故障码",
          value: "faultCode",
          type: "input",
        },
      ];
    }
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {},
	methods: {
		listLoad() {
			this.listLoading = true;
			getfaultcode(this.listQuery)
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
		rowDblclick(row) {
			this.$emit("dblclick-select-fault", row);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>