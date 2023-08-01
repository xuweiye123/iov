import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import elementThLocale from 'element-ui/lib/locale/lang/th'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
// import thailandLocale from './th'
// console.log(zhLocale)
// let result1 = []
// function transformData(obj1,obj2,res){
//   for(let key in obj1){
//     if(typeof obj1[key] === 'object'){
//       transformData(obj1[key],obj2[key],res)
//     }else{
//       let value1 = obj1 && obj1[key]
//       let value2 = obj2 && obj2[key]
//       if(!value1.includes('px') && isNaN(+value1)){
//         res.push({name: key,value1,value2})
//       }
//     }
//   }
// }
// transformData(enLocale,zhLocale,result1)
// console.log(JSON.stringify(result1))

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh',
  messages
})

export default i18n
