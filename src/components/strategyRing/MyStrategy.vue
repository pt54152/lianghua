<template>
	<div>
		<mt-header title="我的策略">
			<router-link to="" slot="left">
		    <mt-button icon="back"  @click="$router.go(-1)">返回</mt-button>
		  </router-link>
		</mt-header>
		<div class="navbar clearfix">
			<div class="navbar-item fl" :class="{isSelected:strategy.sortCode=='participate'}" @click="showItem('participate')">我的分享</div>
			<div class="navbar-item fl" :class="{isSelected:strategy.sortCode=='subscribe'}" @click="showItem('subscribe')">我的订阅</div>
		</div>
		<div class="mt10">
  		<v-strategy :strategy="strategy" v-if="isRouterAlive"></v-strategy>
  	</div>
		<!-- <mt-navbar v-model="selected">
		  <mt-tab-item id="1">我的分享</mt-tab-item>
		  <mt-tab-item id="2">我的订阅</mt-tab-item>
		</mt-navbar>
		
		tab-container
		<mt-tab-container v-model="selected">
		  <mt-tab-container-item id="1">
		  	<div class="mt10">
		  		<v-strategy :strategy="strategy1"></v-strategy>
		  	</div>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="2">
		  	<div class="mt10">
		  		<v-strategy :strategy="strategy2"></v-strategy>
		  	</div>
		  </mt-tab-container-item>
		</mt-tab-container> -->
	</div>
</template>

<script>
	import vStrategy from '../common/Strategy'
	export	default{
		name:'MyStrategy',
		data(){
			return{
				isRouterAlive:true,
				strategy:{
					bannerHeight:0,
					navHeight:59,
					sortCode:'participate'
				},
			}
		},
		methods:{
			reload () {
		    this.isRouterAlive = false
		    this.$nextTick(() => (this.isRouterAlive = true))
		  },
			showItem(sortCode){
				this.reload ();
				this.strategy.sortCode=sortCode
			}
		},
		components:{
			vStrategy
		}
	}
</script>

<style scoped lang="scss">
	.mt10{
		margin-top: 10px;
	}
	.navbar{
		text-align: center;
		.navbar-item{
			width: 50%;
			padding: 17px 0;
    	font-size: 12px;

		}
	}
	.isSelected{
		border-bottom: 3px solid #26a2ff;
    color: #26a2ff;
    margin-bottom: -3px;
	}    
</style>