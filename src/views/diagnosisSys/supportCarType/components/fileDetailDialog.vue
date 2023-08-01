<template>
  <div>
    <app-drawer
      :visibles="visibles"
      :title="'任务详情列表'"
      width="73%"
      @close-drawer="closeDialog"
      :wrapperClosable="true"
      :isDrawerFoot="false"
    >
      <div slot="drawerContent">
        <app-search>
          <div slot="content">
            <seach-form
              :spanNumber="8"
              :labelWidth="'60px'"
              :listQuery="listQuery"
              :searchList="searchList"
            />
          </div>
          <div slot="bottom">
            <!-- 清空查询按钮 -->
            <app-search-button
              :isCollapse="false"
              @click-filter="handleFilter"
              @click-clear="handleClear"
            />
          </div>
        </app-search>
        <!-- table -->
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :pageObj="listQuery"
          :total="total"
          :buttonList="insideList"
          :tableHeights="tableHeight"
          :isShowOperation="true"
          @click-download="handleClick"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'state'">
              <el-tag
                :type="
                  scope.row.state === 0
                    ? 'danger'
                    : scope.row.state === 1
                    ? 'success'
                    : 'info'
                "
                effect="dark"
              >
                {{ scope.row[scope.item.prop] | switchText }}
              </el-tag>
            </span>
            <span v-else>
              {{ scope.row[scope.item.prop] | processData }}
            </span>
          </template>
        </app-table>
      </div>
    </app-drawer>
  </div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { getPageButton } from "@/mixins/getButton";
// request
import { getExportResultList } from "@/api/diagnosisSys/supportCarType";
export default {
  name: "fileDetailDialog",
  doNotInit: true,
  mixins: [pagingMixin, tableStyle, drawerOtherHeight, getPageButton],
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "文件名",
          value: "odxFileName",
          type: "input",
        },
      ];
    },
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: {},
    },
  },
  filters: {
    switchText(val) {
      return val === 0 ? "失败" : val === 1 ? "成功" : "-";
    },
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.listLoad();
        }
      },
    },
  },
  data() {
    return {
      listQuery: { carTypeId: "", odxFileName: "" },
      tableList: [
        {
          value: "文件名称",
          prop: "odxFileName",
          checked: true,
          width: 180,
        },
        {
          value: "状态",
          prop: "state",
          checked: true,
          width: 70,
        },
        {
          value: "失败原因",
          prop: "message",
          checked: true,
          width: 140,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
      ],
      queryResultVisible: false,
      subTaskId: "", //子任务id
    };
  },
  mounted() {
    this.insideList = [
      {
        functionName: "下载",
        functionNameEn: "下载",
        functionType: 2,
        url: "download",
        icon: "downLoad",
        isShow: 1,
        iconType: 2,
      },
    ];
  },
  methods: {
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.carTypeId = this.data.id;
      getExportResultList(this.listQuery)
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
    // 关闭dialog
    closeDialog() {
      this.listQuery.carTypeId = "";
      this.listQuery.odxFileName = "";
      this.listQuery.pageNum = 1;
      this.$emit("update:visibles", false);
    },
    handleClick(row) {
      window.location.href = "file/" + row.odxFilePath;
    },
  },
};
</script>

<style lang="scss" scoped></style>
