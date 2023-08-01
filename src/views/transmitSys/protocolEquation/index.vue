<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<el-form :model="listQuery" label-width="70px" style="width: 100%">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="协议名称：">
								<el-select
									v-model="listQuery.protocolId"
									filterable
									placeholder="请选择"
									clearable
									@change="_getProtocolParamList"
								>
									<el-option
										v-for="(item, index) in protocolList"
										:label="item.text"
										:value="item.value"
										:key="index"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="协议数据项：" label-width="80px">
								<el-select
									v-model="listQuery.variableId"
									filterable
									placeholder="请选择"
									clearable
								>
									<el-option
										v-for="(item, index) in protocolParamList"
										:label="item.text"
										:value="item.value"
										:key="index"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="公式名称：">
								<el-input
									v-model="listQuery.formulaName"
									placeholder="请输入公式名称"
									clearable
									maxlength="20"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:tableHeights="tableHeight"
				:buttonList="insideList"
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
	getFormula,
	deleteFormula,
	exportProtocolFormula,
} from "@/api/transmitSys/protocolEquation";
import { getProtocolParamList } from "@/api/transmitSys/commont";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
// 辅助函数
export default {
	name: "protocolEquation",
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
				formulaName: "",
				protocolId: "",
				variableId: "",
			},
			protocolList: [],
			protocolParamList: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "协议名称",
					prop: "protocolName",
					width: 150,
					checked: true,
				},
				{
					value: "协议数据项",
					prop: "variableName",
					width: 100,
					checked: true,
				},
				{
					value: "公式名称",
					prop: "formulaName",
					width: 150,
					checked: true,
				},
				{
					value: "显示公式",
					prop: "formulaText",
					width: 200,
					checked: true,
				},
				{
					value: "公式值",
					prop: "formulaValue",
					width: 200,
					checked: true,
				},
				{
					value: "入口参数",
					prop: "formulaParam",
					width: 80,
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
	methods: {
		// 获取协议数据项
		_getProtocolParamList(val) {
			this.listQuery.variableId = "";
			if (val) {
				const params = {
					protocolId: val,
					selectType: 1,
					isFormula: 1,
				};
				getProtocolParamList(params).then(({ data }) => {
					if (data.code === 0) {
						this.protocolParamList = data.data;
					}
				});
			} else {
				this.protocolParamList = [];
			}
		},
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getFormula(this.listQuery)
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
			exportProtocolFormula(this.listQuery).then(({ data }) => {
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
		handleDelete({ formulaId, protocolId, formulaName }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteFormula({ formulaId, protocolId, formulaName }).then(
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
