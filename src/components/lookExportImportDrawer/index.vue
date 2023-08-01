<template>
  <app-drawer
    :visibles="visibles"
    :title="!isExport ? '导入任务详情' : '导出记录'"
    :icon="!isExport ? 'icon-dialog-update' : 'icon-dialog-update'"
    width="65%"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
           <seach-form
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
        </div>
        <!--折叠 过滤 清空 -->
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          :is-collapse="false"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <!-- 按钮 -->
      <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
        <app-authorize-button
          :data="authouizeButtonList"
          @click-filter="showfilter = true"
          @click-delete="handleDelete"
        >
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="!isExport ? tableList2 : tableList"
            :scroll-line="8"
          />
        </app-authorize-button>

        <app-table
          slot="table"
          ref="table"
          :rowKey="'id'"
          :isTableSelection="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :pageObj="listQuery"
          :total="total"
          :tableHeights="tableHeight"
          :actionWidth="actionWidth"
          :actionFixed="actionFixed"
          @row-click="rowClick"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span
              v-if="
                (scope.item.prop === 'fileName' &&
                  scope.item.value === '导出文件名称') &
                  (scope.row.status === '已完成')
              "
            >
              <a
                @click.stop="() => {}"
                :class="'vinNo'"
                :href="scope.row.filePath"
                >{{ scope.row[scope.item.prop] }}</a
              >
            </span>
            <span
              v-else-if="
                scope.item.prop === 'filename' &&
                  scope.item.value === '导入文件名称'
              "
            >
              <a
                @click.stop="() => {}"
                :class="'vinNo'"
                :href="scope.row.filepath"
                >{{ scope.row[scope.item.prop] }}</a
              >
            </span>
            <span v-else-if="scope.item.prop === 'resultfilepath'">
              <a
                :class="'vinNo'"
                @click.stop="() => {}"
                v-if="scope.row[scope.item.prop]"
                :href="scope.row.resultfilepath"
              >
                {{
                  scope.row[scope.item.prop].substring(
                    scope.row[scope.item.prop].lastIndexOf("\/") + 1,
                    scope.row[scope.item.prop].length
                  )
                }}</a
              >
              <span v-else>-</span>
            </span>
            <el-progress
              v-else-if="scope.item.prop === 'progress' && scope.row[scope.item.prop]!=null"
              :text-outside="true"
              :stroke-width="10"
              :percentage="scope.row[scope.item.prop]?(
                scope.row[scope.item.prop]>1?100:
                parseFloat((scope.row[scope.item.prop]*100).toFixed(2))
              )
              :0"
            />
            <span v-else-if="scope.item.prop == 'status'">
              <el-tag
                :type="
                  scope.row.status == '未开始'
                    ? 'info'
                    : scope.row.status == '进行中'
                    ? ''
                    : scope.row.status == '已完成'
                    ? 'success'
                    : scope.row.status == '异常'
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
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { otherHeight } from "@/mixins/getOtherHeight";
// 辅助函数
import {
  getExportTaskList,
  getImportTaskList,
  deleteImportTask,
  deleteExportTask,
} from "@/api/batterySys/certificate";

export default {
  name: "lookExportImportDrawer",
  mixins: [pagingMixin, partialForm, drawerOtherHeight, tableStyle,otherHeight],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isExport: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "",
    },
  },
  watch: {
    visibles() {
      if (this.visibles) {
        this.listQuery.pageNum = 1;
        this.listLoad();
      }
    },
  },
  data() {
    return {
      listQuery: {
        category: "",
        // startTime: "",
        // endTime: "",
        timeRange:["",""],
      },
      actionFixed: "right",
      tableList: [
        {
          value: "导出文件名称",
          prop: "fileName",
          width: "200px",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140px",
          checked: true,
        },
        {
          value: "导出进度",
          prop: "progress",
          width: "90px",
          checked: true,
        },
        {
          value: "下载状态",
          prop: "status",
          width: "90px",
          checked: true,
        },
      ],
      tableList2: [
        {
          value: "导入文件名称",
          prop: "filename",
          width: "200px",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdon",
          width: "140px",
          checked: true,
        },
        {
          value: "导入成功率",
          prop: "progress",
          width: "90px",
          checked: true,
        },
        {
          value: "导入结果",
          prop: "resultfilepath",
          width: "180px",
          checked: true,
        },
        {
          value: "下载状态",
          prop: "status",
          width: "90px",
          checked: true,
        },
      ],
      multipleSelection: [],
      authouizeButtonList: [
        {
          functionName: "删除",
          functionNameEn: "删除",
          functionType: 1,
          url: "delete",
          icon: "ic_delete",
          isShow: 1,
          iconType: 2,
        },
      ],
    };
  },
  computed: {
    filterTableList() {
      if (this.isExport) {
        //导出
        return this.tableList.filter((item) => item.checked);
      } else {
        //导入
        return this.tableList2.filter((item) => item.checked);
      }
    },
    language() {
      return this.$store.getters.language;
    },
    // 查询区数据
    searchList() {
      return [
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
      ];
    },
  },
  methods: {
    //加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      
      this.listLoading = true;
      this.listQuery.category = this.category;
      if (this.isExport) {
        //查看导出任务列表
        getExportTaskList(this.listQuery).then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        }).finally(()=>{
          this.listLoading = false;
        })
      } else {
        //查看导入任务列表
        getImportTaskList(this.listQuery).then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        }).finally(()=>{
          this.listLoading = false;
        })
      }
    },
    //当选择项发生改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick({ row, column }) {
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
    },
    //删除按钮
    handleDelete() {
      if (this.multipleSelection.length == 0) {
        this.$alert("请选择删除内容", "温馨提示", {
          confirmButtonText: "确定",
        });
      } else {
        let fla = this.multipleSelection.some(function(value) {
          return value.status == "未开始";
        });
        if (fla) {
          //存在排队或进行中数据
          this.$alert("只能删除已完成和异常的数据！", "温馨提示", {
            confirmButtonText: "确定",
          });
        } else {
          let ids = { id: "" };
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (i == 0) {
              ids.id = this.multipleSelection[i].id;
            } else {
              ids.id = ids.id + "," + this.multipleSelection[i].id;
            }
          }
          this.$confirm("是否确认删除", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              //进行删除服务
              if (this.isExport) {
                //删除导出任务列表
                deleteExportTask(ids)
                  .then(({ data }) => {
                    if (data.code === 0) {
                      this.listLoad();
                      this.$message.success({
                        message: "删除成功",
                        duration: 2 * 1000,
                      });
                      this.$refs.table.refTable().clearSelection();
                    } else {
                      this.$message.error({
                        message: data.message,
                        duration: 2 * 1000,
                      });
                    }
                  })
                  .catch(() => {});
              } else {
                //删除导入任务列表
                deleteImportTask(ids)
                  .then(({ data }) => {
                    if (data.code === 0) {
                      this.listLoad();
                      this.$message.success({
                        message: "删除成功",
                        duration: 2 * 1000,
                      });
                      this.$refs.table.refTable().clearSelection();
                    } else {
                      this.$message.error({
                        message: data.message,
                        duration: 2 * 1000,
                      });
                    }
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        }
      }
    },
    //下载文件
    downFile(data) {
      console.log(data.fileName);
      const url = process.env.VUE_APP_API_HOST + "/" + data.fileName;
      console.log(url);
      // window.location.href = url
      /*//创建a标签
                const link = document.createElement('a')
                //download属性
                link.setAttribute('download','data')
                //href链接
                link.setAttribute('href','')
                //自执行点击事件
                link.click()
                document.body.removeChild(link)*/
      //window.open('https://blog.csdn.net/s1441101265/article/details/105504459/')
    },
    //关闭抽屉
    closeDrawer() {
      this.listQuery = {
        timeRange:["",""],
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.list = [];
      this.total = 0;
      this.multipleSelection = [];
      this.$emit("update:visibles", false);
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
