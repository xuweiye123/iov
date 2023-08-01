<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'100px'"
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
					<span v-if="scope.item.prop === 'isExtItem'">
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
	getProtocolModule,
	deleteProtocolModule,
	exportProtocolModule,
} from "@/api/transmitSys/protocolPlug";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
// 辅助函数
export default {
	name: "protocolPlug",
	components: {
		addUpdateDrawer,
	},
	filters: {},
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
				moduleName: "",
			},
			protocolList: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "协议名称",
					prop: "protocolName",
					width: 150,
					checked: true,
				},
				{
					value: "协议插件名称",
					prop: "moduleName",
					width: 180,
					checked: true,
				},
				{
					value: "协议插件模块",
					prop: "moduleValue",
					width: 150,
					checked: true,
				},
				{
					value: "是否扩展",
					prop: "isExtItem",
					width: 150,
					checked: true,
				},
				{
					value: "协议插件版本号",
					prop: "moduleVersion",
					width: 150,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 200,
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
					label: "协议插件名称",
					value: "moduleName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getProtocolModule(this.listQuery)
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
		/**
		 * @name: 导出
		 * @param {*}
		 */
		handleExport() {
			this.exportLoading = true;
			exportProtocolModule(this.listQuery).then(({ data }) => {
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
		handleDelete({ moduleId, moduleName }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteProtocolModule({ moduleId, moduleName }).then(({ data }) => {
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
