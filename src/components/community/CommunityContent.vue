<template>
	<div>
		<div class="items"> 
			<div class="main-body" ref="wrapper" :style="{ height: (wrapperHeight-203) + 'px' }">
	      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="isAutoFill">
	        <ul class="mui-table-view mui-grid-view">
	          <li v-for="item in communityData">
					  	<div class="txt-title clearfix">
					  		<span class="top-flag fl" v-if="item.topFlagCode=='Y'">置顶</span>
					  		<h3 class="fl">
						  		<router-link :to="'/communityNote/'+item.postCode">
						  			{{item.postTitleText}}
					  			</router-link>	
					  		</h3>
					  	</div>
					  	<div class="community-content clearfix">
					  		<div class="fl">
					  			作者 <router-link to="">{{item.operatorName}}</router-link>
					  		</div>
					  		<div class="date-time item fl">发布于 {{item.operateDatetimeText}}</div>
					  		<div class="answer item fl">回复 {{item.commentCount}}</div>
					  		<div class="read item fl">浏览 {{item.browsedCount}}</div>
					  		<div class="collect item fl">收藏 {{item.collectCount}}</div>
					  	</div>
					  </li>
	        </ul>
	      </mt-loadmore>
	    </div>
		</div>
		<div class="btn">
			<div class="pre fl"></div>
			<div class="next fr"></div>
		</div>
	</div>
</template>

<script>
	export	default{
		name:'CommunityContent',
		props:['community'],
		data(){
			return{
				myCommunity:[],
				pageSize:6,
				page:1,
				communityData:[],
				//可以进行上拉
	      allLoaded: false,
	      //是否自动触发上拉函数
	      isAutoFill: false,
	      wrapperHeight: 0,
			}
		},
		methods:{
			//   下拉刷新
	    loadTop() {
	    	this.page=1;
	      this.loadMore();
	    },
	    // 上拉加载
	    loadBottom() {
	      this.loadMore();
	    },
    	// 加载更多
    	loadMore() {
    		var data={};
				if(this.community.communityid=="essence"){
					//精华帖
					data={
						ajax: true,
						pagesize:this.pageSize,
						page:this.page,
						essenceFlagCode:"Y",
						sortCode:'new',
						keywords:''
					}
				}else{
					if(this.community.communityid==0){
						this.community.communityid=''
					}
					data={
						ajax: true,
						pagesize:this.pageSize,
						page:this.page,
						postTypeCode:this.community.communityid,
						sortCode:'new',
						keywords:this.community.keywords
					}
				}
				if(this.community.keywords==0){
					delete data.keywords;
				}
				var $ax=new this.$http('/sqp/community.html','post',data,result=>{
					if(result.data.key=="success"){
						this.page++;
						if(this.page==2){//第一次加载
							this.allLoaded = false; // 可以进行上拉
							if(this.page>=Math.ceil(result.data.params.Total/this.pageSize)){
								this.allLoaded = true; // 若数据已全部获取完毕
							}
							this.communityData=result.data.params.list;
							this.$refs.loadmore.onTopLoaded();
						}else{
							if(this.page>=Math.ceil(result.data.params.Total/this.pageSize)){
								this.allLoaded = true; // 若数据已全部获取完毕
							}
							this.$refs.loadmore.onBottomLoaded();
							this.communityData=this.communityData.concat(result.data.params.list);
						}
					}
				})
				$ax.start();
    	}
		},
		created(){
			this.loadMore();
		},
		mounted(){
			 // 父控件要加上高度，否则会出现上拉不动的情况
    	this.wrapperHeight =document.body.offsetHeight;
		},
		// watch: {
  //     community(val) {
  //       this.myCommunity = val;//监听外部对props属性result的变更，并同步到组件内的data属性myCommunity中
  //     },
  //     myCommunity(val){
  //       this.$emit("on-community-change",val);//组件内对myCommunity变更后向外部发送事件通知
  //     }
  //   },
	}
</script>

<style scoped>
	.items{

	}
	.items ul li{
		margin-bottom: 20px;
		border-bottom: 1px solid #ddd;
		padding: 20px 0;

	}
	.items .txt-title{
		margin-bottom: 10px;
	}
	.txt-title .top-flag{
		padding: 1px 3px;
		font-size: 12px;
		background-color: #26a2ff;
		/*background-color: #3B86ED;*/
		color: #fff;
		margin-right: 8px;
	}
	.txt-title h3{
		margin-top: -3px;
	}
	
	.txt-title h3 a{
		font-size: 18px;
		font-weight: normal;
		color: #3674C9;
	}
	.community-content .item{
		margin-left: 15px;
	}
	.community-content a{
		color: #3674C9;
	}
</style>