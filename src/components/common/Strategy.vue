<template>
	<div class="strategy-item">
		<div class="main-body" :style="{ height: wrapperHeight+ 'px' }">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="moreStrategy" :autoFill="isAutoFill">
        <div class="item" v-for="(item,index) in strategyLists">
					<div class="item-top clearfix">
						<div class="top-pic fl">
							<img v-if="index==0" src="../../assets/images/1_mob.png" alt="">
							<img v-else-if="index==1" src="../../assets/images/2_mob.png" alt="">
							<img v-else-if="index==2" src="../../assets/images/3_mob.png" alt="">
							<img v-else src="../../assets/images/4_mob.png" alt="">
							<span>{{index+1}}</span>
						</div>
						<div class="top-title fl" @click="link(item.strategyTradeNO)">
						{{item.strategyTradeName}}
						</div>
					</div>
					<div class="item-content clearfix">
						<div class="item-cell fl">
							<div :class="{red:item.strategyProfitRatioValueUnit>=0,green:item.strategyProfitRatioValueUnit<0}">{{item.strategyProfitRatioValueUnit.toFixed(2)}}%</div>
							<div class="text">累计收益</div>
						</div>
						<div class="item-cell fl">
							<div :class="{red:item.todayProfitRatioValueUnit>=0,green:item.todayProfitRatioValueUnit<0}">{{item.todayProfitRatioValueUnit.toFixed(2)}}%</div>
							<div class="text">今日收益</div>
						</div>
						<div class="item-cell fl">
							<div>{{item.maxRetracementRatioValue.toFixed(2)}}%</div>
							<div class="text">最大回撤</div>
						</div>
						<div class="item-cell fl">
							<div>{{item.subscribeCount}}</div>
							<div class="text">订阅人数</div>
						</div>
					</div>
					<div class="user-info clearfix">
						<div class="user-pic fl"><img :src="item.userPictureUrlPathText" alt=""></div>
						<div class="username fl">{{item.userName}}</div>
					</div>
				</div>
      </mt-loadmore>
    </div>
	</div>
	
</template>

<script>
	import { MessageBox } from 'mint-ui'
	export default{
		props:['strategy'],
		data(){
			return{
				page:1,
				pagesize:5,
				strategyLists:[],
				//可以进行上拉
	      allLoaded: false,
	      //是否自动触发上拉函数
	      isAutoFill: false,
	      wrapperHeight: 0,
			}
		},
		methods:{
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
    	},
			init(){
				if(this.strategy.sortCode=='default'){//默认展示的
					var $ax=new this.$http('/sqp/strategyGround/strategyGroundList.html','post',{
	          ajax: true
	        },result=>{
	        	this.strategyLists=result.data;
	        })
	        $ax.start();
				}else if(this.strategy.sortCode=='participate'){//我的订阅
					var $ax=new this.$http('/sqp/strategy/participateList.html','post',{
	          ajax: true,page:this.page,pagesize: this.pagesize
	        },result=>{
	        	if(result.data.key=="success"){
							this.page++;
							if(this.page==2){//第一次加载
								this.allLoaded = false; // 可以进行上拉
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.strategyLists=result.data.params.participateList;
								this.$refs.moreStrategy.onTopLoaded();
							}else{
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.$refs.moreStrategy.onBottomLoaded();
								this.strategyLists=this.strategyLists.concat(result.data.params.participateList);
							}
						}else{
							MessageBox('提示',result.data.message);
						}
	        })
	        $ax.start();
				}else if(this.strategy.sortCode=='subscribe'){//我的分享
					var $ax2=new this.$http('/sqp/strategy/subscribeList.html','post',{
	          ajax: true,page:this.page,pagesize: this.pagesize
	        },result=>{
	        	if(result.data.key=="success"){
							this.page++;
							if(this.page==2){//第一次加载
								this.allLoaded = false; // 可以进行上拉
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.strategyLists=result.data.params.subscribeList;
								this.$refs.moreStrategy.onTopLoaded();
							}else{
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.$refs.moreStrategy.onBottomLoaded();
								this.strategyLists=this.strategyLists.concat(result.data.params.subscribeList);
							}
						}else{
							MessageBox('提示',result.data.message);
						}
	        })
	        $ax2.start();
				}else{
					var $ax=new this.$http('/sqp/strategyGround/strategyGroundClphbList.html','post',{
	          sortCode:this.strategy.sortCode,page:this.page,pagesize: this.pagesize
	        },result=>{
	        	if(result.data.key=="success"){
							this.page++;
							if(this.page==2){//第一次加载
								this.allLoaded = false; // 可以进行上拉
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.strategyLists=result.data.params.clphbList;
								this.$refs.moreStrategy.onTopLoaded();
							}else{
								if(this.page>=Math.ceil(result.data.params.Total/this.pagesize)){
									this.allLoaded = true; // 若数据已全部获取完毕
								}
								this.$refs.moreStrategy.onBottomLoaded();
								this.strategyLists=this.strategyLists.concat(result.data.params.clphbList);
							}
						}else{
							MessageBox('提示',result.data.message);
						}
	        })
	        $ax.start();
				}
			},
			//   下拉刷新
	    loadTop() {
	    	this.page=1;
	      this.init();
	    },
	    // 上拉加载
	    loadBottom() {
	      this.init();
	    },
			link(strategyTradeNO){
    		this.$router.push('/strategyNote/'+strategyTradeNO)
			}
		},
		mounted(){
			this.wrapperHeight =document.body.offsetHeight-40-this.strategy.bannerHeight-this.strategy.navHeight;
			this.init(this.strategy)
		}
	}
</script>

<style scoped lang="scss">
	.strategy-item{
		.item{
			padding: 0 10px 20px;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
			margin-top: 10px;
			.item-top{
				.top-pic{
					width: 40px;
					height: 40px;
					position: relative;
					span{
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						color: #fff;
						font-weight: 700;
					}
				}
				.top-title{
					line-height: 40px;
					color:#3674c9;
					font-size: 16px;
					margin-left: 10px;
				}
			}
			.item-content{
				padding: 15px 0;
				.item-cell{
					width: 25%;
					text-align: center;
					.text{
						color: #999;
					}
				}
			}
			.user-info{
				.user-pic{
					width: 30px;
					height: 30px;
					border-radius: 50%;
					overflow:hidden;
				}
				.username{
					color: #999;
					line-height: 30px;
					margin-left: 15px;
				}
			}
		}
	}
</style>