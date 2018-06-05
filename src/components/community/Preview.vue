<template>
	<div>
		<mt-header title="预览">
      <router-link to="" slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="preview-top clearfix">
      <mt-button size="small" type="primary" class="edit fr" @click="edit">编辑</mt-button>
      <mt-button size="small" type="primary" class="fr" @click="submit">发布</mt-button>
    </div>
    <div class="preview-topic">{{postTitleText}}</div>
    <div class="preview-content">
    	<pre class="markdown" v-html="markdownContent"  v-highlight></pre>
    </div>
		<my-tab v-if="myTabShow" :tabData="tabData"></my-tab>
	</div>
</template>

<script>
	import lczqData from '../../assets/js/common/lczq_data.js'
	import myTab from '../common/MyTab'
	export default{
		name:'Preview',
		data(){
			return{
				postTitleText:'',
				markdownContent:'',
				tabData:'',
				myTabShow:false

			}
		},
		mounted(){
			var data=lczqData.preview;
			this.postTitleText=data.postTitleText;
      this.markdownContent=marked(data.postContentText);
		},
		created(){
			var data=lczqData.preview;
			if(data.strategyVersionCode&&data.strategyVersionCode.key){
        var $ax=new this.$http('/sqp/community/pageImageOfAjax.html','post',{
          strategyVersionCode:data.strategyVersionCode.key,
          ajax: true
        },result=>{
          this.tabData=result.data;
          if(result.data.backTestResultList){
          	this.reload();
          }else{
          	this.myTabShow=false;
          }
        })
        $ax.start();
      }
		},
		methods:{
			reload () {
		    this.myTabShow = false
		    this.$nextTick(() => (this.myTabShow = true))
		  },
			edit(){
				this.$router.push('/postLaunch')
			},
			submit(){
				var $loginAx=new this.$http('/loginStatus.html','post',{
          ajax: true
        },result=>{
          if(result.data.key=="success"){
            this.isLogin=result.data.params.IsLogin
            if(this.isLogin=='1'){
              var data={
                ajax:true,
                postTitleText:lczqData.preview.postTitleText,
                postTypeCode:lczqData.preview.postTypeCode,
                postContentText:lczqData.preview.postContentText,
                strategyVersionCode:lczqData.preview.strategyVersionCode.key,
                postCode:lczqData.preview.postCode
              }
              var $ax=new this.$http('/sqp/community/post.html','post',data,result=>{
                this.$router.push('/communityNote/'+result.data.params.postCode);
              })
              $ax.start();
            }else if(this.isLogin=='0'){
              this.$router.push({
                path: '/login',
                query: {redirect: 'preview'}
              })
            }
          }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
			},
		},
		components: {
      myTab
    }
	}
</script>

<style scoped lang="scss">
	.preview-top{
		padding: 20px;
		//border-bottom: 1px solid #ccc;
		.edit{
			margin-left: 20px;
		}
	}
	.preview-topic{
		font-size: 24px;
		padding: 5px 20px;
		margin-bottom: 40px;
		border-bottom: 1px solid #ccc;
	}
	.preview-content{
		border-top: 1px solid #ccc;
		padding: 30px 20px;
	}

</style>