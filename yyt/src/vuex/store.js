import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {getRefreshToken} from '../axios/axios';
Vue.use(Vuex)
// 首先声明一个状态 state
const state = {
  loginInfo:{
    logined: false,
    loginName:"",
    access_token:"",
    refresh_token:"",
    dateFlag:"",
    expires_in:"",
    token_type:"",
    userRole:"",
    navflag:"",
    user_type :"",
    group_id :"",
    group_type:'',
    navflag:"00",//01(登录返回数据)
    user_type:"org",//user//org(登录返回数据))
    group_code:"",
    logo_url:"",
    ic_no:''
  },
  group_id:'',
  group_type:'00'//01(登录返回数据)
}

// 然后给 actions 注册事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
const actions = {
//   increment: ({ commit }) => commit('increment'),
//   decrement: ({ commit }) => commit('decrement')
// 提交到mutations中处理
  loginin:({commit})=>commit('LOGININ'),//首次登录
  refreshToken:({commit})=>commit('REToken'),//五分钟刷新token
  loginout:({commit})=>commit('LOGINOUT'),//登出
  gettoken:({commit})=>commit('GETTOKEN'),//首次刷新token
  sendGroupid:({commit})=>commit('SENDGROUPID')
}
// 更新状态
const mutations = {
      LOGININ (state,odata) {
            // 登录状态变为登录
            state.loginInfo.logined = true
            // 然后去sessionStorage取用户数据(可不用)
            //let user = JSON.parse(sessionStorage.getItem('user'))
            // 用户数据分发
            state.loginInfo.loginName = odata.loginName;
            state.loginInfo.group_code = odata.group_code;
            state.loginInfo.logo_url = odata.logo_url;
            state.loginInfo.user_type = odata.user_type;
            state.loginInfo.group_id = odata.group_id;
            state.loginInfo.group_type = odata.group_type;
            state.loginInfo.navflag = odata.group_type;
            state.loginInfo.user_name = odata.user_name;
            state.loginInfo.group_name = odata.group_name?odata.group_name:'';
            state.loginInfo.ic_no = odata.ic_no?odata.ic_no:'';
            state.loginInfo.token_type ='Bearer';
            state.loginInfo.dateFlag = new Date().getTime();
       },
       // 登出
       LOGINOUT (state) {
            // 同上
            state.loginInfo.logined = false
            state.loginInfo.loginName =""
            state.loginInfo.access_token = ""
            state.loginInfo.refresh_token = ""
            state.loginInfo.token_type ='Bearer'
            state.loginInfo.dateFlag = ""
            state.loginInfo.ic_no = ""
       },
      GETTOKEN(state,odata){
        state.loginInfo.access_token = odata.access_token
        state.loginInfo.refresh_token = odata.refresh_token
      },
       /***刷新token**/
       REToken(state){
          let refresh_token = state.loginInfo.refresh_token;
          let params = {
            'grant_type':'password',
             'refresh_token':refresh_token
          };
          getRefreshToken(params).then((res) => {
            console.log(res);
            if(res.code=="200000"){
                 let data = res.data;
                 state.loginInfo.access_token = data.access_token;
                 state.loginInfo.refresh_token = data.refresh_token;
            };
          });
       },
       SENDGROUPID(state,odata){
          state.group_id = odata.group_id;
          state.group_type = odata.group_type;
      },
}
// 获取状态信息
const getters = {
    // gettoken(state){
    //     return  state.loginInfo.access_token;
    //   }
}

// 下面这个相当关键了，所有模块，记住是所有，注册才能使用
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
