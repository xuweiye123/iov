<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<el-form
					:label-position="'right'"
					:model="listQuery"
					label-width="65px"
				>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="VIN码：">
								<vin-select :is-vin="true" @vinNoTotal="getVinNoTotal" v-model="listQuery.vin" />
							</el-form-item>
						</el-col>
						<el-col :span="12">
              <el-form-item label="时间范围：" prop="timeRange">
                <el-date-picker
                  v-model="listQuery.timeRange"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  unlink-panels
									:picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
						<!-- <el-col :span="6">
							<el-form-item label="开始时间：" prop="beginTime">
								<el-date-picker
									v-model="listQuery.beginTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="00:00:00"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="结束时间：" prop="endTime">
								<el-date-picker
									v-model="listQuery.endTime"
									type="datetime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="请选择"
									default-time="23:59:59"
								>
								</el-date-picker>
							</el-form-item>
						</el-col> -->
						<el-col v-show="collapse" :span="6">
							<el-form-item label="远控类型：">
								<el-select
									v-model="listQuery.remoteType"
									placeholder="请选择"
									filterable
									clearable
								>
									<el-option
										v-for="(item, index) in cmdTypeList"
										:key="index"
										:label="item.text"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row
						v-show="listQuery.remoteType == 0"
						:gutter="10"
					>
						<el-col v-show="collapse" :span="6">
							<el-form-item label="命令类型：">
								<el-select
									v-model="listQuery.commandType"
									placeholder="请选择"
									filterable
									clearable
								>
									<el-option
										v-for="(item, index) in commandTypeList"
										:key="index"
										:label="item.text"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row
						v-show="collapse && listQuery.remoteType != 0"
						:gutter="10"
					>
						<el-col :span="6">
							<el-form-item label="占位符" style="visibility: hidden">
								<el-input />
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				@click-collapse="handleCollapse"
				@click-filter="handleFilter"
				@click-clear="handleClearSearch"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-filter="showfilter = true"
				@click-export="handleExport"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
				/>
			</app-authorize-button>
			<!-- table -->
			<app-table
				:listLoading="listLoading"
				size="mini"
				:isTableSelection="false"
				:list="list"
				:pageObj="listQuery"
				:isTableNumber="true"
				:filterTableList="filterTableList"
				:total="total"
				:tableHeights="tableHeight"
				@row-click="rowClick"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span class="vinno" v-if="scope.item.prop === 'vin'">
						{{ scope.row[scope.item.prop] | processData }}
					</span>
					<span v-else-if="scope.item.prop === 'remoteType'">
						{{
							scope.row[scope.item.prop] == 0
								? "远程控制"
								: scope.row[scope.item.prop] == 1
								? "远程设置"
								: "状态查询"
						}}
					</span>
					<span v-else-if="scope.item.prop == 'direct'">
						{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 详情 -->
		<detail-drawer :visibles.sync="vinShow" :data="tableRow" />
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDaysBetween } from "@/utils/base";
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// 组件
import detailDrawer from "./components/detailDrawer";
// request
import { getPageList, exportCommandLogList } from "@/api/carControlSys/appLog";
export default {
	name: "appLog",
	doNotInit: true,
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	components: { detailDrawer },
	filters: {
		switchText(val, type) {
			if (type === "direct") {
				return val == 1 ? "上行" : val == 0 ? "下行" : "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
		remoteType(e) {
			switch (e) {
				case 0:
					return "远程控制";
				case 1:
					return "远程设置";
				case 2:
					return "状态查询";
			}
		},
	},
	data() {
		return {
			listQuery: {
				vin: "",
				remoteType: 0,
				commandType: "",
				// beginTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
			},
			commandTypeList: [
				{ text: "未知命令", value: "未知命令" },
				{ text: "车窗开度控制", value: "车窗开度控制" },
				{ text: "车门闭锁/解锁控制", value: "车门闭锁/解锁控制" },
				{ text: "空调开启/关闭控制", value: "空调开启/关闭控制" },
				{ text: "除霜开启/关闭控制", value: "除霜开启/关闭控制" },
				{ text: "寻车控制", value: "寻车控制" },
				{ text: "座椅控制", value: "座椅控制" },
				{ text: "设置空调温度", value: "设置空调温度" },
				{ text: "查询车辆状态", value: "查询车辆状态" },
			],
			vinShow: false,
			tableList: [
				{
					value: "VIN码",
					prop: "vin",
					width: 170,
					checked: true,
				},
				{
					value: "远控类型",
					prop: "remoteType",
					width: 100,
					checked: true,
				},
				{
					value: "命令类型",
					prop: "commandType",
					width: 180,
					checked: true,
				},
				{
					value: "指令token",
					prop: "businessToken",
					width: 200,
					checked: true,
				},
				{
					value: "命令结果",
					prop: "message",
					width: 200,
					checked: true,
				},
				{
					value: "命令时间",
					prop: "createTime",
					checked: true,
					width: 140,
				},
			],
			cmdTypeList: [
				{ text: "远程控制", value: 0 },
				{ text: "远程设置", value: 1 },
				{ text: "状态查询", value: 2 },
			],
			detailVisible: false,
			selectDate:'',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate? minDate.getTime():''
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
         if (this.selectDate !== '') {
            const one = 0 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
		};
	},
	computed: {
		
	},
	mounted() {},
	methods: {
		handleClearSearch() {
			this.listQuery = {
				vin: "",
				remoteType: 0,
				commandType: "",
				// beginTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
				pageSize: 10,
				pageNum: 1,
			};
			this.list = [];
			this.total = 0;
		},
		// 加载数据
		listLoad() {
			if (!this.listQuery.vin) {
				this.$message.warning({
					message: "请输入VIN码",
					duration: 2 * 1000,
				});
				return;
			}
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''

			if (!String(this.listQuery.remoteType)) {
				this.$message.warning({
					message: "请选择远控类型",
					duration: 2 * 1000,
				});
				return;
			}
			if(this.listQuery.remoteType!=0){
        this.listQuery.commandType=null
			}
			this.listLoading = true;
			getPageList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.tableRow = {};
						this.total = data.total || 0;
						this.list = data.data;
						if (this.list) {
							this.list.map(
								(e) =>
									(e.createTime = new Date(e.createTime).format(
										"yyyy-MM-dd hh:mm:ss"
									))
							);
						}
					}else{
						this.list=[]
						this.total=0
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 点击列
		rowClick({ row, column }) {
			if (row) this.tableRow = row;
			const label = column.label;
			if (label === "VIN码") {
				this._vinData();
			}
		},
		_vinData() {
			this.vinShow = true;
		},
		handleExport() {
			if (!this.listQuery.vin) {
				this.$message.warning({
					message: "请输入VIN码",
					duration: 2 * 1000,
				});
				return;
			}
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			
			if (!String(this.listQuery.remoteType)) {
				this.$message.warning({
					message: "请选择远控类型",
					duration: 2 * 1000,
				});
				return;
			}
			if(this.listQuery.remoteType!=0){
        this.listQuery.commandType=null
			}
			this.exportLoading = true;
			exportCommandLogList(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "导出成功",
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss" scoped></style>