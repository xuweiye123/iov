<!--
 * @Descripttion: 
 * @version: Do not Edit
 * @Author: shimh
 * @Date: 2020-12-19 15:46:01
 * @LastEditors: shimh
 * @LastEditTime: 2021-03-22 15:00:33
-->
<template>
  <el-dialog
    v-if="visibles"
    v-el-drag-dialog
    :visible.sync="visibles"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :show-close="false"
    center
    width="45%"
    append-to-body
  >
    <dialog-header
      slot="title"
      :title="title"
      @close="closeDialog"
    />
    <vue-linetitle>
      <el-alert
        class="mb-lg"
        title="使用该功能前，请下载模板进行导入。"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row
        type="flex"
        justify="center"
        align="top"
      >
        <el-col :span="24">
          <el-form
            ref="form"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
          >
            <el-form-item label="">
          <el-link href="/api/fileStatics/ImportCar.xlsx" download="车辆信息导入模板.xlsx">
                <el-button>
                  <i class="iconfont icon-download mr-xs"></i>下载表单模板
                </el-button>
              </el-link>
            </el-form-item>
            <el-form-item
              label="选择文件："
              prop="upgradeFile"
            >
                <!-- <upload-file
                  ref="upload"
                  action="/api/car/importCar"
                  :append-to-body="true"
                  accept=".xls,.xlsx"
                  :size="9"
                  :unit="'GB'"
                  @upload-success="uploadFile"
                  @upload-remove="removeFile"
                >
                </upload-file> -->

                  <el-upload
                      class="upload"
                      action="fakeaction"
                      accept=".xls, .xlsx"
                      :file-list="fileList"
                      :before-upload="beforeUpload"
                      :http-request="httpRequest"
                      :on-success="uploadFile"
                      :on-remove="removeFile"
                      :limit="1"                                
                  >
                      <el-button
                          v-waves
                          v-preventReClick
                          size="small"                                    
                          v-if="!isUp"
                      >
                      <i class="iconfont icon-yunshangchuan"></i>
                          请选择导入文件
                      </el-button>
                  </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="isParsing">
        <el-alert
          v-if="isParsing"
          :title="errorInfo===1?'解析成功':errorInfo===2?'解析详情':'解析失败'"
          :closable="false"
          :type="errorInfo===1?'success':errorInfo===2?'info':'error'"
          show-icon
        >
          <template slot>
            <div class="wrap-content">
              <!-- <el-button
                v-if="listError.length>0"
                size="mini"
                @click="exportFc"
              >
                <i class="iconfont icon-icon_download mr-5"></i>下载信息
              </el-button> -->
              <div class="wrap-text" v-if="isUpOk">
                <p>
                  成功导入
                  <a @click="exportSuccess"> {{ successList.length }} </a>
                  辆车；
                  失败
                  <a style="color:red;" @click="exportError">{{ listError.length }}</a>
                  辆
                  {{listError.length>0?'，':'。'}}
                  <span v-if=" listError.length > 0 ">可导出失败车辆。</span>
                </p>
                <!-- <ul class="errorList" v-if="errorInfo!=1">
                  <li>
                    <i v-if="errorInfo===2" class="el-icon-error" style="color:red"></i>
                    错误信息如下：（可下载）
                  </li>
                  <li
                    v-for="(item,index) in listError"
                    :key="index"
                  >
                    {{index+1}}、{{item.field}} {{item.remark}}
                  </li>
                </ul> -->
              </div>
            </div>
          </template>
        </el-alert>
      </div>
    </vue-linetitle>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        v-waves
        @click="handlecancle"
      >取消</el-button>
      <el-button
        :loading="loading"
        v-waves
        type="primary"
        @click="handleSubmit"
        :disabled="successList.length===0"
      >确定</el-button>
    </span>
    <div
      v-if="isParsingLoading"
      class="load-box"
    >
      <i class="iconfont icon-svgupdate"></i>
      解析中
    </div>
  </el-dialog>

</template>

<script>
// request
// import { exportCheckFailedCarVin } from "@/api/car/carList";
// import{importCar,saveCar} from "@/api/car/carList"
import { uploadDownTemplate,exportErrorCar,exportSuccessCar } from "@/api/commont";
// 混入
import { partialForm } from "@/mixins/partialForm";
// import uploadFile from "@/components/uploadFile";
export default {
    name: "importCar",
    mixins: [partialForm],
    components: {
      // uploadFile,
    },
    props: {
        visibles: {
            type: Boolean,
            default: false,
        },
        title:{
          type: String,
          default:"批量导入",
        }
        // isImport: {
        //     type: Boolean,
        //     default: false,
        // },
        // vinListArr: {
        //     type: Array,
        //     default: () => ([]),
        // },
    },
  computed: {
    token() {
        return this.$store.getters.token;
    },
  },
  data() {
    // 车辆文件
    const upgradeFile = (rule, value, cb) => {
        console.log('rule,value,cb',rule,value,cb);
        if (!value) {
            return cb(new Error("请导入车辆文件"));
        }
    };
    return {
        loading: false,
        formInfo: {
            upgradeFile: "",
        },
        fileList:[],
        isUp:false,//
        isUpOk:false,
        rules: {
          upgradeFile: [
            {
                required: true,
                trigger: ["blur", "change"],
                validator: upgradeFile,
            },
          ],
        },
        isParsing: false /* 是否解析 */,
        errorInfo: 1 /* 解析是否成功1:完全成功；2：成功失败；3：失败 */,
        importInfo: {} /* 解析数据 */,
        listError: [] /* 错误信息 */,
        successList: [] /* 解析成功的vin List数据 */,
        isParsingLoading: false /*解析中 */,
    };
  },
  watch: {
    visibles: {
        handler(e1) {
            if (e1) {
                // this.formInfo = { ...this.data };
                this.isParsing = false;
            }
        },
    },
  },
  created() {},
  methods: {
    /**
     * @name: 模板下载
     * @param {*}
     */
    downModel(){
      const formData = new FormData();
      formData.append('name', 'carListExcel.xlsx');
      uploadDownTemplate(formData);
    },
    // 上传之前钩子
    beforeUpload(file){
          const extension = file.name.split('.')[1];
            const isType = (extension==='xls'||extension === 'xlsx');
            if (!isType) {
            this.$message.warning('上传模板只能是 xls、xlsx格式！');
            }
            this.isUp = isType;
            return isType; 
    },
    httpRequest(params){
      console.log('params: ', params);
       const file = params.file;
        // 根据后台需求数据格式
            const form = new FormData();
            // 文件对象
            form.append("file", file);
            // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
            // form.append("brand", this.selectedBrand);
            // 项目封装的请求方法，下面做简单介绍
            importCar(form)
                .then(({ data }) => {
                if(data.code===0){
                    console.log('hahahaha',data.data);
                    this.successList=data.data.successList;
                    this.listError = data.data.failedList;
                    this.isUpOk = true;
                    this.isParsing = true;
                }
                })
                .catch(() => {
                
                }); 
    },
    /**
     * @name: 文件上传成功
     * @param {*}
     */
    uploadFile(response, file,fileList) {
      console.log("文件上传成功",response, file,fileList);
      this.formInfo.upgradeFile = file;
      console.log(this.formInfo.upgradeFile);
      this.$set(this.formInfo, "file", this.formInfo.upgradeFile);
      this.isParsingLoading = false;
      this.isParsing = true;
      this.listError = response.failedList;
      this.successList = response.successList;
      this.importInfo = response;
      this.fileList = fileList;
      if (
        response.successList === null ||
        response.successList.length === 0
      ) {
        console.log("失败");
        this.errorInfo = 3;
      } else {
        console.log("成功");
        if(this.listError.length>0){
          this.errorInfo = 2;
        }else{
          this.errorInfo = 1;
        }
      }
         
    },
    // 导出成功车辆
    exportSuccess(){
      console.log('this.successList: ', this.successList);
      if(this.successList.length>0){
        exportSuccessCar(this.successList);
      }
    },
    // 导出失败车辆
    exportError(){
      console.log('this.listError: ', this.listError);
      if(this.listError.length>0){
      exportErrorCar(this.listError);
      }
    },
    /**
     * @name: 文件移除
     * @param {*}
     */
    removeFile(file,fileList) {
      console.log('文件移除',file)
      this.formInfo.upgradeFile = "";
      this.successList = [];
      this.listError = [];
      this.fileList = [];
      this.isUp=false;
      this.isUpOk=false;
      this.isParsing = false;
    },
    /**
     * @name: 关闭dialog
     * @param {*}
     */
    closeDialog() {
      this.fileList = [];
      this.successList = [];
      this.listError = [];
      this.formInfo.upgradeFile = "";
      this.isUp=false;
      this.isUpOk=false;
      this.isParsing = false;
      this.$emit("update:visibles", false);
    },
    /**
     * @name: 点击取消
     * @param {*}
     */
    handlecancle() {
      // this.$emit("update:isImport",false);
      this.closeDialog();
    },
    /**
     * @name: 点击确定
     * @param {*}
     */
    handleSubmit() {
      this.loading = true;
      saveCar(this.successList)
      .then(({data}) =>{
        this.loading = false;
        if(data.code===0){
          this.$message.success({
              message: "导入成功",
              duration: 2 * 1000,
            });
        }
      }).catch(()=>{
        this.loading = false;
      })
     
      this.closeDialog();
    },
    /**
     * @name: 导出错误车辆
     * @param {*}
     */
    // exportFc(){
    //   exportCheckFailedCarVin(this.listError)
    // }
  },
};
</script>
<style lang="scss">
.isParsing {
  .el-alert.is-light .el-alert__content {
    padding: 3px 0 0 30px;
    width: 100%;
  }
  .wrap-content {
    .el-button {
      position: absolute;
      right: 15px;
      top: 7px;
    }
    .wrap-text {
      max-height: 108px;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      ul {
        margin: 0;
        padding: 0;
        li {
          line-height: 20px;
          margin-bottom: 3px;
        }
      }
    }
  }
}
.load-box {
  z-index: 99;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -40px;
  margin-top: -30px;
  width: 80px;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
  border-radius: 3px;
  i {
    display: block;
    font-size: 24px;
    color: #fff;
    margin: 5px 0;
    animation: turn 1s linear infinite;
  }
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
