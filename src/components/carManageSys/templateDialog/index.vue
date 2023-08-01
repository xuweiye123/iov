<template>
  <app-dialog
    :visibles="visibles"
    :title="'下载模板'"
    width="35%"
    top="30vh"
		@close-dialog="closeDialog"
    :isFooter="false"
  >
    <div slot="formContent">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :span="2"></el-col>
        <el-col :span="20">
          <el-form>
            <el-form-item
              label-position="'right'"
              label-width="100px"
              :label="radioObject.label"
            >
              <el-radio-group v-model="radioType" @change="changeRadio">
                <el-radio :label="1">
                  {{ radioObject.value1 }}
                </el-radio>
                <el-radio :label="2">
                  {{ radioObject.value2 }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
      <span slot="footerButton" class="dialog-footer">
        <el-button v-waves @click="closeDialog">取消</el-button>
        <el-button v-waves  type="primary">
          <a :href="templateUrl1" class="textColor"> 
						<i class='iconfont icon-import' style="font-size: 12px !important;margin-right:5px;"></i>
						下载</a
          >
        </el-button>
      </span>
    </div>
  </app-dialog>
</template>

<script>
// 验证是否为excel
import readExcel from "@/utils/readExcel";
// import resultDialog from './resultDialog'
export default {
  name: "templateDialog",
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    radioObject: {
      type: Object,
      default:{}
    },
  },
  data() {
    return {
      radioType: 1,
			templateUrl1:"",
    };
  },
  // components: { resultDialog },
  watch: {},
  methods: {
    changeRadio(e){
			if(e==1){
				this.templateUrl1=this.radioObject.templateUrl
			}else{
        this.templateUrl1=this.radioObject.templateUrl2
			}
		},
    // 关闭
    closeDialog() {
			this.radioType=1
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.import-remark {
  // color: red;
  text-align: center;
  padding-bottom: 20px;
}
</style>
