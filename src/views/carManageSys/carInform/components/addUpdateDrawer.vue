<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增车辆' : '编辑车辆'"
    width="55%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="VIN码：" prop="vinNo">
              <el-input
                v-model.trim="formInfo.vinNo"
                :disabled="isEdit"
                clearable
                :maxlength="17"
                placeholder="请输入VIN码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型名称：" prop="carTypeId">
              <el-select
                :disabled="isEdit"
                v-model="formInfo.carTypeId"
                filterable
                clearable
                placeholder="请选择"
                @change="carTypeChange"
                @clear="carTypeClear"
              >
                <el-option
                  v-for="(item, index) in carTypeList"
                  :key="index"
                  :label="item.carTypeName"
                  :value="item.carTypeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目代号：" prop="carBatchId">
              <el-select
                :disabled="isEdit"
                v-model="formInfo.carBatchId"
                filterable
                clearable
                placeholder="请先选择车型名称"
              >
                <el-option
                  v-for="(item, index) in batchCodeList"
                  :key="index"
                  :label="item.carBatchCode"
                  :value="item.carBatchId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌：" prop="brandId">
              <el-select
                disabled
                v-model="formInfo.brandId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in brandList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整车物料号：" prop="carAlias">
              <el-input
                v-model="formInfo.carAlias"
                clearable
                placeholder="请输入整车物料号"
                :maxlength="18"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型：" prop="vehicleTypeId">
              <el-select
                v-model="formInfo.vehicleTypeId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in vehicleTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机号：" prop="engineCode">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.engineCode"
                clearable
                placeholder="请输入发动机号"
              />
            </el-form-item>
          </el-col>    
          <el-col :span="12">
            <el-form-item label="TBOXSN(终端条形码)：" prop="barCode">
              <el-input
                :disabled="isEdit"
                v-model.trim="formInfo.barCode"
                clearable
                placeholder="请点击选择"
                :readonly="true"
                class="pointerInput"
                @focus="showTboxSnList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号：" prop="productTypeId" >
              <el-select
                v-model="formInfo.productTypeId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item.productTypeNumber"
                  :value="item.productTypeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驱动电机编码：" prop="driverPartNumber">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.driverPartNumber"
                clearable
                placeholder="请输入驱动电机编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动力电池编码：" prop="powerPartNumber">
              <el-input
                maxlength="50"
                v-model.trim="formInfo.powerPartNumber"
                clearable
                placeholder="请输入动力电池编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用单位：" prop="ownerCompanyId">
              <el-select
                v-model="formInfo.ownerCompanyId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in companyList"
                  :key="index"
                  :label="item.companyName"
                  :value="item.contractCompanyId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="车牌号码：" prop="licensePlate">
              <el-input
                v-model.trim="formInfo.licensePlate"
                clearable
                placeholder="请输入车牌号码"
                :maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用区域：" prop="stationArr">
              <app-city-picker
                ref="cityPicker"
                :isEmpty="isEmpty"
                :is-data="visibles"
                :default-city="formInfo.stationArr"
                @change="pickerChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆颜色：" prop="color">
              <el-input
                maxlength="10"
                v-model.trim="formInfo.color"
                clearable
                placeholder="请输入车辆颜色"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="电池生产日期代码："
              prop="batteryProductionDate"
            >
              <el-date-picker
                v-model="formInfo.batteryProductionDate"
                filterable
                clearable
                placeholder="请选择"
                type="date"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入备注"
                type="textarea"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <select-terminal-dialog
        :visibles.sync="terminalVisbles"
        @dblclick-select-terminal="selectTerminal"
      /> -->
      <select-tbox-sn-dialog
        :visibles.sync="tboxSnVisbles"
        @dblclick-tbox="selectTboxSn"
      />
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import {
  getCarTypeInfo,
  getBatchCodeInfo,
  getProductInfo,
  createCar,
  updateCar,
  getContactId,
} from "@/api/carManageSys/carInform";
// 组件
// import selectTerminalDialog from "./selectTerminalDialog";
import selectTboxSnDialog from "./selectTboxSnDialog";
import appCityPicker from "./appCityPicker";
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm, checkFormRule,getDropList],
  components: {
    // selectTerminalDialog,
    selectTboxSnDialog,
    appCityPicker,
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      formInfo: {
        vinNo: "",
        carAlias: "",
        carTypeId: "",
        carBatchId: "",
        vehicleTypeId: "",
        productTypeId: "",
        barCode: "",
        brandId:"",
        // terminalCode:'',
        driverPartNumber: "",
        ownerCompanyId: "",
        powerPartNumber: "",
        licensePlate: "",
        engineCode: "",
        stationArr: [],
        areaId:"",
        color: "",
        batteryProductionDate: "",
        remark: "",
      },
      isEmpty:false,
      companyList: [],
      carTypeList: [],
      batchCodeList: [],
      productList: [],
      stationArr: [],
      brandList: [
      ],
      vehicleTypeList: [
      ],
      // 下拉
      dropList:[
        { postData:{dicCode:1001},key:'brandList' },
        { postData:{dicCode:1002},key:'vehicleTypeList' }
      ],
      // terminalVisbles: false,
      tboxSnVisbles: false,
      tableRow: {},
      rules: {
        vinNo: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入VIN码",
            ruleReg: 'vinno',
            errorTips:"请输入17位的字母或数字",
            formObjName: "formInfo",
          },
        ],
        carTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车型名称",
            formObjName: "formInfo",
          },
        ],
        carBatchId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择项目代号",
            formObjName: "formInfo",
          },
        ],
        barCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择TBOXSN(终端条形码)",
            formObjName: "formInfo",
          },
        ],
        brandId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择品牌",
            formObjName: "formInfo",
          },
        ],
        vehicleTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车辆类型",
            formObjName: "formInfo",
          },
        ],
        productTypeId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择产品型号",
            formObjName: "formInfo",
          },
        ],
        driverPartNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入驱动电机编码",
            formObjName: "formInfo",
          },
        ],
        powerPartNumber: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入动力电池编码",
            formObjName: "formInfo",
          },
        ],
        carAlias: [
          {
            required: false,
            trigger: ["blur", "change"],
            tips: "请输入整车物料号",
            validator: this.validInput,
            ruleReg: 'caralias',
            errorTips:"请输入18位的字母或数字",
            formObjName: "formInfo",
          },
        ],
        licensePlate: [
          {
            required: false,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入车牌号码",
            ruleReg: 'newEnergyVehicle',
            errorTips:"请输入正确的车牌号码",
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
          getCarTypeInfo().then(({ data }) => {
            if (data.code === 0) {
              this.carTypeList = data.data || [];
            }
          });
          getProductInfo().then(({ data }) => {
            if (data.code === 0) {
              this.productList = data.data || [];
            }
          });
          getContactId().then(({ data }) => {
            if (data.code === 0) {
              this.companyList = data.data || [];
            }
          });
          this.getDropList(this.dropList);
          if (this.isEdit) {
            this.formInfo = { ...{ carBatchId: "" }, ...this.data };
            this.formInfo.stationArr = [
              this.formInfo.provinceId,
              this.formInfo.cityId,
              this.formInfo.districtId,
            ];
            this.carTypeList.forEach((i) => {
              if (i.carTypeId == this.formInfo.carTypeId) {
                this.formInfo.carTypeName = i.carTypeName;
              }
            });
            if (this.formInfo.carTypeId) {
              const postData = {
                carTypeId: this.formInfo.carTypeId,
              };
              getBatchCodeInfo(postData).then(({ data }) => {
                if (data.code === 0) {
                  this.batchCodeList = data.data || [];
                }
              });
            }
          }
        }
      },
    },
  },
  created() {},
  methods: {
    // 车型名称改变
    carTypeChange(e) {
      if (!e) {
        return;
      }
      this.formInfo.carBatchId = "";
      this.formInfo.brandId = "";
      this.carTypeList.forEach((i) => {
        if (i.carTypeId == e) {
          this.formInfo.carTypeName = i.carTypeName;
          this.formInfo.brandId = i.brandId;
        }
      });
      this.batchCodeList = [];
      const postData = {
        carTypeId: e,
      };
      getBatchCodeInfo(postData).then(({ data }) => {
        if (data.code === 0) {
          this.batchCodeList = data.data || [];
        }
      });
    },
    // 清空车型名称
    carTypeClear() {
      this.formInfo.carBatchId = "";
      this.formInfo.brandId = "";
      this.batchCodeList = [];
    },

    // 显示终端list
    // showTerminalList() {
    //   this.terminalVisbles = true;
    // },
    // 显示Tboxsn
    showTboxSnList() {
      this.tboxSnVisbles = true;
    },
    // 获取终端
    selectTerminal(e) {
      const { barCode, terminalCode, terminalId } = e;
      this.formInfo.barCode = barCode;
      this.formInfo.terminalCode = terminalCode;
      this.formInfo.terminalId = terminalId;
    },
    // 获取TboxSn
    selectTboxSn(e) {
      const { barCode,terminalCode, terminalId } = e;
      this.formInfo.barCode = barCode;
      this.formInfo.terminalCode = terminalCode;
      this.formInfo.terminalId = terminalId;
    },
    // 省市区联动
    pickerChange(e) {
      this.formInfo.stationArr = e;
      const { stationArr } = this.formInfo;
      this.getCityId(stationArr);
    },
    // 获取城市id
    getCityId(stationArr = []) {
      // console.log(
      //   this.formInfo.stationArr,
      //   "console.log(this.formInfo.stationArr)"
      // );
      if (stationArr.length > 0) {
        this.formInfo.areaId = stationArr[stationArr.length - 1];
      }else{
        this.formInfo.areaId=""
      }
    },
    // 关闭Drawer
    closeDrawer() {
      this.formInfo = {
        vinNo: "",
        carAlias: "",
        carTypeId: "",
        carBatchId: "",
        vehicleTypeId: "",
        productTypeId: "",
        barCode: "",
        brandId: "",
        // terminalCode:'',
        driverPartNumber: "",
        ownerCompanyId: "",
        powerPartNumber: "",
        licensePlate: "",
        engineCode: "",
        areaId:"",
        stationArr: [],
        color: "",
        batteryProductionDate: "",
        remark: "",
      };
        this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      createCar(postData)
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
      updateCar(postData)
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

    // 点击提交
    submitForm() {
      let formLists=[]
      if(this.$store.state.user.userInfo.isVinNoDesensitized&&this.isEdit){
        formLists=[
          // "vinNo", //VIN码
          "carTypeId", //车型
          "carBatchId",
          "brandId",
          "vehicleTypeId",
          "productTypeId",
          "driverPartNumber",
          "powerPartNumber",
          "carAlias",
          "licensePlate",
          "barCode"
        ]
      }else{
        formLists=[
          "vinNo", //VIN码
          "carTypeId", //车型
          "carBatchId",
          "brandId",
          "vehicleTypeId",
          "productTypeId",
          "driverPartNumber",
          "powerPartNumber",
          "carAlias",
          "licensePlate",
          "barCode"
        ]
      }
      // console.log(this.activeName,"this.activeName",this.isEdit,'this.isEdit')
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: formLists
      });
      if (!formcenter) {
        return;
      }
      const { stationArr } = this.formInfo;
      this.getCityId(stationArr);
      const {
        vinNo,
        carAlias,
        carTypeId,
        carBatchId,
        brandId,
        vehicleTypeId,
        productTypeId,
        driverPartNumber,
        powerPartNumber,
        barCode,
        terminalId,
        engineCode,
        ownerCompanyId,
        terminalCode,
        licensePlate,
        areaId,
        color,
        batteryProductionDate,
        remark,
        carId,
      } = this.formInfo;
      const postData = {
        vinNo,
        carAlias,
        carTypeId,
        carBatchId,
        brandId,
        productTypeId,
        vehicleTypeId,
        terminalId,
        terminalCode,
        ownerCompanyId,
        areaId,
        barCode,
        licensePlate,
        color,
        driverPartNumber,
        engineCode,
        powerPartNumber,
        batteryProductionDate,
        remark,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.carId = carId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__item {
  line-height: unset;
}
</style>
