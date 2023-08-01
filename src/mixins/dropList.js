import { getProtocolList } from "@/api/transmitSys/commont"; // 数据转发管理--协议名称列表

// 数据转发管理--协议名称列表
const getProtocolListMixin = {
	data() {
		return {
			protocolList: [],
		};
	},
	created() {
		getProtocolList()
			.then(({ data }) => {
				if (data.code === 0) {
					this.protocolList = data.data;
				}
			})
			.catch(() => {});
	},
};

export { getProtocolListMixin };
