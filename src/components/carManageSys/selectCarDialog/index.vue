<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择车辆'"
		width="80%"
		@close-dialog="closeDialog"
		@handle-submit="submit"
		:isFooter="true"
		top="6vh"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<el-form
						:label-position="'right'"
						:model="listQuery"
						label-width="65px"
					>
						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="VIN码：">
									<vin-select
										:is-vin="true"
										customClass="vin-select-dialog"
										v-model="listQuery.vinNo"
										@vinNoTotal="getVinNoTotal"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="终端编号：">
									<el-input
										v-model="listQuery.terminalCode"
										placeholder="请输入终端编号"
										clearable
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8" v-show="collapse">
								<el-form-item label="车型名称：">
									<el-select
										v-model="listQuery.carTypeId"
										placeholder="请选择"
										@change="carTypeChange"
										@clear="carTypeClear"
										filterable
										clearable
									>
										<el-option
											v-for="(item, index) in carTypeList"
											:key="index"
											:label="item.carTypeName"
											:value="item.carTypeId"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row
							:gutter="10"
							v-show="collapse"
						>
							<el-col :span="8">
								<el-form-item label="项目代号：">
									<el-select
										v-model="listQuery.carBatchId"
										placeholder="请选择"
										@change="change"
										filterable
										clearable
									>
										<el-option
											v-for="(item, index) in batchCodeList"
											:key="index"
											:label="item.carBatchCode"
											:value="item.carBatchId"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					slot="bottom"
					:isdisabled="listLoading"
					@click-collapse="handleCollapse"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
				<!-- :isdisabled="isBtn2" -->
			</app-search>
			<!-- 按钮 -->
			<div class="section-wrap">
				<div style="display:flex;justify-content: space-between;align-items: center;">
					<p class="textColor" style="margin-left:8px;">已选择 {{ selectList.length }} 辆车</p>
					<app-authorize-button @click-filter="showfilter = true">
						<checked-Filter
							slot="check-filter"
							:show.sync="showfilter"
							:list="tableList"
							:scroll-line="8"
						/>
					</app-authorize-button>
				</div>
				<app-table
					slot="table"
					ref="historyTable"
					:tableHeights="tableHeight"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					rowKey="carId"
					:isReserve="false"
					:isShowOperation="false"
					:isPagination="true"
					@row-click="clickRow"
					@select="rowSelect"
					@select-all="selectAll"
					@sort-change="sortChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop === 'carVehicle'">
							{{
								scope.row[scope.item.prop] == 1
									? "商品车"
									: scope.row[scope.item.prop] == 2
									? "试验车"
									: scope.row[scope.item.prop] == 3
									? "对标车"
									: "-"
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
		</div>
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request
// import { getBatchAll,getCarTypeList } from '@/api/commont'
import { duplicateRemoval } from "@/utils/base";
import { getCarTypeInfo, getBatchCodeInfo } from "@/api/carManageSys/carInform";
import { getChooseCar } from "@/api/carManageSys/carSimSearch";
export default {
	doNotInit: true,
	name: "selectCarDialog",
	mixins: [pagingMixin, dialogOtherHeight, tableStyle],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
	filters: {
		carType(e) {
			switch (e) {
				case 1:
					return "商品车";
				case 2:
					return "试验车";
				case 3:
					return "对标车";
			}
		},
	},
	data() {
		return {
			listQuery: {
				vinNo: "",
				terminalCode: "",
				carTypeId: "",
				carBatchId: "",
			},
			isBtn2: true,
			tableList: [
				{ value: "VIN码", prop: "vinNo",checked: true ,width:200 },
				{
					value: "终端编号",
					prop: "terminalCode",
					checked: true,
					width:120 
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					checked: true,
					width:120 
				},
				{
					value: "项目代号 ",
					prop: "carBatchCode",
					checked: true,
					width:120 
				},
				{
					value: "营运区域 ",
					prop: "areaName",
					checked: true,
					width:120 
				},
			],
			batchCodeList: [],
			carTypeList: [],
			selectList: [],
			confirmSelect: [],
			// changdu: 0,
		};
	},
	computed: {
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.list = [];
					this.selectList = [...this.data];
					// this.changdu = this.selectList.length
					this.listLoad();
					if (this.isEdit) {
						if (this.formInfo.carTypeId) {
							const postData = {
								carTypeId: this.formInfo.carTypeId,
							};
							getBatchCodeInfo(postData).then(({ data }) => {
								if (data.code === 0) {
									this.batchCodeList = data.data || [];
								}
							});
						}
					}
				}
			},
		},
		'listQuery.carTypeId':{
			handler(e1) {
				if (!e1) {
					this.listQuery.carBatchId = "";
					this.batchCodeList = [];
				}
			}
		}
	},
	mounted() {
		// getBatchCodeInfo().then(({data})=>{
		//   if(data.code===0){
		//     this.batchCodeList = data.data || []
		//   }
		// })
		getCarTypeInfo().then(({ data }) => {
			if (data.code === 0) {
				this.carTypeList = data.data || [];
			}
		});
	},
	methods: {
		change() {
			this.$forceUpdate();
		},
		// 清空车型名称
		carTypeClear() {
			this.listQuery.carBatchId = "";
			this.batchCodeList = [];
		},
		// 车型名称改变
		carTypeChange(e) {
			if (!e) {
				return;
			}
			this.listQuery.carBatchId = "";
			this.batchCodeList = [];
			const postData = {
				carTypeId: e,
			};
			getBatchCodeInfo(postData).then(({ data }) => {
				if (data.code === 0) {
					this.batchCodeList = data.data || [];
				}
			});
		},
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.historyTable.refTable().toggleRowSelection(row, true);
				});
			} else {
				this.$refs.historyTable.refTable().clearSelection();
			}
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery = {
				vinNo: "",
				terminalCode: "",
				carTypeId: "",
				carBatchId: "",
				pageNum: 1,
        pageSize: 10,
			};
			this.collapse=false;
			this.formInfo = {};
			// this.changdu = 0;
			this.list = [];
			this.selectList = [];
			this.total = 0;
			this.$emit("update:visibles", false);
			this.isBtn2 = true;
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			getChooseCar(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data || []
            this.total = data.total || 0
						this.$nextTick(() => {
							// this.toggleSelection(this.selectList);
							console.log(this.selectList,"this.selectList-ListLoad")
							for (let i = 0; i < this.list.length; i++) {
								this.selectList.forEach((r) => {
								// this.data.forEach((r) => {
									if (this.list[i].carId === r.carId) {
										console.log(this.list[i].carId,"11")
										this.$refs.historyTable
											.refTable()
											.toggleRowSelection(this.list[i], true);
									}
									
								});
							}
						});
					}
					this.listLoading = false;
					this.isBtn2 = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		rowSelect(selection, row) {
			const index = this.selectList.findIndex(
				(item) => item.carId === row.carId
			);
			if (index > -1) {
				this.selectList.splice(index, 1);
			} else {
				this.selectList.push(row);
			}
			// this.changdu = selection.length;
			console.log(this.selectList,"单选",selection)
		},
		selectAll(selection) {
			//此时反选
			// if (this.changdu > selection.length) {
			// 	for (let i = 0; i < this.list.length; i++) {
			// 		const index = this.selectList.findIndex(
			// 			(item) => item.carId === this.list[i].carId
			// 		);
			// 		if (index > -1) {
			// 			this.selectList.splice(index, 1);
			// 		}
			// 	}
			// 	console.log(1)
			// } else {
			// 	for (let i = 0; i < this.list.length; i++) {
			// 		this.selectList.push(this.list[i]);
			// 	}
			// 	console.log(2)
			// }
			// this.changdu = selection.length;
			if (selection.length > 0) {
					selection.forEach((item) => {
						if (!this.selectList.map((i) => i.carId).includes(item.carId)) {
							this.selectList.push(item);
						}
					})
			} else {
				this.list.forEach((item) => {
						this.selectList.forEach((item1, index) => {
							if (item1.carId === item.carId) {
								this.selectList.splice(index, 1);
							}
						});
					});
			}
			this.selectList = duplicateRemoval([...this.selectList], "vinNo");
			console.log(this.selectList,"全选",selection)
		},
		/**
		 * 返回两个集合的差集
		 */
		difference(thisSet, otherSet) {
			//初始化一个新集合，用于表示差集。
			var differenceSet = new Set();
			//将当前集合转换为数组
			var values = Array.from(thisSet);
			//遍历数组，如果另外一个集合没有该元素，则differenceSet加入该元素。
			for (var i = 0; i < values.length; i++) {
				if (!otherSet.has(values[i])) {
					differenceSet.add(values[i]);
				}
			}
			return differenceSet;
		},
		clickRow({ row }) {
			const index = this.selectList.findIndex(
				(item) => item.carId === row.carId
			);
			if (index > -1) {
				this.selectList.splice(index, 1);
			} else {
				this.selectList.push(row);
			}
			// this.changdu = this.selectList.length;
			console.log(this.selectList,"this.selectList-clickRow")
		},
		// 提交按钮
		submit(e) {
			if(this.selectList.length == 0){
          this.$message.warning({
            message: '请选择要添加的车辆',
            duration: 2 * 1000
          })
          return
      }
			this.$emit("select-complete", this.selectList);
			this.closeDialog();
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
