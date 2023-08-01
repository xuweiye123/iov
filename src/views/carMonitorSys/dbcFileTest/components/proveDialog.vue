<template>
  <app-dialog
    :visibles="visibles"
    :title="'审核'"
    @close-dialog="closeDialog"
    :isFooter="false"
    width="35%"
    class="ordinary"
  >
    <div slot="formContent">
      <div>国标参数有 {{ formInfo.gbNoCount }} 项不符合，请审核！</div>
    <br>
      <span slot="footerButton"  class="dialog-footer">
        <el-button v-waves :disabled="loading"  @click="handleSubmit(0)">不符合</el-button>
        <el-button v-waves :disabled="loading" type="primary" @click="handleSubmit(1)">符合</el-button>
      </span>
    </div>
  </app-dialog>
</template>

<script>
// 混入
import { partialForm } from '@/mixins/partialForm'
// request
import { approvalDbc } from '@/api/carMonitorSys/dbcFileTest'

export default {
  name: 'ProveDialog',
  mixins: [partialForm],
  props: {
    visibles: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formInfo: {},
      loading: false,
    }
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = { ...this.data }
      }
    }
  },
  created() {

  },
  methods: {
    // 关闭
    closeDialog() {
      this.$emit('update:visibles', false)
    },
    // 审核
    handleSubmit(status) {
      const postData = {
        status: status,
        dbcId: this.formInfo.dbcId,
        allCount: this.formInfo.gbAllCount,
        noCount: this.formInfo.gbNoCount
      }
      this.loading = true;
      approvalDbc(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: '审核成功',
            duration: 2 * 1000
          })
          this.$emit('prove-complete')
          this.closeDialog()
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
</style>
