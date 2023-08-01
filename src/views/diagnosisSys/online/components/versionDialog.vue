<template>
	<app-dialog
		:visibles="visibles"
		:title="'版本号信息'"
		width="62.5%"
		top="8vh"
		@close-dialog="closeDialog"
		:isFooter="true"
	>
		<div slot="formContent">
			<!-- table -->
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import { getVersion } from "@/api/diagnosisSys/online";
export default {
	doNotInit: true,
	name: "versionDialog",
	mixins: [pagingMixin, dialogOtherHeight],
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
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.versionTitle = this.data.versionTitle;
					this.listLoad(this.data);
				}
			},
		},
	},
	computed: {
		filterTableList() {
			return [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: this.versionTitle,
					prop: "wareVersion",
					checked: true,
					width: 120,
				},
				{
					value: "原始报文",
					prop: "content",
					checked: true,
					width: 100,
				},
				{
					value: "响应代码",
					prop: "resultCode",
					checked: true,
					width: 100,
				},
				{
					value: "响应描述",
					prop: "rwData",
					checked: true,
					width: 100,
				},
				{
					value: "读取时间",
					prop: "createOn",
					checked: true,
					width: 160,
				},
				{
					value: "结果",
					prop: "analysisResult",
					checked: true,
					width: 100,
				},
			];
		},
	},
	data() {
		return {
			versionTitle: "版本号", //版本字段名称
			interval: null, // 存储定时器
		};
	},
	// 关闭页面清除定时器和表格数据
	beforeDestroy() {
		this.qinkong();
		this.list = [];
		this.tipText = "";
	},
	methods: {
		qinkong() {
			clearInterval(this.interval);
		},
		listLoad(item) {
			let i = 0;
			//开始定时
			this.interval = setInterval(() => {
				//判断是否拿到所有报文。拿到所有报文后停止请求
				const data = {
					token: item.token,
					pageNum: 1,
					pageSize: 100,
				};
				// 请求报文数据
				getVersion(data)
					.then(({ data }) => {
						if (data.data) {
							let temp = [];
							temp = [...this.list];
							this.list = data.data;
							if (temp.length == this.list.length) {
								i++;
								if (i == 10) {
									clearInterval(this.interval);
									this.tipText = "数据上报完毕";
								}
							} else {
								i = 0;
							}
						} else {
							i++;
							if (i == 10) {
								this.tipText = "暂无数据";
								this.qinkong();
								this.versionTitle = "版本号";
							}
						}
						this.listLoading = false;
					})
					.catch((error) => {
						this.listLoading = false;
						this.tipText = "数据上报失败！";
					});
			}, 3000);
		},
		// 关闭dialog
		closeDialog() {
			this.list = [];
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
