<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:is-collapse="false"
				:isdisabled="listLoading"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-filter="showfilter = true"
				@click-add="handleAdd"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-update="handleUpdate"
				@click-delete="handleDelete"
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
		<!-- 新增编辑dialog弹窗 -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
// request
import { getPageList, deleteHandle } from "@/api/carMonitorSys/SOClow";
export default {
	name: "SOClow",
	CN_name: "SOC过低提醒规则",
	components: { addUpdateDrawer },
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				ruleName: "",
			},
			tableList: [
				{
					value: "规则名称",
					prop: "ruleName",
					checked: true,
					width: 160,
				},
				{
					value: "报警表达式",
					prop: "alarmLevelExpression",
					checked: true,
					width: 300,
				},
				{
					value: "持续多久未上线(天)",
					prop: "notOnlineDays",
					checked: true,
					width: 150,
				},
			],
			addUpdateVisible: false,
			isEdit: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "规则名称",
          value: "ruleName",
          type: "input",
        },
			]
		}
	},
	mounted() {},
	methods: {
		// 导入成功之后刷新list
		reloadList() {
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getPageList(this.listQuery)
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
		// 新增
		handleAdd() {
			this.isEdit = false;
			this.addUpdateVisible = true;
		},
		// 新增成功
		addComplete() {
			this.listLoad();
		},
		// 编辑
		handleUpdate(row) {
			if (row) this.tableRow = row;
			this.isEdit = true;
			this.addUpdateVisible = true;
		},
		// 编辑成功
		updateComplete() {
			this.listLoad();
		},
		// 删除
		handleDelete(row) {
			if (row) this.tableRow = row;
			const deleteData = {
				id: this.tableRow.oid,
				ruleName: this.tableRow.ruleName,
			};
			this.$confirm(`是否删除 ${this.tableRow.ruleName}?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteHandle(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.listLoad();
							this.$message.success({
								message: "删除成功",
								duration: 2 * 1000,
							});
						}
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped></style>