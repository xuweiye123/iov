<template>
	<!-- 三级故障报警 -->
	<div class="three-level-fault">
		<div class="three-level-fault-cars">
			<div class="three-level-head">
				<div class="three-level-head-content">
					<img style="width:25px;height:25px;margin-left: 20px;" src="../../../../assets/faultImage/icon_sjgzbj.png" alt="">
					<span class="three-level-head-txt">
						三级故障报警
					</span>
				</div>
				<!-- <div class="three-level-head-right">
          <img style="height:45px;" src="../../../../assets/faultImage/img_new.png" alt="">
				</div> -->
				<img style="height:45px;float:right;" src="../../../../assets/faultImage/img_new.png" alt="">
			</div>
			<el-table
			  v-loading="listLoading"
				:data="list"
				:max-height="tableHeight"
				size="mini"
				:header-row-style="{ height: '40px' }"
				fit
				highlight-current-row
				:header-cell-style="{ background: '#043355', color: '#00A0E9' }"
				style="width: 100%"
				@row-click="rowClick"
			>
				<el-table-column
					prop="licensePlate"
					align="center"
					label="车牌号码"
				></el-table-column>
				<el-table-column
					prop="faultCode"
					align="center"
					label="故障码"
				></el-table-column>
				<el-table-column
					prop="startTime"
					align="center"
					min-width="130"
					label="开始时间"
				></el-table-column>
			</el-table>
			<div
				:class="[
					total > 0 ? 'visible' : 'hidden',
					'pagination-container',
				]"
			>
				<el-pagination
					:current-page="listQuery.pageNum"
					:total="total"
					:pager-count="5" 
					background
					layout="total,prev, pager, next"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
		<!-- 	style="width:300px" -->
		
	</div>
</template>

<script>
import { get3LevelFaultPageList } from "@/api/carMonitorSys/fullscreenFault";
import { otherHeight } from "@/mixins/getOtherHeight";

export default {
	name: "levelThreeFault",
	mixins: [otherHeight],
	data() {
		return {
			listQuery: {
				pageNum: 1,
				pageSize: 10,
			},
			total: 0,
			list: [],
			listLoading:false,
		};
	},
	created() {
		this.listLoad();
	},
	mounted() {
		const otherHeight = this.getFault4Height();
		const self = this;
		this.$nextTick(() => {
			this.tableHeight = window.innerHeight - otherHeight;
		});
		window.onresize = function() {
			const otherHeight = self.getFault4Height();
			self.$nextTick(() => {
				self.tableHeight = window.innerHeight - otherHeight;
			});
		};
	},
	methods: {
		handleCurrentChange(value) {
			this.listQuery.pageNum = value;
			this.listLoad();
		},
		listLoad() {	
			this.listLoading = true;
			get3LevelFaultPageList(this.listQuery).then(({ data }) => {
				this.list = [];
				this.listLoading = false;
				if (data.code === 0) {
					this.list = data.data || [];
					this.total = data.total;
				}
			}).catch(() => {
				this.listLoading = false;
			});
		},
		rowClick(row, column) {
			this.$emit("row-click", row, column);
		},
	},
};
</script>

<style lang="scss" scoped>
.three-level-fault {
	width: 330px;
	height: 100%;
	.three-level-fault-cars {
		background: rgba(0, 90, 139, 0.2);
	  height: calc(100vh - 100px);
		position: absolute;
		border-radius: 4px;
		border:1px solid #03304f !important;
		width: 330px;
		overflow: hidden;
		.three-level-head {
			display: flex;
			justify-content: space-between;
			position: relative;
			height: 45px;
			background: #005A8B;
			// height: 40px;
			// width: 60px;
			background: url("../../../../assets/faultImage/icon_gzbj.png") no-repeat;
			background-size:60px 40px;
			background-position:right 5px;
			
			.three-level-head-content {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 45px;
				// background: url("../../../../assets/faultImage/icon_gztb.png") no-repeat;
				// background-position: 0 -193px;
				.three-level-head-txt {
					font-size: 14px;
					font-family: Microsoft YaHei;
					font-weight: 400;
					color: #FFF;
					margin-left: 10px;
				}
			}
			// .three-level-head-right{
			// 	height: 40px;
			// 	// width: 60px;
			// 	background: url("../../../../assets/faultImage/icon_gzbj.png") no-repeat;
			// 	background-size: 100% 100%;
			// 	background-position: 5px 5px 0 0;
			// }
		}
	}
}
</style>
