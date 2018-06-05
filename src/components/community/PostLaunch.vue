<template>
  <div>
    <mt-header title="社区-LCQuant">
      <router-link to="" slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="container" @click="showData=false">
      <div class="edit-title">编辑主题</div>
      <!--下拉单选框-->
      <div class="title">标题</div>
      <div class="base-select" @click.stop="showDataList">
        <div class="sub-selected-value">
          {{selectedValue.value}}<!--显示选择的值-->
          <div class="sub-select-list" v-if="showData">
            <div class="sub-select-item" v-for="(item, index) in selectList" @click.stop="select(item, index)" :class="{ current: item.posttypecode==selectedValue.posttypecode }">
              {{item.value}}
            </div>
          </div>
        </div>
      </div>
      <div class="title-ipt">
        <input type="text" placeholder="请输入主题标题" v-model.trim="topicTitle">
      </div>
      <div class="title">内容</div>
      <mavon-editor
      	ref="md"
       	v-model="value"
       	:subfield="subfield"
       	:toolbars="toolbars"
       	@imgAdd="$imgAdd">
      </mavon-editor>
      <p class="help">内容编辑使用MarkDown语法。<a href="https://segmentfault.com/markdown">查看编辑帮助</a></p>
      <div class="title">回测</div>
      <div class="title-ipt">
        <input type="text" placeholder="所选回测的结果会插入到主题中" readonly v-model="backResult">
        <div class="choose-btn" @click="chooseValue">选择</div>
      </div>
      <div class="btn">
        <mt-button type="primary" size="small" class="preview" @click="preview">预览</mt-button>
        <mt-button type="primary" size="small" class="submit" @click="submit">提交</mt-button>
      </div>
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade">
          <div class="modal-content">
            <div class="modal-top clearfix">
              <div class="modal-top-title fl">选择回测</div>
              <div class="close fr" @click="cancel">×</div>
            </div>
            <div class="modal-body">
              <div class="base-select" @click.stop="showStrategyDataList">
                <div class="sub-selected-value">
                  {{selectedStrategyValue.text}}
                  <div class="sub-select-list" v-if="showStrategyData">
                    <div class="sub-select-item" v-for="(item, index) in strategyData" @click.stop="strategySelect(item, index)" :class="{ current: item.key==selectedStrategyValue.key }">
                      {{item.text}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="base-select" @click.stop="showBackDataList">
                <div class="sub-selected-value">
                  {{selectedBackValue.text}}
                  <div class="sub-select-list" v-if="showBackData">
                    <div class="sub-select-item" v-for="(item, index) in backData" @click.stop="backSelect(item, index)" :class="{ current: item.key==selectedBackValue.key }">
                      {{item.text}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <mt-button size="small" type="primary" class="confrim" @click="chooseBackTest">确定</mt-button>
              <mt-button size="small" type="primary" class="confrim" @click="cancel">取消</mt-button>
            </div>
          </div>
      </mt-popup>
      <!-- <mt-popup
        v-model="previewOpen"
        popup-transition="popup-fade">
        <div class="modal-content preview-content">
          <div class="preview-top clearfix">
            <mt-button size="small" type="primary" class="edit fr" @click="previewOpen=false">编辑</mt-button>
            <mt-button size="small" type="primary" class="fr" @click="submit">发布</mt-button>
            
          </div>
          <div class="markdown-content" v-html="markdownContent"></div>
        </div>
      </mt-popup> -->
  	</div>
  </div>
</template>

<script>
  import { mavonEditor } from 'mavon-editor'
  import { MessageBox } from 'mint-ui'
  import 'mavon-editor/dist/css/index.css'
  import axios from 'axios'
  import lczqData from '../../assets/js/common/lczq_data.js'
	export default{
    name:'PostLaunch',
		data(){
			return{
        selectedValue:{posttypecode:'1',value:'研究&策略'},
        showData:false,
        selectList:[
          {posttypecode:'1',value:'研究&策略'},
          {posttypecode:'2',value:'问答'},
          {posttypecode:'3',value:'分享'}
        ],
        topicTitle:'',
				value: '',
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
        postContentText:'',
        postCode:'',
        popupVisible:false,
        strategyData:[],
        showStrategyData:false,
        selectedStrategyValue:{key:'',text:'请选择一个策略'},
        backData:[],
        showBackData:false,
        selectedBackValue:{key:'',text:'请选择一个回测'},
        backResult:'',
        isLogin:''
			}
		},
		methods:{
      showDataList(){
        this.showData=!this.showData
      },
      select(item,index){
        this.showData=false;
        //赋值的时候要分开写
        this.selectedValue.posttypecode=item.posttypecode;
        this.selectedValue.value=item.value;
      },
			// 绑定@imgAdd event
      $imgAdd(pos, $file){
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
          this.$refs.md.$img2Url(pos,res.data.params.filePath);
       	})
      },
      chooseValue(){
        var $loginAx=new this.$http('/loginStatus.html','post',{
          ajax: true
        },result=>{
          if(result.data.key=="success"){
            this.isLogin=result.data.params.IsLogin
            if(this.isLogin=='1'){
              var $ax=new this.$http('/sqp/community/strategyMapOfAjax.html','post',{
                ajax: true
              },result=>{
                if(result.data.key=="success"){
                  this.popupVisible=true;
                  this.strategyData=result.data.params.strategyMap
                }
                else{
                  MessageBox('提示',result.data.message);
                }
              })
              $ax.start();
            }else if(this.isLogin=='0'){
              var postContentText=this.value;
              lczqData.preview.postTitleText=this.topicTitle;
              lczqData.preview.postTypeCode=this.selectedValue
              lczqData.preview.postContentText=postContentText
              lczqData.preview.selectedStrategyValue=this.selectedStrategyValue;
              lczqData.preview.strategyVersionCode=this.selectedBackValue
              lczqData.preview.postCode=this.postCode;
              this.$router.push({
                path: '/login',
                query: {redirect: 'postLaunch'}
              })
            }
          }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();

        
      },
      showStrategyDataList(){
        this.showStrategyData=!this.showStrategyData
      },
      strategySelect(item,index){
        this.showStrategyData=false;
        //赋值的时候要分开写
        this.selectedStrategyValue.key=item.key;
        this.selectedStrategyValue.text=item.text;
        var $ax=new this.$http('/sqp/community/strategyBackOfAjax.html','post',{
          strategyNO:item.key,
          ajax: true
        },result=>{
          if(result.data.key=="success"){
            this.backData=result.data.params.strategyBackMap
          }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $ax.start();
      },
      showBackDataList(){
        this.showBackData=!this.showBackData
      },
      backSelect(item,index){
        this.showBackData=false;
        //赋值的时候要分开写
        this.selectedBackValue.key=item.key;
        this.selectedBackValue.text=item.text;
      },
      chooseBackTest(){
        if(this.selectedBackValue.key){
          this.backResult=this.selectedBackValue.text;
        }else{
          MessageBox('提示','您没有任何回测');
        }
        this.popupVisible=false;
      },
      cancel(){
        this.popupVisible=false;
        this.selectedStrategyValue={key:'',text:'请选择一个策略'};
        this.selectedBackValue={key:'',text:'请选择一个回测'};
      },
      preview(){
        var postContentText=this.value;
        if(this.topicTitle){
          if(postContentText){
            // if(this.backResult){
              lczqData.preview.postTitleText=this.topicTitle;
              lczqData.preview.postTypeCode=this.selectedValue
              lczqData.preview.postContentText=postContentText
              lczqData.preview.selectedStrategyValue=this.selectedStrategyValue;
              lczqData.preview.strategyVersionCode=this.selectedBackValue
              lczqData.preview.postCode=this.postCode;
              this.$router.push('/preview');
            // }else{
            //   MessageBox('提示','请选择一个回测');
            // }
          }else{
            MessageBox('提示','请输入内容');
          }
        }else{
          MessageBox('提示','请输入主题标题');
        }
      },
      submit(){
        var $loginAx=new this.$http('/loginStatus.html','post',{
          ajax: true
        },result=>{
          if(result.data.key=="success"){
            this.isLogin=result.data.params.IsLogin
            if(this.isLogin=='1'){
              var postContentText=this.value;
              if(this.topicTitle){
                if(postContentText){
                  // if(this.backResult){
                    var data={
                      ajax:true,
                      postTitleText:this.topicTitle,
                      postTypeCode:this.selectedValue.posttypecode,
                      postContentText:postContentText,
                      strategyVersionCode:this.selectedBackValue.key,
                      postCode:this.postCode
                    }
                    lczqData.preview.postTitleText=this.topicTitle;
                    lczqData.preview.postTypeCode=this.selectedValue;
                    lczqData.preview.postContentText=postContentText;
                    lczqData.preview.strategyVersionCode=this.selectedBackValue;
                    lczqData.preview.selectedStrategyValue=this.selectedStrategyValue;
                    lczqData.preview.postCode=this.postCode;
                    var $ax=new this.$http('/sqp/community/post.html','post',data,result=>{
                      this.$router.push('/communityNote/'+result.data.params.postCode);
                    })
                    $ax.start();
                  // }else{
                  //   MessageBox('提示','请选择一个回测');
                  // }
                }else{
                  MessageBox('提示','请输入内容');
                }
              }else{
                MessageBox('提示','请输入主题标题');
              }
            }else if(this.isLogin=='0'){
              this.$router.push({
                path: '/login',
                query: {redirect: 'postLaunch'}
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
      document.querySelector('.markdown-body').style.zIndex=0;
      if(lczqData.preview.postContentText){
        this.value=lczqData.preview.postContentText;
      }
      this.topicTitle=lczqData.preview.postTitleText;
      if(lczqData.preview.postTypeCode){
        this.selectedValue=lczqData.preview.postTypeCode
      }
      if(lczqData.preview.selectedStrategyValue){
        this.selectedStrategyValue=lczqData.preview.selectedStrategyValue;
      }
      if(lczqData.preview.strategyVersionCode){
        this.selectedBackValue=lczqData.preview.strategyVersionCode;
        this.backResult=this.selectedBackValue.text;
      }
      this.postCode=lczqData.preview.postCode;
    },
		components: {
      mavonEditor
    }
	}
</script>

<style scoped  lang="scss">
  .container{
    padding: 50px 10px;
  }
  .edit-title{
    font-size: 24px;
    color:#000;
    margin-bottom:50px;
  }
  .title{
    line-height: 32px;
    margin: 20px 0;
    font-size: 16px;
  }
  .base-select {
    position: relative;
    border: 1px solid #ccc;
    height: 40px;
    width: 200px;
    margin-bottom: 20px;
    &:after {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      content: '';
      width: 0;
      border-top: 5px solid black;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      height: 0;
    }
    .sub-selected-value {
      position: absolute;
      top: 7px;
      left: 0px;
      text-indent: 10px;
      .sub-select-list {
        position: absolute;
        top: 33px;
        background: white;
        width: 200px;
        box-shadow: 1px 1px 1px 1px #D9D9D9;
        z-index: 1501;
        .sub-select-item {
          width: auto;
          min-width: 7.25rem;
          height: 2.5rem;
          line-height: 2.5rem;
          position: relative;
          text-align: left;
          img {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(-0.1rem, -50%);
            width: .8125rem;
            height: .625rem;
          }
        }
        .current{
          background:#f5f5f5;
        }
      }
    }
  }
  .title-ipt{
    position:relative;
    width: 100%;
    height:40px;
    box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
    input{
      width:100%;
      height:100%;
      text-indent: 10px;
    }
    .choose-btn{
      position: absolute;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      background: #eee;
      color: #000;
      padding: 0 10px;
    }
  }
  .help{
    a{
      color: #337ab7;
    }
  }
  .btn{
    text-align: center;
    margin-top: 20px;
    .preview{
      margin-right: 10px;
    }
  }
  .modal-content{
    width: 300px;
    .modal-top{
      padding: 10px;
      height: 35px;
      line-height: 35px;
      background: #ccc;
      border-bottom: 1px solid #c1c1c1;
      .modal-top-title{
        font-size: 16px;
      }
      .close{
        font-size: 22px;
        font-weight: 700;
        color: #777;
      }
    }
    .modal-body{
      padding: 20px 20px 10px;
      .base-select{
        width:100%;
        .sub-select-list{
          width: 260px;
        }
      }
    }
    .modal-footer{
      padding: 0 0 20px;
      text-align: center;
      .confrim{
        margin-right: 20px;
      }
    }
  }
</style>