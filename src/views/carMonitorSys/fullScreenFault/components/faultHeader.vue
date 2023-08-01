<template>
	<div class="fault-header">
		<div :class="['header-logo', data.faultCount > 0 ? 'active' : '']">
			<div class="fault-light"></div>
			<img
				class="header-logo-img"
				src="../../../../assets/faultImage/icon_jrgz.png"
				alt=""
			/>
			<div class="header-logo-txt">今日故障警情</div>
		</div>
		<div class="header-statistics">
			<ul>
				<li class="header-statistics-item">
					<p class="number">{{ data.carCount || 0 }}</p>
					<p class="text">故障车辆数(辆)</p>
				</li>
				<li class="header-statistics-item">
					<p class="number">{{ data.faultCount || 0 }}</p>
					<p class="text">故障总数量</p>
				</li>
				<li class="header-statistics-item">
					<p class="number">{{ data.importantFaultCount || 0 }}</p>
					<p class="text">三级报警数量</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: "AppFaultHeader",
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
};
</script>
<style lang="scss" scoped>
.fault-header {
	height: 60px;
	position: relative;
	background:url(../../../../assets/faultImage/bg_top.png) no-repeat;
	background-size: 100% 100%;
	.header-logo {
		display: flex;
		position: absolute;
		left: 0;
		top: 0;
		color: #fff;
		&.active {
			.fault-light {
				animation-name: warn-flash;
			}
		}
		.fault-light {
			position: absolute;
			top: 34px;
			left: 28px;
			width: 0;
			// margin-left: 30px;
			border-radius: 50%;
			box-shadow: 0 0 0 0 #f00;
			animation-duration: 1s;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
		}
		.header-logo-img {
			margin: 16px;
			display: inline-block;
			width: 25px;
			height: 28px;
			float: left;
		}
		.header-logo-txt {
			margin-top: 5px;
			display: inline-block;
			font-size: 16px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 55px;
		}
	}
	.header-statistics {
		position: absolute;
		right: 0;
		top: 0;
		font-size: 14px;
		color: #fff;
		text-align: center;
		ul {
			margin: 0;
			li {
				position: relative;
				display: inline-block;
				width: 100px;
				height: 60px;

				p {
					margin: 0;
					font-size: 12px;
					&:nth-child(1) {
						margin-top: 12px;
						font-size: 18px !important;
					}
				}
			}
			.header-statistics-item {
				background-image: url("../../../../assets/faultImage/icon_gztb.png");
				background-repeat: no-repeat;
				background-position: 30px 15px;
				&:after {
					content: "";
					position: absolute;
					width: 1px;
					height: 35px;
					top: 12px;
					right: 1px;
					background-color: rgba(255, 255, 255, 0.2);
				}

				.number{
					font-family: Arial;
					font-weight: bold;
					color: #FFFFFF;
				}
				.text{
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #5C7C95;
					background: linear-gradient(0deg, #95F5A7 0%, #6ECDE6 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}
			.header-statistics-item:nth-child(2) {
				background-position: 30px -36px;
			}
			.header-statistics-item:nth-child(3) {
				background-position: 30px -85px;
				&:after {
					content: "";
					position: absolute;
					width: 0px;
					height: 35px;
					top: 12px;
					right: 1px;
					background-color: rgba(255, 255, 255, 0.2);
				}
			}
		}
	}
}
@keyframes warn-flash {
	0% {
		box-shadow: 0 0 0 0 #f00;
	}
	100% {
		box-shadow: 0 0 40px 26px #f00;
	}
}
</style>
