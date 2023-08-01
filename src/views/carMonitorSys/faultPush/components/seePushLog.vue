<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'推送日志列表'"
		width="65%"
		@close-drawer="closeDrawer"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<div slot="drawerContent">
			<!-- table -->
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
					  :labelWidth="'90px'"
            :spanNumber="8"
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
			<div
				class="section-wrap"
			>
				<app-authorize-button
					:buttonLeft="[]"
          :buttonRight="headersRightList"
					:exportLoading="exportLoading"
					@click-filter="showfilter = true"
					@click-export="handleExport"
				>
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
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop == 'isSend'">
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</span>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</template>
				</app-table>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { beginTimeAndEndTime } from "@/utils/base";
// request
import { getSeePushLog, exportLog } from "@/api/carMonitorSys/faultPush";
export default {
	doNotInit:true,
	name: "seePushLog",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle, getPageButton],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
	filters: {
		switchText(val, type) {
			if (type === "isSend") {
				return val === 0
					? "未发送"
					: val === 1
					? "已发送"
					: val === 2
					? "待推送"
					: val === 3
					? "不推送"
					: val === 4
					? "自定义弹窗不推送"
					: val === 5
					? "预发送"
					: "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	data() {
		return {
			showfilter: false,
			listQuery: {
				name: "",
				startTime: "",
				endTime: "",
				failureLevel: "",
				status: "",
				content: "",
				timeRange:["",""],
			},
			pushlevelList: [
				{ label: "一级故障", value: "一级故障" },
				{ label: "二级故障", value: "二级故障" },
			],
			sendList: [
				{ label: "未发送", value: "0" },
				{ label: "已发送", value: "1" },
				{ label: "待推送", value: "2" },
				{ label: "不推送", value: "3" },
				{ label: "自定义弹窗不推送", value: "4" },
				{ label: "预发送", value: "5" },
			],
			tableList: [
				{
					value: "任务名称",
					width: 120,
					prop: "name",
					checked: true,
				},
				{
					value: "VIN码",
					width: 170,
					prop: "vinNo",
					checked: true,
				},
				{
					value: "车型名称",
					width: 100,
					prop: "carTypeName",
					checked: true,
				},
				{
					value: "项目代号",
					width: 120,
					prop: "carBatchCode",
					checked: true,
				},
				{
					value: "故障码",
					width: 160,
					prop: "faultCode",
					checked: true,
				},
				{
					value: "故障名称",
					width: 140,
					prop: "faultName",
					checked: true,
				},
				{
					value: "故障推送等级",
					width: 120,
					prop: "failureLevel",
					checked: true,
				},
				{
					value: "故障创建时间",
					width: 140,
					prop: "faultCreateTime",
					checked: true,
				},
				{
					value: "故障开始时间",
					width: 140,
					prop: "faultStartTime",
					checked: true,
				},
				{
					value: "发送内容",
					width: 180,
					prop: "content",
					checked: true,
				},
				{
					value: "发送状态",
					width: 120,
					prop: "isSend",
					checked: true,
				},
				{
					value: "车辆位置",
					width: 160,
					prop: "address",
					checked: true,
				},
				{
					value: "创建时间",
					width: 140,
					prop: "createdOn",
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
          label: "任务名称",
          value: "name",
          type: "input",
        },
        {
          label: "故障推送等级",
          value: "failureLevel",
          type: 'select',
          options: {
            data: this.pushlevelList,
          },
        },
				{
          label: "发送内容",
          value: "content",
          type: "input",
        },
        {
          label: "发送状态",
          value: "status",
          type: 'select',
          options: {
            data: this.sendList,
          },
        },
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
        },
        // {
        //   label: "",
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
	mounted() {
		// 暂时强行添加1
		this.headersRightList = [
			{
				functionName: "导出",
				functionNameEn: "导出",
				functionType: 1,
				url: "export",
				icon: "export",
				iconType: 2,
				isShow: 1,
			},
		];
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				pageNum: 1,
				pageSize: 10,
				name: "",
				startTime: "",
				endTime: "",
				failureLevel: "",
				status: "",
				content: "",
				timeRange:["",""],
			};
				(this.collapse = false);
			this.$emit("update:visibles", false);
		},
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getSeePushLog(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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
		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportLog(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					//
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss" scoped></style>
