<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form :listQuery="listQuery" :searchList="searchList" />
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
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        @click-add="handleAdd"
        @click-filter="showfilter = true"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
        />
      </app-authorize-button>
      <!-- table -->
      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :tableHeights="tableHeight"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="insideList"
        :isShowOperation="true"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <!-- <span
            v-if="scope.item.prop === 'carTypeName'"
            class="vinNo"
            @click="fileDetail(scope.row)"
          >
            {{ scope.row[scope.item.prop] | processData }}
          </span>
          <span v-else-if="scope.item.prop === 'createdBy'">
            {{
              scope.row[scope.item.prop]
                ? scope.row[scope.item.prop].split("@")[0]
                : "-"
            }}
          </span> -->
          <a
            v-if="
              scope.item.prop === 'pdxFileName' && scope.row[scope.item.prop]
            "
            :href="'file/' + scope.row['pdxFilePath']"
            class="vinNo"
          >
            {{ scope.row[scope.item.prop] | processData }}
          </a>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-dialog
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
    <!-- 文件详情 -->
    <file-detail-dialog :visibles.sync="fileVisible" :data="tableRow" />
  </div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// request
import {
  getList,
  deleteSupportCarType,
} from "@/api/diagnosisSys/supportCarType";
// 组件
import AddUpdateDialog from "./components/addUpdateDialog";
import fileDetailDialog from "./components/fileDetailDialog";
export default {
  name: "supportCarType",
  mixins: [
    pagingMixin,
    otherHeight,
    tableStyle,
    getPageButton,
    addUpdateAction,
  ],
  components: {
    AddUpdateDialog,
    fileDetailDialog,
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "车型名称",
          value: "carTypeName",
          type: "input",
        },
      ];
    },
  },
  data() {
    return {
      listQuery: {},
      tableList: [
        {
          value: "车型名称",
          prop: "carTypeName",
          checked: true,
          width: 140,
        },
        {
          value: "创建人",
          prop: "createdBy",
          checked: true,
          width: 140,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
        // {
        //   value: "PDX文件名",
        //   prop: "pdxFileName",
        //   checked: true,
        //   width: 250,
        // },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width: 140,
        },
      ],
      lookFunctionVisible: false, // 查看功能权限dialog
      fileVisible: false,
    };
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
      this.tableRow = {};
      getList(this.listQuery)
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
    // 删除
    handleDelete({ id, carTypeName }) {
      this.$confirm(`确定要删除这条数据吗？`, "提示", {
        confirmButtonText: this.$t("addUpdateAction.define"),
        cancelButtonText: this.$t("addUpdateAction.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteSupportCarType({ carTypeId: id, carTypeName }).then(
            ({ data }) => {
              if (data.code === 0) {
                this.deleteComplete();
              }
            }
          );
        })
        .catch(() => {});
    },
    // 文件详情
    fileDetail(row) {
      if(row) this.tableRow = row;
      this.fileVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
