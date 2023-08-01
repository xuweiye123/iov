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
					<i class="iconfont icon-fullscreen" />
				</div>
				<div v-show="isMoven" class="all-moven moven2" @click="isMoven = false">
					<i class="iconfont icon-exit-fullscreen" />
				</div>
				<div id="realtimeMap" style="width:100%;height:100%;"></div>
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
				<div
					id="searchResultPanel"
					style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
				></div>
				<div v-show="!isCityPicker" class="edit-card">
					<el-button id="starEdit" v-waves type="primary" @click="noValue">
						开始编辑
					</el-button>
					<el-button id="endEdit" v-waves type="primary" @click="endEdit">
						结束编辑
					</el-button>
				</div>
			</div>
		</div>
	</app-drawer>
</template>
<script>
// 百度地图版本
import { BMapLoader } from "@/utils/bmapLoader";
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
		return {
			alarmTypeVisible: false,
			loading: false,
			formInfo: {
				rulesType: 0,
				alarmType: 0,
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
			isMoven: false,
			districtRange: null,
			rulesParameter: "",
			polyEditor: null,
			map: null,
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
							alarmType: 0,
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
					this.$nextTick(() => {
						this.initMap();
					});
				}
			},
		},
	},
	methods: {
		setPlace(myValue) {
			this.map.clearOverlays(); //清除地图上所有覆盖物
			let local = new BMapGL.LocalSearch(this.map, {
				//智能搜索
				onSearchComplete: () => {
					let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					if (this.formInfo.rulesType === 2) {
						//画圆
						this.polyEditor = new BMapGL.Circle(pp, 1000, {
							strokeColor: "#ff0000",
							strokeOpacity: 1,
							strokeWeight: 2,
							fillOpacity: 0.3,
							fillColor: "#ff0000",
							zIndex: 50,
						});
						this.map.addOverlay(this.polyEditor);
						//百度地图获取圆周上的点
						let pointArray = [];
						let radius = 1000; //圆的半径，单位米
						let count = 100; //圆周上的点的个数
						let d2r = Math.PI / 180.0; //角度转换成弧度
						let r2d = 180.0 / Math.PI; //弧度转换成角度
						let earthsradius = 6378137.0; //地球半径
						for (var i = 0; i < count; i++) {
							let theta = Math.PI * (i / (count / 2)); //计算当前点的角度
							let ex =
								pp.lng +
								((radius * Math.cos(theta)) /
									(Math.cos(pp.lat * d2r) * earthsradius)) *
									r2d; //计算当前点的经度
							let ey =
								pp.lat + ((radius * Math.sin(theta)) / earthsradius) * r2d; //计算当前点的纬度
							let p = new BMapGL.Point(ex, ey); //根据经纬度生成一个百度地图上的点
							pointArray.push(p); //将点添加到数组中
						}
						this.map.setViewport(pointArray); //调整视野
						//编辑结束后获取圆心和半径
						this.polyEditor.addEventListener("lineupdate", (e) => {
							this.rulesParameter =
								e.target.getCenter().lng +
								"," +
								e.target.getCenter().lat +
								";" +
								e.target.getRadius();
						});
					} else if (this.formInfo.rulesType === 1) {
						//画多边形
						this.polyEditor = new BMapGL.Polygon(
							[
								new BMapGL.Point(pp.lng - 0.01, pp.lat - 0.01),
								new BMapGL.Point(pp.lng + 0.01, pp.lat - 0.01),
								new BMapGL.Point(pp.lng + 0.01, pp.lat + 0.01),
								new BMapGL.Point(pp.lng - 0.01, pp.lat + 0.01),
							],
							{
								strokeColor: "#ff0000",
								strokeOpacity: 1,
								strokeWeight: 2,
								fillOpacity: 0.3,
								fillColor: "#ff0000",
								zIndex: 50,
							}
						);
						this.map.addOverlay(this.polyEditor);
						//百度地图获取多边形的点
						let pointArray = [];
						let pathStr = "";
						this.polyEditor.getPath().forEach((item) => {
							pointArray.push(item);
							pathStr += item.lng + "," + item.lat + ";";
						});
						this.rulesParameter = pathStr;
						this.map.setViewport(pointArray); //调整视野
						//编辑结束后获取多边形的点
						this.polyEditor.addEventListener("lineupdate", (e) => {
							let pathStr = "";
							e.target.getPath().forEach((item) => {
								pathStr += item.lng + "," + item.lat + ";";
							});
							this.rulesParameter = pathStr;
						});
					}
				},
			});
			local.search(myValue);
		},
		initMap() {
			// 地图初始化
			BMapLoader("XYGGuNFiNdrDDS3pedeGIjybxNgGAtjp")
				.then((BMapGL) => {
					this.map = new BMapGL.Map("realtimeMap");
					this.map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 15); // 初始化地图，中心点和缩放级别
					this.map.enableScrollWheelZoom(true);
					//编辑初始化
					if (this.isEdit) {
						if (this.formInfo.rulesType === 0) {
							if (this.formInfo.area) {
								const area = JSON.parse(this.formInfo.area);
								this.drawBounds(area[0][1]);
							}
						}
						let rtArry = this.data.rulesParameter.split(";");
						if (this.data.rulesType === 2) {
							//画圆
							const circleobj = rtArry[0].split(",");
							this.polyEditor = new BMapGL.Circle(
								new BMapGL.Point(
									parseFloat(circleobj[0]),
									parseFloat(circleobj[1])
								),
								rtArry[1],
								{
									strokeColor: "#ff0000",
									strokeOpacity: 1,
									strokeWeight: 2,
									fillOpacity: 0.3,
									fillColor: "#ff0000",
									zIndex: 50,
								}
							);
							this.map.addOverlay(this.polyEditor);
							//百度地图获取圆周上的点
							let pointArray = [];
							let radius = 1000; //圆的半径，单位米
							let count = 100; //圆周上的点的个数
							let d2r = Math.PI / 180.0; //角度转换成弧度
							let r2d = 180.0 / Math.PI; //弧度转换成角度
							let earthsradius = 6378137.0; //地球半径
							let pp = this.polyEditor.getCenter();
							for (var i = 0; i < count; i++) {
								let theta = Math.PI * (i / (count / 2)); //计算当前点的角度
								let ex =
									pp.lng +
									((radius * Math.cos(theta)) /
										(Math.cos(pp.lat * d2r) * earthsradius)) *
										r2d; //计算当前点的经度
								let ey =
									pp.lat + ((radius * Math.sin(theta)) / earthsradius) * r2d; //计算当前点的纬度
								let p = new BMapGL.Point(ex, ey); //根据经纬度生成一个百度地图上的点
								pointArray.push(p); //将点添加到数组中
							}
							this.map.setViewport(pointArray); //调整视野
							//编辑结束后获取圆心和半径
							this.polyEditor.addEventListener("lineupdate", (e) => {
								this.rulesParameter =
									e.target.getCenter().lng +
									"," +
									e.target.getCenter().lat +
									";" +
									e.target.getRadius();
							});
						} else if (this.data.rulesType === 1) {
							//画多边形
							let pointArray = [];
							rtArry.forEach((item) => {
								const point = item.split(",");
								if (point[0] && point[1]) {
									pointArray.push(
										new BMapGL.Point(parseFloat(point[0]), parseFloat(point[1]))
									);
								}
							});
							this.polyEditor = new BMapGL.Polygon(pointArray, {
								strokeColor: "#ff0000",
								strokeOpacity: 1,
								strokeWeight: 2,
								fillOpacity: 0.3,
								fillColor: "#ff0000",
								zIndex: 50,
							});
							this.map.addOverlay(this.polyEditor);
							//获取多边形的点
							let pathStr = "";
							pointArray.forEach((item) => {
								pathStr += item.lng + "," + item.lat + ";";
							});
							this.rulesParameter = pathStr;
							this.map.setViewport(pointArray); //调整视野
							//编辑结束后获取多边形的点
							this.polyEditor.addEventListener("lineupdate", (e) => {
								let pathStr = "";
								e.target.getPath().forEach((item) => {
									pathStr += item.lng + "," + item.lat + ";";
								});
								this.rulesParameter = pathStr;
							});
						}
					}

					//百度地图输入提示
					let autoOptions = {
						input: "tipinput",
						location: this.map,
					};
					let auto = new BMapGL.Autocomplete(autoOptions);
					auto.addEventListener("onhighlight", function() {});
					auto.addEventListener("onconfirm", (e) => {
						let myValue;
						var _value = e.item.value;
						myValue =
							_value.province +
							_value.city +
							_value.district +
							_value.street +
							_value.business;
						this.setPlace(myValue);
					}); // 注册监听，当选中某条记录时会触发
				})
				.catch((e) => {
					console.error(e);
				});
		},
		noValue() {
			if (!this.tipinputValue && !this.isEdit) {
				this.$message.warning("请输入关键字");
				return;
			}
			this.starEdit();
		},
		// 关闭dialog
		closeDrawer() {
			this.formInfo = {
				rulesType: 0,
				alarmType: 0,
				geofenceRulesName: "",
				remark: "",
				maxSpeed: "",
			};
			this.stationArrDefault = [];
			this.$emit("update:visibles", false);
		},
		// 省市区联动
		pickerChange(e) {
			this.stationArr = e;
			if (this.stationArr && this.stationArr.length) {
				if (this.stationArr[0][1].indexOf("地区") > 0) {
					this.stationArr[0][1] = this.stationArr[0][1].replace(/地区/, "");
				}
				this.drawBounds(this.stationArr[0][1]);
			} else {
				this.drawBounds("");
			}
		},
		// 行政区划
		drawBounds(city) {
			this.districtRange = null;
			this.listLoading = true;
			let districtRange = this.districtRange;
			const map = this.map;
			// 加载行政区划插件
			if (!districtRange) {
				districtRange = new BMapGL.Boundary();
			}
			districtRange.get(city, (rs) => {
				//获取行政区域
				this.listLoading = false;
				map.clearOverlays(); //清除地图覆盖物
				let pointArray = [];
				let count = rs.boundaries.length; //行政区域的点有多少个
				if (count === 0) {
					this.$message.warning({
						message: "未能获取当前输入行政区域",
						duration: 2 * 1000,
					});
					return;
				}
				for (let i = 0; i < count; i++) {
					let ply = new BMapGL.Polygon(rs.boundaries[i], {
						strokeWeight: 2,
						strokeColor: "#ff0000",
					}); //建立多边形覆盖物
					map.addOverlay(ply); //添加覆盖物
					pointArray = pointArray.concat(ply.getPath()); //获取边界点
				}
				map.setViewport(pointArray); //调整视野
				// 获取所有边界点经纬度
				let pathStr = "";
				for (let i = 0; i < pointArray.length; i++) {
					pathStr += pointArray[i].lng + "," + pointArray[i].lat + ";";
				}
				this.rulesParameter = pathStr;
			});
		},
		// 选择类型
		rulesTypeUpdate(val) {
			this.tipinputValue = "";
			this.rulesParameter = "";
			this.$refs.cityPicker.clearValue(true);
			this.map.clearOverlays();
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
			this.polyEditor.enableEditing();
		},
		endEdit() {
			this.polyEditor.disableEditing();
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
	// width: 60%;
	z-index: 999;
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
	z-index: 999;
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
.tangram-suggestion-main {
	z-index: 2222222 !important;
	width: 100%;
	height: 200px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
