<template>
  <el-container>
    <el-header style="min-height:96px;">
      <el-row>
        <el-col :span="8">
          <div class="logo-icon fl" :style="{backgroundImage: 'url(' + icon + ')' }"></div>
          <div class="header-title fl">
              <p class="ht-top">医源通</p>
              <p class="ht-bottom">YI Yuan Tong</p>
           </div>
        </el-col>
      </el-row>
    </el-header>

    <el-main style="min-height:560px;">
      <div :style="{backgroundImage:'url(' + loginbg + ')'}" class="login-bg">
        <!-- <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm"> -->
        <el-row type="flex">
          <el-col :span="8" :offset="12" style="margin-top:74px;">
            <ul class="login-box">
              <li class="lb-title clearfix ipt-item">
                <p v-bind:class="{active:tabFlag==1,fl:true}" @click="tabClick(1)">持卡人</p>
                <p v-bind:class="{active:tabFlag==2,fl:true}" @click="tabClick(2)">医疗机构</p>
              </li>
              <li class="ipt-item">
                <div class="ipt-form">
                  <el-input v-bind:placeholder="tabFlag==2?'机构代码':'卡号'" type="text" v-model="loginToinfo.account"><i
                    slot="prefix" class="el-input__icon ipt-form1 iconfont icon-yonghu"></i></el-input>
                </div>
              </li>
              <li class="ipt-item">
                <div class="ipt-form">
                  <el-input placeholder="密码" type="password" v-model="loginToinfo.password"><i slot="prefix"
                                                                                               class="el-input__icon iconfont icon-mima"></i>
                  </el-input>
                </div>
              </li>
              <li class="ipt-item clearfix">
                <div class="ipt-form fl ipt-form3-l">
                  <el-input placeholder="验证码" v-model="loginToinfo.checkPass"><i slot="prefix"
                                                                                 class="el-input__icon iconfont icon-ecurityCode"></i>
                  </el-input>
                </div>
                <div class="ipt-form3-r fr" @click="createCode">{{identifyCode}}</div>
              </li>
              <li class="ipt-item clearfix">
                <!-- <p class="fr forget-pwd">忘记密码？</p> -->
              </li>
              <li class="ipt-item">
                <el-button type="success" @click.native.prevent="loginIn" @keyup.enter="loginIn" :loading="logining">
                  登录
                </el-button>
              </li>
            </ul>
          </el-col>
        </el-row>
        <!-- </el-form> -->
      </div>
    </el-main>
    <el-footer style="height:72px;">
      <!-- <p>地址： 北京市东城区金融大街XXX号  XXXX  邮编： 100000</p>
      <p>京ICP备案  XXXXXX号  京公安网备  XXXXXXX</p> -->
      <p>Copyright&#169;  医源国际投资集团  All Rights Resevred 版权所有 复制必究</p>
    </el-footer>
  </el-container>
</template>
<script>
  import md5 from 'js-md5';//MD5加密
  import icon from '@/assets/icon.png'
  import loginbg from '@/assets/login.png'
  import {requestLogin, getLogininfo} from '../../axios/axios';

  export default {
    data(){
      return {
        icon: icon,
        loginbg: loginbg,
        logining: false,
        tabFlag: 1,
        loginToinfo: {
          account: "test001",//  
          password: "123456",//  000000
          checkPass: ""
        },
        identifyCode: "REPG",
        resData: {}

      }
    },
    mounted(){
      this.createCode();
    },
    created: function () {
      var _this = this;
      //按下系统回车键
      window.onkeydown = function (e) {
        if (e.keyCode == "13" || e.keyCode == 13) {
          _this.loginIn();
        }
      }
    },
    methods: {
      createCode(){
        let code = "";
        let codeLength = 4;//验证码的长度
        let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数
        for (var i = 0; i < codeLength; i++) {
          //循环操作
          let index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
          code += random[index];//根据索引取得随机数加到code上
        }
        this.identifyCode = code;//把code值赋给验证码
      },
      loginIn(ev){
        var _this = this;
        if (!_this.loginToinfo.account) {
          if (_this.tabFlag == 1) {
            this.$message({
              message: '卡号不能为空！',
              type: 'error',
              center: true
            });
          } else if (_this.tabFlag == 2) {
            this.$message({
              message: '机构代码不能为空！',
              type: 'error',
              center: true
            });
          }
          return;
        } else if (!_this.loginToinfo.password) {
          this.$message({
            message: '密码不能为空！',
            type: 'error',
            center: true
          });
          return;
        } else if (!_this.loginToinfo.checkPass) {
          this.$message({
            message: '请输入验证码！',
            type: 'error',
            center: true
          });
          _this.createCode();
          return;
        } else if ((_this.loginToinfo.checkPass.toUpperCase()) != _this.identifyCode) {
          this.$message({
            message: '请输入正确的验证码！',
            type: 'error',
            center: true
          });
          _this.createCode();
          return;
        } else {
          let loginParams = {
            'grant_type': 'password',
            'client_id': 'portal',
            'user_type': (_this.tabFlag == 1) ? 'user' : 'org',
            'login_acct': _this.loginToinfo.account,
            'password': md5(_this.loginToinfo.password)
          };
          /**登录ajax***/
          // requestLogin(loginParams).then(res => {
          //   let _this = this;
          //   let data = res.data;
          //   if (res.code == "200000") {
          //     let param = {};
          //     let odata = {};
          //     odata.loginName = _this.loginToinfo.account;
          //     odata.access_token = data.access_token;
          //     odata.refresh_token = data.refresh_token;
          //     _this.$store.commit('GETTOKEN', odata);//首次注入token
          //     getLogininfo().then(res => {
          //       if (res.code == "200000") {
          //         console.log(res);
          //         let userinfodata = res.data;
          //         odata.user_type = userinfodata.user_type;
          //         odata.group_id = userinfodata.group_id;
          //         odata.group_name = userinfodata.group_name;
          //         odata.user_name = userinfodata.user_name?userinfodata.user_name:'';
          //         odata.group_code = userinfodata.group_code;
          //         odata.group_type = userinfodata.group_type;
          //         odata.logo_url = userinfodata.logo_url;
          //         odata.navflag = userinfodata.group_type;
          //         odata.ic_no = userinfodata.ic_no;
          //         _this.$store.commit('LOGININ', odata);//开启状态管理
                  if (_this.$store.state.loginInfo.user_type == 'user') {  // 用户中心
                    this.$router.push({path: '/personalHome'})
                  } else if (_this.$store.state.loginInfo.user_type == 'org') {//机构
                    if (_this.$store.state.group_type == '00') {//平台-运营中心
                      this.$router.push({path: '/operate'});
                    } else if (_this.$store.state.group_type == '01') {//医院-客户中心
                      this.$router.push({path: '/customer'});
                    }
                  }
              //   }
              // });
          //   } else {
          //     let msg = res.msg;
          //     this.$message({
          //       message: msg,
          //       type: 'error',
          //       center: true
          //     });
          //   }
          // });
          return;
        }
        /**elementUI 验证表单**/
        // this.$refs.ruleForm2.validate((valid) => {
        //   if (valid) {
        //     //_this.$router.replace('/table');
        //     this.logining = true;
        //     //NProgress.start();
        //     let loginParams = { username: this.loginToinfo.account, password: this.loginToinfo.password };

        //     requestLogin(loginParams).then(data => {
        //       this.logining = false;
        //       //NProgress.done();
        //       let { msg, code, user } = data;
        //       if (code !== 200) {
        //         this.$message({
        //           message: msg,
        //           type: 'error'
        //         });
        //       } else {
        //         sessionStorage.setItem('user', JSON.stringify(user));
        //         this.$router.push({ path: '/operate' });
        //       }
        //     });
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
      },
      /*****tab切换******/
      tabClick(num){
        this.tabFlag = num;
      }
    }
  }

</script>

<style>
  .el-container {
    background-color: #ffffff;
    height: 100%;
  }

  .el-header {
    padding: 0px;
  }

  .el-main {
    height: calc(100% - 222px);
    height: -moz-calc(100% - 222px); /*Firefox*/
    height: -webkit-calc(100% - 222px); /*chrome safari*/
    padding: 0;
  }

  /**********/
  .login-bg {
    height: 100%;
    background-repeat: no-repeat;
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
  }

  .el-footer {
    padding-top: 26px;
    padding-bottom: 26px;
  }

  .el-footer p {
    color: #888888;
    margin: 0 auto;
    font-size: 12px;
    line-height: 12px;
  }

  .el-footer p:nth-child(2) {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    background-position: -155px -492px;
    background-repeat: no-repeat;
    margin: 24px 0 24px 56px;
  }

  .header-title {
    padding-top: 24px;
    margin-left:8px;
  }

  .header-title p {
    margin: 0;
  }

  .header-title p.ht-top {
    line-height: 24px;
    font-size: 24px;
    font-weight: bold;
    color: #295c98;
    margin-bottom: 7px;
  }

  .header-title p.ht-bottom {
    line-height: 12px;
    font-size: 12px;
    color: #295c98;
  }

  /******/
  .login-box {
    background: #ffffff;
    padding: 18px 0 64px;
    border-radius: 8px;
  }

  .lb-title p {
    width: 50%;
    font-weight: 600;
    height: 52px;
    font-size: 16px;
    line-height: 52px;
    color: #8b8b8b;
    border-bottom: 1px solid #bfbfbf;
    cursor: pointer;
  }

  .lb-title p.active {
    color: #000;
    border-bottom: 2px solid #14823b;
  }

  .login-box .el-input > input.el-input__inner {
    border: 0;
    padding-left: 48px;
  }

  .login-box li.ipt-item {
    padding: 12px 74px 0;
  }

  .ipt-form {
    position: relative;
    line-height: 44px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .ipt-form i {
    display: block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 20px;
    margin-top: -2px;
  }

  .ipt-form i.ipt-form1 {
    margin-top: -4px;
  }

  .ipt-item button {
    width: 100%;
  }

  .ipt-item button:hover {
    background-color: #14823b;
  }

  .ipt-item .ipt-form3-l {
    width: 70%;
  }

  .ipt-item .ipt-form3-r {
    width: 25%;
    line-height: 46px;
    cursor: pointer;
    font-size: 14px;
    background: #ebebeb;
  }

  .forget-pwd {
    color: #2e5093;
    cursor: pointer;
  }
</style>
