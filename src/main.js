import Vue from 'vue'
import App from './App'
import router from './router'


import './assets/css/base.css'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)
// import axios from 'axios'

import	hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
  	block.classList.add('hljs')
    // hljs.highlightBlock(block)
  })
})


//导航栏滑动回弹插件
import LyTab from 'ly-tab'
Vue.use(LyTab)


import $ax from './assets/js/common/lczq_ajax.js'
Vue.prototype.$http = $ax

Vue.prototype.$baseUrl='/api'  //生产的时候注释，这个是为了反向代理配置的
import marked from 'marked'  //生产的时候注释，通过在index.html尾部引入减小0.js的体积
import echarts from 'echarts/index.common.js' //生产的时候注释，通过在index.html尾部引入用于减小0.js的体积

import FastClick from 'fastclick'
FastClick.attach(document.body);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
