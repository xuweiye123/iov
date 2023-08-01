import request from '@/utils/request'

/**
 * 获取字典列表
 */
function getDictionaryList(data){
  return request({
    url: '/dictionary/getDictionaryList',
    method: 'post',
    data
  })
}

/**
 * 新增字典
 */
function createDictionary(data){
  return request({
    url: '/dictionary/createDictionary',
    method: 'post',
    data
  })
}
/**
 * 编辑字典
 */
function updateDictionary(data){
  return request({
    url: '/dictionary/updateDictionary',
    method: 'put',
    data
  })
}
/**
 * 删除字典
 */
function deleteDictionary(data){
  return request({
    url: '/dictionary/deleteDictionary',
    method: 'DELETE',
    data
  })
}

/**
 * 查看字典子项
 */
function getDictionaryChildren(data){
  return request({
    url: '/dictionary/getDictionarySubList',
    method: 'post',
    data
  })
}
/**
 * 新增字典子项
 */
function createDictionaryItem(data){
  return request({
    url: '/dictionary/createDictionarySub',
    method: 'post',
    data
  })
}
/**
 * 编辑子字典
 */
function updateDictionaryItem(data){
  return request({
    url: '/dictionary/updateDictionarySub',
    method: 'put',
    data
  })
}

/**
 * 删除子字典
 */
function deleteDictionaryItem(data){
  return request({
    url: '/dictionary/deleteDictionarySub',
    method: 'delete',
    data
  })
}
// 获取字典/字典值编号
function getDictionaryCode(data){
  return request({
    url: '/dictionary/getDictionaryCode',
    method: 'post',
    data
  })
}
export {
  getDictionaryList,
  createDictionary,
  updateDictionary,
  deleteDictionary,
  getDictionaryChildren,
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem,
  getDictionaryCode
}
