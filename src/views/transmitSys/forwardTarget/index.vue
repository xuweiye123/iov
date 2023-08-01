<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:collapse="collapse"
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'100px'"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:tableHeights="tableHeight"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-delete="handleDelete"
				@click-update="handleUpdate"
				@click-notForward="handleNotForward"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'targetType'">
						{{
							scope.row[scope.item.prop] == 0
								? "国家平台"
								: scope.row[scope.item.prop] == 1
								? "地方平台"
								: scope.row[scope.item.prop] == 2
								? "企业平台"
								: "-"
						}}
					</span>
					<span v-else-if="scope.item.prop === 'isPassword'">
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
					<span v-else-if="scope.item.prop === 'serviceType'">
						{{
							scope.row[scope.item.prop] == 0
								? "对公平台"
								: scope.row[scope.item.prop] == 1
								? "对私平台"
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
		<!-- 配置不转发协议项 -->
		<detail-drawer
			:visibles.sync="detailVisible"
			:data="tableRow"
			@set-complete="setComplete"
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
// request
import {
	getForwardTarget,
	deleteForwardTarget,
	exportForwardTarget,
} from "@/api/transmitSys/forwardTarget";
import { getProtocolModuleList } from "@/api/transmitSys/commont";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import detailDrawer from "./components/detailDrawer";
export default {
	name: "forwardTarget",
	components: {
		addUpdateDrawer,
		detailDrawer,
	},
	mixins: [
		pagingMixin,
		otherHeight,
		tableStyle,
		getPageButton,
		addUpdateAction,
	],
	data() {
		return {
			listQuery: {
				moduleId: "",
				targetName: "",
				serviceType: "",
				targetType: "",
			},
			protocolModuleList: [],
			targetTypeList: [
				{
					label: "国家平台",
					value: 0,
				},
				{
					label: "地方平台",
					value: 1,
				},
				{
					label: "企业平台",
					value: 2,
				},
			],
			serviceTypeList: [
				{
					label: "对公平台",
					value: 0,
				},
				{
					label: "对私平台",
					value: 1,
				},
			],
			detailVisible: false,
			// 字段管理所需字段
			tableList: [
				{
					value: "协议插件名称",
					prop: "moduleName",
					width: 150,
					checked: true,
				},
				{
					value: "目标平台名称",
					prop: "targetName",
					width: 150,
					checked: true,
				},
				{
					value: "目标平台IP",
					prop: "targetIp",
					width: 150,
					checked: true,
				},
				{
					value: "目标平台性质",
					prop: "targetType",
					width: 110,
					checked: true,
				},
				{
					value: "服务类型",
					prop: "serviceType",
					width: 70,
					checked: true,
				},
				{
					value: "是否需要密码",
					prop: "isPassword",
					width: 100,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 140,
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
					label: "协议插件名称",
					value: "moduleId",
					options: {
						data: this.protocolModuleList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "目标平台名称",
					value: "targetName",
				},
				{
					type: "input",
					label: "目标平台IP",
					value: "targetIp",
				},
				{
					type: "select",
					label: "目标平台性质",
					value: "targetType",
					options: {
						data: this.targetTypeList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
				{
					type: "select",
					label: "服务类型",
					value: "serviceType",
					options: {
						data: this.serviceTypeList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
			];
		},
	},
	mounted() {
		this._getProtocolModuleList();
	},
	methods: {
		// 获取协议插件名称
		_getProtocolModuleList() {
			getProtocolModuleList().then(({ data }) => {
				if (data.code === 0) {
					this.protocolModuleList = data.data;
				}
			});
		},
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getForwardTarget(this.listQuery)
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
			exportForwardTarget(this.listQuery).then(({ data }) => {
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
		// 设置不转发数据项
		handleNotForward(row) {
			if (row) this.tableRow = row;
			this.detailVisible = true;
		},
		// 设置成功
		setComplete() {
			this.listLoad();
			this.$message.success({
				message: "设置成功",
				duration: 2 * 1000,
			});
		},
		// 删除
		handleDelete({ targetId, targetName }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteForwardTarget({ targetId, targetName }).then(({ data }) => {
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
