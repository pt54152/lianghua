<template>
	<div>
		<mt-header title="社区-LCQuant">
		  <router-link to="" slot="left">
		    <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
		  </router-link>
		</mt-header>
		<div class="note-content">
	  	<div class="txt-title clearfix">
	  		<h2 class="fl">{{postTitleText}}</h2>
	  		<span class="can-edit fl" v-if="canEditPostTable" @click="edit">编辑</span>
	  	</div>
	  	<div class="community-info clearfix">
	  		<div class="author fl">{{userName}}</div>
	  		
	  		<div class="date-time item fl">发布于 {{operateDatetimeText}}</div>
	  		<div class="answer item fl">回复 {{commentCount}}</div>
	  		<div class="read item fl">浏览 {{browsedCount}}</div>
	  		<div class="collect item fl">收藏 {{collectCount}}</div>
	  	</div>
	  	<pre class="community-content" v-html="markdownContent"  v-highlight></pre>
	  	
	  </div>
		<my-tab v-if="myTabShow" :tabData="tabData"></my-tab>
		<my-comment></my-comment>
	</div>
</template>

<script>
	import lczqData from '../../assets/js/common/lczq_data.js'
	import myTab from '../common/MyTab'
	import myComment from '../common/CommunityComment'
	export	default{
		name:'CommunityNote',
		data(){
			return{
				postTitleText:'',
				canEditPostTable:false,
				userName:'',
				operateDatetimeText:'',
				commentCount:'',
				browsedCount:'',
				collectCount:'',
				markdownContent:'',
				myTabShow:false,
				tabData:'',
				// commentData:'',
				postTypeCode:'',
				postContentText:'',
				selectedStrategyValue:'',
				strategyVersionCode:'',
			}
		},
		methods:{
			init(){
				var $ax=new this.$http('/sqp/community/postDetail.html','post',{
          postCode:this.$route.params.noteid,
          ajax: true,
        },result=>{
          this.postTitleText=result.data.postTableRole.postTitleText;
          this.canEditPostTable=result.data.canEditPostTable;
          this.userName=result.data.author.userName;
          this.operateDatetimeText=result.data.postTableRole.operateDatetimeText;
          this.commentCount=result.data.postTableRole.commentCount;
          this.browsedCount=result.data.postTableRole.browsedCount;
          this.collectCount=result.data.postTableRole.collectCount;
          this.markdownContent=marked(result.data.postTableRole.postContentText);

          this.postTypeCode={posttypecode:result.data.postTableRole.postTypeCode,value:result.data.postTableRole.postTypeName};
          this.postContentText=result.data.postTableRole.postContentText;
          if(result.data.rateData){
          	this.selectedStrategyValue={key:result.data.rateData.strategyNO};
          }
          this.strategyVersionCode={key:result.data.postTableRole.strategyVersionCode};
          if(result.data.rateData){
          	this.myTabShow=true;
          	this.tabData=result.data.rateData;
          }else{
          	this.myTabShow=false;
          }
          // this.commentData=result.data.commentRoleList;

        })
        $ax.start();
			},
			edit(){
				lczqData.preview.postTitleText=this.postTitleText;
				lczqData.preview.postContentText=this.postContentText;
				lczqData.preview.postTypeCode=this.postTypeCode;
				if(this.selectedStrategyValue){
					var $ax=new this.$http('/sqp/community/strategyMapOfAjax.html','post',{
	          ajax: true
	        },result=>{
	          if(result.data.key=="success"){
	            var strategyData=result.data.params.strategyMap;
	            for(var i=0;i<strategyData.length;i++){
	            	if(this.selectedStrategyValue.key==strategyData[i].key){
	            		this.selectedStrategyValue.text=strategyData[i].text;
	            		break;
	            	}
	            }
	            lczqData.preview.selectedStrategyValue=this.selectedStrategyValue;
	          }
	          else{
	            MessageBox('提示',result.data.message);
	          }
	        })
					$ax.start();

	        var $ax2=new this.$http('/sqp/community/strategyBackOfAjax.html','post',{
	          strategyNO:this.selectedStrategyValue.key,
	          ajax: true
	        },result=>{
	          if(result.data.key=="success"){
	            var backData=result.data.params.strategyBackMap;
	            for(var i=0;i<backData.length;i++){
	            	if(this.strategyVersionCode.key==backData[i].key){
	            		this.strategyVersionCode.text=backData[i].text;
	            		break;
	            	}
	            }
	            lczqData.preview.strategyVersionCode=this.strategyVersionCode;
	          }
	          else{
	            MessageBox('提示',result.data.message);
	          }
	        })
	        $ax2.start();
				}
				
				lczqData.preview.postCode=this.$route.params.noteid;
				this.$router.push('/postLaunch')
			}
		},
		mounted(){
			lczqData.preview={};
			this.init();

		},
		components: {
      myTab,
      myComment
    }

	}
</script>

<style lang="scss" scoped>
	.note-content{
		padding: 20px 10px;
		.txt-title{
			margin-bottom: 10px;
			span{
				color: #26a2ff;
				margin-top: 10px;
				margin-left: 10px;
			}
		}
		.community-info{
			padding: 10px 0 30px;
			border-bottom: 1px solid #ccc;
			.item{
				margin-left: 25px;
			}
		}
	}
	

</style>