const drawerOtherHeight = {
	data() {
		return {
			tableHeight: 0,
			drawerBodyHeightPx: 0,//抽屉body最大高度数值，num类型，单位为px
		};
	},
	methods: {
		getDrawerOtherHeight() {
			// 获取search_list 
			let searchListHeight = 0;
			if (document.querySelector(".drawerBox .search_list")) {
				searchListHeight = document.querySelector(".drawerBox .search_list")
				.offsetHeight;
				// console.log(searchListHeight,"searchListHeight")
			}

			// 获取search_list margin-bottom
			let searchListMarginBottom = 0;
			if (document.querySelector(".drawerBox .search_list")) {
				searchListMarginBottom =
					this.getStyle(
						document.querySelector(".drawerBox .search_list"),
						"marginBottom"
					) * 1;
				// console.log(searchListMarginBottom,"searchListMarginBottom")
			}

			// 获取add-btn 高度
			let btnHeight = 0;
			if (document.querySelector(".drawerBox .add-btn")) {
				btnHeight = document.querySelector(".drawerBox .add-btn").offsetHeight;
				// console.log(btnHeight,"btnHeight")
			}

			// 获取 分页器高度
			let paginationHeight = 0;
			if (document.querySelector(".drawerBox .pagination-container")) {
				paginationHeight = document.querySelector(
					".drawerBox .pagination-container"
				).offsetHeight;
				// console.log(paginationHeight,"paginationHeight")
			}

			//已选中xx条数据
			let pHeight = 0;
			if (document.querySelector(".drawerBox .section-wrap p")) {
				pHeight = document.querySelector(
					".drawerBox .section-wrap p"
				).offsetHeight;
				// console.log(pHeight,"pHeight")
			}

			// 获取search_list margin-bottom
			let pMarginBottom = 0;
			if (document.querySelector(".drawerBox .section-wrap p")) {
				pMarginBottom =
					this.getStyle(
						document.querySelector(".drawerBox .section-wrap p"),
						"marginBottom"
					) * 1;
				// console.log(searchListMarginBottom,"searchListMarginBottom")
			}

			// 获取 其他内容高度
			//其他内容最外层包一层div  class="otherDrawerBox"  
			let otherDrawerBoxHeight = 0;
			if (document.querySelector(".drawerBox .otherDrawerBox")) {
				otherDrawerBoxHeight = document.querySelector(
					".drawerBox .otherDrawerBox"
				).offsetHeight;
				// console.log(otherDrawerBoxHeight,"otherDrawerBoxHeight")
			}

			const otherHeight =
				searchListHeight +
				searchListMarginBottom +
				btnHeight +
				paginationHeight + 
				pHeight + 
				pMarginBottom +
				otherDrawerBoxHeight
				// console.log(otherHeight,"otherHeight")
			return otherHeight ;
		},
		getStyle(obj, attr) {
			if (window.getComputedStyle) {
				return getComputedStyle(obj, null)[attr].replace("px", "");
			}
		},
	},
	watch: {
    visibles(e1) {
      if (e1) {
				this.$nextTick(()=>{
					let headerHeight = 0;
					if(document.querySelector(".el-drawer__header")){
						headerHeight = document.querySelector(".el-drawer__header").offsetHeight + 20;//20为 drawer__header 的 margin-bottom
					}

					let footerHeight = 0;
					if(document.querySelector(".drawerFoot")){
						footerHeight = 50;
					}

					this.drawerBodyHeightPx = window.innerHeight - headerHeight - footerHeight - 20;//20为底部margin-top预留间距
					this.tableHeight = this.drawerBodyHeightPx - this.getDrawerOtherHeight();

					if (document.querySelector('.drawerBox .search-collapse')) {
						document.querySelector('.drawerBox .search-collapse').addEventListener('click', ()=> {
								this.tableHeight = this.drawerBodyHeightPx - this.getDrawerOtherHeight()
						})
					}
					
				})
      }
    },
  },
};
export { drawerOtherHeight };
