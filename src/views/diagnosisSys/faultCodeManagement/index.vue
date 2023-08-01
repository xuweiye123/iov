<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form :labelWidth="'90px'" :listQuery="listQuery" :searchList="searchList" />
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
				@click-import="importVisible = true"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:tableHeights="tableHeight"
				:buttonList="insideList"
				:isShowOperation="true"
				@click-update="handleUpdate"
				@click-delete="handleDelete"
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
		<!-- 新增修改dialog -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
		<!-- 导入dialog弹窗 -->
		<import-dialog
			action="api/diagnosis/faultErrorCode/importFaultCode"
			:template-url="'file/template/faultImport.xlsx'"
			:visibles.sync="importVisible"
			@upload-success="reloadList"
			:maxNumber="5000"
		>
			<result-dialog
				:visibles.sync="resultVisible"
				:data="importResult"
				@export-fail="exportFail"
			/>
		</import-dialog>
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
	getFaultCodeList,
	deleteFaultCode,
	exportErrorMessage,
} from "@/api/diagnosisSys/faultCodeManagement";
// 组件
import AddUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/importDialog";
import resultDialog from "./components/resultDialog";
// 辅助函数
export default {
	name: "faultCodeManagement",
	mixins: [pagingMixin, otherHeight, addUpdateAction, getPageButton],
	components: {
		AddUpdateDrawer,
		importDialog,
		resultDialog,
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "故障码",
					value: "faultCode",
				},
				{
					type: "input",
					label: "故障码描述",
					value: "codeDescription",
				},
				{
					type: "input",
					label: "ECU名称",
					value: "ecuName",
				},
			];
		},
	},
	data() {
		return {
			listQuery: {
				codeDescription: "",
				faultCode: "",
				ecuName: "",
			},
			importVisible: false,
			resultVisible: false,
			importResult: {},
			tableList: [
				{
					value: "故障码",
					prop: "faultCode",
					position: "center",
					checked: true,
					fixed: "left",
					width: 160,
				},
				{
					value: "故障码描述",
					prop: "codeDescription",
					position: "center",
					checked: true,
					width: 180,
				},
				{
					value: "ECU名称",
					prop: "ecuName",
					position: "center",
					checked: true,
					width: 100,
				},
				{
					value: "关联车型",
					prop: "carTypeName",
					position: "center",
					checked: true,
					width: 100,
				},
				{
					value: "解决方案",
					prop: "solution",
					position: "center",
					checked: true,
					width: 140,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					position: "center",
					checked: true,
					width: 140,
				},
				{
					value: "创建人",
					prop: "createdName",
					position: "center",
					checked: true,
					width: 100,
				},
			],
		};
	},
	methods: {
		// 导入成功之后刷新list
		reloadList(data) {
			if (data.errorList && data.errorList.length > 0) {
				this.importResult = data;
				this.resultVisible = true;
			} else {
				this.resultVisible = false;
				this.importVisible = false;
			}
			this.listLoad();
		},
		//导入失败原因
		exportFail(errorList) {
			exportErrorMessage({ errorList }).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success("导出成功");
				}
			});
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getFaultCodeList(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 删除
		handleDelete({ id, faultCode }) {
			this.$confirm(`确定要删除这条数据吗？`, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteFaultCode({ id, faultCode }).then(({ data }) => {
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
