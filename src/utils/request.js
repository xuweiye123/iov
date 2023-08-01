import axios from "axios";
import downLoadExcel from "@/utils/downloadExcel";
// import { Message } from 'element-ui'
import DonMessage from "./message";
import store from "@/store";
import { setToken, getUserLanguage } from "./auth";
const Message = new DonMessage();
const service = axios.create({
	// baseURL: process.env.VUE_APP_BASEURL,
	timeout: 180 * 1000,
	isRetryRequest: false,
});
// 请求拦截
service.interceptors.request.use(
	(config) => {
		config.baseURL = store.getters.interfacePrefix;
		// if(config.url.includes('/terminal/debug/directory/')|| config.url.includes('/terminal/debug/download')){
		//   config.timeout = 1000 * 60 * 60 * 24
		// }
		// else {
		//   config.timeout =  60 * 1000
		// }
		// 用户，菜单接口请求tsp
		if (
			config.url.indexOf("/user/current/info") != -1 ||
			// config.url.indexOf("/user/current/passwordValidity") != -1 ||
			config.url.indexOf("/user/current/function") != -1 ||
			config.url.indexOf("/login/changedPwd") != -1 ||
			config.url.indexOf("/login/login") != -1 ||
			config.url.indexOf("/login/logout") != -1 ||
			config.url.indexOf("/dictionary/getDicValueByCode") != -1
		) {
			// config.baseURL = process.env.VUE_APP_BASEURL;
			config.baseURL = '/api/system';
		}

		// VIN下拉通用接口、通过vin码获取车型
		if (
			config.url.indexOf("/common/getComboxCarPageList") != -1 ||
			config.url.indexOf("/common/getComboxAllCarPageList") != -1 ||
			config.url.indexOf("/carType/getAllCarType") != -1 ||
			config.url.indexOf("/carType/getBatchByCarType") != -1
		) {
			config.baseURL = '/api/vehicle';
			// config.baseURL = process.env.VUE_APP_VEH;
		}

		// 车辆监控-首页-接口请求carMonitorSysHome
		if (
			config.url.indexOf("desktop/getHomePage") != -1 ||
			config.url.indexOf("desktop/getStaFault") != -1 ||
			config.url.indexOf("desktop/getStaTotal") != -1 ||
			config.url.indexOf("desktop/getStaCharge") != -1 ||
			config.url.indexOf("desktop/getStaCar") != -1
		) {
			config.baseURL = '/api/monitor';
			// config.baseURL = process.env.VUE_APP_MOI;
		}

		// 远程控制-首页-接口请求carControlSysHome
		if (
			config.url.indexOf("home/queryRemoteTypeSum") != -1 ||
			config.url.indexOf("home/queryControlSumToday") != -1 ||
			config.url.indexOf("home/getRemoteChannel") != -1 ||
			config.url.indexOf("home/queryRemoteCount") != -1
		) {
			config.baseURL = '/api/control';
			// config.baseURL = process.env.VUE_APP_CON;
		}
    // 电池溯源-首页-接口请求
		if (
			config.url.indexOf("home/getCarStatis") != -1 ||
			config.url.indexOf("home/getChangStatis") != -1 ||
			config.url.indexOf("home/getRetireStatis") != -1 ||
			config.url.indexOf("home/getRecycsStatis") != -1 ||
			config.url.indexOf("home/getModuleStatis") != -1
		) {
			config.baseURL = '/api/battery';
			// config.baseURL = process.env.VUE_APP_BAT;
		}
    // 转发-首页-接口请求
		if (
			config.url.indexOf("home/getStatisticsCount") != -1 ||
			config.url.indexOf("home/getForwardCar") != -1 ||
			config.url.indexOf("home/getStatisticsFlow") != -1 
		) {
			 config.baseURL = '/api/transmit';
			// config.baseURL = process.env.VUE_APP_TRA;
		}
    // 远程诊断-首页-接口请求
		if (
			config.url.indexOf("home/getDigTotalData") != -1 ||
			config.url.indexOf("home/getDigAnalysisData") != -1 ||
			config.url.indexOf("home/getDigTopData") != -1 
		) {
			config.baseURL = '/api/diagnosis';
			// config.baseURL = process.env.VUE_APP_DIS;
		}

		// console.log('接口前缀-config.baseURL',config.baseURL)
		// if (store.getters.system == "newEnergyPlatform") {
		// 	config.baseURL = process.env.VUE_APP_BJEVC;
		// }
		// if (store.getters.system == "sharesPlatform") {
		// 	config.headers["X-App-Code"] = "sysadmin";
		// 	config.baseURL = process.env.VUE_APP_BJEV;
		// }

		// console.log(111,config.baseURL)

		if (store.getters.token) {
			config.headers["Authorization"] = store.getters.token;
			// config.headers['Authorization'] = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHB0aW1lIjoxOTcxNjI5MjA1MDUwLCJjcmVhdGV0aW1lIjoxNjExNjI5MjA1MDUwLCJsb2dpbm5hbWUiOiJ3YW5neXV5YW5nIiwiZXhwIjoxOTcxNjI5MjA1LCJ1c2VyaWQiOiIxOTg0NzQ3NC0wOWYxLTRhNzMtOGIwYy01Mjg1YjFjNzVhM2QiLCJ1dWlkIjoiNDFjNzVhY2ItMWMzOC00NzZlLWExZWUtZGU0MzUzZGJiNDcxIiwidG9rZW50eXBlIjoiYWNjZXNzIn0.-mkzA3ZCrWthWKSHCi4vYY3wL9EVNW3tJ4BvSfdRJyw"
		}
		
		if(config.data && config.data.hasOwnProperty('vinNoTotal')){
			let data={...config.data}
			// console.log(data.vinNoTotal,11111111112)
			if(data.vinNoTotal && data.vinNo){
				data.vinNo=data.vinNoTotal
				delete data.vinNoTotal
			}
			if(data.vinNoTotal && data.vin){
				data.vin=data.vinNoTotal
				delete data.vinNoTotal
			}
			config.data = data
			// console.log(config.data,"config.data")
			if(config.data.hasOwnProperty('vinNoTotal')){
				delete config.data.vinNoTotal
			} 
		}
		
		// console.log(config,123,config.data)
		if (config.method === "get") {
			if(config.params && (config.params.hasOwnProperty('vinNoTotal') || config.params.timeRange || config.params.timeRange1)){
        let params = {...config.params}
				if(params.timeRange){
					delete params.timeRange
				}
				if(params.timeRange1){
					delete params.timeRange1
				}
				// console.log(params.vinNoTotal,params.vinNo,123)
				if(params.vinNoTotal && params.vinNo){
					params.vinNo=params.vinNoTotal
					delete params.vinNoTotal
					// console.log(params,112233)
				}
				if(params.vinNoTotal && params.vin){
					params.vin=params.vinNoTotal
					delete params.vinNoTotal
				}
				config.params = params
				
				if(config.params.hasOwnProperty('vinNoTotal')){
					delete config.params.vinNoTotal
				} 
			}

			config.headers["Content-Type"] = "application/x-www-form-urlencoded";
		} else {
			config.headers["Content-Type"] = "application/json";
		}
		config.headers["language"] = getUserLanguage();
		return config;
	},
	(error) => {
		Message.warning({
			message: vm.$t("request.outTime"),
			duration: 2 * 1000,
		});
		Promise.reject(error);
	}
);
// 响应拦截
service.interceptors.response.use(
	(response) => {
		const token = response.headers.authorization;
		// console.log(token,1234,response.headers)
		if (token) {
			store.commit("setToken", token);
			setToken(token);
		}
		// 下载excel
		if (response.config.responseType === "arraybuffer") {
			var buffers = response.data;
			var blob = new Blob([buffers], {
				type: "text/plain",
			});
			var reader = new FileReader();
			reader.readAsArrayBuffer(blob);
			// console.log(reader.result)
			// var buf = new Uint8Array(reader.result)
			// reader.readAsText(new Blob([buf]), 'utf-8')
			reader.onload = function() {
				if (
					typeof reader.result === "string" &&
					reader.result.indexOf("code") > -1
				) {
					// response.data = JSON.parse(reader.result)
					const res = JSON.parse(reader.result);
					Message.warning({
						message: res.message || vm.$t("request.downFail"),
						duration: 2 * 1000,
					});
				} else {
					if (response.status === 200 && response.data) {
						downLoadExcel(response);
					}
				}
			};
		}
		// 下载zip文件
		if (response.config.responseType === "blob") {
			const fileName = new Date().valueOf();
			/* 兼容ie内核，360浏览器的兼容模式 */
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				const blob = new Blob([response.data], { type: response.data.type });
				window.navigator.msSaveOrOpenBlob(blob, fileName);
			} else {
				/* 火狐谷歌的文件下载方式 */
				const blob = new Blob([response.data], { type: response.data.type });
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement("a"); // 创建a标签
				link.href = url;
				// link.download = fileName // 文件重命名，若无需重命名，将该行删去
				link.click();
				URL.revokeObjectURL(url); // 释放内存
			}
		}

		// code 0:表示成功 其他表示失败
		if (response.data.code === 0 || response.data.success) {
			return response;
		} else {
			response.data.message &&
				Message.warning({
					message: response.data.message,
					duration: 2 * 1000,
				});
			return response;
		}
	},
	(error) => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					if (localStorage.internalLogin == 1) {
						store.dispatch("logoutOffline");
					} else {
						store.dispatch("fedLogout").then(() => {
							location.reload();
						});
					}
					break;
				default:
					break;
			}
		}

		// Error: Request failed with status code 504
		// Message.warning({
		//   message: vm.$t('request.Network'),
		//   duration: 2 * 1000
		// })
		// 请求超时或者网络错误
		if (window.vm) {
			console.error(vm.$t("request.Network"));
			// window.vm.$router.push({ path: '/500' })
		}

		return Promise.reject(error);
	}
);

export default service;
