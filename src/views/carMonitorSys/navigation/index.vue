<template>
	<el-scrollbar
		style="height: calc( 100% - 50px );"
		wrap-class="default-scrollbar__wrap"
	>
		<div class="js-navigation navigation-container app-container">
			<div class="title">网站地图</div>
			<app-tree
				v-for="(item, index) in firstList"
				:list="item['children'][0].functionName == '功能导航' ? [] : [item]"
				:key="index"
			></app-tree>
		</div>
	</el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import AppTree from "./components/tree";
export default {
	name: "navigation",
	components: { AppTree },
	computed: {
		...mapGetters(["addRealRouters"]),
	},
	data() {
		return {
			roleList: this.$store.getters.roles,
			firstList: [],
		};
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.firstList = this.roleList.filter(
				(item) => item.functionName == "车辆监控"
			)[0].children;
			this.filterList(this.firstList);
			this.setLevel(0, this.firstList);
		},
		setLevel(parentLevel, tree) {
			tree.forEach((item) => {
				item.level = parentLevel + 1;
				if (!item.children) {
					item.islast = true;
				}
				if (item.children && item.children.length > 0) {
					item.islast = false;
					this.setLevel(item.level, item.children);
				}
			});
		},
		filterList(tree) {
			tree.forEach((item) => {
				if (item.children == null || item["children"][0].functionType == 2) {
					item.children = null;
				} else {
					this.filterList(item.children);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.navigation-container {
	.title {
		text-align: center;
		font-size: 20px !important;
		padding: 15px;
	}
	clear: both;
	& > ul {
		width: 25%;
		float: left;
	}
}
</style>
