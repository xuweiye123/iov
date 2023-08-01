<template>
  <app-dialog
      :visibles="visibles"
      :title="'异常信息列表'"
      width="60%"
      top="5vh"
      @close-dialog="closeDialog"
      @handle-submit="handleExport"
      confirmText="导出失败数据"
      :isFooter="isShow"
      class="ordinary"
    >
    <div slot="formContent">
      <div style="max-height:65vh;">
        <p class="sim-import-result">
          <i class="iconfont icon-gantanhao-yuankuang"></i>
          导入成功
          <span class="green">{{ data.successCount?data.successCount:successList&&successList.length?successList.length:'0' }}</span>
          条，导入失败
          <span class="red">{{ failedList&&failedList.length?failedList.length:'0' }}</span>
          条
        </p>
        <ul class="all-content-info all-statistics-info" v-if="data.failedList&&data.failedList.length">
          <li class="table-header flex-li">
            <p>
              {{ text }}
            </p>
            <p class="table-border-p-left">
              失败原因
            </p>
          </li>
          <div class="statistics-scroll EmergencyContact">
            <li v-for="(item,index) in data.failedList" :key="index" class="flex-li content-info-li">
              <p v-if="$store.state.user.sysSelectedEn=='batterySys'">
                {{ item.key }}
              </p>
              <p v-else>
                {{ item[keys] }}
              </p>
              <p class="table-border-p-left">
                {{ item.message }}
              </p>
            </li>
          </div>
        </ul>
        <div v-else style="margin:10px;display:flex;justify-content:center">
          <h2>无失败数据</h2>
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'ResultDialog',
  props: {
    visibles: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    text: {
      type: String,
      default: ''
    },
    keys: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: '无失败信息'
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // isShow: true
    }
  },
  computed: {
    failedList() {
      return this.data.failedList
    },
    successList() {
      return this.data.successList
    }
  },
  watch: {
    visibles(e1) {
			if (e1) {
				console.log("text:",this.text,"keys:",this.keys)
			}
    }
  },
  methods: {
    // 关闭dialog
    closeDialog() {
      this.$emit('close')
      this.$emit('update:visibles', false)
    },
    // 取消
    handleCancel() {
      this.closeDialog()
    },
    // 导出
    handleExport() {
      if (this.data.failedList.length === 0) {
        this.$message.warning({
          message: this.message,
          duration: 2 * 1000
        })
        return false
      }
      const postData = this.data.failedList
      this.$emit('export-fail', postData)
    }
  }
}
</script>

<style lang="scss" scoped>
$border_color: #ebeef5;
p {
  margin: 0;
}
.sim-import-result {
  height: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  .iconfont{
    color: #999;
  }
  .green{
    color: #25ca4e;
  }
  .red{
    color: #ff0000;
  }
}
.all-content-info {
  padding: 0;
  margin: 0;
  .flex-li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    p {
      flex: 1;
      text-align-last: center;
    }
    .table-border-p-left {
      border-left: 1px solid $border_color
    }
  }
  .statistics-scroll {
    overflow: auto;
    max-height: calc( 65vh - 60px );
  }
  .content-info-li {
    font-size: 13px;
    color: #999;
    border-bottom: 1px solid $border_color;
    border-left: 1px solid $border_color;
    border-right: 1px solid $border_color;
    p {
      padding: 10px 25px;
    }
  }
  .table-header {
    height: 35px;
    // background: #f5f4f7;
    font-size: 12px;
    border: 1px solid $border_color;
    p {
      height: 35px;
      line-height: 35px;
      // padding: 10px 0;
    }
  }
}

</style>
