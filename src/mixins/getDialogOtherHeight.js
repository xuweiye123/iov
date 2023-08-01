const dialogOtherHeight = {
	data() {
		return {
			tableHeight: 0,//弹框内 表格最大高度数值，num类型，无单位
			dialogBodyHeightPx: 0,//弹框body最大高度数值，num类型，单位为px
		};
	},
	methods: {
		getDialogOtherHeight() {
			// 获取search_list 
			let searchListHeight = 0;
			if (document.querySelector(".dialogBox .search_list")) {
				searchListHeight = document.querySelector(".dialogBox .search_list")
				.offsetHeight;
				// console.log(searchListHeight,"searchListHeight")
			}

			// 获取search_list margin-bottom
			let searchListMarginBottom = 0;
			if (document.querySelector(".dialogBox .search_list")) {
				searchListMarginBottom =
					this.getStyle(
						document.querySelector(".dialogBox .search_list"),
						"marginBottom"
					) * 1;
				// console.log(searchListMarginBottom,"searchListMarginBottom")
			}

			// 获取add-btn 高度
			let btnHeight = 0;
			if (document.querySelector(".dialogBox .add-btn")) {
				btnHeight = document.querySelector(".dialogBox .add-btn").offsetHeight;
				// console.log(btnHeight,"btnHeight")
			}

			// 获取 分页器高度
			let paginationHeight = 0;
			if (document.querySelector(".dialogBox .pagination-container")) {
				paginationHeight = document.querySelector(
					".dialogBox .pagination-container"
				).offsetHeight;
				// console.log(paginationHeight,"paginationHeight")
			}

			// 获取 其他内容高度
			//其他内容最外层包一层div  class="otherDialogBox"  
			let otherDialogBoxHeight = 0;
			if (document.querySelector(".dialogBox .otherDialogBox")) {
				otherDialogBoxHeight = document.querySelector(
					".dialogBox .otherDialogBox"
				).offsetHeight;
				// console.log(otherDialogBoxHeight,"otherDialogBoxHeight")
			}
			

			const otherHeight =
				searchListHeight +
				searchListMarginBottom +
				btnHeight +
				paginationHeight + 
				otherDialogBoxHeight
				// console.log(otherHeight,"otherHeight")
			return otherHeight + 20;
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
					let marginTop = document.querySelector(".el-dialog.dialogBox").style.marginTop;

					let headerHeight = 0;
					if(document.querySelector(".el-dialog__header")){
						headerHeight = document.querySelector(".el-dialog__header").offsetHeight;
					}

					let footerHeight = 0;
					if(document.querySelector(".el-dialog__footer")){
						footerHeight = document.querySelector(".el-dialog__footer").offsetHeight;
					}

					//将calc(100vh - px) 转换成px
					this.dialogBodyHeightPx = (100 -  marginTop.split("vh").join("") * 2) * window.innerHeight / 100 - headerHeight - footerHeight;
					this.tableHeight = this.dialogBodyHeightPx - this.getDialogOtherHeight();

					if (document.querySelector('.dialogBox .search-collapse')) {
						document.querySelector('.dialogBox .search-collapse').addEventListener('click', ()=> {
								this.tableHeight = this.dialogBodyHeightPx - this.getDialogOtherHeight()
						})
					}
					
				})
      }
    },
  },
};
export { dialogOtherHeight };
