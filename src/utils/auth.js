import Cookies from 'js-cookie'
const TokenKey = 'apollo-JWT-TH-Token'
const UserLanguage = 'apollo-user-language'
const Theme = 'apollo-theme'
const SelectedSys = 'apollo-SelectedSys'
const MapInterfaceKey ="apollo-interface-map" 
// 请求token
function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}


function getUrlParmas(){
  let search  =  window.location.search || ("?" + window.location.hash.split('?')[1]); 
  let paras = decodeURI(search); //search获得地址中的参数，内容为'?itemId=1'
	let result = paras != "" ?  paras.match(/[^\?&]*=[^&]*/g) : ""; //match是字符串中符合的字段一个一个取出来，result中的值为['login=xx','table=admin']
	paras = {}; //让paras变成没有内容的json对象
	for (let i in result) {
		let temp = result[i].split("="); //split()将一个字符串分解成一个数组,两次遍历result中的值分别为['itemId','xx']
		paras[temp[0]] = temp[1];
  }
  return paras
}

function setToken(token) {
  // return Cookies.set(TokenKey, token, { expires: 360 * 50 })
  return localStorage.setItem(TokenKey, token)
}
function setMapInterface(mapInterface) {
  return Cookies.set(MapInterfaceKey, mapInterface, { expires: 360 * 50 })
}

function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}
// 用户语言设置
function getUserLanguage() {
  return (Cookies.get(UserLanguage) || 'zh')
}
function setUserLanguage(lang) {
  return Cookies.set(UserLanguage, lang, { expires: 360 * 50 })
}
function removeUserLanguage() {
  return Cookies.remove(UserLanguage)
}

// 用户主题设置
function getTheme() {
  return Cookies.get(Theme)
}
function setTheme(theme) {
  return Cookies.set(Theme, theme, { expires: 360 * 50 })
}
function removeTheme() {
  return Cookies.remove(Theme)
}


function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

//所选中系统
function getSelectedSys() {
  return Cookies.get(SelectedSys)
}
function setSelectedSys(selectedSys) {
  return Cookies.set(SelectedSys, selectedSys, { expires: 360 * 50 })
}
function selectedSysTheme() {
  return Cookies.remove(SelectedSys)
}
export {
  getToken,
  getUrlParmas,
  setToken,
  setMapInterface,
  removeToken,
  getUserLanguage,
  setUserLanguage,
  removeUserLanguage,
  setTheme,
  getTheme,
  removeTheme,
  removeRefreshToken,
  getSelectedSys,
  setSelectedSys,
  selectedSysTheme

}
