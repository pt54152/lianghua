<template>
  <div>
    <mt-header title="消息中心">
      <!--<router-link to="" slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </router-link>-->
    </mt-header>
    <div class="newsBox">
      <div class="newsTitle">
        <span>消息</span>
      </div>
      <div id="tab">
        <ul>
          <li :class="{on:isFirst,off:!isFirst}" @click="isFirst=true">互动消息</li>
          <li :class="{on:!isFirst,off:isFirst}" @click="isFirst=false">系统消息</li>

        </ul>
        <div id="firstPage" v-show="isFirst">
          <div class="item" v-for="item in interactiveMessage">
            <router-link :to="'/communityNote/'+item.projectCode" class="clearfix">
              <div class="user-pic fl">
                <img :src="'http://180.153.242.115:20027'+(item.userPictureUrlPathText||defaultImg)" alt="">
              </div>
              <div class="message-info fl">
                <div class="message-title">{{item.messageContentText}}</div>
                <div class="message-content">
                  <span class="date">{{item.occurrenceDate}}</span>
                  &nbsp; &nbsp;@我，所在主题：“<span>{{item.projectName}}</span>”
                </div>
              </div>
            </router-link>
          </div>

        </div>
        <div id="secondPage" v-show="!isFirst">
          <div class="item" v-for="item in systemMessage" v-if="systemMessage.length!=0">
              <div class="message-info">
                <div class="message-title">{{item.messageContentText}}</div>
                <div class="message-content">
                  <span class="date">{{item.occurrenceDate}}</span>
                  &nbsp; &nbsp;LCQuant小助手</span>”
                </div>
              </div>
          </div>
          <div v-if="systemMessage.length==0">暂无系统消息</div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'Infomation',
    data() {
      return {
        isFirst:true,
        interactiveMessage:[],
        systemMessage:[],
        defaultImg:'/styles/img/default_portrait.png'
      }
    },
    methods: {
      // init() {
        // var myTab = document.getElementById("tab");    //整个div
        // var myUl = myTab.getElementsByTagName("ul")[0];//一个节点
        // var myLi = myUl.getElementsByTagName("li");    //数组
        // var myDiv = myTab.getElementsByTagName("div"); //数组

        // for (var i = 0; i < myLi.length; i++) {
        //   myLi[i].index = i;
        //   myLi[i].onclick = function () {
        //     for (var j = 0; j < myLi.length; j++) {
        //       myLi[j].className = "off";
        //       myDiv[j].className = "hide";
        //     }
        //     this.className = "on";
        //    /* this.color = "blue";*/
        //     myDiv[this.index].className = "show";
        //   }
        // }
      // },
      init() {
        var $ax= new this.$http("/sqp/user/userInformationCenter/wdzh/xxzx.html","get",{},result=>{
            if(result.data.key=="success"){
              this.interactiveMessage=result.data.params.hdxx;
              this.systemMessage=result.data.params.xtxx;
            }else {
              MessageBox('提示',result.data.message);
            }
        });
        $ax.start();
      }
    },
    // created(){
    //   var $loginAx=new this.$http('/loginStatus.html','post',{
    //     ajax: true
    //   },result=>{
    //     if(result.data.key=="success"){
    //       this.isLogin=result.data.params.IsLogin
    //       if(this.isLogin=='0'){//未登录
    //         this.$router.push({
    //           path: '/login',
    //           query: {redirect: '/infomation'} 
    //         })
    //       }
    //     }
    //   })
    //   $loginAx.start();
    // },
    mounted(){
      this.init();
    }

  }
</script>

<style scoped>
  .item{
    padding: 20px 5px;
    border-bottom: 1px solid #ccc;
  }
  .item .user-pic{
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
    overflow: hidden;
  }
  .message-info{
    color:#333;
  }
  .date{
    color:#989898;
  }

  #tab ul {
    list-style: none;
    display: block;
    height: 30px;
    line-height: 30px;
  }

  #tab ul li {
    background: #FFF;
    cursor: pointer;
    float: left;
    list-style: none;
    height: 29px;
    line-height: 29px;
    padding: 0px 10px;
  }

  #tab ul li.on {
    border: 1px solid #dddddd;
    border-bottom: 2px solid #FFF;
  }

  #firstPage,#secondPage {
    width: 100%;
    box-sizing: border-box;
    line-height: 24px;
    border-top: none;
    padding: 1px;
    border-top: 1px solid #dddddd;
    padding: 0 10px;
  }
  .newsTitle{
    font-size: 20px;
    padding-left: 10px;
    margin: 20px 0;
  }
  .newsTitle span{
    border: none;
  }
</style>
