<template>
  <app-drawer
    :visibles="visibles"
    :title="'下载文件'"
    width="55%"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
    :confirmText0="'下载'"
  >
    <div slot="drawerContent">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="[]"
        @click-filter="showfilter = false"
        :showRightButton="false"
        @click-refresh="handleFilter"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>
      <!-- table -->
      <app-table
        slot="table"
        :isTableSelection="true"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :isShowOperation="false"
        :tableHeights="tableHeight"
        rowKey="pathId"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'settingUploadStatus'">
            {{ scope.row[scope.item.prop] == 1 ? "已下载" : "未下载" }}
          </span>
          <span v-else-if="scope.item.prop === 'fileSize'">
            {{
              scope.row[scope.item.prop]
                | fileSizeConversion
            }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import {
  getCanFileByCarIdPageList,
  createCanFileTask,
} from "@/api/carMonitorSys/remoteCall";

export default {
  doNotInit: true,
  name: "fileDrawer",
  mixins: [pagingMixin, drawerOtherHeight, tableStyle, getPageButton],
  components: {},
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
  data() {
    return {
      loading: false,
      formInfo: {
        iccId: "",
        simNum: "",
        simType: "",
        remark: "",
      },
      selectFile: [],
      tableList: [
        {
          value: "文件路径",
          prop: "path",
          width: 250,
          checked: true,
        },
        {
          value: "是否下载",
          prop: "settingUploadStatus",
          checked: true,
          width: 80,
        },
        {
          value: "文件大小",
          prop: "fileSize",
          checked: true,
          width: 80,
        },
        {
          value: "下载时间 ",
          prop: "settingUploadTime",
          checked: true,
          width: 140,
        },
      ],
    };
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.listQuery.carId = "";
          const { carId } = this.data;
          this.listQuery.carId = carId;
          this.listLoad();
        }
      },
    },
  },
  computed: {},
  mounted() {
    // 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "刷新",
        functionNameEn: "刷新",
        functionType: 1,
        iconType: 2,
        url: "refresh",
        icon: "refreshBig",
        isShow: 1,
      },
    ];
  },
  created() {},
  methods: {
    listLoad() {
      this.listLoading = true;
      getCanFileByCarIdPageList(this.listQuery)
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
    handleSelectionChange(val) {
      this.selectFile = val;
    },
    // 关闭dialog
    closeDrawer() {
      this.listQuery.carId = "";
      this.$emit("update:visibles", false);
    },
    // 点击提交
    submitForm() {
      if (this.selectFile.length === 0) {
        this.$message.warning({
          message: "请选择下载项",
          duration: 2 * 1000,
        });
        return;
      }
      const postData = {
        pathFileId: this.selectFile.map((item) => item.pathFileId).join(","),
      };
      this.loading = true;
      createCanFileTask(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("download-success");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
