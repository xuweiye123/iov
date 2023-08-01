
const otherHeight = {
  data() {
    return {
      tableHeight: 0,
      tableHeight1: 0,
      minBoxHeight: 0,
      carControlHeight:0,
    }
  },
  methods: {
    getOtherHeight() {
      // 获取header高度
      let headerHeight = 0
      if (document.querySelector('.app-header')) {
        headerHeight = document.querySelector('.app-header').offsetHeight
      }
      // console.log(headerHeight,"=====headerHeight")
      // 获取tags-view-container高度
      let tagsViewHeight = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewHeight = document.querySelector('.tags-view-container').offsetHeight
      }
      // console.log(tagsViewHeight,"=====tagsViewHeight")
      // 获取tags-view-container的margin-bottom
      let tagsViewMargin = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewMargin = this.getStyle(document.querySelector('.tags-view-container'), 'marginBottom')
      }
      // console.log(tagsViewMargin,"=====tagsViewMargin")
      // 获取app-main padding值
      // let appMainPadding = 0
      // if (document.querySelector('.app-container')) {
      //   appMainPadding = this.getStyle(document.querySelector('.app-container'), 'paddingTop') * 2
      // }
      // 获取app-main-wrapper padding值
      let appMainWrapperPadding = 0
      if (document.querySelector('.app-main-wrapper')) {
        appMainWrapperPadding = this.getStyle(document.querySelector('.app-main-wrapper'), 'paddingTop') * 1
      }
      // console.log(appMainWrapperPadding,"=====appMainWrapperPadding")
      // 获取 search_list高度
      let searchHeight = 0
      if (document.querySelector('.search_list')) {
        searchHeight = document.querySelector('.search_list').offsetHeight
      }
      // console.log(searchHeight,"=====searchHeight")
      // 获取 search_list margin
      let searchMargin = 0
      if (document.querySelector('.search_list')) {
        searchMargin = this.getStyle(document.querySelector('.search_list'), 'marginBottom') * 1
      }
      // console.log(searchMargin,"=====searchMargin")
      // section-wrap的margin
      let sectionWrapMargin = 0
      // if (document.querySelector('.section-wrap')) {
      //   sectionWrapMargin = this.getStyle(document.querySelector('.section-wrap'), 'marginTop') * 2
      // }
      // console.log(sectionWrapMargin,"=====sectionWrapMargin")
      // section-wrap的padding
      let sectionWrapPadding = 0
      // if (document.querySelector('.section-wrap')) {
      //   sectionWrapPadding = this.getStyle(document.querySelector('.section-wrap'), 'paddingTop') * 2
      // }
      // console.log(sectionWrapPadding,"=====sectionWrapPadding")
      // 获取add-btn 高度
      let btnHeight = 0
      if (document.querySelector('.add-btn')) {
        btnHeight = document.querySelector('.add-btn').offsetHeight
      }
      // console.log(btnHeight,"=====btnHeight")
      // 获取add-btn padding值
      // let btnPadding = 0
      // if (document.querySelector('.add-btn')) {
      //   btnPadding = this.getStyle(document.querySelector('.add-btn'), 'paddingTop') *2
      // }
      // console.log(btnPadding,"=====btnPadding")

      // 获取 content-chart高度
      let contentChartHeight = 0
      if (document.querySelector('.content-chart')) {
        contentChartHeight = document.querySelector('.content-chart').offsetHeight
      }
      // console.log(contentChartHeight,"=====contentChartHeight")

      // 获取 content-chart margin-top
      let contentChartMarginTop = 0
      if (document.querySelector('.content-chart')) {
        contentChartMarginTop = this.getStyle(document.querySelector('.content-chart'), 'marginTop') * 1
      }
      // console.log(contentChartMarginTop,"=====contentChartMarginTop")
      // 获取 content-chart margin-bottom
      let contentChartMarginBottom = 0
      if (document.querySelector('.content-chart')) {
        contentChartMarginBottom = this.getStyle(document.querySelector('.content-chart'), 'marginBottom') * 1
      }
      // console.log(contentChartMarginBottom,"=====contentChartMarginBottom")

      // 获取 分页器高度
      let paginationHeight = 0
      if (document.querySelector('.pagination-container')) {
        paginationHeight = document.querySelector('.pagination-container').offsetHeight
      }
      // console.log(paginationHeight,"=====paginationHeight")
      let paginationPadding = 0 
      //  if(document.querySelector('.pagination-container')){
      //   paginationPadding = this.getStyle(document.querySelector('.pagination-container'), 'paddingTop') * 1
      //  }
      // console.log(paginationPadding,"=====paginationPadding")
      // let paginationMagin = 0 
      //  if(document.querySelector('.pagination-container')){
      //   paginationMagin = this.getStyle(document.querySelector('.pagination-container'), 'marginTop') * 1
      //  }
      // console.log(paginationMagin,"=====paginationMagin")
       
       // 获取 底部footer高度
       let footFixHeight = 0
       if (document.querySelector('.footFix')) {
         footFixHeight = document.querySelector('.footFix').offsetHeight
       }
       
      const otherHeight = 
        headerHeight * 1 +
        tagsViewHeight * 1 +
        // appMainPadding * 1 +
        tagsViewMargin * 1 +
        appMainWrapperPadding * 1 +
        searchMargin * 1 +
        searchHeight * 1 +
        sectionWrapMargin * 1 +
        sectionWrapPadding * 1 +
        btnHeight * 1 +
        contentChartHeight * 1 +
        contentChartMarginTop * 1 +
        contentChartMarginBottom * 1 +
        paginationHeight * 1 +
        paginationPadding * 1 +
        footFixHeight
      // console.log(otherHeight,"1111111",window.innerHeight)
      return otherHeight
    },
    getCarControlHeight() {
      // 获取header高度
      let headerHeight = 0
      if (document.querySelector('.app-header')) {
        headerHeight = document.querySelector('.app-header').offsetHeight
      }

      // 获取app-main-wrapper padding值
      let appMainWrapperPadding = 0
      if (document.querySelector('.app-main-wrapper')) {
        appMainWrapperPadding = this.getStyle(document.querySelector('.app-main-wrapper'), 'paddingTop') * 2
      }

      // console.log(headerHeight,"=====headerHeight")
      // 获取tags-view-container高度
      let tagsViewHeight = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewHeight = document.querySelector('.tags-view-container').offsetHeight
      }
      // console.log(tagsViewHeight,"=====tagsViewHeight")
      // 获取tags-view-container的margin-bottom
      let tagsViewMargin = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewMargin = this.getStyle(document.querySelector('.tags-view-container'), 'marginBottom')
      }

      let searchHeight = 0
      if (document.querySelector('.search_list')) {
        searchHeight = document.querySelector('.search_list').offsetHeight
      }
      // console.log(searchHeight,"=====searchHeight")
      // 获取 search_list margin
      let searchMargin = 0
      if (document.querySelector('.search_list')) {
        searchMargin = this.getStyle(document.querySelector('.search_list'), 'marginBottom') * 1
      }
      
       // 获取 底部footer高度
       let footFixHeight = 0
       if (document.querySelector('.footFix')) {
         footFixHeight = document.querySelector('.footFix').offsetHeight
       }
       
      const carControlOtherHeight = 
        headerHeight * 1 +
        appMainWrapperPadding * 1 +
        tagsViewHeight * 1 +
        tagsViewMargin * 1 + 
        searchMargin * 1 +
        searchHeight * 1 +
        footFixHeight
      // console.log(otherHeight,"1111111",window.innerHeight)
      return carControlOtherHeight
    },
    getFault4Height(){
      let headerHeight = 0
      if (document.querySelector('.fault-header')) {
        headerHeight = document.querySelector('.fault-header').offsetHeight
      }
      // 获取add-btn padding值
      let pageContentPadding = 0
      if (document.querySelector('.page-content')) {
        pageContentPadding = this.getStyle(document.querySelector('.page-content'), 'paddingTop') * 2
      }
      
      let threeLevelHeadHeight = 0
      if (document.querySelector('.three-level-head')) {
        threeLevelHeadHeight = document.querySelector('.three-level-head').offsetHeight
      }

       // 获取 分页器高度
       let paginationHeight = 0
       if (document.querySelector('.pagination-container')) {
         paginationHeight = document.querySelector('.pagination-container').offsetHeight
       }
       // console.log(paginationHeight,"=====paginationHeight")
       let paginationPadding = 0 
        if(document.querySelector('.pagination-container')){
         paginationPadding = this.getStyle(document.querySelector('.pagination-container'), 'paddingTop') * 1
        }
       
      
      const otherHeight = headerHeight +
      pageContentPadding +
      threeLevelHeadHeight  +
      paginationHeight +
      paginationPadding 
      return otherHeight
    },
    getFault3Height(){
      let headerHeight = 0
      if (document.querySelector('.fault-header')) {
        headerHeight = document.querySelector('.fault-header').offsetHeight
      }
      // 获取add-btn padding值
      let pageContentPadding = 0
      if (document.querySelector('.page-content')) {
        pageContentPadding = this.getStyle(document.querySelector('.page-content'), 'paddingTop') * 2
      }
      let searchHeight = 0
      if (document.querySelector('.fault-search-content')) {
        searchHeight = document.querySelector('.fault-search-content').offsetHeight
      }
      // console.log(searchHeight,"searchHeight")
      // let searchPadding = 0
      // if (document.querySelector('.fault-search-content')) {
      //   searchPadding = this.getStyle(document.querySelector('.fault-search-content'), 'paddingTop') * 1
      // }
      let carInfoHeight = 0
      if (document.querySelector('.carinfo')) {
        carInfoHeight = document.querySelector('.carinfo').offsetHeight
      }
      // console.log(searchHeight,"carInfoHeight")
      let carinfoMargin = 0
      if (document.querySelector('.carinfo')) {
        carinfoMargin = this.getStyle(document.querySelector('.carinfo'), 'marginTop') * 1
      }
      // console.log(carinfoMargin,"carinfoMargin")
      let gridTableHeight = 0
      if (document.querySelector('.grid-table')) {
        gridTableHeight = document.querySelector('.grid-table').offsetHeight
      }
      let gridTableMargin = 0
      if (document.querySelector('.grid-table')) {
        gridTableMargin = this.getStyle(document.querySelector('.grid-table'), 'marginTop') * 1
      }
      let paginationHeight = 0
      if (document.querySelector('.pagination-container')) {
        paginationHeight = document.querySelector('.pagination-container').offsetHeight
      }
      let paginationMargin = 0
      if (document.querySelector('.pagination-container')) {
        paginationMargin = this.getStyle(document.querySelector('.pagination-container'), 'marginTop') * 1
      }
      const otherHeight = headerHeight +
      pageContentPadding +
      carInfoHeight +
      carinfoMargin +
      gridTableHeight +
      gridTableMargin +
      searchHeight +
      paginationHeight +
      paginationMargin 
      return otherHeight

    },
    getStyle(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr].replace('px', '')
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr].replace('px', '')
      }
    },
    getMinHeight() {
      // 获取header高度
      let headerHeight = 0
      if (document.querySelector('.app-header')) {
        headerHeight = document.querySelector('.app-header').offsetHeight
      }
      // 获取search高度
      let searchHeight = 0
      if (document.querySelector('.search_list')) {
        searchHeight = document.querySelector('.search_list').offsetHeight
      }
      // 获取tags-view-container高度
      let tagsViewHeight = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewHeight = document.querySelector('.tags-view-container').offsetHeight
      }
      const minHeight = headerHeight +
        searchHeight +
        tagsViewHeight
      return minHeight
    },
    getHistoryRightHeight(){
      let headerHeight = 0
      if (document.querySelector('.app-header')) {
        headerHeight = document.querySelector('.app-header').offsetHeight
      }
      // 获取tags-view-container高度
      let tagsViewHeight = 0
      if (document.querySelector('.tags-view-container')) {
        tagsViewHeight = document.querySelector('.tags-view-container').offsetHeight
      }
      // 获取app-main padding值
      let appMainPadding = 0
      if (document.querySelector('.app-container')) {
        appMainPadding = this.getStyle(document.querySelector('.app-container'), 'padding') * 2
      }
      // 获取 search_list高度
      let searchHeight = 0
      if (document.querySelector('.paneR .search_list')) {
        searchHeight = document.querySelector('.paneR .search_list').offsetHeight
      }

      const otherHeight = headerHeight +
      tagsViewHeight +
      appMainPadding +
      searchHeight 
      return otherHeight
    },
  },
  mounted() {
    const _this = this
    this.$nextTick(() => {
      const otherHeight = _this.getOtherHeight()
      const minHeight = _this.getMinHeight()
      this.tableHeight = window.innerHeight - otherHeight;
      this.minBoxHeight = document.body.clientHeight - minHeight - 48

      const carControlOtherHeight = _this.getCarControlHeight()
      this.carControlHeight = window.innerHeight - carControlOtherHeight;
    })
    window.onresize = function () {
      const otherHeight = _this.getOtherHeight()
      const minHeight = _this.getMinHeight()
      const carControlOtherHeight = _this.getCarControlHeight()

      _this.$nextTick(() => {
        _this.tableHeight = window.innerHeight - otherHeight;
        _this.minBoxHeight = document.body.clientHeight - minHeight - 48
        _this.carControlHeight = window.innerHeight - carControlOtherHeight;
      })
    }
    if (document.querySelector('.search-collapse')) {
      document.querySelector('.search-collapse').addEventListener('click', function () {
        const otherHeight = _this.getOtherHeight()
        const minHeight = _this.getMinHeight()
        const carControlOtherHeight = _this.getCarControlHeight()
        _this.$nextTick(() => {
          _this.tableHeight = window.innerHeight - otherHeight;
          _this.minBoxHeight = document.body.clientHeight - minHeight - 48;
          _this.carControlHeight = window.innerHeight - carControlOtherHeight;
        })
      })
    }

  }
}

export { otherHeight }
