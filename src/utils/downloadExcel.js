
// import { Notification } from 'element-ui'
/**
 * 导出文件
 * @param {*} res
 */
export default function downLoadExcel(res) {
  const disposition = res.headers['content-disposition']
  if (disposition) {
    if (disposition.indexOf('filename=') > -1) {
      const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
      // , { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      const blob = new Blob([res.data])
      if (fileName && blob) {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName)
        } else {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          document.body.appendChild(link)
          // 此写法兼容火狐
          const evt = document.createEvent('MouseEvents')
          evt.initEvent('click', false, false)
          link.dispatchEvent(evt)
          document.body.removeChild(link)
        }
      }
    }
  }
}
