<template>
	<div>
		<!-- <router-link v-if="to == 'Month'" target="_blank" :to="{ name: 'monthfull'}">
      <slot />
    </router-link> -->
		<span @click="goTo(to)">
			<slot />
		</span>
	</div>
</template>

<script>
import { validateURL } from "@/utils/validate";

export default {
	props: {
		to: {
			type: String,
			required: true,
		},
	},

	methods: {
		isExternalLink(routePath) {
			return validateURL(routePath);
		},
		goTo(to) {
			if (to == "month") {
				let routeUrl = this.$router.resolve({
					path: "/monthfull",
				});
				window.name = "yunkongUI";
				window.open(routeUrl.href, "yuebaoUI");
			} else if (to == "screenMap") {
				 console.log(this.$store,123,this.$store.getters.interfacePrefix,)
        this.$store.commit("setMapInterface", this.$store.getters.interfacePrefix);
				window.name = "bjevCloudUIMap";
				window.open("/map/index.html", "bjevCloudScreen");
			}else {
				this.$router.push({ name: to });
			}
			
			// else if (to == "dailyOperations") {
			// 	let routeUrl = this.$router.resolve({
			// 		path: "/dailyOperations",
			// 	});
			// 	window.name = "bjevDailyOperationsCloudUI";
			// 	window.open(routeUrl.href, "bjevdailyOperations");
			// } 
			
			//  else if (to == "mapGridStatistics") {
			// 	let routeUrl = this.$router.resolve({
			// 		path: "/mapGridStatistics",
			// 	});
			// 	window.name = "bjevmapGridStatisticsCloudUI";
			// 	window.open(routeUrl.href, "bjevmapGridStatistics");
			// } 
			
		},
	},
};
</script>
