
function handleExportFailInfo(data,text) {
  if (data.length === 0) {
    this.$message.warning({
      message: '无导入失败信息',
      duration: 2 * 1000
    })
    return false
  }
  // 要导出的json数据
  const jsonData = data
  // 列标题
  let str = '<tr><td>'+text+'</td><td>失败原因</td></tr>'
  // 循环遍历，每行加入tr标签，每个单元格加td标签
  for (let i = 0; i < jsonData.length; i++) {
    str += '<tr>'
    for (const item in jsonData[i]) {
      // 增加\t为了不让表格显示科学计数法或者其他格式
      str += `<td>${jsonData[i][item] + '\t'}</td>`
    }
    str += '</tr>'
  }
  // Worksheet名
  const worksheet = 'Sheet1'
  const uri = 'data:application/vnd.ms-excel;base64,'

  // 下载的表格模板数据
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  xmlns:x="urn:schemas-microsoft-com:office:excel" 
  xmlns="http://www.w3.org/TR/REC-html40">
  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>${worksheet}</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${str}</table></body></html>`
  // 下载模板
  window.location.href = uri + base64(template)
}
function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)))
}
export {
  handleExportFailInfo
}