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
				:tableHeights="tableHeight"
				:buttonList="insideList"
				:isShowOperation="true"
				@click-delete="handleDelete"
				@click-update="handleUpdate"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增修改drawer -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
		<sub-system-select
			:visibles.sync="subSystemSelectVisible"
			@setSubSystemName="setSubSystemName"
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
import { getOdxList, deleteOdxData } from "@/api/diagnosisSys/odxFileManage";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import SubSystemSelect from "@/components/diagnosisSys/selectSubSystem";
export default {
	name: "odxFileManage",
	mixins: [pagingMixin, otherHeight, addUpdateAction, getPageButton],
	components: {
		addUpdateDrawer,
		SubSystemSelect,
	},
	data() {
		return {
			listQuery: {
				subSystemName: "",
				ecuClassId: "",
				ecuName: "",
			},
			tableList: [
				{
					value: "ODX文件名",
					prop: "odxName",
					checked: true,
					width: 300,
				},
				// {
				// 	value: "PDX文件名",
				// 	prop: "pdxFileName",
				// 	checked: true,
				// 	width: 180,
				// },
				{
					value: "所属ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: "波特率",
					prop: "baudrate",
					checked: true,
					width: 100,
				},
				{
					value: "发送地址",
					prop: "sendAddress",
					checked: true,
					width: 100,
				},
				{
					value: "接收地址",
					prop: "responseAddress",
					checked: true,
					width: 100,
				},
				{
					value: "版本号",
					prop: "version",
					checked: true,
					width: 60,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
			],
			subSystemSelectVisible: false,
			lookFunctionVisible: false, // 查看功能权限dialog
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "ECU名称",
					value: "ecuName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getOdxList(this.listQuery)
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
		handleDelete({ id, ecuName }) {
			this.$confirm(`确定要删除这条数据吗？`, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteOdxData({ ecuId: id, ecuName }).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		selectSubSystem() {
			this.subSystemSelectVisible = true;
		},
		setSubSystemName({ subSystemName, id }) {
			this.listQuery.subSystemName = subSystemName;
			this.listQuery.ecuClassId = id;
		},
	},
};
</script>

<style lang="scss" scoped></style>
