<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <el-form :model="listQuery" label-width="65px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="VIN码：">
                <vin-select 
                  :is-vin="true" 
                  v-model="listQuery.vinNo" 
                  @vinNoTotal="getVinNoTotal"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="TBOXSN：">
                <el-input
                  v-model="listQuery.barCode"
                  placeholder="TBOXSN"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
    <div class="section-content" 
      :style="{ 'min-height': tableHeight  + 'px', 'margin-top': '10px' }">
      <el-scrollbar wrap-class="default-scrollbar__wrap">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="title-style"></span>
              <span>车辆基础信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="VIN码：" size="mini">
                      {{listObj.vinNo || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="绑定状态："  size="mini">
                      {{listObj.isBindTerminal==1?"已绑定终端":listObj.isBindTerminal==2?"未绑定终端":'-' || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="终端编号："  size="mini">
                      {{listObj.terminalCode || "-"}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="TBOXSN："  size="mini">
                      {{listObj.barCode || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="绑定时间："  size="mini">
                      {{listObj.terminalBindTime || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="固件版本："  size="mini">
                      {{listObj.firmware || "-"}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="DBC是否存在："  size="mini">
                      {{listObj.dbcIsExist || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SD卡剩余容量："  size="mini">
                      {{listObj.residualCapacity || "-"}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <span class="title-style"></span>
              <span>车辆实时信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="终端是否在线：">
                      {{listObj.isOnline || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="数据时间：">
                      {{listObj.travelTime || "-"}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <span class="title-style"></span>
              <span>SIM卡信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="8">
                    <el-form-item label="ICCID：">
                      {{listObj.iccid || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡状态：">
                      {{listObj.simStatus || "-"}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="SIM卡在线状态：">
                      {{listObj.simIsOnline || "-"}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <span class="title-style"></span>
              <span>诊断信息</span>
            </template>
            <div class="field">
              <el-form :label-position="'right'" label-width="100px">
                <el-row :gutter="10" type="flex" justify="start" align="middle">
                  <el-col :span="24">
                    <el-form-item label="诊断结果：">
                      {{listObj.checkResult || "-"}}
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

import {
  getPagelist,
} from "@/api/carManageSys/salesInspection";

// 辅助函数
export default {
  doNotInit: true,
  name: "salesInspection",
  mixins: [pagingMixin,otherHeight],
  components: {},
  filters: {},
  data() {
    return {
      listQuery: {
        vinNo: "",
        barCode: "",
      },
      activeNames: ["1", "2", "3","4"],
      listObj: {},
      showfilter: false,
      listLoading:false,
      list: [],
  
    };
  },
  watch: {},
  mounted() {
  },
  methods: {
    handleClear(){
      for (const k in this.listQuery) {
        if (k === 'pageNum' || k === 'pageSize') {
          continue
        } else {
          this.listQuery[k] = ''
        }
      }

      this.listObj = {}
    },
    // 加载数据
    listLoad() { 
      if(this.listQuery.vinNo==""&&this.listQuery.barCode==""){
        this.$message.warning({
            message: "请输入VIN码或TBOXSN",
            duration: 2 * 1000,
          });
        return
      }    
      this.listObj = {}
      this.listLoading = true
      getPagelist(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          if(data.data.length == 0){
            this.$message.warning({
              message: '该车暂无信息',
              duration: 2 * 1000
            })
            return
          }
          this.listObj = data.data[0]
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false;
      });
    },

  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    padding-right: 15px;
    max-height: 60vh; // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}
::v-deep .el-form-item--mini.el-form-item{
  margin-bottom: 12px !important;
}
::v-deep .el-collapse{
  border:0 !important;
}
::v-deep .el-row.is-align-middle{
  display: flex !important;
  align-items: flex-start !important;
}
::v-deep .el-form-item__content{
  word-break: break-word !important;
}
</style>
