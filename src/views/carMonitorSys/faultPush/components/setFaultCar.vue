<template>
	<app-drawer
		:visibles.sync="visibles"
		width="60%"
		:title="'车辆列表'"
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
          @click-import="importVisible = true"
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
					rowKey="carId"
					:isTableSelection="true"
					:list="list"
					:tableHeights="tableHeight"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
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
			<import-dialog
				ref="importDialog"
				action="api/monitor/faultDetail/importCar"
				:template-url="'api/monitor/fileStatics/ImportVinBatchQuery.xlsx'"
				:visibles.sync="importVisible"
				:append-to-body="true"
				:data="task"
				@upload-success="importCarComplete"
			>
				<result-dialog
					:visibles.sync="resultVisible"
					:data="importResult"
					:text="'VIN码'"
					:keys="'vinNo'"
					:message="'无导入失败信息'"
					@export-fail="exportFail"
					@close="resultClose"
				>
				</result-dialog>
			</import-dialog>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { duplicateRemoval } from "@/utils/base";
//组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
// request
import {
	getChooseFaultCar,
	setFaultCodeCar,
} from "@/api/carMonitorSys/faultPush";
import { exportFailCars } from "@/api/commont";
export default {
	doNotInit:true,
	name: "selectFaultCar",
	components: { importDialog, resultDialog },
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
				vinNo: "",
				carTypeName: "",
				carBatchCode: "",
			},
			task: {
				taskId: "",
			},
			loading:false,
			tableList: [
				{ 
					value: "VIN码", 
					prop: "vinNo", 
					checked: true,
					width:170 
				},
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
			importVisible: false,
			resultVisible: false,
			importResult: {},
			paramsVisible: false,
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
				this.listLoad()
				this.selectList = [];
				this.task.taskId = this.data.id;
			}
		},
	},
	mounted() {
		 // 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "导入",
        functionNameEn: "导入",
        functionType: 1,
        iconType:2,
        url: "import",
        icon: "templateImport",
        isShow: 1,
      },
    ];
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				vinNo: "",
				carTypeName: "",
				carBatchCode: "",
				pageNum: 1,
        pageSize: 10,
			};
			this.collapse=false;
			this.list = [];
			this.selectList = [];
			this.$emit("update:visibles", false);
		},
		clickRow({ row }) {},
		listLoad() {
			this.listLoading = true;
			this.listQuery.id = this.data.id;
			getChooseFaultCar(this.listQuery)
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
		handleSelectionChange(val) {
			this.selectList = val;
		},
		//导入
		importCarComplete(data) {
			if (data.failedList&&data.failedList.length > 0) {
        this.resultVisible = true;
        this.importResult = data;
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
			this.listLoad();
			this.$emit("set-complete");
		},
		exportFail(data) {
			exportFailCars(data)
		},
		resultClose() {
			this.$refs.importDialog.closeDialog();
		},

		// 提交按钮
		submit() {
			const sourceCode = [];
			this.selectList.forEach((item) => {
				sourceCode.push(item.vinNo);
			});
			const postData = {
				taskId: this.data.id,
				type: 0,
				source: sourceCode.join(","),
			};
			this.loading=true
			setFaultCodeCar(postData).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "配置完成",
						duration: 2 * 1000,
					});
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

<style lang="scss" scoped></style>
