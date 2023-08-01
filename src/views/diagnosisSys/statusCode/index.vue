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
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="insideList"
        :tableHeights="tableHeight"
        :isShowOperation="true"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'codeType'">{{
            scope.row[scope.item.prop] | switchText
          }}</span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
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
import { getCodeList, deleteCodeInfo } from "@/api/diagnosisSys/statusCode";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";

export default {
  name: "statusCode",
  mixins: [
    pagingMixin,
    otherHeight,
    tableStyle,
    getPageButton,
    addUpdateAction,
  ],
  components: {
    addUpdateDrawer,
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "状态码",
          value: "errorCode",
          type: "input",
        },
        {
          label: "状态码名称",
          value: "codeName",
          type: "input",
        },
      ];
    },
  },
  filters: {
    switchText(val) {
      switch (val) {
        case 1:
          return "平台";
        case 2:
          return "API";
        case 3:
          return "终端";
      }
    },
  },
  data() {
    return {
      listQuery: {
        codeName: "",
        errorCode: "",
      },
      tableList: [
        {
          value: "状态码",
          prop: "code",
          checked: true,
          width: 70,
        },
        {
          value: "状态码来源类型",
          prop: "codeType",
          checked: true,
          width: 120,
        },
        {
          value: "状态码名称",
          prop: "codeName",
          checked: true,
          width: 140,
        },
        {
          value: "状态码描述",
          prop: "codeDes",
          checked: true,
          width: 180,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
      ],
      lookFunctionVisible: false, // 查看功能权限dialog
    };
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
      this.tableRow = {};
      getCodeList(this.listQuery)
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
    handleDelete({ id, codeName }) {
      this.$confirm(`确定要删除这条数据吗？`, "提示", {
        confirmButtonText: this.$t("addUpdateAction.define"),
        cancelButtonText: this.$t("addUpdateAction.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteCodeInfo({ id, codeName }).then(({ data }) => {
            if (data.code === 0) {
              this.deleteComplete();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
