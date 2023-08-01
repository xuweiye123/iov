import request from '@/utils/request'

/**
 * 获取实验车辆报废信息
 * @param data
 * @returns {*}
 */
function getList(data) {
    return request({
        url:'/carexperimental/list',
        method:'post',
        data
    })
}

/**
 * 增加实验车辆报废信息
 * @param data
 * @returns {*}
 */
function add(data) {
    return request({
        url:'/carexperimental/add',
        method:'post',
        data
    })
}

    /**
 * 导出错误信息
 * @param {*} data 
 */
     function exportCar(data){
        return request({
            url:'/carexperimental/export',
            method:'post',
            responseType: 'arraybuffer',
            data
        })
      }
export {
    getList,
    add,
    exportCar
}