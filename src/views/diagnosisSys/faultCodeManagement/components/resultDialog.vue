<template>
	<app-dialog
		class="ordinary"
		:visibles="visibles"
		:title="'温馨提示'"
		width="60%"
		top="5vh"
		@close-dialog="closeDialog"
		@handle-submit="handleExport"
		confirmText="导出失败数据"
		:isFooter="isShow"
	>
		<div slot="formContent">
			<div style="max-height:65vh;" class="dfcc">
				<div>
					<div class="sim-import-result">
						<i class="iconfont icon-gantanhao-yuankuang"></i>
						已成功导入
						<span class="green">{{
							data.successedCount ? data.successedCount : "0"
						}}</span>
						条数据
					</div>
					<div class="sim-import-result">
						失败
						<span class="red">{{
							failedList && failedList.length ? failedList.length : "0"
						}}</span>
						条
					</div>
				</div>
			</div>
		</div>
	</app-dialog>
</template>

<script>
export default {
	name: "resultDialog",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		text: {
			type: String,
			default: "",
		},
		keys: {
			type: String,
			default: "",
		},
		message: {
			type: String,
			default: "无失败信息",
		},
		isShow: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
		};
	},
	computed: {
		failedList() {
			return this.data.errorList;
		},
	},
	watch: {},
	methods: {
		// 关闭dialog
		closeDialog() {
			this.$emit("close");
			this.$emit("update:visibles", false);
		},
		// 取消
		handleCancel() {
			this.closeDialog();
		},
		// 导出
		handleExport() {
			if (this.data.errorList.length === 0) {
				this.$message.warning({
					message: this.message,
					duration: 2 * 1000,
				});
				return false;
			}
			const postData = this.data.errorList;
			this.$emit("export-fail", postData);
		},
	},
};
</script>

<style lang="scss" scoped>
$border_color: #ebeef5;
p {
	margin: 0;
}
.sim-import-result {
	height: 15px;
	margin-bottom: 10px;
	font-size: 15px;
	.iconfont {
		color: #999;
	}
	.green {
		font-size: 15px;
		color: #25ca4e;
	}
	.red {
		font-size: 15px;
		color: #ff0000;
	}
}
.all-content-info {
	padding: 0;
	margin: 0;
	.flex-li {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		p {
			flex: 1;
			text-align-last: center;
		}
		.table-border-p-left {
			border-left: 1px solid $border_color;
		}
	}
	.statistics-scroll {
		overflow: auto;
		max-height: calc(65vh - 60px);
	}
	.content-info-li {
		font-size: 13px;
		color: #999;
		border-bottom: 1px solid $border_color;
		border-left: 1px solid $border_color;
		border-right: 1px solid $border_color;
		p {
			padding: 10px 25px;
		}
	}
	.table-header {
		height: 35px;
		// background: #f5f4f7;
		font-size: 12px;
		border: 1px solid $border_color;
		p {
			height: 35px;
			line-height: 35px;
		}
	}
}
.dfcc {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
