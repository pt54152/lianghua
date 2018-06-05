<template>
	<div>
		<mt-header title="账号注册">
		  <router-link to="" slot="left">
		    <mt-button icon="back"  @click="$router.go(-1)">返回</mt-button>
		  </router-link>
		  <router-link to="/" slot="right">
		    <mt-button>登录</mt-button>
		  </router-link>
		</mt-header>
		<div class="register-form">
			<div class="lczq-logo">
				<img src="../../assets/images/lczq_logo.png" alt="">
			</div>
			<div class="validator">
				<div class="register-box">
					<input type="text" v-model.trim="accountCode" placeholder="请输入账号" @keyup="codeIpt">
				</div>
				<div class="validator-error" v-show="codeValidatorError!=''">{{codeValidatorError}}</div>
			</div>
			
			<div class="validator">
				<div class="register-box">
					<input type="text" v-model.trim="accountName" placeholder="请输入名称" @keyup="nameIpt">
				</div>
				<div class="validator-error" v-show="nameValidatorError!=''">{{nameValidatorError}}</div>
			</div>
			
			<div class="validator">
				<div class="register-box">
					<input type="text" v-model.trim="email" placeholder="请输入邮箱（可用于找回密码）" @keyup="emailIpt">
				</div>
				<div class="validator-error" v-show="emailValidatorError!=''">{{emailValidatorError}}</div>
			</div>

			<div class="validator">
				<div class="register-box">
					<input type="password" v-model.trim="password" placeholder="请输入密码" @keyup="pwdIpt">
				</div>
				<div class="validator-error" v-show="pwdValidatorError!=''">{{pwdValidatorError}}</div>
			</div>
			
			<div class="validator">
				<div class="register-box">
					<input type="password" v-model.trim="confirmPassword" placeholder="请确认密码" @keyup="confirmPwdIpt">
				</div>
				<div class="validator-error" v-show="confirmPwdValidatorError!=''">{{confirmPwdValidatorError}}</div>
			</div>
			<mt-button type="primary" class="register-submit" :disabled="validatorPass" @click="register">注册</mt-button>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import MD5 from 'md5'
	export default {
		name:'Register',
		data(){
			return{
				accountCode:'',
				codeValidatorError:'',
				codePass:false,
				accountName:'',
				nameValidatorError:'',
				namePass:false,
				email:'',
				emailValidatorError:'',
				emailPass:true,
				password:'',
				pwdValidatorError:'',
				pwdPass:false,
				confirmPassword:'',
				confirmPwdValidatorError:'',
				confirmPwdPass:false,
				validatorPass:true

			}
		},
		methods:{
			codeIpt(){
				if(this.accountCode.length==0){
					this.codeValidatorError='帐号名不能为空';
					this.codePass=false;
				}else{
					this.accountCode=this.accountCode.replace(/\s/g,"");
					this.codeValidatorError='';
					this.codePass=true;
				}
				this.validator();
			},
			nameIpt(){
				if(this.accountName.length==0){
					this.nameValidatorError='名称不能为空';
					this.namePass=false;
				}else{
					this.accountName=this.accountName.replace(/\s/g,"");
					this.nameValidatorError='';
					this.namePass=true;
				}
				this.validator();
			},
			emailIpt(){
				var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(this.email&&!emailReg.test(this.email)){
						this.emailValidatorError='请填写正确的邮箱地址';
						this.emailPass=false;
				}else{
					this.emailValidatorError='';
					this.emailPass=true;
				}
				this.validator();
			},
			pwdIpt(){
				var pwdReg = /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,60}$/;
				if(this.password.length==0){
					this.pwdValidatorError='密码不能为空';
					this.pwdPass=false;
				}else{
					if(!pwdReg.test(this.password)){
						this.pwdValidatorError='您的密码安全等级太低';
						this.pwdPass=false;
					}else{
						this.pwdValidatorError='';
						this.pwdPass=true;
					}
				}
				this.validator();
			},
			confirmPwdIpt(){
				if(this.password!==this.confirmPassword){
					this.confirmPwdValidatorError='两次密码输入不同';
					this.confirmPwdPass=false;
				}else{
					this.confirmPwdValidatorError='';
					this.confirmPwdPass=true;
				}
				this.validator();
			},
			validator(){
				if(this.codePass&&this.namePass&&this.emailPass&&this.pwdPass&&this.confirmPwdPass){
					this.validatorPass=false;
				}else{
					this.validatorPass=true;
				}
			},
			register(){
				var $ax=new this.$http('/register.html','post',{
					ajax: true,
					userCode:this.accountCode,
					userName:this.accountName,
					emailAddressText:this.email,
					userPassword:MD5(this.password)
				},result=>{
					if(result.data.key=="success"){
						MessageBox.alert('恭喜您注册成功，现在去登录吧!').then(action => {
						  this.$router.push('/login');
						});
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
	.register-form{
		padding: 50px 20px;
	}
	.register-form .lczq-logo{
		margin: 0 auto;
		width: 140px;
		height: 40px;
	}
	.register-box{
		border: 1px solid #ccc;
		margin: 20px 0;
		padding: 5px 10px;
	}
	.register-box input{
		width: 100%;
		height: 30px;
	}
	.validator{
		position: relative;
	}
	.validator .validator-error{
		position: absolute;
		top: 40px;
		left: 10px;
		width:100%;
		color:red;
	}
	.register-submit{
		display: block;
		width: 100%;
		margin: 50px auto;
	}
</style>