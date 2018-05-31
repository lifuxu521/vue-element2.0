<template>
  <div>
    <div>
      <el-row style="height:74px;color: #626464;" class="main-top">
        <el-col :span="3" :offset="3" style="height: 80px;">
          <!--<div class="grid-content bg-purple home-logo" :style="{backgroundImage: 'url(' + icon + ')' }"></div>-->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-weibiaoti-2"></use>
          </svg>
        </el-col>
        <!--<el-col height="100%" :span="2" :offset="0">-->
          <!--<div class="grid-content bg-purple home_tab">首页</div>-->
        <!--</el-col>-->
        <!--<el-col height="100%" :span="2">-->
          <!--<div class="grid-content bg-purple home_tab">产品介绍</div>-->
        <!--</el-col>-->
        <!--<el-col height="100%" :span="2">-->
          <!--<div class="grid-content bg-purple home_tab">常见问题</div>-->
        <!--</el-col>-->
        <!--<el-col height="100%" :span="2">-->
          <!--<div class="grid-content bg-purple home_tab">合作机构</div>-->
        <!--</el-col>-->
        <!--<el-col height="100%" :span="2">-->
          <!--<div class="grid-content bg-purple home_tab">服务协议</div>-->
        <!--</el-col>-->
        <!--<el-col height="100%" :span="2">-->
          <!--<div class="grid-content bg-purple home_tab">关于我们</div>-->
        <!--</el-col>-->
        <el-col :span="4" :offset="11" :pull="0">
          <div class="grid-content bg-purple clearfix">
            <el-dropdown trigger="click" class="userinfo clearfix">
              <span class="el-dropdown-link userinfo-inner  clearfix">
              <i class="fr el-icon-arrow-down"></i>
                <span class="fr">{{ $store.state.loginInfo.user_name}}</span>
                <img :src="this.sysUserAvatar" class="fr"/></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="modify">
                  <i class="iconfont icon-mima"></i>密码修改
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout"><i class="iconfont icon-icon"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="background: #F5F5F5;padding: 20px 200px 0 200px;height: 100%">
      <div class="" style="width: 100%; display:flex;background: #ffffff;">
        <div class="nav-box">
          <template v-for="item in $router.options.routes[3].children">
            <el-tooltip class="item" effect="dark" v-bind:content="isCollapse?'':item.name" placement="right"
                        :disabled="isCollapse" v-if="item.hidden != false">
              <router-link v-bind:to="item.path">
                <i class="iconfont" v-bind:class="item.iconCls" v-bind:title="isCollapse?'':item.name"></i>
                <span v-show="isCollapse" class="">{{item.name}}</span>
              </router-link>
            </el-tooltip>
          </template>
        </div>
        <div class="" style="width:85%;">
          <div class="mt-left">
            <p class="">{{$route.name}}</p>
          </div>
          <div>
            <transition>
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </div>
      <el-footer style="height:108px;margin-top:20px">
        <p>Copyright&#169;  医源国际投资集团  All Rights Resevred 版权所有 复制必究</p>
      </el-footer>
    </div>
  </div>
</template>


<script>
  import icon from '@/assets/headLogin.png'
  export default{
    data(){
      return {
        icon: icon,
        activeName: 'second',
        isCollapse: true,
        sysUserAvatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
      }
    },
    mounted(){
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      changeLeftNav(){
        this.isCollapse = !this.isCollapse;
      },
      logout(){
        let _this = this;
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning',
        }).then(() => {
          _this.$router.push('/login');
        }).catch(() => {

        });
      },
      modify(){
        this.$router.push({path: '/modifyThePasswords'});
      }
    }
  }
</script>
<style scoped>
  @import "../../../static/commonCss/home.css";
  .icon {
    width: 8.5rem;
    /*height: 1em;*/
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-top:-25px;
  }
  .el-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .el-main {
    padding: 0 0 20px;
  }

  .el-aside {
    border-right: 1px solid #D8D8D8;
  }

  .nav-box {
    width: 17%;
    border-right: 1px solid #D8D8D8;
    /*background: #ffffff;*/
    height: 700px;
  }

  .home-logo {
    width: 180px;
    height: 80px;
    /*background-position: -155px -492px;*/
    /*background-repeat: no-repeat;*/
    /*margin: 10px 0 7px 8px;*/
  }

  .home-text {
    color: #14823B;
    height: 64px;
    line-height: 21px;
    margin-top: 14px;
    margin-left: -47px;
    font-size: 14px;
  }

  .home_tab {
    height: 74px;
    line-height: 74px;
    font-size: 14px;
    font-weight: 500;
  }

  .el-main {
    height: 100%;
  }

  .main-top {
    height: 74px;
    border-bottom: 1px solid rgba(226, 226, 226, 1);

  }

  .mt-left {
    padding-top: 8px;
    height: 42px;
    line-height: 50px;
    text-align: left;
    border-bottom: 1px solid #D8D8D8;
  }

  .mt-left i {
    display: block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    font-size: 28px;
    color: #14823B;
  }

  .mt-left p {
    padding: 8px 0 0 22px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .userinfo {
    float: right;
  }

  .main-top .userinfo .userinfo-inner {
    cursor: pointer;
    color: #354052;
    height: 100%;
    display: inline-block;
    position: relative;
    margin-top:7px;
  }

  .main-top .userinfo .userinfo-inner span {
    line-height: 20px;
    font-size: 14px;
    padding-top: 20px;
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .main-top .userinfo .userinfo-inner i {
    padding-top: 23px;
    width: 20px;
    height: 20px;
    color: #14823B;
  }

  .main-top .userinfo-inner img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 10px 10px 0px;
  }

  .el-dropdown-menu__item {
    padding-left: 56px;
    padding-right: 36px;
    position: relative;
  }

  .el-dropdown-menu__item i {
    display: block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 20px;
    position: absolute;;
    top: 7px;
    left: 22px;
    background-repeat: no-repeat;
  }

  .el-dropdown-menu__item i.icon-icon{
    line-height: 33px;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #ffffff;
    color: #14823B;
  }

  i.logout-item {
    margin: 0;
    top: 14px;
    background-position: -168px -738px;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover i.logout-item {
    background-position: -168px -763px;
  }
</style>
