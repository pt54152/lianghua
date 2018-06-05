<template>
	<div>
		<mt-header title="账号登录">
		  <router-link to="" slot="left">
		    <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
		  </router-link>
		  <router-link to="/register" slot="right">
		    <mt-button>注册</mt-button>
		  </router-link>
		</mt-header>
		<div class="login-form">
			<div class="lczq-logo">
				<img src="../../assets/images/lczq_logo.png" alt="">
			</div>
			<div class="login-box">
				<input type="text" v-model.trim="username" placeholder="请输入账号" @keyup="userIpt">
			</div>
			<div class="login-box">
				<input type="password" v-model.trim="password" placeholder="请输入密码" @keyup="pwdIpt">
			</div>
			<router-link to="/forgotPwd"><span class=" forgotPwd fr">忘记密码</span></router-link>
			<mt-button type="primary" class="login-submit" :disabled="isEmpty" @click="login">登录</mt-button>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import MD5 from 'md5'
	import lczqTools from '../../assets/js/common/lczq_tools.js'
	export default {
		name:'Login',
		data(){
			return{
				username:'',
				password:'',
				isEmpty:true
			}
		},
		methods:{
			userIpt(){
				if(this.username.length===0||this.password.length===0){
					this.isEmpty=true;
				}else{
					this.isEmpty=false;
				}
			},
			pwdIpt(){
				if(this.username.length===0||this.password.length===0){
					this.isEmpty=true;
				}else{
					this.isEmpty=false;
				}
			},
			login(){
				var $ax=new this.$http('/login.html','post',{
					ajax: true,
					userCode:this.username,
					userPassword:MD5(this.password)
				},result=>{
					if(result.data.key=="success"){
						lczqTools.setCookie("IsLogin",result.data.params.IsLogin);
						var role=JSON.stringify(result.data.params.role);
						lczqTools.setCookie("role",role);
						//登录成功跳转登录之前得页面或策略擂台页面
						this.$router.push(this.$route.query.redirect || '/strategyRing');
					}
					else{
						MessageBox('提示',result.data.message);
					}
				})
				$ax.start();
			}
		}
	}
</script>

<style scoped>
	.login-form{
		padding: 50px 20px;
	}
	.login-form .lczq-logo{
		margin: 0 auto;
		width: 140px;
		height: 40px;
	}
	.login-box{
		border: 1px solid #ccc;
		margin: 20px 0;
		padding: 5px 10px;
	}
	.login-box input{
		width: 100%;
		height: 30px;
	}
	.login-submit{
		display: block;
		width: 100%;
		margin: 50px auto;
	}
	.forgotPwd{
		color: #ccc;
	}
</style>