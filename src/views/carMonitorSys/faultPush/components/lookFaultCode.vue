<template>
	<app-drawer
		:visibles.sync="visibles"
		width="65%"
		:title="'已选故障码列表'"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
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
					:listLoading="listLoading"
					:tableHeights="tableHeight"
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
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getLookFaultCode,
	deleteFaultCode,
} from "@/api/carMonitorSys/faultPush";
export default {
	doNotInit:true,
	name: "lookFaultCode",
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
					prop: "faultCodeName",
					checked: true,
					width:140
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
			selectList:[],
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
				faultCode: "",
				faultName: "",
				pageNum: 1,
        pageSize: 10,
			};
			this.selectList = [];
      this.list = [];
			this.$emit("update:visibles", false);
		},
		handleSelectionChange(val) {
      this.selectList = val;
    },
		listLoad() {
			this.listLoading = true;
			this.listQuery.id = this.data.id;
			getLookFaultCode(this.listQuery)
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
		// 删除
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
			this.$confirm(`是否删除选中故障码?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteFaultCode(deleteData).then(({ data }) => {
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
