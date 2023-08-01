<template>
	<app-drawer
		:visibles.sync="visibles"
		width="65%"
		:title="'已选车辆列表'"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
            :spanNumber="8"
						:collapse="collapse"
            :listQuery="listQuery"
            :searchList="searchList"
          />
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					slot="bottom"
					:isdisabled="listLoading"
					@click-collapse="handleCollapse"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<app-authorize-button
          :buttonLeft="headersLeftList"
          :buttonRight="[]"
          @click-filter="showfilter = false"
          :showRightButton="false"
          @click-delete="handleDelete"
        >
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="tableList"
            :scroll-line="8"
          />
        </app-authorize-button>
        <p class="textColor" style="margin: 0 0 10px 10px">
          已选中 {{ selectList.length }} 条数据
        </p>
				<app-table
					ref="tableList"
					slot="table"
					:isTableSelection="true"
					:list="list"
					:tableHeights="tableHeight"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
					rowKey="oid"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span>
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
import { getPageButton } from "@/mixins/getButton";
// request
import { getlookFaultCar, deleteFaultcar } from "@/api/carMonitorSys/faultPush";
export default {
	doNotInit:true,
	name: "lookFaultCar",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle,getPageButton],
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
			listQuery: {
				vinNo:"",
				carTypeName: "",
				carBatchCode: "",
			},
			changdu: 0,
			tableList: [
				{ value: "VIN码", prop: "source",  checked: true,width:170  },
				{
					value: "车型名称",
					prop: "carTypeName",
					checked: true,
					width:120 
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					checked: true,
					width:120 
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
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "车型名称",
          value: "carTypeName",
          type: "input",
        },
        {
          label: "项目代号",
          value: "carBatchCode",
          type: "input",
        },
      ];
    },
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {
		// 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "删除",
        functionNameEn: "删除",
        functionType: 1,
        iconType:2,
        url: "delete",
        icon: "ic_delete",
        isShow: 1,
      },
    ];
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				vinNo:"",
				carTypeName: "",
				carBatchCode: "",
				pageNum: 1,
        pageSize: 10,
			};
			this.selectList = [];
      this.list = [];
      this.collapse=false;
			this.$emit("update:visibles", false);
		},
		handleSelectionChange(val) {
			this.selectList = val;
		},
		listLoad() {
			this.listLoading = true;
			this.listQuery.id = this.data.id;
			getlookFaultCar(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.tableRow = {};
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		//删除
		handleDelete() {
			if (this.selectList.length == 0) {
				this.$alert("请选中需要删除项", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			const ids = [];
			this.selectList.forEach((item) => {
				ids.push(item.oid);
			});
			const deleteData = {
				taskId: this.data.id,
				ids: ids.join(","),
			};
			this.$confirm(`是否删除选中车辆?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteFaultcar(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.tableRow = {};
							this.$emit("delete-complete");
							this.closeDrawer();
							this.$message.success({
								message: "删除成功",
								duration: 2 * 1000,
							});
						}
					});
				})
				.catch(() => {});
		},
	},
};
</script>
<style lang="scss" scoped></style>
