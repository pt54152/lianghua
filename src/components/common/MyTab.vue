<template>
	<div class="container">
		<mt-navbar v-model="selected">
		  <mt-tab-item id="1">收益</mt-tab-item>
		  <mt-tab-item id="2">风险</mt-tab-item>
		  <mt-tab-item id="3">源码</mt-tab-item>
		</mt-navbar>

		<!-- tab-container -->
		<mt-tab-container v-model="selected">
		  <mt-tab-container-item id="1">
		    <div id="main1"></div>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="2">
		    <ul class="items">
		    	<li v-for="risk in riskList" class="item fl">
		    		<div class="title">{{risk.name}}</div>
						<div class="contnet">{{risk.value}}</div>
		    	</li>
		    </ul>
		  </mt-tab-container-item>
		  <mt-tab-container-item id="3" style="height: 380px">
		    <editor v-model="content"  @init="editorInit" lang="python"  theme="xcode" snippet="python" v-if="isLogin" class="editor-content"></editor>
		    <p class="not-login" v-else>您尚未登录，请<router-link to=""><span @click="goLogin">登录</span></router-link>或者<router-link to="/register"><span>注册</span></router-link>查看源码。</p>
		  </mt-tab-container-item>
		</mt-tab-container>
	</div>
</template>

<script>
	// import echarts from 'echarts/index.common.js'
	export default{
		props:['tabData'],
		data(){
			return{
				charts:'',		
				selected:"1",
				riskList:[],
				content:'',
				isLogin:false
			}
		},
		methods:{
			//echarts表格
			getopiton(id,roleList){
				var operateDateArr=[];
				var benchmarkProfitRatioValueUnitArr=[];
				var strategyProfitRatioValueUnitArr=[];
				if(roleList){
					for(var i=0;i<roleList.length;i++){
						operateDateArr.push(
							roleList[i].strategyRunDate
						);
						benchmarkProfitRatioValueUnitArr.push(
							roleList[i].profitBenchmarkRatioValue
						);
						strategyProfitRatioValueUnitArr.push(
							roleList[i].strategyProfitRatioValue
						);
					};
				}
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
      //风险
      addRiskRole(riskRole){
      	var strategyProfitRatioValueUnit=riskRole.strategyProfitRatioValueUnit;
				if(strategyProfitRatioValueUnit==null){
					strategyProfitRatioValueUnit="--"
				}else{
					strategyProfitRatioValueUnit=strategyProfitRatioValueUnit.toFixed(2)+"%";
				}
				this.riskList.push({name:'策略收益',value:strategyProfitRatioValueUnit})

				var benchmarkProfitRatioValueUnit=riskRole.benchmarkProfitRatioValueUnit;
				if(benchmarkProfitRatioValueUnit==null){
					benchmarkProfitRatioValueUnit="--"
				}else{
					benchmarkProfitRatioValueUnit=benchmarkProfitRatioValueUnit.toFixed(2)+"%";
				}
				this.riskList.push({name:'基准收益',value:benchmarkProfitRatioValueUnit})

				var strategyAnnualProfitRatioValueUnit=riskRole.strategyAnnualProfitRatioValueUnit;
				if(strategyAnnualProfitRatioValueUnit==null){
					strategyAnnualProfitRatioValueUnit="--"
				}else{
					strategyAnnualProfitRatioValueUnit=strategyAnnualProfitRatioValueUnit.toFixed(2)+"%";
				}
				this.riskList.push({name:'年化收益',value:strategyAnnualProfitRatioValueUnit})

				var _alphaRatioValue=riskRole.alphaRatioValue;
				if(_alphaRatioValue==null){
					_alphaRatioValue='--'
				}
				this.riskList.push({name:'Alpha',value:_alphaRatioValue})

				var _betaRatioValue=riskRole.betaRatioValue;
				if(_betaRatioValue==null){
					_betaRatioValue='--'
				}
				this.riskList.push({name:'Beta',value:_betaRatioValue})

				var _sharpeRatioValue=riskRole.sharpeRatioValue;
				if(_sharpeRatioValue==null){
					_sharpeRatioValue='--'
				}
				this.riskList.push({name:'Sharpe',value:_sharpeRatioValue})

				var _sortinoRatioValue=riskRole.sortinoRatioValue;
				if(_sortinoRatioValue==null){
					_sortinoRatioValue='--'
				}
				this.riskList.push({name:'Sortino',value:_sortinoRatioValue})

				var _informationRatioValue=riskRole.informationRatioValue;
				if(_informationRatioValue==null){
					_informationRatioValue='--'
				}
				this.riskList.push({name:'Information Ratio',value:_informationRatioValue})

				var _algorithmVolatilityValue=riskRole.algorithmVolatilityValue;
				if(_algorithmVolatilityValue==null){
					_algorithmVolatilityValue='--'
				}
				this.riskList.push({name:'Volatility',value:_algorithmVolatilityValue})

				var _benchmarkVolatilityValue=riskRole.benchmarkVolatilityValue;
				if(_benchmarkVolatilityValue==null){
					_benchmarkVolatilityValue='--'
				}
				this.riskList.push({name:'Benchmark Volatility',value:_benchmarkVolatilityValue})

				var dailyWinRateRatioValueUnit=riskRole.dailyWinRateRatioValueUnit;
				if(dailyWinRateRatioValueUnit==null){
					dailyWinRateRatioValueUnit="--"
				}else{
					dailyWinRateRatioValueUnit=dailyWinRateRatioValueUnit.toFixed(2)+"%";
				}
				this.riskList.push({name:'日胜率',value:dailyWinRateRatioValueUnit})

				var profitAndLossRatioValue=riskRole.profitAndLossRatioValue;
				if(profitAndLossRatioValue==null){
					profitAndLossRatioValue="--"
				}else{
					profitAndLossRatioValue=profitAndLossRatioValue.toFixed(2)+"%";
				}
				this.riskList.push({name:'盈亏比',value:profitAndLossRatioValue})

				var maxRetracementRatioValueUnit=riskRole.maxRetracementRatioValueUnit;
				if(maxRetracementRatioValueUnit==null){
					maxRetracementRatioValueUnit="--"
				}else{
					maxRetracementRatioValueUnit=maxRetracementRatioValueUnit.toFixed(2)+"%";
				}
				this.riskList.push({name:'最大回撤',value:maxRetracementRatioValueUnit})
      },
      addCodes(codes,islogin){
      	this.isLogin=islogin
      	this.content=codes
      	if(islogin){ 
      		this.content=codes;
				}else{
					// this.$router.push('/login')

				}
      },
      //代码
      editorInit () {
        require('brace/ext/language_tools') 
        require('brace/mode/html')                
        require('brace/mode/python')    //language
        require('brace/mode/less')
        require('brace/theme/xcode')
        require('brace/snippets/python') //snippet   
      },
      goLogin(){
      	this.$router.push({
          path: '/login',
          query: {redirect: '/communityNote/'+this.$route.params.noteid}
        })
      }
      
		},
		mounted(){

			//echarts
			this.getopiton('main1',this.tabData.backTestResultList);
			//risk
			this.addRiskRole(this.tabData.riskRole);
			//code
			var codes=this.tabData.codes||'';
			this.addCodes(codes,this.tabData.isLogin);
    },
    components: {
      editor: require('vue2-ace-editor'),
    }
	}
</script>

<style scoped lang="scss">
	.container{
		padding: 0 20px 50px;
	}
	#main1{
    width: 100%;
    height: 320px;
    margin: 20px auto;
  }
  .editor-content{
  	width: 100%;
  	margin-top: 50px;
  }
  .items{
  	margin-top: 20px;
  	text-align:center;
  	min-height: 340px;
  	.item{
  		margin: 20px auto;
  		width: 33.333%;
  		.title{
				height: 40px;
				vertical-align:middle;
  		}
  	}
  }
  .not-login{
		height: 380px;
		text-align:center;
		line-height: 380px;
		span{
			color:#337ab7;
		}
	}
</style>