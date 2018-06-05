<template>
	<div>
		<mt-header title="策略擂台-LCQuant">
		  <router-link to="/strategyRing" slot="left">
		    <mt-button icon="back">返回</mt-button>
		  </router-link>
		</mt-header>
		<div class="strategy-top clearfix">
			<div class="strategy-name fl">{{strategyDetailRole.strategyTradeName}}</div>
			<div class="strategy-author fr">
				<div class="author-pic fl">
					<img :src="author.userPictureUrlPathText" alt="">
				</div>
				<div class="author-name fl">{{author.userName}}</div>
			</div>
		</div>
		<div class="thinking">策略思路：{{strategyDetailRole.strategyIdeaText}}</div>
		<div class="item-content clearfix">
			<div class="item-cell fl">

				<div :class="{red:strategyDetailRole.strategyProfitRatioValue>=0,green:strategyDetailRole.strategyProfitRatioValue<0}">{{strategyProfitRatioValue}}%</div>
				<div class="text">累计收益</div>
			</div>
			<div class="item-cell fl">
				<div :class="{red:strategyDetailRole.todayProfitRatioValueUnit>=0,green:strategyDetailRole.todayProfitRatioValueUnit<0}">{{todayProfitRatioValueUnit}}%</div>
				<div class="text">今日收益</div>
			</div>
			<div class="item-cell fl">
				<div>{{maxRetracementRatioValue}}%</div>
				<div class="text">最大回撤</div>
			</div>
			<div class="item-cell fl">
				<div>{{strategyDetailRole.runningDaysCount}}</div>
				<div class="text">运行天数</div>
			</div>
		</div>
		<div class="charts">
			<div class="charts-title">收益率走势</div>
			<div id="kLine"></div>
		</div>
		<div class="position">
			<div class="position-title">交易详情</div>
			<div class="today-position">
	    	<div class="position-top">
	    		<div class="title">— 当前持仓 —</div>
	    	</div>
	    	<div class="position-table">
	    		<div class="position-table-head clearfix">
	    			<div class="item fl">标的/代码</div>
	    			<div class="item fl">盈亏/余额</div>
	    			<div class="item fl">成本/现价</div>
	    			<div class="item fl">可用/持仓</div>
	    		</div>
	    		<div class="position-table-body">
	    			<div class="table-list clearfix" v-for="positionList in positionLists">
	    				<div class="item fl">
	    					<div>{{positionList.secuName}}</div>
	    					<div>{{positionList.secuCode}}</div>
	    				</div>
	    				<div class="item fl">
	    					<div>{{positionList.investRlzProfit}}</div>
	    					<div>{{positionList.posiBalanceQty}}</div>
	    				</div>
	    				<div class="item fl">
	    					<div>{{positionList.investCostAmt}}</div>
	    					<div>{{positionList.latestPrice}}</div>
	    				</div>
	    				<div class="item fl">
	    					<div>{{positionList.posiAvailableQty}}</div>
	    					<div>{{positionList.grossPosiQty}}</div>
	    				</div>
	    			</div>
	    		</div>
	    	</div>
	    </div>
	    <div class="today-order today-order2">
	    	<div class="order-top clearfix">
	    		<div class="title fl">调仓详情</div>
	    		<div class="picker-open fr" @click="pickerOpen">{{nowDate}}</div>
	    	</div>
	    	<div class="order-table">
	    		<div class="order-table-head clearfix">
	    			<div class="item fl">标的/代码</div>
	    			<div class="item fl">成交价格/数量</div>
	    			<div class="item fl">交易时间/买卖</div>
	    		</div>
	    		<div class="order-table-body">
	    			<div class="table-list clearfix" v-for="orderList in orderLists">
	    				<div class="item fl">
	    					<div>{{orderList.secuName}}</div>
	    					<div>{{orderList.secuCode}}</div>
	    				</div>
	    				<div class="item fl">
	    					<div>{{orderList.matchNetPrice}}</div>
	    					<div>{{orderList.matchQty}}</div>
	    				</div>
	    				<div class="item fl">
	    					<div>{{orderList.orderTime}}</div>
	    					<div>{{orderList.buySellFlagName}}</div>
	    				</div>
	    			</div>
	    		</div>
	    	</div>
	    </div>
	    <mt-datetime-picker
		    ref="picker1"
		    type="date"
			  year-format="{value} 年"
			  month-format="{value} 月"
			  date-format="{value} 日"
			  :endDate="endDate"
		    v-model="pickerValue"
		    @confirm="handleConfirm">
		  </mt-datetime-picker>
		</div>
		<v-comment></v-comment>
	</div>
</template>

<script>
	// import echarts from 'echarts'
	// import echarts from 'echarts/index.common.js'
	import vComment from '../common/StrategyComment'
	export default{
		name:'StrategyNote',
		data(){
			return{
				strategyDetailRole:{},
				author:'',
				charts:'',
				positionLists:[],
				orderLists:[],
				beginDate:'',
				nowDate:this.format(new Date()),
				pickerValue:new Date(),
				// startDate:new Date(),
				endDate:new Date()
			}
		},
		computed:{
			strategyTradeNO(){
				return this.$route.params.strategyNoteid
			},
			strategyProfitRatioValue(){
				if(this.strategyDetailRole.strategyProfitRatioValue==null){
					return '--'
				}else{
					return parseFloat(this.strategyDetailRole.strategyProfitRatioValue).toFixed(2)
				}
				
			},
			todayProfitRatioValueUnit(){
				if(this.strategyDetailRole.todayProfitRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.strategyDetailRole.todayProfitRatioValueUnit).toFixed(2)
				}
			},
			maxRetracementRatioValue(){
				if(this.strategyDetailRole.maxRetracementRatioValue==null){
					return '--'
				}else{
					return parseFloat(this.strategyDetailRole.maxRetracementRatioValue).toFixed(2)
				}
			},
		},
		methods:{
			init(){
      	var $ax=new this.$http('/sqp/strategyGround/strategyGround.html','post',{
    			ajax:true,
    			strategyTradeNO:this.strategyTradeNO
    		},result=>{
    			console.log(result)
    			this.strategyDetailRole=result.data.strategyDetailRole;
    			this.author=result.data.author;
    			// this.startDate=new Date(result.data.strategyDetailRole.beginDate);
    			console.log(this.startDate)
    			if(result.data.posiList.length!=0){
    				this.positionLists=result.data.posiList[0].posiInfo;
    			}else{
    				this.positionLists=[];
    			}
    			if(result.data.detailOrderList.length!=0){
    				this.orderLists=result.data.detailOrderList[0].tradeInfo;
    			}else{
    				this.orderLists=[];
    			}
    			this.getopiton('kLine',result.data.dateList,result.data.strategyRate,result.data.baseRate)
      		
				})
				$ax.start();
      },
      init2(){
      	var $ax=new this.$http('/sqp/strategyGround/strategyTradeDetails/histOrder.html','post',{
					strategyTradeNO:this.$route.params.strategyNoteid,
					ajax:true,
					orderDate:this.nowDate,
				},result=>{
					console.log(result)
					if(result.data.key=='success'){
						if(result.data.params.orderList.length!=0){
							this.orderLists=result.data.params.orderList[0].tradeInfo;
						}else{
							this.orderLists=[];
						}
					}else{
						MessageBox('提示', result.data.message)
					}
					
				})
				$ax.start();
      },
      getopiton(id,dateList,strategyRate,baseRate){
        this.charts = echarts.init(document.getElementById(id));
        this.charts.setOption({
			    tooltip: {
			      trigger: 'axis',
			    },
			    legend: {
		        data:['策略收益',"基准收益"]
			    },
			    xAxis : [
		        {
		       		boundaryGap: false,
		         	data: dateList
		        }
			    ],
			    yAxis: {
		        type: 'value',
		        name:"单位:(%)"
			    },
			    dataZoom: {
		        show: true,
		        start : 0
			    },
			    series : [
			      {
	            name: '策略收益',
	            color: "red",
	            type: 'line',
	            smooth: true,
	            symbolSize:6,
	            areaStyle:{
              	normal:{
              		color:'#d9e3f4'
              	}
              },
	            itemStyle : {  
                normal : {  
                	color:'#255da8', 
                    lineStyle:{  
                      color:'#255da8'  
                    },
                  }  
            	}, 
			        data:strategyRate
			      },{
	            name: '基准收益',
	            color: "pink",
	            type: 'line',
	            smooth: true,
	            symbolSize:6,
	            areaStyle:{
              	normal:{
              		color:'#d9e3f4'
              	}
              },  
	            itemStyle : {  
                normal : {  
                	color:'#aa4643', 
                    lineStyle:{  
                      color:'#aa4643'  
                    },
                  }  
            	}, 
	            data:baseRate
			      }
			    ]
				})
      },
      pickerOpen(){
      	this.$refs.picker1.open();
      },
      handleConfirm(){
      	var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
			      	this.nowDate=this.format(this.pickerValue);
			      	this.init2();
            }else if(result.data.params.IsLogin=='0'){
              this.$router.push({
                path: '/login',
                query: {redirect: '/tradeNote/'+this.$route.params.tradeNoteid}
              })
            }
           }
          else{
            MessageBox('提示',result.data.message);
          }
        })
        $loginAx.start();
      },
      format(date){
      	var m,d;
      	m=(''+(date.getMonth() + 1)).length==1?('0'+(date.getMonth() + 1)):(date.getMonth() + 1);
      	d=(''+date.getDate()).length==1?('0'+date.getDate()):date.getDate();
      	 return date.getFullYear() + '-' + m + '-' + d;
      },
		},
		mounted(){
			this.init();
		},
		components:{
			vComment
		}
	}
	
</script>

<style scoped lang="scss">
	.strategy-top{
		padding: 10px 15px 0px;
		.strategy-name{
			line-height: 40px;
			font-size: 16px;
			color:#3674C9;
		}
		.strategy-author{
			.author-pic{
				width: 36px;
				height: 36px;
				border-radius: 50%;
    		overflow: hidden;
    		margin-top:2px;
			}
			.author-name{
				line-height: 40px;
				margin-left: 5px;
			}
		}
	}
	.thinking{
		padding: 0 15px 15px;
	}
	.item-content{
		padding: 15px 0;
		border-top:1px solid #ccc;
		border-bottom:1px solid #ccc;
		.item-cell{
			box-sizing: border-box;
			width: 25%;
			border-left: 1px solid #ccc;
			text-align: center;
			&:nth-child(1){
				border:none;
			}
			.text{
				color: #999;
			}
		}
	}
	.charts{
		.charts-title{
			line-height: 40px;
			background-color: #f7f7f7;
			padding-left: 15px;
			font-weight: 700;
		}
		#kLine{
			width: 100%;
    	height: 320px;
    	margin: 20px auto;
		}
	}
	.position{
		.position-title{
			line-height: 40px;
			background-color: #f7f7f7;
			padding-left: 15px;
			font-weight: 700;
		}
		.today-position{
	  	.position-top{
	  		//background-color: #eee;
	  		border-top: 1px solid #ccc;
	  		border-bottom: 1px solid #ccc;
	  		padding: 10px 15px;
	  		text-align: center;
	  		.title{
					padding: 3px 5px;
	  		}
	  	}
	  	.position-table{
	  		.position-table-head{
	  			padding: 5px 0px;
	  			text-align:center;
	  			border-bottom: 1px solid #ccc;
	  			.item{
	  				box-sizing: border-box;
						width: 25%;
						border-right: 1px solid #ccc;
						padding: 3px 0;
						&:nth-child(4){
							border:none;
						}
	  			}
	  		}
	  		.position-table-body{
	  			height: 232px;
  				overflow-y:scroll;
	  			.table-list{
	  				text-align: center;
	  				&:nth-child(2n){
	  					background-color: #eee;
	  				}
	  				.item{
	  					width: 25%;
	  					text-align: center;
	  					padding: 10px 0;
	  				}
	  			}
	  		}
	  	}
	  }
	  .today-order{
	  	margin-top: 40px;
	  	margin-bottom: 5px;
	  	.order-top{
	  		border-top: 1px solid #ccc;
	  		border-bottom: 1px solid #ccc;
	  		//background-color: #eee;
	  		padding: 10px 15px;
	  		.title{
					padding: 3px 5px;
	  		}
	  		.order-link{
	  			color:#337ab7;
	  		}
	  		.picker-open{
	  			padding: 3px 5px;
	  			background: #fff;
	  			border: 1px solid #ccc;
	  		}
	  	}
	  	.order-table{
	  		.order-table-head{
	  			padding: 3px 0px;
	  			text-align:center;
	  			border-bottom: 1px solid #ccc;
	  			.item{
	  				box-sizing: border-box;
						width: 33.33%;
						border-right: 1px solid #ccc;
						padding: 3px 0;
						&:nth-child(3){
							border:none;
						}
	  			}
	  		}
	  		.order-table-body{
	  			height: 232px;
  				overflow-y:scroll;
	  			.table-list{
	  				text-align: center;
	  				&:nth-child(2n){
	  					background-color: #eee;
	  				}
	  				.item{
	  					width: 33.33%;
	  					text-align: center;
	  					padding: 10px 0;
	  				}
	  			}
	  		}
	  	}
	  }
	}
</style>