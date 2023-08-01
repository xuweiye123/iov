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
		var obj = {};
	},
};
</script>
