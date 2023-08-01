<template>
  <div class="js-system-user app-container">
    <!-- 查询 -->
    <app-search>
      <div slot="content">
         <seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <app-search-button
        slot="bottom"
        :is-collapse="false"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <!-- 按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        @click-filter="showfilter = true"
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
          <span v-else-if="scope.item.prop == 'status'">
            <el-tag
              :type="
                scope.row.status == '初始'
                  ? 'info'
                  : scope.row.status == '已发送'
                  ? 'success'
                  : scope.row.status == '异常'
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
    </div>
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/checkcommo/importVin'"
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
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
// request
import { getsynccount } from "@/api/batterySys/homePage";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
export default {
  name: "homePage",
  components: {
    importDialog,
    resultDialog,
  },
  filters: {
  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      operationTypeList: [
        { label: "导入", value: "import" },
        { label: "接口", value: "sync" },
      ],
      statusList: [
        { label: "初始", value: "1" },
        { label: "已发送", value: "2" },
        { label: "异常", value: "3" },
      ],
      listQuery: {
        interfaceType: "",
        operationType: "",
        status: "",
      },
      tableList: [
        {
          value: "接口类型",
          prop: "interfaceType",
          width: 130,
          checked: true,
        },
        {
          value: "操作类型",
          prop: "operationType",
          width: 80,
          checked: true,
        },
        {
          value: "同步状态",
          prop: "status",
          width: 100,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 145,
          checked: true,
        },
        {
          value: "批次号",
          prop: "bnum",
          width: 120,
          checked: true,
        },
        {
          value: "数据状态",
          prop: "code",
          width: 100,
          checked: true,
        },
      ],
      importCarVisible: false,
      resultCarVisible: false,
      importResult: {},
    };
  },
  computed: {
     // 查询区数据
    searchList() {
      return [
        {
          label: "接口类型",
          value: "interfaceType",
          type: "input",
        },
        {
					label: "操作类型",
					value: "operationType",
          type: "select",
					options: {
						data: this.operationTypeList, //下拉数组
					},
        },
        {
					label: "同步状态",
					value: "status",
          type: "select",
					options: {
						data: this.statusList, //下拉数组
					},
        },
      ];
    },
  },
  mounted() {

  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getsynccount(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
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
        title: "国家平台同步信息",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
