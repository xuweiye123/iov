<!--
  使用实例
 <seach-form
    :listQuery="listQuery" //必传  表单绑定的对象
    :searchList="searchList" //必传   查询区数组

    :collapse  //选传 需要加展开收起时传
    :labelWidth="'65px'" //选传  label宽度，默认65px
    :spanNumber="6"  //选传   span宽度，默认6
    :collapseNumber="3" //选传  超过几个加展开收起，默认24/spanNumber -1
 />
 searchList:[
  {
    label,//必传
    value,//必传
    type,//必传 vin：VIN组件，input：输入框，select：选择框，date：日期选择器，dateRange:连在一起的日期选择器,dateTime：时间日期选择器，dateTimeRange:连在一起的时间日期选择器,radio：radio单选框
    options: {  // type为'select'和'radio'时必传
      data: this.contactTypeList,//下拉数组
      extraProps: { //当数组中绑定的值不是value和label时必传
        label: "text",
        value: "id",
      }, 
    },
    item.spanNumber,//非必传
    labelWidth,//非必传
    placeholder,//非必传 当前输入类默认:"请输入+'item.label'",选择类默认:"请选择"
    defaultType,//非必传 默认：'00:00:00'，'end':'23:59:59'，type='dateTime'时且为结束时间传end
    clearable,//非必传 默认true
    filterable,//非必传 默认true，type='select'时有用
    multiple,//非必传 默认false，type='select'时有用
    disabled,//非必传 默认false
    readonly,//非必传 默认false，type='input'时有用
  }
 ]//该数组需要写在computed中

-->
<template>
  <div>
    <el-form
      v-bind="$attrs"
      :model="listQuery"
      :label-width="labelWidth"
      style="width:100%"
    >
      <el-row :gutter="10" type="flex" justif="start" style="flex-wrap: wrap">
        <el-col
          v-for="(item, index) in searchList"
          :key="index"
          :span="item.spanNumber ? item.spanNumber : spanNumber"
        >
          <el-form-item
            :label="item.label + '：'"
            :prop="item.value"
            :label-width="item.labelWidth ? item.labelWidth : labelWidth"
            v-show="index + 1 > collapseNumbers ? collapse : true"
          >
            <vin-select
              v-if="item.type == 'vin'"
              :is-vin="true"
              @vinNoTotal="getVinNoTotal"
              :clearable="item.clearable === false ? false : true"
              v-model="listQuery[item.value]"
            />
            <el-input
              v-else-if="item.type == 'input'"
              v-model="listQuery[item.value]"
              :clearable="item.clearable === false ? false : true"
              :disabled="item.disabled === true ? true : false"
              :readonly="item.readonly === true ? true : false"
              :placeholder="
                item.placeholder ? item.placeholder : '请输入' + [item.label]
              "
              @input="item.inputEvent ? item.inputEvent() : null"
              @focus="item.focusEvent ? item.focusEvent() : null"
            />
            <el-select
              v-else-if="item.type == 'select'"
              v-model="listQuery[item.value]"
              :filterable="item.filterable === false ? false : true"
              :clearable="item.clearable === false ? false : true"
              :multiple="item.multiple === true ? true : false"
              :disabled="item.disabled === true ? true : false"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              @change="item.changeEvent ? item.changeEvent() : null"
            >
              <el-option
                v-for="(item1, index1) in item.options.data"
                :key="index1"
                :label="
                  item.options.extraProps &&
                  item.options.extraProps.label == 'noKey'
                    ? item1
                    : item.options.extraProps &&
                      item1[item.options.extraProps.label]
                    ? item1[item.options.extraProps.label]
                    : item1['label']
                "
                :value="
                  item.options.extraProps &&
                  item.options.extraProps.value == 'noKey'
                    ? item1
                    : item.options.extraProps &&
                      item1[item.options.extraProps.value]
                    ? item1[item.options.extraProps.value]
                    : item1['value']
                "
              />
            </el-select>
            <el-date-picker
              v-else-if="item.type == 'date'"
              v-model="listQuery[item.value]"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              :clearable="item.clearable === false ? false : true"
              :disabled="item.disabled === true ? true : false"
            >
            </el-date-picker>
            <el-date-picker
              v-else-if="item.type == 'dateRange'"
              v-model="listQuery[item.value]"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="item.pickerOptions ? item.pickerOptions : null"
              unlink-panels
            >
            </el-date-picker>
            <el-date-picker
              v-else-if="item.type == 'dateTime'"
              v-model="listQuery[item.value]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              :default-time="
                item.defaultType == 'end' ? '23:59:59' : '00:00:00'
              "
              :clearable="item.clearable === false ? false : true"
              :disabled="item.disabled === true ? true : false"
            >
            </el-date-picker>
            <el-date-picker
              v-else-if="item.type == 'dateTimeRange'"
              v-model="listQuery[item.value]"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="item.pickerOptions ? item.pickerOptions:null"
              unlink-panels
            >
            </el-date-picker>
            <el-radio-group
              v-else-if="item.type == 'radio'"
              v-model="listQuery[item.value]"
              :disabled="item.disabled === true ? true : false"
            >
              <el-radio
                v-for="(item1, index1) in item.options.data"
                :key="index1"
                :label="
                  item.options.extraProps &&
                  item1[item.options.extraProps.value]
                    ? item1[item.options.extraProps.value]
                    : item1['value']
                "
                >{{
                  item.options.extraProps &&
                  item1[item.options.extraProps.label]
                    ? item1[item.options.extraProps.label]
                    : item1["label"]
                }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="
          isRange
            ? (searchList.length + 1) % (24 / this.spanNumber) == 0
            : searchList.length % (collapseNumbers + 1) == 0
        "
        v-show="collapse"
      >
        <el-col :span="6">
          <el-form :label-position="'right'" label-width="60px">
            <el-form-item label="占位符" style="visibility: hidden;">
              <el-input />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "seachForm",
  props: {
    /**
     * @name:表单
     * @param {Object}
     */
    listQuery: {
      type: Object,
      default: () => {
        return {
          pageSize: 10,
          pageNum: 1,
        };
      },
    },
    /**
     * @name:label宽度
     * @param {String}
     */
    labelWidth: {
      type: String,
      default: "65px", //65px支持四个字以内
    },
    /**
     * @name:span宽度
     * @param {Number}
     */
    spanNumber: {
      type: Number,
      default: 6,
    },
    /**
     * @name:展开收起
     * @param {Boolean}
     */
    collapse: {
      type: Boolean,
      default: false,
    },
    /**
     * @name:查询区数组
     * @param {Array}
     */
    searchList: {
      type: Array,
      default: [],
    },
    /**
     * @name:超过几个加展开收起
     * @param { Number }
     */
    collapseNumber: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isRange: false,
      // pickerOptions:{
      //   disabledDate: time => {
      //     // 禁用今天之后的日期【当前天可选】
      //     return time.getTime() >  new Date(getTodayEndTime()).getTime()
      //   }
      // }
      // collapseNumbers: 3,
    };
  },
  // watch:{
  //  'spanNumber': {
  //     deep:true,
	// 		handler(e1) {
	// 			if (e1) {
	// 				console.log(e1,123, )
	// 			}
	// 		},
	// 	},
  // },
  computed: {
    collapseNumbers(){
      this.isRange = false;
      this.isFrontRange = false;
      this.searchList.forEach((i, index) => {
        if (i.type == "dateTimeRange" || i.type == "dateRange") {
          this.isRange = true;
          // console.log(index, 123);
          if (this.spanNumber==6&&index < 3) {
            this.isFrontRange = true;
            // console.log(index, 234);
          }else if(this.spanNumber==8&&index < 2){
            this.isFrontRange = true;
          }
        }
      });
      // console.log(this.collapseNumber
      // ? this.collapseNumber
      // : this.isFrontRange
      // ? 24 / this.spanNumber - 2
      // : 24 / this.spanNumber - 1,333)
      return this.collapseNumber
      ? this.collapseNumber
      : this.isFrontRange
      ? 24 / this.spanNumber - 2
      : 24 / this.spanNumber - 1;
    },
  },
  mounted() {
    // this.isRange = false;
    // this.isFrontRange = false;
    // this.searchList.forEach((i, index) => {
    //   if (i.type == "dateTimeRange" || i.type == "dateRange") {
    //     this.isRange = true;
    //     // console.log(index, 123);
    //     if (this.spanNumber==6&&index < 3) {
    //       this.isFrontRange = true;
    //       // console.log(index, 234);
    //     }else if(this.spanNumber==8&&index < 2){
    //       this.isFrontRange = true;
    //     }
    //   }
    // });

    // this.collapseNumbers = this.collapseNumber
    //   ? this.collapseNumber
    //   : this.isFrontRange
    //   ? 24 / this.spanNumber - 2
    //   : 24 / this.spanNumber - 1;
    //   console.log(this.collapseNumbers,222)
  },
  methods: {
    getVinNoTotal(e){
			if(e){
       this.listQuery.vinNoTotal=e
			}else{
        if(this.listQuery&&this.listQuery.hasOwnProperty('vinNoTotal')){
          delete this.listQuery.vinNoTotal
        } 
      }
		},
  },
};
</script>

<style lang="scss" scoped></style>
