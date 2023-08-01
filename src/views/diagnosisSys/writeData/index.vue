<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<el-form
					style="width:100%"
					:model="listQuery"
					:rules="rules"
					ref="refForm"
					label-width="75px"
				>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="选择车辆：" prop="vin">
								<el-input
									v-model="listQuery.vin"
									placeholder="点击进行选择车辆"
									readonly
									@click.native="selectCar"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="选择ECU：" prop="ecu">
								<el-input
									v-model="listQuery.ecu"
									placeholder="点击进行ECU选择"
									readonly
									@click.native="selectECU"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="11">
							<el-form-item label="写入内容：" prop="writeContent">
								<el-select
									v-model="listQuery.writeContent"
									multiple
									placeholder="请选择"
									collapse-tags
									filterable
									clearable
									@change="changeItem"
								>
									<el-option
										v-for="item in contentList"
										:key="item.id"
										:label="item.serviceName"
										:value="item.id"
									>
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="1">
							<el-form-item
								v-show="listQuery.writeContent && listQuery.writeContent.length"
								style="
										position: absolute;
										right: 5px;
										top: 0;
								"
							>
								<span @click="collapse = !collapse">
									<i
										:class="
											!collapse ? 'iconfont icon-down' : 'iconfont icon-up'
										"
									/>
								</span>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row
						v-show="collapse"
						v-for="(item, i) in rowList"
						:key="i"
						:gutter="10"
					>
						<el-col
							:span="6"
							v-for="(columnItem, index) in item.cols"
							:key="index"
						>
							<el-form-item
								:label="columnItem.label + '：'"
								:prop="columnItem.prop"
								label-position="top"
							>
								<el-input
									v-model="listQuery[columnItem.fieldName]"
									:placeholder="'请输入' + columnItem.label"
									clearable
									maxlength="100"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</app-search>
		<app-command-btn
			slot="footer"
			:buttonList="headersLeftList"
			@click-filter="handleFilter"
		/>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- table -->
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'result'">{{
						scope.row[scope.item.prop] | getResult
					}}</span>
					<span v-else>{{ scope.row[scope.item.prop] | processData }}</span>
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
			:data="ecuList"
			:carTypeId="carTypeId"
		/>
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { partialForm } from "@/mixins/partialForm";
import { commonExport } from "@/mixins/getExportData";
import { getPageButton } from "@/mixins/getButton";
// request
import { writeData, getWriteList } from "@/api/diagnosisSys/online";
import { exportExcel } from "@/api/diagnosisSys/commont";
//组件
import AppCarList from "@/components/diagnosisSys/selectCarDialog";
import AppEcuList from "@/components/diagnosisSys/selectSubSysEcuDialog";
export default {
	doNotInit: true,
	name: "writeData",
	mixins: [pagingMixin, otherHeight, partialForm, commonExport, getPageButton],
	components: {
		AppCarList,
		AppEcuList,
	},
	filters: {
		getResult(val) {
			let result = "失败";
			if (val === "1") {
				result = "成功";
			}
			return result;
		},
	},
	props: {
		carObj: {
			type: Object,
			default: () => ({}),
		},
		systemObj: {
			type: Object,
			default: () => ({}),
		},
		isBtn: {
			type: Boolean,
			default: false,
		},
	},
	computed: {},
	data() {
		const validatevin = (rule, value, cb) => {
			if (!this.listQuery.vin) {
				return cb(new Error("请点击选择车辆"));
			}
		};
		const validateecu = (rule, value, cb) => {
			if (!this.listQuery.ecu) {
				return cb(new Error("请点击选择ECU"));
			}
		};
		return {
			listQuery: { vin: "", ecuId: "", writeContent: [] },
			tableList: [
				{
					value: "诊断时间",
					prop: "responseTime",
					width: 120,
					checked: true,
				},
				{
					value: "ECU名称",
					prop: "ecuName",
					width: 120,
					checked: true,
				},
				{
					value: "写入内容",
					prop: "content",
					width: 120,
					checked: true,
				},
				{
					value: "是否成功",
					prop: "result",
					width: 120,
					checked: true,
				},
				{
					value: "负响应代码",
					prop: "errorCode",
					width: 120,
					checked: true,
				},
				{
					value: "负响应描述",
					prop: "errorMessage",
					width: 120,
					checked: true,
				},
			],
			carListVisible: false, //车辆列表dialog
			ecuListVisible: false, //ecu列表dialog
			ecuList: {},
			rules: {
				vin: [{ required: true, trigger: "change", validator: validatevin }],
				ecu: [{ required: true, trigger: "change", validator: validateecu }],
				writeContent: [
					{
						required: true,
						type: "array",
						min: 1,
						message: "请选择写入内容",
						trigger: "change",
					},
				],
			},
			contentList: [],
			rowList: [],
			writeFieldValidateList: [],
			serviceList: [],
			carTypeId: "",
			carData: {},
			ecuData: {},
		};
	},
	mounted() {
		if (this.isBtn) {
			this.headersLeftList = [
				{
					functionName: "执行命令",
					functionNameEn: "执行命令",
					functionType: 1,
					iconType: 2,
					url: "filter",
					icon: "icon_write",
					isShow: 1,
				},
			];
		}
		this.carData = this.carObj;
		console.log(this.carObj);
		this.listQuery.vin = this.carObj.vinNo ? this.carObj.vinNo : "";
		this.listQuery.vinNoTotal = this.carObj.vinNoTotal ? this.carObj.vinNoTotal : "";
		this.carTypeId = this.carObj.carTypeId ? this.carObj.carTypeId : "";
		let { id } = this.systemObj;
		this.listQuery.ecuClassId = id;
		this.contentList = [];
		this.rowList = [];
		this.listQuery.writeContent = [];
		this.ecuList = {
			ecuClassId: id,
			subId: id,
		};
	},
	methods: {
		// 导出
		handleExport() {
			if (this.list.length === 0) {
				this.$alert("暂无结果可导出", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			let tableData = [];
			this.list.forEach((element) => {
				let item = { ...element };
				item.result = item.result === "1" ? "成功" : "失败";
				tableData.push(item);
			});
			exportExcel(
				this.getExportData("写入零部件结果", this.tableList, tableData)
			);
		},
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			let serviceIds = "";
			let withParams = "";
			this.serviceList.forEach((r) => {
				serviceIds += r.id + ",";
				withParams += this.listQuery[r.content] + ",";
			});
			this.listQuery.serviceIds = serviceIds.substring(
				0,
				serviceIds.lastIndexOf(",")
			);
			this.listQuery.withParams = withParams.substring(
				0,
				withParams.lastIndexOf(",")
			);
			writeData(this.listQuery)
				.then(({ data }) => {
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
		selectCar() {
			this.carListVisible = true;
		},
		selectECU() {
			if (!this.carTypeId) {
				this.$alert("请先选择车辆", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.ecuListVisible = true;
		},
		loadCarVinno(row) {
			this.deleteListQueryValue();
			this.listQuery.vin = row.vinNo;
			this.listQuery.vinNoTotal = row.vinNoTotal;
			this.carTypeId = row.carTypeId;
			this.carData = row;
		},
		deleteListQueryValue() {
			for (let k in this.listQuery) {
				if (k === "vinNoTotal" || k === "vin" || k === "pageNum" || k === "pageSize") {
					continue;
				} else if (k === "writeContent") {
					if (this.listQuery[k].length > 0) {
						this.listQuery[k] = [];
						delete this.listQuery[k];
					}
				} else {
					this.listQuery[k] = "";
					delete this.listQuery[k];
				}
			}
		},
		loadECU(value) {
			this.deleteListQueryValue();
			this.listQuery.ecu = value.ecuName;
			this.listQuery.ecuId = value.ecuId;
			this.listQuery.ecuClassId = value.ecuClassId;
			this.contentList = [];
			this.rowList = [];
			this.listQuery.writeContent = [];
			this.ecuList = value;
			this.loadWriteContent({
				ecuId: value.ecuId,
				ecuClassId: value.ecuClassId,
			});
		},
		loadWriteContent(obj) {
			getWriteList(obj).then(({ data }) => {
				if (data.code === 0) {
					this.contentList = data.data;
				}
			});
		},
		handleFilter() {
			const formList = ["vin", "ecu", "writeContent"];
			this.serviceList.forEach((r) => {
				formList.push(r.content);
			});
			const checkLeft = this.checkForm({
				formName: "refForm",
				formList: formList,
			});
			if (!checkLeft) {
				return;
			}
			this.listQuery.pageNum = 1;
			this.listLoad();
		},
		//改变输入内容下拉框选项
		changeItem(idList) {
			this.collapse = true;
			this.rowList = [];
			this.serviceList = [];
			if (idList && idList.length > 0) {
				let itemArr = [];
				this.contentList.forEach((item) => {
					if (idList.includes(item.id)) {
						itemArr.push(item);
					}
				});
				let count = 1;
				let columns = [];
				let list = this.rowList;
				itemArr.forEach((r) => {
					let columnItem = {};
					columnItem.label = r.serviceName;
					let fieldName = r.content;
					columnItem.prop = fieldName;
					columnItem.fieldName = fieldName;
					columns.push(columnItem);
					this.serviceList.push(r);
					let len = r.writeLen;
					len = parseInt(len);
					this.setWriteFieldRules(fieldName, len);
					if (itemArr.length === count || count % 4 === 0) {
						let rows = {};
						rows.cols = columns;
						list.push(rows);
						columns = [];
					}
					count++;
				});
			}
		},
		//设置输入内容下拉框选择项字段的校验
		setWriteFieldRules(fieldName, length) {
			this.rules[fieldName] = [
				{ required: true, message: "请输入内容", trigger: "blur" },
				{
					min: length,
					max: length,
					message: "请输入长度为" + length + "的字符",
					trigger: "blur",
				},
			];
		},
	},
};
</script>

<style lang="scss" scoped></style>
