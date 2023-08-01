<template>
  <app-drawer
    :visibles="visibles"
    :title="'DBC参数检测'"
    :wrapperClosable="true"
    width="80%"
    @close-drawer="closeDrawer"
    :loading="loading"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <div class="checkDialog app-container clearfix">
        <div class="checkLeft">
          <div class="organization-name-search">
            <header class="search-title">
              <i class="iconfont icon-search"></i>
              <span>DBC参数</span>
            </header>
            <div class="or-name-input">
              <el-form :label-position="'right'" label-width="60px">
                <el-form-item label="快速查询：">
                  <el-input v-model="filterText" clearable />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="scroll_list">
            <!-- style="height:420px" -->
            <el-scrollbar
              :style="{height:tableHeight + 73+'px'}"
              wrap-class="default-scrollbar__wrap"
            >
              <el-tree
                ref="tree"
                :data="treeData"
                :expand-on-click-node="false"
                :default-expand-all="true"
                :highlight-current="treeLight"
                :filter-node-method="filterNode"
                node-key="businessunitid"
                @node-click="treeClick"
                @node-expand="InitializeId"
                @node-collapse="InitializeId"
              >
                <!-- node,  -->
                <div slot-scope="{ data }" class="custom-region" style="flex:1">
                  <span class="tree-span">
                    <svg-icon
                      :icon-class="
                        data.type === 1
                          ? 'icon-station'
                          : data.type === 2
                          ? 'icon-department'
                          : 'icon-company'
                      "
                    />{{ data.label }}</span
                  >
                </div>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
        <div class="checkRight" v-loading="checkLoading">
          <app-search
            class="notBackground"
            :title="'参数列表'"
            :show-title="true"
            :icons="'download-child'"
          >
            <div slot="content">
              <seach-form
                :spanNumber="8"
                :listQuery="listQuery"
                :searchList="searchList"
              />
            </div>
            <app-search-button
              slot="bottom"
              :isdisabled="listLoading"
              :is-collapse="false"
              @click-filter="handleFilter"
              @click-clear="handleClearSearch"
            />
          </app-search>
          <!-- 按钮 -->
          <app-authorize-button
            :buttonLeft="headersLeftList"
            :buttonRight="[]"
            @click-filter="showfilter = true"
            @click-testing="handleMonitorReset"
            @click-approval="handleProve"
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
            :actionWidth="actionWidth"
            :actionFixed="actionFixed"
            :isShowOperation="false"
            :tableHeights="tableHeight + 25"
            @handle-selection-change="handleSelectionChange"
            @sort-change="sortChange"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
          >
            <template slot="tableContent" slot-scope="scope">
              <span v-if="scope.item.prop==='checkStatus'">
                <el-tag
                  :type="
                    scope.row[scope.item.prop] == 1
                    ?'success'
                    : 'danger'
                  "
                  effect="dark"
                  style="width: 65px;"
                >
                  {{scope.row[scope.item.prop]==1?"符合":scope.row[scope.item.prop]==0?"不符合":'-'}}
                </el-tag>
              </span>
               <span v-else-if="scope.item.prop ==='parameterTypeId'">
                {{
                  scope.row[scope.item.prop] | switchText(scope.item.prop)
                }}
              </span>
              <span v-else>
                {{
                  scope.row[scope.item.prop] | processData
                }}
              </span>
            </template>
          </app-table>
        </div>
        <prove-dialog
          :visibles.sync="peoveVisibles"
          :data="proveData"
          @prove-complete="proveComplete"
        />
      </div>
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import proveDialog from './proveDialog'

// request
import {
  getCheckResultPageList,
  getDbcTree,
  autoCheckDBC,
} from "@/api/carMonitorSys/dbcFileTest";


export default {
  doNotInit: true,
  name: "testingDrawer",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  components: {proveDialog},
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => [],
    },
  },
  filters: {
    switchText(val, type) {
      if (type === "parameterTypeId") {
        return val == 1
          ? "报警数据"
          : val == 2
          ? "发动机数据"
          : val == 3
          ? "极值数据"
          : val == 4
          ? "燃料电池数据"
          : val == 5
          ? "可充电储能装置"
          : val == 6
          ? "车辆位置数据"
          : val == 7
          ? "整车数据"
          : val == 8
          ? "驱动电机数据"
          : "-";
      }
    },
  },
  data() {
    return {
      loading: false,
      listQuery: {
        parameterName: "",
        checkStatus: "",
      },
      formInfo: {},
      checkStateList: [
        { label: "符合", value: 1 },
        { label: "不符合", value: 0 },
      ],
      tableList: [
        {
          value: "参数名称",
          prop: "parameterName",
          checked: true,
          width:130
        },
        {
          value: "参数类型",
          // prop: "paramType",
          prop: "parameterTypeId",
          checked: true,
          width:140
        },
        {
          value: "参数单位",
          prop: "parameterUnit",
          checked: true,
          width:90
        },
        {
          value: "检测结果",
          prop: "checkStatus",
          checked: true,
          width:90
        },
        {
          value: "备注",
          prop: "checkResult",
          checked: true,
          width:120
        },
      ],
      treeData: [],
      treeLight: true,
      filterText: "",
      proveData: {},
      peoveVisibles: false,
      checkLoading: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    visibles: {
      handler(e1) {
        if (e1) {
          this.formInfo = { ...this.data };
          this.listQuery.dbcId = this.formInfo.dbcId;
          this.getTree();
          this.handleMonitorReset();
        }
      },
    },
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "参数名称",
          value: "parameterName",
          type: "input",
        },
        {
          label: "检测结果",
          value: "checkStatus",
          type: "select",
          options: {
            data: this.checkStateList,
          },
        },
      ];
    },
  },
  mounted() {
    // 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "重新检测",
        functionNameEn: "重新检测",
        functionType: 2,
        iconType:2,
        url: "testing",
        icon: "retest",
        isShow: 1,
      },
      {
        functionName: "审核",
        functionNameEn: "审核",
        functionType: 2,
        iconType:2,
        url: "approval",
        icon: "approval",
        isShow: 1,
      },
    ];
  },
  created() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    treeClick(e) {
      // this.listLoad()
    },
    // 节点展开和关闭
    InitializeId() {
      // this.businessunitid = ''
      // this.addUpdateObj.businessunittypeid = ''
    },

    // 获取菜单数据
    getTree() {
      this.loading = true;
      const postdata = {
        fileName: this.formInfo.fileName,
        dbcId: this.formInfo.dbcId,
      };
      getDbcTree(postdata)
        .then(({ data }) => {
      if (data.code === 0) {
        this.treeData = [];
        this.treeData.push(data.data);
      }
      this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    },
    listLoad() {
      this.listLoading = true;
      getCheckResultPageList(this.listQuery)
        .then(({ data }) => {
      if (data.code === 0) {
        this.total = data.total;
        this.list = data.data || [];
      }
      this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.listQuery.parameterName = "";
      this.listQuery.checkStatus = "";
      this.filterText = "";
      this.treeData = [];
      this.list = [];
    },

    // 重新检测
    handleMonitorReset() {
      const postdata = {
        dbcId: this.formInfo.dbcId,
        status: 1,
      };
      this.checkLoading = true;
      autoCheckDBC(postdata).then(({ data }) => {
      if (data.code === 0) {
        console.log()
        this.proveData.gbAllCount = data.data.gbAllCount || 0;
        this.proveData.gbNoCount = data.data.gbNoCount || 0;
        this.proveData.dbcId = this.formInfo.dbcId;
        this.listLoad();
      }
      this.checkLoading = false;
      }).catch(() => {
        this.checkLoading = false;
      });
    },
    // 审核
    handleProve() {
      this.peoveVisibles = true;
    },
    proveComplete() {
      this.$emit("prove-complete");
      this.closeDrawer();
    },
    handleClearSearch() {
      this.listQuery.dbcId = this.listQuery.dbcId;
      this.listQuery.parameterName = "";
      this.listQuery.checkStatus = "";
      this.listLoad()
    },
  },
};
</script>

<style lang="scss" scoped>
.checkDialog {
  padding: 0 !important;
}
.checkLeft {
  // background: #fff;
  // box-shadow: 0px 4px 14px 0px rgb(101 107 119 / 10%);
  border-radius: 4px;
  padding: 12px;
  float: left;
  width: 30%;
  // border-right: 1px solid #504f4f;
  padding-right: 10px;
  box-sizing: border-box;
  .organization-name-search {
    position: relative;
    padding: 0;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .or-name-input {
    padding: 0 0 5px 0;
  }
  .or-name-btn {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .search-title {
    padding: 0 0 12px 0;
    // font-size: 12px;
    background-color: unset !important;
    span {
      // font-size: 12px !important;
      // font-weight: bold;
      color: #262834;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .icon-search {
    margin-right: 10px;
  }
}
.checkRight {
  float: right;
  width: 70%;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  .search-title {
    padding: 0;
    background-color: unset !important;
  }
  .add-btn {
    margin-top: 0;
    padding-top: 0;
  }
}
.buttoncheck {
  position: absolute;
  top: 70px;
  left: 10px;
}

::v-deep .notBackground .search-title {
  background-color: unset !important;
}
::v-deep .search_list_border{
  margin-top: 0;
}
</style>
