<template>
  <section>
    <div class="page-table-box">
      <!-- 联系人信息 v-show="tabFlag==2"-->
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="卡号 :" prop="card">
          <el-input type="text" v-model="ruleForm2.card" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名 :" prop="name">
          <el-input type="text" v-model="ruleForm2.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="证件类型 :" prop="documentType">
          <el-select v-model="ruleForm2.documentType" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in documentTypeOption" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码 :" prop="identificationNumber">
          <el-input type="text" v-model="ruleForm2.identificationNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码 :" prop="initialCipher">
          <el-input type="number" v-model="ruleForm2.initialCipher" auto-complete="off" placeholder="6位数字密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码 :" prop="passwordConfirmation">
          <el-input type="number" v-model="ruleForm2.passwordConfirmation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始金额 :" prop="initialAmount">
          <el-input type="number" v-model="ruleForm2.initialAmount" auto-complete="off"
                    placeholder="0~1000.00"></el-input>
        </el-form-item>
        <el-form-item label="手机号码 :" prop="phoneNumber">
          <el-input type="text" v-model="ruleForm2.phoneNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型 :" prop="rechargeType">
          <el-select v-model="ruleForm2.rechargeType" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in rechargeTypeOption" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付单号 :" prop="orderId">
          <el-input type="text" v-model="ruleForm2.orderId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Email :" prop="email">
          <el-input type="text" v-model="ruleForm2.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="社保卡 :">
          <el-input type="text" v-model="ruleForm2.si_no" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>


      <div class="clearfix elform-btn">
        <el-button type="primary" class="fl" @click="submitFormEnd()">保存</el-button>
      </div>
    </div>
  </section>
</template>
<script>
  import {openAnAccount} from '../../axios/axios';
  export default {
    name: '',
    data() {
      let card = (rule, value, callback) => {
        if (value) {
//          let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
//          if (re.test(value)) {
//            return callback();
//          } else {
//            return callback(new Error('邮箱地址非法！'));
//          }
            return callback();
        } else {
          return callback(new Error('卡号不能为空！'));
        }
      };
      let name = (rule, value, callback) => {
        if (value) {
//          let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
//          if (re.test(value)) {
//            return callback();
//          } else {
//            return callback(new Error('邮箱地址非法！'));
//          }
            return callback();
        } else {
          return callback(new Error('姓名不能为空！'));
        }
      };
      let documentType = (rule, value, callback) => {
        if (value) {
//          let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
//          if (re.test(value)) {
//            return callback();
//          } else {
//            return callback(new Error('邮箱地址非法！'));
//          }
          return callback();
        } else {
          return callback(new Error('证件类型不能为空！'));
        }
      };
      let identificationNumber = (rule, value, callback) => {
        if (value) {
          if (this.ruleForm2.documentType == '1') {
              let re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
              if (re.test(value)) {
                return callback();
              } else {
                return callback(new Error('身份证输入非法！'));
              }
          }else if(this.ruleForm2.documentType == '2'){
            let re = /^[a-zA-Z0-9]{7,21}$/;
            if (re.test(value)) {
              return callback();
            } else {
              return callback(new Error('军官证输入非法！'));
            }
          }else if(this.ruleForm2.documentType == '3'){
            let re = /^[a-zA-Z0-9]{5,21}$/;
            if (re.test(value)) {
              return callback();
            } else {
              return callback(new Error('港澳通行证输入非法！'));
            }
          }else if(this.ruleForm2.documentType == '4'){
            let re = /^[a-zA-Z0-9]{3,21}$/;
            if (re.test(value)) {
              return callback();
            } else {
              return callback(new Error('护照输入非法！'));
            }
          }
        } else {
          return callback(new Error('证件号码不能为空！'));
        }
      };
      let initialCipher = (rule, value, callback) => {
        if (value) {
          let re = /^\d{6}$/;
          if (re.test(value)) {
            this.initialCipherValue = value
            return callback();
          } else {
            return callback(new Error('初始密码必须是六位！'));
          }

        } else {
          return callback(new Error('初始密码不能为空！'));
        }
      };
      let passwordConfirmation = (rule, value, callback) => {
        if (value) {
          if (this.initialCipherValue == value) {
            return callback()
          } else {
            return callback(new Error('两次密码输入不一致！'));
          }

        } else {
          return callback(new Error('确认密码不能为空！'));
        }
      };
      let initialAmount = (rule, value, callback) => {
        if (value) {
            if(value*1==0){
                return callback(new Error('初始金额不能为零！'));
            }else{
               return callback();
            }
        } else {
          return callback(new Error('初始金额不能为空！'));
        }
      };
      let phoneNumber = (rule, value, callback) => {
        if (value) {
          let re = /^[1][3,4,5,7,8][0-9]{9}$/;
          if (re.test(value)) {
            return callback();
          } else {
            return callback(new Error('手机号码非法！'));
          }
        } else {
          return callback(new Error('手机号码不能为空！'));
        }
      };
      let rechargeType = (rule, value, callback) => {
        if (value) {
           return callback();
        } else {
           return callback(new Error('支付类型不能为空！'));
        }
      };
      let orderId = (rule, value, callback) => {
        if (value) {
           return callback();
        } else {
          return callback(new Error('支付单号不能为空！'));
        }
      };
      let email = (rule, value, callback) => {
        if (value) {
          let re = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
          if (re.test(value)) {
            return callback();
          } else {
            return callback(new Error('邮箱地址非法！'));
          }
        } else {
          return callback();
        }
      };
      return {
        initialCipherValue: '',
        ruleForm2: {
          card: '',
          name: '',
          documentType: '',
          identificationNumber: '',
          initialCipher: '',
          passwordConfirmation: '',
          initialAmount: '',
          phoneNumber: '',
          rechargeType: '',
          orderId: '',
          si_no: '',
          email: '',
        },
        rules2: {
          card: [
            {validator: card,  required: true,trigger: 'blur'}
          ],
          name: [
            {validator: name,  required: true,trigger: 'blur'}
          ],
          documentType: [
            {validator: documentType, required: true, trigger: 'blur'}
          ],
          identificationNumber: [
            {validator: identificationNumber,  required: true,trigger: 'blur'}
          ],
          initialCipher: [
            {validator: initialCipher, required: true, trigger: 'blur'}
          ],
          passwordConfirmation: [
            {validator: passwordConfirmation,  required: true,trigger: 'blur'}
          ],
          initialAmount: [
            {validator: initialAmount,  required: true,trigger: 'blur'}
          ],
          phoneNumber: [
            {validator: phoneNumber, required: true, trigger: 'blur'}
          ],
          rechargeType: [
            {validator: rechargeType,  required: true,trigger: 'blur'}
          ],
          orderId: [
            {validator: orderId,  required: true,trigger: 'blur'}
          ],
          email: [
            {validator: email, trigger: 'blur'}
          ],
        },
        documentTypeOption: [
          {
            id: 1,
            name: '身份证'
          },
          {
            id: 2,
            name: '军官证'
          },
          {
            id: 3,
            name: '港澳台居住通行证'
          },
          {
            id: 4,
            name: '护照'
          }
        ],
        rechargeTypeOption: [
          {
            id: '01',
            name: '现金'
          },
          {
            id: '02',
            name: '储蓄卡'
          },
          {
            id: '04',
            name: '支付宝'
          },
          {
            id: '05',
            name: '微信'
          }
        ],
      };
    },
    mounted(){

    },
    methods: {
      submitForm(formName) {
       let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
          }
        });
         return flag;
      },
      submitFormEnd(){
//        if(this.ruleForm2.initialAmount.indexOf(".")==-1){
//          this.ruleForm2.initialAmount = this.ruleForm2.initialAmount+'.00'
//        }else{
//          this.ruleForm2.initialAmount = parseFloat(Math.round(this.ruleForm2.initialAmount*100)/100)
//        }
        let flag = false;
        flag = this.submitForm('ruleForm2');
        if(!flag){
           return;
        };
        let date = new Date();
        this.year = date.getFullYear();
        this.month = (date.getMonth() + 1) < 10 ? "0" + date.getMonth() : date.getMonth();
        this.date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        let currentTime = this.year + "" + this.month + "" + this.date + "" + this.hour + "" + this.minute + "" + this.second;

        let params = {
          seq_no: Number(currentTime),
          device_no: '-',
          ic_no: this.ruleForm2.card,
          user_name: this.ruleForm2.name,
          cert_type: String(this.ruleForm2.documentType),
          cert_num: this.ruleForm2.identificationNumber,
          password: this.ruleForm2.initialCipher,
          si_no: this.ruleForm2.si_no,
          contact_tel: this.ruleForm2.phoneNumber,
          email: this.ruleForm2.email,
          chnl_type: 'counter',
          oper_code: this.$store.state.loginInfo.loginName,
          amount: Number(this.ruleForm2.initialAmount),
          recharge_type: String(this.ruleForm2.rechargeType),
          order_id: this.ruleForm2.orderId
        };
        openAnAccount(params).then(res => {
          if(res.code == 200000){
            this.$message({
              message: res.msg,
              type: 'success',
              center: true
            });
            this.$router.go(-1);
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              center: true
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .right-box {
    padding-top: 20px;
  }

  /****基本资料*******/
  .page-tabbtn {
    border-bottom: 1px solid #DFE2E5;
  }

  .page-tabbtn li {
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 15px 28px 15px;
  }

  .page-table-box .page-tabbtn li.active {
    color: #13823A;
    border-bottom: 2px solid #13823A;
    margin-bottom: -1px;
  }

  .page-table-box .el-form {
    margin-top: 13px;
    width: 30%;
  }

  .page-table-box .elform-btn {
    width: 30%;
    margin-left: 100px;
    padding-bottom: 20px;

  }

  .page-table-box .icon-icon-- {
    font-size: 18px;
    padding-right: 5px;
    line-height: 18px;
  }
</style>


