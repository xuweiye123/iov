import request from '@/utils/request'

function getSecurityLibList(data){
    return request({
        url: 'securityLib/getSecurityLibList',
        method: 'POST',
        data
    })
}

function createOtxfile(data) {
	return request({
		url: "/securityLib/createOtxfile",
		method: "POST",
		data,
	});
}
 
function createSecurityLib(data) {
	return request({
		url: "securityLib/createSecurityLib",
		method: "POST",
		data,
	});
}

function deleteSecurityLib(data){
    return request({
        url: 'securityLib/deleteSecurityLib',
        method: 'delete',
        data
    })
}

// otd
function getOtxList(data){
  return request({
      url: '/securityLib/getOtxList',
      method: 'POST',
      data
  })
}
function getCarTypeList(data){
  return request({
      url: '/securityLib/getCarTypeList',
      method: 'get',
      data
  })
}

export {
    getSecurityLibList,
    createSecurityLib,
    deleteSecurityLib,
    getOtxList,
    getCarTypeList,
    createOtxfile
}