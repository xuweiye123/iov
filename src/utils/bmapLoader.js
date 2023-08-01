export function BMapLoader(ak) {
	return new Promise((resolve, reject) => {
		if (window.BMapGL) {
			resolve(window.BMapGL);
		} else {
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src =
				"https://api.map.baidu.com/api?v=1.0&type=webgl&callback=initBMap&ak=" +
				ak;
			script.async = true;
			script.onerror = reject;
			document.head.appendChild(script);
		}
		window.initBMap = function() {
			resolve(window.BMapGL);
		};
	});
}
