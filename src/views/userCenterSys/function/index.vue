<template>
  <div class="js-system-user app-container" style="background: #fff;">
    <div class="add-btn">
     <span  @mouseenter="enterSvgOpen()" @mouseleave="enterSvgClose()">
      <el-button @click="adds({})" type="primary" size="mini" style="margin:0 8px">
        <i class="iconfont icon-ic_add" style="font-size:12px !important;"></i>
        新增
      </el-button>
     </span>
    </div>
       <!-- @row-click="rowClick"    -->
    <el-table class="menu"
      ref="table"
      :data="treeData"
      v-loading="loading"
      :max-height="maxTableHeight"
      row-key="functionId"
      size="mini"
      border
      fit
      :header-row-style="headerRowStyle"
      :row-style="rowStyle"
      :header-cell-style="headerCellStyle"
      style="width: 100%"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="functionName"
        label="菜单名称(中文)"
        width="220"
        fixed="left"
      />
      
      <el-table-column
        align="center"
        prop="url"
        label="链接"
        width="220"
      />
      <el-table-column
        align="center"
        prop="functionType"
        min-width="80"
        label="菜单类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row['functionType'] ===1 ? '菜单' : scope.row['functionType'] ===2 ? '按钮' : scope.row['functionType'] ===3 ? '层级路由' : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="buttonPosition"
        min-width="80"
        label="按钮位置">
        <template slot-scope="scope">
          <span>
            {{ 
              scope.row['functionType'] ===2 && scope.row['buttonPosition'] ===1 ? '表头左' 
              : scope.row['functionType'] ===2 && scope.row['buttonPosition'] ===2 ? '表头右' 
              : scope.row['functionType'] ===2 && scope.row['buttonPosition'] ===3 ? '表内' : '-' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="icon"
        min-width="140"
        label="图标">
         <template slot-scope="scope">
           <span>{{ scope.row['icon'] || '-' }}</span>
         </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序号"
      />
      <el-table-column
        align="center"
        prop="isDisabled"
        min-width="80"
        label="是否禁用">
        <template slot-scope="scope">
          <span>
            <el-tag
              :type="
                  scope.row.isDisabled == 1
                  ? 'success'
                  : 'info'
              "
              effect="dark"
              style="width: 50px;"
            >
              {{ scope.row['isDisabled'] ===1 ? '启用' : '禁用' }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="isShow"
        min-width="80"
        label="是否显示">
        <template slot-scope="scope">
          <span v-if="scope.row['functionType'] ===2">-</span>
          <span v-else>
            <el-tag
              :type="
                  scope.row.isShow == 1
                  ? 'success'
                  : 'info'
              "
              effect="dark"
              style="width: 50px;"
            >
              {{ scope.row['isShow'] ===1 ? '显示' : '隐藏' }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="140" label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <a>
            <el-tooltip :open-delay="250" class="item" effect="dark" content="新增" placement="top" v-if="scope.row.functionType!=2">
              <span class="card-action" @click="adds(scope.row)">
                <i class="iconfont icon-ic_add" style="font-size: 14px !important"></i>
              </span>
            </el-tooltip>
            <el-tooltip :open-delay="250" class="item" effect="dark" content="编辑" placement="top">
            <span class="card-action" @click="updates(scope.row)">
                <i class="iconfont icon-ic_edit" style="font-size: 14px !important"></i>
            </span>
            </el-tooltip>
            <el-tooltip :open-delay="250" class="item" effect="dark" content="删除" placement="top">
            <span class="card-action" @click="deletes(scope.row)">
                 <i class="iconfont icon-ic_delete" style="font-size: 14px !important"></i>
            </span>
            </el-tooltip>
          </a>
        </template>
      </el-table-column>
      <!-- 自定义暂无数据 -->
      <template slot="empty">
        <img
          :src="require(`@/assets/images/img_zanwushuju.png`)"
          alt=""
          style="margin-bottom: 20px;"
        />
        <div style="display: inline-block; margin-left: -105px;">暂无数据</div>
      </template>
    </el-table>
    <add-update-dialog
      :visibles.sync="visibles"
      :is-edit="isEdit"
      :data="tableRow"
      :tree-father-arr="treeData"
      @get-menu="_getAllMenu"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
  </div>
</template>

<script>
import { tableStyle } from '@/mixins/tableStyle'
import { otherHeight } from '@/mixins/getOtherHeight'
import { getPageButton } from '@/mixins/getButton'

import { getAllMenu, deleteMenu } from '@/api/system/menuManager'
import addUpdateDialog from './components/addUpdateDialog'
export default {
  name: 'function',
  components: { addUpdateDialog },
  filters: {
  },
  mixins: [tableStyle, otherHeight, getPageButton],
  data() {
    return {
      treeData: [],
      visibles: false,
      loading: false,
      isEdit: false,
      tableRow: {},
      selectTableRow: null,
      maxTableHeight: window.innerHeight - 230,
      tableHeight: 0,
      enterSvg: false,
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    },
    loginName(){
      return this.$store.state.user.loginName;
    },
  },
  created() {
    this._getAllMenu()
    // this.authouizeList = _getNewPageButton(this.$route.name)
  },
 
  methods: {
    enterSvgOpen() {
      this.enterSvg = true;
    },
    enterSvgClose() {
      this.enterSvg = false;
    },
    _getAllMenu() {
      this.loading = true;
      getAllMenu().then(({ data }) => {
        this.loading = false;
        if (data.code === 0) {
          this.treeData = data.data || []
        }
      }).catch(()=>{
        this.loading = false;
      })
    },
    // 进行排序
    sort(a, b) {
      return a.sort - b.sort
    },
    adds(row = {}) {
      this.isEdit = false
      this.visibles = true
      this.selectTableRow = row
      // 需根据中英文来判断

      const parentMenu = this.lang == 'zh' ? row.functionName : row.functionNameEn
      this.tableRow = { parentId: row.functionId?row.functionId:"", parentMenu: parentMenu || '顶层路由' }
    },
    addComplete(data) {
      this.$message.success({
        message: '新增成功',
        duration: 2 * 1000
      })
      this._getAllMenu()
      // // 表明添加的父级菜单是顶层菜单
      // if (!data.parentId) {
      //   this.treeData.push(data)
      //   this.treeData.sort(this.sort)
      // } else {
      //   if (!this.selectTableRow.children) {
      //     this.$set(this.selectTableRow, 'children', [])
      //   }
      //   this.selectTableRow.children.push(data)
      //   this.selectTableRow.children.sort(this.sort)
      // }
    },
    updates(row) {
      if (!row.functionId) {
        this.$alert('请选中需要编辑项', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.isEdit = true
      this.visibles = true
      this.selectTableRow = row
      this.tableRow = row
      // const functionNamesArray = this.lang == 'zh' ? row.functionNames.split('/') : row.functionNamesEn.split('/')
      const functionNamesArray = row.functionNames?row.functionNames.split('/'):[]
      const len = functionNamesArray.length
      const index = functionNamesArray.findIndex(v => v == row.functionName || v == row.functionNameEn)
      if (index > -1) {
        const parentMenu = len > 1 ? functionNamesArray[index - 1] : '顶层路由'
        this.tableRow.parentMenu = parentMenu
      }
    },
    updateComplete(data) {
      const { parentId, functionId } = data
      this.setTreeData(this.treeData, parentId, functionId, data)
      this.$message.success({
        message: '编辑成功',
        duration: 2 * 1000
      })
    },
    // 更新
    setTreeData(treeData, parentId, functionId, updateData) {
      treeData.forEach(item => {
        if (item.functionId === parentId) {
          const index = item.children.findIndex(v => v.functionId === functionId)
          if (index > -1) {
            for (const v in updateData) {
              if (updateData[v] !== item.children[index][v]) {
                this.$set(item.children[index], v, updateData[v])
              }
            }
            item.children.sort(this.sort)
          }
        } else {
          if (!item.parentId) {
            // 如果不存在parentId && item.functionId===parentId则说明是一级菜单
            const index = treeData.findIndex(v => v.functionId === functionId)
            if (index > -1) {
              for (const v in updateData) {
                if (updateData[v] !== this.treeData[index][v]) {
                  this.$set(this.treeData[index], v, updateData[v])
                }
              }
              this.treeData.sort(this.sort)
            }
          }
        }
        if (item.children && item.children.length > 0) {
          this.setTreeData(item.children, parentId, functionId, updateData)
        }
      })
    },
    deletes(row) {
      if (!row.functionId) {
        this.$alert('请选中需要删除项', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('是否删除此项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { functionId, parentId, ...data } = row
        const postData = { id: functionId, data }
        deleteMenu(postData).then(({ data }) => {
          if (data.code === 0) {
            this.deleteTreeData(this.treeData, parentId, functionId)
            this.$message.success({
              message: '删除成功',
              duration: 2 * 1000
            })
          }
        })
      })
        .catch(() => {})
    },
    // 删除
    deleteTreeData(treeData, parentId, functionId) {
      treeData.forEach(item => {
        if (item.functionId === parentId) {
          const index = item.children.findIndex(v => v.functionId === functionId)
          if (index > -1) {
            item.children.splice(index, 1)
          }
        } else {
          if (!item.parentId) {
            // 如果不存在parentId && item.functionId===parentId则说明是一级菜单
            const index = treeData.findIndex(v => v.functionId === functionId)
            if (index > -1) {
              this.treeData.splice(index, 1)
            }
          }
        }
        if (item.children && item.children.length > 0) {
          this.deleteTreeData(item.children, parentId, functionId)
        }
      })
    },
    rowClick(row) {
      this.tableRow = row
    }
  }
}

</script>

<style lang='scss' scoped>


</style>