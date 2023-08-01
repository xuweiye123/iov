<template>
	<app-drawer
		:visibles="visibles"
		title="设置不转发协议"
		width="450px"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
		:isDrawerFoot="treeData.length > 0"
	>
		<div slot="drawerContent">
			<el-tree
				v-loading="treeLoading"
				ref="tree"
				:data="treeData"
				:expand-on-click-node="false"
				check-on-click-node
				:default-expand-all="true"
				:default-checked-keys="defaultCheckedKeys"
				node-key="id"
				show-checkbox
			/>
		</div>
	</app-drawer>
</template>
<script>
// 混入
import {
	getProtocolVariable,
	getExcludeVariable,
	setExcludeVariable,
} from "@/api/transmitSys/forwardTarget";
export default {
	name: "detailDrawer",
	components: {},
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
		return {
			loading: false,
			treeLoading: false,
			formInfo: {},
			treeTotal: "",
			defaultCheckedKeys: [],
			treeData: [],
			activeNames: ["1", "2"],
			tableRow: {},
		};
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.formInfo = { ...this.data };
					this.$nextTick(() => {
						this.setNoForwarding();
					});
				}
			},
		},
	},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.formInfo = {};
			this.$emit("update:visibles", false);
		},
		setNoForwarding() {
			this.defaultCheckedKeys = [];
			this.treeData = [];
			this.treeTotal = 0;
			const data = {
				protocolId: this.formInfo.protocolId,
			};
			this.treeLoading = true;
			getProtocolVariable(data)
				.then(({ data }) => {
					this.treeData = data.data || [];
					this.treeTotal = data.total || 0;
					getExcludeVariable({ targetId: this.formInfo.targetId })
						.then(({ data }) => {
							if (data.code === 0) {
								this.defaultCheckedKeys = data.data || [];
								if (
									this.defaultCheckedKeys &&
									this.defaultCheckedKeys.constructor === Array
								) {
									this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
								}
							}
						})
						.finally(() => {
							this.treeLoading = false;
						});
				})
				.finally(() => {
					this.treeLoading = false;
				});
		},
		// 提交
		submitForm() {
			if (this.treeTotal == 0) {
				this.closeDialog();
			} else {
				const variableIds = this.$refs.tree.getCheckedKeys(true); // 获取所有选择的子节点
				const data = {
					variableIds,
					targetId: this.formInfo.targetId,
					targetName: this.formInfo.targetName,
				};
				this.loading = true;
				setExcludeVariable(data)
					.then(({ data }) => {
						if (data.code === 0) {
							this.$emit("set-complete");
							this.closeDialog();
						}
					})
					.finally(() => {
						this.loading = false;
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
