<template>
  <app-dialog
    :visibles="visibles"
    :title="'选择电池编码'"
    width="80%"
    @close-dialog="closeDialog"
    @handle-submit="submit"
    :isFooter="true"
    top="6vh"
  >
    <div slot="formContent">
      <!-- table -->
      <app-search :show-title="false">
        <div slot="content">
          <seach-form
            :spanNumber="8"
            :listQuery="listQuery"
            :searchList="searchList"
          />
          <!-- <el-row :gutter="10" type="flex" justify="start" align="middle">
						<el-col :span="8">
							<el-form
								:label-position="'right'"
								:model="listQuery"
								label-width="80px"
								:rules="rules"
							>
								<el-form-item label="终端编号：" prop="terminalCode">
									<el-input
										v-model="listQuery.terminalCode"
										placeholder="请输入终端编号"
										clearable
										:maxlength="8"
										:minlength="8"
									/>
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="8">
							<el-form
								:label-position="'right'"
								:model="listQuery"
								label-width="60px"
							>
								<el-form-item label="电池编码：">
									<el-input
										v-model="listQuery.bmsCode"
										placeholder="请输入电池编码"
										clearable
									/>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row> -->
        </div>
        <!-- 清空按钮 -->
        <app-search-button
          :is-collapse="false"
          slot="bottom"
          :isdisabled="listLoading"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <div class="section-wrap">
        <div
          style="display:flex;justify-content: space-between;align-items: center;"
        >
          <p class="textColor" style="margin-left:8px;">
            已选择 {{ selectList.length }} 个电池编码
          </p>
          <!-- 按钮 -->
          <app-authorize-button @click-filter="showfilter = true">
            <checked-Filter
              slot="check-filter"
              :show.sync="showfilter"
              :list="tableList"
              :scroll-line="8"
            />
          </app-authorize-button>
        </div>
        <app-table
          slot="table"
          ref="tableList"
          :tableHeights="tableHeight"
          :isTableSelection="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :pageObj="listQuery"
          :total="total"
          :actionWidth="actionWidth"
          :actionFixed="actionFixed"
          rowKey="id"
          :isReserve="false"
          :isShowOperation="false"
          :isPagination="true"
          @row-click="clickRow"
          @select="rowSelect"
          @select-all="selectAll"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'carVehicle'">{{
              scope.row[scope.item.prop] | carType
            }}</span>
            <span v-else>
              {{ scope.row[scope.item.prop] | processData }}
            </span>
          </template>
        </app-table>
      </div>
    </div>
  </app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { duplicateRemoval } from "@/utils/base";
// request
import { getBmsCode } from "@/api/carMonitorSys/powerBatteryHistoryDownload";
export default {
  mixins: [pagingMixin, dialogOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    carType(e) {
      switch (e) {
        case 1:
          return "商品车";
        case 2:
          return "试验车";
        case 3:
          return "对标车";
      }
    },
  },
  data() {
    const validateterminalcode = (rule, value, cb) => {
      if (typeof this.listQuery.terminalCode !== "number") {
        setTimeout(() => {
          this.listQuery.terminalCode = this.listQuery.terminalCode.replace(
            /[^0-9]/g,
            ""
          );
        }, 300);
      }
    };
    return {
      listQuery: {
        terminalCode: "",
        bmsCode: "",
      },
      tableList: [
        { value: "VIN码", prop: "vinNo", checked: true, width: 190 },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width: 120,
        },
        {
          value: "电池编码",
          prop: "bmsCode",
          checked: true,
          width: 220,
        },
        { value: "ICCID ", prop: "iccid", checked: true, width: 200 },
      ],
      rules: {
        // terminalCode: [
        // 	{
        // 		required: true,
        // 		trigger: ["blur", "change"],
        // 		validator: validateterminalcode,
        // 	},
        // ],
      },
      selectList: [],
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
        {
          label: "电池编码",
          value: "bmsCode",
          type: "input",
        },
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.selectList = [...this.data];
        this.list = [];
        this.listLoad();
      }
    },
  },
  mounted() {},
  methods: {
    // 关闭dialog
    closeDialog() {
      this.listQuery = {
        terminalCode: "",
        bmsCode: "",
        pageSize: 10,
        pageNum: 1,
      };
        (this.listLoading = false);
      this.$emit("update:visibles", false);
    },
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      getBmsCode(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data || [];
						this.total = data.total || 0;
            if (this.list && this.list.length) {
              this.$nextTick(() => {
                for (let i = 0; i < this.list.length; i++) {
                  this.selectList.forEach((r) => {
                    if (this.list[i].id === r.id) {
                      this.$refs.tableList
                        .refTable()
                        .toggleRowSelection(this.list[i], true);

                      // this.$refs.tableList.toggleRowSelection(this.list[i]);
                    }
                  });
                }
              });
            }
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    rowSelect(selection, row) {
      const index = this.selectList.findIndex((item) => item.id === row.id);
      if (index > -1) {
        this.selectList.splice(index, 1);
      } else {
        this.selectList.push(row);
      }
    },
    selectAll(selection) {
      if (selection.length > 0) {
					selection.forEach((item) => {
						if (!this.selectList.map((i) => i.id).includes(item.id)) {
							this.selectList.push(item);
						}
					})
			} else {
				this.list.forEach((item) => {
						this.selectList.forEach((item1, index) => {
							if (item1.id === item.id) {
								this.selectList.splice(index, 1);
							}
						});
					});
			}
      this.selectList = duplicateRemoval([...this.selectList], "id");
    },
    clickRow({ row }) {
      const index = this.selectList.findIndex((item) => item.id === row.id);
      if (index > -1) {
        this.selectList.splice(index, 1);
      } else {
        this.selectList.push(row);
      }
    },
    // 提交按钮
    submit() {
      console.log(this.selectList, "11111");
      this.$emit("select-complete", this.selectList);
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
.search_list {
  padding-top: 0;
}
</style>
