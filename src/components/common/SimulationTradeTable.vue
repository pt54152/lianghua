<template>
	<div>
		<div class="items">
			<div class="item" v-for="item in tableData">
				<div class="item-name" @click="link(item.strategyTradeNO)">
							{{item.strategyTradeName}}
				</div>
				<ul class="analysis-lists clearfix">
					<li class="fl">
						<div class="analysis-title">频率</div>
						<div class="analysis-content">{{item.frequencyName}}</div>
					</li>
					<li class="fl">
						<div class="analysis-title">状态</div>
						<div class="analysis-content">{{item.strategyTradeStatusName}}</div>
					</li>
					<li class="fl">
						<div class="analysis-title">收益</div>
						<div class="analysis-content" :class="{red:(item.strategyProfitRatioValueUnit>=0),green:(item.strategyProfitRatioValueUnit<0)}">{{item.strategyProfitRatioValueUnit.toFixed(2)}}%</div>
					</li>
					<li class="fl">
						<div class="analysis-title">今日收益</div>
						<div class="analysis-content" :class="{red:(item.todayProfitRatioValueUnit>=0),green:(item.todayProfitRatioValueUnit<0)}">{{item.todayProfitRatioValueUnit.toFixed(2)}}%</div>
					</li>
					<li class="fl">
						<div class="analysis-title">最大回撤</div>
						<div class="analysis-content">{{item.maxRetracementRatioValue.toFixed(2)}}%</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:['tableData'],
		data(){
			return{

			}
		},
		methods:{
			link(strategyTradeNO){
				var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	this.$router.push('/tradeNote/'+strategyTradeNO)
            }else if(result.data.params.IsLogin=='0'){
              this.$router.push({
                path: '/login',
                query: {redirect: '/tradeNote/'+strategyTradeNO}
              })
            }
           }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
			}
		}

	}
</script>

<style scoped lang="scss">
	.items{
		margin-top: 3px;
		.item{

			border-top: 3px solid #eee;
			.item-name{
				text-indent: 20px;
					padding:5px 10px;
					line-height: 30px;
					color: #337ab7;
			}
			.analysis-lists{
				border-top: 1px solid #eee;
				padding: 5px 0;
				li{
					box-sizing: border-box;
					width: 20%;
					border-left: 1px solid #eee;
					text-align: center;
					&nth-child(1){
						border:none;
					}
					.analysis-title{
						line-height: 25px;
						color: #666;
					}
					.analysis-content{
						line-height: 25px;
					}
				}
			}
		}
	}
</style>