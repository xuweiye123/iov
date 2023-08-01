import request from '@/utils/request'

/**
 * 获取g过滤规则
 * @param {*} data
 */
 function getFileTerRule(data) {
	return request({
		url: "/filterRules/getFileTerRule",
		method: "post",
		data,
	});
}
/**
 * 获取该链路下所有过滤规则
 * @param {*} data
 */
 function getLinkRuleList(data) {
	return request({
		url: "/fLinkRuleEntity/getLinkRuleList",
		method: "post",
		data,
	});
}
/**
 * 添加过滤规则
 * @param {*} data
 */
 function createLinkRule(data) {
	return request({
		url: "/fLinkRuleEntity/createLinkRule",
		method: "post",
		data,
	});
}
/**
 * 获取过滤规则下拉框
 * @param {*} data
 */
function getProtocolVariableOption() {
  return request({
    url: "common/getProtocolVariableOption",
    method: "get",
  });
}

/**
 * 获取过滤规则删除
 * @param {*} data
 */
 function deleteFileTerRule(data) {
  return request({
    url: "/filterRules/deleteFileTerRule",
    method: "post",
    data,
  });
}
/**
 * 新增过滤规则
 * @param {*} data
 */
 function createFileTerRule(data) {
  return request({
    url: "/filterRules/createFileTerRule",
    method: "post",
    data,
  });
}
/**
 * 获取过滤规则删除
 * @param {*} data
 */
 function updateFileTerRule(data) {
  return request({
    url: "/filterRules/updateFileTerRule",
    method: "post",
    data,
  });
}
/**
 * 删除过滤规则
 * @param {*} data
 */
 function delLinkRule(data) {
  return request({
    url: "/fLinkRuleEntity/delLinkRule",
    method: "post",
    data,
  });
}
/**
 * 历史数据抽取查询过滤规则
 * @param {*} data
 */
function getExtractRuleList(data) {
  return request({
    url: "/ExtractRule/getExtractRuleList",
    method: "post",
    data,
  });
}
/**
 * 历史数据抽取删除过滤规则
 * @param {*} data
 */
function delExtractRule(data) {
  return request({
    url: "/ExtractRule/delExtractRule",
    method: "post",
    data,
  });
}
export {
  getFileTerRule,
  getProtocolVariableOption,
  deleteFileTerRule,
  updateFileTerRule,
  createFileTerRule,
  getLinkRuleList,
  createLinkRule,
  delLinkRule,
  getExtractRuleList,
  delExtractRule,
}