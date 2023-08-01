<template>
	<app-drawer
		:visibles="visibles"
		:isDrawerFoot="false"
		:wrapperClosable="true"
		:title="'DBC配置'"
		@close-drawer="handleCancel"
		width="80%"
	>
		<div slot="drawerContent">
			<div>
				<div class="tip-info">
					<p class="black80">
						DBC名称:
						<span>{{ fullName }}</span>
					</p>
				</div>
				<el-row
					:gutter="10"
					class="row-box"
					type="flex"
					justify="middle"
					align="center"
				>
					<el-col :span="9">
						<div class="config-center-box">
							<p
								class="config-center-box-title config-center-box-titel-p black80"
							>
								{{ protocolName }}数据项
							</p>
							<div class="config-center-protocolist divScroll">
								<el-tree
									class="dbcTree"
									:data="treeData"
									:expand-on-click-node="false"
									node-key="id"
									default-expand-all
									@node-click="treeClick"
								>
									<span
										slot-scope="{ node, data }"
										:style="{
											background: data.color ? data.color : 'none',
											'border-radius': '3px',
											padding: '7.5px 0px',
										}"
										class="custom-tree-node"
									>
										<span
											:style="{
												display: 'inline-block',
												padding: '0 5px',
												'box-sizing': 'content-box',
												'vertical-align': 'middle',
											}"
											@contextmenu="contextmenu(node, data, arguments)"
										>
											<span
												:style="{
													color:
														data.isStorage === 0
															? 'unset'
															: data.isFormula === 1 && data.isChild === 1
															? 'red'
															: data.variableType === 1 &&
															  data.searchChannel === 0 &&
															  data.isChild === 1
															? '#FF7F00'
															: 'unset',
												}"
												class="cssdata"
												:title="node.label"
											>
												{{ node.label }}
												<i
													v-show="data.color"
													class="el-icon-circle-close"
													@click.stop="() => remove(node, data)"
												/>
											</span>
										</span>
									</span>
								</el-tree>
							</div>
						</div>
					</el-col>
					<el-col :span="9">
						<div class="config-center-box">
							<div class="config-center-box-title">
								<div class="search_list">
									<el-row
										:gutter="10"
										type="flex"
										justify="start"
										align="middle"
									>
										<el-col :span="18">
											<el-form
												:label-position="'right'"
												:model="listQuery"
												label-width="80px"
											>
												<el-form-item label="参数查询：">
													<el-input
														v-model="listQuery.queryCondition"
														size="mini"
														placeholder="请输入参数查询"
														clearable
													/>
												</el-form-item>
											</el-form>
										</el-col>
										<el-col :span="6">
											<div>
												<el-button
													v-waves
													type="primary"
													size="mini"
													clearable
													@click="handleFilter"
													>查询</el-button
												>
											</div>
										</el-col>
									</el-row>
								</div>
							</div>
							<div class="config-center-protocolist divScroll">
								<div class="nav-tab">
									<div
										style="margin-left: 10px"
										v-for="(item, index) in navTabItem"
										:key="index"
										:class="[item.isSelect ? 'is-active' : '', 'nav-tab-item']"
										@click="tabClick(item, index)"
									>
										<span>{{ item.label }}</span>
									</div>
								</div>
								<div v-show="queryType === 0">
									<ul class="item-list">
										<li
											v-for="(item, index) in dbcList"
											:key="index"
											@dblclick="dblMount(item, index)"
										>
											<div class="item-list-span">
												<span>{{ index + 1 }}</span
												>&nbsp;&emsp;
												<span :class="item.showColor ? 'textColor' : ''">{{
													item.variableName
												}}</span>
											</div>
										</li>
									</ul>
								</div>
								<div v-show="queryType === 1">
									<ul class="item-list">
										<li
											v-for="(item, index) in faultList"
											:key="index"
											@dblclick="dblMount(item, index)"
										>
											<div class="item-list-span">
												<span>{{ index + 1 }}</span
												>&nbsp;&emsp;
												<span :class="item.showColor ? 'textColor' : ''"
													>{{ item.faultName }}--{{ item.faultCode }}</span
												>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="config-center-box dbc-center-box">
							<p
								class="config-center-box-title config-center-box-titel-p black80"
							>
								DBC审核记录
							</p>
							<div class="config-center-protocolist divScroll">
								<ul class="item-list">
									<li v-for="(item, index) in logList" :key="index">
										<div class="item-list-span">
											<span>{{ item.operateDate }}</span>
											<span>{{ item.operateMessage }}</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<span slot="footer" class="drawerFoot dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="autoMapped">自动映射</el-button>
				<el-button type="primary" @click="submit(0)">保存</el-button>
				<el-button type="primary" @click="submit(1)">提交审核</el-button>
			</span>
			<formula-edit
				:inner-visible.sync="formulaVisible"
				:search-query="searchCondition"
				:variable-id="variableId"
				:dbc-id="dbcId"
				:list="formulaList"
			/>
		</div>
		<context-menu
			:show.sync="showMenu"
			:variable-id="variableId"
			:show-msg="contextmentMsg"
			:position="{ x, y }"
		/>
	</app-drawer>
</template>

<script>
let id = 10000;
import waves from "@/directive/waves";
import contextMenu from "./contextMenu";
import formulaEdit from "./formulaEdit";
import {
	getProtocolVariable,
	getDbcVariable,
	getFaultCode,
	getDbcTaskLog,
	getProtocolFormula,
	getDbcConfig,
	setDbcTask,
} from "@/api/transmitSys/stayConfig";
export default {
	name: "configDrawer",
	directives: {
		waves,
	},
	components: { contextMenu, formulaEdit },
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		protocolId: {
			type: [Number, String],
			default: 0,
		},
		protocolName: {
			type: String,
			default: "",
		},
		dbcId: {
			type: [Number, String],
			default: 0,
		},
		fullName: {
			type: String,
			default: "",
		},
		taskId: {
			type: [Number, String],
			default: 0,
		},
		motorCount: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			treeData: [],
			oldTreeData: "",
			formulaVisible: false,
			variableId: "",
			listQuery: {
				queryCondition: "",
			},
			navTabItem: [
				{
					label: "DBC参数",
					type: 0,
					isSelect: true,
				},
				{
					label: "故障码",
					type: 1,
					isSelect: false,
				},
			],
			queryType: 0,
			dbcList: [],
			oldDbcList: "",
			faultList: [],
			oldFaultList: "",
			logList: [],
			formulaList: [],
			dbcConfigList: [],
			protocolFormula: [],
			showMenu: false,
			x: 0,
			y: 0,
			searchCondition: "",
			contextmentMsg: false,
			saveList: [],
			saveMapped: [],
			oldSaveMapped: [],
			selelctTreeData: null,
			isdata: "true",
			iszd: [],
			// protocolId: "", // 协议id
			// 	variableName: "", // 数据项名称
			// 	variableType: "", // 数据项类型
			// 	variableParentId: "", // 父级ID
			// 	isStorage: 0, // 是否存储
			// 	isSingle: 0, // 是否单选
			// 	isFormula: 0, // 是否可配公式
			// 	isChild: 0, // 是否子节点
			// 	variableAlias: "", // 别名
			// 	searchChannel: "", // 匹配渠道
			// 	searchType: "", // 匹配方式
			// 	searchCondition: "", // 匹配条件
			// 	orderNo: "", // 顺序
			// 	remark: "", // 备注
		};
	},
	watch: {
		visibles(e1, e2) {
			if (e1) {
				const { dbcId, protocolId } = this;
				// 协议数据项树请求参数
				const variableData = { protocolId };
				// 获取协议数据项树
				getProtocolVariable(variableData).then(({ data }) => {
					if (data.code === 0) {
						// 过滤树节点
						this.filterTreeData(data.data);
						// dbc请求参数
						const dbcData = {
							dbcId,
							queryCondition: "",
						};
						// 故障列请求参数
						const faultData = {
							protocolId,
							queryCondition: "",
						};
						// 公式项请求参数
						const formulaData = {
							variableId: "",
						};
						// 获取DBC参数列表
						getDbcVariable(dbcData).then(({ data }) => {
							if (data.code === 0) {
								this.dbcList = data.data || [];
								this.oldDbcList = JSON.stringify(data.data);
								// 获取故障码列表
								getFaultCode(faultData).then(({ data }) => {
									if (data.code === 0) {
										this.faultList = data.data || [];
										this.oldFaultList = JSON.stringify(data.data);
										// 获取公式列表
										getProtocolFormula(formulaData).then(({ data }) => {
											if (data.code === 0) {
												this.formulaList = data.data || [];
												// 获取DBC配置信息
												this.getDbcConfig();
											}
										});
									}
								});
							}
						});
					}
				});
				// 获取DBC审核记录
				this.getDbcTaskLog();
			}
		},
	},
	methods: {
		restData() {
			this.treeData = [];
			this.oldTreeData = "";
			this.listQuery.queryCondition = "";
			this.navTabItem = [
				{
					label: "DBC参数",
					type: 0,
					isSelect: true,
				},
				{
					label: "故障码",
					type: 1,
					isSelect: false,
				},
			];
			this.queryType = 0;
			this.dbcList = [];
			this.faultList = [];
			this.logList = [];
			this.formulaList = [];
			this.protocolFormula = [];
			this.showMenu = false;
			this.x = 0;
			this.y = 0;
			this.searchCondition = "";
			this.contextmentMsg = false;
			this.saveList = [];
			this.saveMapped = [];
			this.oldSaveMapped = [];
			this.selelctTreeData = null;
		},
		openDia() {
			document.querySelector(
				".js-dbcConfig-stayConfig .el-dialog__wrapper .el-dialog-config"
			).style.cssText += "top:0;left:0";
		},
		// 过滤树结构数据
		async filterTreeData(treeData = []) {
			if (treeData && treeData.constructor === Array && treeData.length > 0) {
				const index = treeData.findIndex(
					(item) => item.label === "驱动电机列表"
				);
				if (index > -1) {
					if (
						treeData[index].children &&
						treeData[index].children.constructor === Array &&
						treeData[index].children.length > this.motorCount
					) {
						treeData[index].children.splice(
							this.motorCount,
							treeData[index].children.length - this.motorCount
						);
					}
				}
				this.treeData = treeData;
				this.oldTreeData = JSON.stringify(this.treeData);
				await this.initSaveMapped(treeData);
				this.oldSaveMapped = JSON.stringify(this.saveMapped);
			}
		},
		// 初始化saveMapped
		initSaveMapped(o) {
			o.forEach((item) => {
				if (item.isStorage === 1) {
					this.saveMapped.push({
						id: item.id,
						label: item.label,
						parentId: item.parentId,
						checkValue: "",
						formulaValue: "",
						alarmType: 2,
					});
				}
				if (item.children && item.children.length > 0) {
					this.initSaveMapped(item.children);
				}
			});
		},
		// 获取DBC审核记录
		getDbcTaskLog() {
			const data = { taskId: this.taskId };
			getDbcTaskLog(data).then(({ data }) => {
				if (data.code === 0 && data.data) {
					this.logList = data.data;
				}
			});
		},
		// 获取DBC配置信息
		getDbcConfig() {
			const data = {
				taskId: this.taskId,
			};
			getDbcConfig(data)
				.then(({ data }) => {
					if (data.code === 0 && data.data) {
						if (data.data.showValue) {
							this.saveList = JSON.parse(data.data.showValue);
							this.autoMountTree(this.treeData);
						}
						// 获取从后台返回数据
						if (data.data.configValue) {
							this.getSaveMapped(JSON.parse(data.data.configValue));
						}
					}
				})
				.catch((err) => {});
		},
		// 获取saveMapped
		getSaveMapped(o) {
			o.forEach((item) => {
				for (let i = 0; i < this.saveMapped.length; i++) {
					if (this.saveMapped[i].id === item.id) {
						this.saveMapped[i].checkValue = item.checkValue;
						this.saveMapped[i].formulaValue = item.formulaValue;
						this.saveMapped[i].alarmType = item.alarmType;
						break;
					}
				}
				if (item.children && item.children.length > 0) {
					this.getSaveMapped(item.children);
				}
			});
		},
		// 设置了保存后，自动tree节点
		autoMountTree(o) {
			o.forEach((item) => {
				for (let i = 0; i < this.saveList.length; i++) {
					if (item.id === this.saveList[i].id) {
						this.append(
							item,
							this.saveList[i].label,
							this.saveList[i].deleteId
						);
						const deleteIdArrs = this.saveList[i].deleteId.split(",");
						if (this.dbcFault(item) === "DBC") {
							this.autoMountColor(this.dbcList, deleteIdArrs);
						} else if (this.dbcFault(item) === "FAULT") {
							this.autoMountColor(this.faultList, deleteIdArrs);
						}
					}
				}
				if (item.children && item.children.length > 0) {
					this.autoMountTree(item.children);
				}
			});
		},
		// 设置了保存后，自动挂载颜色
		autoMountColor(dataList, deleteIdArrs) {
			for (let j = 0; j < deleteIdArrs.length; j++) {
				for (let k = 0; k < dataList.length; k++) {
					const deleteId = (dataList[k].serial || dataList[k].faultCode) + "";
					if (deleteIdArrs[j] === deleteId) {
						dataList[k].showColor = true;
						this.$set(dataList, k, dataList[k]);
					}
				}
			}
		},
		// 取消
		handleCancel() {
			this.restData();
			this.$emit("update:visibles", false);
		},
		// 参数查询
		handleFilter() {
			this.queryVariable(this.queryType);
		},
		// 获取DBC列表和故障码列表 0.dbc 1.故障码
		queryVariable(type) {
			const { queryCondition } = this.listQuery;
			const { dbcId, protocolId } = this;
			const data = { queryCondition };
			if (type === 0) {
				data.dbcId = dbcId;
				getDbcVariable(data).then(({ data }) => {
					if (data.code === 0) {
						this.dbcList = data.data || [];
						this.saveOldColor(this.dbcList);
					}
				});
			} else if (type === 1) {
				data.protocolId = protocolId;
				getFaultCode(data).then(({ data }) => {
					if (data.code === 0) {
						this.faultList = data.data || [];
						this.saveOldColor(this.faultList);
					}
				});
			}
		},
		// 点击tree时重新获取DbcList,faultList需要缓存dbc参数，故障码参数颜色
		saveOldColor(dataList) {
			if (this.saveList.length > 0 && dataList.length > 0) {
				const deleteIdArrs = this.saveList
					.map((obj) => obj.deleteId)
					.join(",")
					.split(",");
				for (let i = 0; i < deleteIdArrs.length; i++) {
					for (let j = 0; j < dataList.length; j++) {
						if (
							dataList[j].serial + "" === deleteIdArrs[i] ||
							dataList[j].faultCode === deleteIdArrs[i]
						) {
							if (dataList[j].hasOwnProperty("showColor")) {
								delete dataList[j].showColor;
							}
							dataList[j].showColor = true;
							this.$set(dataList, j, dataList[j]);
						}
					}
				}
			}
		},
		// 提交or保存 0.保存 1.提交
		submit(e) {
			if (this.saveList.length === 0) {
				this.$message.warning({
					message: "未配置DBC参数",
					duration: 2 * 1000,
				});
				return;
			}
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-config"),
				text: e === 0 ? "正在保存..." : "正在提交审核...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
			let configCount = 0;
			const postSaveMappedList = [];
			const saveMappedList = JSON.parse(JSON.stringify(this.saveMapped));
			for (let i = 0; i < saveMappedList.length; i++) {
				if (saveMappedList[i].checkValue) {
					configCount++;
				}
				this.findIndexs(postSaveMappedList, saveMappedList[i]);
			}
			const data = {
				taskId: this.taskId,
				operateType: e,
				configValue: JSON.stringify(postSaveMappedList),
				showValue: JSON.stringify(this.saveList),
				configCount,
			};
			setDbcTask(data)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: e === 0 ? "保存成功" : "提交成功",
							duration: 2 * 1000,
						});
						this.getDbcTaskLog();
						this.$parent.listLoad();
						this.$emit("submit-complete");
						this.$emit("update:visibles", false);
						// if (e === 1) {
						this.handleCancel();
						this.restData();
						this.$emit("update:visibles", false);
						// }
					}
					this.uploadloading.close();
				})
				.catch((err) => {
					this.uploadloading.close();
				});
		},
		findIndexs(arrList, itemList) {
			const index = this.saveMapped.findIndex(
				(item) => item.id === itemList.parentId
			);
			if (index > -1) {
				for (let i = 0; i < arrList.length; i++) {
					if (arrList[i].id === itemList.parentId) {
						if (!arrList[i].children) {
							arrList[i].children = [];
						}
						arrList[i].children.push(itemList);
						return;
					} else {
						if (
							arrList[i].children &&
							arrList[i].children.constructor === Array
						) {
							this.findIndexs(arrList[i].children, itemList);
						}
					}
				}
			} else {
				arrList.push(itemList);
				return;
			}
		},
		// 自动映射
		// 不要随便改这个，回显不了的就是应为创建的时候isStorage选了不能回显的
		autoMapped() {
			this.isdata = false;
			if (this.treeData.length === 0) {
				this.$message.warning({
					message: "无协议数据项",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.dbcList.length === 0) {
				this.$message.warning({
					message: "无DBC参数",
					duration: 2 * 1000,
				});
				return;
			}
			this.uploadloading = this.$loading({
				target: document.querySelector(".el-dialog-config"),
				text: "正在映射...",
				background: "rgba(1, 1, 1, 0.3)",
				customClass: "svg-otherColor",
			});
			try {
				this.saveList = [];
				if (this.oldDbcList) {
					this.dbcList = JSON.parse(this.oldDbcList);
				}
				if (this.oldFaultList) {
					this.faultList = JSON.parse(this.oldFaultList);
				}
				if (this.oldSaveMapped) {
					this.saveMapped = JSON.parse(this.oldSaveMapped);
				}
				if (this.oldTreeData) {
					this.treeData = JSON.parse(this.oldTreeData);
				}
				this.listQuery.queryCondition = "";
				this.ergodic(this.treeData);
				if (this.saveList.length > 0) {
					this.$message.success({
						message: "自动映射完成",
						duration: 2 * 1000,
					});
					this.uploadloading.close();
				}
			} catch (error) {
				this.uploadloading.close();
			}
		},
		//满足自动映射的条件的进入这个
		// 判断是DBC还是FAULT
		ergodic(o) {
			o.forEach((item) => {
				if (item.isStorage === 1 && item.isChild && item.searchCondition) {
					if (this.dbcFault(item) === "DBC") {
						this.fn(item, this.dbcList);
					} else if (this.dbcFault(item) === "FAULT") {
						this.fn(item, this.faultList);
					}
				}
				if (item.children && item.children.length > 0) {
					this.ergodic(item.children);
				}
			});
		},
		fn(item, dataList) {
			const searchList = [...new Set(item.searchCondition.split("%"))];
			let m = 0;
			for (let j = 0; j < searchList.length; j++) {
				if (searchList[j]) {
					const checkValueArrs = []; // checkValue
					let formulaValues = ""; // 公式值
					let alarmTypes = 2; // 故障
					for (let i = 0; i < dataList.length; i++) {
						let typeValue = false;
						if (item.searchType === 0) {
							// 模糊查询
							const t = dataList[i].variableName || dataList[i].faultCode;
							typeValue = t.indexOf(searchList[j]) > -1;
						} else if (item.searchType === 1) {
							// 精确查询
							const t = dataList[i].variableName || dataList[i].faultCode;
							typeValue = t === searchList[j];
						}
						//判断精确查询和模糊查询
						if (typeValue) {
							const deleteId =
								(dataList[i].serial || dataList[i].faultCode) + "";
							let text =
								dataList[i].variableName ||
								dataList[i].faultName + "--" + dataList[i].faultCode;
							//等于1时可以能自动匹配公式
							if (item.isFormula === 1) {
								const arr = this.formulaList.filter(
									(d) => item.id === d.variableId
								);
								//公式的长度等于1，只有一条时直接加
								// if (arr.length === 1) {
								const formulaParamArr = arr[0].formulaParam.split(",");
								if (formulaParamArr.length === 1) {
									text = arr[0].formulaText.replace(
										formulaParamArr[0],
										dataList[i].variableName ||
											dataList[i].faultName + "--" + dataList[i].faultCode
									);
									m++;
									this.append(item, text, deleteId);
									dataList[i].showColor = true;
									checkValueArrs.push(
										dataList[i].serial || dataList[i].faultCode
									);
									formulaValues = arr[0].formulaValue;
									alarmTypes = dataList[i].faultCode ? 1 : 2;
									this.saveList.push({ id: item.id, label: text, deleteId });
								}
								// } else {
								// 	this.append(item, text, deleteId);
								// 	dataList[i].showColor = true;
								// 	checkValueArrs.push(
								// 		dataList[i].serial || dataList[i].faultCode
								// 	);
								// 	formulaValues = "";
								// 	alarmTypes = dataList[i].faultCode ? 1 : 2;
								// 	this.saveList.push({ id: item.id, label: text, deleteId });
								// }
							} else if (item.isFormula === 0) {
								//0时不能自动匹配公式
								m++;
								this.append(item, text, deleteId);
								dataList[i].showColor = true;
								checkValueArrs.push(
									dataList[i].serial || dataList[i].faultCode
								);
								formulaValues = "";
								alarmTypes = dataList[i].faultCode ? 1 : 2;
								this.saveList.push({ id: item.id, label: text, deleteId });
							}
							if (item.isSingle === 1) {
								break;
							}
						}
					}
					if (m > 0) {
						// 更新saveMapped
						const index = this.saveMapped.findIndex((i) => i.id === item.id);
						if (index > -1) {
							this.saveMapped[index].checkValue = checkValueArrs.join(",");
							this.saveMapped[index].formulaValue = formulaValues;
							this.saveMapped[index].alarmType = alarmTypes;
						}

						break;
					}
				}
			}
		},
		// 新增
		append(data, label, deleteId, iscustom = 0) {
			const color = data.isFormula === 1 ? "rgb(123 214 123)" : "#a3c0e8";
			const newChild = {
				id: "forward" + id++,
				label,
				deleteId,
				color,
				iscustom,
				children: [],
			};
			if (iscustom == 1) {
				let dataname = {
					id: data.id,
					label: label,
					deleteId: deleteId,
					iscustom: iscustom,
					color,
					children: [],
				};
				this.iszd = [];
				this.iszd.push(dataname);
			}
			if (!data.children) {
				// 判断是否存在children，如果存在则删除并重新生成children
				if (data.hasOwnProperty("children")) {
					delete data.children;
				}
				this.$set(data, "children", []);
			}
			if (this.iszd.length > 0) {
				this.iszd.forEach((item) => {
					if (item.id == data.id) {
						if (
							data.isSingle == 1 &&
							data.children &&
							data.children.length < 1
						) {
							data.children.push(item);
						} else if (data.isSingle == 0) {
							data.children.push(item);
						}
					} else {
						if (this.isdata) {
							data.children.push(newChild);
						} else {
							if (
								data.isSingle == 1 &&
								data.children &&
								data.children.length < 1
							) {
								data.children.push(newChild);
							} else if (data.isSingle == 0) {
								data.children.push(newChild);
							}
						}
					}
				});
			} else {
				if (this.isdata) {
					data.children.push(newChild);
				} else {
					if (data.isSingle == 1 && data.children && data.children.length < 1) {
						data.children.push(newChild);
					} else if (data.isSingle == 0) {
						data.children.push(newChild);
					}
				}
			}
		},
		// 删除
		remove(node, data) {
			const parent = node.parent;
			const parentId = parent.data.id;
			// 改变Tab
			if (this.dbcFault(parent.data) === "DBC") {
				this.queryType = 0;
				this.changeTab(0);
			} else if (this.dbcFault(parent.data) === "FAULT") {
				this.queryType = 1;
				this.changeTab(1);
			}
			// 删除当前节点
			const currentNode = parent.data.children || parent.data;
			const currentIndex = currentNode.findIndex((d) => d.id === data.id);
			currentNode.splice(currentIndex, 1);
			// 更新saveList
			for (let i = 0; i < this.saveList.length; i++) {
				if (data.deleteId === this.saveList[i].deleteId) {
					const parentNodeName = parent.data.label;
					// eslint-disable-next-line no-empty
					if (this.dbcFault(parent.data) === "DBC") {
						for (let j = 0; j < this.saveMapped.length; j++) {
							if (this.saveMapped[j].id === parent.data.id) {
								const pId = this.saveMapped[j].parentId;
								for (let k = 0; k < this.saveMapped.length; k++) {
									if (this.saveMapped[k].parentId === pId) {
										const nodeName = this.saveMapped[k].label;
										if (nodeName === parentNodeName) {
											this.saveList.splice(i, 1);
											break;
										}
									}
								}
							}
						}
					} else {
						this.saveList.splice(i, 1);
						break;
					}
				}
			}
			// 更新saveMapped
			const deleteIdArr = data.deleteId.split(",");
			const index = this.saveMapped.findIndex((i) => i.id === parentId);
			const checkValueArr = this.saveMapped[index].checkValue.split(",");
			for (let i = 0; i < deleteIdArr.length; i++) {
				// 删除checkValue
				for (let j = 0; j < checkValueArr.length; j++) {
					if (deleteIdArr[i] === checkValueArr[j]) {
						checkValueArr.splice(j, 1);
						break;
					}
				}
				// 改变DBC列表或故障码列表参数颜色
				if (this.dbcFault(parent.data) === "DBC") {
					this.changeColor(data, this.dbcList, deleteIdArr[i]);
				} else if (this.dbcFault(parent.data) === "FAULT") {
					this.changeColor(data, this.faultList, deleteIdArr[i]);
				}
			}
			this.saveMapped[index].checkValue = checkValueArr.join(",");
			this.saveMapped[index].formulaValue = "";
		},
		// 改变列表颜色
		changeColor(data, dataList, deleteId) {
			for (let j = 0; j < dataList.length; j++) {
				const val = (dataList[j].serial || dataList[j].faultCode) + "";
				if (deleteId === val) {
					dataList[j].showColor = false;
					this.$set(dataList, j, dataList[j]);
					break;
				}
			}
		},
		// 显示编辑公式窗体
		showFormula() {
			this.formulaVisible = true;
		},
		// 右键菜单
		contextmenu(node, data, e) {
			if (data.isStorage === 1 && data.isFormula === 1 && data.isChild === 1) {
				e[0].preventDefault();
				this.variableId = data.id;
				if (data.isSingle === 1) {
					if (node.data.children && node.data.children.length > 0) {
						this.contextmentMsg = true;
					} else {
						this.contextmentMsg = false;
					}
				} else if (data.isSingle === 0) {
					this.contextmentMsg = false;
				}
				this.searchCondition = data.searchCondition;
				this.showMenu = true;
				this.selelctTreeData = data;
				this.x = e[0].clientX;
				this.y = e[0].clientY;
			}
		},
		// 点击tab
		tabClick(item, index) {
			if (item.isSelect) return;
			item.isSelect = true;
			this.queryType = item.type;
			for (let i = 0; i < this.navTabItem.length; i++) {
				if (i === index) {
					continue;
				} else {
					this.navTabItem[i].isSelect = false;
				}
			}
		},
		// 点击树组件事件
		treeClick(data, node) {
			const { isStorage, searchCondition } = data;
			this.selelctTreeData = null;
			this.selelctTreeData = data;
			this.listQuery.queryCondition = isStorage === 0 ? "" : searchCondition;
			if (this.dbcFault(data) === "DBC") {
				this.queryType = 0;
				this.queryVariable(0);
				this.changeTab(0);
				this.faultList = [];
			} else if (this.dbcFault(data) === "FAULT") {
				this.queryType = 1;
				this.queryVariable(1);
				this.changeTab(1);
				this.dbcList = [];
			}
		},
		// 双击
		dblMount(item, index) {
			this.isdata = true;
			if (!this.selelctTreeData || this.selelctTreeData.isChild == 0) {
				this.$message.warning({
					message: "请选择协议数据项",
					duration: 2 * 1000,
				});
				return false;
			}
			// 判断是否存储 判断是否子节点
			if (
				this.selelctTreeData.isStorage == 1 && //是否储存0否1是
				this.selelctTreeData.isChild == 1 //是否子节点0否，1是
			) {
				// 判断DBC参数不可选故障码
				if (this.dbcFault(this.selelctTreeData) === "DBC") {
					if (item.faultCode) {
						this.$message.warning({
							message: "当前节点匹配渠道为DBC参数列表时,不能选择故障码",
							duration: 2 * 1000,
						});
						return false;
					}
				}
				// 判断故障码不可选DBC参数
				if (this.dbcFault(this.selelctTreeData) === "FAULT") {
					if (item.serial) {
						this.$message.warning({
							message: "当前节点匹配渠道为故障码列表时,不能选择DBC参数",
							duration: 2 * 1000,
						});
						return false;
					}
					if (this.selelctTreeData.label != item.faultName) {
						this.$message.warning({
							message:
								"当前节点匹配渠道为故障码列表时,故障码名称必须和节点名称匹配",
							duration: 2 * 1000,
						});
						return false;
					}
				}
				// 判断是否单选
				if (this.selelctTreeData.isSingle === 1) {
					if (
						this.selelctTreeData.children &&
						this.selelctTreeData.children.length > 0
					) {
						this.$message.warning({
							message: "当前节点为单选",
							duration: 2 * 1000,
						});
						return false;
					}
				} else if (this.selelctTreeData.isSingle === 0) {
					if (
						this.selelctTreeData.children &&
						this.selelctTreeData.children.constructor === Array
					) {
						const num = this.selelctTreeData.children.findIndex((e) => {
							return e.label === (item.variableName || item.faultCode);
						});
						if (num > -1) {
							this.$message.warning({
								message:
									this.dbcFault(this.selelctTreeData) === "DBC"
										? "请勿配置相同的DBC参数或故障码"
										: "请勿配置相同的故障参数",
								duration: 2 * 1000,
							});
							return false;
						}
					}
				}
				item.showColor = true;
				if (item.variableName) {
					this.$set(this.dbcList, index, item);
				}
				if (item.faultCode) {
					this.$set(this.faultList, index, item);
				}

				const deleteId = (item.serial || item.faultCode) + "";
				this.append(
					this.selelctTreeData,
					item.variableName || item.faultName + "--" + item.faultCode,
					deleteId
				);
				this.saveList.push({
					id: this.selelctTreeData.id,
					label: item.variableName || item.faultCode,
					deleteId,
				});
				const saveMappedIndex = this.saveMapped.findIndex(
					(d) => this.selelctTreeData.id === d.id
				);
				this.saveMapped[saveMappedIndex].alarmType = item.faultCode ? 1 : 2;
				if (this.saveMapped[saveMappedIndex].checkValue) {
					this.saveMapped[saveMappedIndex].checkValue =
						this.saveMapped[saveMappedIndex].checkValue + "," + item.serial ||
						item.faultCode;
				} else {
					this.saveMapped[saveMappedIndex].checkValue = deleteId;
				}
			}
		},
		// 判断是DBC参数还是故障码参数
		dbcFault(item) {
			if (item.variableType === 0) {
				return "DBC";
			} else if (item.variableType === 1) {
				if (item.searchChannel === 0) {
					return "DBC";
				} else if (item.searchChannel === 1) {
					return "FAULT";
				}
			}
		},
		// 改变DBC,故障码tab颜色
		changeTab(index) {
			for (let i = 0; i < this.navTabItem.length; i++) {
				if (i === index) {
					this.navTabItem[i].isSelect = true;
				} else {
					this.navTabItem[i].isSelect = false;
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
p,
h3,
ul,
li {
	margin: 0;
	padding: 0;
}
.tip-info {
	padding: 0 0 15px 0;
	font-family: Microsoft YaHei;
	font-weight: bold;
}
.row-box {
	.config-center-box {
		box-sizing: border-box;
		border-radius: 10px;
		position: relative;
		.config-center-box-title {
			height: 40px;
			line-height: 40px;
			&.config-center-box-titel-p {
				text-indent: 18px;
				font-weight: 700;
				&::before {
					content: "";
					width: 3px;
					height: 1em;
					position: absolute;
					display: block;
					top: 13px;
					left: 10px;
				}
			}
		}
		.config-center-protocolist {
			height: calc(100vh - 220px);
			.nav-tab {
				padding-top: 5px;
				position: relative;
				.nav-tab-item {
					padding: 0 10px;
					width: 78px;
					text-align: center;
					height: 28px;
					cursor: pointer;
					display: inline-block;
					margin-left: 5px;
					font-size: 13px;
					border-radius: 4px 4px 0 0;
					span {
						line-height: 30px;
					}
					&.is-active {
						position: relative;
						&::before {
							content: "";
							width: 100%;
							height: 2px;
							position: absolute;
							display: block;
							bottom: -2px;
							left: 0;
						}
					}
				}
			}
			.item-list {
				padding: 0 10px;
				li {
					padding: 10px 0;
					font-size: 13px;
					cursor: pointer;
					word-break: break-all;
					.item-list-span {
						padding: 0 1em;
					}
				}
			}
		}
	}
}
.search_list {
	.el-form-item {
		margin-bottom: 0;
	}
}
.cssdata {
	width: 100%;
	display: block;
	white-space: normal;
	word-wrap: break-word;
	overflow: hidden;
}
</style>
