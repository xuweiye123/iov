<template>
  <div class="app-city-picker">
    <el-row :gutter="10" type="flex" justify="start" align="middle">
      <el-col :span="8">
        <el-select
          class="inputBox"
          v-model="provinceId"
          placeholder="省"
          filterable
          clearable
          @change="pickerChange($event, 0)"
        >
          <el-option
            v-for="(item, index) in provinceList"
            :key="index"
            :label="item.provinceName"
            :value="item.provinceId"
          />
        </el-select>
      </el-col>
      <span>-</span>
      <el-col :span="8" type="flex" justify="start" align="middle">
        <el-select
          class="inputBox"
          v-model="cityId"
          placeholder="市"
          filterable
          clearable
          @change="pickerChange($event, 1)"
          @clear="clearValue(1)"
        >
          <el-option
            v-for="(item, index) in cityList"
            :key="index"
            :label="item.cityName"
            :value="item.cityId"
          />
        </el-select>
      </el-col>
      <span>-</span>
      <el-col :span="8">
        <el-select
          class="inputBox"
          v-model="distinctId"
          placeholder="区"
          filterable
          clearable
          @change="pickerChange($event, 2)"
          @clear="clearValue(2)"
        >
          <el-option
            v-for="(item, index) in distinctList"
            :key="index"
            :label="item.distinctName"
            :value="item.distinctId"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProvinceList, getCityList, getDistinctList } from "@/api/commont";
export default {
  name: "AppCityPicker",
  props: {
    isData: {
      type: Boolean,
      default: false,
    },
    // 设置默认数据
    defaultCity: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 省份列表
      provinceId: "",
      provinceList: [],
      // 城市列表
      cityId: "",
      cityList: [],
      // 区列表
      distinctId: "",
      distinctList: [],
      textEle1: "", // 选中项的文字,
      textEle2: "", // 选中项的文字
      textEle3: "", // 选中项的文字
    };
  },
  watch: {
    isData: {
      handler(e1) {
        if (e1) {
          this._getProvinceList(() => {
            const len = this.defaultCity.length;
            if (len === 1) {
              this.provinceId = this.defaultCity[0];
              this._getCityList(this.provinceId, () => {
                // this.cityId = this.defaultCity[1];
              });
            } else if (len === 2) {
              this.provinceId = this.defaultCity[0];
              this._getCityList(this.provinceId, () => {
                this.cityId = this.defaultCity[1];
                this._getDistinctList(this.cityId, () => {
                  // this.distinctId = this.defaultCity[2];
                });
              });
            }else if(len === 3){
              this.provinceId = this.defaultCity[0];
              this._getCityList(this.provinceId, () => {
                this.cityId = this.defaultCity[1];
                this._getDistinctList(this.cityId, () => {
                  this.distinctId = this.defaultCity[2];
                });
              });
            }
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    // type: 0.省份改变获取市 1.市区改变获取区
    pickerChange(val, type) {
      // this.textEle = ''
      // this.textEle1 = "";
      // this.textEle2 = "";
      // this.textEle3 = "";
      let ssq1 = [];
      let ssq2 = [];
      let ssq3 = [];
      if (type === 0) {
        this.cityId = "";
        this.distinctId = "";
        this._getCityList(val);
        ssq1 = this.provinceList;

        // 省
        let obj1 = {};
        obj1 = ssq1.find((item) => {
          // 这里的userList就是上面遍历的数据源
          return item.provinceId === val; // 筛选出匹配数据
        });
        this.textEle1 = obj1?obj1.provinceName:''; // 我这边的name就是对应label的
      } else if (type === 1) {
        this.distinctId = "";
        this._getDistinctList(val);
        ssq2 = this.cityList;

        // 市
        let obj2 = {};
        obj2 = ssq2.find((item) => {
          // 这里的userList就是上面遍历的数据源
          return item.cityId === val; // 筛选出匹配数据
        });
        // 区
        // console.log(obj2, "sssq", ssq2);
        this.textEle2 = obj2?obj2.cityName:''; // 我这边的name就是对应label的
      } else {
        ssq3 = this.distinctList;

        let obj3 = {};
        obj3 = ssq3.find((item) => {
          // 这里的userList就是上面遍历的数据源
          return item.distinctId === val; // 筛选出匹配数据
        });
        this.textEle3 = obj3?obj3.distinctName:''; // 我这边的name就是对应label的
      }
      // 获取lable文字
      // let obj = {}
      // obj = ssq.find((item) => { // 这里的userList就是上面遍历的数据源
      //   return item.areaid === val// 筛选出匹配数据
      // })
      // this.textEle = obj.areaname// 我这边的name就是对应label的
      // this.$emit('change', this.getValue())

      this.$emit("change", this.getValue());
    },
    // 获取省份
    _getProvinceList(callback) {
      this.provinceList = [];
      // 初始化清空数据
      this.provinceId = "";
      this.cityId = "";
      this.distinctId = "";
      getProvinceList().then(({ data }) => {
        if (data.code === 0) {
          console.log(data.data,555)
          this.provinceList = data.data || [];
          typeof callback === "function" && callback();
        }
      });
    },
    // 获取城市
    _getCityList(provinceId, callback) {
      this.cityList = [];
      if (!provinceId) {
        return;
      }
      getCityList({ provinceId }).then(({ data }) => {
        if (data.code === 0) {
          this.cityList = data.data || [];
          typeof callback === "function" && callback();
        }
      });
    },
    // 获取区列表
    _getDistinctList(cityId, callback) {
      this.distinctList = [];
      if (!cityId) {
        return;
      }
      getDistinctList({ cityId }).then(({ data }) => {
        if (data.code === 0) {
          this.distinctList = data.data || [];
          typeof callback === "function" && callback();
        }
      });
    },
    // 清除数据
    clearValue(e) {
      if (e === 1) {
        this.cityId = "";
        this.distinctId = "";
        this.textEle2 = "";
        this.textEle3 = "";
      } else if (e === 2) {
        this.distinctId = "";
        this.textEle3 = "";
      } else {
        this.provinceId = "";
        this.cityId = "";
        this.distinctId = "";
        this.textEle1 = "";
        this.textEle2 = "";
        this.textEle3 = "";
      }
    },
    // 返回数据
    getValue() {
      if (this.provinceId && !this.cityId && !this.distinctId) {
        // return [this.provinceId]
        // console.log(111)
        // console.log("this.provinceId:"+this.provinceId,"this.cityId:"+this.cityId,"this.distinctId:"+this.distinctId,"4444",this.textEle1)
        return [["province", this.textEle1], [this.provinceId]];
      }
      if (this.provinceId && this.cityId && !this.distinctId) {
        // return [this.provinceId, this.cityId]
        // console.log(222)
        return [
          ["city", this.textEle2],
          [this.provinceId, this.cityId],
        ];
      }
      if (this.provinceId && this.cityId && this.distinctId) {
        // console.log(333)
        // return [this.provinceId, this.cityId, this.distinctId]
        return [
          ["district", this.textEle3],
          [this.provinceId, this.cityId, this.distinctId],
        ];
      }
      
      return [];
    },
  },
};
</script>
