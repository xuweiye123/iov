<template>
	<div
		v-show="show"
		class="context-menu-box"
		@contextmenu="closeMenu"
		@click="closeMenu"
	>
		<div
			:style="{ left: position.x + 'px', top: position.y + 'px' }"
			class="context-menu"
			@click.stop="formulaEdit"
		>
			<span> <i class="el-icon-edit" /> 编辑公式</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "ContextMenu",
	props: {
		position: {
			type: Object,
			default: () => {
				return { x: 0, y: 0 };
			},
		},
		show: {
			type: Boolean,
			default: false,
		},
		showMsg: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		closeMenu(e) {
			if (e) {
				e.preventDefault();
			}
			this.$emit("update:show", false);
		},
		formulaEdit() {
			this.$emit("update:show", false);
			if (this.showMsg) {
				this.$message.error(
					"所选数据项只能单选,请先删除已经选择的DBC参数或联系管理员!"
				);
				return;
			}
			this.$parent.showFormula();
		},
	},
};
</script>

<style lang="scss" scoped>
.context-menu-box {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99999;
	background: transparent;
	width: 100vw;
	height: 100vh;
	.context-menu {
		display: inline-block;
		// background: #fff;
		padding: 10px;
		border-radius: 3px;
		font-size: 12px;
		// color: #606266;
		// box-shadow: 0 0 1px 1px #dcdfe6;
		position: absolute;
		cursor: pointer;
		&:hover {
			// color:#2071ff;
			// box-shadow: 0 0 1px 1px #d9e7ff;
		}
	}
}
</style>
