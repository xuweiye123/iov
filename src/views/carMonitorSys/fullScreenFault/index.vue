<template>
	<div class="app-fault-page fullscreen-fault">
		<app-fault-header :data="statisticsObj" />
		<!-- 报警车辆 -->
		<div @click="collapsed" class="faultCars-collapsed" v-show="!isCollapsed">
			<p>
				报警车辆
				<svg-icon
					style="font-size:10px;margin-left:5px"
					:icon-class="'icon_jinru'"
				/>
			</p>
		</div>

		<car-list :visibles.sync="isCollapsed" @click-car="clickCar"></car-list>

		<!-- 中间内容部分 -->
		<div class="page-content">
			<div class="page-content-left">
				<!-- 查询条件 -->
				<!-- <fault-search :listLoading="listLoading" @click-search="loadData"  @click-clear="loadClear" /> -->
				<div class="fault-search-content">
					<div slot="content">
						<el-form
							:label-position="'right'"
							:model="listQuery"
							label-width="100px"
						>
							<el-row :gutter="10">
								<el-col :span="8">
									<el-form-item label="VIN码：">
										<vin-select
											:is-vin="true"
											size="mini"
											v-model="listQuery.vinNo"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="故障码：">
										<el-input
											size="mini"
											v-model="listQuery.faultCode"
											filterable
											clearable
											placeholder="请输入故障码"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="故障名称：">
										<el-input
											size="mini"
											v-model="listQuery.faultName"
											filterable
											clearable
											placeholder="请输入故障名称"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="故障类型：">
										<el-select
											v-model="listQuery.faultType"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in gbFaultTypeList"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="国标故障等级：">
										<el-select
											size="mini"
											popper-class="fullScreenFault"
											v-model="listQuery.gbFaultLevel"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in gbFaultLevelList"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="自定义故障等级：">
										<el-select
											size="mini"
											popper-class="fullScreenFault"
											v-model="listQuery.faultLevel"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in faultLevelList"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="开始时间：">
										<el-time-picker
											popper-class="fullScreenFault"
											size="mini"
											v-model="listQuery.startTime"
											filterable
											clearable
											placeholder="请选择"
											type="datetime"
											value-format="HH:mm:ss"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="故障状态：">
										<el-select
											size="mini"
											popper-class="fullScreenFault"
											v-model="listQuery.faultStatus"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option :label="'已消除'" :value="1"></el-option>
											<el-option :label="'正发生'" :value="2"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="持续时间：">
										<el-select
											size="mini"
											popper-class="fullScreenFault"
											v-model="listQuery.continueTime"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option :label="'大于5分钟'" :value="5"></el-option>
											<el-option :label="'大于10分钟'" :value="10"></el-option>
											<el-option :label="'大于15分钟'" :value="15"></el-option>
											<el-option :label="'大于20分钟'" :value="20"></el-option>
											<el-option :label="'大于30分钟'" :value="30"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row >
								<el-col :span="6">
									<el-form-item label="占位符" style="visibility: hidden;">
										<el-input />
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<div class="fault-search-action" style="bottom:10px;right:12px">
						<el-button :disabled="listLoading" size="small" @click="handleFilter" v-waves type="primary">
							查询
						</el-button>
						<el-button :disabled="listLoading" size="small" @click="handleClear" v-waves class="empty-btn">
							清空
						</el-button>
					</div>
				</div>
				<!-- 车辆基本信息 -->
				<div class="carinfo">
					<div class="carinfo-basic">
						当前位置：<span style="margin-right:50px;">{{ carInfo.currentAddress }}</span>
					  车型名称：<span style="margin-right:50px;">{{ carInfo.carTypeName }}</span> 
						营运城市：<span style="margin-right:50px;">{{ carInfo.cityName }}</span>
						使用单位：<span>{{ carInfo.company }}</span>
					</div>
					<div class="car-suggest">
						<span class="car-suggest-title">
							<svg-icon
								:icon-class="'icon-fault-notice'"
								style="margin-right:5px;"
							/> 
							建议处置措施：
						</span>
						<span>{{ carInfo.maintainInfo }}</span>
					</div>
				</div>
				<!-- 表头操作 -->
				<div class="grid-table">
					<div
						class="grid-table-button grid-table-export"
						@mouseenter="enterSvgOpen"
            @mouseleave="enterSvgClose"
					>
						<el-button class="fault-export-button" size="mini" @click="handleExport">
							<svg-icon
								:icon-class="enterSvg?'icon-fault-export-hover':'icon-fault-export'"
							/>
							导出
						</el-button>
					</div>
					<div class="grid-table-button-right">
						<div 
							@mouseenter="enterSvgOpen1" 
							@mouseleave="enterSvgClose1" 
							@click="refresh" 
							class="grid-table-button grid-table-refresh">
							<span>
								<svg-icon 
								style="margin-right:5px"
								:icon-class="enterSvg1?'icon-fault-refresh-hover':'icon-fault-refresh'"
								>
								</svg-icon
								><span>刷新</span>
							</span>
						</div>
						<div class="grid-table-button" style="width: 1px;height: 12px;background: #1C4368;display: inline-block; margin:auto 15px;"></div>
						<div @click="addTimer" class="grid-table-button grid-table-refresh">
							<span
								><svg-icon
							  	style="margin-right:5px"
									:icon-class="
										listTimer ? 'icon-fault-select' : 'icon-fault-noselect'
									"
								></svg-icon
								><span>10s自动刷新</span></span
							>
						</div>
					</div>
				</div>
				<!-- table -->
				<el-table
					size="mini"
					v-loading="listLoading"
					:data="list"
					:max-height="tableHeight"
					:header-row-style="{ height: '40px' }"
					border
					fit
					highlight-current-row
					:header-cell-style="{
						background: '#016598',
						fontFamily: 'Microsoft YaHei',
					  fontWeight: 'bold',
					  color:'#FFFFFF',
						fontSize: '12px',
						border:'1px solid #016598'
					}"
					style="width: 100%"
					@row-click="rowClick"
				>
					<el-table-column
						v-for="(item, index) in tableList"
						:key="index"
						:label="item.value"
						:prop="item.prop"
						:fixed="item.fixed"
						:align="item.position"
						:min-width="item.width"
						show-overflow-tooltip
					>
						<template slot-scope="scope">
              <span v-if="item.prop === 'faultType' || item.prop === 'faultLevel'|| item.prop === 'gbFaultLevel'">
								{{ scope.row[item.prop] | switchText(item.prop) }}
							</span>
              <span v-else-if="item.prop === 'startTime' || item.prop === 'endTime'">
								{{ scope.row[item.prop]? scope.row[item.prop].split('.')[0] :'-'}}
							</span>
							<span v-else>
								{{
									scope.row[item.prop] | processData
								}}
							</span>
						</template>
					</el-table-column>
					<!--  fixed="right" -->
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-button
								size="mini"
								@click.stop="handle(scope.row)"
								type="primary"
								>开始处置</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div
					:class="[total > 0 ? 'visible' : 'hidden', 'pagination-container']"
				>
					<el-pagination
				  	popper-class="fullScreenFault"
						:current-page="listQuery.pageNum"
						:page-sizes="[10, 50, 100, 500]"
						:page-size="listQuery.pageSize"
						:pager-count="5"
						:total="total"
						background
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					/>
				</div>
			</div>
			<!-- 右侧 -->
			<div class="page-content-right">
				<level-three-fault @row-click="faultRowClick" />
			</div>
			<!-- 故障处置 -->
			<app-dialog
				:visibles.sync="dialogVisibles"
				:data="tableRow"
				@dispatch-success="listLoad"
			></app-dialog>
		</div>
	</div>
</template>

<script>
import appFaultHeader from "./components/faultHeader";
// import faultSearch from "./components/search";
import levelThreeFault from "./components/levelThreeFault";
import carList from "./components/carList";
import appDialog from "./components/dialogs";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import {
	getFaultCountSummary,
	getFaultPageList,
	getFaultCarInfo,
	exportFaultList,
} from "@/api/carMonitorSys/fullscreenFault";
export default {
	name: "fullScreenFault",
	components: {
		appFaultHeader,
		// faultSearch,
		levelThreeFault,
		carList,
		appDialog,
	},
	mixins: [pagingMixin, otherHeight],
	data() {
		return {
			statisticsObj: {},
			listQuery: {
        pageNum: 1,
        faultType: 1,
        vinNo: "",
        faultCode: "",
        faultName: "",
        faultLevel: null,
        gbFaultLevel: null,
        startTime: "",
        faultStatus: null,
        continueTime: null,
			},
			carInfo: {
				currentAddress: "",
				carTypeName: "",
				cityName: "",
			},
			 // 国标故障类型
      gbFaultTypeList: [
        { label: "国标故障", value: 1 },
        { label: "自定义故障", value: 2 },
      ],
      gbFaultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
      ],
      faultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
        { label: "四级", value: 4 },
      ],
			timer: null, // 故障数刷新
			listTimer: null, // list刷新
			tableList: [
				{ value: "VIN码", prop: "vinNo", position: "center", width: 170 },
				{ value: "故障码", prop: "faultCode", position: "center", width: 80 },
				{ value: "故障名称", prop: "faultName", position: "center",width: 100 },
				{
					value: "国标故障等级",
					prop: "gbFaultLevel",
					position: "center",
					width: 95,
				},
				{
					value: "自定义故障等级",
					prop: "faultLevel",
					position: "center",
					width: 108,
				},
				{
					value: "故障类型",
					prop: "faultType",
					position: "center",
					width: 85,
				},
				{
					value: "故障开始时间",
					prop: "startTime",
					position: "center",
					width: 140,
				},
				{
					value: "故障结束时间",
					prop: "endTime",
					position: "center",
					width: 140,
				},
				{ 
					value: "持续时间", 
					prop: "continueTime", 
					position: "center",
					width: 100, },
			],
			list: [],
			listLoading: false,
			tableHeight: 0,
			total: 0,
			isCollapsed: false,
			dialogVisibles: false,
			tableRow: {},
			enterSvg:false,
			enterSvg1:false,
		};
	},
	filters: {
		switchText(val, type) {
			if (type === "faultType") {
				return val == 1
					? "国标故障"
					: val == 2
					? "自定义故障"
					:  "-";
			}else if (type == "gbFaultLevel") {
				return val == 1
					? "一级"
					: val == 2
					? "二级"
					: val == 3
					? "三级"
					:'-'
			}else if (type == "faultLevel") {
				return val == 1
					? "一级"
					: val == 2
					? "二级"
					: val == 3
					? "三级"
					: val == 4
					? "四级"
					:'-'
			}else {
				return val || "-";
			}
		},
	},
	created() {
		this.setFaultCountSummary();
		// this.listLoad()
	},
	mounted() {
		// 点击空白处隐藏
		document.addEventListener("mouseup", (e) => {
			// let _dropdown = document.querySelector('.el-select-dropdown__list.el-scrollbar__view')
			// console.log(_dropdown)
			// console.log(_dropdown.contains(e.target))
			// if(_dropdown){
			//   if(_dropdown.contains(e.target)){
			//     return
			//   }
			// }
			let _dom = document.querySelector(".car-list");
			if (_dom) {
				if (!_dom.contains(e.target)) {
					// this.isCollapsed = false
				}
			}
		});
		const otherHeight = this.getFault3Height();
		const self = this;
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - otherHeight;
		});
		window.onresize = function() {
			const otherHeight = self.getFault3Height();
			self.$nextTick(() => {
				self.tableHeight = window.innerHeight - otherHeight;
			});
		};
	},
	methods: {
		enterSvgOpen() {
      this.enterSvg = true;
    },
    enterSvgClose() {
      this.enterSvg = false;
    },
		enterSvgOpen1() {
      this.enterSvg1 = true;
    },
    enterSvgClose1() {
      this.enterSvg1 = false;
    },
		// 获取故障总数
		_getFaultCountSummary() {
			getFaultCountSummary().then(({ data }) => {
				if (data.code === 0) {
					this.statisticsObj = data.data;
				}
			});
		},
		// 导出
		handleExport() {
			exportFaultList(this.listQuery);
		},
		// 刷新
		refresh() {
			this.listLoad();
		},
		// 定时请求故障数
		setFaultCountSummary() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
			this._getFaultCountSummary();
			this.timer = setInterval(() => {
				this._getFaultCountSummary();
			}, 30 * 1000);
		},
		// 列表10s刷新一次
		addTimer() {
			if (!this.listTimer) {
				this.listTimer = setInterval(() => {
					this.listLoad();
				}, 10 * 1000);
			} else {
				clearInterval(this.listTimer);
				this.listTimer = null;
			}
		},
		// 加载table列表
		listLoad() {
		  this.listLoading = true;
			getFaultPageList(this.listQuery).then(({ data }) => {
				this.list=[]
				this.listLoading = false;
				if (data.code === 0) {
					this.list = data.data || [];
					this.total = data.total || 0;
					this.list.forEach((item) => {
						item.continueTime = this.switchTime(item.continueTime);
					});
				}
			}).catch(() => {
				this.listLoading = false;
			});
		},
		handleClear() {
    	for (let k in this.listQuery) {
    		if (k === "pageSize" || k === "pageNum") {
    			continue;
    		}
    		this.listQuery[k] = "";
    	}
      this.listQuery.faultType = 1;
			this.listLoad();
    },
		switchTime(value) {
			if (value) {
				if (parseFloat(value) > 0 && parseFloat(value) < 60) {
					return value + "秒";
				} else if (parseFloat(value) >= 60 && parseFloat(value) < 3600) {
					return Math.floor(value / 60) + "分钟" + (value % 60) + "秒";
				} else if (parseFloat(value) >= 3600 && parseFloat(value) < 86400) {
					return (
						Math.floor(value / 3600) +
						"小时" +
						Math.floor((value % 3600) / 60) +
						"分钟" +
						((value % 3600) % 60) +
						"秒"
					);
				} else if (parseFloat(value) >= 86400) {
					return (
						Math.floor(value / 86400) +
						"天" +
						Math.floor((value % 86400) / 3600) +
						"小时" +
						Math.floor(((value % 86400) % 3600) / 60) +
						"分钟" +
						(((value % 86400) % 3600) % 60) +
						"秒"
					);
				} else {
					return "-";
				}
			} else {
				return "-";
			}
		},
		// // 初始化加载
		// loadData(postData) {
		// 	this.listQuery = { ...this.listQuery, ...postData };
		// 	this.listLoad();
		// },
		// loadClear(){
    //  this.listQuery = {
		// 	  pageSize:10,
    //     pageNum: 1,
    //     faultType: 1,
    //  }
		//  this.listLoad();
		// },
		handle(e) {
			this.dialogVisibles = true;
			this.tableRow = e;
		},
		// 点击三级故障list 待处理
		faultRowClick(row) {
			this.listQuery.carId = row.carId;
			this.listQuery.pageNum = 1;
			this.listLoad();
		},
		// 点击左侧车辆
		clickCar(row) {
			this.listQuery.carId = row.carId;
			this.listQuery.pageNum = 1;
			this.listLoad();
		},
		// table row点击
		rowClick(row) {
			let postData = {
				carId: row.carId,
			};
			this.carInfo.carTypeName = row.carTypeName;

			getFaultCarInfo(postData).then(({ data }) => {
				if (data.code === 0) {
					this.carInfo.currentAddress = data.data.currentAddress;
					this.carInfo.cityName = data.data.cityName;
					this.carInfo.maintainInfo = data.data.maintainInfo || "暂无";
					this.carInfo.company = data.data.company;
				}
			});
		},
		collapsed() {
			this.isCollapsed = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.app-fault-page {
	width: 100vw;
	height: 100vh;
	background: #041D35;
	box-sizing: content-box;
	// padding: 0 20px;
	//
	.faultCars-collapsed {
		position: absolute;
		top: 190px;
		left: 0;
		background:url(../../../assets/faultImage/frame_bjcl.png) no-repeat;
	  background-size: 100% 100%;
		word-break: break-all;
		word-wrap: break-word;
		border-radius: 0 5px 5px 0;
		font-size: 12px;
		cursor: pointer;
		padding: 10px 3px 10px 2px;
		color: #fff;
		letter-spacing: 2px;
		writing-mode: vertical-lr;
		z-index: 999;
		margin-left: -5px;
		p {
			margin-left: 5px;
			margin-right: 5px;
			text-align: center;
			// font-family: Source Han Sans CN;
			font-weight: 400;
			color: #D2F1FF;
		}
	}
	.page-content {
		padding:20px;
		height: calc(100vh - 100px);
		display: flex;
		flex-direction: row;
		// justify-content: center;
		// align-items: center;
		.page-content-left {
			max-width: calc(100vw - 370px);
			min-width: calc(100vw - 370px);
			padding-right: 20px;
			box-sizing: border-box;
			.carinfo {
				padding: 15px 20px;
				background: rgba(0, 90, 139, 0.2);
				border:1px solid #03304f !important;
				border-radius: 4px;
				font-size: 12px;
				color: #fff;
				margin-top: 15px;
				.carinfo-basic {
					color: #fff;
					span{
						color:#00A0E9;
					}
				}
				.car-suggest {
					margin-top: 10px;
					span{
						color:#00A0E9;
					}
					.car-suggest-title {
						color: #ffcc1b;
					}
				}
			}
			.grid-table {
				display: flex;
				justify-content: space-between;
				margin-top: 15px;
				height: 37px;
				// clear: both;
				.grid-table-button-right{
					display: flex;
				  justify-content: flex-end;
					align-items: center;
				}
				.grid-table-button {
					height: 100%;
					// padding: 0 12px;
					font-size: 12px;
					line-height: 37px;
					text-align: center;
					color: #fff;
					// float: right;
					cursor: pointer;
					&.grid-table-export {
						// float: left;
					}
					&.grid-table-refresh{
            color:#00A0E9;
					}
					.fault-export-button{
						background: rgba(0, 90, 139,.2) !important;
						border: 1px solid #064573 !important;
						border-radius: 3px !important;
						color: #fff !important;
					}
					.el-button--default:hover,
          .el-button--default:active{
						background: linear-gradient(120deg, #51F267, #00A0E9) !important;
						border-radius: 3px !important;
						color: #fff !important;
					}
				}
			}
		}
		.page-content-right {
			position: relative;
			width: 330px;
		}
	}

	// 查询区
	.fault-search-content {
		padding: 12px 12px 0 0;
		position: relative;
		background: rgba(0, 90, 139, 0.2);
		border:1px solid #03304f !important;
		border-radius: 4px;
	}
	.fault-search-action {
		position: absolute;
		display: flex;
	}
	// 时间选择器
	.el-time-panel .el-popper .fullTime{
		background: rgba(5, 67, 107,.8) !important;
		border: 1px solid #00A0E9 !important;
	}
}
::v-deep .el-table--border::after,
::v-deep .el-table--group::after,
::v-deep .el-table::before{
	border-color: transparent !important;
	background-color: transparent !important;
	// height: 0px !important;
}
::v-deep .el-table th.is-leaf{
  border-bottom: 1px solid transparent !important;
}

::v-deep .el-table__body tr.hover-row.current-row > td, 
::v-deep .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
::v-deep .el-table__body tr.hover-row.el-table__row--striped > td, 
::v-deep .el-table__body tr.hover-row > td,
::v-deep .el-table__body tr.current-row > td,
::v-deep.el-table__body tr.current-row > td.el-table__cell{
	background-color: #01466F !important;
	color: #fff !important;
}

</style>
