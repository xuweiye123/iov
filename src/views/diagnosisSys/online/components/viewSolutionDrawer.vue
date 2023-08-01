<template>
	<app-drawer
		:visibles="visibles"
		:title="`解决方案（故障名称：${content1}）`"
		width="500px"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
		:wrapperClosable="true"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:model="formInfo"
				:label-position="'right'"
				label-width="70px"
			>
				<el-form-item label="方案内容：">
					<el-input
						v-model="result.solution"
						placeholder="请输入方案内容"
						type="textarea"
						maxlength="50"
						rows="4"
						show-word-limit
						resize="none"
						readonly
					/>
				</el-form-item>
			</el-form>
		</div>
	</app-drawer>
</template>

<script>
// request
import { getFaultSolution } from "@/api/diagnosisSys/online";
export default {
	name: "viewSolutionDrawer",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		vinNo: {
			type: String,
			default: "",
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.content1 = this.data.content || '';
					this._getFaultSolution(this.data);
				}
			},
			immediate: true,
		},
	},
	data() {
		return {
			formInfo: {},
			result: {},
			content1: '',
		};
	},
	methods: {
		_getFaultSolution(row) {
			let params = {
				faultCode: row.result,
				vinNo: this.vinNo,
				ecuName: row.ecuID,
			};
			getFaultSolution(params).then(({ data }) => {
				if (data.code === 0) {
					this.result = data.data;
				}
			});
		},
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
