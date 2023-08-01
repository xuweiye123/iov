<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-filter="showfilter = true"
				@click-add="handleAdd"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-update="handleUpdate"
				@click-delete="handleDelete"
				@row-click="rowClick"
        @click-look="handleVersionDetail"
				@handle-selection-change="handleSelectionChange"
				@sort-change="sortChange"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						@click="handleVersionDetail(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'versionNumber'"
					>
						{{ scope.row[scope.item.prop] | processData}}
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>

		<!-- 新增编辑dialog弹窗 -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:isDetail="isDetail"
			:data="isEdit ? tableRow : isDetail ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";

// request
import {
	getPlatformVersion,
	deleteVersion,
} from "@/api/carMonitorSys/updateLog";

// 辅助函数
export default {
	name: "updateLog",
	CH_name:"更新日志",
	components: {
		addUpdateDrawer,
	},
	filters: {
		switchText(val, type) {
			if (type === "contactType") {
				return val === 1
					? "车主"
					: val === 2
					? "单位联系人"
					: val === 3
					? "用车人"
					: "-";
			} else if (type === "gender") {
				return val === 1 ? "男" : val === 2 ? "女" : "-";
			} else {
				return val;
			}
		},
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton,getDropList],
	data() {
		return {
			listQuery: {
				versionNumber: "",
				moduleId: "",
			},
			moduleList: [],
			addUpdateVisible: false /* 查看导出记录*/,
			isEdit: false, //是否编辑
			isDetail: false,
			// 字段管理所需字段
			tableList: [
				{
					value: "版本号",
					prop: "versionNumber",
					width: 100,
					checked: true,
				},
				{
					value: "模块",
					prop: "module",
					width: 100,
					checked: true,
				},
				{
					value: "更新时间",
					prop: "updateTime",
					width: 140,
					checked: true,
				},
				{
					value: "更新简介",
					prop: "updateTitle",
					width: 150,
					checked: true,
				},
				{
					value: "操作人",
					prop: "createdBy",
					width: 100,
					checked: true,
				},
			],
			// 字典下拉
			dropList:[
        { postData:{dicCode:1015},key:'moduleList' }
      ]
		};
	},
	watch: {},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "版本号",
          value: "versionNumber",
          type: "input",
        },
        {
          label: "模块",
          value: "moduleId",
          type: "select",
          options: {
            data: this.moduleList,
						// extraProps: { 
						// 	label: "label",
						// 	value: "label",
						// }, 
          },
        },   
      ];
    },
	},
	mounted() {
		// 获取字典下拉
		this.getDropList(this.dropList)
	},
	methods: {
		// 点击列
		rowClick({ row }) {
			this.tableRow = {};
			this.list.some((item, index) => {
				if (item.id === row.id) {
					row.$index = index;
				}
			});
			this.tableRow = row;
		},
		// 判断是否选中
		tableRowIsSlect() {
			const { $index } = this.tableRow;
			if ($index === undefined) {
				return false;
			} else {
				return true;
			}
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getPlatformVersion(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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
		// 新增
		handleAdd() {
			this.isEdit = false;
			this.isDetail = false;
			this.addUpdateVisible = true;
		},
		// 新增成功
		addComplete() {
			this.listLoad();
			this.$message.success({
				message: "新增成功",
				duration: 2 * 1000,
			});
		},
		// 编辑
		handleUpdate(row) {
			this.isEdit = true;
			this.isDetail = false;
			this.addUpdateVisible = true;
			this.tableRow = row;
		},
		// 编辑成功
		updateComplete() {
			this.listLoad();
			this.$message.success({
				message: "编辑成功",
				duration: 2 * 1000,
			});
		},
		handleVersionDetail(row) {
			this.tableRow = row;
			this.isDetail = true;
			this.isEdit = false;
			this.addUpdateVisible = true;
		},
		// 删除
		handleDelete(row) {
			const deleteData = {
				versionId: row.versionId,
				versionNumber: row.versionNumber,
			};
			this.$confirm(`是否删除版本${row.versionNumber}的更新记录？`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteVersion(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.listLoad();
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
