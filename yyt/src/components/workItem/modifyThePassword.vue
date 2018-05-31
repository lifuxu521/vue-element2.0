<template>
  <el-row type="flex">
    <el-col :span="8" :offset="1" class="el_row">
      <ul class="login-box-modify">
        <li class="ipt-item">
          <div class="ipt-form">
            <span>原密码：</span>
            <input type="password" v-model="loginToinfo.primaryPass">
          </div>
        </li>
        <li class="ipt-item">
          <div class="ipt-form">
            <span>新密码：</span>
            <input type="password" v-model="loginToinfo.newPass" placeholder="长度6-16位，至少包含数字、字母、符号、大小写">
          </div>
        </li>
        <li class="ipt-item">
          <div class="ipt-form">
            <span>确认密码：</span>
            <input type="password" v-model="loginToinfo.confirmPass">
          </div>
        </li>
        <li class="ipt-item clearfix">
          <div class="ipt-form fl ipt-form3-l">
            <span style="width: 30%;">验证码：</span>
            <input type="text" v-model="loginToinfo.verificationCode" style="width: 63%">
          </div>
          <div class="ipt-form3-r fr" @click="createCode">{{identifyCode}}</div>
        </li>
        <li class="ipt-item clearfix" style="margin-top: 15px;">
          <button class="modify_save" @click="modify_save()">保存</button>
        </li>
      </ul>
    </el-col>
  </el-row>
</template>
<script>
  import md5 from 'js-md5';//MD5加密
  import {modifyThePassword} from '../../axios/axios';
  export default{
    data(){
      return {
        loginToinfo: {
          primaryPass: "",//lifuxu003  1551144106
          newPass: "",//123456  000000
          confirmPass: "",
          verificationCode: "",
        },
        identifyCode: "REPG",
      }
    },
    mounted(){
      this.createCode();
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
      modify_save(){
        if(this.loginToinfo.newPass.length<6||this.loginToinfo.newPass.length>16){
             this.$message({
              message:'新密码长度6-16位！',
              type: 'warning',
              center:true
            });
            return;
        };
        if(this.loginToinfo.confirmPass!=this.loginToinfo.newPass){
            this.$message({
              message:'请确认两次密码输入一致！',
              type: 'warning',
              center:true
            });
            return;
        };
        if(this.identifyCode!= (this.loginToinfo.verificationCode.toUpperCase())){
            this.$message({
              message:'请输入正确的验证码！',
              type: 'warning',
              center:true
            });
            this.createCode();
            return;
        };
        let params = {
          orig_pwd:md5(this.loginToinfo.primaryPass),
          new_pwd:this.loginToinfo.newPass,
        };
        modifyThePassword(params).then(res=>{
          if(res.code == 200000){
            this.$message({
              message: res.msg,
              type: 'success',
              center:true
            });
            this.$router.go(-1);
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              center:true
            });
          }
        })

      }
    }
  }
</script>
<style scoped>
  .el_row {
    width: 95%;
    margin-left: 20px;
    background: #ffffff;
    margin-top: 20px;
    height: 629px;
  }

  .login-box-modify {
    width: 40%;
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

  .login-box-modify .el-input > input.el-input__inner {
    border: 0;
    /*padding-left: 48px;*/
  }

  .login-box-modify li.ipt-item {
    /*padding: 12px 74px 0;*/
  }

  .login-box-modify .ipt-form span{
    display: inline-block;
    width:23%;
  }
  .modify_save {
    background: #19AC4D;
    cursor: pointer;
    outline:none;
    border:1px solid #19AC4D;
    border-radius: 4px;
    color: #ffffff;
    display: inline-block;
    width:38%;
    height:30px;
    margin-left:-51px;
  }
  .login-box-modify .ipt-form input{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 35px;
    line-height: 35px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 75%;
    padding-left: 20px;
  }
  .login-box-modify .ipt-form {
    position: relative;
    line-height: 44px;
    border: 0px solid #dcdfe6;
    border-radius: 4px;
  }

  .login-box-modify .ipt-item .ipt-form3-l {
    width: 70%;
  }

  .login-box-modify.ipt-item .ipt-form3-r {
    width: 25%;
    line-height: 46px;
    cursor: pointer;
    font-size: 14px;
    background: #ebebeb;
  }
</style>
