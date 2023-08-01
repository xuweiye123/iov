<template>
  <div class="info-window" style="width: 250px;height: 150px">
    <div class="info-window-header">
      <span class="info-window-header-title">{{
        $t("home.infoWindow.title")
      }}</span>
      <div @click="handleClose">
        <svg-icon
          style="margin:10px"
          icon-class="close"
          :title="$t('public.close')"
        />
      </div>
    </div>
    <el-form label-width="90px" size="mini">
      <el-form-item :label="$t('home.infoWindow.licencePlate') + ': '">
        {{ info.licensePlate }}
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.area') + ': '">
        {{ info.areaName }}
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.obd') + ': '">
        {{ info.obd }}
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.gpsTime') + ': '">
        {{ gps.gpsTime }}
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.brand') + ': '">
        <span :title="info.brandName">{{ info.brandName }}</span>
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.series') + ': '">
        <span :title="info.seriesName">{{ info.seriesName }}</span>
      </el-form-item>
      <el-form-item :label="$t('home.infoWindow.model') + ': '">
        <span :title="info.modelName">{{ info.modelName }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getGPS, getInfo } from "@/api/batterySys/home";
import interval from "@/mixins/interval";

export default {
  name: "CarInfo",
  mixins: [interval],
  props: {
    id: [String, Number],
  },
  watch: {
    id() {
      this.info = {};
      this.gps = {};
      this.loadInfo();
      this.doRefresh();
    },
  },
  data() {
    return {
      info: {},
      gps: {},
    };
  },
  methods: {
    loadInfo() {
      getInfo(this.id).then((resp) => {
        this.info = resp.data.data;
      });
    },
    refresh() {
      const promise = getGPS(this.id);
      promise.then((resp) => {
        this.gps = resp.data.data;
      });
      return promise;
    },
    handleClose() {
      this.$emit("close");
    },
    handleSingleMonitor() {
      this.$emit("single-monitor", this.id);
    },
  },
};
</script>
<style lang="scss">
/* 重写外层默认样式 */
.gm-style .gm-style-iw-c {
  padding: 0;
  border-radius: 5px;
}
.gm-style .gm-style-iw-d {
  overflow: hidden !important;
}
//去掉自带的关闭按钮
.gm-style .gm-style-iw-d + button {
  display: none !important;
}
$primary-color: #305fe6;
$primary-color-2: #3e70ff;
$white: #ffffff;
.info-window {
  color: #666;
  padding: 0px !important;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .single-monitor-btn {
    position: absolute;
    top: 80px;
    right: 10px;
  }
  .el-form-item__content,
  .el-form-item__label {
    font-size: 12px;
  }
  .el-button--primary {
    background-color: $primary-color-2;
    border-color: $primary-color-2;
  }
}
.info-window-header {
  background-color: $primary-color-2;
  line-height: 40px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: $white;
  padding-left: 10px;
  display: flex;
  .info-window-header-title {
    flex: 1;
  }
  i {
    cursor: pointer;
    line-height: 40px !important;
    margin-right: 10px;
  }
  .el-icon-search {
    cursor: auto;
  }
}
</style>
