<template>
	<app-drawer
		:visibles="visibles"
		:title="'报文详情'"
		width="550px"
		@close-drawer="closeDialog"
		:wrapperClosable="true"
		:isDrawerFoot="false"
		:loading="loading"
	>
		<div slot="drawerContent">
			<div style="padding-bottom: 20px">
				<div class="bw-title">原始报文：</div>
				<div class="bw-box">{{ tableRow.msg | processData }}</div>
				<div class="bw-title">解析后：</div>
				<div class="bw-box1">
					<el-input
						class="bw-area"
						type="textarea"
						:rows="15"
						readonly
						v-model="jsonMsg"
					>
					</el-input>
				</div>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// request
import { showMessage2 } from "@/api/transmitSys/logSearch";
export default {
	name: "seeMessage",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		tableRow: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			msg: "",
			jsonMsg: "",
			loading: false,
		};
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.jsonMsg = "";
				this.seeMessage();
			}
		},
	},
	methods: {
		closeDialog() {
			this.$emit("update:visibles", false);
		},
		seeMessage() {
			if (this.tableRow.dataType) {
				this.loading = true;
				showMessage2({ msg: this.tableRow.msg })
					.then(({ data }) => {
						this.loading = false;
						if (data.code === 0) {
							this.jsonMsg = data.data;
						}
					})
					.catch(() => {
						this.loading = false;
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.bw-box {
	word-break: break-all;
	max-height: 200px;
	// background-color: #f5f5f5;
	font-family: Courier New !important;
	font-size: 12px !important;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 5px;
	overflow: auto;
	margin: 5px 0;
	color: #000;
	margin-bottom: 20px;
	.el-textarea.is-disabled .el-textarea__inner {
		background: none;
		color: #000;
		border: 0;
		cursor: default;
	}
}
.bw-box1 {
	font-family: Courier New !important;
	font-size: 12px !important;
}
</style>
