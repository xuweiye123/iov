<template>
	<div class="chartsTitle">
    <span class="chartsText">
      {{ title }}
    </span>
	</div>
</template>
<script>
export default {
	name: "chartsTitle",
	props: {
    svgName:String,
		title: String,
	},
};
</script>
<style lang="scss" scoped>
.chartsTitle{
  height: 4vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.chartsText{
  padding-left:15px;
  font-size: 13px;
  // font-family: Microsoft YaHei;
  font-weight: bold;
  color: #262834;
}
</style>