<template>
  <app-drawer
    :visibles="visibles"
    :title="'下载明细'"
    :wrapperClosable="true"
    width="55%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="[]"
        @click-filter="showfilter = false"
        :showRightButton="false"
        @click-refresh="handleFilter"
        @click-timedRefresh="timerFun"
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
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :isShowOperation="false"
        :tableHeights="tableHeight"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'process'">
            <el-progress
              :stroke-width="10"
              :percentage="
                scope.row[scope.item.prop] > 100
                  ? 100
                  : Math.round(scope.row[scope.item.prop], 1)
              "
            />
          </span>
          <span v-else-if="scope.item.prop === 'fileSize'">
            {{
              scope.row[scope.item.prop]
                | fileSizeConversion
            }}
          </span>
          <span v-else-if="scope.item.prop == 'path'">
            <el-tooltip
              v-if="scope.row['process'] == 100"
              class="item"
              effect="dark"
              :content="'点击下载文件'"
              placement="top"
            >
              <a class="vinNo" :href="scope.row['downloadAddress']">{{
                scope.row[scope.item.prop] | processData
              }}</a>
            </el-tooltip>
            <span v-else>{{ scope.row[scope.item.prop] | processData }}</span>
          </span>
          <!-- <span
            v-else-if="scope.item.prop == 'uploadFileStatus'"
            :class="
              scope.row[scope.item.prop] == 0
                ? 'badge-default'
                : scope.row[scope.item.prop] == 1
                ? 'badge-processing'
                : scope.row[scope.item.prop] == 2
                ? 'badge-success'
                : scope.row[scope.item.prop] == 3
                ? 'badge-success1'
                : scope.row[scope.item.prop] == 4
                ? 'badge-orange'
                : 'badge-error'
            "
          >
            <em></em
            >{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
          </span> -->
          <span v-else-if="scope.item.prop == 'uploadFileStatus'">
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
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
import { getDownloadDetailByCarIdPageList } from "@/api/carMonitorSys/remoteCall";

export default {
  name: "lookDrawer",
  doNotInit: true,
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.listQuery.carId = "";
          this.listLoad();
        }
      },
    },
  },
  filters: {
    switchText(val, type) {
      if (type === "uploadFileStatus") {
        return val === 0
          ? "未开始"
          : val === 1
          ? "下载中"
          : val === 2
          ? "已完成"
          : val === 3
          ? "文件上载完成，校验通过"
          : val === 4
          ? "文件上载完成，校验未通过"
          : "上传失败";
      } else {
        return val || (val === 0 ? val : "-");
      }
    },
  },
  data() {
    return {
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        carId: "",
      },
      isTimeing: true,
      timer: null,
      tableList: [
        {
          value: "文件路径",
          prop: "path",
          width: 250,
          checked: true,
        },
        {
          value: "文件大小",
          prop: "fileSize",
          width: 80,
          checked: true,
        },
        {
          value: "下载状态",
          prop: "uploadFileStatus",
          width: 120,
          checked: true,
        },
        {
          value: "下载进度",
          prop: "process",
          width: 150,
          checked: true,
        },
        {
          value: "上传开始时间 ",
          prop: "beginUploadTime",
          checked: true,
          width: 140,
        },
        {
          value: "上传完成时间 ",
          prop: "endUploadTime",
          checked: true,
          width: 140,
        },
        {
          value: "文件生成时间 ",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
      ],
    };
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
      {
        functionName: "定时刷新",
        functionNameEn: "定时刷新",
        functionType: 1,
        iconType: 2,
        url: "timedRefresh",
        icon: "timedRefresh",
        isShow: 1,
      },
    ];
  },
  methods: {
    // 渲染
    listLoad() {
      this.getData();
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.getData();
        }, 10 * 1000);
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取服务端数据
    getData() {
      this.listQuery.carId = this.data.carId;
      this.listLoading = true;
      getDownloadDetailByCarIdPageList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.total = data.total || 0;
            this.list = data.data || [];
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 刷新
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getData();
    },
    // 定时刷新
    timerFun() {
      if (this.isTimeing) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(() => {
          this.getData();
        }, 10 * 1000);
      }
      this.isTimeing = !this.isTimeing;
    },
    // 关闭dialog
    closeDrawer() {
      this.restData();
      this.$emit("update:visibles", false);
    },
    // 重置数据
    restData() {
      this.listQuery.vinNo = "";
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.list = [];
    },
  },
};
</script>

<style scoped></style>
