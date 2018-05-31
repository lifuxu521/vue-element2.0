// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import axios from "axios";
import VueRouter from 'vue-router'
import routes from './router'
import QS from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex/store'
//局部组件引用加密
// import md5 from 'js-md5';
// let Base64 = require('js-base64').Base64;

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.prototype.$http = axios;
/********禁用生产模式************* */
Vue.config.productionTip = false;

/******切换登陆(不可再次创建路由)*********/
routes.beforeEach((to, from, next) => {
  //NProgress.start();
  next();
  return
  /****跳转到登录页*****/
   if (to.path == '/login') {
        store.dispatch("loginout");//登出删除状态
   }else{
     let prevTime = store.state.loginInfo.dateFlag;
     let currentTime = new Date().getTime();
     let minute = (currentTime-prevTime*1)/1000/60;//分钟
     if(minute<5&&minute>4.5){
        store.dispatch("refreshToken");//刷新token
        store.state.loginInfo.dateFlag = currentTime;
      }else if(minute>=5||!prevTime){
         store.dispatch("loginout");//登出删除状态
         next({ path: '/login' });
         return;
      }
   };
})

/****创建实例******/
/* eslint-disable no-new */
new Vue({
   el: '#app',
   router:routes,
   store,
   template: '<App/>',
   render: h => h(App)
})
