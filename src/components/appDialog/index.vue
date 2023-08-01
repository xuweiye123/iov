<!--<app-dialog
    :visibles="visibles"
    :title="!isEdit? '新增角色':'编辑角色'"
    width="45%"
    @close-dialog="closeDialog"
    @handle-submit="submitForm"
    :loading="loading"
    :isFooter="true"
  >
  <div slot="formContent">
  </div>
</app-dialog> -->
<template>
	<el-dialog
		custom-class="dialogBox"
		v-if="visibles"
		v-el-drag-dialog
		:visible.sync="visibles"
		:before-close="closeDialog"
		:close-on-click-modal="false"
		:lock-scroll="false"
		:show-close="false"
		:append-to-body="true"
		center
		:width="width"
		:top="top"
	>
		<!-- 标题 -->
		<div slot="title" class="dialogHeader">
				<span class="custom-dialog-header-title">
					<span class="title-style"></span>
					<span style="margin-left: 3px;font-size: 16px;">{{ title }}</span>
				</span>
				<span v-if="showClose" @click="closeDialog" class="custom-dialog-header-close">
					<i class="iconfont icon-close"></i>
				</span>
		</div>

		<!-- 内容插槽 -->
		<slot name="formContent"></slot>

		<!-- 底部按钮 -->
		<span slot="footer" class="dialog-footer" v-if="isFooter">
			<slot name="footerButton">
				<span v-if="type == 'import'">
					<el-button v-waves>
						<a class="templateUrl" :href="templateUrl"
							><i
								class="iconfont icon-downLoad"
								style="font-size: 12px !important;margin-right:5px;"
							></i
							>{{ templateText }}</a
						>
					</el-button>
					<el-button
						:loading="loading"
						v-waves
						type="primary"
						@click="handleSubmit"
						>{{ confirmText }}</el-button
					>
				</span>
				<span v-else-if="type == 'footerSpecial'">
					<el-button v-waves @click="closeDialog">{{ closeText }}</el-button>
					<el-button
						:loading="loading"
						v-waves
						type="primary"
						@click="handleSubmit1"
						>{{ confirmText1 }}</el-button
					>
					<el-button
						:loading="loading"
						v-waves
						type="primary"
						@click="handleSubmit"
						>{{ confirmText }}</el-button
					>
				</span>
				<span v-else>
					<el-button v-waves @click="closeDialog">{{ closeText }}</el-button>
					<el-button
						:loading="loading"
						v-waves
						type="primary"
						@click="handleSubmit"
						>{{ confirmText }}</el-button
					>
				</span>
			</slot>
		</span>
	</el-dialog>
</template>

<script>
export default {
	name: "appDialog",
	props: {
		visibles: {
			typeof: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: "35%",
		},
		top: {
			type: String,
			default: "15vh",
		},
		title: {
			type: String,
			default: "标题",
		},
		// 是否显示关闭按钮
		showClose: {
			typeof: Boolean,
			default: true,
		},
		icon: {
			type: String,
			default: "",
		},
		loading: {
			typeof: Boolean,
			default: false,
		},
		isFooter: {
			typeof: Boolean,
			default: false,
		},
		confirmText: {
			type: String,
			default: "确 定",
		},
		confirmText1: {
			type: String,
			default: "确定&关闭",
		},
		templateText: {
			type: String,
			default: "下载模板",
		},
		closeText: {
			type: String,
			default: "取 消",
		},
		type: {
			type: String,
			default: "", //default: 'import'表示导入弹出层对应的按钮；default: ''表示普通的“关闭，保存”按钮
		},
		templateUrl: {
			type: String,
			default: "", //下载模板的路径
		},
	},
	data() {
		return {};
	},
	watch: {
    visibles(e1) {
      if (e1) {
				this.$nextTick(()=>{
					let marginTop = document.querySelector(".el-dialog.dialogBox").style.marginTop;
					document.querySelector(".el-dialog.dialogBox").style.marginBottom = marginTop;

					let headerHeight = 0;
					if(document.querySelector(".el-dialog__header")){
						headerHeight = document.querySelector(".el-dialog__header").offsetHeight;
					}

					let footerHeight = 0;
					if(document.querySelector(".el-dialog__footer")){
						footerHeight = document.querySelector(".el-dialog__footer").offsetHeight;
					}

					let dialogBodyHeight = `calc(100vh - ${marginTop} - ${marginTop} - ${headerHeight}px - ${footerHeight}px)`;
					document.querySelector(".el-dialog__body").style.maxHeight = dialogBodyHeight;
				})
      }
    },
  },
	methods: {
		// 关闭dialog
		closeDialog() {
			this.$emit("close-dialog");
		},
		/**
		 * 提交
		 */
		handleSubmit() {
			this.$emit("handle-submit");
		},
		/**
		 * 确定并关闭
		 */
		handleSubmit1() {
			this.$emit("handle-submit1");
		},
	},
};
</script>
<style lang="scss">
// .dialog-footer{
//   // display: flex;搜狗浏览器注释此代码按钮显示在右边
//   justify-content: right;
//   text-align: right;
// }
::v-deep .el-dialog__body{
	overflow-y: auto;
}
::v-deep .el-radio__label {
	padding-left: 5px;
}
.dialogHeader {
	height: 46px;
	clear: both;
	line-height: 46px;
	.title-style {
		margin-top: 12px;
	}
	.custom-dialog-header-title {
		float: left;
		margin-left: 15px;
		display: flex;
	}
	.custom-dialog-header-close {
		float: right;
		margin-right: 15px;
		font-weight: bold;
		cursor: pointer;
		.el-icon-close {
			font-size: 16px !important;
			vertical-align: middle;
		}
	}
}

// .el-pagination{
//   padding: 4px 20px;
//   position: absolute;
//   right: 0;
// }
</style>