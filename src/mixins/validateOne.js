import reg from "@/utils/reg";
/* 

rules: {
	functionName: [
		{
			required: true, //必填，若非必填则去掉此属性或值为false
			trigger: ["blur", "change"],
			validator: this.validInput,
			ruleReg: 'functionName', //此处对应reg.js文件中的正则
			minLength: 5, //至少输入多少位
			tips: "请输入中文菜单名称", //必填时报错信息
			errorTips: "支持汉字、字母、数字", //正则匹配不正确时报错信息
			formObjName:'formInfo',
		},
	],
} 

*/
const checkFormRule = {
	methods: {
		validInput(rule, value, cb) {
			// console.log(11111111,rule, value)
			let newValue;
			if (rule.formObjName) {
				newValue = value || this[rule.formObjName][rule.fullField];
			} else {
				newValue = value;
			}
			// console.log(2222222222,rule, value,newValue)

			//正则检验
			if (newValue != undefined && newValue != null && newValue != "" ) {
				if(rule.minLength && newValue.length < rule.minLength){
					return cb(new Error(`至少${rule.minLength}位`));
				}
				if (rule.ruleReg) {
					if (!reg[rule.ruleReg].test(newValue)) {
						return cb(new Error(rule.errorTips ? rule.errorTips : rule.tips));
					}
				}
			}else{
				if (
						rule.required &&
						!(newValue === 0 ? newValue + "" : newValue)
				) {
					// console.log(newValue,"value1")
					return cb(new Error(rule.tips));
				}
			}

		},
	},
};
export { checkFormRule };
