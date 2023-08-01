<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        @click-filter="handleFilter"
        @click-collapse="handleCollapse"
        @click-clear="handleClear"
        :isdisabled="listLoading"
      />
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
        :isShowOperation="true"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isDisabled'">
            <el-switch
              v-model="scope.row.isDisabled"
              @change="switchChange(scope.$index, scope.row)"
            >
            </el-switch>
          </span>
          <span v-else-if="scope.item.prop === 'isLocked'">
            <el-switch
              v-model="scope.row.isLocked"
              @change="lockedChange(scope.$index, scope.row)"
            >
            </el-switch>
          </span>
          <!-- <span v-else-if="scope.item.prop === 'userType'">
            {{scope.row[scope.item.prop]===0?'内部账户':'外部账户'}}
          </span> -->
          <span v-else-if="scope.item.prop === 'isAdmin'">
            {{ scope.row[scope.item.prop] === 0 ? "普通用户" : "超级管理员" }}
          </span>
          <span v-else-if="scope.item.prop === 'loginName'">
            <a class="vinNo" @click="handleDetail(scope.row)">{{
              scope.row[scope.item.prop] | processData
            }}</a>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <div style="text-align: left !important;">
            <a v-for="(l, index) in insideList" :key="index">
              <el-tooltip
                class="item"
                effect="dark"
                :content="l.functionName"
                :disabled="$store.state.app.isDisTooltip"
                placement="top"
              >
                <span v-if="l.url == 'setRole' && scope.row.isAdmin == 1">
                </span>
                <span v-else-if="l.url == 'setCar' && scope.row.isAdmin == 1">
                </span>
                <span
                  v-else
                  class="card-action"
                  @click="authouizeButtonAction(scope.row, l)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
              </el-tooltip>
            </a>
          </div>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-user
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @userComplete="userComplete"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// // utils
// import { operateWidth } from "@/utils/base";

// request
import {
  getUser,
  deleteUser,
  enableUser,
  disableUser,
  lockUser,
  unlockUser,
  // resetUserPwd,
} from "@/api/system/user";
import { allRole } from "@/api/system/role";

// 组件
import AddUser from "./components/addUser";
// import customField from "./components/tableField"
// 辅助函数
export default {
  name: "user",
  components: {
    AddUser,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        email: "",
        mobile: "",
        roleId: "",
      },
      // 字段管理所需字段
      tableList: [
        {
          value: "用户名",
          prop: "loginName",
          width: 125,
          checked: true,
        },
        {
          value: "工作邮箱",
          prop: "email",
          width: 140,
          checked: true,
        },
        {
          value: "手机号码",
          prop: "mobile",
          width: 100,
          checked: true,
        },
        // {
        //   value: "用户类型",
        //   prop: "userType",
        //   width: 90,
        //   checked: true,
        // },
        {
          value: "用户类别",
          prop: "isAdmin",
          width: 100,
          checked: true,
        },
        {
          value: "所属角色",
          prop: "userRole",
          width: 140,
          checked: true,
        },
        {
          value: "最近登录时间",
          prop: "lastLoginTime",
          width: 140,
          checked: true,
        },
        {
          value: "用户状态",
          prop: "isDisabled",
          width: 70,
          checked: true,
        },
        {
          value: "锁定状态",
          prop: "isLocked",
          width: 70,
          checked: true,
        },
      ],
      multipleSelection: [],
      roleNameList: [],
      isEdit: 0, //0:新增；1：编辑；2：角色分配；3：车辆权限分配；4：查看用户
      addUpdateVisible: false /* 添加/编辑账户 */,
      isPut: false,
      MESVisible: false,
      DBCVisible: false,
    };
  },
  watch: {},
  computed: {
    activeName() {
      return this.$store.state.theme.activeName;
    },
    // 查询区数据
    searchList() {
      return [
        {
          label: "用户名",
          value: "loginName",
          type: "input",
        },
        {
          label: "工作邮箱",
          value: "email",
          type: "input",
        },
        {
          label: "手机号码",
          value: "mobile",
          type: "input",
        },
        {
          label: "所属角色",
          value: "roleId",
          type: "select",
          options: {
            data: this.roleNameList,
            extraProps: {
              label: "roleName",
              value: "roleId",
            },
          },
        },
      ];
    },
    specialButton() {
      return this.insideList.filter(
        (item) => item.url == "setRole" || item.url == "setCar"
      );
    },
  },
  mounted() {
    this.allRoleFc();
  },
  methods: {
    //获取角色下拉
    allRoleFc() {
      allRole()
        .then(({ data }) => {
          if (data.code === 0) {
            this.roleNameList = data.data || [];
          }
        })
        .catch(() => {});
    },
    // 点击列
    rowClick(row) {
      if (row.loginName === "admin") {
        return false;
      } else {
        let rows = [];
        rows.push(row);
        this.toggleSelection(rows);
      }
    },

    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getUser(this.listQuery)
        .then(({ data }) => {
          this.listLoading = false;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            if (
              this.list.every((item) => {
                return item.isAdmin == 1;
              })
            ) {
              // this.actionWidth = 38 * 3;
              this.actionWidth = this.operateWidth(
                this.insideList.length - this.specialButton.length
              );

              // console.log(this.actionWidth,11)
            } else {
              // this.actionWidth = 38 * 5;
              this.actionWidth = this.operateWidth(this.insideList.length);
              // console.log(this.actionWidth,22)
            }
            this.list.forEach((item) => {
              item.isDisabled = item.isDisabled === 1 ? false : true;
              item.isLocked = item.isLocked === 1 ? false : true;
              item.userRole = item.userRoleList.length
                ? item.userRoleList
                    .map((item) => {
                      return item.roleName;
                    })
                    .join("、")
                : "";
            });
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //操作列方法
    authouizeButtonAction(row, item) {
      switch (item.url) {
        case "update":
          this.handleUpdate(row);
          break;
        case "delete":
          this.handleDelete(row);
          break;
        // case "resetPwd":
        //   this.handleResetPwd(row);
        //   break;
        case "setRole":
          this.handleSetRole(row);
          break;
        case "setCar":
          this.handleSetCar(row);
          break;
        case "MESAuthority":
          this.handleMESAuthority(row);
          break;
        case "DBCParamAuth":
          this.handleDBCParamAuth(row);
          break;
        default:
          break;
      }
    },
    /**
     * @name: 查看账户角色
     * @param {*}
     */
    handleDetail(row, e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.tableRow = row;
      this.isEdit = 4;
      this.addUpdateVisible = true;
    },

    /**
     * @name: 添加账户
     * @param {*}
     */
    handleAdd() {
      this.isEdit = 0;
      this.addUpdateVisible = true;
    },
    /**
     * @name: MES授权配置
     * @param {*}
     */
    handleMESAuthority(row) {
      this.tableRow = row;
      this.MESVisible = true;
    },
    /**
     * @name: DBC参数授权
     * @param {*}
     */
    handleDBCParamAuth(row) {
      this.tableRow = row;
      this.DBCVisible = true;
    },
    /**
     * @name: 新增、编辑结束后
     * @param {*}
     */
    userComplete() {
      this.listLoad();
    },
    /**
     * @name: 关闭Dialog
     * @param {*}
     */
    closeDrawer() {
      this.$emit("update:visibles", false);
    },

    // 编辑
    handleUpdate(row) {
      this.tableRow = row;
      this.isEdit = 1;
      this.addUpdateVisible = true;
    },

    // 删除
    handleDelete(row) {
      this.$confirm("删除此用户，会删除相关信息！", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const deleteData = {
            userId: row.userId,
            loginName: row.loginName,
          };
          deleteUser(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除用户成功!",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },

    // handleResetPwd(row) {
    //   this.$confirm("确定要重置密码？", "重置密码", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       resetUserPwd(row.userId).then(({ data }) => {
    //         if (data.code === 0) {
    //           this.listLoad();
    //           this.$message.success({
    //             message: "重置密码成功!",
    //             duration: 2 * 1000,
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },
    /**
     * @name: 设置角色权限
     * @param {*}
     */
    handleSetRole(row) {
      this.tableRow = row;
      this.isEdit = 2;
      this.addUpdateVisible = true;
    },
    /**
     * @name: 设置车辆权限
     * @param {*}
     */
    handleSetCar(row) {
      this.tableRow = row;
      this.isEdit = 3;
      this.addUpdateVisible = true;
    },

    /**
     * @name: 账户的启用和禁用
     * @param {*}
     */
    switchChange(e, row) {
      // console.log("row", row);
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      let flag = row.isDisabled; //保存点击之后v-modeld的值(true，false)
      row.isDisabled = !row.isDisabled; //保持switch点击前的状态
      if (flag) {
        this.$confirm("您确定要启用这个账户吗？", "启用账户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this._isEnable(row);
            // row.isDisabled = true;
            this.$message.success({
              message: "启用成功!",
            });
          })
          .catch(() => {});
      } else {
        this.$confirm("您确定要禁用这个账户吗？", "禁用账户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // console.log("row", row);
            this._isDisable(row);
            // row.isDisabled = false;
            this.$message.success({
              message: "禁用成功!",
            });
          })
          .catch(() => {});
      }
    },
    /**
     * @name: 启用
     * @param {*}
     */
    _isEnable(row) {
      enableUser(row).then(({ data }) => {
        if (data.code === 0) {
          this.listLoad();
        }
      });
    },
    /**
     * @name: 禁用
     * @param {*}
     */
    _isDisable(row) {
      disableUser(row).then(({ data }) => {
        if (data.code === 0) {
          this.listLoad();
        }
      });
    },

    /**
     * @name: 账户的锁定和解锁
     * @param {*}
     */
    lockedChange(e, row) {
      // console.log("row", row);
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      let status = row.isLocked; //保存点击之后v-modeld的值(true，false)
      row.isLocked = !row.isLocked; //保持switch点击前的状态
      if (!status) {
        this.$confirm("您确定要锁定该账户吗？", "锁定账户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this._isLocked(row);
            // row.isLocked = false;
            this.$message.success({
              message: "锁定成功!",
            });
          })
          .catch(() => {});
      } else {
        this.$confirm("您确定要解除锁定该账户吗？", "解锁账户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // console.log("row", row);
            this._isUnLocked(row);
            // row.isLocked = true;
            this.$message.success({
              message: "解锁成功!",
            });
          })
          .catch(() => {});
      }
    },

    /**
     * @name: 锁定
     * @param {*}
     */
    _isLocked(row) {
      lockUser(row).then(({ data }) => {
        if (data.code === 0) {
          this.listLoad();
        }
      });
    },
    /**
     * @name: 解锁
     * @param {*}
     */
    _isUnLocked(row) {
      unlockUser(row).then(({ data }) => {
        if (data.code === 0) {
          this.listLoad();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
