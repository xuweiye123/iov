<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <el-form
          ref="formSearch"
          :rules="rules"
          :model="listQuery"
          label-width="65px"
          style="width:100%"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="VIN码：" prop="vinNo">
                <vin-select
                  :is-vin="true"
                  @vinNoTotal="getVinNoTotal"
                  v-model="listQuery.vinNo"
                  @clearData="handleClear"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button
                :size="'small'"
                v-waves
                v-preventReClick
                type="primary"
                :disabled="loading || loading1"
                @click="handleDatabase"
              >
                <i
                  class="iconfont icon-query_dataBase"
                  style="margin-right:5px;"
                />
                查询数据库
              </el-button>
              <el-button
                :size="'small'"
                v-waves
                v-preventReClick
                type="primary"
                :disabled="loading || loading1"
                @click="handleTBOX"
              >
                <i class="iconfont icon-query_TBOX" style="margin-right:5px;" />
                查询TBOX
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 清空按钮 -->
      <!-- <app-search-button
        slot="bottom"
        :is-collapse="false"
        :isDisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      /> -->
    </app-search>
    <el-scrollbar wrap-class="default-scrollbar__wrap">
      <div
        class="section-content"
        style="padding:20px 20px 10px 15px;"
        v-loading="loading"
      >
        <el-form :label-position="'right'" label-width="110px">
          <el-row :gutter="10" type="flex" justify="space-between">
            <el-col :span="14">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-row type="flex" justif="start" style="flex-wrap: wrap">
                    <el-col :span="24">
                      <el-form-item label="前空调状态：" size="mini">
                        <el-switch
                          :disabled="commandDisabled"
                          v-model="commandObj.frontAirStatus"
                          @change="changeAirStatus($event, 1)"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="后空调状态：" size="mini">
                        <el-switch
                          :disabled="commandDisabled"
                          v-model="commandObj.rearAirStatus"
                          @change="changeAirStatus($event, 2)"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="解闭锁状态：" size="mini">
                        <el-switch
                          :disabled="commandDisabled"
                          v-model="commandObj.unblockingStatus"
                          @change="changeUnblocking"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex" justif="start" style="flex-wrap: wrap">
                    <el-col :span="24">
                      <el-form-item label="左后座椅加热档位：" size="mini">
                        <el-select
                          clearable
                          :disabled="commandDisabled"
                          v-model="commandObj.leftRearSeat"
                          @change="changeSeat($event, 3)"
                          placeholder="请选择"
                          filterable
                        >
                          <el-option
                            v-for="(item, index) in seatList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="右后座椅加热档位：" size="mini">
                        <el-select
                          clearable
                          :disabled="commandDisabled"
                          v-model="commandObj.rightRearSeat"
                          @change="changeSeat($event, 4)"
                          placeholder="请选择"
                          filterable
                        >
                          <el-option
                            v-for="(item, index) in seatList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="一键寻车：" size="mini">
                        <el-select
                          clearable
                          :disabled="commandDisabled"
                          v-model="commandObj.carSearch"
                          @change="changeCar"
                          placeholder="请选择"
                          filterable
                        >
                          <el-option
                            v-for="(item, index) in carSearchList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                type="flex"
                justif="start"
                style="flex-wrap: wrap;margin-top:30px"
              >
                <el-col :span="24">
                  <el-form-item label="前空调温度：" size="mini">
                    <!-- <el-input
                      class="controlsInput"
                      v-model="controlsValue"
                      v-show="!showInput"
                      @change="enterValue"
                    >
                    </el-input> -->
                     <!-- <el-slider
                      :class="!showInput ? 'sliderInput block' : 'block'"
                      :disabled="commandDisabled"
                      @change="changeSlider($event, 1)"
                      v-model="commandObj.frontAirConditioning"
                      :show-input-controls="false"
                      :show-input="showInput"
                      :step="0.5"
                      :min="17.5"
                      :max="32.5"
                      :marks="marks"
                      :format-tooltip="formatTooltip"
                    >
                    </el-slider> -->
                    <el-input
                      class="controlsInput"
                      v-model="controlsValue"
                      @change="enterValue"
                      :disabled="commandDisabled"
                    >
                    </el-input>
                    <el-slider
                      class="sliderInput block"
                      :disabled="commandDisabled"
                      @change="changeSlider($event, 1)"
                      v-model="commandObj.frontAirConditioning"
                      :show-input="false"
                      :step="0.5"
                      :min="17.5"
                      :max="32.5"
                      :marks="marks"
                      :format-tooltip="formatTooltip"
                    >
                    </el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="后空调温度：" size="mini">
                    <!-- <el-input
                      class="controlsInput"
                      v-model="controlsValue2"
                      v-show="!showInput2"
                      @change="enterValue2"
                    >
                    </el-input>
                    <el-slider
                      :class="!showInput2 ? 'sliderInput block' : 'block'"
                      :disabled="commandDisabled"
                      v-model="commandObj.rearAirConditioning"
                      @change="changeSlider($event, 2)"
                      :show-input-controls="false"
                      :show-input="showInput2"
                      :step="0.5"
                      :min="17.5"
                      :max="32.5"
                      :marks="marks"
                      :format-tooltip="formatTooltip"
                    >
                    </el-slider> -->
                    <el-input
                      class="controlsInput"
                      v-model="controlsValue2"
                      :disabled="commandDisabled"
                      @change="enterValue2"
                    >
                    </el-input>
                    <el-slider
                      class="sliderInput block"
                      :disabled="commandDisabled"
                      v-model="commandObj.rearAirConditioning"
                      @change="changeSlider($event, 2)"
                      :show-input="false"
                      :step="0.5"
                      :min="17.5"
                      :max="32.5"
                      :marks="marks"
                      :format-tooltip="formatTooltip"
                    >
                    </el-slider>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2.5">
              <el-slider
                class="verticalBlock"
                :disabled="commandDisabled"
                v-model="commandObj.leftFrontWindow"
                @change="windowChange($event, 1)"
                :show-input-controls="false"
                show-input
                vertical
                height="180px"
              >
              </el-slider>
              左前车窗开度
            </el-col>
            <el-col :span="2.5">
              <el-slider
                class="verticalBlock"
                :disabled="commandDisabled"
                v-model="commandObj.leftRearWindow"
                @change="windowChange($event, 3)"
                :show-input-controls="false"
                show-input
                vertical
                height="180px"
              >
              </el-slider>
              左后车窗开度
            </el-col>
            <el-col :span="2.5">
              <el-slider
                class="verticalBlock"
                :disabled="commandDisabled"
                v-model="commandObj.rightFrontWindow"
                @change="windowChange($event, 2)"
                :show-input-controls="false"
                show-input
                vertical
                height="180px"
              >
              </el-slider>
              右前车窗开度
            </el-col>
            <el-col :span="2.5">
              <el-slider
                class="verticalBlock"
                :disabled="commandDisabled"
                v-model="commandObj.rightRearWindow"
                @change="windowChange($event, 4)"
                :show-input-controls="false"
                show-input
                vertical
                height="180px"
              >
              </el-slider>
              右后车窗开度
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div
        style="margin-top:20px;padding:20px 20px 10px 15px;"
        class="section-content vehicleControlBottom"
        v-loading="loading1"
      >
        <el-radio-group
          class="vehicleControlRadio"
          v-model="tabClass"
          style="margin-bottom: 10px;"
        >
          <el-radio-button label="one">
            <i
              class="iconfont icon-jichuxinxi"
              style="margin-right:5px;"
            />基础信息</el-radio-button
          >
          <el-radio-button label="two">
            <i
              class="iconfont icon-cheliangxinxi"
              style="margin-right:5px;"
            />车辆信息</el-radio-button
          >
          <el-radio-button label="three">
            <i
              class="iconfont icon-dianchixinxi"
              style="margin-right:5px;"
            />电池信息</el-radio-button
          >
          <el-radio-button label="four">
            <i
              class="iconfont icon-taiyaxinxi"
              style="margin-right:5px;"
            />胎压信息</el-radio-button
          >
        </el-radio-group>
        <div v-show="tabClass == 'one'">
          <!-- <el-scrollbar wrap-class="default-scrollbar__wrap"> -->
          <el-form :label-position="'right'" label-width="120px">
            <el-row
              :gutter="10"
              type="flex"
              justify="start"
              align="middle"
              style="flex-wrap: wrap"
            >
              <el-col :span="12">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="车辆在线状态：">
                      {{ basicInfo.onlineStatus | switchText("onlineStatus") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="前车厢车内温度：">
                      {{ basicInfo.frontCarriageTemperature | processData }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="数据更新时间：">
                      {{ basicInfo.travelTime | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="后车厢车内温度：">
                      {{ basicInfo.behindCarriageTemperature | processData }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="剩余续航里程：">
                      {{ basicInfo.enduranceMileage | processData }}km
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="解闭锁状态：">
                      {{
                        basicInfo.unlockedState | switchText("unlockedState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="剩余电量：">
                      {{ basicInfo.dumpEnergy | processData }}%
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="机盖开闭状态：">
                      {{
                        basicInfo.coverSwitchState
                          | switchText("coverSwitchState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电池热管理状态：">
                      {{
                        basicInfo.thermalManagementState
                          | switchText("thermalManagementState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="车身防盗状态：">
                      {{
                        basicInfo.preventionOfBurglaryState
                          | switchText("preventionOfBurglaryState")
                      }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
          <!-- </el-scrollbar> -->
        </div>
        <div v-show="tabClass == 'two'">
          <el-form :label-position="'right'" label-width="120px">
            <el-row
              :gutter="10"
              type="flex"
              justify="start"
              align="middle"
              style="flex-wrap: wrap"
            >
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">车门信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="尾门状态：">
                      {{
                        carInfo.sternDoorState | switchText("sternDoorState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="左前门状态：">
                      {{
                        carInfo.leftFrontDoorState
                          | switchText("leftFrontDoorState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="右前门状态：">
                      {{
                        carInfo.rightFrontDoorState
                          | switchText("leftFrontDoorState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="左后门状态：">
                      {{
                        carInfo.rearLeftDoorState
                          | switchText("leftFrontDoorState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="右后滑门状态：">
                      {{
                        carInfo.rearRightDoorState
                          | switchText("rearRightDoorState")
                      }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">车窗信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="左前窗车窗开度：" label-width="135px">
                      {{ carInfo.leftFrontWindow | processData }}%
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="右前窗车窗开度：" label-width="135px">
                      {{ carInfo.rightFrontWindow | processData }}%
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="左后窗车窗开度：" label-width="135px">
                      {{ carInfo.leftRearWindow | processData }}%
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="右后窗车窗开度：" label-width="135px">
                      {{ carInfo.rightRearWindow | processData }}%
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">空调信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="通风消杀状态：">
                      {{
                        carInfo.mechanicalVentilationState
                          | switchText("mechanicalVentilationState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="前除霜状态：">
                      {{ carInfo.defrostState | switchText("defrostState") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="前空调状态：">
                      {{
                        carInfo.frontAirConditioningState
                          | switchText("airConditioningState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="前温度设定值：">
                      {{
                        carInfo.frontAirConditioningStateTemperature
                          | processData
                      }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="后除霜状态：">
                      {{ carInfo.defrostState | switchText("defrostState") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="后空调状态：">
                      {{
                        carInfo.rearAirConditioningState
                          | switchText("airConditioningState")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="后温度设定值：">
                      {{
                        carInfo.rearAirConditioningTemperature | processData
                      }}℃
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">座椅信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="左后座椅加热等级："
                      label-width="150px"
                    >
                      {{ carInfo.leftRearSeat | switchText("leftRearSeat") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="右后座椅加热等级："
                      label-width="150px"
                    >
                      {{ carInfo.rightRearSeat | switchText("leftRearSeat") }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-show="tabClass == 'three'">
          <el-form :label-position="'right'" label-width="120px">
            <el-row
              :gutter="10"
              type="flex"
              justify="start"
              align="middle"
              style="flex-wrap: wrap"
            >
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">电池信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="模组平均温度：">
                      {{ batteryInfo.averageBatteryTemperature | processData }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="模组最高温度：">
                      {{ batteryInfo.maximumBatteryTemperature | processData }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="模组最高温度编号：">
                      {{ batteryInfo.maximumTemperatureNumber | processData }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="模组最低温度：">
                      {{ batteryInfo.minimumBatteryTemperature | processData }}℃
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="模组最低温度编号：">
                      {{ batteryInfo.minimumTemperatureNumber | processData }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="24">
                    <div class="boldText">充电信息</div>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="充电状态：">
                      {{
                        batteryInfo.stateOfCharge | switchText("stateOfCharge")
                      }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="距离充满电剩余时间：">
                      {{ batteryInfo.chargeRemainingTime | switchText("time") }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="电池包电流：">
                      {{
                        batteryInfo.batteryPackCurrent
                          ? batteryInfo.batteryPackCurrent * 1000
                          : "-"
                      }}mA
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="充电枪连接状态：">
                      {{
                        batteryInfo.chargingGunConnectionStatus
                          | switchText("chargingGunConnectionStatus")
                      }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-show="tabClass == 'four'">
          <!-- <div style="width:50%"> -->
          <el-table
            ref="table"
            v-loading="listLoading"
            size="mini"
            :data="list"
            :header-row-style="headerRowStyle"
            :row-style="rowStyle"
            :header-cell-style="headerCellStyle"
            fit
            highlight-current-row
            style="width: 100%;margin:10px 0 20px 0;"
          >
            <el-table-column
              v-for="(item, index) in filterTableList"
              :key="index"
              :label="item.value"
              :prop="item.prop"
              :align="item.position ? item.position : 'center'"
              :width="item.width"
              :sortable="item.sortable"
              :show-overflow-tooltip="true"
              class-name="custom-column"
            >
              <!-- 表格内容插槽 -->
              <template slot-scope="scope">
                <span>
                  {{ scope.row[item.prop] | processData }}
                </span>
              </template>
            </el-table-column>
            <!-- 自定义暂无数据 -->
            <template slot="empty">
              <img
                :src="require(`@/assets/images/img_zanwushuju.png`)"
                alt=""
                style="margin-bottom: 20px;"
              />
              <div style="display: inline-block; margin-left: -105px;">
                暂无数据
              </div>
            </template>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { otherHeight } from "@/mixins/getOtherHeight";
import { partialForm } from "@/mixins/partialForm";

import { processData } from "@/filters";
import AES from "@/utils/AES.js";
import { isJSON } from "@/utils/base.js";
import { getNowTime } from "@/utils/common";
// 组件

import {
  carWindowControl,
  carDoorControl,
  airOpenControl,
  airTempControl,
  seatHeaterControl,
  carSearchControl,
  carStatusSearch,
  queryAnswerCommand,
  queryCarStatus,
  queryRealData,
} from "@/api/carControlSys/vehicleControl";

// 辅助函数
export default {
  doNotInit: true,
  name: "vehicleControl",
  mixins: [pagingMixin, tableStyle, otherHeight, partialForm],
  filters: {
    switchText(val, type) {
      if (type == "onlineStatus") {
        return val == 1 ? "在线" : val == 2 ? "离线" : "-";
      } else if (type == "thermalManagementState") {
        return val == 1
          ? "加热状态"
          : val == 2
          ? "制冷状态"
          : val == 4
          ? "无需求"
          : val == 255
          ? "异无效常"
          : "-";
      } else if (type == "unlockedState") {
        return val == 1 ? "未上锁" : val == 2 ? "上锁" : "-";
      } else if (type == "coverSwitchState") {
        return val == 1
          ? "开启"
          : val == 2
          ? "关闭"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "preventionOfBurglaryState") {
        return val == 1
          ? "设防状态"
          : val == 2
          ? "解防状态"
          : val == 3
          ? "报警状态"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "sternDoorState") {
        return val == 1
          ? "完全打开"
          : val == 2
          ? "完全关闭"
          : val == 3
          ? "正在打开"
          : val == 4
          ? "正在关闭"
          : val == 5
          ? "悬停"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "leftFrontDoorState") {
        return val == 1
          ? "关闭"
          : val == 2
          ? "微开"
          : val == 3
          ? "打开"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "rearRightDoorState") {
        return val == 1
          ? "全关"
          : val == 2
          ? "打开中"
          : val == 3
          ? "打开中，正在缓慢停止"
          : val == 4
          ? "打开过程中停止，未到全开位置"
          : val == 5
          ? "全开"
          : val == 6
          ? "关闭中"
          : val == 7
          ? "关闭中，正在缓慢停止"
          : val == 8
          ? "关闭中停止，未到全关位置"
          : val == 9
          ? "处于半锁位置"
          : val == 10
          ? "停止在最小可电动关门位置"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "leftRearSeat") {
        return val == 1
          ? "高档"
          : val == 2
          ? "中档"
          : val == 3
          ? "低档"
          : val == 4
          ? "关闭"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "mechanicalVentilationState") {
        return val == 1
          ? "默认"
          : val == 2
          ? "正在通风"
          : val == 3
          ? "正在消杀"
          : val == 4
          ? "已完成"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "defrostState") {
        return val == 1
          ? "关闭"
          : val == 2
          ? "开启"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "airConditioningState") {
        return val == 1
          ? "关闭"
          : val == 2
          ? "开启"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "stateOfCharge") {
        return val == 1
          ? "未充电"
          : val == 2
          ? "正在充电"
          : val == 3
          ? "充电完成"
          : val == 4
          ? "禁止充电"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "chargingGunConnectionStatus") {
        return val == 1
          ? "未连接"
          : val == 2
          ? "已连接"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "time") {
        // 后端给的Min
        if (val) {
          let value = val * 60;
          var time = parseInt(value * 60) + "s";
          if (parseInt(value) < 0) {
            time = "-";
          }
          if (parseInt(value) > 60) {
            var second = parseInt(value) % 60;
            var min = parseInt(value / 60);
            time = min + "min" + second + "s";

            if (min > 60) {
              min = parseInt(value / 60) % 60;
              var hour = parseInt(parseInt(value / 60) / 60);
              time = hour + "" + min + "min" + second + "s";
            }
          }
          return time;
        } else {
          return "-";
        }
      } else {
        return val || (val == 0 ? val : "-");
      }
    },
  },
  data() {
    const validateVin = (rule, value, cb) => {
      if (!this.listQuery.vinNo) {
        return cb(new Error("请输入VIN码"));
      }
      if (!this.listQuery.vinNoTotal && this.listQuery.vinNo.length != 17) {
        return cb(new Error("请输入正确的VIN码"));
      }
    };
    return {
      listQuery: {
        vinNo: "",
      },
      loading: false,
      loading1: false,
      listObj: {},
      carInfo: {},
      basicInfo: {}, //1
      batteryInfo: {},
      // tirePressureInfo:{},
      carInfo: {},
      commandObj: {
        rearAirConditioning:0,
        frontAirConditioning:0,
        rightRearWindow:0,
        rightFrontWindow:0,
        leftRearWindow:0,
        leftFrontWindow:0,
        carSearch:null,
        leftRearSeat:null,
        rightRearSeat:null,
        frontAirStatus:false,
        rearAirStatus:false,
        unblockingStatus:false
      },
      // isSuccess: false,
      commandDisabled: true,
      listLoading: false,
      tabClass: "one",
      controlsValue: "",
      controlsValue2: "",
      // showInput: true,
      // showInput2: true,
      seatList: [
        { label: "高档", value: 1 },
        { label: "中档", value: 2 },
        { label: "低档", value: 3 },
        { label: "关闭", value: 4 },
      ],
      carSearchList: [
        { label: "闪灯", value: 2 },
        { label: "鸣笛", value: 1 },
        { label: "闪灯+鸣笛", value: 3 },
      ],
      marks: {
        17.5: "low",
        18: "18",
        32: "32",
        32.5: "high",
      },
      tableList: [
        {
          value: "",
          prop: "primaryKey",
          width: 140,
          checked: true,
        },
        {
          value: "左前轮",
          prop: "leftFront",
          width: 120,
          checked: true,
        },
        {
          value: "右前轮",
          prop: "rightFront",
          width: 120,
          checked: true,
        },
        {
          value: "左后轮",
          prop: "leftRear",
          width: 120,
          checked: true,
        },
        {
          value: "右后轮",
          prop: "rightRear",
          width: 120,
          checked: true,
        },
      ],
      list: [
        {
          primaryKey: "胎压值",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "胎温值",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "轮胎压力状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "漏气状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "温度状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
      ],
      rules: {
        vinNo: [{ required: true, trigger: "change", validator: validateVin }],
      },
    };
  },
  watch: {
    'commandObj.frontAirConditioning':{
      handler(val) {
        console.log(val,"前")
        if(val<18 || val == "low"){
          this.controlsValue ="low"
          this.$set(
            this.commandObj,
            "frontAirConditioning",
            17.5
          );
        }else if(val>32 || val == "high"){
          this.controlsValue ="high"
          this.$set(
            this.commandObj,
            "frontAirConditioning",
            32.5
          );
        }else{
          this.controlsValue = val;
        }
			},
      immediate:true,
      deep:true,
    },   
    'commandObj.rearAirConditioning':{
      handler(val) {
        console.log(val,"后")
        if(val<18 || val == "low"){
          this.controlsValue2 ="low"
          this.$set(
            this.commandObj,
            "rearAirConditioning",
            17.5
          );
        }else if(val>32 || val == "high"){
          this.controlsValue2 ="high"
          this.$set(
            this.commandObj,
            "rearAirConditioning",
            32.5
          );
        }else{
          this.controlsValue2 = val;
        }
			},
      immediate:true,
      deep:true,
    }   
  },
  mounted() {
  },
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
    getToken(vinNo,time){
      let vinNoStr = vinNo.substr(vinNo.length - 8)
      let timeStr =  time.format("yyMMddhhmmss")
      let sStr = AES.randomNumber()
      let s = vinNoStr + timeStr + sStr
      return s;
    },
    // 密钥需要的三个值
    getEncryptionParameters() {
      let encryptionParameters = {
        accessKey: "525400",
        time: new Date().getTime(),
        nonce: AES.generateMixed(4),
      };
      return encryptionParameters;
    },
    valueConversion(val, type) {
      if (type == "tirePressureStatus") {
        return val == 1
          ? "胎压正常"
          : val == 2
          ? "胎压过高"
          : val == 2
          ? "胎压过低"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "tire") {
        return val == 1
          ? "不漏气"
          : val == 2
          ? "快速漏气"
          : val == 2
          ? "缓慢漏气"
          : val == 255
          ? "无效"
          : "-";
      } else if (type == "tireTemperatureStatus") {
        return val == 1 ? "正常" : val == 2 ? "高" : val == 255 ? "无效" : "-";
      }
    },
    // 查询数据库
    handleDatabase() {
      this.commandDisabled = true;
      const check = this.checkForm({
        formName: "formSearch",
        formList: ["vinNo"],
      });
      if (!check) {
        return;
      }

      let dataBase = {
        vinNo:this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo,
      };
      // console.log(this.listQuery.vinNoTotal,123,dataBase)
      let aesKey = this.getEncryptionParameters();

      this.loading = true;
      this.loading1 = true;
      queryRealData({ dataBase, aesKey })
        .then(({ data }) => {
          let decryptObj = data
            ? AES.decrypt(
                data,
                AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
              )
            : {};
          let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
          console.log("查询数据库", dataObj);
          if (dataObj.code == 0) {
            this.listObj = dataObj.data ? dataObj.data : {};
            this.basicInfo = this.listObj.basicInfo
              ? this.listObj.basicInfo
              : {};
            // console.log(this.listObj,333,this.basicInfo)
            this.carInfo = this.listObj.carInfo ? this.listObj.carInfo : {};
            this.batteryInfo = this.listObj.batteryInfo
              ? this.listObj.batteryInfo
              : {};

            // 前空调状态
            this.commandObj.frontAirStatus =
              this.carInfo.frontAirConditioningState &&
              this.carInfo.frontAirConditioningState == 2
                ? true
                : false;
            // 后空调状态
            this.commandObj.rearAirStatus =
              this.carInfo.rearAirConditioningState &&
              this.carInfo.rearAirConditioningState == 2
                ? true
                : false;
            // 解闭锁状态
            this.commandObj.unblockingStatus =
              this.basicInfo.unlockedState &&
              this.carInfo.rearAirConditioningState == 1
                ? true
                : false;
            // 左后座椅加热档位
            this.commandObj.leftRearSeat = this.carInfo.leftRearSeat
              ? this.carInfo.leftRearSeat
              : null;
            // 右后座椅加热档位
            this.commandObj.rightRearSeat = this.carInfo.rightRearSeat
              ? this.carInfo.rightRearSeat
              : null;
            // 前空调温度
            this.commandObj.frontAirConditioning = this.carInfo
              .frontAirConditioningStateTemperature
              ? this.carInfo.frontAirConditioningStateTemperature
              : 0;
            // 后空调温度
            this.commandObj.rearAirConditioning = this.carInfo
              .rearAirConditioningTemperature
              ? this.carInfo.rearAirConditioningTemperature
              : 0;
            // 左前车窗开度
            this.commandObj.leftFrontWindow = this.carInfo.leftFrontWindow
              ? this.carInfo.leftFrontWindow
              : 0;
            // 左后车窗开度
            this.commandObj.leftRearWindow = this.carInfo.leftRearWindow
              ? this.carInfo.leftRearWindow
              : 0;
            // 右前车窗开度
            this.commandObj.rightFrontWindow = this.carInfo.rightFrontWindow
              ? this.carInfo.rightFrontWindow
              : 0;
            // 右后车窗开度
            this.commandObj.rightRearWindow = this.carInfo.rightRearWindow
              ? this.carInfo.rightRearWindow
              : 0;
            let tirePressureInfo = this.listObj.tirePressureInfo
              ? this.listObj.tirePressureInfo
              : {};
            this.list = [
              {
                primaryKey: "胎压值",
                leftFront:
                  processData(tirePressureInfo.leftFrontTirePressure) + "bar",
                rightFront:
                  processData(tirePressureInfo.rightFrontTirePressure) + "bar",
                leftRear:
                  processData(tirePressureInfo.leftRearTirePressure) + "bar",
                rightRear:
                  processData(tirePressureInfo.rightRearTirePressure) + "bar",
              },
              {
                primaryKey: "胎温值",
                leftFront:
                  processData(tirePressureInfo.leftFrontTireTemperature) + "℃",
                rightFront:
                  processData(tirePressureInfo.rightFrontTireTemperature) + "℃",
                leftRear:
                  processData(tirePressureInfo.leftRearTireTemperature) + "℃",
                rightRear:
                  processData(tirePressureInfo.rightRearTireTemperature) + "℃",
              },
              {
                primaryKey: "轮胎压力状态",
                leftFront: this.valueConversion(
                  tirePressureInfo.leftFrontTirePressureStatus,
                  "tirePressureStatus"
                ),
                rightFront: this.valueConversion(
                  tirePressureInfo.rightFrontTirePressureStatus,
                  "tirePressureStatus"
                ),
                leftRear: this.valueConversion(
                  tirePressureInfo.leftRearTirePressureStatus,
                  "tirePressureStatus"
                ),
                rightRear: this.valueConversion(
                  tirePressureInfo.rightRearTirePressureStatus,
                  "tirePressureStatus"
                ),
              },
              {
                primaryKey: "漏气状态",
                leftFront: this.valueConversion(
                  tirePressureInfo.flatLeftFrontTire,
                  "tire"
                ),
                rightFront: this.valueConversion(
                  tirePressureInfo.flatRightFrontTire,
                  "tire"
                ),
                leftRear: this.valueConversion(
                  tirePressureInfo.flatLeftRearTire,
                  "tire"
                ),
                rightRear: this.valueConversion(
                  tirePressureInfo.flatRightRearTire,
                  "tire"
                ),
              },
              {
                primaryKey: "温度状态",
                leftFront: this.valueConversion(
                  tirePressureInfo.leftFrontTireTemperatureStatus,
                  "tireTemperatureStatus"
                ),
                rightFront: this.valueConversion(
                  tirePressureInfo.rightFrontTireTemperatureStatus,
                  "tireTemperatureStatus"
                ),
                leftRear: this.valueConversion(
                  tirePressureInfo.leftRearTireTemperatureStatus,
                  "tireTemperatureStatus"
                ),
                rightRear: this.valueConversion(
                  tirePressureInfo.rightRearTireTemperatureStatus,
                  "tireTemperatureStatus"
                ),
              },
            ];
            this.commandDisabled = false;
            this.$message.success({
              message: "查询成功！",
              duration: 2 * 1000,
            });
          } else {
            this.resetData();
            this.$message.warning({
              message: dataObj.message ? dataObj.message : "查询失败！",
              duration: 2 * 1000,
              offset: 30,
            });
          }
        })
        .catch(() => {
          this.resetData();
        })
        .finally(() => {
          this.loading = false;
          this.loading1 = false;
        });
    },
    // 查询TBOX
    handleTBOX() {
      this.commandDisabled = true;
      const check = this.checkForm({
        formName: "formSearch",
        formList: ["vinNo"],
      });
      if (!check) {
        return;
      }

      let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
      let dataBase = {
        vinNo,
        sendTime:getNowTime(),
        businessToken:this.getToken(vinNo,new Date()),
        // businessToken:'639846722003191800413977',
        businessType:1,
        // businessParam:["S1","S2"]
      };
      // console.log(this.listQuery.vinNoTotal,1234,dataBase)
      let aesKey = this.getEncryptionParameters();

      this.loading = true;
      this.loading1 = true;
      console.log(dataBase,444)
      carStatusSearch({ dataBase, aesKey })
        .then(({ data }) => {
          let decryptObj = data
            ? AES.decrypt(
                data,
                AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
              )
            : {};
          let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
          console.log("查询TBOX",dataObj)
          if (dataObj.code == 0) {
            this.commandResponse(dataBase.businessToken).then((data1) => {
              // console.log(this.isSuccess, 11111);
              console.log("查询结果1",data1)
              // data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus
              if(data1&&data1.answerStatus){
                // 前空调状态
                console.log("成功！",data1)
                this.commandDisabled = false;
                // this.listObj = dataObj.data && dataObj.data.answerStatus ? dataObj.data.answerStatus : {};
                this.listObj = data1.answerStatus;
                // 基础信息
                  // 车辆在线状态
                  this.basicInfo.onlineStatus = data1.onlineStatus?data1.onlineStatus:"-";
                  // 前车厢车内温度
                  this.basicInfo.frontCarriageTemperature = this.listObj.S12?this.listObj.S12:'-';
                  // 数据更新时间
                  this.basicInfo.travelTime = data1.time?data1.time:'-';
                  // 后车厢车内温度
                  this.basicInfo.behindCarriageTemperature = this.listObj.S13?this.listObj.S13:'-';
                  // 剩余续航里程
                  this.basicInfo.enduranceMileage = this.listObj.S1?this.listObj.S1:'-';
                  // 解闭锁状态
                  this.basicInfo.unlockedState = this.listObj.S14?this.listObj.S14:'-';
                  // 剩余电量
                  this.basicInfo.dumpEnergy = this.listObj.S2?this.listObj.S2:'-';
                  // 机盖开闭状态
                  this.basicInfo.coverSwitchState = this.listObj.S56?this.listObj.S56:'-';
                  // 电池热管理状态
                  this.basicInfo.thermalManagementState = this.listObj.S55?this.listObj.S55:'-';
                  // 车身防盗状态
                  this.basicInfo.preventionOfBurglaryState = this.listObj.S57?this.listObj.S57:'-';
                // 车辆信息-车门信息
                  // 尾门状态
                  this.carInfo.sternDoorState = this.listObj.S15?this.listObj.S15:'-';
                  // 左前门状态
                  this.carInfo.leftFrontDoorState = this.listObj.S16?this.listObj.S16:'-';
                  // 右前门状态
                  this.carInfo.rightFrontDoorState = this.listObj.S17?this.listObj.S17:'-';
                  // 左后门状态
                  this.carInfo.rearLeftDoorState = this.listObj.S18?this.listObj.S18:'-';
                  // 右后滑门状态
                  this.carInfo.rearRightDoorState = this.listObj.S19?this.listObj.S19:'-';
                // 车辆信息-车窗信息
                  // 左前窗车窗开度
                  this.carInfo.leftFrontWindow = this.listObj.S20?this.listObj.S20:'-';
                  // 右前窗车窗开度
                  this.carInfo.rightFrontWindow = this.listObj.S21?this.listObj.S21:'-';
                  // 左后窗车窗开度
                  this.carInfo.leftRearWindow = this.listObj.S22?this.listObj.S22:'-';
                  // 右后窗车窗开度
                  this.carInfo.rightRearWindow = this.listObj.S23?this.listObj.S23:'-';
                // 车辆信息-空调信息
                  // 通风消杀状态
                  this.carInfo.mechanicalVentilationState = this.listObj.S49?this.listObj.S49:'-';
                  // 前除霜状态
                  this.carInfo.defrostState = this.listObj.S11?this.listObj.S11:'-';
                  // 前空调状态
                  this.carInfo.frontAirConditioningState = this.listObj.S7?this.listObj.S7:'-';
                  // 前温度设定值
                  this.carInfo.frontAirConditioningStateTemperature = this.listObj.S9?this.listObj.S9:'-';
                  // 后除霜状态
                  this.carInfo.defrostState = this.listObj.S11?this.listObj.S11:'-';
                  // 后空调状态
                  this.carInfo.rearAirConditioningState = this.listObj.S8?this.listObj.S8:'-';
                  // 后温度设定值
                  this.carInfo.rearAirConditioningTemperature = this.listObj.S10?this.listObj.S10:'-';
                // 车辆信息-座椅信息
                  // 左后座椅加热等级
                  this.carInfo.leftRearSeat = this.listObj.S26?this.listObj.S26:'-';
                  // 右后座椅加热等级
                  this.carInfo.rightRearSeat = this.listObj.S27?this.listObj.S27:'-';
                // 电池信息-电池信息
                  // 模组平均温度
                  this.batteryInfo.averageBatteryTemperature = this.listObj.S50?this.listObj.S50:'-';
                  // 模组最高温度
                  this.batteryInfo.maximumBatteryTemperature = this.listObj.S51?this.listObj.S51:'-';
                  // 模组最高温度编号
                  this.batteryInfo.maximumTemperatureNumber = this.listObj.S54?this.listObj.S54:'-';
                  // 模组最低温度
                  this.batteryInfo.minimumBatteryTemperature = this.listObj.S52?this.listObj.S52:'-';
                  // 模组最低温度编号
                  this.batteryInfo.minimumTemperatureNumber = this.listObj.S53?this.listObj.S53:'-';
                // 电池信息-充电信息
                  // 充电状态
                  this.batteryInfo.stateOfCharge = this.listObj.S3?this.listObj.S3:'-';
                  // 距离充满电剩余时间
                  this.batteryInfo.chargeRemainingTime = this.listObj.S5?this.listObj.S5:'-';
                  // 电池包电流
                  this.batteryInfo.batteryPackCurrent = this.listObj.S6?this.listObj.S6:'-';
                  // 充电枪连接状态
                  this.batteryInfo.chargingGunConnectionStatus = this.listObj.S4?this.listObj.S4:'-';
                // 胎压信息
                  this.list = [
                    {
                      primaryKey: "胎压值",
                      leftFront:
                        processData(this.listObj.S28) + "bar",
                      rightFront:
                        processData(this.listObj.S29) + "bar",
                      leftRear:
                        processData(this.listObj.S30) + "bar",
                      rightRear:
                        processData(this.listObj.S31) + "bar",
                    },
                    {
                      primaryKey: "胎温值",
                      leftFront:
                        processData(this.listObj.S32) + "℃",
                      rightFront:
                        processData(this.listObj.S33) + "℃",
                      leftRear:
                        processData(this.listObj.S34) + "℃",
                      rightRear:
                        processData(this.listObj.S35) + "℃",
                    },
                    {
                      primaryKey: "轮胎压力状态",
                      leftFront: this.valueConversion(
                        this.listObj.S36,
                        "tirePressureStatus"
                      ),
                      rightFront: this.valueConversion(
                        this.listObj.S37,
                        "tirePressureStatus"
                      ),
                      leftRear: this.valueConversion(
                        this.listObj.S38,
                        "tirePressureStatus"
                      ),
                      rightRear: this.valueConversion(
                        this.listObj.S39,
                        "tirePressureStatus"
                      ),
                    },
                    {
                      primaryKey: "漏气状态",
                      leftFront: this.valueConversion(
                        this.listObj.S40,
                        "tire"
                      ),
                      rightFront: this.valueConversion(
                        this.listObj.S41,
                        "tire"
                      ),
                      leftRear: this.valueConversion(
                        this.listObj.S42,
                        "tire"
                      ),
                      rightRear: this.valueConversion(
                        this.listObj.S43,
                        "tire"
                      ),
                    },
                    {
                      primaryKey: "温度状态",
                      leftFront: this.valueConversion(
                        this.listObj.S44,
                        "tireTemperatureStatus"
                      ),
                      rightFront: this.valueConversion(
                        this.listObj.S45,
                        "tireTemperatureStatus"
                      ),
                      leftRear: this.valueConversion(
                        this.listObj.S46,
                        "tireTemperatureStatus"
                      ),
                      rightRear: this.valueConversion(
                        this.listObj.S47,
                        "tireTemperatureStatus"
                      ),
                    },
                  ];

                // 命令
                  // 前空调状态
                  this.commandObj.frontAirStatus =
                    this.listObj.S7 && this.listObj.S7 == 2
                      ? true
                      : false;
                  // 后空调状态
                  this.commandObj.rearAirStatus =
                    this.listObj.S8 &&
                    this.listObj.S8 == 2
                      ? true
                      : false;
                  // 解闭锁状态
                  this.commandObj.unblockingStatus =
                    this.listObj.S14 &&
                    this.listObj.S14 == 1
                      ? true
                      : false;
                  // 左后座椅加热档位
                  this.commandObj.leftRearSeat = this.listObj.S26
                    ? this.listObj.S26*1
                    : null;
                  // 右后座椅加热档位
                  this.commandObj.rightRearSeat = this.listObj.S27
                    ? this.listObj.S27*1
                    : null;
                  // 前空调温度       
                  this.commandObj.frontAirConditioning = this.listObj.S9
                    ? this.listObj.S9*1
                    : 0;
                  // 后空调温度
                  this.commandObj.rearAirConditioning = this.listObj.S10
                    ? this.listObj.S10*1
                    : 0;
                  // 左前车窗开度
                  this.commandObj.leftFrontWindow = this.listObj.S20
                    ? this.listObj.S20*1
                    : 0;
                  // 左后车窗开度
                  this.commandObj.leftRearWindow = this.listObj.S22
                    ? this.listObj.S22*1
                    : 0;
                  // 右前车窗开度
                  this.commandObj.rightFrontWindow = this.listObj.S21
                    ? this.listObj.S21*1
                    : 0;
                  // 右后车窗开度
                  this.commandObj.rightRearWindow = this.listObj.S23
                    ? this.listObj.S23*1
                    : 0;
                this.$message.success({
                  message: "命令应答成功！",
                  duration: 2 * 1000,
                });
              }else{
                this.resetData();
                console.log("失败！")
                this.$message.warning({
                  message: "命令应答失败！",
                  duration: 2 * 1000,
                  offset: 30,
                });
              }
            });
          }else {
            this.resetData();
            this.loading = false;
            this.loading1 = false;
            this.$message.warning({
              message: dataObj.message ? dataObj.message : "查询失败！",
              duration: 2 * 1000,
              offset: 30,
            });
          }
         
        })
        .catch(() => {
          this.resetData();
          this.loading = false;
          this.loading1 = false;
        });
    },
    //命令下发失败，恢复原值
    changeStatusFail(type, typeFail, oldValue) {
      // if (this.isSuccess == false) {
        if (typeFail == "air") {
          //空调
          if (type == 1) {
            this.commandObj.frontAirStatus = !this.commandObj.frontAirStatus;
            this.$forceUpdate();
          } else {
            this.commandObj.rearAirStatus = !this.commandObj.rearAirStatus;
            this.$forceUpdate();
          }
        } else if (typeFail == "unblocking") {
          //解闭锁
          this.commandObj.unblockingStatus = !this.commandObj.unblockingStatus;
          this.$forceUpdate();
        } else if (typeFail == "seat") {
          //座椅
          if (type == 3) {
            this.commandObj.leftRearSeat = oldValue;
            this.$forceUpdate();
          } else {
            this.commandObj.rightRearSeat = oldValue;
            this.$forceUpdate();
          }
        } else if (typeFail == "car") {
          //寻车
          this.commandObj.carSearch = oldValue;
          this.$forceUpdate();
        } else if (typeFail == "slider") {
          //空调温度
          if (type == 1) {
            this.commandObj.frontAirConditioning = oldValue;
            this.controlsValue = oldValue;
            this.$forceUpdate();
          } else {
            this.commandObj.rearAirConditioning = oldValue;
            this.controlsValue2 = oldValue;
            this.$forceUpdate();
          }
        } else if (typeFail == "window") {
          console.log(type,typeFail,oldValue,22)
          //开窗
          if (type == 1) {
            this.commandObj.leftFrontWindow = oldValue;
            this.$forceUpdate();
          } else if (type == 2) {
            this.commandObj.rightFrontWindow = oldValue;
            this.$forceUpdate();
          } else if (type == 3) {
            this.commandObj.leftRearWindow = oldValue;
            this.$forceUpdate();
          } else {
            this.commandObj.rightRearWindow = oldValue;
            this.$forceUpdate();
          }
        }
      // }
    },
    // 空调开关
    changeAirStatus(e1, type) {
      let oldValue =
        type == 1
          ? this.carInfo.frontAirConditioningState
            ? this.carInfo.frontAirConditioningState
            : null
          : this.carInfo.rearAirConditioningState
          ? this.carInfo.rearAirConditioningState
          : null;
      let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
      let dataBase = {
        vinNo,
        sendTime:getNowTime(),
        businessToken:this.getToken(vinNo,new Date()),
        businessType:1,
        position: type,
        status:
          type == 1
            ? this.commandObj.frontAirStatus == true
              ? 1
              : 2
            : this.commandObj.rearAirStatus == true
            ? 1
            : 2,
      };
      let aesKey = this.getEncryptionParameters();
      console.log(dataBase,"空调开关参数")
      this.loading = true;
      airOpenControl({ dataBase, aesKey })
        .then(({ data }) => {
          let decryptObj = data
            ? AES.decrypt(
                data,
                AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
              )
            : {};
          let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
          // console.log(dataObj, 123321);
          if (dataObj.code == 0) {
            // this.$message.success({
            //   message: "命令下发成功！",
            //   duration: 2 * 1000,
            // });
            // this.isSuccess = false,
            this.commandResponse(dataBase.businessToken).then((data1) => {
              // console.log(this.isSuccess, 11111);
              if(data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus){
                // 前空调状态
                console.log("成功！",data1)
                if(type == 1){
                  this.carInfo.frontAirConditioningState = data1.answerStatus.S7 ?
                    data1.answerStatus.S7
                    : oldValue;
                  this.commandObj.frontAirStatus =
                    data1.answerStatus.S7 && data1.answerStatus.S7 == 2
                      ? true
                      : false;
                }else{
                  // 后空调状态
                  this.carInfo.rearAirConditioningState = data1.answerStatus.S8 ?
                    data1.answerStatus.S8
                    : oldValue;
                  this.commandObj.rearAirStatus =
                    data1.answerStatus.S8 &&
                    data1.answerStatus.S8 == 2
                        ? true
                        : false;
                }
                this.$forceUpdate();
                this.$message.success({
                  message: "命令应答成功！",
                  duration: 2 * 1000,
                });
              }else{
                console.log("失败！")
                this.changeStatusFail(type, "air");
                this.$message.warning({
                  message: "命令应答失败！",
                  duration: 2 * 1000,
                  offset: 30,
                });
              }
            });
          } else {
            this.loading = false;
            this.$message.warning({
              message: dataObj.message ? dataObj.message : "命令下发失败！",
              duration: 2 * 1000,
              offset: 30,
            });
            this.changeStatusFail(type, "air");
          }
        })
        .catch((error) => {
          this.changeStatusFail(type, "air");
          this.loading = false;
        });
      // .finally(() => {
      //   // this.loading = false;
      // });
    },
    // 解闭锁状态
    changeUnblocking(e1) {
      let oldValue =
          this.basicInfo.unlockedState
          ? this.basicInfo.unlockedState
          : null;
      // if (e1) {
      let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
      let dataBase = {
        vinNo,
        sendTime:getNowTime(),
        businessToken:this.getToken(vinNo,new Date()),
        businessType:1,
        status: this.commandObj.unblockingStatus == true ? 2 : 1,
      };
      console.log(dataBase,"解闭锁状态参数")
      let aesKey = this.getEncryptionParameters();
      this.loading = true;
      carDoorControl({ dataBase, aesKey })
        .then(({ data }) => {
          let decryptObj = data
            ? AES.decrypt(
                data,
                AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
              )
            : {};
          let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
          if (dataObj.code == 0) {
            // this.$message.success({
            //   message: "命令下发成功！",
            //   duration: 2 * 1000,
            // });
            // this.isSuccess = false,
            this.commandResponse(dataBase.businessToken).then((data1) => {
              if(data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus){
                // 解闭锁状态
                console.log("成功！",data1)
                this.basicInfo.unlockedState = data1.answerStatus.S14?
                  data1.answerStatus.S14
                  :oldValue;
                this.commandObj.unblockingStatus =
                  data1.answerStatus.S14 &&
                  data1.answerStatus.S14 == 1
                    ? true
                    : false;
                this.$forceUpdate();
                this.$message.success({
                  message: "命令应答成功！",
                  duration: 2 * 1000,
                });
              }else{
                console.log("失败！")
                this.changeStatusFail(1, "unblocking");
                this.$message.warning({
                  message: "命令应答失败！",
                  duration: 2 * 1000,
                  offset: 30,
                });
              }
            });
          } else {
            this.loading = false;
            this.$message.warning({
              message: dataObj.message ? dataObj.message : "命令下发失败！",
              duration: 2 * 1000,
              offset: 30,
            });
            this.changeStatusFail(1, "unblocking");
          }
        })
        .catch((error) => {
          this.changeStatusFail(1, "unblocking");
          this.loading = false;
        });
      // .finally(() => {
      //   this.loading = false;
      // });
      // }
    },
    // 座椅状态
    changeSeat(e1, type) {
      if (e1) {
        let oldValue =
          type == 3
            ? this.carInfo.leftRearSeat&&this.carInfo.leftRearSeat!="-"
              ? this.carInfo.leftRearSeat*1
              : null
            : this.carInfo.rightRearSeat&&this.carInfo.rightRearSeat!="-"
            ? this.carInfo.rightRearSeat*1
            : null;

        let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
        let dataBase = {
          vinNo,
          sendTime:getNowTime(),
          businessToken:this.getToken(vinNo,new Date()),
          businessType:1,
          position: type,
          status:
            type == 3
              ? this.commandObj.leftRearSeat
              : this.commandObj.rightRearSeat,
        };
        console.log(dataBase,"座椅状态参数")
        let aesKey = this.getEncryptionParameters();
        this.loading = true;
        seatHeaterControl({ dataBase, aesKey })
          .then(({ data }) => {
            let decryptObj = data
              ? AES.decrypt(
                  data,
                  AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                )
              : {};
            let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
            if (dataObj.code == 0) {
              // this.$message.success({
              //   message: "命令下发成功！",
              //   duration: 2 * 1000,
              // });
              // this.isSuccess = false,
              this.commandResponse(dataBase.businessToken).then((data1) => {
                if(data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus){
                  // 座椅状态
                  console.log("成功！",data1)
                  if(type == 3){
                    // 左后座椅加热档位
                    this.carInfo.leftRearSeat = data1.answerStatus.S26
                      ? data1.answerStatus.S26*1
                      : oldValue;
                    this.commandObj.leftRearSeat = data1.answerStatus.S26
                      ? data1.answerStatus.S26*1
                      : oldValue;
                  }else{
                    // 右后座椅加热档位
                    this.carInfo.rightRearSeat = data1.answerStatus.S27
                      ? data1.answerStatus.S27*1
                      : oldValue;
                    this.commandObj.rightRearSeat = data1.answerStatus.S27
                      ? data1.answerStatus.S27*1
                      : oldValue;
                  }
                  this.$forceUpdate();
                  this.$message.success({
                    message: "命令应答成功！",
                    duration: 2 * 1000,
                  });
                }else{
                  console.log("失败！")
                  this.changeStatusFail(type, "seat", oldValue);
                  this.$message.warning({
                    message: "命令应答失败！",
                    duration: 2 * 1000,
                    offset: 30,
                  });
                } 
              });
            } else {
              this.loading = false;
              this.$message.warning({
                message: dataObj.message ? dataObj.message : "命令下发失败！",
                duration: 2 * 1000,
                offset: 30,
              });
              this.changeStatusFail(type, "seat", oldValue);
            }
          })
          .catch(() => {
            this.loading = false;
            this.changeStatusFail(type, "seat", oldValue);
          });
      }
    },
    // 一键寻车
    changeCar(e1) {
      let oldValue = null;
      if (e1) {
        let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
        let dataBase = {
          vinNo,
          sendTime:getNowTime(),
          businessToken:this.getToken(vinNo,new Date()),
          businessType:1,
          status: this.commandObj.carSearch,
        };
        console.log(dataBase,"一键寻车参数")
        let aesKey = this.getEncryptionParameters();
        this.loading = true;
        carSearchControl({ dataBase, aesKey })
          .then(({ data }) => {
            let decryptObj = data
              ? AES.decrypt(
                  data,
                  AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                )
              : {};
            let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
            if (dataObj.code == 0) {
              // this.$message.success({
              //   message: "命令下发成功！",
              //   duration: 2 * 1000,
              // });
              // this.isSuccess = false,
              this.commandResponse(dataBase.businessToken).then((data1) => {   
                if(data1&&data1.answerCode&&data1.answerCode==256){
                  // 一键寻车
                  this.$message.success({
                    message: "命令应答成功！",
                    duration: 2 * 1000,
                  });
                }else{
                  console.log("失败！")
                  this.changeStatusFail(1, "car", oldValue);
                  this.$message.warning({
                    message: "命令应答失败！",
                    duration: 2 * 1000,
                    offset: 30,
                  });
                }     
              });
            } else {
              this.loading = false;
              this.$message.warning({
                message: dataObj.message ? dataObj.message : "命令下发失败！",
                duration: 2 * 1000,
                offset: 30,
              });
              this.changeStatusFail(1, "car", oldValue);
            }
          })
          .catch(() => {
            this.loading = false;
            this.changeStatusFail(1, "car", oldValue);
          });
      }
    },
    // 空调温度
    changeSlider(e1, type) {
      let oldValue =
        type == 1
          ? this.carInfo.frontAirConditioningStateTemperature&&this.carInfo.frontAirConditioningStateTemperature!="-"
            ? this.carInfo.frontAirConditioningStateTemperature*1
            : 0
          : this.carInfo.rearAirConditioningTemperature&&this.carInfo.rearAirConditioningTemperature!="-"
          ? this.carInfo.rearAirConditioningTemperature*1
          : 0;
      if (e1) {
        console.log(e1,5555555555)
        let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
        let dataBase = {
          vinNo,
          sendTime:getNowTime(),
          businessToken:this.getToken(vinNo,new Date()),
          businessType:1,
          businessParam: [
            {
              position: type,
              value:
                type == 1
                  ? this.commandObj.frontAirConditioning == 17.5
                    ? "low"
                    : this.commandObj.frontAirConditioning == 32.5
                    ? "high"
                    : this.commandObj.frontAirConditioning 
                  : this.commandObj.rearAirConditioning == 17.5
                  ? "low"
                  : this.commandObj.rearAirConditioning == 32.5
                  ? "high"
                  : this.commandObj.rearAirConditioning ,
            },
          ],
        };
        console.log(dataBase,"空调温度参数")
        let aesKey = this.getEncryptionParameters();
        this.loading = true;
        airTempControl({ dataBase, aesKey })
          .then(({ data }) => {
            let decryptObj = data
              ? AES.decrypt(
                  data,
                  AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                )
              : {};
            let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
            if (dataObj.code == 0) {
              // this.$message.success({
              //   message: "命令下发成功！",
              //   duration: 2 * 1000,
              // });
              // this.isSuccess = false,
              this.commandResponse(dataBase.businessToken).then((data1) => {
                if(data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus){
                  // 空调温度
                  if(type == 1){
                     // 前空调温度
                    this.carInfo.frontAirConditioningStateTemperature = data1.answerStatus.S9?
                      data1.answerStatus.S9*1:
                      oldValue;
                    this.commandObj.frontAirConditioning = data1.answerStatus.S9
                      ? data1.answerStatus.S9*1
                      : oldValue;
                  }else{
                    // 后空调温度
                    this.carInfo.rearAirConditioningTemperature = data1.answerStatus.S10?
                      data1.answerStatus.S10*1:
                      oldValue;
                    this.commandObj.rearAirConditioning = data1.answerStatus.S10
                      ? data1.answerStatus.S10*1
                      : oldValue;
                  }
                  this.$forceUpdate();
                  this.$message.success({
                    message: "命令应答成功！",
                    duration: 2 * 1000,
                  });
                }else{
                  console.log("失败！")
                  this.changeStatusFail(type, "slider", oldValue);
                  this.$message.warning({
                    message: "命令应答失败！",
                    duration: 2 * 1000,
                    offset: 30,
                  });
                }
              });
            } else {
              this.loading = false;
              this.$message.warning({
                message: dataObj.message ? dataObj.message : "命令下发失败！",
                duration: 2 * 1000,
                offset: 30,
              });
              this.changeStatusFail(type, "slider", oldValue);
            }
          })
          .catch(() => {
            this.loading = false;
            this.changeStatusFail(type, "slider", oldValue);
          });
      }
    },
    // 车窗开度
    windowChange(e1, type) {
      let oldValue =
        type == 1
          ? this.carInfo.leftFrontWindow&&this.carInfo.leftFrontWindow!="-"
            ? this.carInfo.leftFrontWindow*1
            : 0
          : type == 2
          ? this.carInfo.rightFrontWindow&&this.carInfo.rightFrontWindow!="-"
            ? this.carInfo.rightFrontWindow*1
            : 0
          : type == 3
          ? this.carInfo.leftRearWindow&&this.carInfo.leftRearWindow!="-"
            ? this.carInfo.leftRearWindow*1
            : 0
          : this.carInfo.rightRearWindow&&this.carInfo.rightRearWindow!="-"
          ? this.carInfo.rightRearWindow*1
          : 0;
      console.log(e1,123321,type)
      if (e1 || e1 == 0) {
        let value = parseFloat((e1 * 1).toFixed(0));
        // e1 = parseFloat((e1 * 1).toFixed(0));
        console.log(e1,12365,value)
        if (type == 1) {
          this.$set(this.commandObj, "leftFrontWindow", value);
          this.$forceUpdate();
        } else if (type == 3) {
          this.$set(this.commandObj, "leftRearWindow", value);
          this.$forceUpdate();
        } else if (type == 2) {
          this.$set(this.commandObj, "rightFrontWindow", value);
          this.$forceUpdate();
        } else {
          this.$set(this.commandObj, "rightRearWindow", value);
          this.$forceUpdate();
        }
        let vinNo = this.listQuery.vinNoTotal?this.listQuery.vinNoTotal:this.listQuery.vinNo;
        let dataBase = {
          vinNo,
          sendTime:getNowTime(),
          businessToken:this.getToken(vinNo,new Date()),
          businessType:1,
          businessParam: [
            {
              position: type,
              value:
                type == 1
                  ? this.commandObj.leftFrontWindow 
                  : type == 3
                  ? this.commandObj.leftRearWindow 
                  : type == 2
                  ? this.commandObj.rightFrontWindow 
                  : this.commandObj.rightRearWindow ,
            },
          ],
        };
        console.log(dataBase,"车窗开度参数")
        let aesKey = this.getEncryptionParameters();
        this.loading = true;
        carWindowControl({ dataBase, aesKey })
          .then(({ data }) => {
            let decryptObj = data
              ? AES.decrypt(
                  data,
                  AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                )
              : {};
            let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
            if (dataObj.code == 0) {
              // this.$message.success({
              //   message: "命令下发成功！",
              //   duration: 2 * 1000,
              // });
              // this.isSuccess = false,
              this.commandResponse(dataBase.businessToken).then((data1) => {
                console.log(data1,"data")
                if(data1&&data1.answerCode&&data1.answerCode==256&&data1.answerStatus){
                  // 车窗开度
                  if(type == 1){
                    // 左前
                    this.carInfo.leftFrontWindow = data1.answerStatus.S20?
                      data1.answerStatus.S20*1
                      :oldValue;
                    this.commandObj.leftFrontWindow = data1.answerStatus.S20
                      ? data1.answerStatus.S20*1
                      : oldValue;           
                  }else if(type == 3){
                    // 左后
                    this.carInfo.leftRearWindow = data1.answerStatus.S22
                      ? data1.answerStatus.S22*1
                      : oldValue;
                    this.commandObj.leftRearWindow = data1.answerStatus.S22
                      ? data1.answerStatus.S22*1
                      : oldValue;
                  }else if(type == 2){
                    // 右前
                    this.carInfo.rightFrontWindow = data1.answerStatus.S21
                      ? data1.answerStatus.S21*1
                      : oldValue;
                    this.commandObj.rightFrontWindow = data1.answerStatus.S21
                      ? data1.answerStatus.S21*1
                      : oldValue;
                  }else{
                    // 右后
                    this.carInfo.rightRearWindow = data1.answerStatus.S23
                      ? data1.answerStatus.S23*1
                      : oldValue;
                    this.commandObj.rightRearWindow = data1.answerStatus.S23
                      ? data1.answerStatus.S23*1
                      : oldValue;
                  }
                  this.$forceUpdate();
                  this.$message.success({
                    message: "命令应答成功！",
                    duration: 2 * 1000,
                  });
                }else{
                  console.log("失败！")
                  this.changeStatusFail(type, "window", oldValue);
                  this.$message.warning({
                    message: "命令应答失败！",
                    duration: 2 * 1000,
                    offset: 30,
                  });
                }
              });
            } else {
              this.loading = false;
              this.$message.warning({
                message: dataObj.message ? dataObj.message : "命令下发失败！",
                duration: 2 * 1000,
                offset: 30,
              });
              this.changeStatusFail(type, "window", oldValue);
            }
          })
          .catch(() => {
            this.loading = false;
            this.changeStatusFail(type, "window", oldValue);
          });
      }
    },
    commandResponse(token) {
      let dataBase = {
        businessToken: token,
      };
      console.log(dataBase,"查询结果参数")
      let aesKey = this.getEncryptionParameters();
      let intervalId;
      let timeoutId;
      return new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
          queryAnswerCommand({ dataBase, aesKey }).then(({ data }) => {
            let decryptObj = data
              ? AES.decrypt(
                  data,
                  AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                )
              : {};
            let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
            console.log(dataObj, "定时器调用结果");
            if (dataObj.code == 0) {
              // this.isSuccess = true;
              // console.log(123, this.loading);
              // console.log("一",data)
              resolve(dataObj.data);
              this.loading = false;
              this.loading1 = false;
              // this.$message.success({
              //   message: "命令应答成功！",
              //   duration: 2 * 1000,
              // });
              console.log("接口code码为0，停止定时器");
              if (intervalId) {
                clearInterval(intervalId);
              }
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
            }
          });
        }, 1000);

        timeoutId = setTimeout(() => {
          console.log("30秒已过，停止定时器");
          if (intervalId) {
            clearInterval(intervalId);
          }
          // 定时器停止之后再掉一次接口，取接口值
          queryAnswerCommand({ dataBase, aesKey })
            .then(({ data }) => {
              let decryptObj = data
                ? AES.decrypt(
                    data,
                    AES.generatekey(aesKey.time, aesKey.nonce, aesKey.accessKey)
                  )
                : {};
              let dataObj = isJSON(decryptObj) ? JSON.parse(decryptObj) : {};
              console.log(dataObj, "最后一次结果");
              resolve(dataObj.data);
              this.loading = false;
              this.loading1 = false;
              // if (dataObj.code == 0) {
              //   // this.isSuccess = true;
              //   // this.$message.success({
              //   //   message: "命令应答成功！",
              //   //   duration: 2 * 1000,
              //   // });
              //   // console.log("最后一次调用code=0");
              // } else {
              //   this.$message.warning({
              //     // message: dataObj.message ? dataObj.message : "命令应答失败！",
              //     message: "命令应答失败！",
              //     duration: 2 * 1000,
              //     offset: 30,
              //   });
              // }
              // resolve(dataObj);
            })
            .catch((error) => {
              this.$message.warning({
                message: "命令应答失败！",
                duration: 2 * 1000,
                offset: 30,
              });
              // console.log("三");
              this.loading = false;
              this.loading1 = false;
              reject(error);
            });
        }, 30 * 1000);
      });
    },
    enterValue() {
      if (this.controlsValue >= 18 && this.controlsValue <= 32) {
        parseFloat((this.controlsValue * 1).toFixed(1));
        let arry = this.controlsValue.toString().split(".");
        this.controlsValue =
          arry[1] >= 5
            ? (this.controlsValue = (arry[0] + ".5") * 1)
            : arry[0] * 1;
        // console.log(this.controlsValue,55555)
        this.$set(
          this.commandObj,
          "frontAirConditioning",
          this.controlsValue * 1
        );
        // this.showInput = true;
      } else if (this.controlsValue == "low" || this.controlsValue < 18) {
        this.controlsValue = "low";
        this.$set(
          this.commandObj,
          "frontAirConditioning",
          17.5
        );
        // this.showInput = false;
      } else if (this.controlsValue == "high" || this.controlsValue > 32) {
        this.controlsValue = "high";
        this.$set(
          this.commandObj,
          "frontAirConditioning",
          32.5
        );
        // this.showInput = false;
      } else {
        this.controlsValue = "low";
        this.$set(
          this.commandObj,
          "frontAirConditioning",
          17.5
        );
        // this.showInput = false;
      }
      this.changeSlider(this.commandObj.frontAirConditioning, 1)
    },
    enterValue2() {
      if (this.controlsValue2 >= 18 && this.controlsValue2 <= 32) {
        parseFloat((this.controlsValue2 * 1).toFixed(1));
        let arry = this.controlsValue2.toString().split(".");
        this.controlsValue2 =
          arry[1] >= 5
            ? (this.controlsValue2 = (arry[0] + ".5") * 1)
            : arry[0] * 1;
        // console.log(this.controlsValue,55555)
        this.$set(
          this.commandObj,
          "rearAirConditioning",
          this.controlsValue2 * 1
        );
        // this.showInput2 = true;
      } else if (this.controlsValue2 == "low" || this.controlsValue2 < 18) {
        this.controlsValue2 = "low";
        this.$set(
          this.commandObj,
          "rearAirConditioning",
          17.5
        );
        // this.showInput2 = false;
      } else if (this.controlsValue2 == "high" || this.controlsValue2 > 32) {
        this.controlsValue2 = "high";
        this.$set(
          this.commandObj,
          "rearAirConditioning",
          32.5
        );
        // this.showInput2 = false;
      } else {
        this.controlsValue2 = "low";
        this.$set(
          this.commandObj,
          "rearAirConditioning",
          17.5
        );
        // this.showInput2 = false;
      }
      this.changeSlider(this.commandObj.rearAirConditioning, 2)
    },
    formatTooltip(val) {
      /* 处理小于或大于指定值 */
      if (val < 18) {
        return "low";
      } else if (val > 32) {
        return "high";
      }
    },
    resetData(){
      this.listObj = {};
      this.carInfo = {};
      this.basicInfo = {};
      this.batteryInfo = {};
      this.commandObj = {
        rearAirConditioning:0,
        frontAirConditioning:0,
        rightRearWindow:0,
        rightFrontWindow:0,
        leftRearWindow:0,
        leftFrontWindow:0,
      };
      this.commandDisabled = true;
      this.list = [
        {
          primaryKey: "胎压值",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "胎温值",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "轮胎压力状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "漏气状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
        {
          primaryKey: "温度状态",
          leftFront: "",
          rightFront: "",
          leftRear: "",
          rightRear: "",
        },
      ];
    },
    handleClear() {
      for (const k in this.listQuery) {
        if (k == "pageNum" || k == "pageSize") {
          continue;
        } else {
          this.listQuery[k] = "";
        }
      }
      this.resetData();
    },

    // 加载数据
    listLoad() {},
  },
};
</script>

<style lang="scss" scoped>
.controlsInput {
  float: left;
}
.sliderInput {
  margin-left: 80px;
  margin-right: 20px;
}
::v-deep .controlsInput .el-input__inner {
  padding-left: 15px !important;
  padding-right: 15px !important;
  height: 32px;
  line-height: 32px;
  width: 60px !important;
  text-align: center;
}

::v-deep .el-slider.is-vertical .el-slider__runway {
  margin: 0 auto !important;
}
::v-deep .el-slider.is-vertical.el-slider--with-input {
  padding-bottom: 75px !important;
}
::v-deep .verticalBlock .el-input.el-input--small {
  width: 60px !important;
  margin: 0 auto !important;
}
::v-deep .block .el-input.el-input--small {
  width: 60px !important;
  margin: 0 auto !important;
  float: left !important;
}
::v-deep .el-slider__runway.show-input {
  margin-left: 80px !important;
  margin-right: 20px !important;
}

::v-deep .el-slider__marks-text:first-child {
  left: -2% !important;
}
::v-deep .el-slider__marks-text:nth-of-type(2) {
  left: 5% !important;
}
::v-deep .el-slider__marks-text:nth-of-type(3) {
  left: 95% !important;
}
::v-deep .el-slider__marks-text:last-child {
  left: 104% !important;
  width: 30px;
}
::v-deep .el-form-item--mini .el-form-item__label {
  font-weight: 400;
  color: #262834 !important;
}
::v-deep .el-form-item--mini .el-form-item__content {
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

::v-deep .vehicleControlBottom .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}

::v-deep .el-table {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
}
::v-deep .el-table::before {
  height: 0;
}
.boldText {
  margin: 10px 0 10px 20px;
  font-weight: bold;
  color: #262834;
}

::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    padding: 0 10px 25px 0;
    max-height: calc(100vh - 234px); // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}

// ::v-deep .el-scrollbar {
//   .el-scrollbar__wrap {
//     padding: 0 0 25px 0;
//     max-height: calc(100vh - 430px); // 最大高度
//     overflow-x: hidden !important; // 隐藏横向滚动栏
//   }
// }
</style>
