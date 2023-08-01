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
				:isCollapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-filter="showfilter = true"
				@click-export="handleExport"
				@click-exportData="handExportData"
				@click-import-select="handleImportSelect"
				@click-exportQuery="handExportQuery"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
				/>
			</app-authorize-button>
			<!-- table -->
			<!-- 	@click-look="lookInfo" -->
			<app-table
				slot="table"
				:listLoading="listLoading"
				size="mini"
				:isTableSelection="false"
				:list="list"
				:pageObj="listQuery"
				:isTableNumber="true"
				:isShowOperation="false"
				:buttonList="insideList"
				:filterTableList="filterTableList"
				:total="total"
				:tableHeights="tableHeight"
				rowKey="vinNo"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				@row-click="rowClick"
				@sort-change="sortChange"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'vinNo'">
						<span class="vinNo">
							{{ scope.row[scope.item.prop] | processData}}
						</span>
					</span>
					<span v-else-if="scope.item.prop === 'isGpsPosition'">
						<span>
							<svg-icon
								icon-class="icon-gps"
								:class="
									scope.row['isOnline'] === 1 &&
									scope.row[scope.item.prop] === 1
										? 'iconActive'
										: 'iconInactive'
								"
							/>
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</span>
					</span>
					<span v-else-if="scope.item.prop === 'isDriving'">
						<span>
							<svg-icon
								:icon-class="
									scope.row['isOnline'] === 1 &&
									scope.row[scope.item.prop] === 1
										? 'drive-start'
										: 'drive-end'
								"
								:class="
									scope.row['isOnline'] === 1 &&
									scope.row[scope.item.prop] === 1
										? 'iconActive'
										: 'iconInactive'
								"
							/>
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</span>
					</span>
					<span v-else-if="scope.item.prop === 'isOnline'">
						<span>
							<svg-icon
								:icon-class="
									scope.row[scope.item.prop] === 1
										? 'online-start'
										: 'online-end'
								"
								:class="
									scope.row[scope.item.prop] === 1
										? 'iconActive'
										: 'iconInactive'
								"
							/>
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</span>
					</span>
					<span v-else-if="scope.item.prop === 'hasCan'">
						<span>
							<svg-icon
								:icon-class="
									scope.row['isOnline'] === 1 && scope.row[scope.item.prop] == 1
										? 'can-yes'
										: 'can-no'
								"
								:class="
									scope.row['isOnline'] === 1 && scope.row[scope.item.prop] == 1
										? 'iconActive'
										: 'iconInactive'
								"
							/>
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</span>
					</span>
					<span
						v-else-if="
								scope.item.prop == 'notOnlineTime' 
						"
					>
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
		<real-time-drawer :visibles.sync="realTimeVisible" :data="tableRow" />
		<!-- <gb-data-drawer :visibles.sync="gbDataVisible" :data="tableRow" /> -->
		<export-data-drawer
			:visibles.sync="exportDataVisible"
			:file-type="fileType"
		/>
		<export-query-drawer
			:visibles.sync="exportQueryVisible"
			:task-type="taskType"
		/>
		<!-- 导入dialog弹窗 -->
		<import-dialog
			:title="'导入查询'"
			action="api/monitor/car/importCarInfo"
			:template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
			:visibles.sync="importVisible"
			:isShowName="true"
			@upload-success="reloadList"
			:data="{ taskType: 1 }"
			:maxNumber="5000"
		>
			<result-dialog
				:visibles.sync="resultVisible"
				:data="importResult"
				:text="'VIN码'"
				:keys="'vinNo'"
				:is-show="false"
			>
			</result-dialog>
		</import-dialog>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";
// 组件
import realTimeDrawer from "./components/realTimeDrawer";
// import gbDataDrawer from "./components/gbDataDrawer";
import exportDataDrawer from "@/components/exportDataDrawer";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import exportQueryDrawer from "@/components/exportQueryDrawer";
// request
import {
	getCarStatus,
	exportCarStatus,
	downloadExcel,
} from "@/api/carMonitorSys/carStatus";
import { getReGeoCode } from "@/api/commont";
import { mapGetters } from "vuex";
export default {
	doNotInit: true,
	name: "carStatus",
	CN_name: "车辆状态查询",
	components: {
		realTimeDrawer,
		exportDataDrawer,
		importDialog,
		resultDialog,
		exportQueryDrawer,
		// gbDataDrawer,
	},
	filters: {
		switchText(val, type, row) {
			if (type === "isOnline") {
				return val === 1 ? "在线" : "离线";
			} else if (type === "isGpsPosition") {
				if (row.isOnline === 0) {
					return "未定位";
				} else {
					return val === 1 ? "已定位" : "未定位";
				}
			} else if (type === "isDriving") {
				if (row.isOnline === 0) {
					return "停止";
				} else {
					return val === 1 ? "行驶" : "停止";
				}
			} else if (type === "hasCan") {
				return val == 1 && row.isOnline == 1 ? "有CAN" : "无CAN";
			} else if (type === "notOnlineTime") {
				if (row.isOnline == 0 && row[type]) {
					var time = parseInt(val) + "秒";
					if (parseInt(val) < 0) {
						time = "-";
					}
					if (parseInt(val) > 60) {
						var second = parseInt(val) % 60;
						var min = parseInt(val / 60);
						time = min + "分" + second + "秒";

						if (min > 60) {
							min = parseInt(val / 60) % 60;
							var hour = parseInt(parseInt(val / 60) / 60);
							time = hour + "小时" + min + "分" + second + "秒";

							if (hour > 24) {
								hour = parseInt(parseInt(val / 60) / 60) % 24;
								var day = parseInt(parseInt(parseInt(val / 60) / 60) / 24);
								time = day + "天" + hour + "小时" + min + "分" + second + "秒";
							}
						}
					}
					return time;
				} else {
					return "-";
				}
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton,getDropList],
	data() {
		return {
			// timer: null,
			listQuery: {
				notOnlineTime: "",
				vinNo: "",
				vehicleTypeId: "",
			},
			vehicleTypeList: [
			],
			// 下拉
      dropList:[
        { postData:{dicCode:1002},key:'vehicleTypeList' },
      ],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "数据上报时间",
					prop: "travelTime",
					width: 140,
					checked: true,
				},
				{
					value: "GPS是否定位",
					prop: "isGpsPosition",
					width: 120,
					checked: true,
				},
				{
					value: "车辆是否行驶",
					prop: "isDriving",
					width: 120,
					checked: true,
				},
				{
					value: "是否有CAN",
					prop: "hasCan",
					width: 110,
					checked: true,
				},
				{
					value: "终端是否在线",
					prop: "isOnline",
					width: 120,
					checked: true,
				},
				{
					value: "不在线时长",
					prop: "notOnlineTime",
					width: 140,
					checked: true,
				},
				{
					value: "车辆类型",
					prop: "vehicleType",
					width: 95,
					checked: true,
				},
				{
					value: "车辆当前位置",
					prop: "address",
					width: 150,
					checked: true,
				},
			],
			importVisible: false,
			resultVisible: false,
			exportQueryVisible: false,
			importResult: {},
			realTimeVisible: false,
			exportDataVisible: false,
			fileType: null,
			taskType: null,
			gbDataVisible: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "不在线时长大于(天)",
          value: "notOnlineTime",
					labelWidth:"120px",
          type: "input",
        },
        {
          label: "车辆类型",
          value: "vehicleTypeId",
          type: 'select',
          options: {
            data: this.vehicleTypeList,
          },
        },
      ];
    },
	},
	mounted() {
		// 数据字典下拉
    this.getDropList(this.dropList)
	},
	methods: {
		// 查看国标数据
		lookInfo(row) {
			if (row) this.tableRow = row;
			this.gbDataVisible = true;
		},
		// 导入成功之后刷新list
		reloadList(data) {
			// this.importResult = data;
			this.importVisible = false;
			// this.$alert("导入成功" + data.successList.length + "辆", "提示", {
			// 	confirmButtonText: "下载",
			// })
			// 	.then(() => {
			// 		downloadExcel().then(({ data }) => {
			// 			if (data.code === 0) {
			// 				//
			// 			}
			// 		});
			// 	})
			// 	.catch(() => {});
		},

		// 加载数据
		listLoad() {
			this.listLoading = true;
			getCarStatus(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						let { data: list = [] } = data;
						this.listData = list;
						if (list && list.length > 0) {
							// 请求地址address
							list.forEach((element) => {
								this.$set(element, "address", "");
								if (
									(element.latitude === "" && element.longitude === "") ||
									element.isOnline === 0
								) {
									this.$set(element, "address", "-");
								} else {
									const postData = {
										location: element.longitude + "," + element.latitude,
									};
									if (element.longitude && element.latitude) {
										getReGeoCode(postData).then(({ data }) => {
											if (data.code === 0) {
												let addr = data.data;
												this.$set(element, "address", addr);
											}
										});
									}
								}
							});
						}
						this.list = this.listData;
						this.total = data.total;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 点击列
		rowClick({ row, column }) {
			this.tableRow = {};
			this.tableRow = row;
			const label = column.label;
			if (label === "VIN码") {
				this._realtimeData(row);
			}
		},
		// 车辆实时数据
		_realtimeData(row) {
			if (row) this.tableRow = row;
			this.realTimeVisible = true;
		},
		//导出记录
		handExportData() {
			this.exportDataVisible = true;
			this.fileType = 5;
		},
		// 导入
		handleImportSelect() {
			this.importVisible = true;
		},
		// 导入任务详情
		handExportQuery() {
			this.taskType = 1;
			this.exportQueryVisible = true;
		},
		// 导出
		handleExport() {
			this.exportLoading = true;
			exportCarStatus(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "任务创建成功，请在导出记录中查看生成进度",
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss" scoped>
.onlineform {
	position: relative;
}
.yesgps {
	color: #00e56c;
}
.nogps {
	color: #98a3af;
}
</style>
