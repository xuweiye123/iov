<template>
	<div class="search-btn">
		<div class="btn-title">
			<span
				style="min-width: 60px;line-height: 25px;font-weight: bold;color: #272727;"
				class="kzq-title"
				>命令执行:</span
			>
			<div class="action-btn">
				<el-button
					type="info"
					round
					v-waves
					v-for="(item, index) in buttonList"
					:key="index"
					@click="btnClick(item.url)"
				>
					<i
						:class="'iconfont icon-' + item.icon"
						style="font-size: 12px !important;"
					></i>
					{{ item.functionName }}
				</el-button>
				<el-button
					v-show="showEmpty"
					round
					v-waves
					class="empty-btn"
					type="info"
					@click="clear"
				>
					<i class="iconfont icon-refresh" />
					重置命令
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "commandBtn",
	props: {
		buttonList: {
			type: Array,
			default: () => [],
		},
		showEmpty: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		btnClick(type) {
			switch (type) {
				case "filter":
					return this.filter();
				case "readFault":
					return this.readFault();
				case "readHistoryFault":
					return this.readHistoryFault();
				case "readFreezeFrame":
					return this.readFreezeFrame();
				case "clearFault":
					return this.clearFault();
				case "readDataSteam":
					return this.readDataSteam();
				case "hardware":
					return this.hardware();
				case "software":
					return this.software();
				case "reprotdig":
					return this.reprotdig();
				case "writeInParts":
					return this.writeInParts();
			}
		},
		filter() {
			this.$emit("click-filter");
		},
		readFault() {
			this.$emit("click-fault");
		},
		readHistoryFault() {
			this.$emit("click-history");
		},
		readFreezeFrame() {
			this.$emit("click-freeze");
		},
		clearFault() {
			this.$emit("click-clear");
		},
		readDataSteam() {
			this.$emit("click-stream");
		},
		clear() {
			this.$emit("click-clear");
		},
		hardware() {
			this.$emit("click-hardware");
		},
		software() {
			this.$emit("click-software");
		},
		reprotdig() {
			this.$emit("click-reprotdig");
		},
		writeInParts() {
			this.$emit("click-writeInParts");
		},
	},
};
</script>

<style lang="scss">
.search-btn {
	background: #fff;
	border: none;
	.btn-title {
		padding: 16px 12px 12px;
		display: flex;
		align-items: center;
		.action-btn {
			svg {
				margin-right: 4px;
			}
		}
		.el-button--small,
		.el-button--small.is-round {
			margin-left: 12px !important;
		}
	}
}
</style>
