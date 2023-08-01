<template>
  <app-drawer
    :visibles="visibles"
    :title="
      isEdit ? '编辑产品型号' : isDetail ? '查看产品型号' : '新增产品型号'
    "
    width="60%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
    :wrapperClosable="isDetail"
    :isDrawerFoot="isDetail && !isLook ? false : true"
    :confirmText0="isDetail ? '审核' : '确定'"
  >
    <div slot="drawerContent">
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="160px"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item title="整车参数" name="1">
            <el-row :gutter="10" style="padding-top:10px;">
              <el-col :span="12">
                <el-form-item label="产品型号：" prop="productTypeNumber">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.productTypeNumber"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入产品型号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="储能装置种类：" prop="energyStorageTypeId">
                  <el-select
                    v-model.trim="formInfo.energyStorageTypeId"
                    filterable
                    clearable
                    placeholder="请选择"
                    :disabled="isDetail"
                  >
                    <el-option
                      v-for="(item, index) in energyStorageTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆类型：" prop="fuelTypeId">
                  <el-select
                    v-model.trim="formInfo.fuelTypeId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in carTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运行模式：" prop="runningModeId">
                  <el-select
                    v-model.trim="formInfo.runningModeId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in runModeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车身结构：" prop="carBodyTypeId">
                  <el-select
                    v-model.trim="formInfo.carBodyTypeId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in carBodyTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="级别：" prop="carLevelId">
                  <el-select
                    v-model.trim="formInfo.carLevelId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in carLevelList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="电动汽车续驶里程(km)："
                  prop="electricCarRange"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.electricCarRange"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入电动汽车续驶里程(km)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="电动汽车最高车速(km/h)："
                  prop="electricCarMaxSpeed"
                >
                  <el-input
                    v-model.trim="formInfo.electricCarMaxSpeed"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入电动汽车最高车速(km/h)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="各档位传动比："
                  prop="gearTransmissionRatio"
                >
                  <el-input
                    v-model.trim="formInfo.gearTransmissionRatio"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入各档位传动比"
                    maxlength="10"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="驱动电机参数" name="2">
            <el-row :gutter="10" style="padding-top:10px;">
              <el-col :span="12">
                <el-form-item label="驱动电机型号：" prop="motorType">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorType"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机型号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机类型：" prop="driveMotorTypeId">
                  <el-select
                    v-model.trim="formInfo.driveMotorTypeId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in driveMotorTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机布置型式位置："
                  prop="motorPositionId"
                >
                  <el-select
                    v-model.trim="formInfo.motorPositionId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in motorPositionList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机冷却方式：" prop="motorCoolingId">
                  <el-select
                    v-model.trim="formInfo.motorCoolingId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in motorCoolingList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定功率(kw)："
                  prop="motorRatedPower"
                >
                  <el-input
                    v-model.trim="formInfo.motorRatedPower"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定功率(kw)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机峰值功率(kw)："
                  prop="motorMaxPower"
                >
                  <el-input
                    v-model.trim="formInfo.motorMaxPower"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机峰值功率(kw)"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定转速(r/min)："
                  prop="motorRatedSpeed"
                >
                  <el-input
                    v-model.trim="formInfo.motorRatedSpeed"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定转速(r/min)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机峰值转矩(N.m)："
                  prop="motorMaxTorque"
                >
                  <el-input
                    v-model.trim="formInfo.motorMaxTorque"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机峰值转矩(N.m)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机安装数量：" prop="motorNumber">
                  <el-select
                    v-model.trim="formInfo.motorNumber"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in motorNumberList"
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最大工作电流："
                  prop="maxWorkingCurrent"
                >
                  <el-input
                    maxlength="100"
                    v-model.trim="formInfo.maxWorkingCurrent"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最大工作电流"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机序号：" prop="motorSerialNumber">
                  <el-input
                    maxlength="100"
                    v-model.trim="formInfo.motorSerialNumber"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机序号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最大输出转矩："
                  prop="motorMaxzhuanju"
                >
                  <el-input
                    maxlength="100"
                    v-model.trim="formInfo.motorMaxzhuanju"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最大输出转矩"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定转矩(N.m)："
                  prop="motorRatedTorque"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorRatedTorque"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定转矩(N.m)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最高转速(r/min)："
                  prop="motorMaxSpeed"
                >
                  <el-input
                    maxlength="100"
                    v-model.trim="formInfo.motorMaxSpeed"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最高转速(r/min)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item
            title="驱动电机参数2"
            name="3"
            v-show="formInfo.motorNumber == 2"
          >
            <el-row :gutter="10" style="padding-top:10px;">
              <el-col :span="12">
                <el-form-item label="驱动电机型号：" prop="motorType1">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorType1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机型号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机类型：" prop="driveMotorTypeId1">
                  <el-select
                    v-model.trim="formInfo.driveMotorTypeId1"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in driveMotorTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机布置型式位置："
                  prop="motorPositionId1"
                >
                  <el-select
                    v-model.trim="formInfo.motorPositionId1"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in motorPositionList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机冷却方式：" prop="motorCoolingId1">
                  <el-select
                    v-model.trim="formInfo.motorCoolingId1"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in motorCoolingList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定功率(kw)："
                  prop="motorRatedPower1"
                >
                  <el-input
                    v-model.trim="formInfo.motorRatedPower1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定功率(kw)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机峰值功率(kw)："
                  prop="motorMaxPower1"
                >
                  <el-input
                    v-model.trim="formInfo.motorMaxPower1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机峰值功率(kw)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定转速(r/min)："
                  prop="motorRatedSpeed1"
                >
                  <el-input
                    v-model.trim="formInfo.motorRatedSpeed1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定转速(r/min)1"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机峰值转矩(N.m)："
                  prop="motorMaxTorque1"
                >
                  <el-input
                    v-model.trim="formInfo.motorMaxTorque1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机峰值转矩(N.m)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最大工作电流："
                  prop="maxWorkingCurrent1"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.maxWorkingCurrent1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最大工作电流"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="驱动电机序号：" prop="motorSerialNumber1">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorSerialNumber1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机序号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最大输出转矩："
                  prop="motorMaxzhuanju1"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorMaxzhuanju1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最大输出转矩"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机额定转矩(N.m)："
                  prop="motorRatedTorque1"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorRatedTorque1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机额定转矩(N.m)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="驱动电机最高转速(r/min)："
                  prop="motorMaxSpeed1"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.motorMaxSpeed1"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入驱动电机最高转速(r/min)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="动力蓄电池参数" name="4">
            <el-row :gutter="10" style="padding-top:10px;">
              <el-col :span="12">
                <el-form-item
                  label="动力蓄电池包序号："
                  prop="powerBatteryNumber"
                >
                  <el-input
                    maxlength="100"
                    v-model.trim="formInfo.powerBatteryNumber"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入动力蓄电池包序号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="动力电池冷却方式："
                  prop="batteryCoolingMode"
                >
                  <el-input
                    maxlength="200"
                    v-model.trim="formInfo.batteryCoolingMode"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入动力电池冷却方式"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="动力电池生产厂商："
                  prop="manufacturerCode"
                >
                  <el-input
                    maxlength="30"
                    v-model.trim="formInfo.manufacturerCode"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入动力电池生产厂商"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电池类型：" prop="batteryTypeCodeId">
                  <el-select
                    v-model.trim="formInfo.batteryTypeCodeId"
                    filterable
                    clearable
                    :disabled="isDetail"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in batteryTypeCodeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="动力蓄电池包总数："
                  prop="powerBatteryCount"
                >
                  <el-input
                    maxlength="10"
                    v-model.trim="formInfo.powerBatteryCount"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入动力蓄电池包总数"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="蓄电池包温度探针总数：" prop="probesCount">
                  <el-input
                    maxlength="10"
                    v-model.trim="formInfo.probesCount"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入蓄电池包温度探针总数"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单体蓄电池总数：" prop="batteryCount">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.batteryCount"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入单体蓄电池总数"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="额定能量(KW·h)：" prop="ratedEnergy">
                  <el-input
                    v-model.trim="formInfo.ratedEnergy"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入额定能量(KW·h)"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="额定电压(V)：" prop="ratedVoltage">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.ratedVoltage"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入额定电压(V)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="动力电池总能量：" prop="batteryCapacity">
                  <el-input
                    maxlength="20"
                    v-model.trim="formInfo.batteryCapacity"
                    clearable
                    :disabled="isDetail"
                    placeholder="请输入动力电池总能量"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input
                    v-model.trim="formInfo.remark"
                    :rows="6"
                    :autosize="{ minRows: 3, maxRows: 3 }"
                    resize="none"
                    placeholder="请输入备注"
                    type="textarea"
                    maxlength="200"
                    :disabled="isDetail"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { getDropList } from "@/mixins/dictionaryDropList";

import reg from "@/utils/reg";
import {
  // getDictionaryInfo,
  createProduct,
  updateProduct,
  approval,
  getDetails,
} from "@/api/carManageSys/productType";
// 组件
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm, checkFormRule,getDropList],
  components: {},
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    const regz = /^[0-9]*$/;
    const regx = /^(([0-9])|([0-9]\.[0-9]))*$/;
    const regs = /^[0-9]{1,}[.]{0,}[0-9]{0,}$/;
    // 电动汽车续驶里程
    const electricCarRange = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入电动汽车续驶里程"));
      }
      if (!reg.Znumbers.test(value)||value > 65534) {
        return cb(new Error("只能输入0~65534的整数"));
      }
    };
    // // 电动汽车最高车速
    const electricCarMaxSpeed = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入电动汽车最高车速"));
      }
      if (!reg.Znumbers.test(value)||value > 254) {
        return cb(new Error("只能输入0~254的整数"));
      }
    };
    // 各档位传动比
    const gearTransmissionRatio = (rule, value, cb) => {
      if (value === undefined || !value) {
        return cb(new Error("请输入各档位传动比"));
      }
      if (!regx.test(value)) {
        return cb(new Error("只能输入数字和小数点"));
      }
    };
    // 驱动电机额定功率
    const motorRatedPower = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入驱动电机额定功率"));
      }
      if (!reg.Znumbers.test(value)||value > 255) {
        return cb(new Error("只能输入0~255的整数"));
      }
      // if (value < 0 || value > 255) {
      //   return cb(new Error("驱动电机额定功率范围在0~255之间"));
      // }
      // if (!regz.test(value)) {
      //   return cb(new Error("请输入数字"));
      // }
    };
    // 驱动电机序号
    const motorSerialNumber = (rule, value, cb) => {
      if (value === undefined || !value) {
        return cb(new Error("请输入驱动电机序号"));
      }
      const regs = /^[0-9]*[1-9][0-9]*$/;
      if (!regs.test(value)) {
        return cb(new Error("请输入大于0的整数"));
      }
    };
    // 驱动电机额定转矩
    const motorRatedTorque = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入驱动电机额定转矩"));
      }
      if (!reg.Znumbers.test(value)||value > 65534) {
        return cb(new Error("只能输入0~65534的整数"));
      }
      // if (value < 0 || value > 65534) {
      //   return cb(new Error("驱动电机额定转矩范围在0~65534之间"));
      // }
      // if (!regz.test(value)) {
      //   return cb(new Error("请输入数字"));
      // }
    };
    // 驱动电机序号
    const motorSerialNumber1 = (rule, value, cb) => {
      if (value === undefined || !value) {
        return cb(new Error("请输入驱动电机序号"));
      }
      const regs = /^[0-9]*[1-9][0-9]*$/;
      if (!regs.test(value)) {
        return cb(new Error("请输入大于0的整数"));
      }
    };
    // 动力蓄电池包序号
    const powerBatteryNumber = (rule, value, cb) => {
      if (value === undefined || !value) {
        return cb(new Error("请输入动力蓄电池包序号"));
      }
      const regs = /^[0-9]*[1-9][0-9]*$/;
      if (!regs.test(value)) {
        return cb(new Error("请输入大于0的整数"));
      }
    };
    // 单体蓄电池总数
    const batteryCount = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入单体蓄电池总数"));
      }
      if (!reg.Znumbers.test(value)||value > 65534) {
        return cb(new Error("只能输入0~65534的整数"));
      }
      // if (value < 0 || value > 65534) {
      //   return cb(new Error("单体蓄电池总数在0~65534之间"));
      // }
      // if (!regz.test(value)) {
      //   return cb(new Error("请输入数字"));
      // }
    };
    // 额定能量
    const ratedEnergy = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入额定能量"));
      }
      if (!reg.decimalNumbers.test(value)||value > 9999) {
        return cb(new Error("只能输入0~9999的整数或小数"));
      }
      // if (value < 0 || value > 9999) {
      //   return cb(new Error("额定能量在0~9999之间"));
      // }
      // if (!regs.test(value)) {
      //   return cb(new Error("请输入小数或整数"));
      // }
    };
    // 额定电压
    const ratedVoltage = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入额定电压"));
      }
      if (!reg.decimalNumbers.test(value)||value > 9999) {
        return cb(new Error("只能输入0~9999的整数或小数"));
      }
      // if (value < 0 || value > 9999) {
      //   return cb(new Error("额定电压在0~9999之间"));
      // }
      // if (!regs.test(value)) {
      //   return cb(new Error("请输入小数或整数"));
      // }
    };
    // 动力电池总能量
    const batteryCapacity = (rule, value, cb) => {
      value=value===0?value+"":value
      if (value === undefined || !value) {
        return cb(new Error("请输入动力电池总能量"));
      }
      if (!reg.decimalNumbers.test(value)) {
        return cb(new Error("只能输入大于等于0的整数或小数"));
      }
      // if (!regs.test(value)) {
      //   return cb(new Error("请输入整数或小数"));
      // }
    };
    return {
      loading: false,
      isLook: true,
      formInfo: {},
      energyStorageTypeList: [], // 储能装置种类
      carTypeList: [], // 车辆类型
      runModeList: [], // 运行模式
      carBodyTypeList: [], // 车身结构
      carLevelList: [], // 级别
      driveMotorTypeList: [], // 驱动电机类型
      motorPositionList: [], // 驱动电机布置型式位置
      motorCoolingList: [], // 驱动电机冷却方式
      batteryTypeCodeList: [], // 电池类型
      selectIdList: [1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1100],
      motorNumberList: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
      ],
      activeNames: ["1", "2", "3", "4"],
      terminalVisbles: false,
      tableRow: {},
      dropList:[
        { postData:{dicCode:1003},key:'driveMotorTypeList' },
        { postData:{dicCode:1004},key:'motorPositionList' },
        { postData:{dicCode:1005},key:'motorCoolingList' },
        { postData:{dicCode:1006},key:'batteryTypeCodeList' },
        { postData:{dicCode:1007},key:'energyStorageTypeList' },
        { postData:{dicCode:1008},key:'runModeList' },
        { postData:{dicCode:1009},key:'carBodyTypeList' },
        { postData:{dicCode:1010},key:'carLevelList' },
        { postData:{dicCode:1011},key:'carTypeList' },
      ],
      rules: {
        productTypeNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入产品型号",
            formObjName: "formInfo",
          },
        ],
        energyStorageTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择储能装置种类",
            formObjName: "formInfo",
          },
        ],
        fuelTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车辆类型",
            formObjName: "formInfo",
          },
        ],
        runningModeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择运行模式",
            formObjName: "formInfo",
          },
        ],
        carBodyTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车身结构",
            formObjName: "formInfo",
          },
        ],
        carLevelId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择级别",
            formObjName: "formInfo",
          },
        ],
        electricCarRange: [
          { required: true, trigger: "blur", validator: electricCarRange },
          { trigger: "change", validator: electricCarRange },
        ],
        electricCarMaxSpeed: [
          { required: true, trigger: "blur", validator: electricCarMaxSpeed },
          { trigger: "change", validator: electricCarMaxSpeed },
        ],
        gearTransmissionRatio: [
          { required: true, trigger: "blur", validator: gearTransmissionRatio },
          { trigger: "change", validator: gearTransmissionRatio },
        ],
        motorType: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机型号",
            formObjName: "formInfo",
          },
        ],
        driveMotorTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机类型",
            formObjName: "formInfo",
          },
        ],
        motorPositionId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机布置型式位置",
            formObjName: "formInfo",
          },
        ],
        motorCoolingId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机冷却方式",
            formObjName: "formInfo",
          },
        ],
        motorRatedPower: [
          { required: true, trigger: "blur", validator: motorRatedPower },
          { trigger: "change", validator: motorRatedPower },
        ],
        motorMaxPower: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机峰值功率",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorMaxSpeed: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最高转速",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorMaxTorque: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机峰值转矩",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机安装数量",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        maxWorkingCurrent: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最大工作电流",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorSerialNumber: [
          { required: true, trigger: "blur", validator: motorSerialNumber },
          { trigger: "change", validator: motorSerialNumber },
        ],
        motorMaxzhuanju: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最大输出转矩",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorRatedTorque: [
          { required: true, trigger: "blur", validator: motorRatedTorque },
          { trigger: "change", validator: motorRatedTorque },
        ],
        motorRatedSpeed: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机额定转速",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        powerBatteryNumber: [
          { required: true, trigger: "blur", validator: powerBatteryNumber },
          { trigger: "change", validator: powerBatteryNumber },
        ],
        batteryCoolingMode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入动力电池冷却方式",
            formObjName: "formInfo",
          },
        ],
        manufacturerCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入动力电池生产厂商",
            formObjName: "formInfo",
          },
        ],
        powerBatteryCount: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入动力蓄电池包总数",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        probesCount: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入蓄电池包温度探针总数",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        batteryCount: [
          { required: true, trigger: "blur", validator: batteryCount },
          { trigger: "change", validator: batteryCount },
        ],
        ratedEnergy: [
          { required: true, trigger: "blur", validator: ratedEnergy },
          { trigger: "change", validator: ratedEnergy },
        ],
        ratedVoltage: [
          { required: true, trigger: "blur", validator: ratedVoltage },
          { trigger: "change", validator: ratedVoltage },
        ],
        batteryCapacity: [
          { required: true, trigger: "blur", validator: batteryCapacity },
          { trigger: "change", validator: batteryCapacity },
        ],
        batteryTypeCodeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择电池类型",
            formObjName: "formInfo",
          },
        ],
        motorType1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机型号",
            formObjName: "formInfo",
          },
        ],
        driveMotorTypeId1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机类型",
            formObjName: "formInfo",
          },
        ],
        motorPositionId1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机布置型式位置",
            formObjName: "formInfo",
          },
        ],
        motorCoolingId1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择驱动电机冷却方式",
            formObjName: "formInfo",
          },
        ],
        motorRatedPower1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机额定功率",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorMaxPower1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机峰值功率",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorMaxSpeed1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最高转速",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorMaxTorque1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机峰值转矩",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        maxWorkingCurrent1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最大工作电流",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorSerialNumber1: [
          { required: true, trigger: "blur", validator: motorSerialNumber1 },
          { trigger: "change", validator: motorSerialNumber1 },
        ],
        motorMaxzhuanju1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机最大输出转矩",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorRatedTorque1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机额定转矩",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
        motorRatedSpeed1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机额定转速",
            ruleReg: "Znumbers",
            errorTips: "请输入大于等于0的整数",
            formObjName: "formInfo",
          },
        ],
      },
    };
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          // for (let i = 0; i < this.selectIdList.length; i++) {
          //   this.getSelectData(this.selectIdList[i]);
          // }
          // console.log(this.isEdit, this.isDetail, this.isLook, "1111");
          // || this.isDetail
          
          // 数据字典下拉
          this.getDropList(this.dropList)
          if (this.isEdit) {
            this.formInfo = { ...this.data };
          }

          if (this.isDetail) {
            this.formInfo.status = this.data.status;
            this.formInfo.productTypeId = this.data.productTypeId;

            if (this.formInfo.status === 0) {
              this.isLook = true;
            } else {
              this.isLook = false;
            }

            const postData = {
              productTypeId: this.formInfo.productTypeId,
            };
            getDetails(postData).then(({ data }) => {
              if (data.code === 0) {
                this.formInfo = data.data;
                this.formInfo.status = this.data.status;
                this.formInfo.productTypeId = this.data.productTypeId;
              }
            });
          }
        }
      },
    },
  },
  created() {},
  methods: {
    // 获取select数据列表
    // getSelectData(e) {
    //   const postData = {
    //     dictionaryTypeId: e + "",
    //   };
    //   getDictionaryInfo(postData).then(({ data }) => {
    //     if (data.code === 0) {
    //       this.updateSelectDataList(e, data.data || []);
    //     }
    //   });
    // },
    // updateSelectDataList(e, data) {
    //   switch (e) {
    //     case 1105:
    //       this.energyStorageTypeList = data;
    //       break;
    //     case 1100:
    //       this.carTypeList = data;
    //       break;
    //     case 1106:
    //       this.runModeList = data;
    //       break;
    //     case 1107:
    //       this.carBodyTypeList = data;
    //       break;
    //     case 1108:
    //       this.carLevelList = data;
    //       break;
    //     case 1101:
    //       this.driveMotorTypeList = data;
    //       break;
    //     case 1102:
    //       this.motorPositionList = data;
    //       break;
    //     case 1103:
    //       this.motorCoolingList = data;
    //       break;
    //     case 1104:
    //       this.batteryTypeCodeList = data;
    //       break;
    //   }
    // },
    // 关闭dialog
    closeDrawer() {
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createProduct(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("add-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _Update(postData) {
      this.loading = true;
      updateProduct(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("update-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 审核
    handleSubmit() {
      this.loading = true;
      const postData = {
        productTypeId: this.formInfo.productTypeId,
      };
      console.log(222, postData, this.formInfo.productTypeId);
      approval(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.closeDrawer();
            this.$emit("approval-complete");
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submitForm() {
      if (this.isDetail && this.isLook) {
        this.handleSubmit();
      } else {
        this.submitForm1();
      }
    },

    // 点击提交
    submitForm1() {
      let formlist = [];
      if (this.formInfo.motorNumber == 2) {
        formlist = [
          "productTypeNumber",
          "energyStorageTypeId",
          "fuelTypeId",
          "runningModeId",
          "carBodyTypeId",
          "carLevelId",
          "electricCarRange",
          "electricCarMaxSpeed",
          "gearTransmissionRatio",
          "motorType",
          "driveMotorTypeId",
          "motorPositionId",
          "motorCoolingId",
          "motorRatedPower",
          "motorMaxPower",
          "motorMaxSpeed",
          "motorMaxTorque",
          "motorNumber",
          "maxWorkingCurrent",
          "motorSerialNumber",
          "motorMaxzhuanju",
          "motorRatedTorque",
          "motorRatedSpeed",
          "motorType1",
          "driveMotorTypeId1",
          "motorPositionId1",
          "motorCoolingId1",
          "motorRatedPower1",
          "motorMaxPower1",
          "motorMaxSpeed1",
          "motorMaxTorque1",
          "maxWorkingCurrent1",
          "motorSerialNumber1",
          "motorMaxzhuanju1",
          "motorRatedTorque1",
          "motorRatedSpeed1",
          "powerBatteryNumber",
          "batteryCoolingMode",
          "manufacturerCode",
          "batteryTypeCodeId",
          "powerBatteryCount",
          "probesCount",
          "batteryCount",
          "ratedEnergy",
          "ratedVoltage",
          "batteryCapacity",
        ];
      } else {
        formlist = [
          "productTypeNumber",
          "energyStorageTypeId",
          "fuelTypeId",
          "runningModeId",
          "carBodyTypeId",
          "carLevelId",
          "electricCarRange",
          "electricCarMaxSpeed",
          "gearTransmissionRatio",
          "motorType",
          "driveMotorTypeId",
          "motorPositionId",
          "motorCoolingId",
          "motorRatedPower",
          "motorMaxPower",
          "motorMaxSpeed",
          "motorMaxTorque",
          "motorNumber",
          "maxWorkingCurrent",
          "motorSerialNumber",
          "motorMaxzhuanju",
          "motorRatedTorque",
          "motorRatedSpeed",
          "powerBatteryNumber",
          "batteryCoolingMode",
          "manufacturerCode",
          "batteryTypeCodeId",
          "powerBatteryCount",
          "probesCount",
          "batteryCount",
          "ratedEnergy",
          "ratedVoltage",
          "batteryCapacity",
        ];
      }
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: formlist,
      });
      if (!formcenter) {
        return;
      }
      const {
        productTypeNumber,
        energyStorageTypeId,
        fuelTypeId,
        runningModeId,
        carBodyTypeId,
        carLevelId,
        electricCarRange,
        electricCarMaxSpeed,
        gearTransmissionRatio,
        motorType,
        driveMotorTypeId,
        motorPositionId,
        motorCoolingId,
        motorRatedPower,
        motorMaxPower,
        motorMaxSpeed,
        motorMaxTorque,
        motorNumber,
        maxWorkingCurrent,
        motorSerialNumber,
        motorMaxzhuanju,
        motorRatedTorque,
        motorRatedSpeed,
        motorType1,
        driveMotorTypeId1,
        motorPositionId1,
        motorCoolingId1,
        motorRatedPower1,
        motorMaxPower1,
        motorMaxSpeed1,
        motorMaxTorque1,
        maxWorkingCurrent1,
        motorSerialNumber1,
        motorMaxzhuanju1,
        motorRatedTorque1,
        motorRatedSpeed1,
        powerBatteryNumber,
        batteryCoolingMode,
        manufacturerCode,
        batteryTypeCodeId,
        powerBatteryCount,
        probesCount,
        batteryCount,
        ratedEnergy,
        ratedVoltage,
        batteryCapacity,
        remark,
        productTypeId,
      } = this.formInfo;
      let postData = {};
      if (this.formInfo.motorNumber == 2) {
        postData = {
          productTypeNumber,
          energyStorageTypeId,
          fuelTypeId,
          runningModeId,
          carBodyTypeId,
          carLevelId,
          electricCarRange,
          electricCarMaxSpeed,
          gearTransmissionRatio,
          motorType,
          driveMotorTypeId,
          motorPositionId,
          motorCoolingId,
          motorRatedPower,
          motorMaxPower,
          motorMaxSpeed,
          motorMaxTorque,
          motorNumber,
          maxWorkingCurrent,
          motorSerialNumber,
          motorMaxzhuanju,
          motorRatedTorque,
          motorRatedSpeed,
          motorType1,
          driveMotorTypeId1,
          motorPositionId1,
          motorCoolingId1,
          motorRatedPower1,
          motorMaxPower1,
          motorMaxSpeed1,
          motorMaxTorque1,
          maxWorkingCurrent1,
          motorSerialNumber1,
          motorMaxzhuanju1,
          motorRatedTorque1,
          motorRatedSpeed1,
          powerBatteryNumber,
          batteryCoolingMode,
          manufacturerCode,
          batteryTypeCodeId,
          powerBatteryCount,
          probesCount,
          batteryCount,
          ratedEnergy,
          ratedVoltage,
          batteryCapacity,
          remark,
        };
      } else {
        postData = {
          productTypeNumber,
          energyStorageTypeId,
          fuelTypeId,
          runningModeId,
          carBodyTypeId,
          carLevelId,
          electricCarRange,
          electricCarMaxSpeed,
          gearTransmissionRatio,
          motorType,
          driveMotorTypeId,
          motorPositionId,
          motorCoolingId,
          motorRatedPower,
          motorMaxPower,
          motorMaxSpeed,
          motorMaxTorque,
          motorNumber,
          maxWorkingCurrent,
          motorSerialNumber,
          motorMaxzhuanju,
          motorRatedTorque,
          motorRatedSpeed,
          powerBatteryNumber,
          batteryCoolingMode,
          manufacturerCode,
          batteryTypeCodeId,
          powerBatteryCount,
          probesCount,
          batteryCount,
          ratedEnergy,
          ratedVoltage,
          batteryCapacity,
          remark,
        };
      }
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.productTypeId = productTypeId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
