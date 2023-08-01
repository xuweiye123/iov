<template>
  <app-drawer
    :visibles="visibles"
    :title="'电池单体型号明细'"
    width="45%"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div
      slot="drawerContent"
      class="default-container-class detail-battery-height"
    >
      <el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap">
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
                  <el-form-item :label="'单体前14位编码：'" required>
                    <span>{{ formInfo.top14Code | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体型号：'" required>
                    <span>{{ formInfo.batCellName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体生产厂商：'" required>
                    <span>{{ formInfo.supplierName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定质量(kg)：'" required>
                    <span>{{ formInfo.quality | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'尺寸(mm)：'" required>
                    <span>{{ formInfo.cellSize | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'正极材料生产厂商：'" required>
                    <span>{{ formInfo.supplierAnode | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'3小时率额定容量C3(Ah)：'" required>
                    <span>{{ formInfo.capacityc3 | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体能量密度(Wh/kg)：'" required>
                    <span>{{ formInfo.energyDensity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体充电倍率(C)：'" required>
                    <span>{{ formInfo.chargeratio | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'正极材料：'" required>
                    <span>{{ formInfo.anodeType | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电解液类型：'" required>
                    <span>{{ formInfo.electrolyteType | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电池类型：'" required>
                    <span>{{ formInfo.batteryType | processData}}</span>
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
                  <el-form-item :label="'单体厂商规格：'" required>
                    <span>{{ formInfo.specification | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电池单体规格代码：'" required>
                    <span>{{ formInfo.batCellCode | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定容量(Ah)：'" required>
                    <span>{{ formInfo.capacity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'隔膜类型：'" required>
                    <span>{{ formInfo.separatorName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'标称电压(V)：'" required>
                    <span>{{ formInfo.voltage | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'负极材料生产厂商：'" required>
                    <span>{{ formInfo.supplierCathode | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体最高允许充电电压(V)：'" required>
                    <span>{{ formInfo.voltageMax | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体功率密度(W/kg)：'" required>
                    <span>{{ formInfo.powerDensity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体充放电次数(次)：'" required>
                    <span>{{ formInfo.cyclNumber | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'负极材料：'" required>
                    <span>{{ formInfo.cathodeType | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'外形：'" required>
                    <span>{{ formInfo.shapeType | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'电解质成分：'" required>
                    <span>{{ formInfo.electrolyteCompositionType | processData}}</span>
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
import { getCell } from "@/api/batterySys/batcell";

export default {
  name: "detailCellDrawer",
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
  data() {
    return {
      formInfo: {},
    };
  },
  watch: {
    visibles: {
      handler(v) {
        if(v){
           this.getDetailData(this.data.id)
        }
      },
      immediate: true,
    },
  },
  methods: {
    //关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = {};
    },
    getDetailData(id){
      getCell(id)
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
