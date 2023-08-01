<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="!isEdit ? '新增规则' : '编辑规则'"
		width="55%"
		@close-drawer="closeDrawer"
		@ok-drawer="handleSubmit"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formLeft"
				:rules="rulesCenter"
				:model="formInfo"
				:label-position="'right'"
				label-width="120px"
			>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="电池类型：" prop="batteryCategory">
							<el-select
								v-if="!isEdit"
								v-model="formInfo.batteryCategory"
								filterable
								clearable
								placeholder="请选择"
							>
								<el-option
									v-for="(item, index) in batteryTypeList"
									:key="index"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
							<span v-else>{{ data.dicName | processData }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="计算符号：" prop="sign1">
							<el-select
								v-model="formInfo.sign1"
								filterable
								clearable
								placeholder="请选择"
								@change="expression"
							>
								<el-option
									v-for="(item, index) in fuhaoList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="报警值：" prop="num1">
							<el-input
								v-model.trim="formInfo.num1"
								@keyup.native="expression"
								@change="expression"
								clearable
								placeholder="请输入报警值"
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="逻辑符号：">
							<el-select
								v-model="formInfo.symbol"
								filterable
								clearable
								placeholder="请选择"
								@change="expression"
							>
								<el-option
									v-for="(item, index) in luojiList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="计算符号：">
							<el-select
								v-model="formInfo.sign2"
								filterable
								clearable
								placeholder="请选择"
								@change="expression"
							>
								<el-option
									v-for="(item, index) in fuhaoList"
									:key="index"
									:label="item.text"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="报警值：" prop="num2">
							<el-input
								v-model.trim="formInfo.num2"
								@keyup.native="expression"
								@change="expression"
								clearable
								placeholder="请输入报警值"
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item
							label="报警表达式："
							label-width="120px"
							prop="alarmLevelExpression"
						>
							<div style="color: #BCD5F1;">
								{{ expression1Data }} {{ expressionFuhao }}
								{{ expression2Data }}
							</div>
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
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import {
	createHandle,
	updateHandle,
} from "@/api/carMonitorSys/SOFruleManagement";

export default {
	name: "AddUpdateDialog",
	mixins: [partialForm,checkFormRule,getDropList],
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
	data() {
		const validatebatterytype = (rule, value, cb) => {
			if (value === "" || value === undefined) {
				return cb(new Error("请选择电池类型"));
			}
		};
		const validatefuhao = (rule, value, cb) => {
			if (value === "" || value === undefined) {
				return cb(new Error("请选择计算符号"));
			}
		};
		const validatealarmValue = (rule, value, cb) => {
			if (value === "" || value === undefined) {
				return cb(new Error("请输入报警值"));
			}
			// const regs = /^[0-9]{1,}[.]{0,}[0-9]{0,}$/;
			const regs = /^[0-9]*$/;
			if (!regs.test(this.formInfo.num1)) {
				return cb(new Error("请输入大于等于0的整数"));
			}
		};
		const validatealarmValue2 = (rule, value, cb) => {
			// const regs = /^[0-9]{1,}[.]{0,}[0-9]{0,}$/;
			const regs = /^[0-9]*$/;
			if (this.formInfo.num2 != "" && !regs.test(this.formInfo.num2)) {
				return cb(new Error("请输入大于等于0的整数"));
			}
		};
		const validatealarmLevelExpression = (rule, value, cb) => {
			if (
				!this.formInfo.symbol &&
				this.formInfo.sign1 &&
				this.formInfo.num1 &&
				this.formInfo.sign2 &&
				this.formInfo.num2
			) {
				return cb(new Error("请选择逻辑符号生成正规表达式"));
			}
		};
		return {
			formInfo: {},
			loading: false,
			batteryTypeList: [],
			dropList:[
        { postData:{dicCode:1006},key:'batteryTypeCodeList' },
      ],
			fuhaoList: [
				{ text: ">", value: ">" },
				{ text: ">=", value: ">=" },
				{ text: "<", value: "<" },
				{ text: "<=", value: "<=" },
			],
			luojiList: [
				{ text: "并且", value: "AND" },
				{ text: "或者", value: "OR" },
			],
			expression1Data: "",
			expression2Data: "",
			expressionFuhao: "",
			rulesCenter: {
				batteryCategory: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择电池类型",
            formObjName: "formInfo",
          },
        ],
				sign1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择计算符号",
            formObjName: "formInfo",
          },
        ],
				num1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入报警值",
						ruleReg: "number",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
				num2: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入报警值",
						ruleReg: "number",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
				alarmLevelExpression: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validatealarmLevelExpression,
					},
				],
			},
		};
	},
	watch: {
		visibles(e1) {
			if (e1) {
				// 数据字典下拉
		    this.getDropList(this.dropList)
				this.formInfo = { ...this.data };
				if (this.isEdit) {
					const contains = JSON.parse(this.data.contains);
					this.formInfo = {
						oid: this.formInfo.oid,
						batteryCategory: this.formInfo.batteryCategory,
						dicName: this.formInfo.dicName,
						sign1: contains.sign1,
						num1: contains.num1,
						sign2: contains.sign2,
						num2: contains.num2,
						symbol: contains.symbol,
					};
					if (contains.sign1 && contains.num1) {
						this.expression1Data =
							"var " + contains.sign1 + " " + contains.num1;
					}
					if (contains.sign2 && contains.num2) {
						this.expression2Data =
							"var " + contains.sign2 + " " + contains.num2;
					}
					this.expressionFuhao = contains.symbol ? contains.symbol : "";
				} else {
					this.expression1Data = "";
					this.expression2Data = "";
					this.expressionFuhao = "";
				}
			}
		},
	},
	created() {},
	methods: {
		// 关闭
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		expression() {
			this.expressionFuhao = "";
			this.expression1Data = "";
			this.expression2Data = "";
			if (this.formInfo.sign1 && this.formInfo.num1) {
				this.expression1Data =
					"var " + this.formInfo.sign1 + " " + this.formInfo.num1;
			}
			if (this.formInfo.sign2 && this.formInfo.num2) {
				this.expression2Data =
					"var " + this.formInfo.sign2 + " " + this.formInfo.num2;
			}
			if (
				this.formInfo.symbol &&
				this.formInfo.sign1 &&
				this.formInfo.num1 &&
				this.formInfo.sign2 &&
				this.formInfo.num2
			) {
				this.expressionFuhao = this.formInfo.symbol ? this.formInfo.symbol : "";
			}
			if (
				!this.formInfo.symbol &&
				this.formInfo.sign1 &&
				this.formInfo.num1 &&
				this.formInfo.sign2 &&
				this.formInfo.num2
			) {
				this.expressionFuhao = "";
				this.expression1Data = "";
				this.expression2Data = "";
			}
		},
		// 提交
		handleSubmit() {
			let formList = [];
			if (this.formInfo.num2) {
				formList = [
					"batteryCategory",
					"sign1",
					"num1",
					"num2",
					"alarmLevelExpression",
				];
			} else {
				formList = ["batteryCategory", "sign1", "num1", "alarmLevelExpression"];
			}
			const formCheckLeft = this.checkForm({
				formName: "formLeft",
				formList: formList,
			});
			if (!formCheckLeft) {
				return;
			}
			const contains = {
				sign1: "",
				num1: "",
				sign2: "",
				num2: "",
				symbol: "",
			};
			if (this.formInfo.sign1 && this.formInfo.num1) {
				contains.sign1 = this.formInfo.sign1;
				contains.num1 = this.formInfo.num1;
			}
			if (this.formInfo.sign2 && this.formInfo.num2) {
				contains.sign2 = this.formInfo.sign2;
				contains.num2 = this.formInfo.num2;
			}
			if (
				this.formInfo.symbol &&
				this.formInfo.sign1 &&
				this.formInfo.num1 &&
				this.formInfo.sign2 &&
				this.formInfo.num2
			) {
				contains.sign1 = this.formInfo.sign1;
				contains.num1 = this.formInfo.num1;
				contains.sign2 = this.formInfo.sign2;
				contains.num2 = this.formInfo.num2;
				contains.symbol = this.formInfo.symbol;
			}
			if (
				!this.formInfo.symbol &&
				this.formInfo.sign1 &&
				this.formInfo.num1 &&
				this.formInfo.sign2 &&
				this.formInfo.num2
			) {
				contains.sign1 = "";
				contains.num1 = "";
				contains.sign2 = "";
				contains.num2 = "";
				contains.symbol = "";
			}
			const postData = {
				dicName: this.formInfo.dicName,
				batteryCategory: this.formInfo.batteryCategory,
				contains: JSON.stringify(contains),
				description: "",
			};
			postData.alarmLevelExpression =
				this.expression1Data +
				" " +
				this.expressionFuhao +
				" " +
				this.expression2Data;
			if (!this.isEdit) {
				this._createContact(postData);
			} else {
				postData.ruleId = this.formInfo.oid;
				this._updateContact(postData);
			}
		},
		// 新增
		_createContact(postData) {
			this.loading = true;
			createHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "新增成功",
							duration: 2 * 1000,
						});
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		_updateContact(postData) {
			this.loading = true;
			updateHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: "编辑成功",
							duration: 2 * 1000,
						});
						this.$emit("update-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>