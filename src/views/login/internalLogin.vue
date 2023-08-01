<template>
	<div v-loading.fullscreen.lock="fullscreenLoading"></div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
	name: "Login",
	data() {
		return {
			fullscreenLoading: false,
		};
	},
	mounted() {
		this.fullscreenLoading = true;
		if (getToken()) {
			this.fullscreenLoading = false;
			this.$router.push({ name: "fastEntry" });
		} else {
			setTimeout(() => {
				this.fullscreenLoading = false;
				this.urlTo();
			}, 500);
		}
	},
	methods: {
		urlTo() {
			let locationUrl = window.location.origin + '/#/uuapLogin';
			let uuapAppKey = this.$store.state.user.uuapAppKey;
			let uuapAuthUrl = this.$store.state.user.uuapAuthUrl;
			//pToken 存在于baidu.com（baidu-int.com）域名下，cookie的名字为UUAP_P_TOKEN，线下环境统一为UUAP_P_TOKEN_OFFLINE
			window.location.href = `${uuapAuthUrl}/login?appKey=${uuapAppKey}&service=${encodeURIComponent(
				locationUrl
			)}&version=v2`;
		},
	},
};
</script>
