<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择ECU'"
		width="912px"
		top="8vh"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:isFooter="true"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form :listQuery="listQuery" :searchList="searchList" />
				</div>
				<div slot="bottom">
					<app-search-button
						:isCollapse="false"
						:isdisabled="listLoading"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<div class="system-container" v-loading="subloading">
				<div style="padding-left:10px">
					请选择分系统：
					<span class="textColor">
						{{ errorMessage }}
					</span>
				</div>
				<div class="system-btn">
					<el-button
						:type="item.isSelect ? 'primary' : 'info'"
						v-for="(item, index) in subSystemList"
						:key="index"
						:class="[
							index % 8 === 0 ? '' : '',
							item.isSelect ? 'select-subsystem-btn' : 'noselect-subsystem-btn',
						]"
						style="width:calc(20% - 10px);margin: 5px;"
						@click="clickSubSystem(item.id)"
					>
						{{ item.subSystemName }}
					</el-button>
				</div>
			</div>
			<div class="ecu-list" v-loading="eculoading" v-show="isShowEcu">
				<div class="section-flex">
					<div style="padding-left:10px">
						请选择ECU：
						<span class="textColor">
							{{ rowECUName }}
						</span>
					</div>
				</div>
				<ul class="checkbox-ul">
					<li
						v-for="(item, index) in list"
						:key="index"
						class="checkbox-li"
						:style="{
							borderLeft: index > 0 && index % 6 !== 0 ? '0' : '',
							borderTop: index >= 6 ? '0' : '',
						}"
						@click="changeHandle(item)"
					>
						<div class="div1">
							<el-checkbox
								@change="changeHandle(item)"
								v-model="item.isSelect"
							></el-checkbox>
						</div>
						<div class="checkbox-text">
							<span>{{ item.ecuName }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</app-dialog>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
// request
import { getSubSystemList, getECUList2 } from "@/api/diagnosisSys/commont";
export default {
	doNotInit: true,
	name: "SelectECUDialog",
	mixins: [pagingMixin],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		ecuClassId: {
			type: String,
			default: "",
		},
		carTypeId: {
			type: String,
			default: "",
		},
		data: {
			type: Object,
			default: {},
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.listLoad();
					if (this.data.ecuName) {
						this.tableRow = {
							ecuName: this.data.ecuName,
							id: this.data.ecuId,
						};
						this.listQuery.ecuClassId = this.data.ecuClassId;
						this.subId = this.data.subId;
					}
				}
			},
		},
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "ECU名称",
					value: "ecuname",
				},
			];
		},
	},
	data() {
		return {
			listQuery: {
				ecuClassId: "",
			},
			subSystemList: [],
			index: "",
			radio: "",
			rowECUName: "",
			errorMessage: "",
			isShowEcu: false,
			subloading: false,
			eculoading: false,
			subId: "",
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listQuery.carTypeId = this.carTypeId;
			this.listQuery.pageSize = 100;
			this.subloading = true;
			getSubSystemList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0 && data.total > 0) {
						this.subSystemList = data.data || [];
						this.subSystemList.forEach((row) => {
							if (row.id == this.data.subId) {
								this.$set(row, "isSelect", true);
								this.loadEcu(row.id);
							} else {
								this.$set(row, "isSelect", false);
							}
						});
					} else {
						this.errorMessage = "暂无数据";
					}
					this.subloading = false;
				})
				.catch(() => {
					this.subloading = false;
				});
		},
		loadEcu(ecuClassId) {
			this.isShowEcu = true;
			this.list = [];
			this.listQuery.ecuClassId = ecuClassId;
			this.eculoading = true;
			getECUList2(this.listQuery)
				.then(({ data }) => {
					this.eculoading = false;
					if (data.code === 0) {
						this.list = data.data || [];
						this.list.forEach((row) => {
							if (row.id == this.data.ecuId) {
								this.$set(row, "isSelect", true);
							} else {
								this.$set(row, "isSelect", false);
							}
						});
					}
				})
				.catch(() => {
					this.eculoading = false;
				});
		},
		clickSubSystem(id) {
			this.subId = id;
			this.loadEcu(id);
			for (let i = 0; i < this.subSystemList.length; i++) {
				if (this.subSystemList[i].id == id) {
					this.$set(this.subSystemList[i], "isSelect", true);
				} else {
					this.$set(this.subSystemList[i], "isSelect", false);
				}
			}
		},
		changeHandle(e) {
			this.$set(e, "isSelect", !e.isSelect);
			this.tableRow = e;
			this.rowECUName = e.isSelect ? "   " + e.ecuName : "";
			const { id } = e;
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].id != id) {
					this.$set(this.list[i], "isSelect", false);
				}
			}
		},
		handleConfirm() {
			if (!this.tableRow.id) {
				this.$alert("请选中ECU", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			let ecuData = {
				ecuName: this.tableRow.ecuName,
				ecuId: this.tableRow.id,
				ecuClassId: this.listQuery.ecuClassId,
				subId: this.subId,
			};
			this.$emit("carECU", ecuData);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery = {
				ecuname: "",
				pageSize: 10,
				pageNum: 1,
			};
			this.tableRow = {};
			this.subSystemList = [];
			this.list = [];
			this.rowECUName = "";
			this.errorMessage = "";
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped>
.system-container {
	padding: 15px;
	background: #fff;
	.system-title {
		color: #409eff;
		span {
			margin-left: 3px;
		}
	}
	.system-btn {
		.btn-one {
			margin-left: 0 !important;
		}
	}
}

.checkbox-ul {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	padding: 0;
	.checkbox-li {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #f2f3f5;
		border-radius: 2px;
		padding-right: 20px;
		margin: 5px;
		cursor: pointer;
		.div1 {
			width: 36px;
			padding: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
.ecu-list {
	background: #fff;
	padding: 15px;
	margin-top: 10px;
}
.noselect-subsystem-btn {
	color: #272727 !important;
	border-color: #f2f3f5 !important;
	background: #f2f3f5 !important;
	border-radius: 2px !important;
}
</style>
