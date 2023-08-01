import { Message } from 'element-ui'
export default function readExcel(files) { // 表格导入
  return new Promise(function(resove, reject) {
    if (files.length <= 0) { // 如果没有文件名
      reject(false)
      return false
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      Message.warning('上传格式不正确，请上传xls或者xlsx格式')
      reject(false)
      return false
    }
    resove(true)
  })
}