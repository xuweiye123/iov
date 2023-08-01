function validUsername(str) {
  const valid_map = ['admin', 'user1']
  return valid_map.indexOf(str.trim()) >= 0
}
function validPassword(str) {
  var reg = new RegExp('^(?=.{8,18})(((?=.*[A-Z])(?=.*[a-z0-9\\W_]))|((?=.*[a-z])(?=.*[0-9\\W_]))|((?=.*[0-9])(?=.*[\\W_]))).*$', 'g')
  return reg.test(str)
}
/* 合法uri*/
function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

export {
  validUsername,
  validPassword,
  validateURL,
}
