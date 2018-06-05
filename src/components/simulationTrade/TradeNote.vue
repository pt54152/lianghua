<template>
	<div class="aaa">
		<mt-header title="仿真交易-LCQuant">
		  <router-link to="/simulationTrade" slot="left">
		    <mt-button icon="back">返回</mt-button>
		  </router-link>
		</mt-header>
		<mt-tabbar v-model="selected" style="zIndex:100">
		  <mt-tab-item id="1">
		    <img slot="icon" src="../../assets/images/summary.png">
		    概述
		  </mt-tab-item>
		  <mt-tab-item id="2">
		    <img slot="icon" src="../../assets/images/trade.png">
		    交易详情
		  </mt-tab-item>
		  <mt-tab-item id="3">
		    <img slot="icon" src="../../assets/images/note.png">
		    日志
		  </mt-tab-item>
		  <mt-tab-item id="4">
		    <img slot="icon" src="../../assets/images/code.png">
		    代码
		  </mt-tab-item>
		</mt-tabbar>
		<!-- tab-container -->
		<mt-tab-container v-model="selected">
		  <mt-tab-container-item id="1">
		    <div class="btn" v-if="!isClose">
					<mt-button type="primary" size="small" class="top-btn" @click="pause" v-if="!isPause">暂停交易</mt-button>
		      <mt-button type="primary" size="small" class="top-btn" @click="start" v-if="isPause">启动交易</mt-button>
		      <mt-button type="primary" size="small" class="top-btn" @click="close">关闭交易</mt-button>
		    </div>
		    <div class="data-items clearfix">
		    	<div class="data-item fl">
		    		<div class="data-num" :class="{red:(strategyProfitRatioValueUnit>=0),green:(strategyProfitRatioValueUnit<0)}">{{strategyProfitRatioValueUnit}}%</div>
		    		<div class="data-name">策略收益</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num" :class="{red:(strategyAnnualProfitRatioValueUnit>=0),green:(strategyAnnualProfitRatioValueUnit<0)}">{{strategyAnnualProfitRatioValueUnit}}%</div>
		    		<div class="data-name">年化收益</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num" :class="{red:(benchmarkProfitRatioValueUnit>=0),green:(benchmarkProfitRatioValueUnit<0)}">{{benchmarkProfitRatioValueUnit}}%</div>
		    		<div class="data-name">基准收益</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num">{{alphaRatioValueUnit}}</div>
		    		<div class="data-name">Alpha值</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num">{{betaRatioValueUnit}}</div>
		    		<div class="data-name">Beta值</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num">{{sharpeRatioValue}}</div>
		    		<div class="data-name">Sharp值</div>
		    	</div>
		    	<div class="data-item fl">
		    		<div class="data-num" :class="{red:(maxRetracementRatioValueUnit>=0),green:(maxRetracementRatioValueUnit<0)}">{{maxRetracementRatioValueUnit}}%</div>
		    		<div class="data-name">最大回撤率</div>
		    	</div>
		    </div>
		    <div class="yield-curve">
		    	<div class="yield-curve-top clearfix">
		    		<div class="title fl">收益曲线</div>
		    		<div class="remark fr">历史收益</div>
		    	</div>
		    	<div id="yield-curve"></div>
		    </div>
		    <div class="today-position">
		    	<div class="position-top">
		    		<div class="title">今日持仓</div>
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
		    <div class="today-order">
		    	<div class="order-top clearfix">
		    		<div class="title fl">今日下单</div>
		    		<div class="order-link fr" @click="orderLink">下单详情>></div>
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
		  </mt-tab-container-item>
		  <mt-tab-container-item id="2">
		    <div class="today-order today-order2">
		    	<div class="order-top clearfix">
		    		<div class="title fl">交易详情</div>
		    		<div class="picker-open fr" @click="pickerOpen">{{nowDate}}</div>
		    	</div>
		    	<div class="order-table">
		    		<div class="order-table-head clearfix">
		    			<div class="item fl">标的/代码</div>
		    			<div class="item fl">成交价格/数量</div>
		    			<div class="item fl">交易时间/买卖</div>
		    		</div>
		    		<div class="order-table-body">
		    			<div class="table-list clearfix" v-for="orderList in historyOrderLists">
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
			    ref="picker"
			    type="date"
				  year-format="{value} 年"
				  month-format="{value} 月"
				  date-format="{value} 日"
				  :startDate="startDate"
				  :endDate="endDate"
			    v-model="pickerValue"
			    @confirm="handleConfirm">
			  </mt-datetime-picker>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="3" ref="log">
		  	<div class="main-body" :style="{ height: (wrapperHeight-95) + 'px' }">
		      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore1" :autoFill="isAutoFill">
		        <ul class="mui-table-view mui-grid-view log-content">
				    	<li v-for="item in noteData">
				    		<span class="log-date">{{item.strategyRunDatetime}}</span>
				    		-
				    		<span :class="{'log-info':item.logLevelName=='INFO','log-warning':item.logLevelName=='WARNING','log-error':item.logLevelName=='ERROR'}">{{item.logLevelName}}</span>
				    		-
				    		<span class="log-msg">{{item.strategyLogText}}</span>
				    	</li>
				    </ul>
		      </mt-loadmore>
		    </div>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="4" ref="editor">
		    <editor v-model="content"  @init="editorInit" lang="python"  theme="xcode" snippet="python" class="editor-content"></editor>
		  </mt-tab-container-item>
		</mt-tab-container>
		
	</div>
</template>

<script>
	// import echarts from 'echarts'
	// import echarts from 'echarts/index.common.js'
	import { MessageBox } from 'mint-ui'
	export	default{
		data(){
			return{
				selected:'1',
				summaryData:'',
				isClose:true,
				isPause:true,
				charts:'',
				positionLists:[],
				orderLists:[],
				strategyNO:0,
				beginDate:'',
				nowDate:this.format(new Date()),
				pickerValue:new Date(),
				startDate:new Date(),
				endDate:new Date(),
				historyOrderLists:[],
				offset:0,
				noteData:[],
				content:'',
				//可以进行上拉
	      allLoaded: false,
	      //是否自动触发上拉函数
	      isAutoFill: false,
	      wrapperHeight: 0,
	      currentPage:0
			}
		},
		computed:{
			tradeNoteid(){
				return this.$route.params.tradeNoteid
			},
			strategyProfitRatioValueUnit(){
				if(this.summaryData.strategyProfitRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.strategyProfitRatioValueUnit).toFixed(2)
				}
			},
			strategyAnnualProfitRatioValueUnit(){
				if(this.summaryData.strategyProfitRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.strategyAnnualProfitRatioValueUnit).toFixed(2);
				}
			},
			benchmarkProfitRatioValueUnit(){
				if(this.summaryData.benchmarkProfitRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.benchmarkProfitRatioValueUnit).toFixed(2);
				}
			},
			alphaRatioValueUnit(){
				if(this.summaryData.alphaRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.alphaRatioValueUnit).toFixed(4);
				}
			},
			betaRatioValueUnit(){
				if(this.summaryData.betaRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.betaRatioValueUnit).toFixed(4);
				}
			},
			sharpeRatioValue(){
				if(this.summaryData.sharpeRatioValue==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.sharpeRatioValue).toFixed(4);
				}
			},
			maxRetracementRatioValueUnit(){
				if(this.summaryData.maxRetracementRatioValueUnit==null){
					return '--'
				}else{
					return parseFloat(this.summaryData.maxRetracementRatioValueUnit).toFixed(2);
				}
			},
		},
		methods:{
			init1(){
				var $ax=new this.$http('/sqp/strategy/strategyTradeDetails.html','post',{strategyTradeNO:this.tradeNoteid,ajax:true},result=>{
					console.log(result)
					this.summaryData=result.data;
					document.querySelector('h1').innerHTML=this.summaryData.role.strategyTradeName;
					var strategyTradeStatus=this.summaryData.role.strategyTradeStatusName;
					if(strategyTradeStatus=="用户终止"){
						this.isClose=true;
					}else if(strategyTradeStatus=="正常暂停"){
						this.isClose=false;
						this.isPause=true;
					}else if(strategyTradeStatus=="运行中"){
						this.isClose=false;
						this.isPause=false;
					}
					if(this.summaryData.posiList.length!=0){
						this.positionLists=this.summaryData.posiList[0].posiInfo;
					}else{
						this.positionLists=[];
					}
					
					if(this.summaryData.detailOrderList.length!=0){
						this.orderLists=this.summaryData.detailOrderList[0].tradeInfo;
					}else{
						this.orderLists=[];
					}
					console.log(this.orderLists)
					this.getopiton('yield-curve',this.summaryData.roleList);
					this.beginDate=this.summaryData.role.beginDate;
					this.startDate=new Date(this.beginDate);
					this.strategyNO=this.summaryData.role.strategyNO;
				})
				$ax.start();
			},
			init2(){
				var $ax=new this.$http('/sqp/strategy/strategyTradeDetails/histOrder.html','post',{
					strategyTradeNO:this.tradeNoteid,
					ajax:true,
					orderDate:this.nowDate,
					strategyNO:this.strategyNO
				},result=>{
					if(result.data.key=='success'){
						if(result.data.params.orderList.length!=0){
							this.historyOrderLists=result.data.params.orderList[0].tradeInfo;
						}else{
							this.historyOrderLists=[];
						}
					}else{
						MessageBox('提示', result.data.message)
					}
					
				})
				$ax.start();
			},
			init3(){
				var $ax=new this.$http('/sqp/strategy/strategyTradeDetails/findRunLogs.html','post',{
					strategyShareNO:this.tradeNoteid,
					ajax:true,
					strategyNO:this.strategyNO,
					logLevelCodes:'1,2,3,4,5',
					offset:this.offset,
				},result=>{
					if(result.data.key=='success'){
						if(this.offset==0){//第一次加载数据
							this.allLoaded = false; // 可以进行上拉
							if(result.data.params.count<100){//日志结束了
								this.allLoaded = true;
							}
							this.noteData=result.data.params.runLogs;
							this.offset+=result.data.params.count;
							this.$refs.loadmore1.onTopLoaded();
						}else{
							if(result.data.params.count<100){//日志结束了
								this.allLoaded = true;
							}
							this.$refs.loadmore1.onBottomLoaded();
							this.offset+=result.data.params.count;
							this.noteData=this.noteData.concat(result.data.params.runLogs);
						}
						this.$refs.loadmore1.onBottomLoaded();
					}else{
						MessageBox('提示', result.data.message)
					}
					
				})
				$ax.start();
			},
			//   下拉刷新
	    loadTop() {
	    	this.offset=0;
	      this.init3();
	    },
	    // 上拉加载
	    loadBottom() {
	      this.init3();
	    },
			pause(){
				var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	MessageBox.confirm('确定暂停交易?').then(action =>{
								var $ax=new this.$http('/sqp/strategy/strategyTradeManagerPause.html','post',{strategyTradeNO:this.tradeNoteid,ajax:true},result=>{
									if(result.data.key=="success"){
										this.isPause=!this.isPause;
									}else{
										MessageBox('提示', result.data.message)
									}
								})
								$ax.start();
							});
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
			start(){
				var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	MessageBox.confirm('确定开始交易?').then(action =>{
								var $ax=new this.$http('/sqp/strategy/strategyTradeRunning.html','post',{strategyTradeNO:this.tradeNoteid,ajax:true},result=>{
									if(result.data.key=="success"){
										this.isPause=!this.isPause;
									}else{
										MessageBox('提示', result.data.message)
									}
								})
								$ax.start();
							});
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
			close(){
				var $loginAx=new this.$http('/loginStatus.html','post',{
      		ajax:true
      	},result=>{
      		if(result.data.key=="success"){
            if(result.data.params.IsLogin=='1'){
            	MessageBox.confirm('确定关闭交易?').then(action =>{
								var $ax=new this.$http('/sqp/strategy/strategyTradeManagerAbort.html','post',{strategyTradeNO:this.tradeNoteid,ajax:true},result=>{
									if(result.data.key=="success"){
										this.isClose=true;
									}else{
										MessageBox('提示', result.data.message)
									}
								})
								$ax.start();
							});
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
			getopiton(id,roleList){
				var operateDateArr=[];
				var benchmarkProfitRatioValueUnitArr=[];
				var strategyProfitRatioValueUnitArr=[];
				if(roleList.length>0){
					for(var i=0;i<roleList.length;i++){
						operateDateArr.push(roleList[i].operateDate)
						benchmarkProfitRatioValueUnitArr.push(roleList[i].benchmarkProfitRatioValueUnit)
						strategyProfitRatioValueUnitArr.push(roleList[i].strategyProfitRatioValueUnit)
					}
				};
        this.charts = echarts.init(document.getElementById(id));
        this.charts.setOption({
			    tooltip: {
			      trigger: 'axis',
			    },
			    legend: {
			      data:['策略收益',"基准收益"],
			    },
			    xAxis : [
		        {
		        	boundaryGap: false,
		        	data: operateDateArr
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
                  }  
              	}  
              }, 
		          data:strategyProfitRatioValueUnitArr
		        },{
	            name: '基准收益',
	            color: "pink",
	            type: 'line',
	            smooth: true,
	            symbolSize: 6,
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
                  }  
              	}  
          		}, 
		          data:benchmarkProfitRatioValueUnitArr
		        }
		    	]
				});
      },
      orderLink(){
      	this.selected='2';
      },
      pickerOpen(){
      	this.$refs.picker.open();
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
      editorInit () {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/html')                
        require('brace/mode/python')    //language
        require('brace/mode/less')
        require('brace/theme/xcode')
        require('brace/snippets/python') //snippet   
      },
      getCode(){
    		var $ax=new this.$http('/sqp/strategy/strategyTradeDetails_queryForCodes.html','post',{strategyTradeNO:this.tradeNoteid,ajax:true},result=>{
					if(result.data.key=="success"){
						this.content=result.data.params.codes
					}else{
						this.content.message;
					}
				})
				$ax.start();
      }
      
		},
		mounted(){
			this.wrapperHeight =document.body.offsetHeight;
			this.init1();
			this.init2();
			this.init3();
			this.$refs.editor.$el.style.height=document.body.offsetHeight-95+"px";
			// this.$refs.log.$el.style.height=document.body.offsetHeight-95+"px";
			this.getCode();
		},
		components: {
      editor: require('vue2-ace-editor'),
    }

	}
</script>

<style scoped lang="scss">
	.aaa{
		padding-bottom:55px;
	}
	.btn{
		text-align: right;
		padding: 20px;
		.top-btn{
			margin-left: 20px;
		}
	}
	.data-items{
		border-top: 5px solid #eee;
		.data-item{
			padding: 5px 0;
			box-sizing: border-box;
			width:33.33%;
			border-bottom: 1px solid #eee;
			border-right: 1px solid #eee;
			text-align: center;
			&:nth-child(3),&:nth-child(6){
				border-right: none;
			}
			&:nth-child(7){
				width:100%;
				border-bottom: none;
			}
			.data-num{
				line-height: 25px;
			}
			.data-name{
				color: #666;
				line-height: 25px;
			}
		}
	}
	.yield-curve{
		.yield-curve-top{
			background: #eee;
			padding: 10px 15px;
			.title{
				padding: 3px 5px;
			}
			.remark{
				color: #26a2ff;
				padding: 3px 5px;
				border: 1px solid #26a2ff;
				border-radius: 15px;
			}
		}
	}
	#yield-curve{
    width: 100%;
    height: 320px;
    margin: 20px auto;
  }
  .today-position{
  	.position-top{
  		border-top: 1px solid #ccc;
  		background-color: #eee;
  		padding: 10px 15px;
  		.title{
				padding: 3px 5px;
  		}
  	}
  	.position-table{
  		.position-table-head{
  			padding: 3px 0px;
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
  	margin-bottom: 40px;
  	.order-top{
  		border-top: 1px solid #ccc;
  		background-color: #eee;
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
  .today-order2{
  	margin-top:0px;
  	.order-table{
  		.order-table-body{
  			height: auto;
  		}
  	}
  }
  .editor-content{
  	width: 100%;
  	height: 100%;
  }
  .main-body{
  	background-color: #222;
  	overflow-y: scroll;
  	padding: 0 5px;
  	li{
  		font-size: 12px;
  		color:#ddd;
  		.log-date{
				color:#258ccd;
  		}
  		.log-info{
				color: #393;
  		}
  		.log-warning{
				color: #dad06f;
  		}
  		.log-error{
				color: #f22;
  		}
  	}
  }
</style>