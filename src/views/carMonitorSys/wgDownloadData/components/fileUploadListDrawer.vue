<template>
	<app-drawer
		:visibles.sync="visibles"
		width="55%"
		:title="'配置文件上传'"
		@close-drawer="closeDrawer"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<!--  -->
			<div class="otherDrawerBox">
				<div class="fileuploadDiv">
					<p>选择配置文件</p>
				</div>
				<div class="fileuploadDiv" style="margin-bottom: 0;">
					<el-row :gutter="10" type="flex" justify="center">
						<el-col :span="16">
							<el-form>
								<el-form-item
									label-position="'right'"
									label-width="50px"
									label="文件："
								>
									<el-input v-model="fileName" disabled />
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="4">
							<el-upload
								ref="upload"
								:headers="{ Authorization: token }"
								:auto-upload="false"
								:show-file-list="false"
								:file-list="fileList"
								:multiple="true"
								:before-upload="beforeupload"
								:on-change="fileChange"
								:on-error="fileError"
								:on-success="fileSuccess"
								action=""
								class="el-upload-block"
							>
								<el-button type="primary">
									浏览
								</el-button>
							</el-upload>
						</el-col>
					</el-row>
					<div style="display: flex;justify-content: center;">
						<div>
							<span class="textColor">注：</span>1、仅支持
							<span>{{ accept }} </span>格式的文件，一次只能选择一个；
						</div>
					</div>
				</div>
			</div>
			<!--  -->
			<div class="carListDiv">
				<div class="fileuploadDiv">
					<p>选择车辆</p>
				</div>
				<div class="fileuploadDiv" style="margin-bottom: 0;">
					<app-search :show-title="false">
						<div slot="content">
							<el-form
								:label-position="'right'"
								:model="listQuery"
								label-width="65px"
							>
								<el-row :gutter="10">
									<el-col :span="8">
										<el-form-item label="VIN码：">
											<vin-select
												:is-vin="true"
												customClass="vin-select-dialog"
												v-model="listQuery.vinNo"
												@vinNoTotal="getVinNoTotal"
											/>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="终端编号：">
											<el-input
												v-model="listQuery.terminalCode"
												placeholder="请输入终端编号"
												clearable
											/>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-show="collapse">
										<el-form-item label="车型名称：">
											<el-select
												v-model="listQuery.vehicleTypeId"
												placeholder="请选择"
												filterable
												clearable
											>
												<el-option
													v-for="(item, index) in vehicleTypeList"
													:key="index"
													:label="item.label"
													:value="item.value"
												/>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row v-show="collapse">
									<el-col :span="8">
										<el-form-item label="占位符" style="visibility: hidden;">
											<el-input />
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
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
						<div
							style="display:flex;justify-content: space-between;align-items: center;"
						>
							<p class="textColor" style="margin-left:8px;">
								已选择 {{ selectList.length }} 辆车
							</p>
							<!-- 按钮 -->
							<app-authorize-button @click-filter="showfilter = true">
								<checked-Filter
									slot="check-filter"
									:show.sync="showfilter"
									:list="tableList"
									:scroll-line="8"
								/>
							</app-authorize-button>
						</div>
						<app-table
							slot="table"
							ref="catListTable"
							:tableHeights="tableHeight + 390"
							:isTableSelection="true"
							:list="list"
							:listLoading="listLoading"
							:filterTableList="filterTableList"
							:pageObj="listQuery"
							:total="total"
							rowKey="carId"
							:isShowOperation="false"
							:isPagination="true"
							@handle-selection-change="handleSelectionChange"
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
				</div>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getDropList } from "@/mixins/dictionaryDropList";

import {
	getConfigCarList,
	uploadConfigFile,
} from "@/api/carMonitorSys/wgDownloadData";
// request
export default {
	name: "fileUploadListDrawer",
	mixins: [
		partialForm,
		drawerOtherHeight,
		pagingMixin,
		tableStyle,
		getDropList,
	],
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
	computed: {
		token() {
			return this.$store.getters.token;
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
				this.getDropList(this.dropList);
			}
		},
	},
	data() {
		return {
			listQuery: {
				vinNo: "",
				terminalCode: "",
				vehicleTypeId: "",
			},
			vehicleTypeList: [],
			// 下拉
			dropList: [{ postData: { dicCode: 1002 }, key: "vehicleTypeList" }],
			listLoading: false,
			accept: "json",
			fileName: "",
			loading: false,
			fileList: [],
			uploadloading: null,
			uid: "",
			currentTime: [],
			selectList: [],
			tableList: [
				{ value: "VIN码", prop: "vinNo", checked: true, width: 200 },
				{
					value: "终端编号",
					prop: "terminalCode",
					checked: true,
					width: 120,
				},
				{
					value: "车辆类型",
					prop: "vehicleType",
					checked: true,
					width: 120,
				},
			],
			carTypeList: [],
		};
	},
	mounted() {},
	methods: {
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			getConfigCarList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data || [];
						this.total = data.total || 0;
						this.$nextTick(() => {
							for (let i = 0; i < this.list.length; i++) {
								this.selectList.forEach((r) => {
									if (this.list[i].carId === r.carId) {
										this.$refs.catListTable
											.refTable()
											.toggleRowSelection(this.list[i], true);
									}
								});
							}
						});
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
		readJSON(files) {
			return new Promise((resove, reject) => {
				if (files.length <= 0) {
					// 如果没有文件名
					reject(false);
					return false;
				} else if (!/\.(json)$/.test(files[0].name.toLowerCase())) {
					this.$message.warning({
						message: "上传格式不正确，请上传JSON格式",
						duration: 2 * 1000,
					});
					this.$refs.upload.clearFiles();
					this.fileList = [];
					reject(false);
					return false;
				}
				resove(true);
			});
		},
		// 重置数据
		restStatus() {
			this.fileList = [];
			this.fileName = "";
			this.uploadloading.close();
		},
		// 上传之前得验证
		beforeupload(file) {
			this.uid = file.uid;
		},
		// 文件状态改变时触发
		fileChange(file, fileList) {
			// 获取最新的文件
			this.fileList = fileList.slice(-1);
			this.readJSON({ 0: file.raw })
				.then(() => {
					this.fileName = file.name;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 导入上传成功钩子
		fileSuccess(response) {
			if (response.code === 0 && response.data) {
				this.$notify({
					title: "成功",
					message: "文件上传成功",
					type: "success",
					duration: 3000,
				});
			} else {
				this.$message.warning({
					message: response.message,
					duration: 2 * 1000,
				});
			}
			this.restStatus();
		},
		// 导入上传失败钩子
		fileError(response, file, fileList) {
			this.restStatus();
		},
		// 清空数据
		restData() {
			this.listQuery = {
				vinNo: "",
				terminalCode: "",
				carTypeName: "",
				carBatchCode: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.fileName = "";
			this.fileList = [];
			this.collapse = false;
			this.list = [];
			this.selectList = [];
			this.total = 0;
		},
		// 关闭dialog
		closeDrawer() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		// 提交
		submitForm() {
			if (this.fileList.length === 0) {
				this.$message.warning({
					message: "请选择上传文件",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.uid === this.fileList[0].uid) {
				this.$message.warning({
					message: "该文件已上传请重新选择上传文件",
					duration: 2 * 1000,
				});
				return false;
			}
			if (this.selectList.length <= 0) {
				this.$message.warning({
					message: "请选择车辆",
					duration: 2 * 1000,
				});
				return;
			}
			let formData = new FormData();
			formData.append("file", this.fileList[0].raw);
			formData.append(
				"vinNoList",
				this.selectList.map((item) => item.vinNoTotal)
			);
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-import-sim"),
				text: "文件上传中...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
			this.loading = true;
			uploadConfigFile(formData)
				.then(({ data }) => {
					if (data.code == 0) {
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
					this.restStatus();
				})
				.catch(() => {
					this.loading = false;
					this.restStatus();
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.otherDrawerBox {
	padding: 10px;
	border-radius: 4px;
	background: #f7f8fa;
	margin-bottom: 20px;
}
.carListDiv {
	padding: 10px;
	border-radius: 4px;
	background: #f7f8fa;
}
.fileuploadDiv {
	background: #ffffff;
	padding: 12px 0 12px 20px;
	border-radius: 4px;
	margin-bottom: 4px;
	p {
		font-weight: bold;
		color: #272727;
	}
}
</style>
