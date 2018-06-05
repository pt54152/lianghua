var tools={
	//设置cookie
	setCookie:function (name,value) { 
    var Days = 1; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ encodeURI(value) + ";expires=" + exp.toGMTString()+";path=/"; 
	},

	//读取cookies 
	getCookie:function (name){ 
  	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  	if(arr=document.cookie.match(reg))
      return unescape(decodeURI(arr[2])); 
  	else 
      return null; 
	},
	//删除cookies 
	delCookie:function (name) { 
  	var exp = new Date(); 
  	exp.setTime(exp.getTime() - 10000); 
  	var cval=tools.getCookie(name); 
  	if(cval!=null) 
      document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/"; 
	}
}
export default tools;