import appCommandComponents from "./index.vue";
const appCommandBtn = {
	install: function(Vue) {
		Vue.component("appCommandBtn", appCommandComponents);
	},
};
export default appCommandBtn;
