	import axios from 'axios'
	import { Indicator } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
	var $ax = function (url,type,data,success) {
		this.url = url;
		this.type = type;
		this.data = data;
		this.success=success;
	};
	
	$ax.prototype = {
		start : function () {	
			
			if (this.url.indexOf("?") == -1) {
				this.url = this.url + "?jstime=" + new Date().getTime();
			} else {
				this.url = this.url + "&jstime=" + new Date().getTime();
			}
			
			axios({
  			// `url` 是用于请求的服务器 URL
  			url:  this.url,

			  // `method` 是创建请求时使用的方法
			  method: this.type, // 默认是 get

			  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
			  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
			 	baseURL: '/api',
			  // `data` 是作为请求主体被发送的数据
			  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
			  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
			  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
			  // - 浏览器专属：FormData, File, Blob
			  // - Node 专属： Stream
			  // data: this.data,
			  params:this.data,
			  responseType: 'json', // 默认的

			  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
			  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
			  // timeout: 10000,

			  // `withCredentials` 表示跨域请求时是否需要使用凭证
			  //通过设置withCredentials 为true获得的第三方cookies，将会依旧享受同源策略，
			  //因此不能被通过document.cookie或者从头部相应请求的脚本等访问。
			  withCredentials: false,

			  // `onUploadProgress` 允许为上传处理进度事件
			  onUploadProgress: function (progressEvent) {
			    // 对原生进度事件的处理
			  },

			  // `onDownloadProgress` 允许为下载处理进度事件
			  onDownloadProgress: function (progressEvent) {
			    // 对原生进度事件的处理
			  }
			}).then(res=>{
				this.success(res)
			})
			

			// 添加请求拦截器
			var myInterceptor =axios.interceptors.request.use(function (config) {
			    // 在发送请求之前做些什么
			    Indicator.open({
					  text: '加载中...',
					  spinnerType: 'fading-circle'
					});
			    return config;
			  }, function (error) {
			    // 对请求错误做些什么
			    return Promise.reject(error);
			  });

			// 添加响应拦截器
			axios.interceptors.response.use(function (response) {
		    // 对响应数据做点什么
		    Indicator.close();
		    return response;
		  }, function (error) {
		  	Indicator.close();
		    // 对响应错误做点什么
		    MessageBox('提示', '网络或服务器异常，请稍后');
		    return Promise.reject(error);
		  });
		  // return res1
		}
	};
	// Vue.prototype.$http = $ax
	export default $ax;
