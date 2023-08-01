<!--
  使用实例
  <app-table
    slot="table"
    :isTableSelection="false"
    :list="list"
    :listLoading="listLoading"
    :filterTableList="filterTableList"
    :pageObj="listQuery"
    :total="total"
    :actionWidth="actionWidth"
    :actionFixed="actionFixed"
    :buttonList="buttonList"
    :isShowOperation="true"
    @row-click="rowClick"
    @click-delete="handleDelete"
    @click-update="handleUpdate"
    @click-stopRemind="handleStopRemind"
    @handle-selection-change="handleSelectionChange"
    @sort-change="sortChange"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
    >
      <template slot="tableContent" slot-scope="scope" >
        {{ scope.row[scope.item.prop] }}
      </template>

      如果操作列中的按钮需要通过数据值判断是否显示的，用插槽，否则不需要加下面的 <template> </template>
      <template slot="tableOperation" slot-scope="scope">
        <el-tooltip 
          v-for="(l,index) in tableAction"
          :key="index"
          :open-delay="250" 
          class="item" 
          effect="dark" 
          :content="l.functionName" 
          placement="top">
          <span class="card-action" v-if="l.url==='update'&&scope.row.vinNo=='TEST0000000000001'" @click="handleUpdate(scope.row)">
            <i :class='"iconfont icon-"+l.icon'></i>
          </span>
          <span class="card-action" v-else-if="l.url==='delete'" @click="handleDelete(scope.row)">
            <i :class='"iconfont icon-"+l.icon'></i>
          </span>
          <span class="card-action" v-else-if="l.url==='stopRemind'" @click="handleStopRemind(scope.row)">
            <i :class='"iconfont icon-"+l.icon'></i>
          </span>
        </el-tooltip>
      </template>
    </app-table>
   @param:
    list
    listLoading
    filterTableList
    listQuery
    total
    actionWidth
    actionFixed
    buttonList
   method:
    row-click
    handle-selection-change
    sort-change
    handle-size-change
    handle-current-change
   remark:
    1、buttonList格式
      buttonList:[
        {text:'编辑', event:'click-update'}
      ]
    2、@click-update解释：
      click-update来自buttonList里面定义的event参数，他代表某一个操作按钮对应的事件
-->
<template>
  <div>
    <el-table
        :class="tableClass"
        :show-header="showHeader"
        ref="table"
        v-loading="listLoading"
        :element-loading-text="loadingText"
        size="mini"
        :data="list"
        :header-row-style="headerRowStyle"
        :row-style="rowStyle"
        :header-cell-class-name="cellClass"
        :header-cell-style="headerCellStyle"
        :max-height="tableHeights?tableHeights:tableHeight"
        border
        fit
        :row-key="rowKey"
        highlight-current-row
        style="width: 100%"
        @row-click="rowClick"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        @select="rowSelect"
        @select-all="selectAll"
        @row-dblclick="rowDblclick"
    >
      <!-- 表格选中框 -->
      <el-table-column
        type="selection"
        :reserve-selection="isReserve"
        :selectable="selectable"
        :width="tableSelectionWidth"
        v-if="isTableSelection"
        fixed
        >
      </el-table-column>
      <el-table-column
        v-if="isTableNumber"
        :label="$t('table.id')"
        align="center"
        min-width="65"
        fixed
      >
        <template slot-scope="scope">
          <span>{{ (scope.$index+1)+((pageObj.pageNum || 1) -1)*(pageObj.pageSize || 10) }}</span>
          <!-- 序号插槽 -->
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in filterTableList"
        :key="index"
        :fixed="item.fixed"
        :label="item.value"
        :prop="item.prop"
        :align="item.position?item.position:'center'"
        :min-width="item.width"
        :sortable="item.sortable"
        :show-overflow-tooltip="!item.hasOwnProperty('showTooltip') ? true : item.showTooltip"
        class-name="custom-column"
      >
        <!-- 表格内容插槽 -->
        <template slot-scope="scope" >
          <slot name="tableContent" :row="scope.row" :item="item" ></slot>
        </template>
      </el-table-column>
      <!-- 最后一列单独作为操作的插槽 -->
      <el-table-column
        label="操作"
        :width="actionWidth"
        :fixed="actionFixed"
        align="center"
        v-if="isShowOperation"
        >
        <template slot-scope="scope">
          <slot name="tableOperation" :row="scope.row" >
            <span
              v-for="(l,index) in buttonList"
              :key="index"
            >
              <el-tooltip 
                class="item" 
                effect="dark" 
                :content="l.functionName"
                :disabled="$store.state.app.isDisTooltip"
                placement="top">
                <span class="card-action" @click="handleClick(l.url, scope.row)">
                  <i :class="'iconfont icon-'+l.icon"></i>
                </span>
              </el-tooltip>
            </span>
          </slot>
        </template>
      </el-table-column>
      <!-- 自定义暂无数据 -->
      <template slot="empty">
        <img
          :src="require(`../../assets/images/img_zanwushuju.png`)"
          alt=""
          style="margin-bottom: 20px;"
        />
        <div style="display: inline-block; margin-left: -105px;">暂无数据</div>
      </template>
    </el-table>
    <div v-if="isPagination" :class="[total>0?'visible':'hidden','pagination-container']">
      <el-pagination
        :current-page="pageObj.pageNum"
        :page-sizes="pageSize"
        :page-size="pageObj.pageSize"
        :total="total"
        :background="true"
        :small="isSmall"
        :pager-count="pagerCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { tableStyle } from "@/mixins/tableStyle";
import { otherHeight } from "@/mixins/getOtherHeight";
  export default {
    name:'appTable',
    // mixins: [tableStyle],
    mixins: [tableStyle,otherHeight],
    props:{
      /**
       * @name:表格头部
       * @param {Boolean}
       */
      showHeader:{
        type: Boolean,
        default: true
      },
      /**
       * @name:表格列class
       * @param {row}
       */
      cellClass: Function,
      /**
       * @name:表格样式控制
       * @param {Boolean}
       */
      tableClass:{
        type: String,
        default: ''
      },
      /**
       * @name:表格加载控制
       * @param {Boolean}
       */
      listLoading:{
        type: Boolean,
        default: false
      },
      /**
       * @name:表格加载名称控制
       * @param {Boolean}
       */
      loadingText:{
        type: String,
        default: ""
      },
      /**
       * @name:表格列表数据
       * @param {Array}
       */
      list:{
        type: Array,
        default: ()=>{
          return []
        }
      },
      /**
       * @name:表格头信息
       * @param {Array}
       */
      filterTableList:{
        type: Array,
        default: ()=>{
          return []
        }
      },
      /**
       * @name:共有多少条数据
       * @param {Number}
       */
      total:{
        type: Number,String,
        default:1
      },
      /**
       * @name:分页组件是否显示
       * @param {Boolean}
       */
      isPagination:{
        type: Boolean,
        default: true
      },
      /**
       * @name:分页信息
       * @param {Object}
       */
      pageObj: {
        type: Object,
        default:()=>{
          return {
            pageSize:10,
            pageNum:1
          }
        }
      },
      /**
       * @name:每页显示多少条数据数组
       * @param {Array}
       */
      pageSize:{
        type: Array,
        default:()=>{
          return [10,50,100,500]
        }
      },
      /**
       * @name:表格可选框是否显示
       * @param {Boolean}
       */
      isTableSelection:{
        type: Boolean,
        default: true
      },
      /**
       * @name:点击行是否勾选
       * @param {Boolean}
       */
      isClickRowSelected:{
        type: Boolean,
        default: true
      },
      /**
       * @name:表格多选是否禁用
       * @param {row, index}
       */
      selectable: Function,
      /**
       * @name:表格可选框宽度
       * @param {Number}
       */
      tableSelectionWidth:{
        type: Number,String,
        default: 50
      },
      /**
       * @name:table数据key
       * @param {Number}
       */
      rowKey:{
        type: String,
        default: 'index'
      },
      /**
       * @name:是否记忆多选
       * @param {Boolean}
       */
      isReserve:{
        type: Boolean,
        default: true
      },
      /**
       * @name:操作列宽度
       * @param {Number}
       */
      actionWidth:{
        type: Number,String,
        default: 0
      },
      /**
       * @name:操作列对其方式
       * @param {String}
       */
      actionFixed:{
        type: String,
        default: 'right'
      },
      /**
       * @name:是否显示序号
       * @param {Boolean}
       */
      isTableNumber:{
        type: Boolean,
        default: true
      },
      /**
       * @name:是否显示操作列
       * @param {Boolean}
       */
      isShowOperation:{
        type: Boolean,
        default: false
      },
      /**
       * @name:表内操作列按钮
       * @param {Boolean}
       */
      buttonList:{
        type: Array,
        default:()=>[]
      },
      tableHeights:{
        type:[Number, String],
        // default:0
      },
      /**
       * @name:是否使用小型分页样式
       * @param {Boolean}
       */
      isSmall:{
        type:Boolean,
        default:false
      },
      /**
       * @name:页码按钮的数量，当总页数超过该值时会折叠
       * @param {Boolean}
       */
      pagerCount:{
        type:Number,
        default:5
      }
    },
    doNotInit:true,
    data() {
      return {
        tableHeight: 0,
      }
    },
    computed:{
      activeName(){
        return this.$store.state.theme.activeName;
      }
    },
    mounted(){
      // console.log(this.rowKey,"rowKey")

    },
    methods:{
      /**
       * @name:点击列
       * @param {*}
       */
      rowClick(row, column) {
        const obj = {
          row: row,
          column: column
        }
        this.$emit('row-click', obj)
        if(this.isTableSelection && this.isClickRowSelected && this.$refs.table.toggleRowSelection){
          this.$refs.table.toggleRowSelection(row)
        }
      },
      /**
       * @name:点击操作按钮
       * @param {
       *  e,
       *  data
       * }
       */
      handleClick(e,data){
        this.$emit("click-"+e, data)
      },
      /**
       * @name:表格排序发生变化触发
       * @param {*}
       */
      sortChange(res){
        this.$emit('sort-change',res)
      },
      /**
       * @name:选择项发生变化执行
       * @param {*}
       */
      handleSelectionChange(res){
        this.$emit('handle-selection-change',res)
      },
      /**
       * @name:每页显示多少行发生改变
       * @param {*}
       */
      handleSizeChange(res){
        // console.log(res);
        this.$emit('handle-size-change',res)
      },
      /**
       * @name:页码改变时触发
       * @param {*}
       */
      handleCurrentChange(res){
        // console.log(res);
        this.$emit('handle-current-change',res)
      },
      rowSelect(selection, row){
        this.$emit('select',selection,row)
        
      },
      selectAll(selection){
        this.$emit('select-all',selection)
      },
      rowDblclick(selection){
        this.$emit('row-dblclick',selection)
      },
      refTable(){
        return this.$refs.table
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>