<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'80px'"
				/>
			</div>
			<div slot="bottom">
				<!-- 清空查询按钮 -->
				<app-search-button
					:isCollapse="false"
					:isdisabled="listLoading"
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
				@click-add="handleAdd"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:buttonList="insideList"
				:tableHeights="tableHeight"
				:isShowOperation="true"
				@click-delete="handleDelete"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'createdBy'">
						{{
							scope.row[scope.item.prop]
								? scope.row[scope.item.prop].split("@")[0]
								: "-"
						}}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增修改dialog -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
		/>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// request
import {
	getSecurityLibList,
	deleteSecurityLib,
} from "@/api/diagnosisSys/securityLib";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
export default {
	name: "securityLib",
	components: {
		addUpdateDrawer,
	},
	mixins: [pagingMixin, otherHeight, getPageButton, addUpdateAction],
	data() {
		return {
			listQuery: {
				loginName: "",
				realName: "",
			},
			tableList: [
				{
					value: "安全库名称	",
					prop: "fileName",
					checked: true,
					width: 180,
				},
				{
					value: "创建人	",
					prop: "createdBy",
					width: 140,
					checked: true,
				},
				{
					value: "关联ECU名称",
					prop: "ecuName",
					width: 140,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					checked: true,
					width: 160,
				},
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "安全库名称",
					value: "fileName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getSecurityLibList(this.listQuery)
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
		// 删除
		handleDelete({ id, fileName }) {
			const deleteData = {
				securityLibId: id,
				securityLibName: fileName,
			};
			this.$confirm(`确定要删除这条数据吗？`, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteSecurityLib(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped></style>
