<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'查看详情'"
		:wrapperClosable="true"
		width="70%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent" v-loading="loading">
			<el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
				<ul class="clearfix" style="padding:0 0 20px 0;">
					<li>
						<div
							class="car-data clearfix"
							:style="{
								borderColor:
									$store.state.theme.activeName === 'default'
										? '#151a20'
										: '#e6e9ec',
							}"
						>
							<p
								v-for="(x, i) in list"
								:key="i"
								:style="{
									borderColor:
										$store.state.theme.activeName === 'default'
											? '#151a20'
											: '#e6e9ec',
								}"
							>
								<span
									:style="{
										borderColor:
											$store.state.theme.activeName === 'default'
												? '#151a20'
												: '#e6e9ec',
										background:
											$store.state.theme.activeName === 'default'
												? '#171f28'
												: '#f5f7fa',
										color:
											$store.state.theme.activeName === 'default'
												? '#FFFFFF'
												: '#515c60',
									}"
									class="carmessage-name"
									>{{ x.name }}：</span
								>
								<span
									v-if="x.name == '是否驻车起步'"
									:style="{
										borderColor:
											$store.state.theme.activeName === 'default'
												? '#151a20'
												: '#e6e9ec',
										color:
											$store.state.theme.activeName === 'default'
												? '#BCD5F1'
												: '#606266',
									}"
									class="carmessage-value"
									>{{ x.value == 1 ? "是" : "否" }}</span
								>
								<span
									v-else-if="x.name == '是否非正常关电'"
									:style="{
										borderColor:
											$store.state.theme.activeName === 'default'
												? '#151a20'
												: '#e6e9ec',
										color:
											$store.state.theme.activeName === 'default'
												? '#BCD5F1'
												: '#606266',
									}"
									class="carmessage-value"
									>{{ x.value == 1 ? "是" : "否" }}</span
								>
								<span
									v-else-if="x.name == '数据内容'"
									:style="{
										borderColor:
											$store.state.theme.activeName === 'default'
												? '#151a20'
												: '#e6e9ec',
										color:
											$store.state.theme.activeName === 'default'
												? '#BCD5F1'
												: '#606266',
									}"
									class="carmessage-value"
									>{{ x.value == null ? 0 : x.value }}</span
								>
								<span
									v-else
									:style="{
										borderColor:
											$store.state.theme.activeName === 'default'
												? '#151a20'
												: '#e6e9ec',
										color:
											$store.state.theme.activeName === 'default'
												? '#BCD5F1'
												: '#606266',
									}"
									class="carmessage-value"
									:title="x.value"
									>{{ x.value == null ? 0 : x.value }}</span
								>
							</p>
						</div>
					</li>
				</ul>
			</el-scrollbar>
		</div>
	</app-drawer>
</template>

<script>
// 混入
// request
import { getDrivingBehaviorDetail } from "@/api/carControlSys/carjourney";
import  { processData }  from "@/filters";
export default {
	name: "detailDrawer",
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
			list: [],
			loading:false
		};
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.getDetail();
			}
		},
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		getDetail() {
			this.loading=true
			getDrivingBehaviorDetail({ id: this.data.recordId }).then(({ data }) => {
				if (data.code === 0) {
					var result = data.data;
					this.list = [
						{ name: "VIN码", value: processData(this.data.vin)},
						{
							name: "行程ID",
							value: processData(result.recordId),
						},
						{
							name: "开始时间",
							value: processData(result.beginTime),
						},
						{
							name: "结束时间",
							value: processData(result.endTime),
						},
						// {name:'开始地址', value: result.sAddress == null ? "0" : result.sAddress},
						// {name:'结束地址', value: result.eAddress == null ? "0" : result.eAddress},
						{
							name: "行驶时间",
							value:
								result.longdrivingtime == null
									? "0"
									: result.longdrivingtime + "s",
						},
						{
							name: "行驶里程",
							value: result.mileage == null ? "0" : parseFloat((result.mileage *1 / 1000).toFixed(2)) + "km",
						},
						{
							name: "累计行驶距离",
							value: result.totalmileage == null ? "0" : parseFloat((result.totalmileage *1 / 1000).toFixed(2))+"km",
						},
						{
							name: "小计能耗",
							value: result.useele == null ? "0" : result.useele + "kwh/100km",
						},
						{
							name: "累计耗电量",
							value: result.totaluseele == null ? "0" : result.totaluseele+"kwh",
						},
						{
							name: "平均速度",
							value: result.agvspeed == null ? "0" : result.agvspeed + "km/h",
						},
						{
							name: "急加速次数",
							value:
								result.quickspeedcount == null ? "0" : result.quickspeedcount,
						},
						{
							name: "急减速次数",
							value: result.lowspeedcount == null ? "0" : result.lowspeedcount,
						},
						{
							name: "急转变次数",
							value: result.turncount == null ? "0" : result.turncount,
						},
						{
							name: "紧急制动次数",
							value:
								result.emergencybrakecount == null
									? "0"
									: result.emergencybrakecount,
						},
						{
							name: "低能量行驶次数",
							value:
								result.lowelectricitydriving == null
									? "0"
									: result.lowelectricitydriving,
						},
						{
							name: "疲劳驾驶次数",
							value:
								result.fatiguedriving == null ? "0" : result.fatiguedriving,
						},
						{
							name: "是否驻车起步",
							value: result.carstart == null ? "0" : result.carstart,
						},
						{
							name: "故障驾驶",
							value:
								result.malfunctiondriving == null
									? "0"
									: result.malfunctiondriving,
						},
						{
							name: "是否非正常关电",
							value:
								result.abnormalswitchfff == null
									? "0"
									: result.abnormalswitchfff,
						},
						{
							name: "最高车速",
							value: result.highspeed == null ? "0" : result.highspeed + "km/h",
						},
						{
							name: "车辆行驶消耗能量",
							value:
								result.drivingconsumptionenergy == null
									? "0"
									: result.drivingconsumptionenergy,
						},
						{
							name: "车辆空调系统消耗能量",
							value:
								result.airconsumptionenergy == null
									? "0"
									: result.airconsumptionenergy,
						},
						{
							name: "电池热管理消耗能量",
							value:
								result.batteryheatconsumptionenergy == null
									? "0"
									: result.batteryheatconsumptionenergy,
						},
						{
							name: "车辆其他消耗能量",
							value:
								result.otherconsumptionenergy == null
									? "0"
									: result.otherconsumptionenergy,
						},
						{
							name: "APP显示单行程平均电耗",
							value:
								result.appsingletripuseele == null
									? "0"
									: result.appsingletripuseele,
						},
						{
							name: "能量回收能量",
							value:
								result.energyrecycleenergy == null
									? "0"
									: result.energyrecycleenergy,
						},
						{
							name: "平均加速度",
							value:
								result.accelerationavg == null ? "0" : result.accelerationavg,
						},
						{
							name: "最大加速度",
							value:
								result.accelerationmax == null ? "0" : result.accelerationmax,
						},
						{
							name: "速度分布",
							value: result.speedgroup == null ? "0" : result.speedgroup,
						},
						{
							name: "已用功率百分比",
							value:
								result.usedpowerpercent == null ? "0" : result.usedpowerpercent,
						},
						{
							name: "当前时间",
							value: processData(result.currentTime),
						},
						{
							name: "当前位置",
							value: processData(result.currentLocation),
						},
						{
							name: "数据创建时间",
							value: processData(result.createdOn),
						},
						{
							name: "原始驾驶行为数据内容",
							value: processData(result.context),
						},
					];
					// this.detailVisible = true
				}
			}).finally(()=>{
        this.loading = false
      })
		},
	},
};
</script>

<style lang="scss" scoped>
.car-data {
	border: 1px solid #e0e5e7;
	border-bottom: 0 none;
	border-left: 0 none;
	p {
		float: left;
		width: 50%;
		box-sizing: border-box;
		margin: 0;
		font-size: 12px;
		border-bottom: 1px solid #e0e5e7;
		span {
			display: inline-default;
			height: 46px;
			line-height: 46px;
			border-left: 1px solid #e0e5e7;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			float: left;
		}
		.carmessage-name {
			background: transparent;
			width: 40%;
			text-align: right;
			padding: 0 10px;
			box-sizing: border-box;
			// background: rgb(245, 247, 250);
			// color: rgb(81, 92, 96);
		}
		.carmessage-value {
			width: 60%;
			text-align: center;
		}
		.carmessage-value2 {
			width: 50%;
			text-align: center;
		}
	}
	p.borderNone {
		border-bottom: 0 none;
	}
}
::v-deep .el-drawer__body {
	overflow-y: auto;
}
</style>