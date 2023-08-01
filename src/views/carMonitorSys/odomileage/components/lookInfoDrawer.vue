<template>
	<app-drawer
		:visibles.sync="visibles"
		width="55%"
		:title="'任务明细'"
		@close-drawer="closeDrawer"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search>
				<div slot="content">
					<seach-form
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
					<!-- <el-form
						:label-position="'right'"
						:model="listQuery"
						label-width="65px"
					>
						<el-row type="flex" justify="start" align="middle">
							<el-col :span="8">
								<el-form-item label="VIN码：">
									<vin-select
										:is-vin="true"
										customClass="vinsearch"
										v-model="listQuery.vinNo"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form> -->
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					slot="bottom"
					:is-collapse="false"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<app-authorize-button 
				  :buttonLeft="[]"
          :buttonRight="headersRightList"
					:exportLoading="exportLoading"
					@click-export="handleExport" 
					@click-filter="showfilter = true"
				>
				 <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
        />
      </app-authorize-button>
				<app-table
					ref="tableList"
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:tableHeights="tableHeight"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
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
import { selectDetail, exportDetail } from "@/api/carMonitorSys/odoMileage";
export default {
	name: "LookInfoDrawer",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle, getPageButton],
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
			formInfo: {},
			listQuery: {
				vinNo: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "开始时间",
					prop: "dataStartTime",
					width: 140,
					checked: true,
				},
				{
					value: "结束时间",
					prop: "dataEndTime",
					width: 140,
					checked: true,
				},
				{
					value: "开始里程(KM)",
					prop: "startValue",
					width: 140,
					checked: true,
				},
				{
					value: "结束里程(KM)",
					prop: "endValue",
					width: 140,
					checked: true,
				},
				{
					value: "行驶里程(KM)",
					prop: "mileage",
					width: 140,
					checked: true,
				},
				{
					value: "说明",
					prop: "remark",
					checked: true,
					width: 140,
				},
			],
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
      ];
    },
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.formInfo = { ...this.data };
				this.listLoad();
			}
		},
	},
	mounted() {
		// 暂时强行添加
		this.headersRightList = [
		  {
		    functionName: "导出",
		    functionNameEn: "导出",
		    functionType: 2,
		    url: "export",
		    icon: "export",
		    isShow: 1,
		  },
		];
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				vinNo: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.$emit("update:visibles", false);
		},
		// 导出
		handleExport() {
			const postData = {
				id: this.formInfo.id,
				vinNo: this.listQuery.vinNo,
			};
			this.exportLoading = true;
			exportDetail(postData).then(({ data }) => {
				if (data.code === 0) {
					//
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.id = this.formInfo.id;
			selectDetail(this.listQuery)
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
	},
};
</script>
