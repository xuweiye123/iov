<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'故障码列表'"
		width="60%"
		@close-drawer="closeDrawer"
		@ok-drawer="submit"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<!-- table -->
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					:is-collapse="false"
					slot="bottom"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<p class="textColor" style="margin: 0 0 10px 10px">
					已选中 {{ selectList.length }} 条数据
				</p>
				<app-table
					ref="tableList"
					slot="table"
					rowKey="faultCodeId"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:tableHeights="tableHeight"
					:isShowOperation="false"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop=='faultType' || scope.item.prop=='gbFaultLevel' || scope.item.prop=='faultLevel'" >
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
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { duplicateRemoval } from "@/utils/base";
// request
import {
	getChooseFaultCode,
	setFaultCodeCar,
} from "@/api/carMonitorSys/faultPush";
export default {
	doNotInit:true,
	name: "selectFaultCodeDialog",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle],
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
	filters: {
		switchText(val, type) {
			if (type === "faultType") {
				return val === 1 ? "国标故障" : val === 2 ? "自定义故障" : "-";
			} else if (type === "gbFaultLevel") {
				return val === 1
					? "一级"
					: val === 2
					? "二级"
					: val === 3
					? "三级"
					: "-";
			} else if (type === "faultLevel") {
				return val === 1
					? "一级"
					: val === 2
					? "二级"
					: val === 3
					? "三级"
					: val === 4
					? "四级"
					: "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	data() {
		return {
			disable: false,
			loading:false,
			changdu: 0,
			listQuery: {
				faultCode: "",
				faultName: "",
			},
			tableList: [
				{
					value: "故障码",
					prop: "faultCode",
					checked: true,
					width:140
				},
				{
					value: "故障名称",
					prop: "faultName",
					checked: true,
					width:150
				},
				{
					value: "故障类型",
					prop: "faultType",
					checked: true,
					width:120
				},
				{
					value: "国标故障等级 ",
					prop: "gbFaultLevel",
					checked: true,
					width:140
				},
				{
					value: "自定义故障等级 ",
					prop: "faultLevel",
					checked: true,
					width:140
				},
			],
			selectList: [],
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "故障码",
          value: "faultCode",
          type: "input",
        },
        {
          label: "故障名称",
          value: "faultName",
          type: "input",
        },
      ];
    },
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.selectList = [];
				this.listLoad();
			}
		},
	},
	mounted() {},
	methods: {
    handleSelectionChange(val) {
			this.selectList = val;
		},
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				faultCode: "",
				faultName: "",
				pageNum:1,
				pageSize:10
			};
			this.selectList=[]
			this.$emit("update:visibles", false);
		},
		listLoad() {
			
			this.listLoading = true;
			this.listQuery.id = this.data.id;
			getChooseFaultCode(this.listQuery)
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
		// 提交按钮
		submit() {
			if (this.selectList.length == 0) {
				this.$alert("请选中需要设置的项", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			const sourceCode = [];
			this.selectList.forEach((item) => {
				sourceCode.push(item.faultCode);
			});
			const postData = {
				taskId: this.data.id,
				type: 1,
				source: sourceCode.join(","),
			};
			this.disable = true;
			this.loading=true
			setFaultCodeCar(postData).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "配置完成",
						duration: 2 * 1000,
					});
					this.disable = false;
					this.$emit("set-complete");
					this.closeDrawer();
				}
				this.loading=false
			}).catch(() => {
				this.loading=false
			});
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
