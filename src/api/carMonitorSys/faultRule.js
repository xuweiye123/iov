import request from '@/utils/request'

/**
 * 获取故障规则列表
 * @param {*} data 
 */
function getFaultRules(params){
  return request({
		url: "/ruleFault/selectFaultRulesList",
		method: "get",
		params,
	});
}

function addFaultRules(data){
    return request({
			url: "/ruleFault/createRule",
			method: "post",
			data,
		});
  }
  function  editFaultRules(data){
    return request({
			url: "/ruleFault/updateRule",
			method: "post",
			data,
		});
  }
  function deleteFaultRules(data){
    return request({
			url: "/ruleFault/deleteRule",
			method: "post",
			data,
		});
  }

  function getfaultcode(params){
    return request({
			url: "/ruleFault/faultCodes",
			method: "get",
			params,
		});
  }

export {
    getFaultRules,
    addFaultRules,
    editFaultRules,
    deleteFaultRules,
    getfaultcode
}