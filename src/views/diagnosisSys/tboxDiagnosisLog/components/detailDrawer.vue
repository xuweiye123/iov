<template>
	<app-drawer
		:visibles="visibles"
		:title="'详情'"
		width="700px"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
		:wrapperClosable="true"
	>
		<div slot="drawerContent">
			<el-input
				type="textarea"
				readonly
				v-model="obj"
				resize="none"
				:show-word-limit="true"
			>
			</el-input>
		</div>
	</app-drawer>
</template>
<script>
// request
import { readLogList } from "@/api/diagnosisSys/tboxDiagnosisLog";
// 组件
export default {
	doNotInit: true,
	name: "detailDrawer",
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
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.listLoad();
				}
			},
		},
	},
	data() {
		return {
			obj: "",
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.obj = "";
			this.listLoading = true;
			readLogList({ id: this.data.id })
				.then(({ data }) => {
					if (data.code === 0) {
						this.obj = data.data;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner {
	height: calc(((100vh - 73px) - 10px) - 20px);
	padding: 5px 15px;
}
</style>
