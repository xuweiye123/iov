<template>
	<app-drawer
		:visibles="visibles"
		:title="!isEdit ? '新增地理围栏' : '编辑地理围栏'"
		width="60%"
		@close-drawer="closeDrawer"
		@ok-drawer="submitForm"
		:isOkButLoading="loading"
	>
		<div slot="drawerContent">
			<el-form
				ref="formCenter"
				:rules="rules"
				:model="formInfo"
				:label-position="'right'"
				label-width="110px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="报警名称：" prop="geofenceRulesName">
							<el-input
								v-model.trim="formInfo.geofenceRulesName"
								clearable
								placeholder="请输入报警名称"
								maxlength="50"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="报警类型：" prop="alarmType">
							<el-radio-group
								v-model="formInfo.alarmType"
								@change="alarmTypeUpdate"
							>
								<el-radio :label="0">
									驶出
								</el-radio>
								<el-radio :label="1">
									驶入
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="规则类型：" prop="rulesType">
							<el-radio-group
								v-model="formInfo.rulesType"
								@change="rulesTypeUpdate"
							>
								<el-radio :label="0">
									行政区域
								</el-radio>
								<el-radio :label="1">
									多边形
								</el-radio>
								<el-radio :label="2">
									圆形
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="alarmTypeVisible">
						<el-form-item label="车速阈值：">
							<el-input
								v-model.trim="formInfo.maxSpeed"
								clearable
								placeholder="请输入车速阈值"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述：">
							<el-input
								v-model.trim="formInfo.remark"
								:rows="6"
								:autosize="{ minRows: 3, maxRows: 6 }"
								resize="none"
								type="textarea"
								placeholder="请输入描述"
								:maxlength="200"
								show-word-limit
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div
				v-loading="listLoading"
				class="amap"
				:class="isMoven ? 'all-moven-box' : ''"
			>
				<div v-show="!isMoven" class="all-moven" @click="isMoven = true">
					<svg-icon icon-class="allmoven" />
				</div>
				<div v-show="isMoven" class="all-moven moven2" @click="isMoven = false">
					<svg-icon icon-class="allmoven" />
				</div>
				<el-amap vid="realtime-map" :events="events" />
				<div class="map-citypicker">
					<div v-show="!isCityPicker" class="map-search">
						<input
							id="tipinput"
							v-model="tipinputValue"
							placeholder="请输入关键字"
							class="tipinput"
							AUTOCOMPLETE="OFF"
						/>
					</div>
					<div v-show="isCityPicker" class="city-select-style">
						<app-city-picker
							ref="cityPicker"
							:is-data="visibles"
							:default-city="stationArrDefault"
							@change="pickerChange"
						/>
					</div>
				</div>
				<div v-show="!isCityPicker" class="edit-card">
					<el-button
						id="starEdit"
						v-waves
						type="primary"
						@click.native="noValue"
					>
						开始编辑
					</el-button>
					<el-button id="endEdit" v-waves type="primary">
						结束编辑
					</el-button>
				</div>
			</div>
		</div>
	</app-drawer>
</template>
<script
	type="text/javascript"
	src="https://webapi.amap.com/maps?v=1.4.15&key=0c374ebcca85b3e213e7eec7b838dee9&plugin=AMap.DistrictSearch"
></script>
<script>
// 高德地图版本
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import { addHandle, updateHandle } from "@/api/carMonitorSys/geofencingManage";
// 组件
import appCityPicker from "./appCityPicker";
export default {
	name: "addUpdateDrawer",
	mixins: [partialForm, checkFormRule],
	components: { appCityPicker },
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		isEdit: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => [],
		},
	},
	data() {
		const self = this;
		return {
			alarmTypeVisible: false,
			loading: false,
			formInfo: {
				rulesType: 0,
				alarmType: "",
				geofenceRulesName: "",
				remark: "",
				maxSpeed: "",
			},
			tipinputValue: "",
			contacttypeList: [
				{ text: "单位联系人", value: 2 },
				{ text: "用车人", value: 3 },
			],
			contractcompanyList: [],
			terminalVisbles: false,
			tableRow: {},
			rules: {
				geofenceRulesName: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请输入报警名称",
						formObjName: "formInfo",
					},
				],
				rulesType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择规则类型",
						formObjName: "formInfo",
					},
				],
				alarmType: [
					{
						required: true,
						trigger: ["blur", "change"],
						validator: this.validInput,
						tips: "请选择报警类型",
						formObjName: "formInfo",
					},
				],
			},
			listLoading: false,
			stationArr: [], // 省市区
			stationArrDefault: [],
			isCityPicker: true,
			// 高德地图
			isMoven: false,
			districtRange: null,
			polygons: [],
			events: {
				init() {
					// const { center, zoom } = self
					self.map = new AMap.Map("realtime-map", {
						zoom: 15,
						center: [116.397428, 39.90923],
					});
					self.map.setMapStyle("amap://styles/normal");
					//编辑初始化
					if (self.isEdit) {
						if (self.formInfo.rulesType === 0) {
							if (self.formInfo.area) {
								const area = JSON.parse(self.formInfo.area);
								self.drawBounds(area[0][0], area[0][1]);
							}
						}
						const rtArry = self.data.rulesParameter.split(";");
						if (self.data.rulesType === 2) {
							//圆形
							const circleobj = rtArry[0].split(",");
							var circle = new AMap.Circle({
								center: new AMap.LngLat(
									parseFloat(circleobj[0]),
									parseFloat(circleobj[1])
								),
								radius: rtArry[1], // 半径
								strokeColor: "#ff0000",
								strokeOpacity: 1,
								strokeWeight: 2,
								fillOpacity: 0.3,
								fillColor: "#ff0000",
								zIndex: 50,
							});
							self.map.add(circle);
							// 缩放地图到合适的视野级别
							self.map.setFitView([circle]);
							var zoomcircle = self.map.getZoom();
							self.map.setZoom(zoomcircle - 0.5);
							self.rulesParameter = self.data.rulesParameter;
							var circleEditor = new AMap.CircleEditor(self.map, circle);
							// 事件绑定
							document.querySelector("#starEdit").onclick = function() {
								circleEditor.open();
							};
							// 事件绑定
							document.querySelector("#endEdit").onclick = function() {
								circleEditor.close();
							};
							// 编辑结束
							circleEditor.on("end", function(event) {
								var lvglat =
									self.map.getAllOverlays("circle")[0].De.center.lng +
									"," +
									self.map.getAllOverlays("circle")[0].De.center.lat +
									";";
								self.rulesParameter =
									lvglat + self.map.getAllOverlays("circle")[0].De.radius;
							});
						} else if (self.data.rulesType === 1) {
							//多边形
							var pathPoly = [];
							for (var i = 0; i < rtArry.length; i++) {
								const obj = rtArry[i].split(",");
								pathPoly.push(
									new AMap.LngLat(parseFloat(obj[0]), parseFloat(obj[1]))
								);
							}
							var polygon = new AMap.Polygon({
								path: pathPoly,
								strokeColor: "#ff0000",
								strokeOpacity: 1,
								strokeWeight: 2,
								fillOpacity: 0.3,
								fillColor: "#ff0000",
								zIndex: 50,
								draggable: true,
							});
							self.map.add(polygon);
							// 缩放地图到合适的视野级别
							self.map.setFitView([polygon]);
							var zoompolygon = self.map.getZoom();
							self.map.setZoom(zoompolygon - 0.5);
							var polyEditor = new AMap.PolyEditor(self.map, polygon);
							// 事件绑定
							document.querySelector("#starEdit").onclick = function() {
								polyEditor.open();
							};
							// 事件绑定
							document.querySelector("#endEdit").onclick = function() {
								polyEditor.close();
							};
							// 编辑结束
							polyEditor.on("end", function(event) {
								var pathAll = self.map.getAllOverlays("polygon")[0].De.path;
								const rulesParameter = [];
								for (var k = 0; k < pathAll.length; k++) {
									var obj = [pathAll[k].lng, pathAll[k].lat];
									rulesParameter.push(obj);
								}
								// 获取边际点经纬度
								self.rulesParameter = rulesParameter.join(";");
							});
						}
					}

					// 输入提示
					var autoOptions = {
						input: "tipinput",
					};
					var auto = new AMap.Autocomplete(autoOptions);
					var placeSearch = new AMap.PlaceSearch({
						map: self.map,
					}); // 构造地点查询类
					console.log(1111, autoOptions);
					AMap.event.addListener(auto, "select", select); // 注册监听，当选中某条记录时会触发
					function select(e) {
						placeSearch.setCity(e.poi.adcode);
						placeSearch.search(e.poi.name, function(status, result) {
							// 搜索成功时，result即是对应的匹配数据
							if (self.formInfo.rulesType === 2) {
								// 圆形
								var circle = new AMap.Circle({
									center: [
										result.poiList.pois[0].location.lng,
										result.poiList.pois[0].location.lat,
									],
									radius: 1000, // 半径
									strokeColor: "#ff0000",
									strokeOpacity: 1,
									strokeWeight: 2,
									fillOpacity: 0.3,
									fillColor: "#ff0000",
									zIndex: 50,
								});
								circle.setMap(self.map);
								// 缩放地图到合适的视野级别
								self.map.setFitView([circle]);
								var zoomcircle = self.map.getZoom();
								self.map.setZoom(zoomcircle - 0.5);
								self.rulesParameter =
									result.poiList.pois[0].location.lng +
									"," +
									result.poiList.pois[0].location.lat +
									";1000";
								var circleEditor = new AMap.CircleEditor(self.map, circle);
								// 事件绑定
								document.querySelector("#starEdit").onclick = function() {
									circleEditor.open();
								};
								// 事件绑定
								document.querySelector("#endEdit").onclick = function() {
									circleEditor.close();
								};
								// 编辑结束
								circleEditor.on("end", function(event) {
									console.log(self.map.getAllOverlays("circle"), "231111");
									var lvglat =
										self.map.getAllOverlays("circle")[0].De.center.lng +
										"," +
										self.map.getAllOverlays("circle")[0].De.center.lat +
										";";
									self.rulesParameter =
										lvglat + self.map.getAllOverlays("circle")[0].De.radius;
								});
							} else if (self.formInfo.rulesType === 1) {
								// 多边形
								var lnglat = new AMap.LngLat(
									result.poiList.pois[0].location.lng,
									result.poiList.pois[0].location.lat
								); // lng, lat 替换成传入的坐标
								var address1 = lnglat.offset(-3000, 0);
								var address2 = lnglat.offset(-3000, 3000);
								var address3 = lnglat.offset(0, 3000);
								var address4 = lnglat.offset(3000, 3000);
								var address5 = lnglat.offset(3000, 0);
								var address6 = lnglat.offset(3000, -3000);
								var address7 = lnglat.offset(0, -3000);
								var address8 = lnglat.offset(-3000, -3000);
								var path = [
									[address1.lng, address1.lat],
									[address2.lng, address2.lat],
									[address3.lng, address3.lat],
									[address4.lng, address4.lat],
									[address5.lng, address5.lat],
									[address6.lng, address6.lat],
									[address7.lng, address7.lat],
									[address8.lng, address8.lat],
								];
								self.rulesParameter = path.join(";");
								var polygon = new AMap.Polygon({
									path: path,
									strokeColor: "#ff0000",
									strokeOpacity: 1,
									strokeWeight: 2,
									fillOpacity: 0.3,
									fillColor: "#ff0000",
									zIndex: 50,
									draggable: true,
								});

								self.map.add(polygon);
								// 缩放地图到合适的视野级别
								self.map.setFitView([polygon]);
								var zoompolygon = self.map.getZoom();
								self.map.setZoom(zoompolygon - 0.5);
								var polyEditor = new AMap.PolyEditor(self.map, polygon);
								// 事件绑定
								document.querySelector("#starEdit").onclick = function() {
									polyEditor.open();
								};
								// 事件绑定
								document.querySelector("#endEdit").onclick = function() {
									polyEditor.close();
								};
								// 编辑结束
								polyEditor.on("end", function(event) {
									var pathAll = self.map.getAllOverlays("polygon")[0].De.path;
									const rulesParameter = [];
									for (var k = 0; k < pathAll.length; k++) {
										var obj = [pathAll[k].lng, pathAll[k].lat];
										rulesParameter.push(obj);
									}
									// 获取边际点经纬度
									self.rulesParameter = rulesParameter.join(";");
								});
							}
						});
					}
				},
			},
			rulesParameter: "",
		};
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					if (this.isEdit) {
						this.formInfo = { ...this.data };
						this.rulesParameter = this.formInfo.rulesParameter;
						this.stationArrDefault = [];
						if (this.formInfo.area) {
							const area = JSON.parse(this.formInfo.area);
							this.stationArrDefault = area[1];
						}
						if (this.formInfo.rulesType === 0) {
							this.isCityPicker = true;
						} else {
							this.isCityPicker = false;
						}
					} else {
						this.formInfo = {
							rulesType: 0,
							alarmType: "",
							geofenceRulesName: "",
							remark: "",
							maxSpeed: "",
						};
						this.rulesParameter = "";
						this.listLoading = false;
						this.alarmTypeVisible = false;
						this.isCityPicker = true;
						this.stationArr = [];
						this.tipinputValue = "";
					}
				}
			},
		},
	},
	created() {},
	methods: {
		noValue() {
			if (!this.tipinputValue && !this.isEdit) {
				this.$message.warning("请输入关键字");
			}
		},
		// 关闭dialog
		closeDrawer() {
			(this.formInfo = {
				rulesType: 0,
				alarmType: "",
				geofenceRulesName: "",
				remark: "",
				maxSpeed: "",
			}),
				(this.stationArrDefault = []);
			this.$emit("update:visibles", false);
		},
		// 省市区联动
		pickerChange(e) {
			this.stationArr = e;
			// console.log(this.stationArr,"this.stationArr")
			if (this.stationArr && this.stationArr.length) {
				if (this.stationArr[0][1].indexOf("地区") > 0) {
					this.stationArr[0][1] = this.stationArr[0][1].replace(/地区/, "");
				}

				// console.log(this.stationArr[0][0], 222,this.stationArr[0][1]);
				this.drawBounds(this.stationArr[0][0], this.stationArr[0][1]);
			} else {
				this.drawBounds("", "");
			}
		},
		// 行政区划
		drawBounds(level, city) {
			this.districtRange = null;
			this.polygons = [];
			this.listLoading = true;
			const sel = this;
			// let districtRange = this.districtRange;
			let districtRange = self.districtRange;
			let polygons = this.polygons;
			// console.log("plugin",this.polygons,self.polygons,sel.polygons)
			const map = this.map;
			// 加载行政区划插件
			if (!districtRange) {
				// 实例化DistrictSearch
				var opts = {
					subdistrict: 0, // 获取边界不需要返回下级行政区
					extensions: "all", // 返回行政区边界坐标组等具体信息
					level: "district", // 查询行政级别为 区
				};
				map.plugin(["AMap.DistrictSearch"], function() {
					districtRange = new AMap.DistrictSearch(opts);
				});
			}
			// 行政区查询
			districtRange.setLevel(level);
			districtRange.search(city, function(status, result) {
				sel.listLoading = false;
				console.log(status);
				// map.remove(polygons)// 清除上次结果
				map.clearMap();
				polygons = [];
				console.log(result.districtList, "result.districtList");
				var bounds = result.districtList[0].boundaries;
				const rulesParameter = [];
				if (bounds) {
					for (var i = 0, l = bounds.length; i < l; i++) {
						// 生成行政区划polygon
						var polygon = new AMap.Polygon({
							strokeWeight: 1,
							path: bounds[i],
							fillOpacity: 0.4,
							fillColor: "#80d8ff",
							strokeColor: "#0091ea",
						});
						polygons.push(polygon);
						for (var k = 0; k < bounds[i].length; k++) {
							var obj = [bounds[i][k].lng, bounds[i][k].lat];
							rulesParameter.push(obj);
						}
					}
				}
				map.add(polygons);
				map.setFitView(polygons); // 视口自适应
				// 获取边际点经纬度
				sel.rulesParameter = rulesParameter.join(";");
			});
		},
		// 选择类型
		rulesTypeUpdate(val) {
			this.tipinputValue = "";
			this.rulesParameter = "";
			this.$refs.cityPicker.clearValue(true);
			this.map.clearMap();
			if (val === 0) {
				this.isCityPicker = true;
			} else {
				this.isCityPicker = false;
			}
		},
		// 选择阈值
		alarmTypeUpdate(val) {
			this.maxSpeed = "";
			if (val === 1) {
				this.alarmTypeVisible = true;
			} else {
				this.alarmTypeVisible = false;
			}
		},
		starEdit() {
			this.polyEditor.open();
		},
		endEdit() {
			this.polyEditor.close();
		},
		// 新增
		_Add(postData) {
			this.loading = true;
			addHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("add-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 编辑
		_Update(postData) {
			this.loading = true;
			updateHandle(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$emit("update-complete");
						this.closeDrawer();
					}
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 点击提交
		submitForm() {
			const formcenter = this.checkForm({
				formName: "formCenter",
				formList: ["geofenceRulesName", "alarmType", "rulesType"],
			});
			if (!formcenter) {
				return;
			}
			if (!this.rulesParameter) {
				this.$message.warning({
					message: "请设置地图范围",
					duration: 2 * 1000,
				});
				return;
			}
			const {
				geofenceRulesName,
				rulesType,
				alarmType,
				maxSpeed,
				remark,
			} = this.formInfo;
			const postData = {
				geofenceRulesName,
				rulesType,
				alarmType,
				maxSpeed,
				remark,
			};
			for (const k in postData) {
				if (postData[k] === undefined) {
					postData[k] = "";
				}
			}
			postData.rulesParameter = this.rulesParameter;
			postData.area = this.stationArr;
			if (!this.isEdit) {
				this._Add(postData);
			} else {
				postData.geofenceRulesId = this.data.geofenceRulesId;
				this._Update(postData);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.electricDialog {
	.el-form-item--mini.el-form-item,
	.el-form-item--small.el-form-item {
		margin-bottom: 10px;
	}
	.el-radio {
		margin-right: 10px;
	}
	.el-radio__label {
		padding-left: 5px;
	}
}
.amap {
	height: 48vh;
	width: 100%;
	margin-bottom: 10px;
	position: relative;
	.all-moven {
		position: absolute;
		left: 10px;
		top: 10px;
		z-index: 2222;
		cursor: pointer;
		svg {
			font-size: 20px !important;
		}
	}
	.moven2 {
		svg {
			font-size: 26px !important;
		}
	}
}
.all-moven-box {
	position: fixed;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 222;
}

.map-citypicker {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 60%;
}
// .amap-sug-result {
//   z-index: 2222222 !important;
// }
.map-search {
	text-align: right;
}
.tipinput {
	height: 32px;
	line-height: 32px;
	border: 1px solid #e0e5e7;
	border-radius: 4px;
	background: #fff;
	padding: 0 10px;
}
.edit-card {
	position: absolute;
	bottom: 10px;
	right: 10px;
	width: 98px;
	background: #fff;
	border-radius: 5px;
	padding: 10px;
	box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
	.el-button {
		margin: 5px 0 !important;
	}
}
</style>

<style lang="scss">
.amap-sug-result {
	z-index: 2222222 !important;
}
</style>
