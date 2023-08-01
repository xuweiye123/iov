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
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:is-collapse="false"
				:isdisabled="listLoading"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-add="handleAdd"
				@click-export="handleExport"
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
				:tableHeights="tableHeight"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-delete="handleDelete"
				@click-update="handleUpdate"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'variableType'">
						{{
							scope.row[scope.item.prop] == 0
								? "动态数据项"
								: scope.row[scope.item.prop] == 1
								? "故障数据项"
								: scope.row[scope.item.prop] == 2
								? "其他"
								: "-"
						}}
					</span>
					<span
						v-else-if="
							scope.item.prop === 'isChild' ||
								scope.item.prop === 'isStorage' ||
								scope.item.prop === 'isSingle' ||
								scope.item.prop === 'isFormula'
						"
					>
						<el-tag
							:type="
								scope.row[scope.item.prop] == 0
									? 'info'
									: scope.row[scope.item.prop] == 1
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							{{
								scope.row[scope.item.prop] == 0
									? "否"
									: scope.row[scope.item.prop] == 1
									? "是"
									: "-"
							}}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'searchType'">
						{{
							scope.row[scope.item.prop] == 0
								? "模糊查询"
								: scope.row[scope.item.prop] == 1
								? "精确查询"
								: "-"
						}}
					</span>
					<span v-else-if="scope.item.prop === 'searchChannel'">
						{{
							scope.row[scope.item.prop] == 0
								? "DBC参数列表"
								: scope.row[scope.item.prop] == 1
								? "故障码列表"
								: "-"
						}}
					</span>
					<span v-else>
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
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
import { getProtocolListMixin } from "@/mixins/dropList";
// request
import {
	getProtocolParam,
	deleteProtocolParam,
	exportProtocolVariable,
} from "@/api/transmitSys/protocolData";
//组件
import addUpdateDrawer from "./components/addUpdateDrawer";
export default {
	name: "protocolData",
	components: {
		addUpdateDrawer,
	},
	mixins: [
		pagingMixin,
		otherHeight,
		tableStyle,
		getPageButton,
		addUpdateAction,
		getProtocolListMixin,
	],
	data() {
		return {
			listQuery: {
				protocolId: "",
				variableType: "",
				variableName: "",
			},
			protocolList: [],
			variableList: [
				{
					label: "动态数据项",
					value: 0,
				},
				{
					label: "故障数据项",
					value: 1,
				},
				{
					label: "其他",
					value: 2,
				},
			],
			// 字段管理所需字段
			tableList: [
				{
					value: "协议名称",
					prop: "protocolName",
					width: 150,
					checked: true,
				},
				{
					value: "数据项名称",
					prop: "variableName",
					width: 150,
					checked: true,
				},
				{
					value: "数据项类型",
					prop: "variableType",
					width: 100,
					checked: true,
				},
				{
					value: "父级节点",
					prop: "variableParentName",
					width: 150,
					checked: true,
				},
				{
					value: "是否子节点",
					prop: "isChild",
					width: 90,
					checked: true,
				},
				{
					value: "是否存储",
					prop: "isStorage",
					width: 70,
					checked: true,
				},
				{
					value: "是否单选",
					prop: "isSingle",
					width: 70,
					checked: true,
				},
				{
					value: "是否可配公式",
					prop: "isFormula",
					width: 100,
					checked: true,
				},
				{
					value: "匹配方式",
					prop: "searchType",
					width: 80,
					checked: true,
				},
				{
					value: "匹配渠道",
					prop: "searchChannel",
					width: 100,
					checked: true,
				},
				{
					value: "匹配条件",
					prop: "searchCondition",
					width: 100,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 100,
					checked: true,
				},
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "协议名称",
					value: "protocolId",
					options: {
						data: this.protocolList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "select",
					label: "数据项类型",
					value: "variableType",
					options: {
						data: this.variableList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "数据项名称",
					value: "variableName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getProtocolParam(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		/**
		 * @name: 导出
		 */
		handleExport() {
			this.exportLoading = true;
			exportProtocolVariable(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: this.$t("addUpdateAction.exportSuccess"),
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 删除
		handleDelete({ variableId, protocolId, variableName }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteProtocolParam({ variableId, protocolId, variableName }).then(
						({ data }) => {
							if (data.code === 0) {
								this.deleteComplete();
							}
						}
					);
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped></style>
