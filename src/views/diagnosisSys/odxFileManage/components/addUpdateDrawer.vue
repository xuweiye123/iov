<template>
	<app-drawer
		:visibles="visibles"
		:title="'ODX文件上传'"
		width="800px"
		@close-drawer="closeDialog"
		@ok-drawer="handleConfirm"
		:isDrawerFoot="true"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<div class="otherDrawerBox">
				<div class="odx-search">
					<el-form
						:label-position="'right'"
						:model="formInfo"
						ref="formLeft"
						:rules="rules"
						label-width="85px"
					>
						<el-row type="flex" justify="start" align="middle" v-if="!isEdit">
							<el-col :span="8">
								<el-form-item label="文件上传：" prop="fileName">
									<el-input
										v-model="fileName"
										placeholder="请选择文件上传"
										clearable
										disabled
									/>
								</el-form-item>
							</el-col>
							<!-- :auto-upload="false" -->
							<el-col :span="8">
								<el-upload
									ref="upload"
									:headers="{ Authorization: token }"
									action="/api/diagnosis/odx/odxAnalysis"
									:show-file-list="false"
									class="upload-demo"
									:on-progress="handleProgess"
									:on-error="handleError"
									:on-change="handleChange"
									:on-success="handleSuccess"
									:accept="'.odx-d'"
								>
									<el-button slot="trigger" type="primary"
										>选择ODX文件</el-button
									>
									<!-- <el-button type="primary" @click="startAnalysis"
									>开始解析</el-button
								> -->
								</el-upload>
							</el-col>
							<el-col :span="8" prop="carTypeId">
							<el-form-item label="车型名称：" prop="carTypeId">
								<el-select
									v-model="formInfo.carTypeId"
									filterable
									clearable
									placeholder="请选择"
								>
									<el-option
										v-for="(item, index) in carTypeList"
										:key="index"
										:label="item.carTypeName"
										:value="item.carTypeId"
									/>
								</el-select>
							</el-form-item>
							</el-col>
						</el-row>
						<el-row
							v-if="isRowVisible"
							type="flex"
							justify="start"
							align="middle"
							style="margin-top: 18px;"
						>
							<el-col :span="8">
								<el-form-item label="ECU名称：" prop="ecu">
									<el-input
										v-model="formInfo.ecu"
										placeholder="请输入ECU名称"
										clearable
										maxlength="20"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="ODX版本：">
									<el-input
										v-model="formInfo.version"
										placeholder="请输入ODX版本"
										clearable
										maxlength="20"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8" v-show="isRowVisible">
								<el-form-item label="服务指令：">
									<el-input
										v-model="content"
										placeholder="请输入服务指令"
										@input="handleSearch"
										clearable
										maxlength="20"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row
							type="flex"
							justify="start"
							align="middle"
							v-if="isRowVisible"
							style="margin-top: 18px;"
						>
							<el-col :span="8">
								<el-form-item label="发送地址：" prop="sendAddress">
									<el-input
										v-model="formInfo.sendAddress"
										placeholder="请输入发送地址"
										clearable
										maxlength="4"
									/>
									<!-- <span>{{ formInfo.sendAddress | processData }}</span> -->
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="接受地址：" prop="receiveAddress">
									<el-input
										v-model="formInfo.receiveAddress"
										placeholder="请输入接受地址"
										clearable
										maxlength="4"
									/>
									<!-- <span>{{ formInfo.receiveAddress | processData }}</span> -->
								</el-form-item>
							</el-col>
						</el-row>
						<el-row
							v-if="isRowVisible"
							type="flex"
							justify="start"
							align="middle"
							style="margin-top: 18px;"
						>
							<el-col :span="6">
								<el-form-item label="CAN通道：">
									<span>{{ formInfo.can | processData }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="波特率：">
									<span>{{ formInfo.baudRate | processData }}</span>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="6">
								<el-form-item label="发送地址：">
									<span>{{ formInfo.sendAddress | processData }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="接受地址：">
									<span>{{ formInfo.receiveAddress | processData }}</span>
								</el-form-item>
							</el-col> -->
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- table -->
			<app-table
				class="tb-edit"
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
					<span class="editContent" v-if="scope.item.prop === 'alias'">
						<el-input
							size="small"
							class="inputBox"
							v-model="scope.row[scope.item.prop]"
							maxlength="20"
						></el-input
						><span>{{ scope.row[scope.item.prop] | processData }}</span>
					</span>
					<span
						class="editContent"
						v-else-if="scope.item.prop === 'description'"
					>
						<el-input
							size="small"
							class="inputBox"
							v-model="scope.row[scope.item.prop]"
							maxlength="50"
						></el-input
						><span>{{ scope.row[scope.item.prop] | processData }}</span>
					</span>
					<span v-else-if="scope.item.prop === 'securityAccess'">
						{{ scope.row[scope.item.prop] | convertSecurityAccess }}
					</span>
					<span v-else-if="scope.item.prop === 'sessions'">
						{{ scope.row[scope.item.prop] | convertSession }}
					</span>
					<span v-else>
						<span>{{ scope.row[scope.item.prop] | processData }}</span>
					</span>
				</template>
			</app-table>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { partialForm } from "@/mixins/partialForm";
// request
import {
	createOdxData,
	getOdxData,
	updateOdxData,
} from "@/api/diagnosisSys/odxFileManage";
import { getCarTypeList } from "@/api/diagnosisSys/commont";
import { fuzzySearch, debounce } from "@/utils/common";
import store from "@/store";
export default {
	doNotInit: true,
	name: "addUpdateDrawer",
	mixins: [pagingMixin, drawerOtherHeight, partialForm],
	computed: {
		token() {
			return store.getters.token;
		},
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		isEdit: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	filters: {
		convertSession(val) {
			//1代表默认，2代表编程，3代表扩展
			val = !val ? "1" : val;
			let valueStr = val
				.replace("1", "默认")
				.replace("2", "编程")
				.replace("3", "扩展");
			return valueStr;
		},
		convertSecurityAccess(val) {
			val = !val ? "0" : val;
			return val;
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					if (this.isEdit && this.data && this.data.id) {
						this._getOdxData(this.data.id);
						this.isDisabled = true;
						this.isRowVisible = true;
					} else {
						this._getAllList();
						this.isRowVisible = false;
					}
				}
			},
		},
	},
	data() {
		const validateOdxName = (rule, value, cb) => {
			if (!this.fileName) {
				return cb(new Error("请选择上传文件"));
			}
		};
		const validateEcu = (rule, value, cb) => {
			if (!this.formInfo.ecu) {
				return cb(new Error("请输入ECU名称"));
			}
		};
		const validatecarTypeId =(rule, value, cb) => {
			if (!this.formInfo.carTypeId) {
				return cb(new Error("请选择车型名称"));
			}
		};
		const validatereceiveAddress = (rule, value, cb) => {
			if (!this.formInfo.receiveAddress) {
				return cb(new Error("请输入接受地址"));
			}
		};
		const validatesendAddress = (rule, value, cb) => {
			if (!this.formInfo.sendAddress) {
				return cb(new Error("请输入发送地址"));
			}
		};
		return {
			loading: false,
			carTypeList: [],
			tableList: [
				{
					value: "服务名称",
					prop: "name",
					checked: true,
					width: 180,
				},
				{
					value: "服务别名",
					prop: "alias",
					checked: true,
					width: 120,
				},
				{
					value: "服务指令",
					prop: "content",
					checked: true,
					width: 80,
				},
				{
					value: "安全级别",
					prop: "securityAccess",
					checked: true,
					width: 80,
				},
				{
					value: "会话模式",
					prop: "sessions",
					checked: true,
					width: 80,
				},
				{
					value: "服务描述",
					prop: "description",
					checked: true,
					width: 120,
				},
			],
			content: "",
			cloneList: [],
			fileName: "",
			formInfo: {
				version: "",
				ecu: "",
				carTypeId: "",
				receiveAddress: "",
				sendAddress: "",
			},
			isDisabled: false,
			rules: {
				fileName: [
					{ required: true, trigger: "blur", validator: validateOdxName },
					{ trigger: "change", validator: validateOdxName },
				],
				ecu: [
					{ required: true, trigger: "blur", validator: validateEcu },
					{ trigger: "change", validator: validateEcu },
				],
				carTypeId: [
					{ required: true, trigger: "blur", validator: validatecarTypeId },
					{ trigger: "change", validator: validatecarTypeId },
				],
				receiveAddress: [
					{ required: true, trigger: "blur", validator: validatereceiveAddress },
					{ trigger: "change", validator: validatereceiveAddress },
				],
				sendAddress: [
					{ required: true, trigger: "blur", validator: validatesendAddress },
					{ trigger: "change", validator: validatesendAddress },
				],
			},
			isRowVisible: false,
		};
	},
	mounted() {
		this.getData = debounce(this.loadS, 300);
	},
	methods: {
		_getAllList() {
			getCarTypeList().then(({ data }) => {
				if (data.code === 0) {
					this.carTypeList = data.data;
				}
			});
		},
		handleSearch() {
			this.getData();
		},
		loadS() {
			this.list = fuzzySearch(this.cloneList, this.content, "content");
		},
		handleConfirm() {
			if (this.isEdit) {
				const formLeft = this.checkForm({
					formName: "formLeft",
					formList: ["ecu","receiveAddress","sendAddress"],
				});
				if (!formLeft) {
					return;
				}
				this._updateOdxData();
			} else {
				const formLeft = this.checkForm({
					formName: "formLeft",
					formList: ["fileName", "ecu", "carTypeId","receiveAddress","sendAddress"],
				});
				if (!formLeft) {
					return;
				}
				this._createOdxData();
			}
		},
		_createOdxData() {
			this.formInfo.serviceList = this.list;
			createOdxData(this.formInfo).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "添加成功",
					});
					this.$emit("add-complete");
					this.closeDialog();
				}
			});
		},
		_updateOdxData() {
			let param = {};
			param.id = this.data.id;
			param.version = this.formInfo.version;
			param.baudRate = this.formInfo.baudRate;
			param.ecu = this.formInfo.ecu;
			let serviceList = [];
			this.list.forEach((r) => {
				let item = {};
				if (r.alias || r.description) {
					item.id = r.id;
					item.alias = r.alias;
					item.description = r.description;
					serviceList.push(item);
				}
			});
			param.serviceList = serviceList;
			param.receiveAddress = this.formInfo.receiveAddress;
			param.sendAddress = this.formInfo.sendAddress;
			updateOdxData(param).then(({ data }) => {
				if (data.code === 0) {
					this.$emit("update-complete");
					this.closeDialog();
				}
			});
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {};
			this.fileName = "";
			this.content = "";
			this.list = [];
			this.$emit("update:visibles", false);
		},
		startAnalysis() {
			if (this.fileName === "") {
				this.$alert("请选择ODX文件", "提示", {
					confirmButton: "确定",
				});
				return;
			}
			this.$refs.upload.submit();
		},
		handleProgess(file) {
			this.loading = true;
			this.listLoading = true;
		},
		handleChange(file) {
			// .odx-d
			// if (file.name.indexOf(".odx") > -1 || file.name.indexOf(".pdx") > -1) {
			if (file.name.split(".").pop()=='odx-d') {
				this.fileName = file.name;
			} else {
				this.$alert("您选择的文件格式不正确！", "提示", {
					confirmButton: "确定",
				});
				this.$refs.upload.clearFiles();
			}
		},
		handleError() {
			this.loading = false;
			this.listLoading = false;
			this.$message.warning("系统繁忙，请稍后再试");
		},
		handleSuccess(response, file) {
			this.loading = false;
			this.listLoading = false;
			if (response.code === 0 && response.data) {
				this.isRowVisible = true;
				let dataList = response.data;
				this.formInfo = { ...dataList };
				this.formInfo.odxName = file.name;
				this.toTableData(dataList.serviceList);
			} else {
				this.$message.success({
					message: response.message,
				});
			}
		},
		toTableData(serviceList) {
			const serviceData = [];
			for (let key in serviceList) {
				let value = serviceList[key];
				value.forEach((r) => {
					r.serviceId = r.id;
					r.funcClass = key;
					let data = r;
					delete data.id;
					serviceData.push(r);
				});
			}
			this.list = serviceData;
		},
		_getOdxData(ecuId) {
			this.listLoading = true;
			getOdxData({ ecuId: ecuId }).then(({ data }) => {
				if (data.code === 0) {
					this.formInfo = data.data;
					this.list = data.data.serviceList;
					this.cloneList = data.data.serviceList;
					this.listLoading = false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.tb-edit {
	.el-input {
		display: none;
	}
	.current-row {
		.el-input {
			display: block;
		}
		.el-input + span {
			display: none;
		}
	}
}
</style>
