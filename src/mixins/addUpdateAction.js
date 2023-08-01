/**
 * 新增 编辑 删除等基础方法混入
 */
const addUpdateAction = {
	data() {
		return {
			addUpdateVisible: false, // 新增编辑弹窗
			isEdit: false, // 是否编辑
		};
	},
	methods: {
		/**
		 * 新增
		 */
		handleAdd() {
			this.isEdit = false;
			this.addUpdateVisible = true;
		},
		/**
		 * 新增完成
		 */
		addComplete() {
			this.listLoad();
			this.$message.success({
				message: this.$t("addUpdateAction.createSuccess"),
				duration: 2 * 1000,
			});
		},
		/**
		 * 编辑
		 * @param {object} row - 行数据
		 */
		handleUpdate(row) {
			if (row) this.tableRow = row;
			this.isEdit = true;
			this.addUpdateVisible = true;
		},
		/**
		 * 编辑完成
		 */
		updateComplete() {
			this.listLoad();
			this.$message.success({
				message: this.$t("addUpdateAction.updateSuccess"),
				duration: 2 * 1000,
			});
		},
		/**
		 * 删除完成
		 */
		deleteComplete() {
			this.listLoad();
			this.$message.success({
				message: this.$t("addUpdateAction.deleteSuccess"),
				duration: 2 * 1000,
			});
		},
	},
};
export { addUpdateAction };
