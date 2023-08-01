<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:collapse="collapse"
					:listQuery="listQuery"
					:searchList="searchList"
				/>
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				@click-collapse="handleCollapse"
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
					<span v-if="scope.item.prop === 'faultLevel'">
						{{
							scope.row[scope.item.prop] == 0
								? "不报警"
								: scope.row[scope.item.prop] == 1
								? "一级故障"
								: scope.row[scope.item.prop] == 2
								? "二级故障"
								: scope.row[scope.item.prop] == 3
								? "三级故障"
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
	getFaultCode,
	deleteFaultCode,
	exportFaultCode,
} from "@/api/transmitSys/faultCode";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
export default {
	name: "faultCode",
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
				faultLevel: "",
				faultName: "",
				faultCode: "",
			},
			faultLevelList: [
				{ label: "不报警", value: 0 },
				{ label: "一级故障", value: 1 },
				{ label: "二级故障", value: 2 },
				{ label: "三级故障", value: 3 },
			],
			protocolList: [],
			tableList: [
				{
					value: "协议名称",
					prop: "protocolName",
					width: 150,
					checked: true,
				},
				{
					value: "故障名称",
					prop: "faultName",
					width: 180,
					checked: true,
				},
				{
					value: "故障码",
					prop: "faultCode",
					width: 150,
					checked: true,
				},
				{
					value: "故障等级",
					prop: "faultLevel",
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
					type: "input",
					label: "故障名称",
					value: "faultName",
				},
				{
					type: "input",
					label: "故障码",
					value: "faultCode",
				},
				{
					type: "select",
					label: "故障等级",
					value: "faultLevel",
					options: {
						data: this.faultLevelList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
			];
		},
	},
	methods: {
		/**
		 * @name: 导出
		 * @param {*}
		 */
		handleExport() {
			this.exportLoading = true;
			exportFaultCode(this.listQuery).then(({ data }) => {
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
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getFaultCode(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 删除
		handleDelete({ faultId, faultName, protocolId }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteFaultCode({ faultId, faultName, protocolId }).then(
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
