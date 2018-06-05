import Vue from 'vue'
import Router from 'vue-router'
import $ax from '../assets/js/common/lczq_ajax.js'

Vue.use(Router)

let router= new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
    	path: '/login',
      name: 'Login',
      component: resolve => {require(['@/components/login/Login'],resolve)}
    },
    {
      path: '/forgotPwd',
      name: 'ForgotPwd',
      component: resolve => {require(['@/components/login/ForgotPwd'],resolve)}
    },
    {
      path: '/register',
      name: 'Register',
      component: resolve => {require(['@/components/register/Register'],resolve)}
    },
    {
      path: '/community',
      name: 'Community',
      component: resolve => {require(['@/components/community/Community'],resolve)},
    },
    {
      path: '/communityNote/:noteid',
      name: 'CommunityNote',
      component: resolve => {require(['@/components/community/CommunityNote'],resolve)}
    },
    {
      path: '/postLaunch',
      name: 'PostLaunch',
      component: resolve => {require(['@/components/community/PostLaunch'],resolve)}
    },
    {
      path: '/preview',
      name: 'Preview',
      component: resolve => {require(['@/components/community/Preview'],resolve)}
    },
    {
      path: '/simulationTrade',
      name: 'SimulationTrade',
      component: resolve => {require(['@/components/SimulationTrade/SimulationTrade'],resolve)}
    },
    {
      path: '/tradeNote/:tradeNoteid',
      name: 'TradeNote',
      component: resolve => {require(['@/components/simulationTrade/TradeNote'],resolve)}
    },
    {
      path: '/infomation',
      name: 'Infomation',
      component: resolve => {require(['@/components/infomation/Infomation'],resolve)}
    },
    {
      path: '/strategyRing',
      name: 'StrategyRing',
      component: resolve => {require(['@/components/strategyRing/StrategyRing'],resolve)}
    },
    {
      path: '/myStrategy',
      name: 'MyStrategy',
      component: resolve => {require(['@/components/strategyRing/MyStrategy'],resolve)}
    },
    {
      path: '/strategyNote/:strategyNoteid',
      name: 'strategyNote',
      component: resolve => {require(['@/components/strategyRing/StrategyNote'],resolve)}
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // 如果你的連結是帶 # 這種
    // to.hash 就會有值(值就是連結)
    // 例如 #3
    if (to.hash) {
      return {
        // 這個是透過 to.hash 的值來找到對應的元素
        // 照你的 html 來看是不用多加處理這樣就可以了
        // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
        selector: to.hash
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  if(to.path==='/infomation'){
    var $loginAx=new $ax('/loginStatus.html','post',{ajax: true},result=>{
      if(result.data.key=="success"){
        if(result.data.params.IsLogin=='1'){
          return next()
        }else if(result.data.params.IsLogin=='0'){
          return router.replace('/login?redirect=infomation')
        }
      }
    })
    $loginAx.start();
  }else if(to.path==='/simulationTrade'){
    var $loginAx=new $ax('/loginStatus.html','post',{ajax: true},result=>{
      if(result.data.key=="success"){
        if(result.data.params.IsLogin=='1'){
          return next()
        }else if(result.data.params.IsLogin=='0'){
          return router.replace('/login?redirect=simulationTrade')
        }
      }
    })
    $loginAx.start();
  }else{
    return next()
  }
})

export default router;
