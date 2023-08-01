/**
 * 分页查询混入
 * 组件必须有一个listLoad方法用来加载列表数据
 */
import {
	operateWidth
} from "@/utils/base";
const pagingMixin = {
	data: function () {
		return {
			listQuery: {
				pageNum: 1,
				pageSize: 10,
			},
			collapse: false,
			//----------------------------------
			showfilter: false,
			authouizeList: [],
			tableHeight: 0,
			total: 0,
			list: [],
			listLoading: false,
			tableRow: {},
			actionWidth: 0,
			actionFixed: "right",
			exportLoading:false,
		};
	},
	/**
	 * 组件挂载自动查询
	 */
	created() {
		if (!this.$options.doNotInit) {
			this.listLoad();
		}
	},
	mounted() {
		if (
			this.tableList &&
			this.tableList instanceof Array &&
			this.tableList.length > 0
		) {
			this.tableList[0].fixed =
				this.tableList[0].fixed && this.tableList[0].checked ?
				this.tableList[0].fixed :
				"left";
			this.tableList.map(
				(item) =>
				(item.position =
					item.position && item.checked ? item.position : "center")
			);
		}
		if (this.tableAction && this.tableAction.length > 0) {
			this.actionFixed = "right";
			this.actionWidth = this.operateWidth(this.tableAction.length)
		} else if (this.insideList && this.insideList.length > 0) {
			this.actionFixed = "right";
			this.actionWidth = this.operateWidth(this.insideList.length)
		} else {
			this.actionFixed = "false";
		}
	},
	computed: {
		// minBoxHeight(){
		//   return document.body.clientHeight - document.querySelector('.search_list').offsetHeight - document.querySelector('.app-header').offsetHeight - document.querySelector('.tags-view-container').offsetHeight
		// }
		//表格筛选
		filterTableList() {
			if (
				this.tableList &&
				this.tableList instanceof Array &&
				this.tableList.length > 0
			) {
				return this.tableList.filter((item) => item.checked);
			} else {
				return [];
			}
		},
	},
	methods: {
		operateWidth,
		getVinNoTotal(e){
			if(e){
			//  console.log(e,12344321)
			 if(this.rightListQuery){
				this.rightListQuery.vinNoTotal= e
			 }else{
        this.listQuery.vinNoTotal=e
			 }
			}else{
				if(this.rightListQuery&&this.rightListQuery.hasOwnProperty('vinNoTotal')){
          delete this.rightListQuery.vinNoTotal
        } 
				if(this.listQuery&&this.listQuery.hasOwnProperty('vinNoTotal')){
          delete this.listQuery.vinNoTotal
        } 
			}
		},
		putOn(blo) {
			this.isPut = blo;
			this.$nextTick(() => {
				this.minBoxHeight =
					document.body.clientHeight -
					document.querySelector(".search_list").offsetHeight -
					document.querySelector(".app-header").offsetHeight -
					document.querySelector(".tags-view-container").offsetHeight -
					48;
			});
		},
		/**
		 * 处理查询
		 */
		handleFilter() {
			this.listQuery.pageNum = 1;
			this.listQuery.orderfield && (this.listQuery.orderfield = "");
			this.listLoad();
		},
		/**
		 * 处理分页大小改变
		 * @param {number} value - 分页大小
		 */
		handleSizeChange(value) {
			this.listQuery.pageNum = 1;
			this.listQuery.pageSize = value;
			this.listLoad();
		},
		/**
		 * 处理页码改变
		 * @param {number} value - 页码
		 */
		handleCurrentChange(value) {
			this.listQuery.pageNum = value;
			this.listLoad();
		},
		/**
		 * 处理数据清空
		 */
		handleClear() {
			for (const k in this.listQuery) {
				if (k === "pageNum" || k === "pageSize") {
					continue;
				} else if( k === "timeRange" ){
					this.listQuery[k] = ["",""]
				}
				else {
					this.listQuery[k] = "";
				}
			}
			if (this.total) {
				this.total = 0;
			}
			if (this.list && this.list.length) {
				this.list = [];
			}
			this.listQuery.pageNum = 1;
			this.listLoad();
		},
		/**
		 * 处理展开收起
		 * @param {*} e
		 */
		handleCollapse(e) {
			this.collapse = e;
		},
		sortChange(row) {
			const direction = row.order;
			if (direction === null) {
				return;
			}
			this.listQuery.pageNum = 1;
			// 驼峰转连字符
			// const propNames = row.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
			this.listQuery.orderField = row.prop;
			this.listQuery.direction = direction.replace(/ending/, "");
			this.listLoad();
		},
		setOrderField(orderStr, targetTable) {
			if (orderStr) {
				const orderfieldList = orderStr.split(",");
				orderfieldList.forEach((item) => {
					const index = targetTable.findIndex((v) => {
						return v.prop === item;
					});
					if (index > -1) {
						this.$set(targetTable[index], "sortable", "custom");
					}
				});
			}
		},

		// 点击列
		rowClick(row) {
			let rows = [];
			rows.push(row);
			this.toggleSelection(rows);
		},
		/**
		 * @name: 选中切换
		 * @param {*} rows
		 */
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.table.toggleRowSelection(row);
				});
			} else {
				this.$refs.table.clearSelection();
			}
		},
		/**
		 * @name:选择
		 * @param {*}
		 */
		handleSelectionChange(val) {
			// console.log("val", val);
			this.multipleSelection = val;
		},
	},
};
export {
	pagingMixin
};