<template>
  <div class="fault-search-content">
      <div slot="content">
        <el-form
          :label-position="'right'"
          :model="listQuery"
          label-width="100px"
        >
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="VIN码：">
                <vin-select
                  :is-vin="true"
                  size="mini"
                  v-model="listQuery.vinNo"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障码：">
                <el-input
                  size="mini"
                  v-model="listQuery.faultCode"
                  filterable
                  clearable
                  placeholder="请输入故障码"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障名称：">
                <el-input
                  size="mini"
                  v-model="listQuery.faultName"
                  filterable
                  clearable
                  placeholder="请输入故障名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型：">
                <el-select
                  size="mini"
                  v-model="listQuery.faultType"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in gbFaultTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国标故障等级：">
                <el-select
                  size="mini"
                  v-model="listQuery.gbFaultLevel"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in gbFaultLevelList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自定义故障等级：">
                <el-select
                  size="mini"
                  v-model="listQuery.faultLevel"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in faultLevelList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间：">
                <el-time-picker
                  popper-class="fullTime"
                  size="mini"
                  v-model="listQuery.startTime"
                  filterable
                  clearable
                  placeholder="请选择"
                  type="datetime"
                  value-format="HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障状态：">
                <el-select
                  size="mini"
                  v-model="listQuery.faultStatus"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option :label="'已消除'" :value="1"></el-option>
                  <el-option :label="'正发生'" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="持续时间：">
                <el-select
                  size="mini"
                  v-model="listQuery.continueTime"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option :label="'大于5分钟'" :value="5"></el-option>
                  <el-option :label="'大于10分钟'" :value="10"></el-option>
                  <el-option :label="'大于15分钟'" :value="15"></el-option>
                  <el-option :label="'大于20分钟'" :value="20"></el-option>
                  <el-option :label="'大于30分钟'" :value="30"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="6">
              <el-form-item label="占位符" style="visibility: hidden;">
                <el-input />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    <div class="fault-search-action" style="bottom:10px;right:12px">
			<el-button :disabled="listLoading" size="small" @click="handleSearch" v-waves type="primary">
				查询
			</el-button>
			<el-button :disabled="listLoading" size="small" @click="handleClear" v-waves class="empty-btn">
				清空
			</el-button>
		</div>
  </div>
</template>

<script>
import { pagingMixin } from "@/mixins/table";
import { mapGetters } from "vuex";
export default {
  name: "search",
  mixins: [pagingMixin],
  props: {
		listLoading: {
			type: Boolean,
			default:false,
		},
	},
  data() {
    return {
      listQuery: {
        carId: "",
        pageNum: 1,
        faultType: 1,
        vinNo: "",
        faultCode: "",
        faultName: "",
        faultLevel: null,
        gbFaultLevel: null,
        startTime: "",
        faultStatus: null,
        continueTime: null,
      },
      // 国标故障类型
      gbFaultTypeList: [
        { label: "国标故障", value: 1 },
        { label: "自定义故障", value: 2 },
      ],
      gbFaultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
      ],
      faultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
        { label: "四级", value: 4 },
      ],
    };
  },
  computed: {
    ...mapGetters(["commontData"]),
  },
  created() {
    this.$emit("load", this.listQuery);
  },
  methods: {
		listLoad(){

		},
    handleSearch() {
      // this.listLoad(this.listQuery)
      this.$emit("click-search", this.listQuery);
    },
    handleClear() {
    	for (let k in this.listQuery) {
    		if (k === "pageSize" || k === "pageNum") {
    			continue;
    		}
    		this.listQuery[k] = "";
    	}
      this.listQuery.faultType = 1;
      this.$emit("click-clear");
    },
  },
};
</script>

<style lang="scss" scoped>
.fault-search-content {
  padding: 12px 12px 0 0;
  position: relative;
  background: rgba(0, 90, 139, 0.2);
  border:1px solid #03304f !important;
  border-radius: 4px;
}
.fault-search-action {
	position: absolute;
  display: flex;
}
// 时间选择器
.el-time-panel .el-popper .fullTime{
  background: rgba(5, 67, 107,.8) !important;
  border: 1px solid #00A0E9 !important;
}
</style>
