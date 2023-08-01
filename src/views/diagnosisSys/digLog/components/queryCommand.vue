<template>
	<app-drawer
		:visibles="visibles"
		:title="'查看命令'"
		width="50%"
		@close-drawer="closeDialog"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<el-row type="flex" justify="center" align="top" slot="drawerContent">
			<el-col>
				<el-form
					ref="formLeft"
					:model="formInfo"
					:label-position="'right'"
					label-width="60px"
				>
					<el-form-item label="下发命令：">
						<json-viewer
							:value="sendParam"
							:copyable="copyable"
							:expand-depth="4"
							boxed
							sort
							class="send-data"
						>
							<template slot="copy" slot-scope="scope">
								<el-button v-waves type="primary" size="mini">
									{{ scope.copied ? "复制成功" : "复制" }}
								</el-button>
							</template>
						</json-viewer>
					</el-form-item>
					<el-form-item label="返回数据：">
						<json-viewer
							:value="responseParam"
							:copyable="copyable2"
							:expand-depth="4"
							boxed
							sort
							class="send-data"
						>
							<template slot="copy" slot-scope="scope">
								<el-button v-waves type="primary" size="mini">
									{{ scope.copied ? "复制成功" : "复制" }}
								</el-button>
							</template>
						</json-viewer>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</app-drawer>
</template>
<script>
// 组件
// request
import { getDxProtocolJson } from "@/api/diagnosisSys/digLog";
export default {
	name: "queryCommand",
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
	data() {
		return {
			formInfo: {},
			sendParam: {},
			responseParam: {},
			copyable: { copyText: "复制", copiedText: "复制成功" },
			copyable2: { copyText: "复制", copiedText: "复制成功" },
		};
	},
	watch: {
		// true:编辑 false：新增
		visibles: {
			handler(e1) {
				if (e1) {
					this.setData();
				}
			},
			immediate: true,
		},
	},
	methods: {
		setData() {
			let param = {
				token: this.data.token,
			};
			getDxProtocolJson(param).then(({ data }) => {
				if (data.code === 0) {
					this.formInfo = { ...data.data };
					this.sendParam = JSON.parse(data.data.sendParam);
					this.sendParam.cmd = JSON.parse(this.sendParam.cmd);
					this.responseParam = JSON.parse(data.data.responseParam);
				}
			});
		},
		// 关闭dialog
		closeDialog() {
			this.formInfo.responseParam = "";
			this.formInfo.sendParam = "";
			this.$emit("update:visibles", false);
		},
	},
};
</script>
<style lang="scss" scoped>
.send-data {
	background-color: #f2f3f5;
}
::v-deep.jv-container.boxed {
	border: 1px solid #f2f3f5;
}
::v-deep.jv-container.jv-light {
	background-color: #f2f3f5;
	padding: 0 10px;
}
</style>
