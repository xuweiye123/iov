<template>
  <app-drawer
    :visibles="visibles"
    :title="!isEdit ? '新增配置号信息' : '编辑配置号信息'"
    :icon="!isEdit ? 'icon-dialog-add' : 'icon-dialog-update'"
    :width="'650px'"
    @close-drawer="closeDrawer"
    @ok-drawer="submitForm"
    :isOkButLoading="loading"
  >
    <div slot="drawerContent" class="drawer-content">
      <el-row
        type="flex"
        justify="center"
        align="top"
        style="margin-right: 65px;"
      >
        <el-col :span="20">
          <el-form
            ref="formTop1"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
            label-width="110px"
          >
            <el-form-item label="配置号：" prop="configNum" required>
              <el-input
                v-model="formInfo.configNum"
                placeholder="请输入配置号"
                maxlength="30"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="20">
          <el-form
            ref="formTop2"
            size="mini"
            :model="formInfo"
            :rules="rules"
            :label-position="'right'"
            label-width="110px"
          >
            <el-form-item label="车型公告号：" prop="productModel" required>
              <el-select
                v-model="formInfo.productModel"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
        align="top"
        style="margin-right: 65px;"
        v-for="(item, index) in formInfo.packSpecRequests"
        :key="index"
      >
        <el-col :span="20">
          <el-form
            :ref="`formBot1_${index}`"
            size="mini"
            :model="formInfo.packSpecRequests[index]"
            :label-position="'right'"
            label-width="110px"
          >
            <el-form-item
              label="电池包厂商规格："
              prop="packSpec"
              :rules="[
                {
                  required: true,
                  trigger: 'blur',
                  message: '请选择电池包厂商规格',
                },
                { trigger: 'change', message: '请选择电池包厂商规格' },
              ]"
            >
              <el-select
                v-model="formInfo.packSpecRequests[index].packSpec"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in packageList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="20">
          <el-form
            :ref="`formBot2_${index}`"
            size="mini"
            :model="formInfo.packSpecRequests[index]"
            :label-position="'right'"
            label-width="110px"
          >
            <el-form-item
              label="规格对应个体数："
              prop="packNum"
              :rules="[
                {
                  required: true,
                  trigger: 'blur',
                  message: '请输入规格对应个体数',
                },
                { trigger: 'change', message: '请输入规格对应个体数' },
              ]"
            >
              <el-input
                v-model="formInfo.packSpecRequests[index].packNum"
                type="number"
                onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                oninput="if(value.length>20)value=value.slice(0,20)"
                placeholder="请输入规格对应个体数"
                clearable
              />
              <div v-if="index != 0">
                <i
                  class="el-icon-delete clolos3"
                  @click="deleteCell(index)"
                ></i>
              </div>
              <div v-if="index == 0">
                <i class="el-icon-plus clolos1" @click="addAffair()"></i>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { checkFormRule } from "@/mixins/validateOne";
// request
import {
  configureAdd,
  getPackage,
  getProductModule
} from "@/api/batterySys/configure";
//组件
export default {
  name: "addUpdateDrawer",
  mixins: [partialForm,checkFormRule],
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
    return {
      affair: [1],
      numberindex: 0,
      formInfo: { packSpecRequests: [{}] },
      loading: false,
      rules: {
        configNum: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入配置号",
            formObjName:'formInfo'
          },
        ],
        productModel: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请选择车型公告号",
            formObjName:'formInfo'
          },
        ],
        packNum: [
           {
            required: true,
            trigger: ["blur", "change"],
            validator: this.validInput,
            tips: "请输入规格对应个体数",
            formObjName:'formInfo'
          },
        ],
      },
      packageList: [],
      productList: [],
    };
  },
  watch: {
    visibles: {
      handler(el) {
        if (el) {
        }
      },
      immediate: true,
    },
  },
  created() {
    //获取电池包规格
    getPackage().then(({ data }) => {
      if (data.code === 0) {
        this.packageList = data.data || [];
      }
    });
    //获取车型公告号
    getProductModule().then(({ data }) => {
      if (data.code === 0) {
        this.productList = data.data || [];
      }
    });
  },
  mounted() {},
  methods: {
    //增加模块
    addAffair() {
      this.formInfo.packSpecRequests.push({
        packSpec: "",
        packNum: "",
      });
      this.numberindex++;
    },
    deleteCell(index) {
      this.formInfo.packSpecRequests.splice(index, 1);
      this.numberindex--;
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.formInfo = { packSpecRequests: [{}] };
      this.numberindex = 0;
    },
    // 点击取消
    headleCancel() {
      this.closeDrawer();
    },
    // 新增
    _proAdd(postData) {
      this.loading = true;
      configureAdd(postData)
        .then(({ data }) => {
          this.loading = false;
          if (data.code === 0) {
            this.$message.success({
              message: "新增成功",
              duration: 2 * 1000,
            });
            this.$emit("add-complete");
            this.closeDrawer();
          } else {
            this.$message.error({
              message: data.message,
              duration: 2 * 1000,
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 点击提交
    submitForm() {
      const checkTop1 = this.checkForm({
        formName: "formTop1",
        formList: ["configNum"],
      });
      const checkTop2 = this.checkForm({
        formName: "formTop2",
        formList: ["productModel"],
      });
      //   const checkBot1 = this.checkForm({
      //   formName: "formBot1",
      //   formList: ["packSpec"],
      // })
      //  const checkBot2 = this.checkForm({
      //   formName: "formBot2",
      //   formList: ["packNum"],
      // })

      let selectname = [];
      let pagenumber = 0;

      for (let i = 0; i <= this.numberindex; i++) {
        this.$refs["formBot1_" + i][0].validate((valid) => {
          console.log(valid,'validvalid')
            if (!valid) {
              pagenumber++
            }
            })
        this.$refs["formBot2_" + i][0].validate((valid) => {
            if (!valid) {
              pagenumber++
            }
            })
      //   if (
      //     this.formInfo.packSpecRequests[i].packSpec === "" ||
      //     this.formInfo.packSpecRequests[i].packSpec === undefined
      //   ) {
      //     this.$message.error({
      //       message: "请选择电池包厂商规格",
      //       duration: 2 * 1000,
      //     });
      //     pagenumber++;
      //     return;
      //   }
      //   if (
      //     this.formInfo.packSpecRequests[i].packNum === "" ||
      //     this.formInfo.packSpecRequests[i].packNum === undefined
      //   ) {
      //     this.$message.error({
      //       message: "请输入规格对应个体数",
      //       duration: 2 * 1000,
      //     });
      //     pagenumber++;
      //     return;
      //   }
        
        selectname.push(this.formInfo.packSpecRequests[i].packSpec);
      }
       if (!checkTop1 || !checkTop2 || pagenumber != 0 ) {
        return;
       }
       selectname = [...new Set(selectname)]
       if(selectname.length<this.formInfo.packSpecRequests.length){
          this.$message.error({
            message: "含重复电池包厂商规格，无法新增",
            duration: 2 * 1000,
          });
          return;
       }
     
      const postData = this.formInfo;

      if (!this.isEdit) {
        this._proAdd(postData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clolos1 {
  //增加按钮样式
  width: 22px;
  height: 22px;
  cursor: pointer;
  line-height: 24px;
  padding: 0px 4.5px;
  border-radius: 15px;
  color: #fff;
  z-index: 1;
  position: absolute;
  background: #468AFF;
  top: 13%;
  left: 105%;
}
.clolos3 {
  //删除按钮样式
  cursor: pointer;
  width: 22px;
  height: 22px;
  background: red;
  line-height: 24px;
  padding: 0 5px;
  border-radius: 15px;
  color: #fff;
  position: absolute;
  top: 11%;
  left: 105%;
}
.car_title {
  color: #409eff;
  padding: 0 0 10px 0;
  margin-top: 0;
  font-size: 14px !important;
  border-bottom: 2px solid #e2f1ff;
}

.drawer-content {
  overflow-y: auto;
  max-height: calc(100vh - 160px);
  &::-webkit-scrollbar {
    width: 6px;
  }
}

.drawer-content::-webkit-scrollbar-track {
  background-color: #fff;
}
.drawer-content::-webkit-scrollbar-thumb {
  background-color: #e8e8e8;
  border-radius: 4px !important;
}
.drawer-content::-webkit-scrollbar-corner {
  background-color: #fff;
  border-radius: 5px;
}
</style>
