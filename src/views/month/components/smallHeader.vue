<template>
	<div class="smallHeader">
		<div class="dfsc">
			<div class="left dfc">
				<div class="square"></div>
				<div>
					<span class="fontType df">{{ title }}</span>
				</div>
			</div>
			<slot name="right">
				<div class="right"></div>
			</slot>
			<div class="sanjiao"></div>
		</div>

		<div class="line"></div>
	</div>
</template>
<script>
export default {
	name: "smallHeader",
	props: {
		title: String,
	},
};
</script>
<style lang="scss" scoped>
.square {
	width: 0;
	height: 0;
	border: 0.5vh solid;
	border-color: #007EFF transparent #00A0E9
		transparent;
	border-width: 0.7vh 0.7vh 0.7vh 0.7vh;
	margin-right: 1vh;
}
.fontType {
	font-family: SourceHanSansCN-Bold;
	font-weight: bold;
	font-size: 1.5vh;
}
.dfsc {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1vh;
	position: relative;
	padding-right: 2vh;
}
.dfc {
	display: flex;
	justify-content: center;
	align-items: center;
}
.df {
	display: flex;
}
.line {
	border-bottom: 1px solid #112B5F;
}
.sanjiao {
	width: 0;
	height: 0;
	border-bottom: 1vh solid #007EFF;
	border-left: 1vh solid transparent;
	position: absolute;
	bottom: 0;
	right: 0;
}
</style>