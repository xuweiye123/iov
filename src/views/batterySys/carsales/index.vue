<template>
  <div class="js-system-user app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear1"
        :isdisabled="listLoading"
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
        @click-import="importVisible = true"
        @click-import-car="handleImportCar"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>
      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :actionFixed="actionFixed"
        :isShowOperation="false"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'code'">
            <el-tag
              :type="
                scope.row.code == '初始'
                  ? 'info'
                  : scope.row.code == '成功'
                  ? 'success'
                  : scope.row.code == '失败'
                  ? 'danger'
                  : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] | processData
              }}
            </el-tag>
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
      <!--导入dialog弹窗-->
      <import-dialog
        ref="importDialog"
        action="api/battery/carsales/import"
        :template-url="
          'api/battery/fileStatics/ImportVehicleSalesInformationBatch.xlsx'
        "
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      />
      <!--导入结果dialog弹窗-->
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'VIN编码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
      />

      <!-- 导入查询 -->
      <import-dialog
        :action="'/api/battery/carsales/importVin'"
        :title="'导入查询'"
        :template-url="'api/battery/fileStatics/ImportVINInformation.xlsx'"
        :visibles.sync="importCarVisible"
        @upload-success="reloadCarList"
        :auto-upload="false"
      />
      <result-dialog
        :visibles.sync="resultCarVisible"
        :data="importResult"
        :text="'VIN码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        @export-fail="exportCarFail"
      />
    </div>
  </div>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
//引入导入组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import { getList, exportCarSales, exportCheck } from "@/api/batterySys/carsales";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
export default {
  name: "carsales",
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  components: { importDialog, resultDialog },
  computed: {
    searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo",
          inputEvent:this.clearVINno
				},
        {
					type: "input",
					label: "车牌号码",
					value: "carNumber",
          inputEvent:this.clearVINno
				},
        {
					type: "select",
					label: "上传状态",
          value:"code",
					options: {
            data: this.statusList
          },
				},
         {
					type: "input",
					label: "产品型号",
					value: "productModel",
          inputEvent:this.clearVINno
				},
         {
					type: "input",
					label: "车辆制造企业",
					value: "qualifications",
          inputEvent:this.clearVINno
				}
			];
		},
  },
  data() {
    return {
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "180px",
          checked: true,
        },
        {
          value: "车牌号码",
          prop: "carNumber",
          width: "90px",
          checked: true,
        },
        {
          value: "车辆用途",
          prop: "carUse",
          width: "90px",
          checked: true,
        },
        {
          value: "车辆制造企业",
          prop: "qualifications",
          width: "120px",
          checked: true,
        },
        {
          value: "产品型号",
          prop: "productModel",
          width: "110px",
          checked: true,
        },
        {
          value: "销售日期",
          prop: "salesDate",
          width: "140px",
          checked: true,
        },
        {
          value: "销售地区",
          prop: "salesRegion",
          width: "160px",
          checked: true,
        },
        {
          value: "所有人姓名",
          prop: "ownerName",
          width: "100px",
          checked: true,
        },
        {
          value: "所有企业名称",
          prop: "companyName",
          width: "120px",
          checked: true,
        },
        {
          value: "上传状态",
          prop: "code",
          width: "90px",
          checked: true,
        },
      ],
      statusList:[
        {label:'初始',value:'2'},
        {label:'成功',value:'0'},
        {label:'失败',value:'1'},
      ],
      importVisible: false, // 导入
      importResult: {},
      resultVisible: false,
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    clearVINno() {
      this.$route.query.vinNo = "";
    },
    //清空
    handleClear1() {
      for (const k in this.listQuery) {
        if (k === "pageNum" || k === "pageSize") {
          continue;
        } else {
          this.listQuery[k] = "";
        }
      }
      this.$route.query.vinNo = "";
      this.listLoad();
    },
    //导出
    handleExport() {
      // this.uploadloading = this.$loading({
      //   target: document.querySelector(".el-dialog-import-sim"),
      //   text: "正在导出，请稍候...",
      //   background: "rgba(1,1,1,0.3)",
      //   customClass: "svg-otherColor",
      // });
      this.exportLoading = true;
      exportCarSales(this.listQuery)
        .then(() => {
          // this.uploadloading.close();
        })
        .finally(() => {
        this.exportLoading = false;
      })
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      if (this.$route.query.vinNo != "" && this.$route.query.vinNo != undefined)
        this.listQuery.vinNo = this.$route.query.vinNo;
      getList(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(()=>{
        this.listLoading = false;
      })
    },
    //上传成功的回调
    reloadList(data) {
      // console.log(data)
      this.importResult = data;
      if (data.failedList.length > 0) {
        this.resultVisible = true;
       }else{
        this.importVisible = false
       }
      this.listLoad();
    },

    resultClose() {
      this.$refs.importDialog.closeDialog();
    },

    // 导入查询
    handleImportCar() {
      this.importCarVisible = true;
    },
    reloadCarList(data) {
      this.importResult = data;
      if (data.failedList.length > 0) {
        this.resultCarVisible = true;
      }
      this.importCarVisible = false;
      if (data.successList.length == 0) {
        return;
      }
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            key: "carSalesInfo",
            codeList,
          };
          exportByVin(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "生产信息预警",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
 
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     iconType:2,
    //     icon: "export",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "导入",
    //     functionNameEn: "导入",
    //     functionType: 2,
    //     url: "import",
    //     icon: "import",
    //     isShow: 1,
    //   },
    //    {
    //     functionName: "导入查询",
    //     functionNameEn: "导入查询",
    //     functionType: 1,
    //     url: "importCar",
    //     icon: "importSelect",
    //     isShow: 1,
    //     iconType:2
    //   },
    // ];
  },
};
</script>

<style scoped></style>
