
import request from '@/utils/request'
/**
 * 获取角色列表 
 * @param {*} data 
 */
function getRole(data){
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}
/**
 * 新增角色 
 * @param {*} data 
 */
function createRole(data){
    return request({
      url: '/role',
      method: 'post',
      data
    })
  }


/**
 * 编辑角色 
 * @param {*} obj
 */
function updateRole(obj) {
    return request({
      url: `/role/${obj.roleId}`,
      method: 'put',
      data:obj
    })
  }


 /**
 * 设置角色权限菜单
 * TODO
 * @param {*} obj
 */
function setRoleMenu(data) {
    return request({
      url: "/role/assignPermissions",
      method: 'post',
      data
    })
  }
  /**
 * 删除角色
 * @param {*} data
 */
function deleteRole(data) {
    return request({
      url: `/role/${data.id}`,
      method: 'delete',
      data
    })
  }

/**
 * 获取对应角色菜单树
 * TODO
 * 
 */
function getRoleMenuTree(roleId){
    return request({
      url: `/role/queryRolePermissions/${roleId}`,
      method: 'get',
      roleId    
    })
  } 


/**
 * 获取角色所有菜单
 */
function getAllRoleMenu(){
  return request({
    url: '/role/function/get/all',
    method: 'get',
  })
}

/**
 * 获取角色设置菜单
 */
function getRoleSetMenu(id){
  return request({
    url: `/role/function/get/set/${id}`,
    method: 'get',
  })
}

/**
 * 获取所有角色
 * TODO
 * @param {*} data 
 */
 function allRole() {
  return request({
    url: '/role/allRole',
    method: 'GET'
  })
}



/**
 * 根据名称获取角色
 * TODO
 * @param {*} data 
 */
 function getRoleByName(data) {
  return request({
    url: '/role/getRoleByName',
    method: 'POST',
    data
  })
}

/**
* 验证角色是否重复
TODO
不需要，提交的时候会验证是否重复
* 
*/
function isRepeatRole(data) {
  return request({
    url: "/role/checkRoleName",
    method: 'get',
    data
  })
}   

function getCountInfo(data) {
  return request({
    url: "/map/getWsPort",
    method: 'get',
    data
  })
} 

export {
    getRole,
    createRole,
    updateRole,
    setRoleMenu,
    deleteRole,
    getRoleMenuTree,
    isRepeatRole,
    getAllRoleMenu,
    getRoleSetMenu,
    allRole,
    getRoleByName,
    getCountInfo
  }