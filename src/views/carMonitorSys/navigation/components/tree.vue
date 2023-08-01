<template>
	<ul v-if="list && list.length > 0">
		<li v-for="(item, index) in list" :key="index" v-show="item.isShow">
			<div v-if="item.level == 1">
				<span class="root"
					><svg-icon :icon-class="'icon-file'"></svg-icon
					><span :style="{ 'margin-left': '5px' }">{{
						item.functionName
					}}</span></span
				>
			</div>
			<div v-else-if="item.level > 1 && !item.islast">
				<!-- <div v-else-if="item.level > 1"> -->
				<i class="line-left"></i>
				<i class="line-top"></i>
				<span class="root"
					><svg-icon :icon-class="'icon-file'"></svg-icon
					><span :style="{ 'margin-left': '5px' }">{{
						item.functionName
					}}</span></span
				>
			</div>
			<div v-else>
				<i class="line-left"></i>
				<i class="line-top"></i>
				<span @click="goTo(item)" class="leaf"
					><span :style="{ 'margin-left': '5px' }">{{
						item.functionName
					}}</span></span
				>
			</div>
			<app-tree :list="item.children"></app-tree>
		</li>
	</ul>
</template>

<script>
export default {
	name: "appTree",
	props: {
		list: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		goTo(item) {
			this.$router.push({ name: item.url });
		},
	},
};
</script>

<style lang="scss" scoped>
body {
	font-size: 14px;
	font-family: "微软雅黑";
}

ul,
li,
div,
a {
	margin: 0;
	padding: 0;
}

li {
	list-style: none;
	position: relative;
}

a {
	text-decoration: none;
}

img {
	vertical-align: middle;
	margin: 0;
}

ul ul {
	margin-left: 40px;
}

.tree {
	margin-top: 20px;
	float: left;
	margin-left: 10px;
}
.root {
	padding: 0px 10px;
	border-radius: 5px;

	line-height: 24px;
	display: inline-block;
}

.line-left,
.line-top {
	position: absolute;
	margin-left: -22px;
}
.line-left {
	border-left: 1px dashed #999;
	height: 100%;
}
.line-top {
	height: 20px;
	width: 30px;
	margin-top: 14px;
	border-top: 1px dashed #999;
}
li:last-child > div .line-left {
	height: 15px;
}
.leaf {
	background-size: 100% 100%;
	padding: 0 10px;
	margin-left: 13px;
	margin-top: 4px;
	// color: #fff;
	display: inline-block;
	line-height: 26px;
	font-size: 12px;
	cursor: pointer;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	border-radius: 3px;
}
</style>
