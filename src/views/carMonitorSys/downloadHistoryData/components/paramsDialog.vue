<template>
	<app-dialog
		:visibles.sync="visibles"
		top="6vh"
		@close-dialog="closeDialog"
		:isFooter="true"
		:title="'选择参数'"
		class="ordinary"
		@handle-submit="handleSubmit"
	>
		<div slot="formContent">
			<el-form style="width:30vw" :label-position="'right'" label-width="60px">
				<el-form-item label="快速查询：">
					<el-input
						v-model="filterText"
						style="width:220px"
						placeholder="请输入参数名称"
						clearable
					/>
				</el-form-item>
			</el-form>
			<div style="height:60vh">
				<el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap">
					<el-tree
					  v-loading="loading" 
						ref="tree"
						:data="treeData"
						show-checkbox
						:expand-on-click-node="false"
						node-key="id"
						:filter-node-method="filterNode"
						default-expand-all
						:indent="10"
						@check="checkChangeFc"
					/>
				</el-scrollbar>
			</div>
		</div>
	</app-dialog>
</template>

<script>
let id = 1000;
import { getChooseDbcVariables } from "@/api/carMonitorSys/downloadHistory";
export default {
	name: "ResultDialog",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => {},
		},
		defaultParams: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			treeData: [],
			loading: false,
			filterText: "",
			checkedParentId: "",
		};
	},
	computed: {},
	watch: {
		visibles(e1) {
			if (e1) {
				const postData = {
					terminalCode: this.data.selectCarList[0].terminalCode,
					startTime: this.data.startTime,
					endTime: this.data.endTime,
				};
				this.getData(postData);
			}
		},
		filterText(val) {
			this.$refs.tree.filter(val);
		},
	},
	mounted() {},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		// 关闭dialog
		closeDialog() {
			this.treeData = [];
			this.$emit("update:visibles", false);
		},
		getData(postData) {
			this.loading = true;
			getChooseDbcVariables(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.treeData = data.data || [];
						this.$refs.tree.setCheckedKeys(this.defaultParams);
						console.log("this.treeData", this.treeData);
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		//勾选
		checkChangeFc(data, bol) {
			this.checkedParentId = data.parentId ? data.parentId : data.id;
			let node = this.$refs.tree;
			let nodeArr = node.root.childNodes;
			nodeArr.forEach((item) => {
				if (item.data.id !== this.checkedParentId) {
					item.checked = false;
					if (item.childNodes && item.childNodes.length > 0) {
						item.childNodes.forEach((item1) => {
							item1.checked = false;
							if (item1.childNodes && item1.childNodes.length > 0) {
								item1.childNodes.forEach((item2) => {
									item2.checked = false;
								});
							}
						});
					}
				}
			});
			this.$refs.tree.setCheckedKeys(this.$refs.tree.getCheckedKeys());
		},
		handleSubmit() {
			const idList = this.$refs.tree.getCheckedKeys(true);
			const itemList = this.$refs.tree.getCheckedNodes(true);
			const treeData = this.treeData;
			this.$emit("selcet-complete", { idList, itemList, treeData });
			this.closeDialog();
		},
	},
};
</script>

<style lang="scss" scoped></style>
