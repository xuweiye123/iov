import i18n from "@/lang";
import { getUserLanguage } from "@/utils/auth";
i18n.locale = getUserLanguage();
// 用到的公共数据在此处维护
const commontData = {
	state: {
		keys: "commontData",
		// usertypeList: [
		// 	{ label: "内部用户", value: 0 },
		// 	{ label: "外部用户 ", value: 1 },
		// ],
		carVehicleList: [
			{ label: "商品车", value: 1 },
			{ label: "试验车", value: 2 },
			{ label: "对标车", value: 3 },
		],
		carVehicleListSY: [
			{ label: "试验车", value: 2 },
			{ label: "对标车", value: 3 },
		],
		downLoadType: [
			{ label: "Excel", value: 1 },
			// { label: "INR", value: 2 },
			{ label: "CSV", value: 4 },
		],
		downLoadStatus: [
			{ label: "排队中", value: 1 },
			{ label: "进行中", value: 2 },
			{ label: "压缩中 ", value: 3 },
			{ label: "已完成", value: 4 },
			{ label: "异常", value: 5 },
			{ label: "无历史数据", value: 6 },
		],
		downLoadStatus1: [
			{ label: "排队中", value: 1 },
			{ label: "进行中", value: 2 },
			// { label: '压缩中 ', value: 3 },
			{ label: "已完成", value: 3 },
			{ label: "异常", value: 4 },
			// { label: '无历史数据', value: 6 }
		],
		// 国标故障类型
		gbFaultType: [
			{ label: "国标故障", value: 1 },
			{ label: "自定义故障", value: 2 },
		],
		// 国标故障等级
		gbFaultlevel: [
			{ label: "一级", value: 1 },
			{ label: "二级", value: 2 },
			{ label: "三级", value: 3 },
		],
		// 自定义国标故障等级
		faultlevel: [
			{ label: "一级", value: 1 },
			{ label: "二级", value: 2 },
			{ label: "三级", value: 3 },
			{ label: "四级", value: 4 },
		],
		// 是否有效
		yesNo: [
			{ label: "有效", value: 1 },
			{ label: "无效", value: 0 },
		],
		// 车辆状态
		carStatus: [
			{ label: "正常", value: 1 },
			{ label: "报废", value: 2 },
			{ label: "TBOX更换", value: 3 },
			{ label: "其他", value: 4 },
		],
		//解析状态
		analysisStatus: [
			{ label: "未解析", value: "0" },
			{ label: "已解析", value: "1" },
		],
		//解析状态1
		analysisStatus1: [
			{ label: "未解析", value: 0 },
			{ label: "解析成功", value: 1 },
			{ label: "解析失败", value: -1 },
		],
		//文件类型
		fileTypeList: [
			{ label: "原始日志", value: "0" },
			{ label: "Tbox日志", value: "1" },
			{ label: "ECU日志", value: "2" },
		],
		// 参数类型
		paramTypeList: [
			{ label: "报警数据", value: 1 },
			{ label: "发动机数据", value: 2 },
			{ label: "极值数据", value: 3 },
			{ label: "燃料电池数据", value: 4 },
			{ label: "可充电储能装置", value: 5 },
			{ label: "车辆位置数据", value: 6 },
			{ label: "整车数据", value: 7 },
			{ label: "驱动电机数据", value: 8 },
		],
	},
};
export default commontData;
