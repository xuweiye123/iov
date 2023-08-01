<template>
	<app-drawer
		:visibles="visibles"
		:width="'800px'"
		:title="'添加车辆'"
		@close-drawer="closeDiacar"
		:loading="loading"
		:isDrawerFoot="isDrawerFoot"
		top="5vh"
	>
		<div style="padding: 10px" slot="drawerContent">
			<el-tabs v-model="activeName">
				<el-tab-pane label="选中车辆" name="first">
					<el-row :gutter="10" class="selct-car">
						<el-col :span="13">
							<el-row :gutter="6">
								<el-col :span="16">
									<el-form ref="formSelectCar" :rules="rules" :model="formInfo">
										<el-form-item
											label-position="'right'"
											prop="selectCarListText"
											label-width="80px"
											label="选择车辆："
										>
											<el-input
												v-model="formInfo.selectCarListText"
												placeholder="请点击选择"
												readonly
												class="pointerInput"
												@focus="showCarList"
											/>
										</el-form-item>
									</el-form>
								</el-col>
								<el-col :span="4">
									<el-button
										type="primary"
										@click="
											addCarPromptVisible = true;
											leadingInPath = '';
											fileList = [];
										"
										>导入</el-button
									>
								</el-col>
								<el-col :span="4">
									<el-button type="default" @click="handleClear1"
										>重置</el-button
									>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="11">
							<el-form>
								<el-form-item
									label-position="'right'"
									label-width="80px"
									label="车辆信息："
								>
									<span class="black80">{{ carInfo }}</span>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="13">
							<el-form>
								<el-form-item
									label-position="'right'"
									label-width="80px"
									label="成功车辆："
								>
									<span
										:style="{ color: successCar > 0 ? 'blue' : '#606266' }"
										:class="[successCar > 0 ? 'success-car' : '', 'cheack-car']"
										>{{ successCar }}</span
									>
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="11">
							<el-form>
								<el-form-item
									label-position="'right'"
									label-width="80px"
									label="失败车辆："
								>
									<span
										:style="{ color: failCar > 0 ? 'red' : '#606266' }"
										:class="[failCar > 0 ? 'fail-car' : '', 'cheack-car']"
										@click="downLoadFailCar"
										>{{ failCar }}</span
									>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form :label-position="'right'" label-width="80px">
								<el-form-item label="备注：" prop="remark">
									<el-input
										v-model="formInfo.remark"
										:maxlength="200"
										:rows="3"
										:autosize="{ minRows: 3, maxRows: 3 }"
										resize="none"
										placeholder="请输入备注"
										type="textarea"
										:show-word-limit="true"
									/>
								</el-form-item>
								<el-form-item class="label-color-red" label="注：">
									<span style="color: red"
										>若重新维护过车辆信息，请重新校验</span
									>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
					<span class="dialog-footer">
						<el-button v-waves @click="closeDiacar">取消</el-button>
						<el-button
							v-waves
							:loading="loading1"
							:disabled="loading2"
							type="primary"
							@click="checkCar"
							>校验</el-button
						>
						<el-button
							v-waves
							:loading="loading2"
							:disabled="loading1"
							type="primary"
							@click="submitCar"
							>确定</el-button
						>
					</span>
				</el-tab-pane>
				<el-tab-pane label="批量导入" name="second">
					<el-row :gutter="20" type="flex" justify="center">
						<el-col :span="16">
							<el-form>
								<el-form-item
									label-position="'right'"
									label-width="50px"
									label="文件："
								>
									<el-input v-model="leadingInPath" disabled />
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="6">
							<el-upload
								ref="upload1"
								:auto-upload="false"
								:headers="{ Authorization: token }"
								:show-file-list="false"
								:file-list="fileList"
								:multiple="true"
								:data="{ taskType: '2', linkId: linkId, linkName: linkName }"
								:before-upload="beforeupload"
								:on-change="fileChange"
								:on-success="fileSuccess"
								:on-error="fileError"
								:accept="'.xls,.xlsx'"
								action="/api/transmit/uploadTask/importUploadTask"
								class="el-upload-block"
							>
								<el-button type="primary"> 浏览 </el-button>
							</el-upload>
						</el-col>
					</el-row>
					<div style="display: flex;justify-content: center;margin-bottom: 15px;">
						<div class="import-remark">
							<span class="textColor">注：</span>
							<div style="display: flex;justify-content: flex-start;flex-direction: column;">
								<div style="margin-bottom:10px;"> 1.仅支持 .xls,.xlsx 格式的文件，一次只能选择一个；</div>
								<div> 2.若已上传过的文件需重新选择方可上传，最多导入<span class="textColor"> 100000 </span>行。</div>
							</div>
						</div>
					</div>
					<span class="dialog-footer">
						<el-button v-waves>
							<a
								class="templateUrl"
								:href="'/api/transmit/fileStatics/VINQueryTemplate.xlsx'"
							>
								<i
									class="iconfont icon-downLoad"
									style="font-size: 12px !important;margin-right:5px;"
								></i>
								下载模板</a
							>
						</el-button>
						<el-button v-waves type="primary" @click="importCar('2')">确定</el-button>
					</span>
				</el-tab-pane>
			</el-tabs>
			<!-- 子dialog 导入 -->
			<el-dialog
				custom-class="dialogBox"
				v-if="addCarPromptVisible"
				v-el-drag-dialog
				:visible.sync="addCarPromptVisible"
				:close-on-click-modal="false"
				:lock-scroll="false"
				:show-close="false"
				:append-to-body="true"
				center
				width="35%"
				top="30vh"
				class="ordinary"
			>
				<div slot="title" class="dialogHeader">
					<span class="custom-dialog-header-title">
						<span class="title-style"></span>
						<span style="margin-left: 3px;font-size: 16px;">导入</span>
					</span>
					<span @click="closeDialog1" class="custom-dialog-header-close">
						<i class="iconfont icon-close"></i>
					</span>
				</div>
				<el-row :gutter="10" type="flex" justify="center">
					<el-col :span="16">
						<el-form>
							<el-form-item
								label-position="'right'"
								label-width="40px"
								label="文件："
							>
								<el-input v-model="leadingInPath" disabled />
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
							:on-success="fileSuccess"
							:on-error="fileError"
							:action="'/api/transmit/forwardLink/importCar'"
							class="el-upload-block"
							:accept="'.xls,.xlsx'"
						>
							<el-button type="primary">浏览</el-button>
						</el-upload>
					</el-col>
				</el-row>
				<div style="display: flex;justify-content: center;">
					<div class="import-remark">
						<span class="textColor">注：</span>
						<div style="display: flex;justify-content: flex-start;flex-direction: column;">
							<div style="margin-bottom:10px;"> 1.仅支持 .xls,.xlsx 格式的文件，一次只能选择一个；</div>
							<div> 2.若已上传过的文件需重新选择方可上传，最多导入<span class="textColor"> 100000 </span>行。</div>
						</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button v-waves>
						<a
							class="templateUrl"
							:href="'/api/transmit/fileStatics/VINQueryTemplate.xlsx'"
						>
							<i
								class="iconfont icon-downLoad"
								style="font-size: 12px !important;margin-right:5px;"
							></i>
							下载模板</a
						>
					</el-button>
					<el-button v-waves type="primary" @click="importCar('1')">确定</el-button>
				</span>
			</el-dialog>
			<!-- 子dialog 选择车辆弹框 -->
			<el-dialog
				custom-class="dialogBox"
				v-el-drag-dialog
				v-if="carListVisible"
				:visible.sync="carListVisible"
				:before-close="closeCarList"
				:show-close="false"
				width="70%"
				top="10vh"
				append-to-body
				center
				class="ordinary"
			>
				<div slot="title" class="dialogHeader">
					<span class="custom-dialog-header-title">
						<span class="title-style"></span>
						<span style="margin-left: 3px">选择车辆</span>
					</span>
					<span @click="closeCarList" class="custom-dialog-header-close">
						<i class="iconfont icon-close"></i>
					</span>
				</div>
				<app-search>
					<div slot="content">
						<el-form :model="listQuery" label-width="70px" style="width: 100%">
							<el-row :gutter="10">
								<el-col :span="6">
									<el-form-item label="VIN码：" label-width="55px">
										<el-input
											v-model="listQuery.vinNo"
											placeholder="请输入VIN码"
											clearable
										/>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="车牌号：" label-width="60px">
										<el-input
											v-model="listQuery.licensePlate"
											placeholder="请输入车牌号"
											clearable
										/>
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="终端编号：">
										<el-input
											v-model="listQuery.terminalCode"
											placeholder="请输入终端编号"
											clearable
										/>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<app-search-button
						slot="bottom"
						:is-collapse="false"
						:isdisabled="listLoading"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</app-search>
				<el-table
					ref="carTable"
					size="mini"
					v-loading="listLoading"
					:data="list"
					:max-height="tableHeight - 60"
					:header-row-style="headerRowStyle"
					:row-style="rowStyle"
					:header-cell-style="headerCellStyle"
					border
					fit
					highlight-current-row
					style="width: 100%"
					row-key="vinNo"
					@selection-change="handleSelectionChange"
					@select="rowSelect"
					@row-click="clickRow"
					@select-all="slelctAll"
				>
					<el-table-column
						type="selection"
						:reserve-selection="true"
						fixed
						width="55"
					/>
					<el-table-column
						:label="$t('table.id')"
						align="center"
						width="65"
						fixed
					>
						<template slot-scope="scope">
							<span>{{
								scope.$index + 1 + (listQuery.pageNum - 1) * listQuery.pageSize
							}}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-for="(item, index) in filterTableList"
						:key="index"
						:label="item.value"
						:prop="item.prop"
						:align="item.position"
						:fixed="item.fixed"
						:min-width="item.width"
						show-overflow-tooltip
					>
						<template slot-scope="scope">
							<span>
								{{
									scope.row[item.prop] ||
										(scope.row[item.prop] == "0" ? scope.row[item.prop] : "-")
								}}
							</span>
							<!-- </div> -->
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<div
					style="padding: 10px 0"
					:class="[total > 0 ? 'visible' : 'hidden', 'pagination-container']"
				>
					<el-pagination
						:current-page="listQuery.pageNum"
						:page-sizes="[10, 50, 100, 500]"
						:page-size="listQuery.pageSize"
						:total="total"
						background
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					/>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="carListCancel">取消</el-button>
					<el-button type="primary" @click="saveCar">保存</el-button>
				</span>
			</el-dialog>
		</div>
	</app-drawer>
</template>

<script>
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import readExcel from "@/utils/readExcel";
import elDragDialog from "@/directive/el-dragDialog";
import waves from "@/directive/waves";
import {
	getCar,
	checkCar,
	exportCheckCar,
	createForwardTask,
} from "@/api/transmitSys/forwardLink";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
export default {
	name: "AddCar",
	doNotInit: true,
	directives: {
		waves,
		elDragDialog,
	},
	mixins: [partialForm, pagingMixin, otherHeight, tableStyle, checkFormRule],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		targetId: {
			type: String,
			default: "",
		},
		linkId: {
			type: String,
			default: "",
		},
		linkName: {
			type: String,
			default: "",
		},
		carCount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			isDrawerFoot: false,
			// baseUrl: process.env.VUE_APP_BASEURL + "/forwardLink/importCar",
			addCarPromptVisible: false,
			carListVisible: false,
			listLoading: false,
			loading: false,
			loading1: false,
			loading2: false,
			uploadloading: null,
			list: [],
			tableHeight: 0,
			total: 0,
			leadingInPath: "",
			listQuery: {
				terminalCode: "",
				licensePlate: "",
				vinNo: "",
				targetId: "",
				pageNum: 1,
				pageSize: 10,
			},
			fileList: [],
			successList: [],
			failedList: [],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					position: "center",
					checked: true,
					fixed: "left",
				},
				{
					value: "车牌号",
					prop: "licensePlate",
					position: "center",
					width: 120,
					checked: true,
				},
				{
					value: "终端编号",
					prop: "terminalCode",
					position: "center",
					checked: true,
					width: 120,
				},
				{
					value: "ICCID",
					prop: "iccid",
					position: "center",
					checked: true,
					width: 170,
				},
				{
					value: "动力电池编码",
					prop: "powerBatteryCode",
					position: "center",
					checked: true,
					width: 200,
				},
			],
			selectChangeCarList: [],
			allCarList: [],
			deleteCarList: [],
			formInfo: {
				selectCarListText: "",
				remark: "",
			},
			activeName: "first",
			signFile: "",
			rules: {
				selectCarListText: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择车辆",
						formObjName: "formInfo",
					},
				],
			},
		};
	},
	computed: {
		token() {
			return this.$store.getters.token;
		},
		carInfo() {
			return this.allCarList.length || "当前未选择车辆";
		},
		successCar() {
			return this.successList.length;
		},
		failCar() {
			return this.failedList.length;
		},
		filterTableList() {
			return this.tableList.filter((item) => item.checked);
		},
	},
	watch: {
		activeName: {
			handler(e1) {
				if (e1 === "first") {
					this.isDrawerFoot = false;
				} else {
					this.isDrawerFoot = false;
				}
			},
		},
	},
	mounted() {
		const self = this;
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight * 0.5;
		});
		window.onresize = function(e) {
			self.$nextTick(() => {
				self.tableHeight = window.innerHeight * 0.5;
			});
		};
	},
	methods: {
		closeDialog1() {
			this.addCarPromptVisible = false;
		},
		showCarList() {
			this.listQuery.pageNum = 1;
			this.carListVisible = true;
		},
		restaddCarInfo() {
			this.successList = [];
			this.failedList = [];
			this.selectChangeCarList = [];
			this.fileList = [];
			this.leadingInPath = "";
			this.formInfo = {
				selectCarListText: "",
				remark: "",
			};
			this.allCarList = [];

			this.$refs["formSelectCar"].resetFields();
			this.activeName = "first";
		},
		restQuery() {
			this.listQuery = {
				terminalCode: "",
				licensePlate: "",
				vinNo: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.list = [];
		},
		handleClear1() {
			this.successList = [];
			this.failedList = [];
			this.selectChangeCarList = [];
			this.allCarList = [];
			this.formInfo.selectCarListText = "";
		},
		beforeupload(file) {},
		// 文件状态改变时触发
		fileChange(file, fileList) {
			if (file.size / 1024 > 1500) {
				this.$message.warning({
					message: "上传文件大小不应超过1.5MB，请重新上传",
					duration: 2 * 1000,
				});
				return;
			}
			// 获取最新的文件
			this.fileList = fileList.slice(-1);
			readExcel({ 0: file.raw })
				.then((e) => {
					this.leadingInPath = file.name;
				})
				.catch(() => {});
		},
		// 导入车辆
		importCar(type) {
			if (this.fileList.length === 0) {
				this.$message.warning({
					message: "请选择上传文件",
					duration: 2 * 1000,
				});
				return;
			}
			if (type === "1") {
				this.$refs.upload.submit();
				this.addCarPromptVisible = false;
			} else if (type === "2") {
				this.$refs.upload1.submit();
				this.closeDiacar();
			}
		},
		// 导入车辆上传成功钩子
		fileSuccess(response, file, fileList) {
			if (response.code === 0 && response.data) {
				this.allCarList = Array.from(
					new Set(this.allCarList.concat(response.data))
				);
				this.formInfo.selectCarListText = this.allCarList.join(";");
				this.$notify({
					title: "成功",
					message: "文件导入成功",
					type: "success",
					duration: 3000,
				});
			} else {
				this.$message.warning({
					message: response.message,
					duration: 5000,
				});
			}
			this.uploadloading.close();
		},
		// 导入车辆上传失败钩子
		fileError(response, file, fileListt) {
			this.$message.error({
				message: response.message,
				duration: 5000,
			});
			this.uploadloading.close();
		},
		// 加载车辆列表
		listLoad() {
			if (!this.carListVisible) {
				return;
			}
			if (
				this.listQuery.terminalCode === "" &&
				this.listQuery.licensePlate === "" &&
				this.listQuery.vinNo === ""
			) {
				this.$message.warning({
					message: "请至少输入一个查询条件",
					duration: 2 * 1000,
				});
				return;
			}
			this.listLoading = true;
			this.deleteCarList = [];
			this.listQuery.targetId = this.targetId;
			getCar(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data || [];
						this.total = data.total || 0;
						document.querySelector(".el-table__body-wrapper").scrollTop = 0;
						this.$nextTick(() => {
							for (let i = 0; i < this.allCarList.length; i++) {
								this.list.forEach((r, j) => {
									if (this.allCarList[i] === r.vinNo) {
										setTimeout(() => {
											this.$refs.carTable.toggleRowSelection(r, true);
										}, 0);
									}
								});
							}
						});
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 选择车辆点击取消按钮
		carListCancel() {
			this.carListVisible = false;
			this.restQuery();
		},
		// 选择车辆点击保存按钮
		saveCar() {
			// 删除selectCarList
			for (let i = 0; i < this.deleteCarList.length; i++) {
				const index = this.allCarList.findIndex(
					(item) => item === this.deleteCarList[i]
				);
				if (index > -1) {
					this.allCarList.splice(index, 1);
				}
			}
			// 添加当前选择
			const arr = this.selectChangeCarList.map((item) => item.vinNo);
			this.allCarList = Array.from(new Set(this.allCarList.concat(arr)));
			this.formInfo.selectCarListText = this.allCarList.join(";");
			this.carListVisible = false;
			this.restQuery();
		},
		// 选择车辆table选择项发生变化
		handleSelectionChange(val) {
			this.selectChangeCarList = val;
		},
		// 点击table行
		clickRow(row) {
			this.$refs.carTable.toggleRowSelection(row);
			this.deleteSelect(row);
		},
		// 点击table checkBox
		rowSelect(selection, row) {
			this.deleteSelect(row);
		},
		slelctAll(selection) {
			if (selection.length === 0) {
				for (let i = 0; i < this.list.length; i++) {
					this.deleteSelect(this.list[i]);
				}
			}
		},
		// 删除选择的车辆
		deleteSelect(row) {
			const index = this.allCarList.findIndex((item) => item === row.vinNo);
			if (index > -1) {
				// 判断之前是否push过
				if (
					this.deleteCarList.findIndex(
						(item) => item === this.allCarList[index]
					) === -1
				) {
					this.deleteCarList.push(this.allCarList[index]);
				}
			}
		},
		// 关闭最外层model事件
		closeDiacar() {
			// done用于关闭 Dialog
			this.restaddCarInfo();
			this.$emit("update:visibles", false);
		},
		// 校验车辆
		checkCar() {
			const checkform1 = this.checkForm({
				formName: "formSelectCar",
				formList: ["selectCarListText"],
			});
			if (!checkform1) return;
			const data = {
				// linkId: this.linkId,
				targetId: this.targetId,
				vinNos: this.allCarList,
			};
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-addcar"),
				text: "校验中...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
			this.loading1 = true;
			checkCar(data)
				.then(({ data }) => {
					if (data.code === 0 && data.data) {
						//  this.$notify
						this.failedList = data.data.failedList;
						this.successList = data.data.successList;
					}
					this.uploadloading.close();
					this.loading1 = false;
				})
				.catch(() => {
					this.loading1 = false;
					this.uploadloading.close();
				});
		},
		// 导出失败车辆
		downLoadFailCar() {
			if (this.failCar === 0) return;
			exportCheckCar(this.failedList).then((res) => {});
		},
		// 点击最外层提交
		submitCar() {
			const checkform1 = this.checkForm({
				formName: "formSelectCar",
				formList: ["selectCarListText"],
			});
			if (!checkform1) {
				return;
			}
			if (this.successCar === 0) {
				this.$message.warning({
					message: "无成功车辆",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.successCar * 1 + this.carCount > 12000) {
				this.$message.warning({
					message: "上传成功车辆数不能超过12000",
					duration: 2 * 1000,
				});
				return;
			}
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-addcar"),
				text: "上传车辆中...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});

			const data = {
				linkId: this.linkId,
				linkName: this.linkName,
				carCount: this.carCount,
				carIds: this.successList,
				signFile: this.signFile,
				remark: this.remark,
			};
			this.loading2 = true;
			createForwardTask(data)
				.then(({ data }) => {
					if (data.code === 0) {
						this.uploadloading.close();
						this.$parent.listLoad();
						this.closeDiacar();
					}
					this.loading2 = false;
				})
				.catch(() => {
					this.loading2 = false;
					this.uploadloading.close();
				});
		},
		// 关闭子级model事件
		closeCarList() {
			this.listQuery = {
				terminalCode: "",
				licensePlate: "",
				vinNo: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.carListVisible = false;
			// done()
		},
		// 搜索
		handleFilter() {
			this.listQuery.pageNum = 1;
			this.listLoad();
		},
		// 处理分页大小改变
		handleSizeChange(value) {
			this.listQuery.pageNum = 1;
			this.listQuery.pageSize = value;
			this.listLoad();
		},
		// 处理页码改变
		handleCurrentChange(value) {
			this.listQuery.pageNum = value;
			this.listLoad();
		},
	},
};
</script>

<style lang="scss" scoped>
.import-remark {
  display: flex;
  justify-content: flex-start;
}
.cheack-car {
	cursor: pointer;
	position: relative;
}
.fail-car {
	position: relative;
	&::before {
		content: "";
		display: inline-block;
		height: 1px;
		width: 100%;
		background: red;
		position: absolute;
		bottom: 0.5px;
	}
}
// .search_list {
// 	.el-form-item {
// 		margin-bottom: 0;
// 	}
// }
</style>
