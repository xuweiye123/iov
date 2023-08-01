<template>
	<div class="search_list search_list_border">
		<header v-show="showTitle" class="search-title">
			<span class="fSerach">
				{{ title }}
			</span>
		</header>
		<div :class="['search_content', custromClass]">
			<slot name="content" />
		</div>
		<slot name="bottom" />
		<slot name="footer"></slot>
		<slot name="extra"></slot>
	</div>
</template>

<script>
export default {
	props: {
		showTitle: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "快速查询",
		},
		custromClass: {
			type: String,
			default: "",
		},
		icons: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.search_list_border {
	//  border: 1px solid rgba(0,0,0,.1);
	// background: #ffffff;
	// margin: 12px;
	.search_content {
		padding: 10px 10px 0;
		.s-text {
			padding-left: 5px;
			height: 26px;
			line-height: 24px;
		}
		.el-row {
			// padding-bottom: 40px;
		}
	}
}
.search-title {
	padding: 12px 15px 0 15px;
	font-size: 12px;
	span {
		font-size: 14px;
		font-weight: bold;
	}
}
.icon-search {
	margin-right: 10px;
}
.search-pad {
	padding: 12px 30px 10px 0 !important;
}
</style>
