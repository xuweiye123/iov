<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增审核信息' : '编辑审核信息'"
    width="55%"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent">
      <el-form
        ref="formCenter"
        :rules="rules"
        :model="formInfo"
        :label-position="'right'"
        label-width="100px"
      >
        <el-row :gutter="10" style="padding:10px 5px;">
          <el-col :span="12">
            <el-form-item label="VIN码：" prop="vinNo">
              <el-input
                v-model.trim="formInfo.vinNo"
                clearable
                placeholder="请点击选择"
                :readonly="true"
                class="pointerInput"
                @focus="showVINList"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="系统TBOXSN：" prop="oldBarCode">
              <el-input
                v-model.trim="formInfo.oldBarCode"
                clearable
                placeholder="请输入系统TBOXSN"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统ICCID：" prop="oldIccidOne">
              <el-input
                v-model.trim="formInfo.oldIccidOne"
                clearable
                :readonly="true"
                placeholder="请输入系统ICCID"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="原终端编号：" prop="oldTerminalCode">
              <el-input
                v-model.trim="formInfo.oldTerminalCode"
                clearable
                placeholder="请选择VIN码"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原ICCID1：" prop="oldIccidOne">
              <el-input
                v-model.trim="formInfo.oldIccidOne"
                clearable
                placeholder="请选择VIN码"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原ICCID2：" prop="oldIccidTwo">
              <el-input
                v-model.trim="formInfo.oldIccidTwo"
                clearable
                placeholder="请选择VIN码"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新TBOXSN：" prop="newBarCode">
              <el-input
                v-model="formInfo.newBarCode"
                clearable
                placeholder="请点击选择"
                :readonly="true"
                class="pointerInput"
                @focus="showTerminalList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新终端编号：" prop="newTerminalCode">
              <el-input
                v-model.trim="formInfo.newTerminalCode"
                clearable
                placeholder="请选择新TBOXSN"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新ICCID1：" prop="newIccidOne">
              <el-input
                v-model="formInfo.newIccidOne"
                clearable
                :readonly="true"
                placeholder="请选择新TBOXSN"
              />
              <!--  class="pointerInput"
                @focus="showICCIDList"
                placeholder="请点击选择" -->
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="新ICCID2：" prop="newIccidTwo">
              <el-input
                v-model="formInfo.newIccidTwo"
                clearable
                :readonly="true"
                placeholder="请选择新TBOXSN"
              />
              <!-- class="pointerInput"
                @focus="showICCIDList(2)"
                placeholder="请点击选择" -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务站名称：" prop="stationNameId">
              <el-select
                v-model="formInfo.stationNameId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in serviceStationList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        
          <el-col :span="24">
            <el-form-item label="更换原因：" prop="remark">
              <el-input
                v-model.trim="formInfo.remark"
                :rows="6"
                :autosize="{ minRows: 3, maxRows: 3 }"
                resize="none"
                placeholder="请输入更换原因"
                type="textarea"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="upload-btn">
        <el-upload
          ref="upload"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeupload"
          :headers="{ Authorization: token }"
          :show-file-list="true"
          :on-change="fileChange"
          :on-success="fileSuccess"
          :on-error="fileError"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          :file-list="fileList"
          :auto-upload="true"
          :multiple="false"
          action="/api/vehicle/terminalAlterAudit/upload"
          class="upload-demo-img"
          accept="image/jpeg,image/jpg,image/png,image/gif"
        >
          <el-button
            :loading="loadingButton"
            slot="trigger"
            size="small"
            type="primary"
          >
            上传图片<i class="el-icon-upload el-icon--right" />
          </el-button>
          <div slot="tip" class="el-upload__tip el-demo-tip">
            注：只能上传jpg/jpeg/png/gif文件，且不超过3M，至少上传2张图片。
          </div>
        </el-upload>
      </div>
      <!-- 选择ICCID dialog弹窗 -->
      <select-iccid-dialog
        :type="type"
        :visibles.sync="selectIccidVisibles"
        @dblclick-select-iccid="selectICCID"
        @dblclick-select-iccid2="selectICCID2"
      />
      <!-- 选择终端 dialog弹窗 -->
      <select-terminal-dialog
        :visibles.sync="selectTerminalVisibles"
        @dblclick-select-terminal="selectTerminal"
      />
      <!-- 选择VIN码 dialog弹窗 -->
      <select-Vin-dialog
        :visibles.sync="selectVinVisibles"
        @dblclick-select-vin="selectVIN"
      />
      <!-- 图片预览 -->
      <app-dialog
        :visibles="dialogVisible"
        :title="'预览'"
        width="50%"
        @close-dialog="dialogVisible = false"
        :isFooter="false"
      >
        <div slot="formContent">
          <el-scrollbar
            wrap-class="default-scrollbar__wrap"
            style="height:65vh"
          >
            <div
              style="display: flex;justify-content: center;align-items: center;height:65vh"
            >
              <img :src="dialogImageUrl" alt="" />
            </div>
          </el-scrollbar>
        </div>
      </app-dialog>
    </div>
  </app-drawer>
</template>
<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import { create, update, getImgList } from "@/api/carManageSys/terminalReplace";
// import { getServiceStationList } from "@/api/carManageSys/commont";
// 组件
import selectIccidDialog from "./selectIccidDialog";
import selectTerminalDialog from "./selectTerminalDialog";
import selectVinDialog from "./selectVinDialog";
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm, checkFormRule,getDropList],
  components: {
    selectIccidDialog,
    selectVinDialog,
    selectTerminalDialog,
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => [],
    },
  },
  data() {
    const validateIccid = (rule, value, cb) => {
			if (value && (value==this.formInfo.newIccidTwo)) {
				return cb(new Error("新ICCID1和新ICCID2不能一样"));
			}
		};

		const validateIccid2 = (rule, value, cb) => {
			if (value && (value==this.formInfo.newIccidOne)) {
				return cb(new Error("新ICCID2和新ICCID1不能一样"));
			}
		};
    return {
      loading: false,
      loadingButton: false,
      formInfo: {
        vinNo: "",
        oldBarCode: "",
        oldIccidOne: "",
        oldIccidTwo:"",
        oldTerminalCode: "",
        stationNameId: "",
        newBarCode: "",
        newTerminalCode: "",
        newIccidOne: "",
        remark: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      srcList: [],
      serviceStationList: [
        // { label:"智能车云",value:"智能车云" }
      ], // 服务站
      // 下拉
      dropList:[
        { postData:{dicCode:1014},key:'serviceStationList' }
      ],
      type:0,
      selectIccidVisibles: false,
      selectTerminalVisibles: false,
      selectVinVisibles: false, // 选择vin码页面
      fileList: [],
      imgs: [],
      uid: "",
      tableRow: {},
      selectSimVisibles: false,
      rules: {
        vinNo: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择VIN码",
            formObjName: "formInfo",
          },
        ],
        stationNameId: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择服务站名称",
            formObjName: "formInfo",
          },
        ],
        newBarCode: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择新TBOXSN",
            formObjName: "formInfo",
          },
        ],
        // newTerminalCode: [
        //   {
        //     required: true,
        //     trigger: ["blur", "change"],
        //     validator: this.validInput,
        //     tips: "请选择新终端编号",
        //     formObjName: "formInfo",
        //   },
        // ],
        // newIccidOne: [
				// 	{
				// 		required: false,
				// 		trigger: ["blur", "change"],
				// 		validator: validateIccid,
				// 	},
				// ],
				// newIccidTwo: [
				// 	{
				// 		required: false,
				// 		trigger: ["blur", "change"],
				// 		validator: validateIccid2,
				// 	},
				// ],
      },
    };
  },
  computed: {
    token() {
      return this.$store.getters.token;
    },
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          // 数据字典下拉
          this.getDropList(this.dropList);
          
          this.formInfo = { ...this.data };
          if (this.isEdit) {
            this.getImgList();
          }
          //  else {
          //   this.fileList = []
          // }

        }
      },
    },
  },
  created() {},
  methods: {
    getImgList() {
      const postData = {
        id: this.formInfo.terminalAlterAuditId,
      };
      getImgList(postData).then(({ data }) => {
        if (data.code === 0) {
          const arry = [];
          for (var i = 0; i < data.data.length; i++) {
            const obj = {
              name: data.data[i].fileName,
              url: data.data[i].filePath,
              fileId: data.data[i].id,
            };
            arry.push(obj);
          }
          this.fileList = arry;
          console.log(this.fileList);
        }
      });
    },
    showICCIDList(e) {
      if(e==2){
				this.type=2
			}else{
				this.type=0
			}
      this.selectIccidVisibles = true;
    },
    selectICCID(item) {
      this.$set(this.formInfo, "newIccidOne", item.iccid);
    },
    selectICCID2(item) {
      this.$set(this.formInfo, "newIccidTwo", item.iccid);
    },
    showTerminalList() {
      this.selectTerminalVisibles = true;
    },
    selectTerminal(item) {
      this.$set(this.formInfo, "newBarCode", item.barCode);
      this.$set(this.formInfo, "newTerminalCode", item.terminalCode);
      this.$set(this.formInfo, "newIccidOne", item.iccidOne);
      this.$set(this.formInfo, "newIccidTwo", item.iccidTwo);
    },
    showVINList() {
      this.selectVinVisibles = true;
    },
    selectVIN(item) {
      this.$set(this.formInfo, "oldIccidOne", item.iccidOne);
      this.$set(this.formInfo, "oldIccidTwo", item.iccidTwo);
      this.$set(this.formInfo, "vinNo", item.vinNo);
      this.$set(this.formInfo, "oldBarCode", item.barCode);
      this.$set(this.formInfo, "oldTerminalCode", item.terminalCode);
      this.formInfo.vinNoTotal=item.vinNoTotal
      console.log(this.formInfo.vinNoTotal,"vinNoTotal")
    },
    // 上传之前得验证
    beforeupload(file) {
      // // console.log(file,123)
      // // let arr = [".jpeg", ".png", ".jpg", ".gif"];
      // let arr = ["jpeg", "png", "jpg", "gif"];
      // let flag = false;
      // arr.forEach((item) => {
      //   // console.log(file.name.split(".").pop(),123)
      //   if (file.name.split(".").pop()==item) {
      //     flag = true;
      //     return;
      //   }
      // });
      
      // if (!flag) {
      //   this.$message.warning("请上传正确的图片格式！");
      //   return false;
      // }
      if (file.size / 1024 / 1024 > 3) {
        this.$message.warning("上传文件大小不超过3M，请重新上传!");
        return false;
      }
     
      if (/\.(jpeg|png|jpg|gif)$/.test(file.name.toLowerCase())) {
        this.uid = file.uid;
      }else{
        this.$message.warning("请上传正确的图片格式！");
        return false;
      }
    },
    // 文件状态改变时触发
    fileChange(file, fileList) {
      // if (file.size / 1024 / 1024 > 3) {
      //   this.$message.warning("上传文件大小不超过3M，请重新上传!")
      //   return
      // }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response ? file.response.data.path : file.url;
      this.srcList[0] = this.dialogImageUrl;
      this.dialogVisible = true;
      // const ViewerDom = document.getElementById('indexSee')
      // const viewer = new Viewer(ViewerDom, {
      //   inline: true
      // })
    },
    // 上传成功钩子
    fileSuccess(response, file, fileListt) {
      this.loadingButton = false;
      if (response.code === 0 && response.data) {
        this.$notify({
          title: "成功",
          message: "文件上传成功",
          type: "success",
          duration: 3000,
        });
      } else {
        // console.log(response,"response.data",file)
        // this.$message.warning(file.name+"：上传失败，请重新上传");
        this.$message.warning({
          message: response.message,
          duration: 2 * 1000,
        });
        let index = 0;
        for (const i in fileListt) {
          if (fileListt[i] == file) {
            index = i;
            break;
          }
        }
        fileListt.splice(index, 1);
      }
      // this.restStatus()
      this.fileList = fileListt;
      // console.log(this.fileList,"this.fileList")
    },
    // 上传失败钩子
    fileError(response, file, fileListt) {
      this.loadingButton = false;
      this.$message.warning({
        message: response.message,
        duration: 2 * 1000,
      });
    },
    handleProgress() {
      this.loadingButton = true;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 关闭dialog
    closeDrawer() {
      this.fileList = [];
      this.formInfo = {};
      this.$emit("update:visibles", false);
    },
    // 新增
    _Add(postData) {
      this.loading = true;
      create(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("add-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 编辑
    _Update(postData) {
      this.loading = true;
      update(postData)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$emit("update-complete");
            this.closeDrawer();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 点击提交
    submitForm() {
      const formcenter = this.checkForm({
        formName: "formCenter",
        formList: ["vinNo", "newBarCode", "stationNameId"],
        // "newTerminalCode",,"newIccidOne","newIccidTwo"
      });
      if (!formcenter) {
        return;
      }
      if (this.fileList === []) {
        return;
      }
      const {
        vinNo,
        terminalAlterAuditId,
        oldBarCode,
        oldTerminalCode,
        stationNameId,
        newBarCode,
        newTerminalCode,
        remark,
        oldIccidOne,
        oldIccidTwo,
        newIccidOne,
        newIccidTwo,
        vinNoTotal
      } = this.formInfo;
      const postData = {
        vinNo:vinNoTotal,
        oldBarCode,
        oldTerminalCode,
        stationNameId,
        newBarCode,
        newTerminalCode,
        remark,
        oldIccidOne,
        oldIccidTwo,
        newIccidOne,
        newIccidTwo,
      };
      for (const k in postData) {
        if (postData[k] === undefined) {
          postData[k] = "";
        }
      }
      const imgsArry = [];
      for (var i = 0; i < this.fileList.length; i++) {
        const obj = {};
        if (this.fileList[i].response) {
          obj.newName = this.fileList[i].response.data.newName;
            obj.path = this.fileList[i].response.data.path;
            obj.fileId = this.fileList[i].response.data.fileId;
        } else {
          obj.newName = this.fileList[i].name;
          obj.path = this.fileList[i].url;
          obj.fileId = this.fileList[i].fileId;
        }
        imgsArry.push(obj);
      }
      postData.imgs = imgsArry;
      if (postData.imgs.length < 2) {
        this.$message.warning({
          message: "请上传不少于2张图片",
          duration: 2 * 1000,
        });
        return;
      }
      if (!this.isEdit) {
        this._Add(postData);
      } else {
        postData.id = terminalAlterAuditId;
        this._Update(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-btn {
  padding-left: 20px;
  .el-upload {
    text-align: left !important;
  }
}

.upload-list-box {
  padding: 0;
  li {
    line-height: 25px;
    border-bottom: 1px solid #dcdfe6;
  }
}
.upload-demo-img {
  position: relative;
  padding-bottom: 10px;
}
.el-demo-tip {
  margin: 0;
  line-height: 32px;
  position: absolute;
  top: 0;
  right: 0;
  color: #ff0000 !important;
}
</style>
