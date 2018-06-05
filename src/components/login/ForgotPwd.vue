<template>
	<div>
		<mt-header title="找回密码">
		  <router-link to="" slot="left">
		    <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
		  </router-link>
		</mt-header>
		<div class="back-password-form">
			<div class="lczq-logo">
				<img src="../../assets/images/lczq_logo.png" alt="">
			</div>
			<div class="validator">
				<div class="back-password-box">
					<input type="text" v-model.trim="userCode" placeholder="请输入账号" @keyup="userIpt">
				</div>
				<div class="validator-error" v-show="userValidatorError!=''">{{userValidatorError}}</div>
			</div>

			<div class="validator">
				<div class="back-password-box">
					<input type="text" v-model.trim="emailAddressText" placeholder="请输入邮箱地址" @keyup="emailIpt">
				</div>
				<div class="validator-error" v-show="emailValidatorError!=''">{{emailValidatorError}}</div>
			</div>
			
			<mt-button type="primary" class="back-password-submit" :disabled="isEmpty" @click="backPasswordSubmit">提交</mt-button>
		</div>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	export default {
		data(){
			return{
				userCode:'',
				userValidatorError:'',
				userPass:false,
				emailAddressText:'',
				emailValidatorError:'',
				emailPass:false,
				isEmpty:true
			}
		},
		methods:{
			userIpt(){
				if(this.userCode){
					this.userValidatorError='';
					this.userPass=true;
				}else{
					this.userValidatorError='账号不能为空';
					this.emailPass=false;
				}
				this.validator();
				
			},
			emailIpt(){
				var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(this.emailAddressText){
					if(!emailReg.test(this.emailAddressText)){
						this.emailValidatorError='请填写正确的邮箱地址';
						this.emailPass=false;
					}else{
						this.emailValidatorError='';
						this.emailPass=true;
					}
				}else{
					this.emailValidatorError='邮箱地址不能为空';
					this.emailPass=false;
				}
				this.validator();
			},
			validator(){
				if(this.userPass&&this.emailPass){
					this.isEmpty=false;
				}else{
					this.isEmpty=true;
				}
			},
			backPasswordSubmit(){
				var $ax=new this.$http('/getForgotenPassword.html','post',{
					ajax: true,
					userCode:this.userCode,
					emailAddressText:this.emailAddressText
				},result=>{
					if(result.data.key=="success"){
						MessageBox.alert('请前往邮箱获取密码！').then(action => {
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
	.back-password-form{
		padding: 50px 20px;
	}
	.back-password-form .lczq-logo{
		margin: 0 auto;
		width: 140px;
		height: 40px;

	}
	.back-password-box{
		border: 1px solid #ccc;
		margin: 20px 0;
		padding: 5px 10px;
	}
	.back-password-box input{
		width: 100%;
		height: 30px;
	}
	.back-password-submit{
		display: block;
		width: 100%;
		margin: 50px auto;
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
</style>