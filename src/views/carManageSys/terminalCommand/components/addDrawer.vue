<template>
  <app-drawer
    :visibles="visibles"
    :title="'新增终端命令包'"
    width="55%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form :model="formInfo" label-width="90px" style="width:100%">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item required label="命令包名称：">
              <el-input
                v-model="formInfo.packetName"
                clearable
                placeholder="请输入命令包名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="备注：">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入备注"
                type="textarea"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <app-table
        slot="table"
        :isTableSelection="false"
        :isPagination="false"
        :total="total"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="tableList"
        :tableHeights="tableHeight + 30"
        :pageObj="listQuery"
        @row-dblclick="rowDblclick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
      <import-dialog
        :data="tableRow"
        :visibles.sync="importVisible"
        :title="importDialogTitle"
        @uploadSuccess="uploadSuccess"
        @params-edit-success="editSuccess"
      />
      <other-dialog
        :visibles.sync="otherVisible"
        :data="tableRow"
        @params-edit-success="editSuccess"
      />
    </div>
  </app-drawer>
</template>

<script>
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// request
import {
  getCommandParam,
  createCommand,
} from "@/api/carManageSys/terminalCommand";
import importDialog from "./importDialog";
import otherDialog from "./otherDialog";
export default {
  name: "addDrawer",
  components: { importDialog, otherDialog },
  mixins: [pagingMixin,tableStyle,otherHeight],
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
      list: [],
      tableHeight: 0,
      listQuery:{},
      total:0,
      listLoading:false,
      importVisible: false,
      otherVisible: false,
      importDialogTitle: "",
      tableList: [
        { value: "命令名称", prop: "commandName", position: "center",width:180 },
        { value: "参数", prop: "param", position: "center",width:120 },
        { value: "备注", prop: "remark", position: "center",width:120 },
      ],
      tableRow: {},
      formInfo: {
        packetName: "",
        remark: "",
      },
      loading: false,
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.list = [];
        this.listLoading=true
        getCommandParam().then(({ data }) => {
        if (data.code === 0) {
          this.total=data.total || 0;
          let result = data.data || [];
          result.forEach((item) => {
            item.param = "双击进行操作";
          });
          this.list = result;
        }
        this.listLoading=false
        })
        .catch(() => {
        this.listLoading = false;
      });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 315;
    });
    window.onresize = function() {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - 315;
      });
    }.bind(this);
  },
  methods: {
    listLoad(){

    },
    restData() {
      this.list = [];

      this.tableRow = {};
      this.formInfo.packetName = "";
      this.formInfo.remark = "";
    },
    // 关闭
    closeDrawer() {
      this.restData();
      this.$emit("update:visibles", false);
    },

    rowDblclick(row) {
      this.tableRow = row;
      //
      if (
        row.commandType === 1 ||
        (row.commandType === 0 && row.commandName.indexOf(",") > -1)
      ) {
        this.importDialogTitle = row.commandType === 1 ? "上传" : "设置参数";
        this.importVisible = true;
      } else {
        this.otherVisible = true;
      }
    },
    uploadSuccess(value) {
      const index = this.list.findIndex(
        (item) => item.commandId === this.tableRow.commandId
      );
      if (index > -1) {
        this.$set(this.list, index, { ...this.tableRow, ...value });
      }
    },
    editSuccess(value) {
      const index = this.list.findIndex(
        (item) => item.commandId === this.tableRow.commandId
      );
      if (index > -1) {
        this.$set(this.list, index, { ...this.tableRow, ...value });
      }
    },
    //提交
    submitForm() {
      const { packetName, remark } = this.formInfo;
      const postData = {
        packetName,
        remark,
      };
      let arr = [];
      for (let i = 0; i < this.list.length; i++) {
        let obj = {
          param: {},
        };
        obj.commandId = this.list[i].commandId; // id
        obj.commandType = this.list[i].commandType; // 类型
        if (this.list[i].param !== "双击进行操作") {
          if (this.list[i].commandType == 1) {
            this.list[i].newFileName &&
              (obj.param.newName = this.list[i].newFileName); // 新文件名
            this.list[i].oldFileName &&
              (obj.param.oldName = this.list[i].oldFileName); // 旧文件名称
            this.list[i].filePath &&
              (obj.param.filePath = this.list[i].filePath); // 版本号
            this.list[i].remark && (obj.param.remark = this.list[i].remark); // 说明
            this.list[i].fileVersion &&
              (obj.param.fileVersion = this.list[i].fileVersion); // 版本号
            this.list[i].isDefault != undefined &&
              (obj.param.isDefault = this.list[i].isDefault ? "1" : "0"); // 是否默认
            this.list[i].terminalFilePath &&
              (obj.param.terminalFilePath = this.list[i].terminalFilePath); // 版本号
            arr.push(obj);
          } else {
            obj.param = this.list[i].param;
            arr.push(obj);
          }
          //
        }
      }
      if (this.formInfo.packetName === "") {
        this.$message.warning({
          message: "请输入命令包名称",
          duration: 2000,
        });
        return;
      }
      if (arr.length === 0) {
        this.$message.warning({
          message: "请添加操作",
          duration: 2000,
        });
        return;
      }
      postData.commandParams = JSON.stringify(arr);
      this.loading = true;
      createCommand(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "添加成功",
            duration: 2000,
          });
          this.$emit("add-success");
          this.closeDrawer();
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss"></style>
