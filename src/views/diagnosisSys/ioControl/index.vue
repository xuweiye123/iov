<template>
	<el-scrollbar
		style="height:calc(100% - 90px);"
		wrap-class="default-scrollbar__wrap"
	>
		<div class="js-input-control app-container">
			<app-search :show-title="false" style="border:none">
				<div slot="content">
					<el-row type="flex" justify="start" align="middle">
						<el-col :span="8">
							<el-form
								style="float:left;width:80%;"
								:label-position="'right'"
								:model="listQuery"
								:rules="rules"
								ref="formLeft"
								label-width="70px"
							>
								<el-form-item label="车辆信息：" prop="vin">
									<el-input
										v-model="listQuery.vin"
										placeholder="点击进行选择车辆"
										@click.native="selectCar"
										readonly
									/>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</div>
			</app-search>
			<div class="ioconfig_list">
				<div class="kzq">
					<span class="kzq-title">控制区:</span>
				</div>
				<el-tabs type="card">
					<el-tab-pane
						:name="index + ''"
						v-model="activeModel"
						v-for="(item, index) of ioControlList"
						:key="index"
					>
						<span slot="label" class="deng-title">
							<span class="light-bg"
								><i :class="`iconfont icon-${iconList[index]}`"></i
							></span>
							<span class="tab-content">{{ item.equipmentType }}</span>
						</span>
						<div>
							<el-row :gutter="10">
								<el-col
									:span="
										item.equipmentSubtypeList.length < 3
											? 24 / item.equipmentSubtypeList.length
											: 8
									"
									v-for="(itemCol, indexCol) of item.equipmentSubtypeList"
									:key="indexCol"
									style="padding-bottom:17px"
								>
									<div class="control-setting">
										<div class="control-title">
											{{ itemCol.equipmentSubtype }}
										</div>
										<div class="control-content">
											<el-row :gutter="20">
												<el-col
													:span="
														item.equipmentSubtypeList.length >= 3
															? (itemData.equipmentName.length <= 4
																? 24
																: 24)
															: 12
													"
													v-for="(itemData, indexData) in itemCol.equipmentName"
													:key="indexData"
													style="margin-top: 20px;"
												>
													<!-- <el-checkbox
														v-model="itemData.checked"
														style="margin-right:10px"
													></el-checkbox> -->
													<svg-icon
														:icon-class="
															(itemData.state
																? 'icon_io_success'
																: 'icon_io_default') + '_red'
														"
													/>
													<span>{{ itemData.equipmentName }}: </span>
													<el-switch
														v-model="itemData.state"
														:true-label="1"
														:false-label="0"
														active-color="#13ce66"
														inactive-color="#8398ae"
													></el-switch>
												</el-col>
											</el-row>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>
				</el-tabs>

				<app-command-btn
					slot="footer"
					:buttonList="authouizeList"
					:showEmpty="true"
					@click-clear="handleClear"
					@click-filter="handleFilter"
				/>
			</div>
			<div class="table-list">
				<div style="padding-bottom:14px;">
					<span class="kzq-title">执行结果:</span>
				</div>
				<app-table
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="0"
					:isShowOperation="false"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop == 'keyStatus'">
							<el-tag
								:type="
									scope.row[scope.item.prop] == '已注销'
										? 'danger'
										: scope.row[scope.item.prop] == '正常使用'
										? 'success'
										: 'info'
								"
								effect="dark"
								style="width: 65px;"
							>
								{{
									scope.row[scope.item.prop] ? scope.row[scope.item.prop] : "-"
								}}
							</el-tag>
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</template>
				</app-table>
			</div>
			<app-car-list
				:visibles.sync="carListVisible"
				:data="carData"
				@carVinno="loadCarVinno"
			/>
		</div>
	</el-scrollbar>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { partialForm } from "@/mixins/partialForm";
import { getPageButton } from "@/mixins/getButton";
// request
import { ioControl, getIoEquipment } from "@/api/diagnosisSys/online";
//组件
import AppCarList from "@/components/diagnosisSys/selectCarDialog";
export default {
	name: "ioControl",
	doNotInit: true,
	mixins: [pagingMixin, otherHeight, getPageButton, partialForm],
	components: {
		AppCarList,
	},
	computed: {
		filterTableList() {
			return this.tableList.filter((item) => item.checked);
		},
	},
	data() {
		const validateVin = (rule, value, cb) => {
			if (!this.listQuery.vin) {
				return cb(new Error("请点击选择车辆"));
			}
		};
		return {
			listQuery: {
				vin: "",
			},
			iconList: [
				"icon_light_off",
				"icon_direct_off",
				"yuguaxidi",
				"fuzhushebei",
				"zhongkongmensuo",
			],
			startSwitch: [],
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					position: "center",
					checked: true,
					width: 120,
					fixed: "left",
				},
				{
					value: "控制服务名称",
					prop: "content",
					position: "center",
					checked: true,
					width: 110,
				},
				{
					value: "当前状态",
					prop: "result",
					position: "center",
					checked: true,
					width: 200,
				},
				{
					value: "负响应代码",
					prop: "errorCode",
					position: "center",
					checked: true,
				},
				{
					value: "负响应描述",
					prop: "errorMessage",
					position: "center",
					checked: true,
				},
				{
					value: "诊断时间",
					prop: "responseTime",
					position: "center",
					checked: true,
					width: 140,
				},
			],
			tableHeight: 0,
			list: [],
			listLoading: false,
			carListVisible: false, //车辆列表dialog
			rules: {
				vin: [{ required: true, trigger: "change", validator: validateVin }],
			},
			ioControlList: [],
			carTypeId: "",
			activeModel: "1",
			carData: {},
		};
	},
	mounted() {
		this._getIoEquipment();
		const otherHeight = this.getOtherHeight();
		const self = this;
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - otherHeight;
		});
		window.onresize = function() {
			const otherHeight = self.getOtherHeight();
			self.$nextTick(() => {
				self.tableHeight = window.innerHeight - otherHeight;
			});
		};
	},
	methods: {
		_getIoEquipment() {
			getIoEquipment({}).then(({ data }) => {
				if (data.code === 0) {
					this.ioControlList = data.data;
					this.ioControlList.forEach((item) => {
						item.equipmentSubtypeList.forEach((item1) => {
							item1.equipmentName.forEach((item2) => {
								this.$set(item2, "checked", false);
								this.$set(item2, "state", 0);
							});
						});
					});
				}
			});
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			ioControl({
				vin: this.listQuery.vin,
				withParams: this.getParams(),
				...this.listQuery,
			}).then(({ data }) => {
				if (data.code === 0) {
					this.list = data.data;
				}
				this.listLoading = false;
			});
		},
		getParams() {
			let params = "";
			let checkedList = [];
			this.ioControlList.forEach((item, index) => {
				checkedList.push([]);
				item.equipmentSubtypeList.forEach((item1) => {
					checkedList[index].push(
						...item1.equipmentName.filter((item2) => item2.state == 1)
					);
				});
			});
			let stringP = [];
			checkedList.forEach((item, index) => {
				stringP.push([]);
				item.forEach((item1) => {
					stringP[index].push(item1.id + ":" + Number(item1.state));
				});
			});
			stringP
				.map((item) => item.join(","))
				.forEach((item) => {
					if (!item) {
						params += "0:0;";
					} else {
						params += item + ";";
					}
				});
			params = params.slice(0, params.length - 1);
			console.log(params);
			return params;
		},
		loadCarVinno(row) {
			this.listQuery.vin = row.vinNo;
			this.listQuery.vinNoTotal = row.vinNoTotal;
			this.carTypeId = row.carTypeId;
			this.carData = row;
		},
		selectCar() {
			this.carListVisible = true;
		},
		handleClear() {
			this.listQuery.vin = "";
			this.ioControlList.forEach((item) => {
				item.equipmentSubtypeList.forEach((item1) => {
					item1.equipmentName.forEach((item2) => {
						this.$set(item2, "checked", false);
						this.$set(item2, "state", 0);
					});
				});
			});
		},
		handleFilter() {
			const checkLeft = this.checkForm({
				formName: "formLeft",
				formList: ["vin"],
			});
			if (!checkLeft) {
				return;
			}
			this.listLoad();
		},
	},
};
</script>

<style lang="scss">
.svg-class {
	margin-right: 8px;
	font-size: 14px;
}
.ioconfig_list {
	padding: 15px 0;
	.kzq {
		padding: 0 20px;
	}
	.other-style {
		padding-top: 0 !important;
	}
	.row-style {
		padding-top: 13px;
	}
	.el-tabs--card > .el-tabs__header {
		padding-bottom: 14px;
	}
	.el-tabs--card > .el-tabs__header .el-tabs__nav {
		border: none !important;
	}
	.el-tabs--card > .el-tabs__header .el-tabs__item {
		border-left: none !important;
	}
	.el-tabs__nav {
		display: flex;
		justify-content: space-evenly;
		text-align: center;
		margin: 0 auto;
		float: none !important;
	}
	.el-tabs__item {
		padding: 0 20px 0 38px !important;
		svg {
			font-size: 30px;
		}
		.tab-content {
			font-size: 12px !important;
			display: block;
			line-height: 16px;
			position: relative;
			top: 1px;
		}
	}
	.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
		padding-left: 50px;
	}
	.control-setting {
		border-radius: 4px;
	}
	.control-title {
		height: 28px;
		text-align: center;
		line-height: 28px;
		font-weight: bold;
	}
	.content-class {
		text-align: left !important;
		padding-left: 20px;
	}
	.control-content {
		text-align: center;
		padding: 0 10px 20px;
		.el-radio-button {
			padding-left: 8px;
		}
		.el-radio-button:last-child .el-radio-button__inner {
			width: 26px;
			height: 26px;
			text-align: center;
			border-radius: 4px;
		}
		.el-radio-button--mini .el-radio-button__inner {
			padding: 6px 6px;
			border-radius: 4px;
			color: #b4bec7;
		}
		.el-radio-button__orig-radio:checked + .el-radio-button__inner {
			font-weight: bold;
			color: #fff;
		}
		svg {
			font-size: 14px;
			margin-right: 6px;
		}
	}
	.search-btn {
		border-top: none;
		height: 63px;
		.btn-title {
			padding: 13px 0 0;
		}
	}
	.inlight-class {
		display: inline-block;
		width: 140px;
		text-align: left;
	}
}
.table-list {
	padding: 13px 20px 14px 20px;
}
.js-input-control {
	.el-tabs__content {
		padding: 0 20px;
	}
	.el-tabs__item {
		color: #999;
	}
	.search_list_border {
		box-shadow: none;
		border-radius: 0 !important;
		margin: 0 !important;
		padding: 10px;
	}
	.el-tabs--card > .el-tabs__header .el-tabs__item {
		border: 0 none;
	}
	.btn-title {
		padding: 10px 20px !important;
	}
	.action-btn {
		margin-top: 0px;
	}
	.el-switch__core:after {
		box-shadow: 3px 1px 5px #49515c;
	}
}
</style>
