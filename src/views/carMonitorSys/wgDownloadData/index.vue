<template>
	<div class="js-basedata-cargroup app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form :listQuery="listQuery" :searchList="searchList" />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				@click-filter="showfilter = true"
				@click-uploadRecord="handleUploadRecord"
				@click-fileUpload="handleFileUpload"
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
				@click-download="handleDownload"
				:buttonList="insideList"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop == 'downloadFileSize'">
						<!-- {{ scope.row[scope.item.prop] ? scope.row[scope.item.prop]:0 }}MB -->
						{{ size(scope.row[scope.item.prop]) }}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<file-upload-records-drawer
			:visibles.sync="fileUploadListVisible"
			:data="tableRow"
		/>
		<file-upload-list-drawer
			:visibles.sync="fileUploadVisible"
			:data="tableRow"
			@add-complete="addComplete"
		/>
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getPageList,
	getDownLoadUrl,
} from "@/api/carMonitorSys/wgDownloadData";
import fileUploadRecordsDrawer from "./components/fileUploadRecordsDrawer";
import fileUploadListDrawer from "./components/fileUploadListDrawer";
import  { processData }  from "@/filters";
export default {
	name: "wgDownloadData",
	CN_name: "网关大数据下载",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	components: { fileUploadRecordsDrawer, fileUploadListDrawer },
	data() {
		return {
			listQuery: {
				vinNo: "",
				timeRange: [],
			},
			fileUploadListVisible: false,
			fileUploadVisible: false,
			downloadLoading: null,
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					width: 100,
					checked: true,
				},
				{
					value: "文件名称",
					prop: "downloadFileName",
					width: 250,
					checked: true,
				},
				{
					value: "文件大小",
					prop: "downloadFileSize",
					width: 90,
					checked: true,
				},
				{
					value: "最后一次下载时间",
					prop: "modifiedOn",
					width: 250,
					checked: true,
				},
				{
					value: "下载人",
					prop: "modifiedBy",
					width: 100,
					checked: true,
				},
				{
					value: "上传时间",
					prop: "createdOn",
					width: 140,
					checked: true,
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
				{
					label: "时间范围",
					value: "timeRange",
					type: "dateTimeRange",
					spanNumber: 12,
				},
			];
		},
	},
	mounted() {},
	methods: {
		size(val){
      let size = processData(val)
			size = size == "-"?'0MB':size+'MB'
      return size;
		},
		addComplete() {
			this.$message.success({
				message: "配置文件上传完成",
				duration: 2 * 1000,
			});
			this.listLoad();
		},
		// 清空
		handleClear() {
			this.listQuery = {
				vinNo: "",
				timeRange: [],
				pageNum: 1,
				pageSize: 10,
			};
			this.list = [];
			this.total = 0;
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime = this.listQuery.timeRange
				? this.listQuery.timeRange[0]
				: "";
			this.listQuery.endTime = this.listQuery.timeRange
				? this.listQuery.timeRange[1]
				: "";
			this.listLoading = true;
			getPageList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					this.total = 0;
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
		handleUploadRecord(row) {
			this.tableRow = row;
			this.fileUploadListVisible = true;
		},
		handleFileUpload(row) {
			this.tableRow = row;
			this.fileUploadVisible = true;
		},
		handleDownload(row) {
			this.downloadLoading = this.$loading({
				target: document.querySelector(".el-dialog-import-sim"),
				text: "文件下载中...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
			getDownLoadUrl({ id: row.id }).then(({ data }) => {
				if (data.code === 0) {
					if (!data.data) {
						this.$message.error("无下载内容");
						this.downloadLoading.close();
						return;
					}
					let a = document.createElement("a"); //创建a标签
					a.setAttribute("href", data.data); //设置文件下载地址
					a.setAttribute("target", "_blank"); //在当前页面创建下载
					document.body.appendChild(a); //添加到body
					a.click(); //触发事件
					document.body.removeChild(a); //移除标签
				}
			}).finally(() => {
				this.downloadLoading.close();
			});
		},
	},
};
</script>

<style lang="scss"></style>
