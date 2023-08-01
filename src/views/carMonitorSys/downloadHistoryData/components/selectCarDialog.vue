<template>
  <app-dialog
    :visibles.sync="visibles"
    width="80%"
    top="6vh"
    :title="'双击选择车辆'"
    @close-dialog="closeDialog"
    @handle-submit="submit"
  >
    <!-- table -->
    <div slot="formContent">
      <app-search :show-title="false">
        <div slot="content">
          <!-- <seach-form
            :spanNumber="8"
            :collapse="collapse"
            :listQuery="listQuery"
            :searchList="searchList"
          /> -->
          <el-form
						:label-position="'right'"
						:model="listQuery"
						label-width="60px"
					>
						<el-row :gutter="10" type="flex" justify="start" align="middle">
							<el-col :span="8">
								<el-form-item label="VIN码：">
									<vin-select
										:is-vin="true"
										customClass="vin-select-dialog"
										v-model="listQuery.vinNo"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="终端编号：">
									<el-input
										v-model="listQuery.terminalCode"
										placeholder="请输入终端编号"
										clearable
									/>
								</el-form-item>
							</el-col>
							<el-col :span="8"  v-show="collapse">
								<el-form-item label="车型名称：">
									<el-select
										v-model="listQuery.carTypeId"
										placeholder="请选择"
										@change="carTypeChange"
										@clear="carTypeClear"
										filterable
										clearable
									>
										<el-option
											v-for="(item, index) in carTypeList"
											:key="index"
											:label="item.carTypeName"
											:value="item.carTypeId"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-show="collapse">
							<el-col :span="8" v-show="collapse">
								<el-form-item label="项目代号：">
									<el-select
										v-model="listQuery.carBatchId"
										placeholder="请先选择车型名称"
										@change="change"
										filterable
										clearable
									>
										<el-option
											v-for="(item, index) in batchCodeList"
											:key="index"
											:label="item.carBatchCode"
											:value="item.carBatchId"
										/>
									</el-select>
								</el-form-item>
					  	</el-col>
						</el-row>
					</el-form>
        </div>
        <!-- 清空按钮 -->
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <div class="section-wrap">
        <app-authorize-button @click-filter="showfilter = true">
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="tableList"
            :scroll-line="8"
          />
        </app-authorize-button>
        <app-table
          ref="tableList"
          size="mini"
          :listLoading="listLoading"
          :isTableSelection="false"
          :list="list"
          :pageObj="listQuery"
          :isTableNumber="true"
          :filterTableList="filterTableList"
          :total="total"
          :tableHeights="tableHeight"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'carvehicle'">{{
              scope.row[scope.item.prop] | carType
            }}</span>
            <span v-else>
              {{ scope.row[scope.item.prop] | processData }}
            </span>
          </template>
        </app-table>
      </div>
    </div>
    <!-- </template> -->
  </app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request
import { getCarTypeInfo, getBatchCodeInfo } from "@/api/carManageSys/carInform";
import { getChooseCar } from "@/api/carMonitorSys/downloadHistory";
export default {
  name: "selectCarDialog",
  mixins: [pagingMixin, dialogOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    carType(e) {
      switch (e) {
        case 1:
          return "商品车";
        case 2:
          return "试验车";
        case 3:
          return "对标车";
      }
    },
  },
  data() {
    return {
      listQuery: {
        vinNo: "",
        terminalCode: "",
        carTypeName: "",
        carBatchCode: "",
      },
      tableList: [
        { value: "VIN码", prop: "vinNo", checked: true, width: 200 },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width: 120,
        },
        {
          value: "车型名称",
          prop: "carTypeName",
          checked: true,
          width: 120,
        },
        {
          value: "项目代号 ",
          prop: "carBatchCode",
          checked: true,
          width: 120,
        },
        {
          value: "营运区域 ",
          prop: "areaName",
          checked: true,
          width: 120,
        },
      ],
      batchCodeList: [],
      carTypeList: [],
      selectList: [],
    };
  },
  computed: {
    // searchList() {
    //   return [
    //     {
    //       label: "VIN码",
    //       value: "vinNo",
    //       type: "vin",
    //     },
    //     {
    //       label: "终端编号",
    //       value: "terminalCode",
    //       type: "input",
    //     },
    //     {
    //       label: "车型名称",
    //       value: "carTypeId",
    //       type: "select",
    //       options: {
    //         data: this.carTypeList,
    //         extraProps: {
    //           label: "carTypeName",
    //           value: "carTypeId",
    //         },
    //       },
    //     },
    //     {
    //       label: "项目代号",
    //       value: "carBatchId",
    //       type: "select",
    //       options: {
    //         data: this.batchCodeList,
    //         extraProps: {
    //           label: "carBatchCode",
    //           value: "carBatchId",
    //         },
    //       },
    //     },
    //   ];
    // },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.selectList = [...this.data];
      }
    },
    'listQuery.carTypeId':{
			handler(e1) {
				if (!e1) {
					this.listQuery.carBatchId = "";
					this.batchCodeList = [];
				}
			}
		}
  },
  mounted() {
    // getBatchAll().then(({ data }) => {
    //   if (data.code === 0) {
    //     this.batchCodeList = data.data || [];
    //   }
    // });
    getCarTypeInfo().then(({ data }) => {
      if (data.code === 0) {
        this.carTypeList = data.data || [];
      }
    });
  },
  methods: {
    change() {
			this.$forceUpdate();
		},
    // 清空车型名称
		carTypeClear() {
			this.listQuery.carBatchId = "";
			this.batchCodeList = [];
		},
		// 车型名称改变
		carTypeChange(e) {
			console.log(e,"111")
			this.listQuery.carBatchId = "";
			this.batchCodeList = [];
			if (!e) {
				return;
			}
			const postData = {
				carTypeId: e,
			};
			getBatchCodeInfo(postData).then(({ data }) => {
				if (data.code === 0) {
					this.batchCodeList = data.data || [];
				}
			});
		},
    // 关闭dialog
    closeDialog() {
      this.handleClear();
      this.collapse = false;
      this.$emit("update:visibles", false);
    },
    listLoad() {
      this.listLoading = true;
      getChooseCar(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    clickRow(row) {
      this.selectList = row;
    },
    rowDblclick(row) {
      this.selectList = row;
      this.$emit("select-complete", this.selectList);
      this.closeDialog();
    },
    // 提交按钮
    submit() {
      this.$emit("select-complete", this.selectList);
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped></style>
