
import store from '@/store'

/**
 * 获取页面按钮
 * @param {*} url
 */
function _getNewPageButton(url) {
  const list = store.getters.addRealRouters
  let result = []
  if (list.length === 0) return result
  ergodicPage(list, url)
  function ergodicPage(list, url) {
    list.forEach(item => {
      if (item.name === url&&item.functionType==1) {
        result = item.button || []
      }
      if(!(item.button&&item.button.length)){
        if (item.children && item.children.length > 0) {
          ergodicPage(item.children, url)
        }
      }
    })
  }
  return result
}
export {
  _getNewPageButton
}
