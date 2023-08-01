<template>
  <app-drawer
    :visibles="visibles"
    :title="'电池模块型号明细'"
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
                  <el-form-item :label="'模块厂商规格：'" required>
                    <span>{{ formInfo.specification | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块型号：'" required>
                    <span>{{ formInfo.batmoduleName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块生产厂商：'" required>
                    <span>{{ formInfo.supplierName | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'尺寸(mm)：'" required>
                    <span>{{ formInfo.modulesize | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'标称电压(V)：'" required>
                    <span>{{ formInfo.voltage | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'单体串并联方式：'" required>
                    <span>{{ formInfo.seriesparallerl | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块能量密度(Wh/kg)：'" required>
                    <span>{{ formInfo.energydensity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块充电倍率(C)：'" required>
                    <span>{{ formInfo.chargeratio | processData}}</span>
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
                  <el-form-item :label="'模块前14位编码：'" required>
                    <span>{{ formInfo.top14Code | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块规格代码：'" required>
                    <span>{{ formInfo.batmoduleCode | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块所含单体个数：'" required>
                    <span>{{ formInfo.cellamount | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定容量(Ah)：'" required>
                    <span>{{ formInfo.capacity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'额定质量(kg)：'" required>
                    <span>{{ formInfo.quality | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'3小时率额定容量C3(Ah)：'" required>
                    <span>{{ formInfo.capacityc3 | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块功率密度(W/kg)：'" required>
                    <span>{{ formInfo.powerdensity | processData}}</span>
                  </el-form-item>
                  <el-form-item :label="'模块充放电次数(次)：'" required>
                    <span>{{ formInfo.cyclnumber | processData}}</span>
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
import { getCellModule } from "@/api/batterySys/batmodule";
export default {
  name: "detailCellModuleDrawer",
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
          this.gteModuleData(this.data.id)
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
    gteModuleData(id){
      getCellModule(id)
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
