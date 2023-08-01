import CryptoJS from "crypto-js";

export default {
  // 随机生成1000到9999之间的随机值 
  randomNumber(){
    var min = 1000;
    var max = 9999;
    var s = Math.round(Math.random() * (max - min)) + min;
    return s;
  },
  //随机生成n位数字
  generateMixed(n) {
    var chars = "1234567890";
    var res = "",
      i;
    for (var j = 1; j <= 4; j++) {
      i = parseInt(10 * Math.random());
      res = res + chars.charAt(i);
    }
    return res;
  },
  // 转为16进制
  tringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
      if (val == "") {
        val = str.charCodeAt(i).toString(16);
      } else {
        val += str.charCodeAt(i).toString(16);
      }
    }
    return val;
  },
  //生成指定秘钥
  generatekey(time, noce, accessKey) {
    let usersalt = "fb9ae309-c92b-11ed-9a80-525400228a43";
    let str = usersalt + time + noce + accessKey;
    let strs = this.tringToHex(str);
    let key = strs.substring(0, 16);
    // console.log(key,112,strs)
    return key;
  },
  //加密
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : "6662396165333039"; //判断是否存在ksy，不存在就用定义好的key
    var key = CryptoJS.enc.Utf8.parse(keyStr);

    var jsonData = JSON.stringify(word);
    var srcs = CryptoJS.enc.Utf8.parse(jsonData);

    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return CryptoJS.enc.Hex.stringify(encrypted.ciphertext).toUpperCase();
  },
  //解密
  decrypt(word,keyStr) {
    
    keyStr = keyStr ? keyStr : "6662396165333039"; //判断是否存在ksy，不存在就用定义好的key
    var key = CryptoJS.enc.Utf8.parse(keyStr);

    let base64 = CryptoJS.enc.Hex.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);
  
    var decrypt = CryptoJS.AES.decrypt(src, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
  
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

};
