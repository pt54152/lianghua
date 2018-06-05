<template>
	<div class="comment-container">
		<div class="title clearfix">
			<div class="comment-title fl">评论</div>
			<div class="line fl"></div>
		</div>
		<div class="items" v-if="!isEmpty">
			<div class="item" v-for="item in commentData" :id="'item'+item.serialNO">
				<!-- <div class="avatar-content"> -->
					<div class="user-img">
						<img :src="item.userPictureUrlPathText" alt="">
					</div>
					<div class="comment-content">
						<div class="username">{{item.userName}}</div>
						<div class="comment-body" v-show="isClickEdit!=item.serialNO"></div>
						<div class="comment-footer clearfix" v-show="isClickEdit!=item.serialNO">
							<div class="date fl">{{item.publishDatetime}}</div>
							<div class="response fl" v-if="item.canEdit=='yes'"  @click="edit(item.serialNO)">编辑</div>
							<a href="#editBox" class="response fl" v-else @click="response(item.userName)">回复</a>
						</div>	
						<div class="edit-content" v-show="isClickEdit==item.serialNO">
							<mavon-editor
				      	ref="md3"
				       	v-model="value1"
				       	:subfield="subfield"
				       	:toolbars="toolbars"
				       	@imgAdd="$imgAdd1">
				      </mavon-editor>
				      <div class="btn">
				        <mt-button type="primary" size="small" class="submit1" @click="submit1(item.serialNO)">提交</mt-button>
				        <mt-button type="primary" size="small" class="cancel" @click="cancel(item.serialNO)">取消</mt-button>
				      </div>
						</div>
					</div>
				<!-- </div> -->
			</div>
			<div class="btn">
        <mt-button type="primary" size="small" class="pre" :disabled="isFirst" @click="pre">上一页</mt-button>
        <mt-button type="primary" size="small" class="next" :disabled="isEnd" @click="next">下一页</mt-button>
      </div>
		</div>
		<div class="comment-edit" v-if="isLogin" id="editBox">
			<mavon-editor
      	ref="md4"
       	v-model="value2"
       	:subfield="subfield"
       	:toolbars="toolbars"
       	@imgAdd="$imgAdd2">
      </mavon-editor>
      <p class="help">内容编辑使用MarkDown语法。<a href="https://segmentfault.com/markdown">查看编辑帮助</a></p>
       <div class="btn">
        <mt-button type="primary" size="small" class="submit" @click="submit2">提交</mt-button>
      </div>
		</div>
		<div v-if="!isLogin">
			<p class="not-login">您尚未登录，请<span @click="toLogin">登录</span>或者<router-link to="/register"><span>注册</span></router-link>发表评论或回复。</p>
		</div>
	</div>
</template>

<script>
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	import axios from 'axios'
	import { MessageBox } from 'mint-ui'
	export default{
		data(){
			return{
				commentData:[],
				isLogin:true,
				value1: '',
				value2:'',
				subfield:false,
				toolbars:{
					bold: true, // 粗体
         	// italic: true,// 斜体
         	header: true,// 标题
         	quote: true, // 引用
         	link: true, // 链接
      		imagelink: true, // 图片链接
      		code: true // code
				},
				isEdit: true,
				isClickEdit:'',
				page:1,
				pagesize:5,
				isEmpty:true,
				isFirst:true,
				isEnd:true
			}
		},
		methods:{
			init(){
				var $ax=new this.$http('/sqp/strategyGround/StrategyCommentList.html','post',{
					postCode:this.$route.params.strategyNoteid,
					ajax:true,
					pagesize: this.pagesize,
					page: this.page
				},result=>{
					this.commentData=result.data.Rows;
					this.isEmpty=result.data.total==0?true:false;
					this.isEnd=this.page>=Math.ceil(result.data.total/this.pagesize)?true:false;
					this.isFirst=this.page==1?true:false;
				})
				$ax.start();
				//判断用户是否在登陆状态
				var $loginAx=new this.$http('/loginStatus.html','post',{
          ajax: true
        },result=>{
          if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	this.isLogin=true;
            }else if(result.data.params.IsLogin=='0'){
              this.isLogin=false;
            }
          }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
			},
			$imgAdd1(pos, $file){
        // 第一步.将图片上传到服务器.
       	var formdata = new FormData();
       	formdata.append('file', $file);
       	axios({
         	url: this.$baseUrl+'/sqp/community/savePostImg.html',
         	method: 'post',
         	data: formdata,
         	headers: { 'Content-Type': 'multipart/form-data' },
       	}).then((res) => {
       		// console.log(url)
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          // $vm.$img2Url 详情见本页末尾
          this.$refs.md3.$img2Url(pos,res.data.params.filePath);
       	})
      },
      $imgAdd2(pos, $file){
        // 第一步.将图片上传到服务器.
       	var formdata = new FormData();
       	formdata.append('file', $file);
       	axios({
         	url: this.$baseUrl+'/sqp/community/savePostImg.html',
         	method: 'post',
         	data: formdata,
         	headers: { 'Content-Type': 'multipart/form-data' },
       	}).then((res) => {
       		// console.log(url)
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          // $vm.$img2Url 详情见本页末尾
          this.$refs.md4.$img2Url(pos,res.data.params.filePath);
       	})
      },
      response(userName){
      	var $ax=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	this.isLogin=true;
            	this.value2='@'+userName+' ';
            }else if(result.data.params.IsLogin=='0'){
            	this.isLogin=false;
              this.$router.push({
                path: '/login',
                query: {redirect: '/strategyNote/'+this.$route.params.strategyNoteid}
              })
            }
           }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $ax.start();
      },
      edit(serialNO){
      	var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            
            if(result.data.params.IsLogin=='1'){
            	this.isLogin=true;
            	this.isClickEdit=serialNO;
            	setTimeout(()=>{
            		var markdownBody=document.querySelector("#item"+serialNO+" .edit-content .markdown-body");
            		markdownBody.style.minWidth='240px';
            		markdownBody.style.zIndex=0;
            		for(var i=0;i<this.commentData.length;i++){
            			if(this.commentData[i].serialNO==serialNO){
            				markdownBody.querySelector('textarea').value=this.commentData[i].commentContentText;
            				break;
            			}
            		}
            	},0)
            }else if(result.data.params.IsLogin=='0'){
            	this.isLogin=false;
              this.$router.push({
                path: '/login',
                query: {redirect: '/strategyNote/'+this.$route.params.strategyNoteid}
              })
            }
          }else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
      },
      submit1(serialNO){
      	var commentContentText=document.querySelector("#item"+serialNO+" .edit-content textarea").value;
      	var strategyTradeNO=this.$route.params.strategyNoteid;
      	this.commonAjax(commentContentText,strategyTradeNO,'/sqp/userOperate/updateStrategyComment.html',serialNO);
      	this.isClickEdit='';
      },
      cancel(serialNO){
      	document.querySelector("#item"+serialNO+" .edit-content .markdown-body textarea").value='';
      	this.isClickEdit='';
      },
      submit2(){
      	var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            
            if(result.data.params.IsLogin=='1'){
            	this.isLogin=true;
            	var commentContentText=document.querySelector('.comment-edit textarea').value;
            	var strategyTradeNO=this.$route.params.strategyNoteid;
            	this.commonAjax(commentContentText,strategyTradeNO,'/sqp/userOperate/addStrategyComment.html');
            	document.querySelector('.comment-edit textarea').value='';
            }else if(result.data.params.IsLogin=='0'){
            	this.isLogin=false;
              this.$router.push({
                path: '/login',
                query: {redirect: '/strategyNote/'+this.$route.params.strategyNoteid}
              })
            }
           }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
      },
      commonAjax(commentContentText,strategyTradeNO,url,serialNO){
      	var data={};
      	if(serialNO){
      		data={ajax:true,commentContentText,serialNO};
      	}else{
      		data={ajax:true,commentContentText,strategyTradeNO};
      	}
      	var $ax=new this.$http(url,'post',data,result=>{
      		if(result.data.key=='success'){
      			this.init()
      		}else{
      			MessageBox('提示',result.data.message);
      		}
      		
      	})
      	$ax.start();
      },
      pre(){
      	this.page--;
      	this.init();
      },
      next(){
      	this.page++;
      	this.init()
      },
      toLogin(){
      	this.$router.push({
          path: '/login',
          query: {redirect: '/strategyNote/'+this.$route.params.strategyNoteid}
        })
      }
		},
		mounted(){
			this.init()
			document.querySelector('.markdown-body').style.zIndex=0;
		},
		updated(){

			var commentBodys=document.querySelectorAll('.comment-body');
			
			
			for(let i=0;i<commentBodys.length;i++){
				commentBodys[i].innerHTML=marked(this.commentData[i].commentContentText);
			}
			let blocks = document.querySelectorAll('.comment-container pre code');
		  blocks.forEach(block=>{
		    block.classList.add('hljs')
		  })
		},
		components: {
      mavonEditor
    },
    // watch: {
    //   commentData(val) {
    //     this.myCommentData = val;//监听外部对props属性result的变更，并同步到组件内的data属性myCommentData中
    //   },
    //   myCommentData(val){
    //     this.$emit("on-comment-change",val);//组件内对myCommentData变更后向外部发送事件通知
    //   }
    // },
	}
</script>

<style scoped lang="scss">
	.comment-container{
		padding:0px 10px;
	}
	.title{
		height: 30px;
		padding-left: 70px;
		position: relative;
		.comment-title{
			position: absolute;
			top: 0px;
			left: 0px;
			font-size: 20px;
			font-weight: 700;
			line-height: 30px;
		}
		.line{
			width: 100%;
			height: 1px;
			background: #ccc;
			margin-top:13px;
		}
	}
	.items{
		.item{
			padding: 20px 0px;
			border-bottom: 1px solid #ccc;
			padding-left: 60px;
			position: relative;
			.user-img{
				position: absolute;
				top: 20px;
				left: 0px;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow:hidden;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.comment-content{
				.username{
					color:#337ab7;
				}
				.comment-body{
					padding: 20px 0;
				}
				.comment-footer{
					.date{

					}
					.response{
						color:#337ab7;
						margin-left: 20px;
					}
				}
				.edit-content{
					.btn{
						text-align:center;
						margin-top:20px;
					}
				}
			}
		}
		.btn{
			text-align: center;
			margin: 20px 0;
			.pre{
				margin-right: 50px;
			}
		}
	}
	.comment-edit{
		padding: 20px 0;
		.help{
	    a{
	      color: #337ab7;
	    }
	  }
		.btn{
	    text-align: center;
	    margin-top: 20px;
	    .submit{
	    	width: 30%;
	    }
	  }
	}
	.not-login{
		padding: 20px 0;
		text-align:center;
		span{
			color:#337ab7;
		}
	}
	// #337ab7
</style>