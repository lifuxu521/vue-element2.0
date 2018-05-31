<template>
  <el-container width="100%" height="100%">
    <!-- <template @transferUser="getUser"></template>
    <p>{{text}}</p> -->
    <el-aside v-bind:style="{width:(isCollapse?'200px':'64px')}" height="100%">
         <el-row style="height:64px">
        <el-col :span="24">
          <div class="grid-content bg-purple home-logo fl" :style="{backgroundImage: 'url(' + icon + ')' }"></div>
           <div class="fl home-text" v-show="isCollapse"><span>医源通</span><span>Yi yuan tong</span></div>
        </el-col>
      </el-row>
      <div class="nav-box">
        <template v-if="navflag=='00'">
          <template v-for="item in $router.options.routes[1].children">
            <el-tooltip class="item" effect="dark" v-bind:content="isCollapse?'':item.name" placement="right"
                        :disabled="isCollapse"  v-if="item.hidden != false">
              <router-link v-bind:to="item.path">
                <i class="iconfont" v-bind:class="item.iconCls" v-bind:title="isCollapse?'':item.name"></i>
                <span v-show="isCollapse" class="">{{item.name}}</span>

                <!-- <el-button>右边</el-button> -->
              </router-link>
            </el-tooltip>
          </template>
        </template>
        <template v-else-if="navflag=='01'">
          <template v-for="item in $router.options.routes[2].children">
            <el-tooltip class="item" effect="dark" v-bind:content="isCollapse?'':item.name" placement="right"
                        :disabled="isCollapse" v-if="item.hidden != false">
              <router-link v-bind:to="item.path" >
                <i class="iconfont" v-bind:class="item.iconCls" v-bind:title="isCollapse?'':item.name"></i>
                <span v-show="isCollapse" class="">{{item.name}}</span>
              </router-link>
            </el-tooltip>
          </template>
        </template>
      </div>
    </el-aside>
    <el-main>
      <el-row class="main-top">
        <el-col :span="6">
          <div class="grid-content bg-purple mt-left">
            <i class="fl iconfont icon-daohangliebiao" @click="changeLeftNav"></i>
            <template><p class="fl">{{$route.name}}</p></template>
          </div>
        </el-col>

        <el-col :span="6" :offset="12">
          <div class="grid-content bg-purple clearfix">
            <el-dropdown trigger="click" class="userinfo clearfix">
              <span class="el-dropdown-link userinfo-inner  clearfix">
                <i class="fr el-icon-arrow-down"></i>
                <span  class="fr">{{ $store.state.loginInfo.group_name}}</span>
                <img :src="this.sysUserAvatar" class="fr"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item v-show="navflag!='00'"><i class="iconfont icon-yonghu"></i>基本资料</el-dropdown-item> -->
                <!--<el-dropdown-item><i class="iconfont icon-mima"></i>密码修改</el-dropdown-item>-->
                <el-dropdown-item divided @click.native="logoutS">
                  <i class="iconfont icon-mima"></i>密码修改
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout"><i class="iconfont icon-icon"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      <transition name="fade" mode="out-in">
        <router-view class="right-box"></router-view>
      </transition>
    </el-main>
  </el-container>
</template>
<script>
  import icon from '@/assets/icon.png'
  export default {
    name: '',
    data () {
      return {
        icon: icon,
        isCollapse: true,
        navflag: '',
        sysUserAvatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
        text: "",
//        routerData:{}
      }
    },
    created(){
      this.navflag = this.$store.state.loginInfo.navflag;
    },
    mounted(){
        console.log(this.$router)
    },
    methods: {
      getUser(data){
        this.text = data;
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
      logoutS(){
        this.$router.push({path: '/modifyThePassword'});
      }
    }
  }
</script>
<style scoped>
  @import "../../../static/commonCss/home.css";

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

  .home-logo {
    width: 48px;
    height: 48px;
    background-position: -155px -492px;
    background-repeat: no-repeat;
    margin: 10px 0 7px 8px;
  }

  .home-text {
    color: #14823B;
    height: 64px;
    line-height: 70px;
    font-size: 14px;
  }

.home-text {
  margin-left:5px;
  color: #14823B;
  height: 64px;
  font-size: 14px;
}
.home-text span{
  display: block;
  width:100%;
  color: #295c98;
  height:32px;
  line-height: 32px;
}
.home-text span:first-child{
  font-weight: 600;
  font-size: 20px;
  line-height: 45px;
}
.home-text span:last-child{
  font-size: 10px;
}
  .el-main {
    height: 100%;
  }

  .main-top {
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(226, 226, 226, 1);

  }

  .mt-left {
    padding-top: 22px;
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
    display: block;
    position: relative;
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

