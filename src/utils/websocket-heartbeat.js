/**
 * `WebsocketHeartbeatJs` constructor.
 *	
 * @param {Object} opts
 * {
 *  url                  websocket链接地址
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    pingMsg
 * }
 * @api public
 */
/**
 * 
 * 与后端的约定
 * 1.关闭websocket连接
 * 如果需要断开websocket，应该执行WebsocketHeartbeatJs.close()，
 * WebsocketHeartbeatJs.ws是原生Websocket实例对象，WebsocketHeartbeatJs.ws.onclose，已经被绑定了重连方法，
 * 如果后端websocket服务直接关闭连接，前端WebsocketHeartbeatJs.ws.onclose会被执行，WebsocketHeartbeatJs会尝试重连。
 * 如果后端想告诉前端需要断开连接，需要发送特定消息给前端，前端收到特定消息，调用WebsocketHeartbeatJs.close()，
 * WebsocketHeartbeatJs将不会重连。
 *  websocketHeartbeatJs.onmessage = (e) => {
    if(e.data == 'close') websocketHeartbeatJs.close();
	}
	2.ping & pong
	前端发送ping消息，后端收到后，需要立刻返回pong消息，pong消息可以是任何值，
	websocket-heartbeat-js并不处理pong消息，而只是在收到任何消息后，重置心跳，因为收到任何消息就说明连接是正常的。
 */

function WebsocketHeartbeatJs({
	url,
	protocols = "",
	pingTimeout = 15000,
	pongTimeout = 10000,
	reconnectTimeout = 2000,
	pingMsg = "heartbeat",
	repeatLimit = null,
}) {
	this.opts = {
		url: url,
		protocols,
		pingTimeout: pingTimeout,
		pongTimeout: pongTimeout,
		reconnectTimeout: reconnectTimeout,
		pingMsg: pingMsg,
		repeatLimit: repeatLimit,
	};
	this.ws = null; //websocket实例
	this.repeat = 0;

	//override hook function
	this.onclose = () => {};
	this.onerror = () => {};
	this.onopen = () => {};
	this.onmessage = () => {};
	this.onreconnect = () => {};

	this.createWebSocket();
}
WebsocketHeartbeatJs.prototype.createWebSocket = function() {
	try {
		if (this.opts.protocols)
			this.ws = new WebSocket(this.opts.url, this.opts.protocols);
		else this.ws = new WebSocket(this.opts.url);
		this.initEventHandle();
	} catch (e) {
		this.reconnect();
		throw e;
	}
};

WebsocketHeartbeatJs.prototype.initEventHandle = function() {
	this.ws.onclose = () => {
		this.onclose();
		this.reconnect();
	};
	this.ws.onerror = () => {
		this.onerror();
		this.reconnect();
	};
	this.ws.onopen = () => {
		this.repeat = 0;
		this.onopen();
		//心跳检测重置
		this.heartCheck();
	};
	this.ws.onmessage = (event) => {
		this.onmessage(event);
		//如果获取到消息，心跳检测重置
		//拿到任何消息都说明当前连接是正常的
		this.heartCheck();
	};
};

WebsocketHeartbeatJs.prototype.reconnect = function() {
	if (this.opts.repeatLimit > 0 && this.opts.repeatLimit <= this.repeat) return; //limit repeat the number
	if (this.lockReconnect || this.forbidReconnect) return;
	this.lockReconnect = true;
	this.repeat++; //必须在lockReconnect之后，避免进行无效计数
	this.onreconnect();
	//没连接上会一直重连，设置延迟避免请求过多
	setTimeout(() => {
		this.createWebSocket();
		this.lockReconnect = false;
	}, this.opts.reconnectTimeout);
};
WebsocketHeartbeatJs.prototype.send = function(msg) {
	this.ws.send(msg);
};
//心跳检测
WebsocketHeartbeatJs.prototype.heartCheck = function() {
	this.heartReset();
	this.heartStart();
};
WebsocketHeartbeatJs.prototype.heartStart = function() {
	if (this.forbidReconnect) return; //不再重连就不再执行心跳
	// this.pingTimeoutId = setTimeout(() => {//2022/22/9 暂时修改为循环定时器 ↓↓↓
	this.pingTimeoutId = setInterval(() => {
		//这里发送一个心跳，后端收到后，返回一个心跳消息，
		//onmessage拿到返回的心跳就说明连接正常
		this.ws.send(this.opts.pingMsg);
		//如果超过一定时间还没重置，说明后端主动断开了
		//=========================2022/22/9 暂时不需要 判断后端是否主动断开了 ↓↓↓
		// this.pongTimeoutId = setTimeout(() => {
		// 	//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
		// 	this.ws.close();
		// }, this.opts.pongTimeout);
		//=========================2022/22/9 暂时不需要 判断后端是否主动断开了 ↑↑↑
	}, this.opts.pingTimeout);
};
WebsocketHeartbeatJs.prototype.heartReset = function() {
	clearInterval(this.pingTimeoutId);
	//2022/22/9 暂时修改为清除循环定时器 ↑↑↑
	// clearTimeout(this.pingTimeoutId);
	//=========================2022/22/9 暂时不需要 判断后端是否主动断开了 ↓↓↓
	// clearTimeout(this.pongTimeoutId);
};
WebsocketHeartbeatJs.prototype.close = function() {
	//如果手动关闭连接，不再重连
	this.forbidReconnect = true;
	this.heartReset();
	this.ws.close();
};
if (typeof window != "undefined")
	window.WebsocketHeartbeatJs = WebsocketHeartbeatJs;
export default WebsocketHeartbeatJs;
