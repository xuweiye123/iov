<template>
	<div class="js-basedata-cargroup app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-filter="showfilter = true"
				@click-add="handleAdd"
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
				:listLoading="listLoading"
				size="mini"
				:isTableSelection="false"
				:list="list"
				:pageObj="listQuery"
				:isTableNumber="true"
				:filterTableList="filterTableList"
				:total="total"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				@click-delete="handleDelete"
				:buttonList="insideList"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'fileName'">
						<el-tooltip 
							v-if="scope.row[scope.item.prop] && scope.row['taskStatus']== 3"
							class="item" 
							effect="dark" 
							:content="'点击下载文件'"
							placement="top">
						<a
							:href="
								scope.row['downloadPath']
							"
							class="vinNo"
						>
							{{ scope.row[scope.item.prop] | processData}}
						</a>
						</el-tooltip>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</span>
					<span v-else-if="scope.item.prop === 'taskStatus'">
						 <el-tag
              :type="
                scope.row[scope.item.prop] == 1
                  ? 'info'
                  : scope.row[scope.item.prop] == 2
                  ? ''
                  : scope.row[scope.item.prop] == 3
                  ? 'success'
                  : scope.row[scope.item.prop] == 4
                  ? 'danger'
                  : 'info'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
								scope.row[scope.item.prop] | switchText(scope.item.prop, scope.row)
							}}
          </el-tag></span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增编辑dialog弹窗 -->
		<add-task-drawer
			:visibles.sync="addUpdateVisible"
			@add-complete="addComplete"
		/>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addTaskDrawer from "./components/addTaskDrawer";
// request
import { getPageList, deleteTask } from "@/api/carMonitorSys/vehicleAddress";
import { beginTimeAndEndTime } from "@/utils/base";
export default {
	name: "vehicleAddress",
	CN_name: "车辆位置导出",
	components: { addTaskDrawer },
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	filters: {
		switchText(val, type) {
			if (type === "taskStatus") {
				return val == 1
					? "未开始"
					: val == 2
					? "进行中"
					: val == 3
					? "已完成"
					: val == 4
					? "异常"
					: "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	data() {
		return {
			listQuery: {
				taskName: "",
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 100,
					checked: true,
				},
				{
					value: "文件名",
					prop: "fileName",
					width: 150,
					checked: true,
				},
				{
					value: "文件状态",
					prop: "taskStatus",
					width: 95,
					checked: true,
				},
				{
					value: "任务创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 95,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 90,
					checked: true,
				},
			],
			addUpdateVisible: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: 'input',
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
	mounted() {
	},
	methods: {
		// 导入成功之后刷新list
		reloadList() {
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getPageList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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
		// 新增
		handleAdd() {
			this.addUpdateVisible = true;
		},
		// 新增成功
		addComplete() {
			this.listLoad();
		},
		// 删除
		handleDelete(row) {
			this.$confirm(`是否删除 ${row.taskName}?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					const deleteData = {
						taskId: row.taskId,
						taskName: row.taskName,
					};
					deleteTask(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.listLoad();
							this.$message.success({
								message: "删除成功",
								duration: 2 * 1000,
							});
						}
					});
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped></style>