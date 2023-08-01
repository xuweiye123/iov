<template>
  <app-drawer
    :visibles="visibles"
    :title="'电池包型号明细'"
    width="45%"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div
      slot="drawerContent"
      class="default-container-class"
    >
      <el-scrollbar style="height: calc(100vh - 100px);" wrap-class="default-scrollbar__wrap">
        <vue-linetitle>
          <div style="font-size: xx-large">
            <el-row :gutter="10" type="flex" justify="start" align="middle">
              <el-col :span="12">
                <el-form
                  inline-message
                  ref="formLeft"
                  size="mini"
                  :model="formInfo"
                  :label-position="'right'"
                  :label-width="$t('staff.createAndUpdate.leftLabelWidth')"
                >
                  <el-form-item :label="'电池包厂商规格：'" required>
                    <span>{{ formInfo.specification | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电池包型号：'" required>
                    <span>{{ formInfo.batpackageName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电池包厂商：'" required>
                    <span>{{ formInfo.supplierName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'标称电压(V)：'" required>
                    <span>{{ formInfo.voltage | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'冷却方式：'" required>
                    <span>{{ formInfo.coolingmethod | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包充电倍率(C)：'" required>
                    <span>{{ formInfo.chargeratio | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包充放电次数(次)：'" required>
                    <span>{{ formInfo.cyclnumber | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包能量密度(Wh/kg)：'" required>
                    <span>{{ formInfo.energydensity | processData}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form
                  inline-message
                  ref="formLeft"
                  size="mini"
                  :model="formInfo"
                  :label-position="'right'"
                  :label-width="$t('staff.createAndUpdate.leftLabelWidth')"
                >
                  <el-form-item :label="'包前14位编码：'" required>
                    <span>{{ formInfo.top14Code | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电池包规格代码：'" required>
                    <span>{{ formInfo.batpackageCode | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'尺寸(mm)：'" required>
                    <span>{{ formInfo.packageSize | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定容量(Ah)：'" required>
                    <span>{{ formInfo.capacity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定质量(kg)：'" required>
                    <span>{{ formInfo.quality | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包模块串并联方式：'" required>
                    <span>{{ formInfo.seriesparallerl | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包功率密度(W/kg)：'" required>
                    <span>{{ formInfo.powerdensity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'包温度探针总数：'" required>
                    <span>{{ formInfo.termperatureamount | processData}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </vue-linetitle>
      </el-scrollbar>
    </div>
  </app-drawer>
</template>

<script>
// 混入
// import { pagingMixin } from '@/mixins/table'
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getCellPack } from "@/api/batterySys/batpackage";
export default {
  name: "lookCellPackDrawer",
  mixins: [otherHeight, tableStyle],
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    visibles: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visibles: {
      handler(v) {
        if(v){
          this.getCellPack(this.data.id)
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      formInfo: {},
    };
  },
  methods: {
    //关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
    },
    getCellPack(id){
      getCellPack(id)
        .then(({ data }) => {
          if (data.code == 0) {
            this.formInfo = data.data[0];
          }
        })
        .catch(() => {});
    }
  },
};
</script>

<style scoped></style>
