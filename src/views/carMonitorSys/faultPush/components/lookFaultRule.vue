<template>
	<app-drawer
		:visibles.sync="visibles"
		width="65%"
		:title="'已选故障规则列表'"
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
          @click-filter="showfilter = true"
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
					rowKey="id"
					:isShowOperation="false"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop=='faultLevel'" >
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
	getLookFaultRule,
	deleteFaultRule,
} from "@/api/carMonitorSys/faultPush";
export default {
	doNotInit:true,
	name: "selectFaultRule",
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
			if (type === "faultLevel") {
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
				faultName: "",
				faultCode: "",
			},
			tableList: [
				{
					value: "故障码",
					prop: "faultCode",
					width: 150,
					checked: true,
				},
				{
					value: "故障名称",
					prop: "faultName",
					width: 120,
					checked: true,
				},
				{
					value: "间隔时间",
					prop: "coexistTime",
					width: 120,
					checked: true,
				},
				{
					value: "互斥故障码",
					prop: "mutexFaultCode",
					width: 120,
					checked: true,
				},
				{
					value: "互斥检测时间",
					prop: "mutexTime",
					width: 120,
					checked: true,
				},
				{
					value: "规则",
					prop: "ruleExpression",
					checked: true,
					width: 120,
				},
				{
					value: "参数",
					prop: "rulevarName",
					checked: true,
					width: 100,
				},
				{
					value: "自定义故障等级 ",
					prop: "faultLevel",
					width: 120,
					checked: true,
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
				pageNum:1,
				pageSize:10
			};
			this.selectList=[]
			this.$emit("update:visibles", false);
		},
		handleSelectionChange(val) {
      this.selectList = val;
    },
		listLoad() {
			this.listLoading = true;
			this.listQuery.id = this.data.id;
			getLookFaultRule(this.listQuery)
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
				ids.push(item.id);
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
					deleteFaultRule(deleteData).then(({ data }) => {
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
