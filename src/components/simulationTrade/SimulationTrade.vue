<template>
	<div>
		<mt-header title="仿真交易-LCQuant">
		</mt-header>
		<div class="simulationTrade-content">
			<mt-navbar v-model="selected">
			  <mt-tab-item id="1">全部</mt-tab-item>
			  <mt-tab-item id="2">进行中</mt-tab-item>
			  <mt-tab-item id="3">已关闭</mt-tab-item>
			</mt-navbar>

			<!-- tab-container -->
			<mt-tab-container v-model="selected">
			  <mt-tab-container-item id="1">
			    <my-simulationTradeTable :tableData="allTableData"></my-simulationTradeTable>
			  </mt-tab-container-item>
			  <mt-tab-container-item id="2">
			    <my-simulationTradeTable :tableData="runTableData"></my-simulationTradeTable>
			  </mt-tab-container-item>
			  <mt-tab-container-item id="3">
			    <my-simulationTradeTable :tableData="closeTableData"></my-simulationTradeTable>
			  </mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>

<script>
	import mySimulationTradeTable from '../common/SimulationTradeTable'
	export default{
		name:'SimulationTrade',
		data(){
			return{
				selected:'2',
				allTableData:[],
				runTableData:[],
				closeTableData:[]
			}
		},
		methods:{
			init(){
				var $ax=new this.$http('/sqp/strategy/strategyTradeInfoList.html','post',{
					ajax: true
				},result=>{
					var data=result.data.Rows;
					if(data){
						this.allTableData=data;
						for(let i=0;i<data.length;i++){
							if(data[i].strategyTradeStatusName=='运行中'||data[i].strategyTradeStatusName=='正常暂停'){
								this.runTableData.push(data[i])
							}else{
								this.closeTableData.push(data[i])
							}
						}
					}
				})
				$ax.start();
			}
		},
		mounted(){
			this.init();
			
		},
		components: {
      mySimulationTradeTable
    }
	}
</script>

<style lang="scss" scoped>
	
</style>