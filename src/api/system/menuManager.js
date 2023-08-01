
import request from '@/utils/request'

/**
 * 获取所有菜单 
 */
function getAllMenu(){
  return request({
    url: '/function/list',
    method: 'get'
  })
}
/**
 * 新增菜单 
 * @param {*} data 
 */
function createMenu(data){
  return request({
    url: '/function',
    method: 'post',
    data
  })
}

/**
 * 编辑菜单 
 * @param {*} data 
 */
function updateMenu(obj){
  return request({
    url: `/function/${obj.id}`,
    method: 'put',
    data: obj.data
  })
}

/**
 * 删除菜单 
 * @param {*} data 
 */
function deleteMenu(obj){
  console.log(obj,"obj")
  return request({
    url: `/function/${obj.id}`,
    method: 'delete',
    data:{ functionName:obj.data.functionName }
  })
}

/**
 * 获取当前菜单
 * TODO
 * @param {*} data 
 */
function getUserMenu(){
  return request({
    url: '/user/current/function/system',
    method: 'get'
  })
}

export {
  getAllMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  getUserMenu
}
