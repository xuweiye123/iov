<template>
	<app-drawer
		:visibles.sync="visibles"
		width="60%"
		:title="'任务详情列表'"
		@close-drawer="closeDrawer"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
				</div>
				<!-- 清空按钮-->
				<app-search-button
					:is-collapse="false"
					slot="bottom"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<app-authorize-button @click-filter="showfilter = true">
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
				/>
			</app-authorize-button>
			<app-table
				ref="tableList"
				slot="table"
				:isTableSelection="false"
				:list="list"
				:tableHeights="tableHeight"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'path'">
						<el-tooltip
							class="item"
							effect="dark"
							:content="'点击下载文件'"
							placement="top"
							v-if="scope.row[scope.item.prop]"
						>
							<a
								:href="
										scope.row[scope.item.prop]
								"
								class="vinNo"
							>
								{{ scope.row[scope.item.prop].split("/").pop()  | processData}}
							</a>
						</el-tooltip>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request
import { selectTaskDetailsPageList } from "@/api/carMonitorSys/offlineReporting";
import { beginTimeAndEndTime } from "@/utils/base";
export default {
	name: "lookTaskDetailDialog",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			listQuery: {
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					checked: true,
					width: 120,
				},
				{
					value: "文件名称 ",
					prop: "path",
					width: 200,
					checked: true,
				},
				{
					value: "未上线天数",
					prop: "noOnlineDay",
					checked: true,
					width: 100,
				},
				// {
				// 	value: "车辆数",
				// 	prop: "carNum",
				// 	checked: true,
				// 	width: 80,
				// },
				{
					value: "创建人 ",
					prop: "createdBy",
					checked: true,
					width: 100,
				},
				{
					value: "生成时间 ",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
			],
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
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
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				startTime: "",
				endTime: "",
				pageNum: 1,
				pageSize: 10,
				timeRange:["",""],
			};
				this.$emit("update:visibles", false);
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			this.listQuery.taskId = this.data.oid;
			selectTaskDetailsPageList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.tableRow = {};
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>

<style lang="scss"></style>
