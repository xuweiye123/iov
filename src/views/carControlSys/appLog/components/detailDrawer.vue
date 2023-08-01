<template>
	<div>
		<app-drawer
			:visibles="visibles"
			:wrapperClosable="true"
			width="900px"
			@close-drawer="closeDrawer"
			:loading="loading"
			class="realdataDialog"
			:title="'app日志详情'"
			:isDrawerFoot="false"
		>
			<div slot="drawerContent">
				<div class="map-box clearfix">
					<!-- 其他信息 -->
					<div class="car-real-area-data">
						<ul class="clearfix">
							<li v-for="(item, index) in baseData" :key="index">
								<span class="in-name">{{ item.name }}：</span>
								<span class="in-value" :class="item.className">{{
									item.value
								}}</span>
							</li>
						</ul>
					</div>
				</div>
				<!-- 下半部分 -->
				<div class="carStatusData" v-if="list.length > 0">
					<div class="add-btn-right">
						<el-button
							v-waves
							class="filter-item"
							type="info"
							size="mini"
              :loading="exportLoading"
							@click="exportDetail"
							>
							<i
                class="iconfont icon-export"
                style="font-size: 12px !important;"
              ></i>
							导出</el-button
						>
					</div>
					<app-table
						size="mini"
						:tableHeights="tableHeight"
						slot="table"
						:isTableSelection="false"
						:list="list"
						:total="0"
						:filterTableList="filterTableList"
						@row-click="rowClick"
					>
						<template slot="tableContent" slot-scope="scope">
							<span v-if="scope.item.prop === 'json'">
								<span class="vinno">
									查看
								</span>
							</span>
							<span v-else>
								{{ scope.row[scope.item.prop] | processData}}
							</span>
						</template>
					</app-table>
				</div>
				<app-dialog
					v-el-drag-dialog
					v-if="jsonShow"
					:visibles.sync="jsonShow"
					width="75%"
					top="8vh"
					:title="'命令内容'"
					@close-dialog="closejsonDialog"
					:isFooter="false"
				>
					<div slot="formContent">
						<div
							v-if="tableRow.json.length > 0"
							class="bodyHeight divScroll"
						>
							<div
								v-for="(i, n) of tableRow.json"
								:key="n"
								style="margin:15px 10px;"
							>
								<el-tag
									style="margin-right:5px;height: 16px;border-radius: 50%;padding: 0px 4px;line-height: 14px;"
									>{{ n + 1 }}</el-tag
								>
								<!-- {{ i }} -->
								<json-viewer
									:value="i"
									:expand-depth="4"
									:copyable="copyable"
									boxed
									sort
									style="padding-bottom: 18px;"
								>
									<template slot="copy" slot-scope="scope">
										<el-button v-waves type="primary" size="mini">
											{{ scope.copied ? "复制成功" : "复制" }}
										</el-button>
									</template>
								</json-viewer>
							</div>
						</div>
					</div>
				</app-dialog>
			</div>
		</app-drawer>
	</div>
</template>

<script>
// 混入
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import {
	getCommandLogDetail,
	exportCommandLogDetail,
} from "@/api/carControlSys/appLog";
//工具
import { isJSON } from "@/utils/index";
// request
export default {
	name: "detailDialog",
	mixins: [otherHeight, tableStyle],
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
			baseData: [
				{ name: "VIN码", value: "" },
				{ name: "命令创建时间", value: "" },
				{ name: "命令类型", value: "" },
				{ name: "命令ID", value: "" },
				{ name: "命令结果", value: "" },
			],
			copyable: { copyText: "复制", copiedText: "复制成功" },
			tableRow: {},
			formInfo: {},
			loading: false,
			exportLoading:false,
			tableHeight: 0,
			tableList: [
				{
					value: "服务名",
					prop: "actor",
					position: "center",
					//sortable: "custom",
					width: "200px",
					checked: true,
				},
				{
					value: "数据时间",
					prop: "dataTime",
					position: "center",
					//sortable: "custom",
					checked: true,
					width: "140px",
				},
				{
					value: "流程描述",
					prop: "description",
					position: "center",
					//sortable: "custom",
					checked: true,
					width: "360px",
				},
				// {
				//   value: "流程序号",
				//   prop: "order",
				//   position: "center",
				//   //sortable: "custom",
				//   width: "120px",
				//   checked: true,
				// },
				{
					value: "命令内容",
					fixed: 'right',
					prop: "json",
					position: "center",
					//sortable: "custom",
					width: "70px",
					checked: true,
				},
			],
			list: [],
			jsonShow: false,
			baseDataVary: {
				vin: "",
				createTime: "",
				command: "",
				businessToken: "",
			},
		};
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.resetForm();
				this.formInfo = { ...this.data };
				this._dataInfo();
			}
		},
	},
	computed: {
		filterTableList() {
			return this.tableList.filter((item) => item.checked);
		},
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;
    });
    window.onresize = function() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 250;
      });
    }.bind(this);
	},
	methods: {
		//详情导出
		exportDetail() {
			const postdata = {
				vin: this.formInfo.vin,
				terminalCode: this.formInfo.terminalCode,
				createTime: this.formInfo.createTime,
				businessToken: this.formInfo.businessToken,
				remoteType: this.formInfo.remoteType,
			};
			this.exportLoading = true;
			exportCommandLogDetail(postdata).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "导出成功",
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 点击列
		rowClick({ row, column }) {
			this.tableRow = {};
			this.tableRow = row;
			const label = column.label;
			if (label === "命令内容") {
				this.tableRow.json.forEach((ele, index) => {
					//判断是否为JSON字符串
					if (ele && isJSON(ele)) {
						this.tableRow.json[index] = JSON.parse(ele);
					}
				});
				this._jsonData();
			}
		},
		_jsonData() {
			this.jsonShow = true;
		},
		// 关闭
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		closejsonDialog() {
			this.jsonShow = false;
		},
		// 取消
		handleCancel() {
			this.closeDrawer();
		},
		// 车辆基础数据
		_dataInfo() {
			const postdata = {
				vin: this.formInfo.vin,
				terminalCode: this.formInfo.terminalCode,
				createTime: this.formInfo.createTime,
				businessToken: this.formInfo.businessToken,
				remoteType: this.formInfo.remoteType,
			};
			getCommandLogDetail(postdata).then(({ data }) => {
				if (data.code === 0) {
					console.log(data.data);
					const dataMsg = data.data || [];
					this.list = dataMsg.processes;
					this.list.map(
						(e) =>
							(e.dataTime = new Date(e.dataTime).format("yyyy-MM-dd hh:mm:ss"))
					);
					this.baseDataVary.vin = dataMsg.vin;
					this.baseDataVary.createTime = new Date(dataMsg.createTime).format(
						"yyyy-MM-dd hh:mm:ss"
					);
					this.baseDataVary.command = dataMsg.command;
					this.baseDataVary.businessToken = dataMsg.businessToken;
					this.baseDataVary.result = dataMsg.result;
					this.setData();
				}
			});
		},
		// 设置基础数据
		setData() {
			this.baseData = [
				{ name: "VIN码", value: this.baseDataVary.vin },
				{ name: "命令创建时间", value: this.baseDataVary.createTime },
				{ name: "命令类型", value: this.baseDataVary.command },
				{ name: "命令结果", value: this.baseDataVary.result },
				{ name: "命令ID", value: this.baseDataVary.businessToken },
			];
			//console.log(this.baseData)
		},
		// 清空数据
		resetForm() {},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .jv-code.boxed{
	padding: 5px 70px 0 5px;
}
::v-deep .jv-container .jv-tooltip.right{
	right: 0;
}
.bodyHeight{
	max-height: calc(84vh - 70px);
	overflow-y: auto;
}
.map-box {
	.amap-page-container {
		height: 195px;
		width: 25%;
		position: relative;
		float: left;
		border: 1px solid #e6e9ec;
		border-radius: 5px;
	}
	.all-moven-box {
		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 222;
	}
	.all-moven {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 2222;
		cursor: pointer;
		svg {
			font-size: 20px !important;
		}
	}
	.moven2 {
		svg {
			font-size: 26px !important;
		}
	}
	.car-speed-box {
		float: left;
		width: 16%;
		min-width: 180px;
		padding-left: 3%;
		box-sizing: border-box;
		.car-speed-box-chart {
			width: 100%;
			height: 180px;
		}
		.car-real-battery {
			width: 121px;
			margin: 0 auto;
			margin-top: -40px;
			.car-real-battery-soc {
				width: 121px;
				height: 33px;
				// background: url('../../../../../assets/images/soc_dlk.png') no-repeat;
				background-size: auto;
				position: relative;
				padding: 2px 4px 0 2px;
				box-sizing: border-box;
				.car-real-battery-progress {
					height: 29px;
					background: #00f65d;
					border-radius: 4px 0 0 4px;
					transition: all 2s;
					-moz-transition: all 2s; /* Firefox 4 */
					-webkit-transition: all 2s; /* Safari 和 Chrome */
					-o-transition: all 2s;
				}
				.car-real-battery-progress-text {
					position: absolute;
					top: 0;
					left: 0;
					line-height: 33px;
					width: 100%;
					text-align: center;
				}
			}
			.car-real-battery-txt {
				width: 121px;
				text-align: center;
				margin-top: 8px;
				display: inline-block;
				color: #515c60;
			}
		}
	}
	.car-real-area-data {
		// float: left;
		box-sizing: border-box;
		width: 100%;
		// flex: auto;
		ul {
			padding-left: 10px;
		}
		li {
			line-height: 30px;
			width: 50%;
			float: left;
			box-sizing: border-box;
			font-size: 12px;
			display: flex;
			.in-name {
				color: #515c60;
				width: 110px;
				display: inline-block;
				text-align: right;
			}
			.in-value {
				color: #6e7679;
				flex: 1;
			}
			.yesCAN {
				color: #409eff;
			}
			.noCAN {
				color: #ff0000;
			}
		}
		// li:last-child{
		//   // width: 100%;
		// }
	}
}
.carStatusData {
	ul {
		padding: 0 3px 0 0;
		margin: 0;
	}
	li {
		margin: 0 0 10px 0;
	}
	.car-title {
		line-height: 40px;
		font-weight: bold;
		padding: 0 10px;
		svg {
			font-size: 14px !important;
		}
	}
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
				display: inline-block;
				line-height: 46px;
				border-left: 1px solid #e0e5e7;
			}
			.carmessage-name {
				background: transparent;
				width: 60%;
				text-align: right;
				padding: 0 10px;
				box-sizing: border-box;
			}
			.carmessage-value {
				width: 40%;
				text-align: center;
			}
		}
		p.borderNone {
			border-bottom: 0 none;
		}
	}
}
.dialogStyle {
	height: 400px;
}
.add-btn-right {
	padding: 10px 5px;
	float: right;
}
</style>
