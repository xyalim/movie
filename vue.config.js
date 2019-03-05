//vue.config.js
module.exports = {
	//选项...
	baseUrl: './',
	devServer:{
		hot:true,
		//代理
//		proxy:{
//			'/maoyan':{
//				//真正的目标
//				target:'http://m.maoyan.com/',
//				//websocket
//				ws:true,
//				//是否跨域
//				changeOrigin:true,
//				pathRewrite:{
//					'^/maoyan':''
//				}
//			}
//		}
	}
}
