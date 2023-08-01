<template>
  <div class="app-404">
    <el-row :gutter="10" type="flex" align="middle" class="app-404-center">
      <el-col :span="24">
        <img style="height:30vh"  :src="require(`@/assets/images/theme/${$store.state.theme.activeName}/400.png`)" alt="">
      </el-col>
      <el-col :span="24" class="textButton">
        <p style="font-size:20px!important;margin:15px auto;color:#000">
          {{ $t('notFound.error') }}
        </p>
      </el-col> 
      <el-col :span="6" class="textButton">
        <el-button type="primary" @click="toHome">
          {{ $store.state.user.sysSelectedEn=='fastEntry'? $t('notFound.backFastEntry'):$t('notFound.backHome')}}
        </el-button>    
      </el-col> 
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Page404',
  created() {
    this.$store.dispatch('delAllViews')
  },
  methods: {
    toHome() {
      if(this.$store.state.user.sysSelectedEn=='fastEntry'){
         this.$router.push({ path: "/fastEntry" });
      }else{
        this.$router.push({ path: "/home" });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
h1,p{
  margin: 0;
}
  .app-404{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .app-404-center{
      display: flex;
      flex-direction:column;
      .textButton{
        display: flex;
      }
    }
  }
</style>
