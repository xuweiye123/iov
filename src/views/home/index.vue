<template>
	<div style="height:100%;">
		<div style="margin-bottom:12px;" v-if="isWhichHome === 1">
			<div class="home">
				<div class="top">
					<div class="title">
						<p class="text">{{ $store.state.user.loginName }} 你好，欢迎登录智能车云平台！</p>
					</div>
				</div>
				<div class="imgBox">
					<div class="imgPicture"></div>
				</div>
			</div>
		</div>
		<transmitSys-home v-if="isWhichHome === 2"></transmitSys-home>
		<carMonitor-home v-if="isWhichHome === 3"></carMonitor-home>
		<diagnosisSys-home v-if="isWhichHome === 4"></diagnosisSys-home>
		<carControlSys-Home v-if="isWhichHome === 5"></carControlSys-Home>
		<batterySys-Home v-if="isWhichHome === 6"></batterySys-Home>
	</div>
</template>
<script>
import transmitSysHome from "./components/transmitSysHome";
import carMonitorHome from "./components/carMonitorHome";
import carControlSysHome from "./components/carControlSysHome";
import diagnosisSysHome from "./components/diagnosisSysHome";
import batterySysHome from "./components/batterySysHome";
// 辅助函数
export default {
	name: "home",
	components: { carMonitorHome, carControlSysHome, transmitSysHome, diagnosisSysHome,batterySysHome },
	data() {
		return {};
	},
	computed: {
		//1:欢迎界面；2：数据转发首页；3：远程监控首页；4：远程诊断首页；5：远程控制首页；6：电池溯源首页
		isWhichHome() {
			if(this.$store.state.permission.addRouters.length==0){//无任何权限
				return 1
			}

			let arr = this.$store.state.permission.addRouters.map((item)=>{
				if(
					item.name == 'transmitHome'
					|| item.name == 'carMonitorHome'
					|| item.name == 'diagnosisHome'
					|| item.name == 'carControlHome'
					|| item.name == 'batteryHome'
				){
					return item.name
				}
			}).filter(d=>d);
			if(arr.includes('transmitHome') && this.$store.state.user.sysSelected == "数据转发管理"){
				return 2;
			}else if(arr.includes('carMonitorHome') && this.$store.state.user.sysSelected == "远程监控服务"){
				return 3;
			}else if(arr.includes('diagnosisHome') && this.$store.state.user.sysSelected == "远程诊断服务"){
				return 4;
			}else if(arr.includes('carControlHome') && this.$store.state.user.sysSelected == "远程控制服务"){
				return 5;
			}else if(arr.includes('batteryHome') && this.$store.state.user.sysSelected == "电池溯源服务"){
				return 6;
			}else{
				return 1;
			}
			
		},
	},
};
</script>

<style lang="scss" scoped>
.home {
	background: #fff;
	width: 100%;
	max-height: 100%;
	min-height: 100%;
	// padding-top: 6vh;
	padding-top: 8vh;
	border-radius: 4px;
	.top{	
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.title{
		width: 800px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		// background: url(../../assets/images/img_xian.png) no-repeat center;
		// background-size: 60% auto;
		.text{
     font-size: 20px;
		//  width: 500px;
		 text-align: center;
			&::before{
				content: '';
				display: inline-block;
				width: 145px;
				height: 1px;
				background: url(../../assets/images/img_xian_left.png) no-repeat center;
				position: relative;
				top: -6px;
				right: 16px;
			}
			&::after{
				content: '';
				display: inline-block;
				width: 145px;
				height: 1px;
				background: url(../../assets/images/img_xian_right.png) no-repeat center;
				position: relative;
				top: -6px;
				left: 16px;
			}
		}
	}
	.imgBox {
		width: 100%;
		// width: 50.63vw;
		height: calc(92vh - 180px);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.imgPicture{
		// width: 40.63vw;
		// height: 62vh;
		width: 113.69vh;
		height: 50vh;
	}
}
</style>
