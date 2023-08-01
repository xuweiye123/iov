<template>
  <div class="js-system-user app-container">
     <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isCollapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
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
        @click-import-car="handleImportCar"
        @click-import="importVisible = true"
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
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :isShowOperation="false"
        :isTableSelection="false"
        :actionFixed="actionFixed"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'status'">
            <el-tag
              :type="
                scope.row.status == '已绑定'
                  ? 'success'
                  : scope.row.status == '未绑定'
                  ? 'info'
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
        action="/api/battery/productinfo/import"
        :template-url="
          'api/battery/fileStatics/ImportProductionInformationBatch.xlsx'
        "
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      >
        <!--导入结果dialog弹窗-->
        <result-dialog
          :visibles.sync="resultVisible"
          :data="importResult"
          :text="'VIN码'"
          :keys="'vinno'"
          :message="'无导入失败信息'"
          @export-fail="exportFail"
          @close="resultClose"
        />
      </import-dialog>

      <!-- 导入查询 -->
      <import-dialog
        :action="'/api/battery/productinfo/importVin'"
        :title="'导入查询'"
        :template-url="'api/battery/fileStatics/ImportVINInformation.xlsx'"
        :visibles.sync="importCarVisible"
        @upload-success="reloadCarList"
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
import {
  getList,
  exportproductinfo,
  exportCheck
} from "@/api/batterySys/productinfo";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
export default {
  name: "productinfo",
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  components: { importDialog, resultDialog },
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
          value: "电池包编码",
          prop: "psn",
          width: "200px",
          checked: true,
        },
        {
          value: "是否绑定",
          prop: "status",
          width: "90px",
          checked: true,
        },
        {
          value: "上传时间",
          prop: "createdOn",
          width: "140px",
          checked: true,
        },
        {
          value: "上传人",
          prop: "createdBy",
          width: "90px",
          checked: true,
        },
      ],
      statusList:[
        {value:'0',label:'已绑定'},
        {value:'1',label:'未绑定'}
      ],
      importVisible: false, // 导入
      importResult: {},
      importCarVisible: false,
      resultVisible: false,
      resultCarVisible: false
    };
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    //导出
    handleExport() {
      this.exportLoading = true;
      exportproductinfo(this.listQuery)
        .then(() => {
        })
        .finally(() => {
          this.exportLoading = false;
        })
    },
    // 加载数据
    listLoad() {
          this.listLoading = true;
      getList(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
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
            key: "productInfo",
            codeList
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
        title: "导入生产信息",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
  computed: {
      searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo"
				},
        {
					type: "input",
					label: "电池包编码",
					value: "psn"
				},
        {
					type: "select",
					label: "绑定状态",
					value: "status",
					options: {
						data: this.statusList//下拉数组	
					},
				}
			];
		}
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
    //     iconType:2
    //   },
    //   {
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
