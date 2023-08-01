<template>
	<div v-loading.fullscreen.lock="fullscreenLoading"></div>
</template>

<script>
import { getUrlParmas } from "@/utils/auth";
export default {
	name: "Login",
	data() {
		return {
			fullscreenLoading: false,
		};
	},
	mounted() {
		this.fullscreenLoading = true;
		let { ticket } = getUrlParmas();
		if (ticket) {
			let params = { ticket };
			this.$store
				.dispatch("uuapLogin", params)
				.then((data) => {
					this.fullscreenLoading = false;
					if (data.code == 0) {
						this.$router.push({ name: "fastEntry" });
						window.history.replaceState(null, null, window.location.origin);
					} else {
						setTimeout(() => {
							this.$store.dispatch("logoutOffline");
						}, 500);
					}
				})
				.catch(() => {
					this.fullscreenLoading = false;
					this.$store.dispatch("logoutOffline");
				});
		}
	},
	methods: {},
};
</script>
