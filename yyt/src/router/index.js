import Vue from 'vue'
import Router from 'vue-router'
//引用模板
import login from '@/components/loginPage/login'
import Home from '@/components/workItem/home'
import personalHome from '@/components/workItem/personalHome'
/*****运营中心********* */
import operate from '@/components/workItem/operate'
import organmanage from '@/components/workItem/organmanage'
import cardSegManage from '@/components/workItem/cardSegManage'
import wasteCardSearch from '@/components/workItem/wasteCardSearch'
import userSearch from '@/components/workItem/userSearch'
import operatePaySearch from '@/components/workItem/operatePaySearch'
import operateRefundsSearch from '@/components/workItem/operateRefundsSearch'
import operateaReconciliation from '@/components/workItem/operateaReconciliation'
import businessStatement from '@/components/workItem/businessStatement'
import groupBasicInfo from '@/components/workItem/groupBasicInfo'

/***客户中心******/
import customer from '@/components/workItem/customer'
import cardSearch from '@/components/workItem/cardSearch'
import BasicInfo from '@/components/workItem/BasicInfo'
import statisticalCharts from '@/components/workItem/statisticalCharts'
import paySearch from '@/components/workItem/paySearch'
import refundsSearch from '@/components/workItem/refundsSearch'
import aReconciliation from '@/components/workItem/aReconciliation'
import openAccount from '@/components/workItem/openAccount'

/***个人中心******/
import personalCenter from '@/components/workItem/personalCenter'
import personalPaymentInquiry from '@/components/workItem/personalPaymentInquiry'
import personalRechargeQuery from '@/components/workItem/personalRechargeQuery'
import personalLossOfCard from '@/components/workItem/personalLossOfCard'

/***密码修改******/
import modifyThePassword from '@/components/workItem/modifyThePassword'
import modifyThePasswords from '@/components/workItem/personModifyThePassword'



Vue.use(Router)

//配置路由
export default new Router({
  routes: [
    {
      path: '/login',
      name: '登陆',
      component: login,
      hidden: true
    },
    {
      path: '/operCenter',
      component: Home,
      name: '运营中心',
      children: [
          { path: '/operate', component: operate, name: '运营中心', iconCls:"icon-yunying",hidden:true},
          { path: '/organmanage', component: organmanage, name: '机构管理',iconCls:"icon-jigou",hidden:true},
          { path: '/cardSegManage', component: cardSegManage, name: '卡段管理',iconCls:"icon-icon1",hidden:true },
          { path: '/wasteCardSearch', component: wasteCardSearch, name: '废卡查询',iconCls:"icon-qiapiansousuo",hidden:true},
          { path: '/userSearch', component:userSearch, name: '用户查询',iconCls:"icon-yonghu",hidden:true },
          { path: '/operatePaySearch', component:operatePaySearch, name: '缴费查询',iconCls:"icon-chongzhi",hidden:true},
          { path: '/operateRefundsSearch', component: operateRefundsSearch, name: '充值退款查询',iconCls:"icon-chongzhi1",hidden:true},
          { path: '/operateaReconciliation', component: operateaReconciliation, name: '结算对账',iconCls:"icon-jiesuantongji",hidden:true},
          {path: '/modifyThePassword', component: modifyThePassword, name: '密码修改',hidden:false},
          {path: '/groupBasicInfo', component:groupBasicInfo, name: '机构编辑',hidden:false}
          // { path: '/businessStatement', component: businessStatement, name: '营业报表',iconCls:"icon-icon-p_mrpbaobiao"}
      ]
    },
    {
      path: '/customerCenter',
      component: Home,
      name: '客户中心',
      children: [
          { path: '/customer', component: customer, name: '客户中心', iconCls:"icon-yonghu",hidden:true},
          { path: '/BasicInfo', component: BasicInfo, name: '基本资料', iconCls:"icon-jibenziliao",hidden:true},
          { path: '/cardSearch', component: cardSearch, name: '发卡查询', iconCls:"icon-qiapiansousuo",hidden:true},
          { path: '/paySearch', component: paySearch, name: '缴费查询',iconCls:"icon-chongzhi",hidden:true},
          { path: '/refundsSearch', component: refundsSearch, name: '充值退款查询',iconCls:"icon-chongzhi1" ,hidden:true},
          { path: '/aReconciliation', component: aReconciliation, name: '结算对账',iconCls:"icon-jiesuantongji" ,hidden:true},
          // { path: '/statisticalCharts', component: statisticalCharts, name: '统计报表',iconCls:"icon-icon-p_mrpbaobiao" },
          { path: '/openAccount', component: openAccount, name: '开户服务',iconCls:"icon-kaihu",hidden:true},
          {path: '/modifyThePassword', component: modifyThePassword, name: '密码修改',hidden:false},
        ]
    },
    {
      path: '/personalHome',
      component: personalHome,
      name: '个人中心',
      redirect:'personalCenter',
      children: [
        { path: '/personalCenter', component: personalCenter, name: '个人中心', iconCls:"icon-yonghu",hidden:true},
        { path: '/personalPaymentInquiry', component: personalPaymentInquiry, name: '缴费查询',iconCls:"icon-chongzhi",hidden:true},
        { path: '/personalRechargeQuery', component: personalRechargeQuery, name: '充值查询',iconCls:"icon-chongzhi1",hidden:true},
        { path: '/personalLossOfCard', component: personalLossOfCard, name: '卡挂失',iconCls:"icon-jiesuantongji",hidden:true},
        {path: '/modifyThePasswords', component: modifyThePasswords, name: '密码修改',hidden:false},
      ]
    },
  ]
})
