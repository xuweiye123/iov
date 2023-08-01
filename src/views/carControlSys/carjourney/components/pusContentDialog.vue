<template>
	<app-dialog
		:visibles.sync="visibles"
		width="50%"
		top="8vh"
		:title="'查看推送内容'"
		@close-dialog="closeDialog"
		:isFooter="false"
	>
		<!-- table -->
		<div slot="formContent">
			<el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap">
				<div style="margin-bottom:50px;">
					<json-viewer
						:value="songReqJson"
						:copyable="copyable"
						:expand-depth="4"
						boxed
						sort
					>
						<template slot="copy" slot-scope="scope">
							<el-button v-waves type="primary" size="mini">
								{{ scope.copied ? "复制成功" : "复制" }}
							</el-button>
						</template>
					</json-viewer>
				</div>
			</el-scrollbar>
		</div>
	</app-dialog>
</template>
<script>
//工具
import { isJSON } from "@/utils/index";
export default {
	name: "pusContentDialog",
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
			songReqJson: "",
			copyable: { copyText: "复制", copiedText: "复制成功" },
		};
	},
	computed: {
		filterTableList() {
			return this.tableList.filter((item) => item.checked);
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				//判断是否为JSON字符串
				if (this.data.message && isJSON(this.data.message)) {
					this.songReqJson = JSON.parse(this.data.message);
				} else {
					this.songReqJson = this.data.message;
				}
			}
		},
	},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>