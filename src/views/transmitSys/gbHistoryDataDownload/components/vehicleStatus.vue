<template>
  <app-drawer
    :visibles="visibles"
    :title="'选择-参数信息'"
    width="80%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :loading="loading"
    :isDrawerFoot="false"
    class="divScroll"
  >
    <div slot="drawerContent" class="bodyBox divScroll">
      <div class="butBox">
        <el-button type="primary" @click="handleSelectAll">{{
          ischeckbox == true ? "全选" : "不全选"
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
      <div class="itemBox" v-for="(item, index) in lieData" :key="index">
        <el-checkbox
          @change="handleCheckAllChange($event, item, item.children)"
          :indeterminate="item.isIndeterminate"
          v-model="item.checkAll"
          ><span class="fontTitle">{{ item.paramName }}</span></el-checkbox
        >
        <el-divider class="colorDivider"></el-divider>
        <el-row>
          <el-checkbox-group
            v-model="item.groupDate"
            @change="
              handleCheckedCitiesChange(item.groupDate, item, item.children)
            "
          >
            <el-col
              :span="6"
              v-for="(item2, index2) in item.children"
              :key="index2"
            >
              <div class="ListCss">
                <div class="ListCssTow">
                  <el-checkbox :label="item2.paramName"></el-checkbox>
                </div>
              </div>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>
    </div>
  </app-drawer>
</template>
<script>
// 组件
import { getHisDataParams } from "@/api/transmitSys/vehicleComponyManagement";
export default {
  name: "vehicleStatus",
  mixins: [],
  components: {},
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    ison: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ischeckbox: true,
      loading: false,
      checkedCities: [],
      groupDate: [],
      ool: [],
      lieData: [],
      ploadTree: {},
    };
  },
  mounted() {
    this.$on("clear", () => {
      this.$emit("closeDrawer");
    });
    this._getHisDataParams();
  },
  watch: {
    ison: {
      handler(val) {
        if (val) {
          this.ploadTree = {};
          this.lieData = [];
          this.lieData.forEach((item) => {
            item.groupDate = [];
            item.checkAll = false;
            item.isIndeterminate = false;
          });
          this._getHisDataParams();
        }
      },
    },
  },
  created() {},
  methods: {
    handleSubmit() {
      let groupDateName = [];
      if (this.lieData.length > 0) {
        this.lieData.forEach((item) => {
          if (item.groupDate) {
            let dataGroupDate = [];
            item.groupDate.forEach((item2) => {
              for (const key in item.children) {
                if (item.children[key].paramName == item2) {
                  dataGroupDate.push(item.children[key].paramValue);
                  groupDateName.push(item.children[key].paramName);
                }
              }
            });

            this.ploadTree[item.paramValue] = dataGroupDate;
          }
        });
      }
      console.log(groupDateName, "groupDateName");
      if (groupDateName.length > 0) {
        this.$emit("ploadTree", this.ploadTree, groupDateName, this.lieData);
        this.$emit("isont");
      } else {
        this.$message.warning({
          message: "请选择查询参数",
        });
      }
    },
    //加载数据
    _getHisDataParams() {
      getHisDataParams().then(({ data }) => {
        if (data.code === 0) {
          this.lieData = data.data;
          this.lieData.forEach((item) => {
            if (item.paramValue == "Motor") {
              item.paramName = "驱动电机1";
            }
            item.groupDate = [];
            item.checkAll = false;
            item.isIndeterminate = false;
          });
          //想数组指定位置添加元素
          this.lieData.splice(2, 0, {
            paramName: "驱动电机2",
            paramValue: "Motor2",
            checkAll: false,
            groupDate: [],
            isIndeterminate: false,
            children: [
              {
                paramName: "驱动电机序号",
                paramValue: "serial2",
                children: null,
              },
              {
                paramName: "驱动电机状态",
                paramValue: "status2",
                children: null,
              },
              {
                paramName: "驱动电机温度",
                paramValue: "temperature2",
                children: null,
              },
              {
                paramName: "驱动电机控制器温度",
                paramValue: "controllerTemperature2",
                children: null,
              },
              {
                paramName: "驱动电机转速",
                paramValue: "engineSpeed2",
                children: null,
              },
              {
                paramName: "驱动电机转矩",
                paramValue: "torque2",
                children: null,
              },

              {
                paramName: "电机控制器输入电压",
                paramValue: "inputVoltage2",
                children: null,
              },
              {
                paramName: "电机控制器直流母线电流",
                paramValue: "current2",
                children: null,
              },
            ],
          });
          //默认勾选所有
          console.log(this.lieData, "this.lieData");
          this.lieData.forEach((item) => {
            if (item.paramValue == "CarStatus") {
              item.groupDate = item.children.map((item) => item.paramName);
              item.checkAll = true;
              item.isIndeterminate = false;
            }
          });
        }
      });
    },
    // 全选
    handleSelectAll(isquan) {
      if (this.ischeckbox) {
        this.lieData.forEach((item) => {
          item.groupDate = item.children.map((item) => item.paramName);
          item.checkAll = true;
          item.isIndeterminate = false;
        });
      } else {
        this.lieData.forEach((item) => {
          item.groupDate = [];
          item.checkAll = false;
          item.isIndeterminate = false;
        });
      }
      this.ischeckbox = !this.ischeckbox;
    },
    // 确定
    submitForm() {
      this.closeDrawer();
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.$emit("isont");
    },
    //模块全选
    changeDate(val, item, list) {
      item.groupDate = val ? list.map((it) => it.paramName) : [];
      item.checkAll = val;
      item.isIndeterminate = false;
    },
    // 全选
    async handleCheckAllChange(val, item, list) {
      await this.changeDate(val, item, list);
      this.$forceUpdate();
    },
    changeDate2(value, item, list) {
      let checkedCount = value.length;
      item.checkAll = checkedCount === list.length;
      // console.log("value", value, list, checkedCount);
      item.isIndeterminate = checkedCount > 0 && checkedCount < list.length;
    },
    // 单选
    async handleCheckedCitiesChange(value, item, list) {
      await this.changeDate2(value, item, list);
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.butBox {
  text-align: right;
  position: fixed;
  top: 60px;
  right: 48px;
  z-index: 999;
}
.bodyBox {
  max-height: calc(100vh - 115px);
  overflow: auto;
  padding-right: 20px;
  margin-top: 25px;
}
.itemBox {
  padding: 16px;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
}
::v-deep .el-divider {
  margin: 5px 0;
}
.fontTitle {
  font-size: 16px;
}
.ListCss {
  // height: 30px;
  // line-height: 26px;
  margin-top: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-collapse: 0;
  overflow: hidden;
}
.ListCssTow {
  width: 100%;
  text-align: left;
  // padding-left: 15%;
  // border: 1px solid #dedede;
  border-collapse: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  /* padding: 4px; */
}
::v-deep .el-checkbox__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
</style>
