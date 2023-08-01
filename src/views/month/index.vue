<template>
	<div class="month-app">
		<header id="header" class="month-header">
			<img src="../../assets/month/logo.png" alt="" />
			<p class="header-title">
				{{ title }}
			</p>
			<div class="header-print" @click="print">
				打印报告
			</div>
		</header>
		<div
			v-for="(item, index) in pageConfigList"
			:id="item.keys"
			:key="index"
			:class="[
				'page',
				item.slide ? 'slide' : '',
				item.reverse ? 'reverse' : '',
				item.in ? 'in' : 'out',
			]"
		>
			<page1 v-if="item.keys === 'page1'" />
			<page2
				v-else-if="item.keys === 'page2'"
				:load="item.keys === 'page2' && item.load"
			/>
			<page3
				v-else-if="item.keys === 'page3'"
				:load="item.keys === 'page3' && item.load"
				@mouseenter1="mouseenter1"
				@mouseleave1="mouseleave1"
			/>
			<page4
				v-else-if="item.keys === 'page4'"
				:load="item.keys === 'page4' && item.load"
				@mouseenter1="mouseenter1"
				@mouseleave1="mouseleave1"
			/>
		 <page5
				v-else-if="item.keys === 'page5'"
				:load="item.keys === 'page5' && item.load"
				@mouseenter1="mouseenter1"
				@mouseleave1="mouseleave1"
			/>
			<!--	<page6
				v-else-if="item.keys === 'page6'"
				:load="item.keys === 'page6' && item.load"
				@mouseenter1="mouseenter1"
				@mouseleave1="mouseleave1"
			/> -->
		</div>
		<ul class="nav-ul">
			<li
				v-for="(item, index) in pageConfigList"
				:key="index"
				:class="[item.in ? 'active' : '', 'nav-list']"
				@click="switchPage(index)"
			/>
		</ul>
	</div>
</template>

<script>
import page1 from "./components/page1";
import page2 from "./components/page2";
import page3 from "./components/page3";
import page4 from "./components/page4";
import page5 from "./components/page5";
import { getTitleInfo, savePic, downMonthDoc } from "@/api/month/page1";
import { getMonth } from "@/api/month/page1";
import domtoimage from "../../utils/dom-to-image";
import { Loading } from "element-ui";
export default {
	name: "month",
	components: {
		page1,
		page2,
		page3,
		page4,
		page5
	},
	data() {
		return {
			dates: 0,
			beforePage: 0,
			title: "",
			timeBs: "",
			// downloadPDF: '',
			pageConfigList: [
				{
					reverse: false,
					slide: false,
					in: true,
					keys: "page1",
					load: true,
					pagemodule: "active",
				},
				{
					reverse: false,
					slide: false,
					in: false,
					keys: "page2",
					load: false,
					pagemodule: "charge",
				},
				{
					reverse: false,
					slide: false,
					in: false,
					keys: "page5",
					load: false,
					pagemodule: "charge",
				},
				{
					reverse: false,
					slide: false,
					in: false,
					keys: "page3",
					load: false,
					pagemodule: "fault",
				},
				{
					reverse: false,
					slide: false,
					in: false,
					keys: "page4",
					load: false,
					pagemodule: "cloud",
				},
				// { reverse: false, slide: false, in: false, keys: 'page7', load: false, pagemodule: 'carForward' }
			],
			fullscreenLoading: false,
			pagemoduleActive: "cloud", // 当前页
		};
	},
	mounted() {
		this.setUpMouseAndKeyboardMonitor();
		this.switchPage(0);
		this._getMonthTitle();
	},
	methods: {
		_getMonthTitle() {
			getMonth({ type: "Title" })
				.then(({ data }) => {
					if (data.code === 0) {
						this.title = data.data.title;
					}
				})
				.catch(() => {});
		},
		mouseenter1() {
			this.resetUpMouseAndKeyboardMonitor();
		},
		mouseleave1() {
			this.setUpMouseAndKeyboardMonitor();
		},
		//清除滚动事件
		resetUpMouseAndKeyboardMonitor() {
			if (document.addEventListener) {
				document.addEventListener("DOMMouseScroll", () => {}, false);
			}
			window.onmousewheel = () => {};
			document.onkeydown = () => {};
		},
		//添加滚动事件
		setUpMouseAndKeyboardMonitor() {
			if (document.addEventListener) {
				document.addEventListener(
					"DOMMouseScroll",
					this.throttle(this.scrollFunc),
					false
				);
			}
			window.onmousewheel = this.throttle(this.scrollFunc);
			document.onkeydown = (event) => {
				event = event || window.event;
				var c = event.keyCode;
				if (c == 40 || c == 32 || c == 39) {
					this.scrollUp();
				} else if (c == 38 || c == 37) {
					this.scrollDown();
				}
			};
		},
		throttle(fn, time = 200) {
			let timer = null;
			return function() {
				if (!timer) {
					timer = setTimeout(() => {
						fn.apply(this, arguments);
						timer = null;
					}, time);
				}
			};
		},
		scrollFunc(event) {
			event = event || window.event;
			event.delta = event.wheelDelta
				? event.wheelDelta / 120
				: -(event.detail || 0) / 3;

			if (event.delta < 0) {
				this.scrollUp();
			} else {
				this.scrollDown();
			}
		},
		scrollUp() {
			if (this.beforePage >= this.pageConfigList.length - 1) {
				return;
			} else {
				const index = this.beforePage + 1;
				this.switchPage(index);
			}
		},
		scrollDown() {
			if (this.beforePage < 1) {
				return;
			} else {
				const index = this.beforePage - 1;
				this.switchPage(index);
			}
		},
		switchPage(index) {
			// alert(index)
			// 点击相同不处理
			if (index == 0) {
				document.title = "新能源活跃情况";
			} else if (index == 1) {
				document.title = "充电数据统计";
			}else if (index == 2) {
				document.title = "换电数据统计";
			} else if (index == 3) {
				document.title = "转发数据统计";
			}else if (index == 4) {
				document.title = "电池溯源统计";
			}
			// else if(index==6){
			//   document.title='国地接入统计'
			// }
			if (index === this.beforePage) {
				return;
			}
			// 从上到下
			else if (index > this.beforePage) {
				for (let i = 0; i < this.pageConfigList.length; i++) {
					let { reverse, slide, keys, load, pagemodule } = this.pageConfigList[
						i
					];
					if (index === i) {
						!load && (load = true);
						this.$set(this.pageConfigList, i, {
							reverse: false,
							slide: true,
							in: true,
							keys,
							load,
							pagemodule,
						});
					} else {
						if (i == this.beforePage) {
							this.$set(this.pageConfigList, i, {
								reverse: false,
								slide: true,
								in: false,
								keys,
								load,
								pagemodule,
							});
						} else {
							this.$set(this.pageConfigList, i, {
								reverse,
								slide,
								in: false,
								keys,
								load,
								pagemodule,
							});
						}
					}
				}
				// console.log(JSON.stringify(this.pageConfigList))
			} else {
				// 反之
				for (let i = 0; i < this.pageConfigList.length; i++) {
					let { keys, load, pagemodule } = this.pageConfigList[i];
					!load && (load = true);
					if (index === i) {
						this.$set(this.pageConfigList, i, {
							reverse: true,
							slide: true,
							in: true,
							keys,
							load,
							pagemodule,
						});
					} else {
						if (i == this.beforePage) {
							this.$set(this.pageConfigList, i, {
								reverse: true,
								slide: true,
								in: false,
								keys,
								load,
								pagemodule,
							});
						}
					}
				}
			}
			this.beforePage = index;
		},
		print() {
			this.fullscreenLoading = Loading.service({
				text: "打印中，请勿执行其他操作...",
				background: "rgba(0,0,0,.5)",
			});
			this.timeBs = this.guid();
			this.switchPage(0);
			const self = this;
			setTimeout(function() {
				self.getImage(0);
			}, 2000);
		},
		guid() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
				c
			) {
				var r = (Math.random() * 16) | 0;
				var v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		},
		getImage(index) {
			const self = this;
			index++;
			if (index > self.pageConfigList.length) {
				self.fullscreenLoading.close();
				return false;
			}
			var moduleName = self.pageConfigList[index - 1].pagemodule;
			const header = document.getElementById("header");
			const doc = document.getElementById(`page${index}`); // 此处重新设置
			const promise1 = domtoimage.toPng(doc);
			const promise2 = domtoimage.toPng(header);
			promise1.then((imgData1) => {
				promise2.then((imgData2) => {
					const img1 = new Image();
					img1.onload = () => {
						const img2 = new Image();
						img2.onload = () => {
							const bg = new Image();
							bg.src = require("../../assets/month/bg.png");
							const canvas = document.createElement("canvas");
							const context = canvas.getContext("2d");
							// canvas.width = img1.width;
							// canvas.height = img1.height;
							canvas.width = 1920;
							canvas.height = 1080;
							bg.onload = () => {
								const swidth = bg.width;
								let sheight = (bg.width * img1.height) / img1.width;
								if (sheight > bg.height) {
									sheight = bg.height;
								}
								context.drawImage(
									bg,
									0,
									0,
									1920,
									1080,
									// swidth,
									// sheight,
									0,
									0,
									1920,
									1080,
									// img1.width,
									// img1.height
								);
								// context.drawImage(img2, 0, 0);
								// context.drawImage(img1, 0, 0);
								context.drawImage(img2, 0, 0,1920,97.2);
                context.drawImage(img1, 0, 0,1920,1080);
								document.body.appendChild(canvas);
								const dataUrl = canvas.toDataURL();
								document.body.removeChild(canvas);
								const img = new Image();
								img.src = dataUrl;
								// 调试代码，传给后端只需每次传入src即可
								// let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
								// window.location.href=image;
								// 页面只需要切换5次，打印需要6次阻断最有一次自动跳转
								index < self.pageConfigList.length && self.switchPage(index);
								setTimeout(() => {
									return self.getImage(index);
								}, 2000);
								// 发送
								var dataSend = {
									timeBs: self.timeBs,
									url: dataUrl,
									name: moduleName,
								};
								savePic(dataSend).then(data => {
								  if (data.code === 0) {
								    if (index === self.pageConfigList.length) {
								      const datasend = {
								        timeBs: self.timeBs,
								        downType: 'pdf',
								        docData: ''
								      }
								      self.docLoad(datasend)
								    }
								  }
								})
							};
						};
						img2.src = imgData2;
					};
					img1.src = imgData1;
				});
			});
		},
		docLoad(datasend) {
			downMonthDoc(datasend).then(data => {
			  if (data.data.pdf != '') {
			    // window.open('/file/' + data.data.pdf)
			    location.href= '/file/' + data.data.pdf
			  }else if (data.data.doc != '') {
			      //window.open('/file/' + data.data.doc)
			    location.href = '/file/' + data.data.doc
			  }
			})
		},
	},
};
</script>

<style lang="scss" scoped>
.month-app {
	height: 100vh;
	overflow: hidden;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	box-sizing: border-box;
	position: relative;
	background: #001229 url("../../assets/month/bg.png") no-repeat center top;
	background-size: cover;
	// background: radial-gradient(
	//   at 100% 0,
	//   #001229 0%,
	//   #00425f 25%,
	//   #001229 100%
	// );
	header {
		height: 9vh;
		background: url("../../assets/month/top-bg.png") no-repeat center top;
		background-size: cover;
		padding: 0 30px;
		img {
			height: 4vh;
			margin-top: 1vh;
		}
		.header-title {
			color: #fff;
			z-index: 99999;
			margin-left: -114px;
			left: 50%;
			top: 0;
			position: absolute;
			line-height: 7vh;
			font-size: 20px;
		}
		.header-print {
			color: #4EA5FF;
			z-index: 99999;
			right: 30px;
			top: 1.5vh;
			position: absolute;
			cursor: pointer;
			padding: 5px 5px 5px 25px;
			background: rgba(13,62,178,0.3) url("../../assets/images/dayin.png") no-repeat 5px
				center;
			border: 1px solid #1854BC;
		}
		.header-print:hover {
			background: #064573 url("../../assets/images/dayin_hover.png") no-repeat
				5px center;
			color: #fff;
		}
	}
	.page {
		height: 100%;
		width: 100%;
		// padding: 50px;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		background: transparent;
	}
	.nav-ul {
		list-style: none;
		// pointer-events: none;
		transform: translateY(-50%);
		z-index: 99999;
		margin-left: -24px;
		left: 50%;
		top: 7vh;
		position: absolute;
		li {
			width: 6px;
			height: 6px;
			opacity: 0.16;
			background: #d2f1ff;
			display: inline-block;
			margin: 3px;
			border-radius: 50%;
			background-color: #cacaca;
			cursor: pointer;
			&.active {
				opacity: 1;
			}
		}
	}
}

// 动画代码
.out {
	// display: none
	// top: 100% !important;
	transform: translateY(100%);
}

.in,
.out {
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.in {
	-webkit-animation-timing-function: ease-out;
	-webkit-animation-duration: 300ms;
	animation-timing-function: ease-out;
	animation-duration: 300ms;
}
.out {
	-webkit-animation-timing-function: ease-in;
	-webkit-animation-duration: 300ms;
	animation-timing-function: ease-in;
	animation-duration: 300ms;
}
/* slide */
.slide.in {
	-webkit-animation-name: slideinfrombottom;
	animation-name: slideinfrombottom;
}
.slide.out {
	-webkit-animation-name: slideouttotop;
	animation-name: slideouttotop;
}
.slide.in.reverse {
	-webkit-animation-name: slideinfromtop;
	animation-name: slideinfromtop;
}
.slide.out.reverse {
	-webkit-animation-name: slideouttobottom;
	animation-name: slideouttobottom;
}
.is-fullscreen .el-loading-text {
	font-size: 24px !important;
	color: #fff;
}
.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
	width: 80px;
	height: 80px;
}
.el-loading-mask.is-fullscreen .el-loading-spinner .path {
	stroke: #fff;
}
@-webkit-keyframes slideinfrombottom {
	from {
		-webkit-transform: translateY(100%);
	}
	to {
		-webkit-transform: translateY(0);
	}
}
@keyframes slideinfrombottom {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}
@-webkit-keyframes slideouttotop {
	from {
		-webkit-transform: translateY(0);
	}
	to {
		-webkit-transform: translateY(-100%);
	}
}
@keyframes slideouttotop {
	from {
		transform: translateY(0);
	}
	to {
		transform: translateY(-100%);
	}
}
@-webkit-keyframes slideinfromtop {
	from {
		-webkit-transform: translateY(-100%);
	}
	to {
		-webkit-transform: translateY(0);
	}
}
@keyframes slideinfromtop {
	from {
		transform: translateY(-100%);
	}
	to {
		transform: translateY(0);
	}
}
@-webkit-keyframes slideouttobottom {
	from {
		-webkit-transform: translateY(0);
	}
	to {
		-webkit-transform: translateY(100%);
	}
}
@keyframes slideouttobottom {
	from {
		-webkit-transform: translateY(0);
	}
	to {
		-webkit-transform: translateY(100%);
	}
}
</style>
