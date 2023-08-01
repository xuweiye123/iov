<template>
	<app-dialog
		:visibles="visibles"
		:title="digTitle"
		width="60%"
		top="8vh"
		@close-dialog="closeDialog"
		:isFooter="false"
	>
		<div slot="formContent">
			<div class="js-system-user app-container">
				<app-table
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="0"
				>
					<template slot="tableContent" slot-scope="scope">
						<span
							v-if="
								(digType === '8' || digType === '5') &&
									scope.item.prop === 'result'
							"
						>
							{{ scope.row[scope.item.prop] | getResult }}
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</template>
				</app-table>

				<app-table
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="0"
				>
					<template slot="tableContent" slot-scope="scope">
						<span>{{
							scope.row.result ? scope.row.result.split(";")[0] : ""
						}}</span
						>&nbsp;&nbsp;&nbsp;&nbsp;
						<span v-if="scope.row.result && scope.row.result.split(';')[1]">{{
							scope.row.result.split(";")[1]
						}}</span>
					</template>
				</app-table>
			</div>
		</div>
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { commonExport } from "@/mixins/getExportData";
// request
import { getDxResult, getDxResultDataStream } from "@/api/diagnosisSys/digLog";
import { exportExcel } from "@/api/diagnosisSys/commont";
import { exportDxReport } from "@/api/diagnosisSys/online";
export default {
	doNotInit: true,
	name: "queryDigResult",
	mixins: [pagingMixin, dialogOtherHeight, commonExport],
	computed: {
		filterTableList() {
			if (this.digType === "12") {
				this.reportVisible = true;
				return;
			}
			this.reportVisible = false;
			let itemIndex = 0;
			switch (this.digType) {
				case "1":
				case "2":
				case "3":
					itemIndex = 0;
					break;
				case "5":
					itemIndex = 4;
					break;
				case "4":
					itemIndex = 1;
					break;
				case "7":
					itemIndex = 2;
					break;
				case "8":
					itemIndex = 3;
					break;
			}
			return this.tableList[itemIndex].filter((item) => item.checked);
		},
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		authouizeList: {
			type: Array,
			default: [],
		},
		digServiceId: {
			type: String,
			default: "",
		},
		digTitle: {
			type: String,
			default: "",
		},
		digType: {
			type: String,
			default: "",
		},
		vin: {
			type: String,
			default: "",
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.listLoad();
				}
			},
		},
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
	data() {
		return {
			listQuery: {},
			tableList: [
				[
					{
						value: "ECU名称",
						prop: "ecuName",
						position: "center",
						checked: true,
					},
					{
						value: "故障码",
						prop: "result",
						position: "center",
						checked: true,
					},
					{
						value: "故障码描述",
						prop: "content",
						position: "center",
						checked: true,
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
					},
				],
				[
					{
						value: "id",
						prop: "index",
						position: "center",
						checked: false,
						needMerge: true,
					},
					{
						value: "ECU名称",
						prop: "ecuName",
						position: "center",
						checked: true,
						needMerge: true,
					},
					{
						value: "故障码",
						prop: "content",
						position: "center",
						checked: true,
						needMerge: true,
					},
					{ value: "内容", prop: "name", position: "center", checked: true },
					{ value: "结果", prop: "value", position: "center", checked: true },
				],
				[
					{ value: "ECU", prop: "ecuName", position: "center", checked: true },
					{
						value: "读取内容",
						prop: "digContent",
						position: "center",
						checked: true,
					},
					{
						value: "读取结果",
						prop: "digResult",
						position: "center",
						checked: true,
					},
					{
						value: "原始数据流",
						prop: "rawData",
						position: "center",
						checked: true,
					},
					{
						value: "失败描述",
						prop: "digNRCDes",
						position: "center",
						checked: true,
					},
					{
						value: "读取时间",
						prop: "createdOn",
						position: "center",
						checked: true,
					},
				],
				[
					{
						value: "诊断时间",
						prop: "responseTime",
						position: "center",
						checked: true,
					},
					{
						value: "ECU名称",
						prop: "ecuName",
						position: "center",
						checked: true,
					},
					{
						value: "写入内容",
						prop: "content",
						position: "center",
						checked: true,
					},
					{
						value: "是否成功",
						prop: "result",
						position: "center",
						checked: true,
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
				],
				[
					{
						value: "诊断时间",
						prop: "responseTime",
						position: "center",
						checked: true,
					},
					{
						value: "ECU名称",
						prop: "ecuName",
						position: "center",
						checked: true,
					},
					{
						value: "是否成功",
						prop: "result",
						position: "center",
						checked: true,
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
				],
			],
			exportData: {}, //打印报告结果要导出的数据结构
			reportList: [], //打印报告结果table数据
			reportVisible: false,
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.exportData = {};
			if (this.digType == 7) {
				getDxResultDataStream({ token: this.digServiceId }).then(({ data }) => {
					if (data.code === 0) {
						let d = [];
						if (data.data.result) {
							d = data.data.result;
							let type = data.data.dxType;
							if (type === 4) {
								d = this.createNewData(d);
							}
							if (type === 12) {
								this.setReport(d);
								this.listLoading = false;
								return;
							}
						}
						this.list = d;
					}
					this.listLoading = false;
				});
			} else {
				getDxResult({ token: this.digServiceId }).then(({ data }) => {
					if (data.code === 0) {
						let d = [];
						if (data.data.result) {
							d = JSON.parse(data.data.result);
							let type = data.data.dxType;
							if (type === 4) {
								d = this.createNewData(d);
							}
							if (type === 12) {
								this.setReport(d);
								this.listLoading = false;
								return;
							}
						}
						this.list = d;
					}
					this.listLoading = false;
				});
			}
		},
		// 关闭dialog
		closeDialog() {
			this.list = [];
			this.faultParamList = {};
			this.reportList = [];
			this.$emit("update:visibles", false);
		},
		//处理冻结帧
		createNewData(data) {
			if (data.length === 0) {
				return;
			}
			let newData = [];
			let index = 0;
			data.forEach((r) => {
				if (r.result === "" || r.result === null) {
					let item = {};
					item.ecuName = r.ecuName;
					item.content = r.content;
					item.name = "";
					item.value = r.errorMessage;
					newData.push(item);
				} else {
					let result = JSON.parse(r.result);
					let len = result.length;
					for (let i = 0; i < len; i++) {
						let item = {};
						item.ecuName = r.ecuName;
						item.content = r.content;
						item.name = result[i].NAME;
						item.value = result[i].VALUE + result[i].UNIT;
						newData.push(item);
					}
				}
				index++;
			});
			this.setData(newData);
			return newData;
		},
		setData(data) {
			let rowCountEcu = 0;
			let rowCountFault = 0;
			let ecuNameList = [];
			let faultList = [];
			let index = 1;
			for (let i = 0; i < data.length; i++) {
				if (!ecuNameList.includes(data[i].ecuName)) {
					ecuNameList = [];
					ecuNameList.push(data[i].ecuName);
					data[i].ecuStartMultiRow = true;
					data[i].index = index;
					faultList = [];
					faultList.push(data[i].content);
					data[i].faultStartMultiRow = true;
					if (i > 0) {
						data[i - rowCountEcu].rowCountEcu = rowCountEcu;
						data[i - rowCountFault].rowCountFault = rowCountFault;
					}
					index++;
					rowCountEcu = 0;
					rowCountFault = 0;
				}
				if (!faultList.includes(data[i].content)) {
					faultList = [];
					faultList.push(data[i].content);
					data[i].faultStartMultiRow = true;
					if (i > 0) {
						// let k = i - rowCountFault;
						data[i - rowCountFault].rowCountFault = rowCountFault;
					}
					rowCountFault = 0;
				}
				rowCountEcu++;
				rowCountFault++;
				if (data.length === i + 1) {
					data[i + 1 - rowCountEcu].rowCountEcu = rowCountEcu;
					data[i + 1 - rowCountFault].rowCountFault = rowCountFault;
				}
			}
			return data;
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			if (this.digType === "4") {
				if (columnIndex === 0 || columnIndex === 1) {
					return this.multiSpanRow(row.ecuStartMultiRow, row.rowCountEcu);
				}
				if (columnIndex === 2) {
					return this.multiSpanRow(row.faultStartMultiRow, row.rowCountFault);
				}
			}
		},
		multiSpanRow(startMultiRow, rowCount) {
			if (startMultiRow) {
				return {
					rowspan: rowCount,
					colspan: 1,
				};
			} else {
				return {
					rowspan: 0,
					colspan: 0,
				};
			}
		},
		//打印报告数据处理
		setReport(data) {
			let dList = data.dtcList || "";
			let readList = data.readList || "";
			const dCount = dList.length;
			const readCount = readList.length;
			if (dCount === 0 && readCount === 0) {
				return;
			}
			let ecu = "";
			if (dCount > 0) {
				ecu = dList[0]["ecuName"];
			} else {
				dList = [{ content: "暂无数据", result: "" }];
			}
			if (readCount > 0) {
				ecu = ecu === "" ? readList[0]["ecuName"] : ecu;
			} else {
				readList = [{ content: "暂无数据", result: "" }];
			}
			this.exportData = {
				vin: this.vin,
				ecuName: ecu,
				dtcCount: dCount,
				readCount: readCount,
				dtcList: dList,
				readList: readList,
			};
			let param = [
				{
					content: "诊断车辆：" + this.vin + ";诊断ECU：" + ecu,
					result: "故障码数量：" + dCount + ";读取数量：" + readCount,
				},
				{
					content: "故障描述",
					result: "故障码",
				},
			];
			let title = [
				{
					content: "读取内容",
					result: "读取结果",
				},
			];
			this.reportList = [...param, ...dList, ...title, ...readList];
		},
		cellContentStyle({ row, column, rowIndex, columnIndex }) {
			if (row.content === "故障描述" || row.content === "读取内容") {
				return "background:#F5F7FA;color:#606266;font-weight:bold";
			}
		},
		handleExport() {
			if (this.digType === "12") {
				//打印报告
				if (Object.keys(this.exportData).length === 0) {
					this.$alert("暂无结果可导出", "提示", {
						confirmButtonText: "确定",
					});
					return;
				}
				exportDxReport(this.exportData);
				return;
			}
			if (this.list.length === 0) {
				this.$alert("暂无结果可导出", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			let tableData = [];
			this.list.forEach((element) => {
				let item = { ...element };
				if (this.digType === "5" || this.digType === "8") {
					item.result = item.result === "1" ? "成功" : "失败";
				}
				tableData.push(item);
			});
			exportExcel(
				this.getExportData("查看结果", this.filterTableList, tableData)
			);
		},
	},
};
</script>

<style lang="scss" scoped></style>
