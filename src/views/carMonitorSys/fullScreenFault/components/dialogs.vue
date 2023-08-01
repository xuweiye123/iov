<template>
 <el-dialog
    custom-class="dialogBox"
    v-if="visibles"
    v-el-drag-dialog
    :visible.sync="visibles"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :show-close="false"
    :append-to-body="true"
    center
    top="5vh"
    :width="'50%'"
    >
    <div slot="title" class="dialogHeader">
      <span class="custom-dialog-header-title">
        <i class="iconfont icon-faultDialogTitle" style="font-size: 16px;"></i>
        <span style="margin-left: 3px;font-size: 14px;">开始故障处置</span>
      </span>
      <span @click="closeDialog" class="custom-dialog-header-close">
        <i class="el-icon-close" style="font-size: 16px;"></i>
      </span>
    </div>
    <div>
      <div class="suggest-top">
        <el-form
          :label-position="'right'"
          :model="formInfo"
          label-width="100px"
        >
          <el-row class="oddRow">
            <el-col :span="12">
              <el-form-item label="VIN码：">
                {{ formInfo.vinNo || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车牌号码：">
                {{ formInfo.licenseplate || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营运城市：">
                {{ formInfo.cityName || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车型名称：">
                {{ formInfo.carTypeName || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="oddRow">
            <el-col :span="12">
              <el-form-item label="使用单位：">
                {{ formInfo.company || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="故障码：">
                {{ formInfo.faultCode || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="故障名称：">
                {{ formInfo.faultName || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="故障类型：">
                {{ formInfo.faultType || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="oddRow">
            <el-col :span="12">
              <el-form-item label="国标故障等级：">
                {{ formInfo.gbFaultLevel || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自定义故障等级：">
                {{ formInfo.faultLevel || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始时间：">
                {{ formInfo.startTime || "-"}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间：">
                {{ formInfo.endTime || "-"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="oddRow">
            <el-col :span="24">
              <el-form-item label="车辆位置：">
                {{ formInfo.currentAddress || "-"}}
              </el-form-item>
            </el-col>
						<!-- <el-col :span="12" >
              <el-form-item label="占位符" style="visibility: hidden;">
               
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </div>
      <!-- <app-item-pance :list="list" :number="2" :left-width="'100'" /> -->
      <div class="suggest-content">
        <p>故障备案处置措施</p>
        <div class="suggest-info">
          <span>{{ maintainInfo }}</span>
        </div>
      </div>
      <div style="height:10px"></div>
    </div>
		<div slot="footer">
			<el-button v-waves type="primary" :loading="loading" @click="handleSubmit"
				>开始处置</el-button
			>
			<el-button  v-waves @click="closeDialog">关闭</el-button>
		</div>
 </el-dialog>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import appItemPance from "@/components/itemPance";
import {
  getFaultCarInfo,
  disposalFault,
} from "@/api/carMonitorSys/fullscreenFault";
// reg
export default {
  name: "dialogs",
  mixins: [partialForm],
  components: { appItemPance },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      list: [],
      maintainInfo: "",
      faultInfo: {},
      formInfo: {},
      loading:false
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = this.data;
        this.formInfo.startTime = this.formInfo.startTime?this.formInfo.startTime.split('.')[0]:'-'
        this.formInfo.endTime = this.formInfo.endTime?this.formInfo.endTime.split('.')[0]:'-'
        // let company = "";
        // let cityName = "";
        // let currentAddress = "";
        // const {
        //   vinNo,
        //   licenseplate,
        //   carTypeName,
        //   faultCode,
        //   faultName,
        //   faultType,
        //   gbFaultLevel,
        //   faultLevel,
        //   startTime,
        //   endTime,
        //   carId,
        // } = this.data;
        
        // this.list = [
        //   {
        //     name: "VIN码",
        //     value: vinNo,
        //   },
        //   {
        //     name: "车牌号码",
        //     value: licenseplate,
        //   },
        //   {
        //     name: "营运城市",
        //     value: cityName,
        //   },
        //   {
        //     name: "车型名称",
        //     value: carTypeName,
        //   },
        //   {
        //     name: "使用单位",
        //     value: company,
        //   },
        //   {
        //     name: "故障码",
        //     value: faultCode,
        //   },
        //   {
        //     name: "故障名称",
        //     value: faultName,
        //   },
        //   {
        //     name: "故障类型",
        //     value: faultType,
        //   },
        //   {
        //     name: "国标故障等级",
        //     value: gbFaultLevel,
        //   },
        //   {
        //     name: "自定义故障等级",
        //     value: faultLevel,
        //   },
        //   {
        //     name: "车辆位置",
        //     value: currentAddress,
        //   },
        //   {
        //     name: "开始时间",
        //     value: startTime,
        //   },
        //   {
        //     name: "结束时间",
        //     value: endTime,
        //   },
        // ];
        // let arr = [
        //   { name: "营运城市", keys: "cityName" },
        //   { name: "使用单位", keys: "company" },
        //   { name: "车辆位置", keys: "currentAddress" },
        // ];
        const postData = { 
          carId:this.formInfo.carId
        };
        getFaultCarInfo(postData).then(({ data }) => {
          if (data.code === 0) {
            this.formInfo.company = data.data.company || "-";
            this.formInfo.cityName = data.data.cityName || "-";
            this.formInfo.currentAddress = data.data.currentAddress || "-";
            
            // for (let i = 0; i < arr.length; i++) {
            //   const index = this.list.findIndex(
            //     (item) => item.name === arr[i].name
            //   );
            //   if (index > -1) {
            //     this.list[index].value = data.data[arr[i].keys];
            //   }
            // }
            this.maintainInfo = data.data.maintainInfo;
            this.faultInfo = data.data || {};
          }
        });

        // console.log(this.list)
      }
    },
  },
  methods: {
    // 关闭
    closeDialog() {
      this.$emit("update:visibles", false);
    },
    handleSubmit() {
      let postData = {
        faultId: this.data.faultId?this.data.faultId:"",
        address: this.faultInfo.currentAddress?this.faultInfo.currentAddress:"",
        lng: this.faultInfo.longitude?this.faultInfo.longitude:"",
        lat: this.faultInfo.latitude?this.faultInfo.latitude:"",
      };
      this.loading=true
      disposalFault(postData).then(({ data }) => {
        this.loading=false
        if (data.code === 0) {
          this.$message.success({
            message: "处置成功",
            duration: 2 * 1000,
          });
          this.$emit("dispatch-success");
          this.closeDialog();
        }
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body{
  background-color: rgb(0, 90, 139, 0.8) !important;
}

.suggest-content {
	margin-top:15px;
  border: 1px solid #0185c3 !important;
  p {
		background: #046492 !important;
		border-bottom: 1px solid #0185c3 !important;
    padding: 8px 0;
    text-align: center;
    // font-size: 13px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #FFFDF0;
  }
  .suggest-info {
    color: #FFFDF0 !important;
    // border: 1px solid rgb(96, 98, 102);
    border-radius: 5px;
    height: 90px;
    padding: 15px;
  }
}

.custom-dialog-header-title {
  margin: 0 5px 0 15px;
  display: flex;
  align-items: center;
}
.custom-dialog-header-close {
  background: rgb(0, 90, 139, 0.8);
  // box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);
  border-radius: 4px;
  border: 1px solid #0185c3 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: -1px -1px 0 0 !important;
}

.suggest-top {
  border: 1px solid #096e9e !important;
}
// ::v-deep .dialog-footer{
// 	justify-content: flex-end;
// }

::v-deep .el-form-item--small.el-form-item{
	margin-bottom: 0 ;
}
::v-deep .el-col{
  background: #0e4a77 !important;
	color: #FFFDF0 !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
	// font-size: 13px;
}
::v-deep .oddRow .el-col{
  background: #046492 !important;
}

// 弹框样式
::v-deep .dialogBox {
  background-color: rgb(0, 90, 139, 0.8) !important;
  box-shadow: 0px 2px 1px 0px rgba(0, 39, 70, 0.8);
  border-radius: 4px;
  border: 1px solid #096e9e !important;
}
::v-deep .dialogBox .el-dialog__header {
  background-color: rgb(0, 90, 139, 0.8) !important;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #fff !important;
  font-size: 14px !important;
  border-bottom: 1px solid #096e9e !important;
}
::v-deep .el-dialog .el-dialog__footer {
  border-top: 1px solid #096e9e !important;
}

// 底部按钮
::v-deep .el-button--primary,
::v-deep .el-button--primary:hover,
::v-deep .el-button--primary:active
{
	background: linear-gradient(120deg, #51F267, #00A0E9) !important;
	border-radius: 4px !important;
	color: #fff !important;
	border: 1px solid #00A0E9  !important;
}
::v-deep .el-button--default,
::v-deep .el-button--default:hover,
::v-deep .el-button--default:active{
    background: rgba(0, 90, 139,.2) !important;
    border: 1px solid #00A0E9  !important;
    border-radius: 4px !important;
    color: #fff !important;
  }
::v-deep .el-form-item__label{
  color: #FFFDF0 !important;
}
</style>
