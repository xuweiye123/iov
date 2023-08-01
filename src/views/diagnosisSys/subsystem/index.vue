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
        @click-filter="showfilter = true"
        @click-add="handleAdd"
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
        :tableHeights="tableHeight"
        :buttonList="insideList"
        :isShowOperation="true"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="scope.item.prop === 'subSystemName'"
            class="vinNo"
            @click="queryEcuList(scope.row)"
          >
            {{ scope.row[scope.item.prop] | processData }}
          </span>
          <span v-else-if="scope.item.prop === 'createdBy'">
            {{
              scope.row[scope.item.prop]
                ? scope.row[scope.item.prop].split("@")[0]
                : "-"
            }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <add-update-drawer
      :visible.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />

    <query-ecu-list :visibles.sync="ecuListVisible" :ecuClassId="ecuClassId" />
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
import { getSubsystem, deleteSubsystem } from "@/api/diagnosisSys/subsystem";
import { getSupportCarTypeList } from "@/api/diagnosisSys/commont";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import queryEcuList from "./components/queryEcuDialog";
export default {
  name: "subsystem",
  components: {
    addUpdateDrawer,
    queryEcuList,
  },
  filters: {
    disableText(status) {
      return status ? "启用" : "禁用";
    },
  },
  mixins: [
    pagingMixin,
    otherHeight,
    tableStyle,
    getPageButton,
    addUpdateAction,
  ],
  data() {
    return {
      listQuery: {
        subSystemName: "",
        ecuName: "",
      },
      tableList: [
        {
          value: "分系统名称",
          prop: "subSystemName",
          checked: true,
          width: 220,
        },
        { value: "创建时间	", prop: "createdOn", checked: true, width: 140 },
        { value: "创建人", prop: "createdBy", checked: true, width: 140 },
        { value: "车型名称	", prop: "carTypeName", checked: true, width: 80 },
      ],
      templateVisible: false,
      ecuListVisible: false,
      ecuClassId: "", // 用于查看关联ECU
      carmodelList: [],
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "分系统名称",
          value: "subSystemName",
          type: "input",
        },
        {
          label: "ECU名称",
          value: "ecuName",
          type: "input",
        },
        {
          label: "车型名称",
          value: "carTypeId",
          type: "select",
          options: {
            data: this.carmodelList, //下拉数组
            extraProps: {
              label: "carTypeName",
              value: "carTypeId",
            },
          },
        },
      ];
    },
  },
  mounted() {
    // 加载车型数据
    getSupportCarTypeList().then(({ data }) => {
      if (data.code == 0) {
        this.carmodelList = data.data || [];
      }
    });
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getSubsystem(this.listQuery)
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
    handleDelete({ id, subSystemName }) {
      this.$confirm(`确定要删除这条数据吗？`, "提示", {
        confirmButtonText: this.$t("addUpdateAction.define"),
        cancelButtonText: this.$t("addUpdateAction.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteSubsystem({ subSystemId: id, subSystemName }).then(
            ({ data }) => {
              if (data.code === 0) {
                this.deleteComplete();
              }
            }
          );
        })
        .catch(() => {});
    },
    queryEcuList(row) {
      this.ecuClassId = row.id;
      this.ecuListVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
