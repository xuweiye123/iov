<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增终端' : 'SIM卡更换'"
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
						<el-form-item label="TBOX供应商：" prop="terminalType">
							<el-radio-group
								v-model="formInfo.terminalType"
								:disabled="isEdit"
								@change="change"
							>
								<el-radio :label="1">
									INTEST
								</el-radio>
								<el-radio :label="2">
									北斗
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item
							label="终端编号："
							prop="terminalCode"
							:required="formInfo.terminalType == 1"
						>
							<el-input
								:disabled="formInfo.terminalType == 2 || isEdit"
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
								:maxlength="50"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="ICCID：" prop="iccid">
							<el-input
								class="pointerInput"
								v-model="formInfo.iccid"
								placeholder="请点击选择"
								clearable
								readonly
								@focus="showSimList"
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
				:visibles.sync="selectSimVisibles"
				@dblclick-select-sim="selectSim"
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

import reg from "@/utils/reg";
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
		const validateterminalCode = (rule, value, cb) => {
			if (this.formInfo.terminalType == 1) {
				if (value === "" || value === undefined) {
					return cb(new Error("请输入终端编号"));
				}
				if (!reg.terminalcode.test(value)) {
					return cb(new Error("请输入开头不为0的8位数字"));
				}
			}
		};
		const validateBarCode = (rule, value, cb) => {
			if (value === "" || value === undefined) {
				return cb(new Error("请输入TBOXSN"));
			}
			if (this.formInfo.terminalType === 1 && !reg.barcode.test(value)) {
				return cb(new Error("请输入请输入以A027E00428为首的30位或29位字符"));
			}
			if (this.formInfo.terminalType === 2 && !reg.alphanumeric.test(value)) {
				return cb(new Error("只能输入数字、字母"));
			}
		};
		return {
			loading: false,
			formInfo: {
				terminalCode: "",
				terminalType: 1,
				barCode: "",
				iccid: "",
				remark: "",
			},
			dataSource: 0,
			tableRow: {},
			selectSimVisibles: false,
			rules: {
				terminalCode: [
					{ required: false, trigger: "blur", validator: validateterminalCode },
					{ trigger: "change", validator: validateterminalCode },
				],
				terminalType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择TBOX供应商",
						formObjName: "formInfo",
					},
				],
				barCode: [
					{ required: true, trigger: "blur", validator: validateBarCode },
					{ trigger: "change", validator: validateBarCode },
				],
				iccid: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择ICCID",
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
					}
				}
			},
		},
	},
	created() {},
	methods: {
		change(e) {
			this.$refs["formCenter"].clearValidate();
			if (e == 2) {
				this.formInfo.terminalCode = "";
			}
		},
		// 关闭dialog
		closeDrawer() {
			this.formInfo = {
				terminalCode: "",
				terminalType: 1,
				barCode: "",
				iccid: "",
				remark: "",
			};
			this.$emit("update:visibles", false);
		},
		// 选择sim卡
		showSimList() {
			// if(this.formInfo.terminalType==1){
			//   this.dataSource=0
			// }else{
			//   this.dataSource=1
			// }
			this.selectSimVisibles = true;
		},
		// 选择sim卡完成
		selectSim(item) {
			this.formInfo.iccid = item.iccid;
			this.formInfo.simId = item.simId;
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
			let formLists = [];
			if (this.formInfo.terminalType == 1) {
				formLists = ["terminalCode", "barCode", "terminalType", "iccid"];
			} else {
				formLists = ["barCode", "terminalType", "iccid"];
				this.formInfo.terminalCode = "";
			}
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList: formLists,
			});
			if (!formcenter) {
				return;
			}
			const {
				terminalCode,
				barCode,
				terminalType,
				simId,
				remark,
				terminalId,
			} = this.formInfo;
			const postData = { terminalCode, barCode, terminalType, simId, remark };
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
