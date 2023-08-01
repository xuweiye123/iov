<template>
	<div>
		<app-drawer
			:visibles="visibles"
			:title="!isEdit ? '新增诊断周期配置' : '编辑诊断周期配置'"
			width="600px"
			@close-drawer="closeDialog"
			@ok-drawer="submitForm"
			:isDrawerFoot="true"
			:isOkButLoading="loading"
		>
			<div slot="drawerContent">
				<el-form
					ref="form"
					:rules="rules"
					:model="formInfo"
					:label-position="'right'"
					label-width="106px"
				>
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
					<el-form-item label="诊断周期名称：" prop="configName">
						<el-input
							v-model="formInfo.configName"
							placeholder="请输入诊断周期名称"
							clearable
							maxlength="20"
						/>
					</el-form-item>
					<el-form-item label="选择诊断服务：" prop="serviceNameList">
						<el-row>
							<el-col :span="18"
								><el-input
									v-model="formInfo.serviceNameList"
									placeholder="点击选择诊断服务"
									@click.native="selectDigService"
									readonly
							/></el-col>
							<el-col :span="6"> &nbsp;&nbsp;{{ serviceMessage }} </el-col>
						</el-row>
					</el-form-item>
					<el-row>
						<el-col :span="12">
							<el-form-item label="诊断周期：" prop="period">
								<el-input-number
									v-model="formInfo.period"
									:min="1"
									:max="999999999"
								></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="诊断次数：" prop="dxNum">
								<el-input-number
									v-model="formInfo.dxNum"
									:min="1"
									:max="999999999"
								></el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="备注：" prop="remark">
						<el-input
							v-model="formInfo.remark"
							type="textarea"
							placeholder="请输入备注"
							maxlength="50"
							rows="4"
							show-word-limit
							resize="none"
						/>
					</el-form-item>
				</el-form>
			</div>
		</app-drawer>
		<app-dig-service
			:visibles.sync="selectDigServiceVisible"
			@setDigService="setDigService"
			:propServiceList="serviceIdList"
		/>
	</div>
</template>

<script>
// request
import {
	createConfig,
	updateConfig,
	getConfigServiceList,
} from "@/api/diagnosisSys/offlineConfig";
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import { getSupportCarTypeList } from "@/api/diagnosisSys/commont";
import AppDigService from "@/components/diagnosisSys/selectMultiDigService";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule],
	components: {
		AppDigService,
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
			default: () => [],
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this._getSupportCarTypeList();
					let configName = {};
					if (!this.isEdit) {
						let date = new Date();
						configName = {
							configName:
								"pkg_" +
								this.$store.state.user.loginName +
								date.format("yyyyMMddhhmmss"),
						};
						this.formInfo = { ...this.data, ...configName };
					} else {
						this.formInfo = { ...this.data };
						this.setServiceName(this.data.id);
					}
				}
			},
			immediate: true,
		},
	},
	data() {
		const validatePeriod = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入诊断周期"));
			}
			if (value < 1 || value > 999999999) {
				return cb(new Error("只能输入1-999999999"));
			}
		};
		const validateDxNum = (rule, value, cb) => {
			if (!value) {
				return cb(new Error("请输入诊断次数"));
			}
			if (value < 1 || value > 999999999) {
				return cb(new Error("只能输入1-999999999"));
			}
		};
		return {
			formInfo: { carTypeId: "", serviceList: "" },
			carTypeList: [],
			selectDigServiceVisible: false,
			loading: false,
			serviceIdList: [],
			serviceMessage: "",
			rules: {
				carTypeId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择车型名称",
						formObjName: "formInfo",
					},
				],
				configName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入诊断周期名称",
						formObjName: "formInfo",
					},
				],
				serviceNameList: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择诊断服务",
						formObjName: "formInfo",
					},
				],
				period: [
					{ required: true, trigger: "blur", validator: validatePeriod },
					{ trigger: "change", validator: validatePeriod },
				],
				dxNum: [
					{ required: true, trigger: "blur", validator: validateDxNum },
					{ trigger: "change", validator: validateDxNum },
				],
			},
		};
	},
	methods: {
		//编辑页面给诊断服务名称赋值
		setServiceName(configId) {
			const param = {
				configId: configId,
				pageNum: 1,
				pageSize: 1000,
			};
			getConfigServiceList(param).then(({ data }) => {
				this.formInfo.serviceNameList = "";
				if (data.code === 0) {
					this.setDigService(data.data);
				}
			});
		},
		_getSupportCarTypeList() {
			getSupportCarTypeList().then(({ data }) => {
				if (data.code === 0) {
					this.carTypeList = data.data || [];
				}
			});
		},
		//设置诊断服务名称和id
		setDigService(value) {
			let serviceNames = [];
			let serviceIdList = [];
			value.forEach((r) => {
				serviceNames.push(r.serviceName);
				serviceIdList.push(r.id);
			});
			this.formInfo.serviceNameList = serviceNames.join(",");
			this.formInfo.serviceList = serviceIdList.join(",");
			this.serviceMessage = "已选择" + value.length + "个服务";
		},
		selectDigService() {
			this.selectDigServiceVisible = true;
			let serviceIds = this.formInfo.serviceList;
			let serveiceNames = this.formInfo.serviceNameList;
			if (!serviceIds || !serveiceNames) {
				this.serviceIdList = [];
			} else {
				let idList = serviceIds.split(",");
				let nameList = serveiceNames.split(",");
				let services = [];
				for (let i = 0; i < idList.length; i++) {
					services.push({
						id: idList[i],
						serviceName: nameList[i],
					});
				}
				this.serviceIdList = services;
			}
		},
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
			this.serviceIdList = [];
			this.serviceMessage = "";
		},
		// 新增
		_createConfig(postData) {
			this.loading = true;
			createConfig(postData)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDialog();
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_updateConfig(postData) {
			this.loading = true;
			updateConfig(postData)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDialog();
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const formcenter = this.checkForm({
				formName: "form",
				formList: ["carTypeId", "configName", "serviceList", "period", "dxNum"],
			});
			if (!formcenter) {
				return;
			}
			const {
				id,
				carTypeId,
				configName,
				period,
				dxNum,
				serviceList,
				remark,
			} = this.formInfo;
			const param = {
				id,
				carTypeId,
				configName,
				period,
				dxNum,
				serviceList,
				remark,
			};
			if (!this.isEdit) {
				this._createConfig(param);
			} else {
				this._updateConfig(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
