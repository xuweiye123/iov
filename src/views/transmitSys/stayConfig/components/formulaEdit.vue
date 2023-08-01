<template>
	<el-dialog
		custom-class="dialogBox"
		v-if="innerVisible"
		v-el-drag-dialog
		:visible.sync="innerVisible"
		:before-close="closeDia"
		:close-on-click-modal="false"
		:lock-scroll="false"
		:show-close="false"
		:append-to-body="true"
		width="60%"
		top="5vh"
		class="ordinary"
	>
		<div slot="title" class="custom-dialog-header">
			<span class="custom-dialog-header-title">
				<span class="title-style"></span>
				<span style="margin-left: 3px">编辑公式</span>
			</span>
			<span @click="closeDia" class="custom-dialog-header-close">
				<i class="iconfont icon-close"></i>
			</span>
		</div>
		<el-row>
			<el-col :span="10">
				<el-form :label-position="'right'" label-width="80px">
					<el-form-item label="选择公式：">
						<el-select
							v-model="formula"
							placeholder="请选择"
							filterable
							clearable
							@change="selectChange"
						>
							<el-option
								v-for="(item, index) in formulaList"
								:key="index"
								:label="item.formulaName"
								:value="item.formulaId"
							/>
						</el-select>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="12">
				<div class="black80 formula-title">
					<p>入口参数</p>
				</div>
				<div class="dbcClass left-params">
					<div class="left-params-top">
						<ul>
							<li
								v-for="(item, index) in formulaParamList"
								v-show="showHeader === 2"
								:key="index"
								:style="{
									background: item.isSelect ? '#eef4fe' : 'transparent',
								}"
								class="left-params-top-header"
								@click="switchParams(item, index)"
							>
								<span>{{ item.formulaParam }}：</span>
								<el-input
									v-model="enterParams['data' + item.formulaParam]"
									:style="{ width: '80%' }"
									disabled
								/>
							</li>
						</ul>
						<p v-show="showHeader === 1" style="text-indent: 2em">
							没有入口参数
						</p>
					</div>
					<div class="dbcClass left-params-bottom">
						<p v-show="outputFormula" style="text-indent: 2em">
							输出公式:{{ outputFormula }}
						</p>
					</div>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="formula-title">
					<div>
						<el-row :gutter="10">
							<el-col :span="18">
								<el-form :label-position="'right'" label-width="110px">
									<el-form-item label="DBC参数查询：">
										<el-input
											v-model="searchQuery1"
											size="mini"
											placeholder="请输入DBC参数查询"
											clearable
										/>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="6">
								<div>
									<el-button
										type="primary"
										size="mini"
										clearable
										@click="handleSearch"
										>查询</el-button
									>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="dbcClass right-list">
					<el-scrollbar
						style="height: 100%"
						wrap-class="default-scrollbar__wrap"
					>
						<ul class="dbcClass item-list">
							<li
								v-for="(item, index) in dbcList"
								:key="index"
								@dblclick="dblMount(item, index)"
							>
								<span>{{ index + 1 }}</span
								>&nbsp;&emsp;<span :class="item.showColor ? 'textColor' : ''">{{
									item.variableName
								}}</span>
							</li>
						</ul>
					</el-scrollbar>
				</div></el-col
			>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleCancel">取 消</el-button>
			<el-button type="primary" @click="save">保存</el-button>
		</span>
	</el-dialog>
</template>
<script>
import { getDbcVariable } from "@/api/transmitSys/stayConfig";
export default {
	name: "FormulaEdit",
	props: {
		innerVisible: {
			type: Boolean,
			default: false,
		},
		variableId: {
			type: [String, Number],
			default: "",
		},
		searchQuery: {
			type: String,
			default: "",
		},
		dbcId: {
			type: [Number, String],
			default: 0,
		},
		list: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			formulaList: [],
			formula: "",
			dbcList: [],
			selectFormula: null,
			outputFormula: "",
			formulaParamList: [],
			formulaParamObj: {},
			enterParams: {},
			postItem: {},
			searchQuery1: "",
		};
	},
	computed: {
		showHeader() {
			if (!this.selectFormula) {
				return 0;
			}
			if (this.selectFormula.formulaParam === undefined) {
				return 1;
			}
			return 2;
		},
	},
	watch: {
		innerVisible(e1, e2) {
			if (e1 && this.innerVisible) {
				this.searchQuery1 = this.searchQuery;
				this.handleSearch();
				// 过滤规则先匹配variableId，variableId===''时表明为通用公式
				this.formulaList = this.list.filter((item) => {
					return this.variableId === item.variableId || item.variableId === "";
				});

				this.formula = this.formulaList[0] ? this.formulaList[0].formulaId : "";
				this.selectChange(this.formula);
			}
		},
	},
	methods: {
		restData() {
			this.formulaList = [];
			this.dbcList = [];
			this.selectFormula = null;
			this.outputFormula = "";
			this.formulaParamList = [];
			this.enterParams = {};
			this.formulaParamObj = {};
			this.postItem = {};
			this.formula = "";
		},
		closeDia() {
			this.restData();
			this.$emit("update:innerVisible", false);
		},
		handleCancel() {
			this.restData();
			this.$emit("update:innerVisible", false);
		},
		save() {
			const parent = this.$parent.$parent.$parent;
			if (this.showHeader === 0) {
				this.$message.error({
					message: "请选择公式",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.showHeader === 1) {
				this.$message.error({
					message: "没有入口参数",
					duration: 2 * 1000,
				});
				return;
			}
			const itemList = [];
			for (const o in this.postItem) {
				itemList.push(this.postItem[o]);
			}
			if (itemList.length !== this.formulaParamList.length) {
				this.$message.error({
					message: "请选择参数",
					duration: 2 * 1000,
				});
				return;
			}
			// 改变父级颜色
			for (let i = 0; i < itemList.length; i++) {
				for (let j = 0; j < parent.dbcList.length; j++) {
					if (parent.dbcList[j].variableId === itemList[i].variableId) {
						parent.dbcList[j].showColor = true;
						this.$set(parent.dbcList, j, parent.dbcList[j]);
						break;
					}
				}
			}
			// 更新saveMapped
			const checkValues = itemList.map((obj) => obj.serial).join(",");
			const index = parent.saveMapped.findIndex(
				(item) => parent.selelctTreeData.id === item.id
			);
			parent.saveMapped[index].checkValue = checkValues;
			parent.saveMapped[index].formulaValue = this.selectFormula.formulaValue;
			// 更新saveList
			parent.saveList.push({
				id: parent.selelctTreeData.id,
				label: this.outputFormula,
				deleteId: checkValues,
			});
			parent.append(parent.selelctTreeData, this.outputFormula, checkValues, 1);
			this.$emit("update:innerVisible", false);
			this.restData();
		},
		handleSearch() {
			const data = {
				dbcId: this.dbcId,
				queryCondition: this.searchQuery1,
			};
			getDbcVariable(data).then(({ data }) => {
				this.dbcList = [];
				if (data.code === 0) {
					if (!data.data) {
						this.$message.warning({
							message: "暂无数据",
							duration: 2 * 1000,
						});
					}
					this.dbcList = data.data;
				}
			});
		},
		// 选择公式
		selectChange(e) {
			if (!e) {
				this.selectFormula = null;
				return;
			}
			this.enterParams = {};
			this.postItem = {};
			this.selectFormula = this.formulaList.find(
				(item) => item.formulaId === e
			);
			const formulaParamArrs = this.selectFormula.formulaParam.split(",");
			const o1 = [];
			const o2 = {};
			for (let i = 0; i < formulaParamArrs.length; i++) {
				o1.push({
					formulaParam: formulaParamArrs[i],
					isSelect: i === 0,
				});
				o2[formulaParamArrs[i]] = formulaParamArrs[i];
			}
			// 入口公式参数列表
			this.formulaParamList = o1;
			// 入口公式参数对象
			this.formulaParamObj = o2;
			// 当前点击的入口参数
			this.enterParams.formulaParam = o1[0].formulaParam;
			// 显示公式
			this.outputFormula = this.selectFormula.formulaText;
		},
		// 选择入口参数
		switchParams(item, index) {
			this.enterParams.formulaParam = item.formulaParam;
			for (let i = 0; i < this.formulaParamList.length; i++) {
				if (index === i) {
					this.formulaParamList[i].isSelect = true;
				} else {
					this.formulaParamList[i].isSelect = false;
				}
			}
		},
		// 双击添加入口参数
		dblMount(item, index) {
			if (this.showHeader === 0) {
				this.$message.error({
					message: "请选择公式",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.showHeader === 1) {
				this.$message.error({
					message: "没有入口参数",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.showHeader === 2) {
				// 设置input值
				this.$set(
					this.enterParams,
					"data" + this.enterParams.formulaParam,
					item.variableName
				);
				this.formulaParamObj[this.enterParams.formulaParam] = this.enterParams[
					"data" + this.enterParams.formulaParam
				];
				this.postItem[this.enterParams.formulaParam] = item;
				// 修改显示公式
				let text = this.selectFormula.formulaText;
				for (let i = 0; i < this.formulaParamList.length; i++) {
					text = text.replace(
						this.formulaParamList[i].formulaParam,
						this.formulaParamObj[this.formulaParamList[i].formulaParam]
					);
				}
				this.outputFormula = text;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
ul {
	margin: 0;
	padding: 0;
}
.formula-title {
	p {
		margin: 0;
		line-height: 40px;
		font-weight: 700;
		text-align: center;
	}
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.left-params {
	height: 300px;
	border: 1px solid;
	// box-shadow: 0 0 0.5px 0.5px rgba(162, 197, 255, 0.5);
	.left-params-top {
		height: 200px;
		.left-params-top-header {
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			span {
				margin-right: 1em;
			}
		}
	}
	.left-params-bottom {
		border-top: 1px solid;
		padding-top: 15px;
		// border-top: 1px solid #d9e7ff;
		// box-shadow: 0 0 0.5px 0.5px rgba(162, 197, 255, 0.5);
		// height: 100px;
	}
}
.right-list {
	height: 300px;
	border: 1px solid;
	//  border: 1px solid #d9e7ff;
	// box-shadow: 0 0 0.5px 0.5px rgba(162, 197, 255, 0.5);
}
.item-list {
	padding: 0 10px;
	li {
		padding: 10px 0;
		text-indent: 1em;
		font-size: 13px;
		cursor: pointer;
		word-break: break-all;
		// &:nth-child(even) {
		//   background: #eef4fe;
		// }
		// &:nth-child(odd) {
		//   background: #fff;
		// }
	}
}
.el-form-item {
	margin-bottom: 0;
}
</style>
