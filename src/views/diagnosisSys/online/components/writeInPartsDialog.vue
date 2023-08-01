<template>
	<app-dialog
		:visibles="visibles"
		:title="title"
		width="80.5%"
		top="8vh"
		@close-dialog="closeDialog"
		:isFooter="false"
	>
		<div slot="formContent">
			<writeData :carObj="data"  :systemObj="systemData" :isBtn="true"/>
		</div>
	</app-dialog>
</template>

<script>
import writeData from "@/views/diagnosisSys/writeData";
export default {
	name: "writeInPartsDialog",
	components: {
		writeData,
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		systemData: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			title: "写入零部件",
		};
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
