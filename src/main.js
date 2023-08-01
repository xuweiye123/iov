// vue
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 获取用户权限
import "./permission";
// svg
import "./icons";
// element-ui
import "normalize.css/normalize.css";
import ElementUI from "element-ui";
import DonMessage from "@/utils/message";
import "element-ui/lib/theme-chalk/index.css";
//自定义的element UI loading样式
// import '@/styles/element_loading.scss'
// 用户信息缓存
import { getApp } from "./utils/lfStore";
// 样式
import "@/styles/index.scss";
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
// 语言切换
import i18n from "./lang";
// echarts
import * as echarts from "echarts";

Vue.prototype.$echarts = echarts;
// 水球图
import "echarts-liquidfill";
// 3d地区
import "echarts-gl";

import echartsDiagnosis from "@/directive/echarts/echarts.js";
// 自定义全局组件
import checkedFilter from "@/components/filterList";
import appAuthorizeButton from "@/components/authorizeBtn";
import appSearch from "@/components/search";
import appSearchButton from "@/components/searchButton";
import seachForm from "@/components/seachForm";
import vueLinetitle from "@/components/linetitle";
import vinSelect from "@/components/vinSelect";
import appTable from "@/components/appTable";
import appDialog from "@/components/appDialog";
import appDrawer from "@/components/appDrawer";
import appCommandBtn from "@/components/commandBtn";
import vinRolling from "@/components/vinRolling";

// 全局自定义指令
import waves from "@/directive/waves";
import elDragDialog from "@/directive/el-dragDialog";
import preventReClick from "@/directive/preventReClick";
import loadmore from "@/directive/loadmore";
import JsonViewer from "vue-json-viewer";
import clearTableIndex from "@/directive/clearTableIndex";

// 解决 vue-router.esm.js报错 Uncaught (in promise)问题
import VueRouter from "vue-router";

// 监听echarts窗口大小
import elementResizeDetectorMaker from "element-resize-detector";
Vue.prototype.$elementResizeDetectorMaker = elementResizeDetectorMaker();

// 全局变量
import global from "@/components/global";
Vue.prototype.GLOBAL = global;

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error);
};

Vue.use(ElementUI, {
	size: "small",
	i18n: (key, value) => i18n.t(key, value),
})
	.use(checkedFilter)
	.use(appAuthorizeButton)
	.use(appSearch)
	.use(appSearchButton)
	.use(seachForm)
	.use(appDialog)
	.use(appTable)
	.use(appDrawer)
	.use(waves)
	.use(elDragDialog)
	.use(vueLinetitle)
	.use(vinSelect)
	.use(preventReClick)
	.use(appCommandBtn)
	.use(echartsDiagnosis)
	.use(loadmore)
	.use(JsonViewer)
	.use(clearTableIndex)
	.use(vinRolling);
Vue.config.productionTip = false;
Vue.prototype.$message = new DonMessage();
getApp().then((data) => {
	if (data) {
		store.commit("setApp", data);
		i18n.locale = data.language;
	}
});

// 时间格式转换
(function() {
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, // month
			"d+": this.getDate(), // day
			"h+": this.getHours(), // hour
			"m+": this.getMinutes(), // minute
			"s+": this.getSeconds(), // second
			"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
			S: this.getMilliseconds(), // millisecond
		};
		if (/(y+)/.test(format)) {
			format = format.replace(
				RegExp.$1,
				(this.getFullYear() + "").substr(4 - RegExp.$1.length)
			);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(
					RegExp.$1,
					RegExp.$1.length == 1
						? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length)
				);
			}
		}
		return format;
	};
})(window);

// function doCovering(ElementUI) {
// 	// console.log(ElementUI,12345678);
// 	ElementUI.Slider.props.value = {
// 		type: [String, Number,Array]
// 	}
// 	// console.log(ElementUI,8654321,ElementUI.Slider.props.value);
// 	return ElementUI
// }
// doCovering(ElementUI)

// Vue全局过滤器
import * as filters from "./filters";

Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key]);
});

// 生产环境下关闭console
if (process.env.NODE_ENV === "production") {
	window.console = (function() {
		var c = {};
		c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
		return c;
	})();
}

import request from "./utils/request";
request({
	url: "/api/system/login/getUuapConfig",
	method: "get",
})
	.then(({ data }) => {
		if (data.code == 0) {
			let obj = data.data;
			//存储UUAP认证相关信息
			// localStorage.setItem("uuapAppKey", obj.uuapAppKey);
			// localStorage.setItem("uuapAuthUrl", obj.uuapAuthUrl);
			store.commit("setUuapAppKey", obj.uuapAppKey);
			store.commit("setUuapAuthUrl", obj.uuapAuthUrl);
		}
	})
	.finally(() => {
		window.vm = new Vue({
			router,
			store,
			i18n,
			render: (h) => h(App),
		}).$mount("#app");
	});

window.addEventListener("popstate", function() {
	if (window.vm._route.name == "fastEntry") {
		history.pushState(null, null, document.URL);
	}
});
