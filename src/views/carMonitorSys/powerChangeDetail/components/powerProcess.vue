<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看换电过程'"
    :wrapperClosable="true"
    width="50%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
    :isMask="isMask"
  >
    <div slot="drawerContent" class="drawer-content">
      <div class="top">
        <p>
          <span class="name">时间：</span>
          <span class="value">{{formInfo.changeTime?formInfo.changeTime:'-'}}</span>
        </p>
        <p style="margin-top: 10px">
          <span class="name">电池编码：</span>
          <span class="value">{{formInfo.batCode?formInfo.batCode:'-'}}</span>
        </p>
      </div>
      <div class="prompt">
        <div class="container" :class="step == 1 || step == 7? 'twinkle-title' : ''">
          <svg-icon
            style="font-size: 12px; margin-right: 5px"
            :icon-class="step == 7 ?'icon_finish':'icon_ready'"
          />
          {{  formInfo.changePowerStatus == 1 ? "换电准备中" 
            : formInfo.changePowerStatus == 2 ? "换电中" 
            : formInfo.changePowerStatus == 3 ? "换电完成" 
            : "-" }}
        </div>
      </div>
      <div class="car">
        <div class="car-left">
          <div
            v-for="(item, index) in carLeftList"
            :key="index"
            class="car-block"
          >
            <p class="name">{{ item.name }}</p>
            <p v-if="item.notes">{{ item.notes }}</p>
            <p class="value">{{ item.value }}</p>
          </div>
        </div>
        <div class="car-middle">
          <div class="car-block">
            <p class="name">车辆状态</p>
            <p class="value">{{formInfo.carStatus}}</p>
          </div>
        </div>
        <div class="car-right">
          <div
            v-for="(item, index) in carRightList"
            :key="index"
            class="car-block"
          >
            <p class="name">{{ item.name }}</p>
            <p v-if="item.notes">{{ item.notes }}</p>
            <p class="value">{{ item.value }}</p>
          </div>
        </div>
         <power-animation :step="step" v-if="isShowAnimation" />
      </div>
     
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import powerAnimation from "../components/powerAnimation";
import { getChangeProcess } from "@/api/carMonitorSys/powerChangeDetail";
export default {
  doNotInit: true,
  name: "detailCarDrawer",
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
  components: { powerAnimation },
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
      carLeftList: [
        { name: "车速", value: "0km/h" },
        { name: "制动踏板", value: "0%" },
        { name: "方向盘转向角", value: "0°" },
        { name: "左前门状态", value: "关闭" },
        { name: "左后门状态", value: "关闭" },
        { name: "SOE", notes: "电池剩余电量", value: "0kwh" },
      ],
      carRightList: [
        { name: "挡位", value: "P挡" },
        { name: "油门踏板", value: "0%" },
        { name: "手刹状态", value: "拉起" },
        { name: "右前门状态", value: "关闭" },
        { name: "右后门状态", value: "关闭" },
        { name: "SOH", notes: "电池健康状态", value: "0" },
      ],
      step: 0,
      isShowAnimation: false,
      isMask:false,
      timer:null,
      formInfo:{
        changePowerStatus:1
      }
    };
  },
  computed: {},
  watch: {
    visibles(e1) {
      if (e1) {
        this.step = 0;
        this.isShowAnimation = false;
        this.getProcess()
      }
    },
  },
  mounted() {},
  methods: {
    // 关闭
    closeDrawer() {
      this.timer = null
      this.$emit("update:visibles", false);
    },
   getProcess(){
      let params = {
        vinNo:this.data.vinNoTotal,
        orderSn:this.data.orderSn
      }
      getChangeProcess(params).then(({data})=>{
        if(data.code == 0){
            this.formInfo = data.data[0]
            this.carLeftList[0].value = this.formInfo.speed + 'km/h'
            this.carLeftList[1].value = this.formInfo.brakePedal + '%'
            this.carLeftList[2].value = this.formInfo.steering + '°'
            this.carLeftList[3].value = this.formInfo.leftFrontDoor?'开启':'关闭'
            this.carLeftList[4].value = this.formInfo.leftRearDoor?'开启':'关闭'
            this.carLeftList[5].value = this.formInfo.soe + 'kwh'

            this.carRightList[0].value = this.formInfo.gear
            this.carRightList[1].value = this.formInfo.acceleratorPedal +'%'
            this.carRightList[2].value = this.formInfo.handBrakeStatus?'拉起':'放下'
            this.carRightList[3].value = this.formInfo.rightFrontDoor?'开启':'关闭'
            this.carRightList[4].value = this.formInfo.rightRearDoor?'开启':'关闭'
            this.carRightList[5].value = this.formInfo.soh

            this.stepAll()
            this.polling()
           
        }
      })

    },
    polling(){
     this.timer = setInterval(()=>{ 
       this.getProcess()
     },5000)
    },
    async stepAll() {
       // 换电准备中
       if(this.formInfo.changePowerStatus == 1){ 
         let p1 = await this.step1();
         Promise.all([p1]);
         console.log(this.step,'step')
       }
       // 换电中
      else if(this.formInfo.changePowerStatus == 2){
         this.isShowAnimation = true;
         this.isMask = true
         let p2 = await this.step2();
         let p3 = await this.step3();
         let p4 = await this.step4();
         let p5 = await this.step5();
         let p6 = await this.step6();
         Promise.all([p2,p3,p4,p5,p6]).then(()=>{
           this.isShowAnimation = false;
           this.isMask = false
         })
        // 换电完成
      } else if(this.formInfo.changePowerStatus == 3){
           this.isShowAnimation = true;
           this.isMask = true
           let p6 = await this.step6();
           let p7 = await this.step7();
           Promise.all([p6,p7]).then(()=>{
           this.isShowAnimation = false;
           this.isMask = false
           })
      }
    },
    step1() {
      let step1 = new Promise((resolve) => {
        this.step = 1;
        resolve();
      });
      return step1;
    },
    step2() {
      let step2 = new Promise((resolve) => {
        setTimeout(() => {
          this.step = 2;
          // this.isMask = true
          // this.isShowAnimation = true;
          resolve();
            }, 0);
        // }, 2000); // 动画不分解为延迟2s
      });
      return step2;
    },
    step3() {
      let step3 = new Promise((resolve) => {
        this.step = 3;
        resolve();
      });
      return step3;
    },
    step4() {
      let step4 = new Promise((resolve) => {
        setTimeout(() => {
          this.step = 4;
          resolve();
        }, 2800);
      });
      return step4;
    },
    step5() {
      let step5 = new Promise((resolve) => {
        setTimeout(() => {
          this.step = 5;
          resolve();
        }, 2500);
      });
      return step5;
    },
    step6() {
      let step6 = new Promise((resolve) => {
        setTimeout(() => {
          this.step = 6;
          resolve();
        // }, 3000);
        }, 1000);
      });
      return step6;
    },
     step7() {
      let step7 = new Promise((resolve) => {
        setTimeout(() => {
          this.step = 7;
          // this.isMask = false
          // this.isShowAnimation = false
          resolve();
        }, 1000);
      });
      return step7;
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.top {
  padding: 10px;
  background: #f4f5f7;
}
.value {
  font-weight: bold;
  color: #333;
}
.prompt {
  margin: 20px 0;
  z-index: 99;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(20% - 4px);
    height: 5.5vh;
    margin: 0 auto;
    background: #deeaff;
    color: #1e64dd;
    border-radius: 4px;
  }
}
.car {
  background: url(../../../../assets/images/car.png) no-repeat center;
  background-size: 100% 100%;
  height: 100%;
  margin-bottom: 20px;
  display: flex;
  width: calc(85% - 8px);
  height: 63.9vh;
  margin: 0 auto;
  position: relative;
  .car-middle {
    width: calc(60%);
  }
  .car-left,
  .car-right {
    width: calc(21% - 1px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1vh;
  }
}
.car-block {
  height: 7.5vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.twinkle-title {
  animation: twinkle 1s linear 2;
}
@keyframes twinkle {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
