<template>
  <div class="animation-container">
    <div class="internal">
      <div class="baffle">
        <img
          class="side-car"
          src="../../../../assets/images/side_car.png"
          alt=""
        />
      </div>

      <div class="move-diamond">
        <div style="position: relative; height: 100%">
          <!-- 换电完成图标 -->
          <div  v-if="step==5"  class="diamond green-change toTop">
            <p>
              <img
                class="arrow"
                src="../../../../assets/images/green_arrow.png"
                alt=""
              />
            </p>
            <p>
              <img
                class="battery"
                src="../../../../assets/images/green_battery.png"
                alt=""
              />
            </p>
          </div>
          <!-- 换电中图标 -->
          <div v-if="step==3||step==4"  class="diamond yellow-change toBottom">
            <p>
              <img
                class="arrow"
                src="../../../../assets/images/yellow_arrow.png"
                alt=""
              />
            </p>
            <p>
              <img
                class="battery"
                src="../../../../assets/images/yellow_battery.png"
                alt=""
              />
            </p>
          </div>
          <!-- 替换中图标 -->
          <div v-if="step == 4"  class="diamond icon-replace ">
            <img class="rotate" src="../../../../assets/images/icon_replace.png" alt="" />
          </div>
          <!-- 替换完成图标-->
          <div  v-if="step == 6"  class="diamond finish">
            <div class="gather amplify">
              <img src="../../../../assets/images/icon_cancel.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="point">车辆当前换电中,请稍等片刻...</div>
    </div>

</div>
</template>
<script>
export default {
  name: "powerAnimation",
  props: {
    step:{
      type:Number,
      default:0
    }
  },
  data() {
    return {

    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.animation-container {
  position: absolute;
  width: calc(63%);
  height: 37vh;
  z-index: 9;
  background: #fff;
  top: 4vh;
  left: 19%;
  text-align: center;
  z-index: 99;
  .internal {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    .point {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      margin-bottom: 4vh;
      color: #595959;
    }
  }
  .side-car {
    width: calc(56% - 4px);
    height: 12.8vh;
    margin-top: 5.9vh;
  }
  .move-diamond {
    width: calc(21% - 2px);
    position: absolute;
    top: 16vh;
    height: 13.7vh;
    left: 50%;
    margin-left: calc(-10.5% + 11px);
    overflow: hidden;
    .diamond {
      position: absolute;
      bottom: 14vh;
      width: 100%;
      .arrow{
        animation:twinkle 0.5s infinite;
      }
    }
    .green-change {
      bottom: 3vh;
    }
    .yellow-change {
      bottom: 14vh;
    }
    .icon-replace {
      bottom: 3vh !important;
      img {
        width: 3.52vh;
      }
    }
    .finish {
      bottom: 1.3vh !important;
      height: 6.85vh;
      .gather {
        position: relative;
        height: 100%;
        width: 6.85vh;
        margin: 0 auto;
        background: url("../../../../assets/images/icon_round.png") no-repeat
          center;
        background-size: 100% 100%;
      }
      img {
        width: 6.85vh;
      }
    }
  }
}
.arrow {
  width: calc(20%);
  height: 4vh;
}
.battery {
  width: calc(100%);
  height: 2.4vh;
}
.toTop{
    animation:toTop 3s linear 1;  
}
.toBottom{
    animation:toBottom 3s linear 1;  
}
.rotate{
    animation:rotate 2.5s linear 1;
}
.amplify{
    animation:amplify 0.5s linear 1;
}
.twinkle-title{
  animation:twinkle 1s linear 2;
}
@keyframes twinkle {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
// 向下移动
@keyframes toBottom{
  0% {
    transform: translateY(0);
  }
  80%{
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(11vh);
  } 
}
// 向上移动
@keyframes toTop{
  0% {
   opacity: 0;
   transform: translateY(0);
  }
  20%{
   opacity: 1; 
  }
  100% {
   transform: translateY(-11vh);
  } 
}
// 旋转
@keyframes rotate{
  0% {
   transform: rotate(0)
  }
  50% {
  transform: rotate(180deg)
  }
  70%{
    opacity: 1;
  }
  100% {
   opacity: 0;
   transform: rotate(360deg);
  } 
}
// 放大
@keyframes amplify{
  0% {
       transform: scale(.2);
  }
  100% {
       transform: scale(1);
  }
}
</style>