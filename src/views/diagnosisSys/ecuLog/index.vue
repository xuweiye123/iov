<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<el-form
					:label-position="'right'"
					:model="listQuery"
					:rules="rules"
					ref="formLeft"
					label-width="90px"
				>
					<el-row type="flex" justify="start" align="middle">
						<el-col :span="6">
							<el-form-item label="选择车辆：" prop="vin">
								<el-input
									v-model="listQuery.vin"
									placeholder="点击进行车辆选择"
									@click.native="selectCar"
									readonly
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="选择ECU：" prop="ecu">
								<el-input
									v-model="listQuery.ecu"
									placeholder="点击进行ECU选择"
									@click.native="selectECU"
									readonly
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row
						type="flex"
						justify="start"
						align="middle"
						style="padding-top: 15px"
						v-show="isShow"
					>
						<el-col :span="6">
							<el-form-item label="存储路径：" prop="addressA">
								<el-input
									v-model="listQuery.addressA"
									placeholder="请输入存储路径"
									maxlength="50"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="存储长度：" prop="addressB">
								<el-input
									v-model="listQuery.addressB"
									placeholder="请输入存储长度"
									maxlength="20"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div slot="bottom">
				<!-- 清空查询按钮 -->
				<app-search-button
					:isCollapse="false"
					@click-clear="handleClear2"
					@click-filter="handleFilter2"
				/>
			</div>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				@click-filter="showfilter = true"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
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
				:tableHeights="tableHeight"
				:isShowOperation="false"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span>{{ scope.row[scope.item.prop] | processData }}</span>
				</template>
			</app-table>
		</div>
		<app-car-list
			:visibles.sync="carListVisible"
			:data="carData"
			@carVinno="loadCarVinno"
		/>
		<app-ecu-list
			:visibles.sync="ecuListVisible"
			@carECU="loadECU"
			:carTypeId="carTypeId"
			:data="ecuList"
		/>
	</div>
</template>
<script>
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getPageButton } from "@/mixins/getButton";
import { partialForm } from "@/mixins/partialForm";
// request
import { sendOrder, getLogList } from "@/api/diagnosisSys/online";
//组件
import AppCarList from "@/components/diagnosisSys/selectCarDialog";
import AppEcuList from "@/components/diagnosisSys/selectSubSysEcuDialog";
export default {
	name: "ecuLog",
	doNotInit: true,
	components: {
		AppCarList,
		AppEcuList,
	},
	mixins: [pagingMixin, otherHeight, getPageButton, partialForm],
	data() {
		const validatevin = (rule, value, cb) => {
			if (!this.listQuery.vin) {
				return cb(new Error("请点击选择车辆"));
			}
		};
		const validateEcu = (rule, value, cb) => {
			if (!this.listQuery.ecuId) {
				return cb(new Error("请点击选择ECU"));
			}
		};
		return {
			listQuery: {
				vin: "",
				ecuId: "",
				ecu: "",
				resultStr: "",
				addressA: "",
				addressB: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: 160,
				},
				{
					value: "token",
					prop: "token",
					checked: true,
					width: 100,
				},
				{
					value: "命令类型",
					prop: "ordertype",
					checked: true,
					width: 80,
				},
				{
					value: "命令状态",
					prop: "status",
					checked: true,
					width: 80,
				},
				{
					value: "下发时间",
					prop: "createon",
					checked: true,
					width: 140,
				},
				{
					value: "失败原因",
					prop: "reason",
					checked: true,
					width: 180,
				},
			],
			exportData: {},
			carListVisible: false, //车辆列表dialog
			ecuListVisible: false, //ecu列表dialog
			carData: {},
			rules: {
				vin: [
					{ required: true, trigger: "blur", validator: validatevin },
					{ trigger: "change", validator: validatevin },
				],
				ecu: [
					{ required: true, trigger: "blur", validator: validateEcu },
					{ trigger: "change", validator: validateEcu },
				],
			},
			ecuList: {},
			isTableVisible: false,
			carTypeId: "",
			serviceAddress: "2324",
			net: "",
			isShow: false,
		};
	},
	methods: {
		selectCar() {
			this.carListVisible = true;
		},
		handleSizeChange(value) {
			this.listQuery.pageNum = 1;
			this.listQuery.pageSize = value;
			this.getList();
		},
		handleCurrentChange(value) {
			this.listQuery.pageNum = value;
			this.getList();
		},
		selectECU() {
			if (!this.carTypeId) {
				this.$alert("请先选择车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.ecuListVisible = true;
			this.listQuery.serviceName = "";
		},
		loadCarVinno(row) {
			console.log(row,123)
			this.listQuery.vin = row.vinNo;
			this.listQuery.vinNoTotal = row.vinNoTotal;
			this.carTypeId = row.carTypeId;
			this.carData = row;
		},
		loadECU(value) {
			if (value.net === "1") this.isShow = true;
			else this.isShow = false;
			this.listQuery.ecu = value.ecuName;
			this.listQuery.ecuId = value.ecuId;
			this.ecuList = value;
			this.net = value.net;
		},
		// 重置
		handleClear2() {
			this.listQuery.vin = "";
			this.listQuery.ecu = "";
			this.listQuery.ecuId = "";
			this.listQuery.pageNum = 1;
		},
		handleFilter2() {
			this.resultStr = "";
			const formcenter = this.checkForm({
				formName: "formLeft",
				formList: ["vin", "ecu"],
			});
			if (!formcenter) {
				return;
			}
			if (this.net === "1") {
				this.serviceAddress =
					this.serviceAddress +
					this.listQuery.addressA +
					this.listQuery.addressB;
			}
			let requestParam = {
				vin: this.listQuery.vin,
				ecuId: this.listQuery.ecuId,
				serviceAddress: this.serviceAddress,
				...this.listQuery,
			};
			this.isTableVisible = true;
			this.exportData = {};
			this.listLoading = true;
			sendOrder(requestParam)
				.then(({ data }) => {
					this.list = [];
					this.total = 0;
					if (data.code === 0) {
						this.listQuery.addressA = "";
						this.listQuery.addressB = "";
						this.isShow = false;
						this.$message.success({
							message: "命令下发成功,数据上报中……",
							duration: 2 * 1000,
						});
						this.serviceAddress = "2344";
						this.getList();
					} else {
						this.listLoading = false;
						this.$message.warning({
							message: "命令下发失败！",
							duration: 2 * 1000,
						});
					}
				})
				.catch(() => {
					this.$message.warning({
						message: "命令下发失败！",
						duration: 2 * 1000,
					});
					this.listLoading = false;
				});
		},
		getList() {
			//判断是否拿到所有报文。拿到所有报文后停止请求
			const data = {
				pageNum: this.listQuery.pageNum,
				pageSize: this.listQuery.pageSize,
				token: this.$store.state.user.token,
				vin: this.listQuery.vin,
			};
			// 请求报文数据
			getLogList(data)
				.then(({ data }) => {
					if (data.code === 0) {
						// let temp = [];
						// temp = [...this.list];
						this.list = data.data;
						this.total = data.total;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
