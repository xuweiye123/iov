<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看审核信息'"
    width="55%"
    @close-drawer="closeDrawer"
    :wrapperClosable="true"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <div class="improve-default clearfix">
        <app-item-pance :list="list" :number="1" :left-width="'100'" />
      </div>
      <div class="statistics-scroll">
        <el-scrollbar wrap-class="default-scrollbar__wrap">
          <ul class="upload-list-box">
            <li
              v-for="item in imgs"
              :key="item.fileId"
              @click="handleLookImg(item)"
            >
              {{ item.fileName }}
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <!-- 图片预览 -->
      <app-dialog
        :visibles="dialogVisible"
        :title="'预览'"
        width="50%"
        @close-dialog="dialogVisible = false"
        :isFooter="false"
      >
        <div slot="formContent">
          <!-- <el-scrollbar
            wrap-class="default-scrollbar__wrap"
            style="height:65vh"
          > -->
          <div
            style="display: flex;justify-content: center;align-items: center;height:65vh"
          >
            <img :src="dialogImageUrl" alt="" />
          </div>
          <!-- </el-scrollbar> -->
        </div>
      </app-dialog>
    </div>
  </app-drawer>
</template>

<script>
// request
import { getImgList } from "@/api/carManageSys/terminalReplace";
import AppItemPance from "@/components/itemPance";

export default {
  name: "detailDrawer",
  components: { AppItemPance },
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
  data() {
    return {
      improveForm: {},
      imgs: [],
      formInfo: {},
      list: [],
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = { ...this.data };
        const {
          vinNo,
          iccid,
          barCode,
          oldIccidOne,
          oldIccidTwo,
          newIccidOne,
          newIccidTwo,
          status,
          stationName,
          auditContent,
          auditTime,
          carBatchCode,
          createdOn,
        } = this.formInfo;
        const stateValue =
          status === 0
            ? "未审核"
            : status === 1
            ? "审核通过"
            : status === 2
            ? "审核未通过"
            : "";
        this.list = [
          { name: "VIN码", value: vinNo ? vinNo : "-" },
          // { name: "系统ICCID", value: iccid ? iccid : "-" },
          { name: "原ICCID1", value: oldIccidOne ? oldIccidOne : "-" },
          { name: "原ICCID2", value: oldIccidTwo ? oldIccidTwo : "-" },
          { name: "新ICCID1", value: newIccidOne ? newIccidOne : "-" },
          { name: "新ICCID2", value: newIccidTwo ? newIccidTwo : "-" },
          { name: "审核时间", value: auditTime ? auditTime : "-" },
          { name: "项目代号", value: carBatchCode ? carBatchCode : "-" },
          { name: "服务站名称", value: stationName ? stationName : "-" },
          { name: "创建时间", value: createdOn ? createdOn : "-" },
          // { name: "系统TBOXSN", value: barCode ? barCode : "-" },
          { name: "审核状态", value: stateValue ? stateValue : "-" },
          { name: "审核结果备注", value: auditContent ? auditContent : "-" },
        ];
        this.imgs = [];
        this.getImgList();
      }
    },
  },
  mounted() {},
  methods: {
    getImgList() {
      const postData = {
        id: this.formInfo.terminalAlterAuditId,
      };
      getImgList(postData).then(({ data }) => {
        if (data.code === 0) {
          this.imgs = data.data || [];
        }
      });
    },
    // 图片预览
    handleLookImg(file) {
      this.dialogImageUrl = file.filePath;
      this.dialogVisible = true;
    },
    // 判断是否选中
    tableRowIsSlect() {
      const { $index } = this.tableRow;
      if ($index === undefined) {
        return false;
      } else {
        return true;
      }
    },
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
    },
    // 关闭
    closeDrawer() {
      this.imgs = [];
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-scrollbar {
	.el-scrollbar__wrap {
		padding: 0 5px 10px;
		max-height: calc(100vh - 373px);; // 最大高度
		overflow-x: hidden !important; // 隐藏横向滚动栏
	}
}
.improve-default {
  p {
    font-size: 12px;
    float: left;
    width: 50%;
    margin: 0;
    padding: 10px;
  }
}
.improve-input {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #dcdfe6;
}
.upload-list-box {
  padding: 0;
  li {
    cursor: pointer;
    line-height: 25px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>
