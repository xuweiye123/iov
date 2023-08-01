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
		  	:exportLoading="exportLoading"
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				@click-taskDetails="handleDetails"
				@click-export="handleOfflineExport"
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
				@click-see="handleSee"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'dataType'">
						{{
							(dataType &&
								dataType.length > 0 &&
								dataType.find(
									(item) => item.value === scope.row[scope.item.prop]
								) &&
								dataType.find(
									(item) => item.value === scope.row[scope.item.prop]
								).text) ||
								"-"
						}}
					</span>
					<span v-else-if="scope.item.prop === 'msgType'">
						{{
							(messageType &&
								messageType.length > 0 &&
								messageType.find(
									(item) => item.value === scope.row[scope.item.prop]
								) &&
								messageType.find(
									(item) => item.value === scope.row[scope.item.prop]
								).text) ||
								"-"
						}}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<see-message-drawer :visibles.sync="seeVisible" :tableRow="tableRow" />
		<details-drawer :visibles.sync="taskDetailsVisible" />
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getToday } from "@/utils/base";
// 组件
import seeMessageDrawer from "./components/seeMessage";
import detailsDrawer from "./components/detailsDrawer";
// request
import {
	getElkLogList,
	getForwardLinkOption,
	forwardLogExport,
	getAccessMsgType,
} from "@/api/transmitSys/logSearch";
export default {
	name: "LogSearch",
	components: {
		seeMessageDrawer,
		detailsDrawer,
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			taskDetailsVisible: false,
			seeVisible: false,
			listQuery: {
				link: "",
				vin: "",
				day: getToday(),
				dataType: "",
				msgType: "",
			},
			linkIdList: [],
			protocolList: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "链路",
					prop: "link",
					checked: true,
					width: 140,
				},
				// {
				// 	value: "协议名称",
				// 	prop: "protocol",
				// 	// width: 100,
				// 	checked: true,
				// },
				{
					value: "日期",
					prop: "data",
					width: 140,
					checked: true,
				},
				{
					value: "VIN码",
					prop: "vin",
					width: 170,
					checked: true,
				},
				{
					value: "数据类型",
					prop: "dataType",
					checked: true,
					width: 120,
				},
				{
					value: "消息类型",
					prop: "msgType",
					checked: true,
					width: 140,
				},
				{
					value: "创建时间",
					prop: "createTime",
					checked: true,
					width: 160,
				},
				{
					value: "目标平台",
					prop: "targetName",
					checked: true,
					width: 140,
				},
			],
			dataType: [],
			messageType: [],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "链路",
					value: "link",
					options: {
						data: this.linkIdList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "date",
					label: "日期",
					value: "day",
				},
				{
					type: "select",
					label: "数据类型",
					value: "dataType",
					options: {
						data: this.dataType, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "select",
					label: "消息类型",
					value: "msgType",
					options: {
						data: this.messageType, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "VIN码",
					value: "vin",
				},
			];
		},
	},
	mounted() {
		this.linkIdListChange();
		this._getAccessMsgType();
	},
	methods: {
		handleDetails() {
			this.taskDetailsVisible = true;
		},
		handleOfflineExport() {
			this.exportLoading = true;
			forwardLogExport(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$notify({
						title: "成功",
						message: "离线导出成功",
						type: "success",
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		linkIdListChange() {
			getForwardLinkOption().then(({ data }) => {
				if (data.code === 0) {
					this.linkIdList = data.data;
				}
			});
		},
		_getAccessMsgType() {
			getAccessMsgType().then(({ data }) => {
				if (data.code === 0) {
					this.messageType = data.data.msgTypeList;
					this.dataType = data.data.dataTypeList;
				}
			});
		},
		handleClear() {
			this.listQuery = {
				link: "",
				protocol: "",
				vin: "",
				day: getToday(),
				dataType: "",
				msgType: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.listLoad();
		},
		handleSee(row) {
			this.tableRow = row;
			if (!row.msg) {
				this.$notify.info({
					title: "消息",
					message: "暂无报文",
				});
			} else {
				this.seeVisible = true;
			}
		},
		// 加载数据
		listLoad() {
			if (!this.listQuery.day) {
				this.$message.error("请选择日期");
				return;
			}
			this.list = [];
			this.listLoading = true;
			getElkLogList(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped></style>
