<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'90px'"
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
				:buttonList="insideList"
				:isShowOperation="true"
				@click-update="handleUpdate"
				@click-delete="handleDelete"
				@click-export="exportOfflineConfig"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						v-if="scope.item.prop === 'configName'"
						class="vinNo"
						@click="querySevice(scope.row)"
					>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
					<span v-else-if="scope.item.prop === 'state'">{{
						scope.row[scope.item.prop] | switchText
					}}</span>
					<span v-else-if="scope.item.prop === 'progress'">
						<el-progress
							:percentage="+scope.row[scope.item.prop]"
						></el-progress>
					</span>
					<span v-else-if="scope.item.prop === 'createdBy'">
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
		<!-- 新增修改drawer -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
		<query-service :visibles.sync="queryServiceVisible" :configId="configId" />
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
	getConfigList,
	deleteConfig,
	exportConfig,
} from "@/api/diagnosisSys/offlineConfig";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import queryService from "./components/queryService";
export default {
	name: "offlineConfig",
	mixins: [pagingMixin, otherHeight, addUpdateAction, getPageButton],
	components: {
		addUpdateDrawer,
		queryService,
	},
	data() {
		return {
			listQuery: {
				configName: "",
			},
			tableList: [
				{
					value: "诊断周期名称",
					prop: "configName",
					checked: true,
					width: 250,
				},
				{
					value: "诊断周期",
					prop: "period",
					checked: true,
					width: 80,
				},
				{
					value: "诊断次数",
					prop: "dxNum",
					checked: true,
					width: 80,
				},
				{
					value: "诊断服务数量",
					prop: "serviceCount",
					checked: true,
					width: 100,
				},
				{
					value: "创建人",
					prop: "createdBy",
					checked: true,
					width: 140,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					checked: true,
					width: 120,
				},
				{
					value: "备注",
					prop: "remark",
					checked: true,
					width: 200,
				},
			],
			queryServiceVisible: false, // 查看功能权限dialog
			configId: "", //周期诊断配置的id
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "诊断周期名称",
					value: "configName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getConfigList(this.listQuery)
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
		handleDelete({ id, configName }) {
			this.$confirm(`确定要删除这条数据吗`, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteConfig({
						id,
						configName,
					}).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		querySevice({ id }) {
			this.configId = id;
			this.queryServiceVisible = true;
		},
		exportOfflineConfig({ id, configName }) {
			exportConfig({ id, configName });
		},
	},
};
</script>

<style lang="scss" scoped></style>
