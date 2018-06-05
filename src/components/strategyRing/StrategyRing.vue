<template>
	<div class="container">
		<mt-header title="策略擂台">
		</mt-header>
		<div class="banner">
			<mt-swipe :auto="4000">
			  <mt-swipe-item>
			  	<router-link to="">
			  		<img src="../../assets/images/mobbanner.png" alt="">
			  	</router-link>
			  </mt-swipe-item>
			  <mt-swipe-item>
			  	<router-link to="">
			  		<img src="../../assets/images/mobbanner.png" alt="">
			  	</router-link>
			  </mt-swipe-item>
			  <mt-swipe-item>
			  	<router-link to="">
			  		<img src="../../assets/images/mobbanner.png" alt="">
			  	</router-link>
			  </mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="nav">
			<div class="nav-tab">
				<ly-tab v-model="selected">
				  <ly-tab-item v-for="(item, index) in strategyNav" :key="index">
				    <div class="nav-btn " @click="navLink(item.strategyNavId)">{{item.text}}</div>
				  </ly-tab-item>
				</ly-tab>
			</div>
			<div class="my-strategy" @click="myStrategy">我的策略</div>
		</div>
		<v-strategy :strategy="strategy" v-if="isRouterAlive"></v-strategy>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui'
	import vStrategy from '../common/Strategy'
	export	default{
		name:'StrategyRing',
		data(){
			return{
				selected:0,
				strategyNav:[
					{strategyNavId:'default',text:'策略精选'},
					{strategyNavId:'0',text:'累计收益'},
					{strategyNavId:'1',text:'当日收益'},
					{strategyNavId:'2',text:'订阅数量'},
					{strategyNavId:'3',text:'最新发布'}
				],
				isRouterAlive:true,
				strategy:{
					bannerHeight:0,
					navHeight:38,
					sortCode:''
				}
			}
		},
		methods:{
			reload () {
		    this.isRouterAlive = false
		    this.$nextTick(() => (this.isRouterAlive = true))
		  },
			navLink(sortCode){
				this.strategy.sortCode=sortCode;
				this.reload();
			},
			myStrategy(){
				var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	this.$router.push('/myStrategy')
            }else if(result.data.params.IsLogin=='0'){
              this.$router.push({
                path: '/login',
                query: {redirect: 'myStrategy'}
              })
            }
           }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
			}
		},
		mounted(){
			this.strategy.bannerHeight=document.body.offsetWidth*44/75;
			document.querySelector('.banner').style.height=this.strategy.bannerHeight+'px';
			var width=document.querySelector('.ly-tab-item').clientWidth+'px';
			document.querySelector('.my-strategy').style.width=width;
			document.querySelector('.nav').style.paddingRight=width;
		},
		components:{
			vStrategy
		}
	}
</script>

<style scoped lang="scss">
	.container{
		//padding-bottom: 50px;
	}
	.nav{
		padding-right: 66px;
		position: relative;
		.nav-tab{
			width:100%;
		}
		.my-strategy{
			position: absolute;
			top:0px;
			right: 0px;
			text-align:center;
			box-sizing: border-box;
			height: 39px;
			line-height: 35px;
			border-left: 1px solid #ccc;
			border-bottom: 1px solid #ccc;
			background: #fff;
		}
	}
</style>

