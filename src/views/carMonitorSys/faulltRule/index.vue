<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 授权按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
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
import { beginTimeAndEndTime } from "@/utils/base";
// request
import { getFaultRules, deleteFaultRules } from "@/api/carMonitorSys/faultRule";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";

// 辅助函数
import { mapGetters } from "vuex";
export default {
	name: "faulltRule",
	CN_name: "故障规则设置",
	components: {
		addUpdateDrawer,
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	computed: {
		...mapGetters(["commontData"]), // 获取所有按钮
		// 查询区数据
    searchList() {
      return [
        {
          label: "故障码",
          value: "faultCode",
          type: "input",
        },
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
      ];
    },
	},
	filters: {},
	data() {
		return {
			listQuery: {
				faultCode: "",
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "故障码",
					prop: "faultCode",
					width: 120,
					checked: true,
				},
				{
					value: "故障名称",
					prop: "faultCodeName",
					width: 120,
					checked: true,
				},
				{
					value: "规则表达式",
					prop: "ruleExpression",
					width: 120,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 120,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "DBC参数名称",
					prop: "parameterName",
					width: 140,
					checked: true,
				},
			],
			addUpdateVisible: false, // 新增修改dialog
			lookCarVisible: false, // 查看车辆权限dialog
			roleVisibles: false, // 兼职角色
			updatePwdVisible: false, // 重设密码
			isEdit: false, // false: 新增, true:编辑
			userData: {}, // 用户部分信息用于传递数据
		};
	},
	mounted() {},
	methods: {
		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportUser(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getFaultRules(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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
		// 新增
		handleAdd() {
			this.isEdit = false;
			this.addUpdateVisible = true;
		},
		// 新增完成
		addComplete() {
			this.listLoad();
			this.$message.success({
				message: "新增成功",
				duration: 2 * 1000,
			});
		},
		// 编辑
		handleUpdate(row) {
			if (row) this.tableRow = row;
			this.isEdit = true;
			this.addUpdateVisible = true;
			// 生成指定格式数据
			if (row.mainstationId) {
				row.stationArr = [row.companyId, row.departmentId, row.mainstationId];
			} else {
				if (row.departmentId) {
					row.stationArr = [row.companyId, row.departmentId];
				} else {
					if (row.companyId) {
						row.stationArr = [row.companyId];
					}
				}
			}
		},
		// 编辑成功
		updateComplete() {
			this.listLoad();
			this.$message.success({
				message: "编辑成功",
				duration: 2 * 1000,
			});
		},
		// 删除
		handleDelete(row) {
			const deleteData = {
				ruleId: row.ruleId,
			};
			this.$confirm(`是否删除${row.faultCode}故障码?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteFaultRules(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.$message.success({
								message: "删除成功",
								duration: 2 * 1000,
							});
							this.listLoad();
						}
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped>
.defaults {
	border-bottom: 1px solid #409eff;
}
.errors {
	border-bottom: 1px solid #ff0000;
}
</style>