<template>
	<app-drawer
		:visibles.sync="visibles"
		width="50%"
		:wrapperClosable="true"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
		:title="'换电热力图'"
		:loading="loading"
	>
		<div slot="drawerContent">
			<div
				ref="chargeChina"
				class="echarts-box"
				style="width:100%;height:60vh;"
			/>
			<div class="visualMap" style="margin-top:50px;">
				<div v-for="(item, index) in visualMapColorRed1" :key="index" class="visualMapItem">
					<div class="divBg distance" :style="{ background: item.color }"></div>
					<div style="font-size:14px;color:#262834 ">{{ item.num }}</div>
				</div>
			</div>
			<div class="visualMap">
				<div v-for="(item, index) in visualMapColorRed2" :key="index" class="visualMapItem">
					<div class="divBg distance" :style="{ background: item.color }"></div>
					<div style="font-size:14px;color:#262834 ">{{ item.num }}</div>
				</div>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { getCityChangeHot } from "@/api/carMonitorSys/powerChangeDetail";
import { chinaJSON } from "@/utils/chinaJSON";
import { heatMapJSON } from "@/utils/heatMapJSON";
import { loadMap } from "@/utils/eCharts";
import { mapState } from "vuex";
// request
export default {
	name: "chargeDiagram",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.$nextTick(() => {
					this.scatterInit();
				});
			}
		},
		"$store.state.theme.activeName": function(val) {
			if (val === "green") {
				this.colorList = ["#D9DCDF","#B6FFC7","#BBFFF3","#CEF4A3","#9BF0CB","#88FFD9 ","#84DFD7","#A1DE83","#EDF798","#5ADAC9","#4ED99C","#00BC7C"];
			}
			if (val === "blue") {
				this.colorList = ["#D9DCDF","#D0FAE9","#B1F4CF","#88EBB7","#68DFBF","#4FD3D5","#1CC1F5","#32B2F9","#39A3F8","#3091F4","#2A80F0","#266EEA"];
			}
			if (val === "red") {
				this.colorList = ["#D9DCDF","#FFF1F1","#FDE4E4","#F8C2C0","#FECEAB","#FFAE98","#FF847C","#FF9B8B","#F19390","#FF9C8C","#EC706C","#E8534E"];
			}
			this.visualMapColorRed1=[
				{color:this.colorList[11],num:">1000"},
				{color:this.colorList[10],num:"900-1000"},
				{color:this.colorList[9],num:"800-900"},
				{color:this.colorList[8],num:"700-800"},
				{color:this.colorList[7],num:"600-700"},
				{color:this.colorList[6],num:"500-600"},
			]
			this.visualMapColorRed2=[
        {color:this.colorList[5],num:"400-500"},
				{color:this.colorList[4],num:"300-400"},
				{color:this.colorList[3],num:"200-300"},
				{color:this.colorList[2],num:"100-200"},
				{color:this.colorList[1],num:"<100"},
				{color:this.colorList[0],num:"无数据"},
			]
		},
	},
	data() {
		return {
			colorList:[],
			loading: false,
			visualMapColorRed1:[],
			visualMapColorRed2:[]
		};
	},
	mounted() {
		this.$nextTick(() => {
			let val = this.$store.state.theme.activeName
			if (val === "green") {
				this.colorList = ["#D9DCDF","#B6FFC7","#BBFFF3","#CEF4A3","#9BF0CB","#88FFD9 ","#84DFD7","#A1DE83","#EDF798","#5ADAC9","#4ED99C","#00BC7C"];
			}
			if (val === "blue") {
				this.colorList = ["#D9DCDF","#D0FAE9","#B1F4CF","#88EBB7","#68DFBF","#4FD3D5","#1CC1F5","#32B2F9","#39A3F8","#3091F4","#2A80F0","#266EEA"];
			}
			if (val === "red") {
				this.colorList = ["#D9DCDF","#FFF1F1","#FDE4E4","#F8C2C0","#FECEAB","#FFAE98","#FF847C","#FF9B8B","#F19390","#FF9C8C","#EC706C","#E8534E"];
			}
			this.visualMapColorRed1=[
				{color:this.colorList[11],num:">1000"},
				{color:this.colorList[10],num:"900-1000"},
				{color:this.colorList[9],num:"800-900"},
				{color:this.colorList[8],num:"700-800"},
				{color:this.colorList[7],num:"600-700"},
				{color:this.colorList[6],num:"500-600"},
			]
			this.visualMapColorRed2=[
        {color:this.colorList[5],num:"400-500"},
				{color:this.colorList[4],num:"300-400"},
				{color:this.colorList[3],num:"200-300"},
				{color:this.colorList[2],num:"100-200"},
				{color:this.colorList[1],num:"<100"},
				{color:this.colorList[0],num:"无数据"},
			]
		});
	},
	computed: {
		...mapState("theme", ["activeName"]),
	},
	methods: {
		// 关闭dialog
		closeDrawer() {
			this.$emit("update:visibles", false);
		},
		scatterInit() {
			this.loading = true;
			this.$echarts.registerMap("china", chinaJSON);
			getCityChangeHot()
				.then(({ data }) => {
					if (data.code === 0) {
						let otheritems = [];
						otheritems = heatMapJSON;
						var outdata = [];
						otheritems.forEach((i) => {
							if (i.CITYNAME != null) {
								outdata.push({
									name: i.CITYNAME,
									value: 0,
								});
							}
						});
						if(data.data){
							data.data.forEach((i) => {
								outdata.push({
									name: i.province,
									value: Number(i.carCount),
								});
							});
						}
						let visualMapColor = this.colorList;
						let activeColor =
							this.activeName ==  "#9EA8B2";
						let areaColor = this.activeName == "red" ?"#D1251A":this.activeName == "green"?"#00BC7C":"#1E64DD"
						const Dom = this.$refs.chargeChina;
						const myChart = this.$echarts.init(Dom);
						myChart.clear();
						const optionData = loadMap(outdata,visualMapColor, activeColor, areaColor,'次');
						myChart.setOption(optionData);
						this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
							this.$nextTick(() => {
								myChart.resize();
							});
						});
						// window.addEventListener("resize", function() {
						// 	myChart.resize();
						// });
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.visualMap{
	display: flex;
	justify-content: flex-start;
	padding: 10px 30px;
}
.visualMapItem{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	// margin-right:30px;
	width: 16%;
}
.divBg {
  width: 10px;
  height: 10px;
}
.distance{
	margin-right:3px;
}
</style>
