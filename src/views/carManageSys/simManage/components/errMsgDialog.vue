<template>
	<app-dialog
		:visibles.sync="visibles"
		width="60%"
      top="5vh"
		:title="'异常信息'"
		@close-dialog="closeDialog"
		 :isFooter="false"
		 class="ordinary"
	>
		<!-- table -->
		<div slot="formContent">
			<div v-if="errorArr"  style="max-height:65vh;">
				<template v-for="(item, index) in errorArr">
					<p
						:key="index"
						v-if="item['导入成功'] >= 0 && item['导入失败'] >= 0"
						class="sim-import-result"
					>
						导入成功{{ item["导入成功"] }}条，导入失败{{ item["导入失败"] }}条
					</p>
				</template>
				<ul class="all-content-info all-statistics-info" v-if="showLi">
					<li class="table-header flex-li">
						<p>
							VIN码
						</p>
						<div class="table-border-p-left">
							<p>
								ICCID
							</p>
							<p class="table-border-p-left">
								失败原因
							</p>
						</div>
					</li>
					<div class="statistics-scroll EmergencyContact">
						<template v-for="(item, index) in errorArr">
							<li
								:key="index"
								v-if="item.vin || item.message"
								class="flex-li content-info-li"
							>
								<p>
									{{ item.vin }}
								</p>
								<div class="table-border-p-left">
									<p>
										{{ item.iccid }}
									</p>
									<p class="table-border-p-left">
										{{ item.message }}
									</p>
								</div>
							</li>
						</template>
					</div>
				</ul>
				<p v-else style="text-align:center;padding-bottom:10px;">暂无失败数据</p>
			</div>
			<div v-else>
				<p style="text-align:center;padding-bottom:10px;">暂无数据</p>
			</div>
		</div>
	</app-dialog>
</template>

<script>
// request
export default {
	name: "exportDataDrawer",

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

	data() {
		return {
			errorArr: [],
			showLi:false,
		};
	},
	computed: {},
	watch: {
		visibles(e1) {
			if (e1) {
				this.errorArr = JSON.parse(this.data.errorCondition);
				this.showLi=false
				this.errorArr.forEach(i=>{
					if(i['导入失败'] > 0){
						this.showLi=true
					}
				})
				console.log(this.errorArr,"this.errorArr")
			}
		},
	},
	mounted() {},
	methods: {
		closeDialog() {
			this.$emit("update:visibles", false);
		},
		// 关闭dialog
		dialogVisible() {
			this.closeDialog();
		},
		// 点击取消
	},
};
</script>

<style lang="scss" scoped>
$border_color: #ebeef5;
p {
  margin: 0;
}
.sim-import-result {
  height: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  .iconfont{
    color: #999;
  }
  .green{
    color: #25ca4e;
  }
  .red{
    color: #ff0000;
  }
}
.all-content-info {
  padding: 0;
  margin: 0;
  .flex-li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
		div{
			display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				// flex: 2;
				// text-align-last: center;
				width: 66%;
				p {
					text-align-last: center;
					flex: 1;
				}
			}
			p {
				text-align-last: center;
				width: 34%;
			}
    .table-border-p-left {
      border-left: 1px solid $border_color
    }
  }
  .statistics-scroll {
    overflow: auto;
    max-height: calc( 65vh - 60px );
  }
  .content-info-li {
    font-size: 13px;
    color: #999;
    border-bottom: 1px solid $border_color;
    border-left: 1px solid $border_color;
    border-right: 1px solid $border_color;
    p {
      padding: 10px 25px;
    }
  }
  .table-header {
    height: 35px;
    // background: #f5f4f7;
    font-size: 12px;
    border: 1px solid $border_color;
    p {
      height: 35px;
      line-height: 35px;
      // padding: 10px 0;
    }
  }
}
</style>
