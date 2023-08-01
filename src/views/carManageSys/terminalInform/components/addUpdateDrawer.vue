<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增终端' : '编辑终端'"
		width="45%"
		@close-drawer="closeDrawer"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="100px"
			>
				<el-row :gutter="10" style="padding:10px 5px;">
					<el-col :span="24">
						<el-form-item
							label="终端编号："
							prop="terminalCode"
						>
							<el-input
								:disabled=" isEdit"
								v-model="formInfo.terminalCode"
								placeholder="请输入终端编号"
								clearable
								:maxlength="8"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="TBOXSN：" prop="barCode">
							<el-input
								:disabled="isEdit"
								v-model="formInfo.barCode"
								placeholder="请输入TBOXSN"
								clearable
								:maxlength="15"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="ICCID1：" prop="iccidOne">
							<el-input
								class="pointerInput"
								v-model="formInfo.iccidOne"
								placeholder="请点击选择"
								clearable
								readonly
								@focus="showSimList"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="ICCID2：" prop="iccidTwo">
							<el-input
								class="pointerInput"
								v-model="formInfo.iccidTwo"
								placeholder="请点击选择"
								clearable
								readonly
								@focus="showSimList(2)"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formInfo.remark"
								:maxlength="200"
								:rows="2"
								:autosize="{ minRows: 4, maxRows: 4 }"
								resize="none"
								placeholder="请输入备注"
								type="textarea"
								:show-word-limit="true"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- :dataSource="dataSource" -->
			<select-sim-dialog
			  :type="type"
				:visibles.sync="selectSimVisibles"
				@dblclick-select-sim="selectSim"
				@dblclick-select-sim2="selectSim2"
			/>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import {
	createTerminalCode,
	updateTerminalCode,
} from "@/api/carManageSys/terminalInform";
// 组件
import selectSimDialog from "@/components/carManageSys/selectSimDialog";

export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule],
	components: { selectSimDialog },
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
		const validateIccid = (rule, value, cb) => {
			console.log(value,"value")
			if (!value) {
				return cb(new Error("请选择ICCID1"));
			}
			if (this.formInfo.iccidOne==this.formInfo.iccidTwo) {
				return cb(new Error("ICCID1和ICCID2不能一样"));
			}
		};
		const validateIccid2 = (rule, value, cb) => {
			console.log(value,"value1")
			if (!value) {
				return cb(new Error("请选择ICCID2"));
			}
			if (this.formInfo.iccidTwo==this.formInfo.iccidOne) {
				return cb(new Error("ICCID2和ICCID1不能一样"));
			}
		};
		return {
			loading: false,
			type:0,
			formInfo: {
				terminalCode: "",
				barCode: "",
				iccidOne: "",
				iccidTwo: "",
				remark: "",
			},
			dataSource: 0,
			tableRow: {},
			selectSimVisibles: false,
			rules: {
				terminalCode: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入终端编号",
						ruleReg: 'terminalcode',
            errorTips:"请输入开头不为0的8位数字",
						formObjName: "formInfo",
					},
				],
				barCode: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入TBOXSN",
						errorTips:"请输入数字或字母",
            ruleReg: 'alphanumeric',
						formObjName: "formInfo",
					},
				],
				// ruleReg: 'barcode',
            errorTips:"请输入请输入以A027E00428为首的30位或29位字符",
				// iccid: [
				// 	{
				// 		required: true,
				// 		trigger: ["blur", "change"],
				// 		validator: this.validInput,
				// 		tips: "请选择ICCID",
				// 		formObjName: "formInfo",
				// 	},
				// ],
				iccidOne: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validateIccid,
					},
				],
				iccidTwo: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: validateIccid2,
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
					}
				}
			},
		},
	},
	created() {},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.formInfo = {
				terminalCode: "",
				barCode: "",
				iccidOne: "",
				iccidTwo: "",
				remark: "",
			};
			this.type=0;
			this.$emit("update:visibles", false);
		},
		// 选择sim卡
		showSimList(e) {
			if(e==2){
				this.type=2
			}else{
				this.type=0
			}
			this.selectSimVisibles = true;
		},
		// 选择sim卡完成
		selectSim(item) {
			this.$set(this.formInfo, "iccidOne", item.iccid);
			this.$set(this.formInfo, "simIdOne", item.simId);
			// console.log(this.formInfo.iccid ,123)
		},
		// 选择sim2卡完成
		selectSim2(item) {
			this.$set(this.formInfo, "iccidTwo", item.iccid);
			this.$set(this.formInfo, "simIdTwo", item.simId);
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			createTerminalCode(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateTerminalCode(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList:  ["terminalCode", "barCode", "iccidOne", "iccidTwo"],
			});
			if (!formcenter) {
				return;
			}
			const {
				terminalCode,
				barCode,
				simIdOne,
				simIdTwo,
				remark,
				terminalId,
			} = this.formInfo;
			const postData = { terminalCode, barCode, simIdOne,simIdTwo, remark };
			for (const k in postData) {
				if (postData[k] === undefined) {
					postData[k] = "";
				}
			}
			if (!this.isEdit) {
				this._Add(postData);
			} else {
				postData.terminalId = terminalId;
				this._Update(postData);
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
