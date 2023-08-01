<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form :listQuery="listQuery" :searchList="searchList" />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :is-collapse="false"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div
      :style="{ 'min-height': tableHeight + 'px', 'margin-top': '10px' }"
      v-loading="listLoading"
    >
      <el-scrollbar wrap-class="default-scrollbar__wrap">
        <el-collapse
          class="salesCollapse"
          v-model="activeNames1"
          @change="collapseChange1"
        >
          <el-collapse-item name="1">
            <template slot="title">
              <i
                style="color:#929292;margin-right:5px;"
                :class="
                  active1
                    ? 'iconfont icon-arrowDown '
                    : 'iconfont icon-arrowRight'
                "
              ></i>
              <span>车辆基础信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="VIN码：" size="mini">
                      {{ listObj.vinNo | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="绑定状态：" size="mini">
                      {{
                        listObj.isBindTerminal == 1
                          ? "已绑定终端"
                          : listObj.isBindTerminal == 2
                          ? "未绑定终端"
                          : "-"
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="终端编号：" size="mini">
                      {{ listObj.terminalCode | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="TBOXSN：" size="mini">
                      {{ listObj.barCode | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="绑定时间：" size="mini">
                      {{ listObj.terminalBindTime | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="固件版本：" size="mini">
                      {{ listObj.firmware | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="DBC是否存在：" size="mini">
                      {{ listObj.dbcIsExist | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SD卡剩余容量：" size="mini">
                      {{ listObj.residualCapacity | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          class="salesCollapse"
          v-model="activeNames2"
          @change="collapseChange2"
        >
          <el-collapse-item name="2">
            <template slot="title">
              <i
                style="color:#929292;margin-right:5px;"
                :class="
                  active2
                    ? 'iconfont icon-arrowDown '
                    : 'iconfont icon-arrowRight'
                "
              ></i>
              <span>车辆实时信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="终端是否在线：">
                      {{ listObj.isOnline | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="数据时间：">
                      {{ listObj.travelTime | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          class="salesCollapse"
          v-model="activeNames3"
          @change="collapseChange3"
        >
          <el-collapse-item name="3">
            <template slot="title">
              <i
                style="color:#929292;margin-right:5px;"
                :class="
                  active3
                    ? 'iconfont icon-arrowDown '
                    : 'iconfont icon-arrowRight'
                "
              ></i>
              <span>SIM卡信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="ICCID1：">
                      {{ listObj.iccidOne | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡状态：">
                      {{ listObj.simStatusOne | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡在线状态：">
                      {{ listObj.simIsOnlineOne | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="ICCID2：">
                      {{ listObj.iccidTwo | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡状态：">
                      {{ listObj.simStatusTwo | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡在线状态：">
                      {{ listObj.simIsOnlineTwo | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse
          class="salesCollapse"
          v-model="activeNames4"
          @change="collapseChange4"
        >
          <el-collapse-item name="4">
            <template slot="title">
              <i
                style="color:#929292;margin-right:5px;"
                :class="
                  active4
                    ? 'iconfont icon-arrowDown '
                    : 'iconfont icon-arrowRight'
                "
              ></i>
              <span>诊断信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="24">
                    <el-form-item label="诊断结果：">
                      {{ listObj.checkResult | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
// 组件

import { getPagelist } from "@/api/carManageSys/salesInspection";

// 辅助函数
export default {
  doNotInit: true,
  name: "salesInspection",
  mixins: [pagingMixin, otherHeight],
  components: {},
  filters: {},
  data() {
    return {
      listQuery: {
        vinNo: "",
        barCode: "",
      },
      activeNames1: "1",
      activeNames2: "2",
      activeNames3: "3",
      activeNames4: "4",
      active1: true,
      active2: true,
      active3: true,
      active4: true,
      listObj: {},
    };
  },
  mounted() {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "TBOXSN",
          value: "barCode",
          type: "input",
        },
      ];
    },
  },
  methods: {
    handleClear() {
      for (const k in this.listQuery) {
        if (k === "pageNum" || k === "pageSize") {
          continue;
        } else {
          this.listQuery[k] = "";
        }
      }

      this.listObj = {};
    },
    // 加载数据
    listLoad() {
      if (this.listQuery.vinNo == "" && this.listQuery.barCode == "") {
        this.$message.warning({
          message: "请输入VIN码或TBOXSN",
          duration: 2 * 1000,
        });
        return;
      }
      this.listObj = {};
      this.listLoading = true;
      getPagelist(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            if (data.data.length == 0) {
              this.$message.warning({
                message: "该车暂无信息",
                duration: 2 * 1000,
              });
              return;
            }
            this.listObj = data.data[0];
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    collapseChange1(e) {
      this.active1 = e.length ? true : false;
    },
    collapseChange2(e) {
      this.active2 = e.length ? true : false;
    },
    collapseChange3(e) {
      this.active3 = e.length ? true : false;
    },
    collapseChange4(e) {
      this.active4 = e.length ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item--mini .el-form-item__label{
  font-weight: 400;
  color: #262834 !important;
}
::v-deep .el-form-item--mini .el-form-item__content{
  font-weight: 400;
  color: #595757 !important;
}
::v-deep .el-form-item--mini.el-form-item {
  margin-bottom: 12px !important;
}
::v-deep .el-collapse {
  border: 0 !important;
}
::v-deep .el-row.is-align-middle {
  display: flex !important;
  align-items: flex-start !important;
}
::v-deep .el-form-item__content {
  word-break: break-word !important;
}

::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    padding: 0 0 25px 0;
    max-height: calc(100vh - 234px); // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}

</style>
