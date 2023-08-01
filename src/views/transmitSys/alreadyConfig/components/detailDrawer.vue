<template>
	<app-drawer
		:visibles="visibles"
		:title="'DBC配置信息'"
		width="70%"
		@close-drawer="closeDialog"
		@ok-drawer="submitForm"
		confirmText0="退回"
	>
		<div slot="drawerContent">
			<div>
				<div class="tip-info">
					<p class="black80">DBC名称:{{ formInfo.fullName }}</p>
				</div>
				<el-row class="row-box" type="flex" justify="middle" align="center">
					<el-col :span="15" style="margin-right: 20px">
						<div class="config-center-box">
							<p
								class="config-center-box-title config-center-box-titel-p black80"
							>
								DBC配置明细
							</p>
							<div class="config-center-protocolist">
								<el-scrollbar
									style="height: 100%"
									wrap-class="default-scrollbar__wrap__config"
								>
									<el-tree
										class="dbcTree"
										ref="tree"
										:data="treeData"
										:expand-on-click-node="false"
										node-key="id"
										default-expand-all
										@check="checkChange"
									>
										<div
											slot-scope="{ node, data }"
											:style="{
												background: data.color ? data.color : 'none',
												'border-radius': '3px',
												padding: '7.5px 0px',
											}"
											:class="[
												data.color ? 'check-tree-hidden' : '',
												'custom-tree-node',
											]"
										>
											<div
												:style="{
													display: 'inline-block',
													padding: '0 5px',
													'box-sizing': 'content-box',
													'vertical-align': 'middle',
												}"
											>
												<div
													:style="{
														color:
															data.isStorage === 0
																? 'unset'
																: data.isFormula === 1
																? 'red'
																: data.variableType === 1 &&
																  data.searchChannel === 0
																? '#FF7F00'
																: '#unset',
													}"
													:title="node.label"
												>
													{{ node.label }}
												</div>
											</div>
										</div>
									</el-tree>
								</el-scrollbar>
							</div>
						</div>
					</el-col>

					<el-col :span="9">
						<div class="config-center-box dbc-center-box">
							<p
								class="config-center-box-title config-center-box-titel-p black80"
							>
								DBC审核记录
							</p>
							<div class="config-center-protocolist">
								<el-scrollbar
									style="height: 100%"
									wrap-class="default-scrollbar__wrap"
								>
									<ul class="item-list">
										<li v-for="(item, index) in logList" :key="index">
											<div class="item-list-span">
												<span>{{ item.operateDate }}</span>
												<span>{{ item.operateMessage }}</span>
											</div>
										</li>
									</ul>
								</el-scrollbar>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</app-drawer>
</template>

<script>
// request
import {
	getProtocolVariable,
	getDbcConfig,
	getDbcTaskLog,
	approvalDbcTask,
} from "@/api/transmitSys/stayConfig";
export default {
	name: "detailDrawer",
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.formInfo = { ...this.data };
					// 协议数据项树请求参数
					const variableData = { protocolId: this.formInfo.protocolId };
					this.getDbcTaskLog();
					getProtocolVariable(variableData).then(({ data }) => {
						if (data.code === 0 && data.data) {
							this.filterTreeData(data.data);
							this.getDbcConfig();
						}
					});
				}
			},
		},
	},
	data() {
		return {
			formInfo: {},
			treeData: [],
			saveList: [],
			postList: [],
			logList: [],
		};
	},
	methods: {
		// 关闭
		closeDialog() {
			this.formInfo = {};
			this.treeData = [];
			this.saveList = [];
			this.postList = [];
			this.$emit("update:visibles", false);
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
						treeData[index].children.length > this.formInfo.motorCount
					) {
						treeData[index].children.splice(
							this.formInfo.motorCount,
							treeData[index].children.length - this.formInfo.motorCount
						);
					}
				}
				this.treeData = treeData;
			}
		},
		// 获取DBC审核记录
		getDbcTaskLog() {
			const data = { taskId: this.formInfo.taskId };
			getDbcTaskLog(data).then(({ data }) => {
				if (data.code === 0 && data.data) {
					this.logList = data.data;
				}
			});
		},
		// 获取DBC配置信息
		getDbcConfig() {
			const data = {
				taskId: this.formInfo.taskId,
			};
			getDbcConfig(data).then(({ data }) => {
				if (data.code === 0 && data.data) {
					if (data.data.showValue) {
						this.saveList = JSON.parse(data.data.showValue);
						this.autoMountTree(this.treeData);
					}
				}
			});
		},
		// 自动添加节点到树上
		autoMountTree(o) {
			o.forEach((item) => {
				for (let i = 0; i < this.saveList.length; i++) {
					if (item.id === this.saveList[i].id) {
						this.append(
							item,
							this.saveList[i].label,
							this.saveList[i].deleteId
						);
					}
				}
				if (item.children && item.children.length > 0) {
					this.autoMountTree(item.children);
				}
			});
		},
		// 新增
		append(data, label, deleteId) {
			const random = Math.random()
				.toString(36)
				.substr(2, 8);
			const color = data.isFormula === 1 ? "rgb(123 214 123)" : "#a3c0e8";
			const newChild = {
				id: `${data.id}&` + random,
				label,
				showCheckBox: false,
				deleteId,
				color,
			};
			if (!data.children) {
				this.$set(data, "children", []);
			}
			data.children.push(newChild);
		},
		// 树节点change事件
		checkChange(data, node) {
			// 返回被选中的叶子节点
			const listId = this.$refs.tree.getCheckedKeys(true);
			// 返回目前被选中所有的节点
			const itemList = this.$refs.tree.getCheckedNodes();
			// 新的id数组
			let newIdList = [];
			const labelArr = [];
			for (let i = 0; i < listId.length; i++) {
				if (typeof listId[i] === "number") {
					newIdList.push(listId[i]);
				} else {
					newIdList.push(listId[i].split("&")[0] * 1);
				}
			}
			newIdList = Array.from(new Set(newIdList));
			for (let i = 0; i < newIdList.length; i++) {
				for (let j = 0; j < itemList.length; j++) {
					if (itemList[j].id === newIdList[i]) {
						labelArr.push(itemList[j].label);
						break;
					}
				}
			}
			this.postList = labelArr;
		},
		// 0.审核通过 1.待检查退回 2.已检查退回
		submitForm() {
			const postData = {
				taskId: this.formInfo.taskId,
				operateType: 2,
				operateVariables: this.formInfo.postList,
			};
			this.loading = true;
			approvalDbcTask(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$parent.listLoad();
						this.closeDialog();
						this.$emit("submit-complete");
					}
				})
				.catch((err) => {
					this.$message.warning({
						message: "退回失败",
						duration: 2 * 1000,
					});
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar {
	.el-scrollbar__wrap {
		max-height: calc(100vh - 122px); // 最大高度
		overflow-x: hidden; // 隐藏横向滚动栏
	}
}

p,
h3,
ul,
li {
	margin: 0;
	padding: 0;
}
.tip-info {
	padding: 0 0 15px 0;
	font-weight: 700;
}
.row-box {
	.config-center-box {
		border: 1px solid;
		box-sizing: border-box;
		border-radius: 4px;
		position: relative;
		.config-center-box-title {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid;
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
			margin-top: 1px;

			.nav-tab {
				padding-top: 5px;
				border-bottom: 2px solid;
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
</style>
