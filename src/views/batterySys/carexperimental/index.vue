<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
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
        @click-add="handleAdd"
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
    </div>
    <add-drawer :visibles.sync="addVisible" @add-complete="addComplete" />

    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/carexperimental/importVin'"
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
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getList, exportCar } from "@/api/batterySys/carexperimental";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import addDrawer from "./components/addDrawer";
export default {
  name: "carexperimental",
  components: { addDrawer, importDialog, resultDialog },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
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
          label: "车辆型号",
          value: "vehicleModel",
        },
        {
          type: "select",
          label: "上传状态",
          value: "code",
          options: {
            data: this.statusList
          }
        }
      ];
    }
  },
  data() {
    return {
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "180px",
          checked: true
        },
        {
          value: "车辆型号",
          prop: "vehicleModel",
          width: "90px",
          checked: true
        },
        {
          value: "报废时间",
          prop: "scrapTime",
          width: "140px",
          checked: true
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140px",
          checked: true
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: "90px",
          checked: true
        },
        {
          value: "上传状态",
          prop: "code",
          width: "90px",
          checked: true
        },
      ],
      addVisible: false,
      importCarVisible: false,
      resultCarVisible: false,
      importResult: {},
      statusList:[
        { label:"初始",value:"2" },
        { label:"成功",value:"0" },
        { label:"失败",value:"1" }
      ]
    };
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
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
    //新增
    handleAdd() {
      this.addVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
    },
    handleExport() {
      this.exportLoading = true;
      exportCar(this.listQuery).then(() => {
      }).finally(() => {
        this.exportLoading = false;
      })
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
            key: "carexperimental",
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
        title: "实验车辆报废",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
  mounted() {
  },
};
</script>

<style scoped></style>
