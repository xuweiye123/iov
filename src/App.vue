<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
export default {
	name: "App",
	data() {
		return {};
	},
};
</script>
<style lang="scss">
#app {
	font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
		"Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: rgba(0, 0, 0, 0.86);
}
</style>
