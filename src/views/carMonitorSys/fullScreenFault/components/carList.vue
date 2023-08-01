<template>
	<div class="car-list" v-show="visibles">
		<div class="car-list-header">
			<span style="margin-left:10px">报警车辆</span>
			<i style="cursor: pointer;" @click="close" class="el-icon-close"></i>
		</div>
		<!--查询 -->
		<div style="padding: 15px 10px 5px 10px;">
			<div style="width:100%;position:relative;">
				<el-input
					size="small"
					placeholder="请输入内容"
					clearable
					v-model="query"
					@input="inputChange"
					@focus="inputFocus"
					@blur="inputBlur"
				>
					<el-button v-waves size="small" @click="handleSearch" slot="append"
					 class="searchButton"
						>
						<i style="color:#fff;font-size:14px;" class="el-icon-search"></i>
						</el-button
					>
				</el-input>
				<div class="select-list" v-show="showSelect">
					<div class="select-item" @mousedown="selectType(arguments[0], 1)">
						&nbsp;&emsp;VIN码：<span>{{ query }}</span>
					</div>
					<div class="select-item" @mousedown="selectType(arguments[0], 2)">
						车牌号码：<span>{{ query }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 选项卡 -->
		<div class="car-list-tab">
			<ul class="car-list-tab-ul">
				<li
					v-for="(item, index) in leftList"
					:key="index"
					@click="selectCarType(item)"
					:class="[item.isSelect ? 'active' : '']"
				>
					{{ item.label }}
				</li>
			</ul>
			<ul class="car-list-tab-button">
				<li
					v-for="(item, index) in rightList"
					:key="index"
					@click="selectVinLisplate(item)"
					:class="[item.isSelect ? 'active' : '']"
				>
					{{ item.label }}
				</li>
			</ul>
		</div>
		<div class="car-list-content">
			<el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
				<el-tree
					ref="tree"
					:data="treeList"
					:expand-on-click-node="false"
					:default-expanded-keys="defaultCheckedKeys"
					@node-expand="expandTree"
					node-key="id"
					:indent="10"
				>
					<div class="custom-region" style="flex:1" slot-scope="{ data }">
						<div class="custom-img">
							<span v-if="data.name" class="tree-span"
								>{{ data.name }}:&nbsp;{{ data.total }}</span
							>
							<span v-if="data.vinNo" class="tree-span">
								<i
									:class="[
										'i-icon-car-state',
										data.isOnline == 1 ? 'i-icon-car-state-isOnline' : '',
									]"
								></i>
								<span @click="clickCar(data)" style="margin-left:3px;"
									>{{ isVinNo === 2 ? data.vinNo : data.licensePlate }}
									<span>{{ `(${data.faultCount})` }}</span>
								</span>
							</span>
							<span
								v-if="data.moreText"
								@click="getMoreData(data)"
								class="tree-span"
							>
								<span v-if="!data.isLoading">{{ data.moreText }}</span>
								<i v-else class="el-icon-loading" style="font-size:16px"></i>
							</span>
						</div>
					</div>
				</el-tree>
			</el-scrollbar>
		</div>
	</div>
</template>

<script>
let id = 10000;
import { transformData, transfromCarTypeData } from "@/utils/base";
import {
	getCityFaultCarCountList,
	getCarTypeFaultCountList,
	getCar,
} from "@/api/carMonitorSys/fullscreenFault";
export default {
	name: "carList",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				if (this.treeList.length === 0) {
					let postData = {
						vinNo: "",
						licensePlate: "",
					};
					this._getCityFaultCarCountList(postData);
				}
			}
		},
		query(e1) {
			if (e1.length < 1) {
				this.listQuery.query = "";
			}
		}
	},
	data() {
		return {
			treeList: [],
			first: null,
			defaultCheckedKeys: [],
			query: "",
			queryType: 1,
			listQuery: {
				query: "",
				queryType: 1, // 1 VIN码 2 车牌号码
			},
			showSelect: false,
			isVinNo: 2,
			loadType: 1, // 1：城市 2：车型名称
			leftList: [
				{ label: "城市", value: 1, isSelect: true },
				{ label: "车型名称", value: 2, isSelect: false },
			],
			rightList: [
				{ label: "车牌号码", value: 1, isSelect: false },
				{ label: "VIN码", value: 2, isSelect: true },
			],
		};
	},
	methods: {
		// 关闭
		close() {
			this.$emit("update:visibles", false);
		},
		selectType(event, type) {
			this.queryType = type;
		},
		inputChange(val) {
			if (val.length > 0) {
				this.showSelect = true;
			} else {
				this.showSelect = false;
			}
		},
		inputBlur() {
			this.listQuery.query = this.query;
			this.listQuery.queryType = this.queryType;
			this.showSelect = false;
			if (this.listQuery.query) {
				if (this.queryType === 1) {
					this.query = "VIN码：" + this.listQuery.query;
				} else {
					this.query = "车牌号码：" + this.listQuery.query;
				}
			}
		},
		inputFocus() {
			if (this.query.length > 0) {
				this.showSelect = true;
				this.query = this.listQuery.query;
			}
		},
		handleSearch() {
			let postData = {
				vinNo: this.listQuery.queryType === 1 ? this.listQuery.query : "",
				licensePlate:
					this.listQuery.queryType === 2 ? this.listQuery.query : "",
			};
			// 加载城市
			if (this.loadType === 1) {
				this._getCityFaultCarCountList(postData);
			} else {
				this._getCarTypeFaultCountList(postData);
			}
		},
		// 加载城市故障车辆
		_getCityFaultCarCountList(postData) {
			getCityFaultCarCountList(postData).then(({ data }) => {
				if (data.code === 0) {
					this.treeList = transformData(data.data || []);
					let arr = [];
					if (this.treeList.length > 0) {
						arr.push(this.treeList[0].id);
						this.defaultCheckedKeys = arr;
						if (
							this.treeList[0].children &&
							this.treeList[0].children.length > 0
						) {
							this.updateTreeData(postData, this.treeList[0].children[0]);
						}
					}
				}
			});
		},
		// 加载车型名称故障统计
		_getCarTypeFaultCountList(postData) {
			getCarTypeFaultCountList(postData).then(({ data }) => {
				if (data.code === 0) {
					this.treeList = transfromCarTypeData(data.data || []);
					let arr = [];
					if (this.treeList.length > 0) {
						arr.push(this.treeList[0].id);
						this.defaultCheckedKeys = arr;
						if (this.treeList && this.treeList.length > 0) {
							this.updateTreeData(postData, this.treeList[0]);
						}
					}
				}
			});
		},
		// 选择vin和车牌
		selectVinLisplate(item) {
			this.isVinNo = item.value;
			for (let i = 0; i < this.rightList.length; i++) {
				if (item.value === this.rightList[i].value) {
					this.rightList[i].isSelect = true;
				} else {
					this.rightList[i].isSelect = false;
				}
			}
		},
		// 加载车型名称
		selectCarType(item) {
			for (let i = 0; i < this.leftList.length; i++) {
				if (item.value === this.leftList[i].value) {
					this.leftList[i].isSelect = true;
				} else {
					this.leftList[i].isSelect = false;
				}
			}
			if (this.loadType === item.value) {
				return;
			} else {
				this.treeList = [];
				this.loadType = item.value;
				let postData = {
					vinNo: this.listQuery.queryType === 1 ? this.listQuery.query : "",
					licensePlate:
						this.listQuery.queryType === 2 ? this.listQuery.query : "",
				};
				if (this.loadType === 1) {
					this._getCityFaultCarCountList(postData);
				} else if (this.loadType === 2) {
					this._getCarTypeFaultCountList(postData);
				}
			}
		},
		// 设置默认展开项
		setDefaultCheckedKeys(arr) {
			this.defaultCheckedKeys = [...this.defaultCheckedKeys, ...arr];
		},
		// 展开
		expandTree(data) {
			this.loadData(data);
		},
		getMoreData(data) {
			// 设置loading加载
			this.$set(data, "isLoading", true);
			this.loadData(data);
		},
		// 加载数据
		loadData(data) {
			if (
				// data.isLoad 判断是否加载过
				(data.type === "city" && !data.isLoad) ||
				data.id.indexOf("more") > -1
			) {
				// 避免在1s内重复请求数据
				if (!this.first) {
					this.first = new Date().getTime();
					this.updateTreeData(data, data);
					setTimeout(() => {
						this.first = null;
					}, 1000);
				}
			}
		},
		// 更新数据
		updateTreeData(postvin, item) {
			const postData = {};
			let treeItem = null;

			if (typeof item.id === "string") {
				if (item.id.indexOf("more") > -1) {
					treeItem = this.$refs.tree.getNode(item.pid);
					postData.pageNum = ++treeItem.data.pageNum;
					postData.pageSize = treeItem.data.pageSize;
					// postData.cityId = treeItem.data.id
					postData.vinNo = postvin.vinNo;
					postData.licensePlate = postvin.licensePlate;
					if (this.loadType == 1) {
						postData.cityId = treeItem.data.id;
					} else {
						postData.carTypeId = treeItem.data.id;
					}
				} else {
					item.children.splice(0, 1);
					postData.pageNum = item.pageNum;
					postData.pageSize = item.pageSize;
					if (this.loadType == 1) {
						postData.cityId = item.id;
					} else {
						postData.carTypeId = item.id;
					}
					postData.vinNo = postvin.vinNo;
					postData.licensePlate = postvin.licensePlate;
				}
			}
			getCar({ ...postData }).then(({ data }) => {
				if (
					data.code === 0 &&
					data.data.constructor === Array &&
					data.data.length > 0
				) {
					// 城市添加子节点
					if (typeof item.id === "string") {
						if (item.id.indexOf("more") > -1) {
							for (let i = 0; i < data.data.length; i++) {
								data.data[i].pid = item.id;
								data.data[i].id = id--;
								treeItem.data.children.splice(
									treeItem.data.children.length - 1,
									0,
									data.data[i]
								);
							}
							item.isLoading = false;
							// 表明没有更多数据
							if (data.data.length < treeItem.data.pageSize) {
								const index = treeItem.data.children.length - 1;
								treeItem.data.children.splice(index, 1);
							}
						} else {
							if (!item.children) {
								this.$set(item, "children", []);
							}
							for (let i = 0; i < data.data.length; i++) {
								data.data[i].pid = item.id;
								data.data[i].id = id--;
								item.children.splice(item.children.length - 1, 0, data.data[i]);
							}
							// 如果请求的数据大于等于pagesize则表明依然存在更多数据
							if (data.data.length >= item.pageSize) {
								item.children.push({
									moreText: "更多",
									pid: item.id,
									id: "more" + id--,
								});
							}
							item.isLoad = true;
							this.setDefaultCheckedKeys([item.id]);
						}
					}
				}
			});
		},
		// 点击车辆
		clickCar(row) {
			this.$emit("click-car", row);
		},
	},
};
</script>

<style lang="scss" scoped>
ul,
p {
	padding: 0;
	margin: 0;
}
.car-list {
	position: absolute;
	top: 100px;
	left: 0px;
	z-index: 9999;
	width: 300px;
	background: rgba(0, 90, 139,.8);
	// background: #005686;
	border-radius: 4px 4px 0 0;
	border: 1px solid #0B75A5;
	border-left:0;
	.car-list-header {
		height: 35px;
		background: rgba(0, 90, 139,.8);
		border-bottom: 1px solid #0B75A5;
		line-height: 35px;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		color: #FFFFFF;
		border-radius: 4px 4px 0 0;
		display: flex;
		justify-content: space-between;
		.el-icon-close{
			font-size: 13px;
			border-radius: 4px;
			border: 1px solid #0185c3 !important;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			margin: -1px -1px 0 0 !important;
		}
	}
}
.car-list-content {
	padding-top:10px;
	height: 60vh;
	overflow: hidden;
	background:#024971;
	font-weight: 400;
  color: #FFFDF0;
}
// .city-list-content {
// 	padding: 0 10px;
// 	font-size: 13px;
// 	color: #606266;
// 	&.active {
// 		background: #f4feff;
// 	}

// 	p {
// 		margin-top: 0;
// 		margin-bottom: 0;
// 		padding: 8px 0;
// 	}
// 	.city-list-province {
// 		font-size: 14px;
// 		color: #515c60;
// 		font-weight: bold;
// 		cursor: pointer;
// 	}

// 	.city-list-city {
// 		padding: 0 10px;
// 		overflow: hidden;
// 		.city-list-city-border {
// 			display: flex;
// 			flex-direction: row;
// 			flex-wrap: wrap;
// 			border-bottom: 1px dashed #e5e9eb;
// 			border-top: 0px dashed #e5e9eb;
// 			padding-bottom: 5px;
// 			.city {
// 				margin: 5px;
// 				cursor: pointer;
// 			}
// 		}
// 	}
// }
.car-list-tab {
	width: 100%;
	height: 30px;
	display: flex;
	clear: both;
	font-size: 12px;
	margin-top: 10px;
	.car-list-tab-ul {
		float: left;
		li {
			padding: 8px 10px;
			cursor: pointer;
			display: inline-block;
			border-radius: 4px 4px 0 0;
			font-weight: 400;
      color: #FFFDF0;
			// &:hover {
			// 	// background: #fff;
			// 	background: linear-gradient(120deg, #51F267, #00A0E9);
      //   border-radius: 4px 4px 0px 0px;
			// 	color: #fff;
			// }
			&.active {
				// background: #fff;
				background: linear-gradient(120deg, #51F267, #00A0E9);
        border-radius: 4px 4px 0px 0px;
        color: #fff;
			}
			&:nth-child(1) {
				margin-left: 10px;
			}
			&:nth-child(2) {
				margin-left: 3px;
			}
		}
	}
	.car-list-tab-button {
		float: right;
		height: auto;
		margin-left: 30px;
		li {
			padding: 5px 10px;
			// margin: 0 3px;
			border: 1px solid #11648A !important;
	    background: #044067 !important;
			font-weight: 400;
      color: #FFFDF0;
			display: inline-block;
			cursor: pointer;
			&:nth-child(1) {
				border-right: none;
			}
			&:nth-child(2) {
				border-left: none;
			}
			// &:hover {
			// 	background: rgb(72, 110, 145);
			// 	color: #fff;
			// }
			&.active {
				background: #00A0E9 !important;
				border: 1px solid #00A0E9 !important;
				color: #fff;
			}
		}
	}
}
.tree-span {
	font-size: 12px;
	.i-icon-car-state {
		display: inline-block;
		width: 21px;
		height: 13px;
		vertical-align: middle;
		// height: 25px;
		background: url("../../../../assets/faultImage/icon_car.png") no-repeat;
		// background-size: 21px 12px;
		background-position: -52px 0px;
	}
	.i-icon-car-state-isOnline {
		background-position: 0;
	}
}
.select-list {
	width: 100%;
	background: rgb(5, 67, 107);
	// background: rgba(5, 67, 107,.8) !important;
	position: absolute;
	top: 35px;
	left: 0;
	z-index: 9999;
	border-radius: 4px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #FFFDF0;
	border-radius: 4px;
	border:1px solid #00A0E9;
	// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;
	.select-item {
		padding: 10px;
		cursor: pointer;
		&:nth-child(1) {
			// border-bottom: 1px dashed rgba(0, 0, 0, 0.3);
			border-bottom: 1px dashed rgba(1, 101, 152,.8);
		}
		&:hover {
			// background: rgba(0, 0, 0, 0.1);
			background: #016598;
			color: #fff;
		}
	}
}
::v-deep .el-tree__empty-block{
    background-color: #024971 !important;
}
::v-deep .el-input__inner{
  border-radius:2px 0 0 2px !important;
	border: 1px solid #11648A !important;
	background: #044067 !important;
	border-right: 0 !important;
}
::v-deep .el-input__inner:hover,
::v-deep .el-input__inner:active,
::v-deep .el-input__inner:focus{
	border-right: 0 !important;
}
::v-deep .el-input-group__append{
	background: rgba(0, 90, 139,.8) !important;
	border:0 !important;
	border-radius:0 !important;
}
.searchButton,
.searchButton:hover{
	background: #00A0E9 !important;
  border-radius:0 2px 2px 0 !important;
	border: 1px solid #11648A !important;
	border-left:0 !important;
}
</style>
