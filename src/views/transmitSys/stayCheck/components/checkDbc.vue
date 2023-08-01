<template>
	<app-drawer
		:visibles="visible"
		:title="'DBC配置信息'"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
		width="70%"
	>
		<div slot="drawerContent">
			<div class="tip-info">
				<p class="black80">DBC名称:{{ fullName }}</p>
			</div>
			<el-row
				:gutter="10"
				class="row-box"
				type="flex"
				justify="middle"
				align="center"
			>
				<el-col :span="15">
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
															: 'unset',
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
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="handleSubmit(0)">审核通过</el-button>
				<el-button type="primary" @click="handleSubmit(1)">退回</el-button>
			</span>
		</div>
	</app-drawer>
</template>

<script>
import {
	getProtocolVariable,
	getDbcConfig,
	getDbcTaskLog,
	approvalDbcTask,
} from "@/api/transmitSys/stayConfig";
export default {
	name: "check",
	props: {
		visible: {
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
			saveList: [],
			postList: [],
			logList: [],
		};
	},
	watch: {
		visible(e1, e2) {
			if (e1) {
				const { protocolId } = this;
				// 协议数据项树请求参数
				const variableData = { protocolId };
				this.getDbcTaskLog();
				getProtocolVariable(variableData).then(({ data }) => {
					if (data.code === 0 && data.data) {
						this.treeData = data.data;
						this.filterTreeData(data.data);
						this.getDbcConfig();
					}
				});
			}
		},
	},
	methods: {
		restData() {
			this.treeData = [];
			this.saveList = [];
			this.postList = [];
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
			}
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
			const { taskId } = this;
			const data = {
				taskId,
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
			//获取随机数
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
		checkChange(data, node) {
			// 返回被选中的叶子节点
			const listId = this.$refs.tree.getCheckedKeys(true);
			// 返回目前被选中的节点
			const itemList = this.$refs.tree.getCheckedNodes();
			// 新的id数组
			let newIdList = [];
			const labelArr = [];
			for (let i = 0; i < listId.length; i++) {
				newIdList.push(listId[i]);
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
		// 0.审核通过 1.退回
		handleSubmit(e) {
			const postData = {
				taskId: this.taskId,
				operateType: e,
				operateVariables: this.postList,
			};
			approvalDbcTask(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message.success({
							message: e === 1 ? "退回成功" : "审核通过",
							duration: 2 * 1000,
						});
						this.restData();
						this.$parent.listLoad();
						this.$emit("update:visible", false);
					}
				})
				.catch(() => {
					this.$message.success({
						message: e === 1 ? "退回失败" : "审核失败",
						duration: 2 * 1000,
					});
				});
			this.closeDialog();
		},
		// 关闭
		closeDialog() {
			this.restData();
			this.$emit("update:visible", false);
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
