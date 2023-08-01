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
				@click-seePushLog="handSeePushLog"
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
				:buttonList="insideList"
				@click-update="handleUpdate"
				@click-setFaultCode="handSetFaultCode"
				@click-setFaultCar="handSetFaultCar"
				@click-setFaultRule="handSetFaultRule"
				@row-click="rowClick"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						:class="scope.row[scope.item.prop] > 0 ? 'vinNo' : ''"
						v-if="
							scope.item.prop == 'faultCodeCount' ||
								scope.item.prop == 'faultRullCount' ||
								scope.item.prop == 'carCount'
						"
					>
						{{ scope.row[scope.item.prop] | processData}}
					</span>
					<span
						v-else-if="
							scope.item.prop == 'enabled' || scope.item.prop == 'fillTime'
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
		<!-- 新增编辑drawer弹窗 -->
		<add-task-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
		/>
		<!-- 配置故障码drawer弹窗 -->
		<set-fault-code
			:visibles.sync="setCodeVisible"
			:data="tableRow"
			@set-complete="setComplete"
		/>
		<!-- 配置故障规则drawer弹窗 -->
		<set-fault-rule
			:visibles.sync="setRuleVisible"
			:data="tableRow"
			@set-complete="setComplete"
		/>
		<!-- 配置车辆drawer弹窗 -->
		<set-fault-car
			:visibles.sync="setCarVisible"
			:data="tableRow"
			@set-complete="setComplete"
		/>
		<!-- 推送日志drawer弹窗 -->
		<see-push-log :visibles.sync="seelogVisible" @set-complete="setComplete" />
		<!-- 查看配置故障码dialog弹窗 -->
		<look-fault-code
			:data="tableRow"
			@delete-complete="setComplete"
			:visibles.sync="lookFaultCodeVisible"
		/>
		<!-- 查看配置车辆dialog弹窗 -->
		<look-fault-car
			:data="tableRow"
			@delete-complete="setComplete"
			:visibles.sync="lookFaultCarVisible"
		/>
		<!-- 查看配置规则dialog弹窗 -->
		<look-fault-rule
			:data="tableRow"
			@delete-complete="setComplete"
			:visibles.sync="lookFaultRuleVisible"
		/>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { beginTimeAndEndTime } from "@/utils/base";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addTaskDrawer from "./components/addTaskDrawer";
import setFaultCode from "./components/setFaultCode";
import setFaultRule from "./components/setFaultRule";
import setFaultCar from "./components/setFaultCar";
import seePushLog from "./components/seePushLog";
import lookFaultCode from "./components/lookFaultCode";
import lookFaultCar from "./components/lookFaultCar";
import lookFaultRule from "./components/lookFaultRule";
// request
import { getPageList } from "@/api/carMonitorSys/faultPush";
function getValue(value, unit) {
	return value ? value + unit : "";
}
export default {
	name: "faultPush",
	CN_name: "实时故障推送",
	components: {
		addTaskDrawer,
		setFaultCode,
		setFaultRule,
		setFaultCar,
		seePushLog,
		lookFaultCode,
		lookFaultCar,
		lookFaultRule,
	},
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				name: "",
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			showfilter: false,
			tableList: [
				{
					value: "任务名称",
					prop: "name",
					width: 150,
					checked: true,
				},
				{
					value: "配置故障码数",
					prop: "faultCodeCount",
					width: 100,
					checked: true,
				},
				{
					value: "配置车辆数",
					prop: "carCount",
					width: 95,
					checked: true,
				},
				{
					value: "配置规则数",
					prop: "faultRullCount",
					width: 90,
					checked: true,
				},
				{
					value: "故障补传时间",
					prop: "fillTime",
					width: 120,
					checked: true,
				},
				{
					value: "是否启用",
					prop: "enabled",
					width: 90,
					checked: true,
				},
				{
					value: "邮箱",
					prop: "email",
					width: 150,
					checked: true,
				},
				{
					value: "备注",
					prop: "mark",
					width: 90,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 100,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
			],
			isEdit: false,
			addUpdateVisible: false,
			setCodeVisible: false,
			setRuleVisible: false,
			setCarVisible: false,
			seelogVisible: false,
			lookFaultCodeVisible: false,
			lookFaultCarVisible: false,
			lookFaultRuleVisible: false,
		};
	},
	filters: {
		switchText(val, type) {
			if (type === "enabled") {
				return val == 1 ? "是" : val == 0 ? "否" : "-";
			} else if (type === "fillTime") {
				let result = "";
				const diff = val * 60 * 1000;
				let days = getValue(parseInt(diff / (1000 * 60 * 60 * 24)), "天");
				let hours = getValue(
					parseInt((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
					"小时"
				);
				let minutes = getValue(
					parseInt((diff % (1000 * 60 * 60)) / (1000 * 60)),
					"分钟"
				);
				let seconds = getValue(parseInt((diff % (1000 * 60)) / 1000), "秒");
				result = days + hours + minutes + seconds;
				return result;
			} else {
				return val || (val===0 ? val:'-');
			}
		},
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
		// 点击列
		rowClick({ row, column }) {
			const label = column.label;
			this.tableRow = row;
			if (label === "配置故障码数") {
				if (row.faultCodeCount > 0) {
					this.lookFaultCodeVisible = true;
				}
			}
			if (label === "配置车辆数") {
				if (row.carCount > 0) {
					this.lookFaultCarVisible = true;
				}
			}
			if (label === "配置规则数") {
				if (row.faultRullCount > 0) {
					this.lookFaultRuleVisible = true;
				}
			}
		},
		// 新增
		handleAdd() {
			this.isEdit = false;
			this.addUpdateVisible = true;
		},
		// 新增成功
		addComplete() {
			this.listLoad();
		},
		// 编辑
		handleUpdate(row) {
			if (row) this.tableRow = row;
			this.isEdit = true;
			this.addUpdateVisible = true;
		},

		//配置故障码
		handSetFaultCode(row) {
			if (row) this.tableRow = row;
			this.setCodeVisible = true;
		},

		//配置车辆
		handSetFaultCar(row) {
			if (row) this.tableRow = row;
			this.setCarVisible = true;
		},

		//配置故障规则
		handSetFaultRule(row) {
			if (row) this.tableRow = row;
			this.setRuleVisible = true;
		},

		// 设置成功
		setComplete() {
			this.listLoad();
		},

		//查看推送日志
		handSeePushLog() {
			this.seelogVisible = true;
		},
	},
};
</script>

<style lang="scss"></style>