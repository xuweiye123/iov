/**
 * 分页查询混入
 * 组件必须有一个listLoad方法用来加载列表数据
 */
const tableStyle = {
  data(){
    return {
      color: ''
    }
  },
  created() {
    // console.log(this.$store.state.theme)
    // const activeName = this.$store.state.theme.activeName
    
  },
  methods: {
    headerRowStyle(){
      return {height: '40px'}
    },
    rowStyle(){
      return {
        height: '40px',
        background: this.$store.state.theme.activeName==='default'? '#151a20': '#fff',
        color: this.$store.state.theme.activeName==='default'? '#BCD5F1' : '#262834'
      }
    },
    headerCellStyle(){
      return {
        background: this.$store.state.theme.activeName==='default'? '#171f28': '#F2F3F5',
        color:this.$store.state.theme.activeName==='default'? '#FFFFFF': '#262834',
      }
    }
  }
}
export {
  tableStyle
}
