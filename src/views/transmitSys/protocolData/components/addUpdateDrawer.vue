<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增协议数据项' : '编辑协议数据项'"
		width="50%"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="105px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="协议名称：" prop="protocolId">
							<el-select
								v-model="formInfo.protocolId"
								filterable
								placeholder="请选择"
								clearable
								@change="_getProtocolParamList"
							>
								<el-option
									v-for="(item, index) in protocolList"
									:label="item.text"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据项类型：" prop="variableType">
							<el-select
								v-model="formInfo.variableType"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in variableList"
									:label="item.label"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="'数据项名称：'" prop="variableName">
							<el-input
								v-model="formInfo.variableName"
								placeholder="请输入数据项名称"
								maxlength="20"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="'数据项别名：'" prop="variableAlias">
							<el-input
								v-model="formInfo.variableAlias"
								placeholder="请输入数据项别名"
								maxlength="20"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="'顺序：'" prop="orderNo">
							<el-input
								v-model="formInfo.orderNo"
								maxlength="9"
								placeholder="请输入顺序"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="父级节点：" prop="variableParentId">
							<el-select
								v-model="formInfo.variableParentId"
								filterable
								placeholder="请选择"
								clearable
							>
								<el-option
									v-for="(item, index) in protocolParamList"
									:label="item.text"
									:value="item.value"
									:key="index"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否子节点：'"
							prop="isChild"
						>
							<el-radio-group v-model="formInfo.isChild">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否存储：'"
							prop="isStorage"
						>
							<el-radio-group v-model="formInfo.isStorage">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否单选：'"
							prop="isSingle"
						>
							<el-radio-group v-model="formInfo.isSingle">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							:required="true"
							:label="'是否可匹配公式：'"
							prop="isFormula"
						>
							<el-radio-group v-model="formInfo.isFormula">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="'匹配方式：'" prop="searchType">
							<el-select
								v-model="formInfo.searchType"
								:clearable="true"
								placeholder="请选择"
								filterable
							>
								<el-option
									v-for="(item, index) in searchTypeList"
									:key="index"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="formInfo.variableType === '1'">
						<el-form-item :label="'匹配渠道：'" prop="searchChannel">
							<el-select
								v-model="formInfo.searchChannel"
								:clearable="true"
								placeholder="请选择"
								filterable
							>
								<el-option
									v-for="(item, index) in searchChannelList"
									:key="index"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="匹配条件：" prop="searchCondition">
							<el-input
								v-model="formInfo.searchCondition"
								placeholder="请输入匹配条件"
								maxlength="20"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formInfo.remark"
								:maxlength="50"
								:rows="3"
								:autosize="{ minRows: 3, maxRows: 3 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								:show-word-limit="true"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { getProtocolListMixin } from "@/mixins/dropList";
// request
import {
	addProtocolParam,
	updateProtocolParam,
} from "@/api/transmitSys/protocolData";
import { getProtocolParamList } from "@/api/transmitSys/commont";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule, getProtocolListMixin],
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
	data() {
		return {
			loading: false,
			formInfo: {
				protocolId: "", // 协议id
				variableName: "", // 数据项名称
				variableType: "", // 数据项类型
				variableParentId: "", // 父级ID
				isStorage: 0, // 是否存储
				isSingle: 0, // 是否单选
				isFormula: 0, // 是否可配公式
				isChild: 0, // 是否子节点
				variableAlias: "", // 别名
				searchChannel: "", // 匹配渠道
				searchType: "", // 匹配方式
				searchCondition: "", // 匹配条件
				orderNo: "", // 顺序
				remark: "", // 备注
			},
			protocolList: [],
			variableList: [
				{
					label: "动态数据项",
					value: "0",
				},
				{
					label: "故障数据项",
					value: "1",
				},
				{
					label: "其他",
					value: "2",
				},
			],
			searchTypeList: [
				{
					label: "模糊查询",
					value: "0",
				},
				{
					label: "精确查询",
					value: "1",
				},
			],
			searchChannelList: [
				{
					label: "DBC参数列表",
					value: "0",
				},
				{
					label: "故障码列表",
					value: "1",
				},
			],
			protocolParamList: [],
			tableRow: {},
			rules: {
				protocolId: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择协议名称",
						formObjName: "formInfo",
					},
				],
				variableType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择数据项类型",
						formObjName: "formInfo",
					},
				],
				variableName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入数据项名称",
						formObjName: "formInfo",
					},
				],
				variableAlias: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入数据项别名",
						formObjName: "formInfo",
					},
				],
				orderNo: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						ruleReg: "number",
						errorTips: "只能输入数字",
						tips: "请输入顺序",
						formObjName: "formInfo",
					},
				],
				searchType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择匹配方式",
						formObjName: "formInfo",
					},
				],
				searchChannel: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择匹配渠道",
						formObjName: "formInfo",
					},
				],
			},
		};
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					if (this.isEdit) {
						this.formInfo = { ...this.data };
						this.oldVariableName = this.formInfo.variableName;
						this.formInfo.variableType = this.formInfo.variableType + "";
						this.formInfo.searchChannel = this.formInfo.searchChannel + "";
						this.formInfo.searchType = this.formInfo.searchType + "";
						if (this.formInfo.protocolId) {
							// 协议名称列表如果没有协议id则显示为空
							if (
								this.protocolList.some((item) => {
									return item.value == this.formInfo.protocolId;
								})
							) {
								this.formInfo.protocolId = this.formInfo.protocolId;
							} else {
								this.formInfo.protocolId = "";
							}
							const params = {
								protocolId: this.formInfo.protocolId,
								selectType: 0,
								isFormula: "",
							};
							getProtocolParamList(params).then(({ data }) => {
								if (data.code === 0) {
									this.protocolParamList = data.data;
									// 父级节点列表如果没有父级节点id则显示为空
									if (
										this.protocolParamList.some((item) => {
											return item.value == this.formInfo.variableParentId;
										})
									) {
										this.formInfo.variableParentId = this.formInfo.variableParentId;
									} else {
										this.formInfo.variableParentId = '';
									}
								}
							});
						} else {
							this.formInfo.variableParentId = '';
							this.protocolParamList = [];
						}
					}
				}
			},
		},
	},
	methods: {
		// 获取父节点
		_getProtocolParamList(val) {
			this.formInfo.variableParentId = "";
			if (val) {
				const params = {
					protocolId: val,
					selectType: 0,
					isFormula: "",
				};
				getProtocolParamList(params).then(({ data }) => {
					if (data.code === 0) {
						this.protocolParamList = data.data;
					}
				});
			} else {
				this.protocolParamList = [];
			}
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo = {
				protocolId: "", // 协议id
				variableName: "", // 数据项名称
				variableType: "", // 数据项类型
				variableParentId: "", // 父级ID
				isStorage: 0, // 是否存储
				isSingle: 0, // 是否单选
				isFormula: 0, // 是否可配公式
				isChild: 0, // 是否子节点
				variableAlias: "", // 别名
				searchChannel: "", // 匹配渠道
				searchType: "", // 匹配方式
				searchCondition: "", // 匹配条件
				orderNo: "", // 顺序
				remark: "", // 备注
			};
			this.$emit("update:visibles", false);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			addProtocolParam(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDialog();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateProtocolParam(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDialog();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			if (this.formInfovariableType == "1") {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"protocolId",
						"variableType",
						"variableName",
						"variableAlias",
						"orderNo",
						"searchType",
						"searchChannel",
					],
				});

				if (!formcenter) {
					return;
				}
			} else {
				const formcenter = this.checkForm({
					formName: "formCenter",
					formList: [
						"protocolId",
						"variableType",
						"variableName",
						"variableAlias",
						"orderNo",
						"searchType",
					],
				});
				if (!formcenter) {
					return;
				}
			}
			if (!this.isEdit) {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					variableName: this.formInfo.variableName || "",
					variableType: this.formInfo.variableType
						? this.formInfo.variableType * 1
						: null,
					variableParentId: this.formInfo.variableParentId || "0",
					isStorage: this.formInfo.isStorage,
					isSingle: this.formInfo.isSingle,
					isFormula: this.formInfo.isFormula,
					isChild: this.formInfo.isChild,
					variableAlias: this.formInfo.variableAlias || "",
					searchChannel: this.formInfo.searchChannel
						? this.formInfo.searchChannel * 1
						: null,
					searchType: this.formInfo.searchType
						? this.formInfo.searchType * 1
						: null,
					searchCondition: this.formInfo.searchCondition || "",
					orderNo: this.formInfo.orderNo ? this.formInfo.orderNo : null,
					remark: this.formInfo.remark || "",
				};
				this._Add(param);
			} else {
				const param = {
					protocolId: this.formInfo.protocolId || "",
					variableName: this.formInfo.variableName || "",
					variableType: this.formInfo.variableType
						? this.formInfo.variableType * 1
						: null,
					variableParentId: this.formInfo.variableParentId || "0",
					isStorage: this.formInfo.isStorage,
					isSingle: this.formInfo.isSingle,
					isFormula: this.formInfo.isFormula,
					isChild: this.formInfo.isChild,
					variableAlias: this.formInfo.variableAlias || "",
					searchChannel: this.formInfo.searchChannel
						? this.formInfo.searchChannel * 1
						: null,
					searchType: this.formInfo.searchType
						? this.formInfo.searchType * 1
						: null,
					searchCondition: this.formInfo.searchCondition || "",
					orderNo: this.formInfo.orderNo ? this.formInfo.orderNo : null,
					remark: this.formInfo.remark || "",
					variableId: this.formInfo.variableId || "",
					oldVariableName: this.oldVariableName || "",
				};
				this._Update(param);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
