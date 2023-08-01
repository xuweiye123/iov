<template>
  <div class="app-city-picker">
    <el-row type="flex" justify="start" align="middle">
      <el-col :span="8">
        <el-select
          v-model="provinceId"
          placeholder="省"
          filterable
          clearable
          :disabled="isDisabled"
          @change="pickerChange(arguments[0],0)"
          @clear="clearValue(0)"
        >
          <el-option
            v-for="(item,index) in provinceList"
            :key="index"
            :label="item.provinceName"
            :value="item.provinceId"
          />
        </el-select>
      </el-col>
      <!-- <span>-</span> -->
      <el-col :span="8">
        <el-select
         :disabled="isDisabled"
          v-model="cityId"
          placeholder="市"
          filterable
          clearable
          @change="pickerChange(arguments[0],1)"
          @clear="clearValue(1)"
        >
          <el-option
            v-for="(item,index) in cityList"
            :key="index"
            :label="item.cityName"
            :value="item.cityId"
          />
        </el-select>
      </el-col>
      <!-- <span>-</span> -->
      <el-col :span="8">
        <el-select
          :disabled="isDisabled"
          v-model="distinctId"
          placeholder="区"
          filterable
          clearable
          @change="pickerChange(arguments[0],2)"
          @clear="clearValue(2)"
        >
          <el-option
            v-for="(item,index) in distinctList"
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
import {
  getProvinceList,
  getCityList,
  getDistinctList
} from '@/api/carManageSys/commont'
export default {
  name: 'AppCityPicker',
  props: {
    isData: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 设置默认数据
    defaultCity: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 省份列表
      provinceId: '',
      provinceList: [],
      // 城市列表
      cityId: '',
      cityList: [],
      // 区列表
      distinctId: '',
      distinctList: []
    }
  },
  watch: {
    isData: {
      handler(e1) {
        if (e1) {
          this._getProvinceList(() => {
            const len = this.defaultCity.length
            if (len === 1) {
              this.provinceId = this.defaultCity[0]
            } else if (len === 2) {
              this.provinceId = this.defaultCity[0]
              this._getCityList(this.provinceId, () => {
                this.cityId = this.defaultCity[1]
              })
            } else if (len === 3) {
              this.provinceId = this.defaultCity[0]
              this._getCityList(this.provinceId, () => {
                this.cityId = this.defaultCity[1]
                this._getDistinctList(this.cityId, () => {
                  this.distinctId = this.defaultCity[2]
                })
              })
            }
          })
        }
      },
      immediate: true
    },
    isEmpty:{
      handler(e1) {
        if (e1) {
           this.provinceId = ''
           this.cityId = ''
           this.distinctId = ''
           this.cityList=[]
           this.distinctList=[]
        }
      }
    }
  },
  methods: {
    // type: 0.省份改变获取市 1.市区改变获取区
    pickerChange(e, type) {
      this.$emit('change', this.getValue())
      if (type === 0) {
        this.cityId = ''
        this.distinctId = ''
        this._getCityList(e)
      }
      else if (type === 1) {
        this.distinctId = ''
        this._getDistinctList(e)
      }
    },
    // 获取省份
    _getProvinceList(callback) {
      this.provinceList = []
      // 初始化清空数据
      this.provinceId = ''
      this.cityId = ''
      this.distinctId = ''
      getProvinceList().then(({ data }) => {
        if (data.code === 0) {
          this.provinceList = data.data || []
          typeof callback === 'function' && callback()
        }
      })
    },
    // 获取城市
    _getCityList(provinceId, callback) {
      this.cityList = []
      if (!provinceId) {
        return
      }
      getCityList({ provinceId }).then(({ data }) => {
        if (data.code === 0) {
          this.cityList = data.data || []
          typeof callback === 'function' && callback()
        }
      })
    },
    // 获取区列表
    _getDistinctList(cityId, callback) {
      this.distinctList = []
      if (!cityId) {
        return
      }
      getDistinctList({ cityId }).then(({ data }) => {
        if (data.code === 0) {
          this.distinctList = data.data || []
          typeof callback === 'function' && callback()
        }
      })
    },
    // 清除数据
    clearValue(e) {
      if (e === 1) {
        this.cityId = ''
        this.distinctId = ''
        this.distinctList= []
      } else if (e === 2) {
        this.distinctId = ''
      } else {
        this.provinceId = ''
        this.cityId = ''
        this.distinctId = ''
        this.cityList= []
        this.distinctList= []
      }
    },
    // 返回数据
    getValue() {
      if (this.provinceId && !this.cityId && !this.distinctId) {
        return [this.provinceId]
      }
      if (this.provinceId && this.cityId && !this.distinctId) {
        return [this.provinceId, this.cityId]
      }
      if (this.provinceId && this.cityId && this.distinctId) {
        return [this.provinceId, this.cityId, this.distinctId]
      }
      return []
    }
  }
}
</script>
