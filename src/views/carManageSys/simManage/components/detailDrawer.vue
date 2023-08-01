<template>
  <app-drawer
    :visibles="visibles"
    :title="'流量数据信息'"
    width="47%"
    @close-drawer="closeDrawer"
		:wrapperClosable="true"
    :isDrawerFoot="false"
    :loading="loading"
  >
    <div slot="drawerContent">
      <div class="improve-default clearfix">
        <app-item-pance
          :list="list"
          :number="1"
          :left-width="'150'"
        />
      </div>
    </div>
  </app-drawer>
</template>

<script>
// request
import { getDevice } from "@/api/carManageSys/simManage";

import AppItemPance from '@/components/itemPance'

export default {
  doNotInit: true,
  name: "detailDrawer",
  components: { AppItemPance },
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
      formInfo: { },
      list: [],
      loading:false
    };
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.list = [
          { name: '公网用量限额', value: '-' },
          { name: '公网数据流量', value: '-' },
          { name: '私网数据流量', value: '-' },
          { name: '公网剩余数据流量', value: '-' },
        ]
        this.listLoad()
      }
    }
  },
  mounted() {},
  methods: {
    
    // 判断是否选中
    tableRowIsSlect() {
      const { $index } = this.tableRow;
      if ($index === undefined) {
        return false;
      } else {
        return true;
      }
    },
    // 加载数据
    listLoad() {
      // if (!this.visibles) {
      //   return
      // }
      let params={
        type:4,
        logicType:1,
        logicId:this.data.iccid,
        simId:this.data.simId
      }
      this.loading = true;
      getDevice(params)
        .then(({ data }) => {
          if (data.code === 0) {
            this.formInfo = data.data;
            this.list = [
              { name: '公网剩余数据流量', value: this.formInfo.publicDataRemainder?this.formInfo.publicDataRemainder:'-' },
              { name: '公网数据流量', value: this.formInfo.publicDataUsage?this.formInfo.publicDataUsage:'-' },
              { name: '公网用量限额', value: this.formInfo.publicDataUsageLimit?this.formInfo.publicDataUsageLimit:'-' },
              { name: '私网数据流量', value: this.formInfo.privateDataUsage?this.formInfo.privateDataUsage:'-' },       
            ]
            this.$emit("detail-complete");
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      },
    // 关闭
    closeDrawer() {
      this.list = [];
      this.formInfo={};
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped lang="scss">

</style>
