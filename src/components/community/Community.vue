<template>
	<div>
		<mt-header title="社区-LCQuant">
		</mt-header>
		<div class="container">
			<div class="title clearfix">
				<div class="fl community">社区</div>
				<div class="fr post-launch" @click="postLaunch">发起帖子</div>
			</div>
			<div class="search clearfix">
				<input type="text" placeholder="标题/作者/内容" v-model="keywords">
				<!-- <button icon="search"></button> -->
				<mt-button icon="search" @click="search" class="search-btn fr"></mt-button>
			</div>
			<ly-tab v-model="selected">
			  <ly-tab-item v-for="(item, index) in communityItems" :key="index">
			    <div class="nav-btn " @click="link(item.communityid)">{{item.communityContent}}</div>
			  </ly-tab-item>
			</ly-tab>
			<v-community v-if="isRouterAlive" :community="community"></v-community>
		</div>
		
		
	</div>
</template>

<script>
	import vCommunity from './CommunityContent'
	import lczqTools from '../../assets/js/common/lczq_tools.js'
	export default {
		name:'Community',
		data(){
			return{
				keywords:'',
				selected:0,
				communityItems:[
					{communityid:'0',communityContent:'全部'},
					{communityid:'1',communityContent:'研究&策略'},
					{communityid:'2',communityContent:'问答'},
					{communityid:'3',communityContent:'分享'},
					{communityid:'4',communityContent:'公告&活动'},
					{communityid:'essence',communityContent:'精华'}
				],
				community:{communityid:'0',keywords:''},
				isRouterAlive:true
			}
		},
		methods:{
			reload () {
		    this.isRouterAlive = false
		    this.$nextTick(() => (this.isRouterAlive = true))
		  },
			postLaunch(){
				var isLogin=lczqTools.getCookie('IsLogin');
				if(isLogin=="1"){ 
					//说明已经登录
					this.$router.push('/postLaunch')
				}else{
					this.$router.push({
				    path: '/login',
				    query: {redirect: 'postLaunch'}
				  })
				}
			},
			search(){
				this.selected=0;
				this.link(0);
				
			},
			link(communityid){
				if(communityid!='0'){
					this.keywords='';
				}
				this.community.keywords=this.keywords;
				this.community.communityid=communityid
				this.reload();
			},
		},
		created(){
			this.link(0);
		},
		components: {
      vCommunity
    }
	}
</script>

<style scoped>
	.container{
		padding: 30px 10px 50px;
	}
	.community{
		font-size: 24px;
		letter-spacing: 10px;
	}
	.post-launch{
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 5px 8px;
		margin-right: 10px;
	}
	.search{
		border: 2px solid #eee;
		width:100%;
		border-radius: 4px;
		padding-right: 40px;
		box-sizing: border-box;
		position: relative;
		margin-top: 20px;
	}
	.search input{
		width:100%;
		height: 41px;
		padding-left: 10px;
	}
	.search .search-btn{
		box-shadow: none !important;
		position: absolute;
		top: 0px;
		right:0px;
		border-left: 2px solid #eee;
	}
	.nav-btn{
		width: 100%;
		height:100%;
	}
</style>