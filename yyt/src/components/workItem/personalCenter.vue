<template>
  <div id="box">
    <div class="center">
      <table class="cen_table">
        <tr>
          <td colspan="2" style="font-weight: 600">卡信息</td>
        </tr>
        <tr>
          <td>卡号：</td>
          <td>{{centerData.ic_no}}</td>
        </tr>
        <tr>
          <td>余额：</td>
          <td>{{centerData.amount}}</td>
        </tr>
        <tr>
          <td>快捷支付单笔上限：</td>
          <td>{{centerData.quick_pay_amt}}</td>
        </tr>
        <tr>
          <td>状态：</td>
          <td v-if="centerData.state == 1">正常</td>
          <!-- centerData.state -->
        </tr>
      </table>
    </div>
    <div style="border-top: 1px solid #DFE2E5;height: 1px;width: 80%;margin-left: 20px;"></div>
    <div class="center content2">
      <table class="cen_table">
        <tr>
          <td colspan="2" style="font-weight: 600">个人信息</td>
        </tr>
        <tr>
          <td>姓名：</td>
          <td>{{centerData.user_name}}</td>
        </tr>
        <tr>
          <td>证件类型：</td>
          <td>{{centerData.cert_type|cert_type}}</td>
        </tr>
        <tr>
          <td>证件号：</td>
          <td>{{centerData.cert_num}}</td>
        </tr>
        <tr>
          <td>社保号：</td>
          <td>{{centerData.si_no}}</td>
        </tr>
        <tr>
          <td>联系电话：</td>
          <td><span v-if="phoneEditFlag==true">{{centerData.contact_tel}}</span><el-input  class="edit-phone-ipt"  v-bind:style="{width:'130px'}" v-model="centerData.contact_tel" v-else  @blur="savePhoneNum()"></el-input><i class="iconfont fr phone-edit-icon icon-bianji" style="color: #14823B;" @click="editphoneNum()"></i></td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import icon from '@/assets/icon.png'
  import {personalCenter,cardModify} from '../../axios/axios';
  export default{
    data(){
      return {
        ic_no:'',
        oper_code:'',
        centerData:{},
        phoneEditFlag:true
      }
    },
    created(){
     this.ic_no = this.$store.state.loginInfo.ic_no;
    },
    mounted(){
//        console.log(this.$store.state.loginInfo);
        this.getpersonData()
    },
    filters:{
     cert_type(val){
       let str;
       switch(val)
          {
          case ("1"||1):
            str = "身份证";
            break;
          case ("2"||2):
            str = "军官证";
            break;
          case ("3"||3):
            str = "港澳台居民通行证";
            break;
          case ("4"||4):
            str = "护照";
            break;
          };
          return str;
     }
    },
    methods: {
      getpersonData(){
        let _this = this;
        let params1 = JSON.stringify({
          "device_no": '-',
          "ic_no": _this.ic_no,
          "chnl_type": 'self',
          "oper_code": _this.ic_no
        });
        personalCenter(params1).then(res => {
//          console.log(res)
          this.centerData = res.data
        })
      },
      editphoneNum(){
        this.phoneEditFlag = false;
      },
      savePhoneNum(){
          let _this = this;
          let regex = "^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$";
          let  reg=new RegExp(regex);
          if (!reg.test(this.centerData.contact_tel)) {
                 this.$message({
                  message: "请输入正确的手机号！",
                  type: 'warning',
                   center: true
                });
                return;
          };
          console.log(new Date().getTime());
          let params = JSON.stringify({
            'device_no':'-',
            "seq_no":new Date().getTime(),
            "ic_no": this.centerData.ic_no,
            'user_name':this.centerData.user_name,
            'contact_tel':this.centerData.contact_tel,
            "chnl_type": 'self',
            "oper_code": this.centerData.ic_no
          });
          cardModify(params).then(res => {
            console.log(res)
              let msg = res.data;
              if(res.code=="200000"||res.code==200000){
                   this.$message({
                      message:res.msg,
                      type: 'success',
                      center: true
                    });
                    this.phoneEditFlag = true;
              }else{
                  this.$message({
                      message:res.msg,
                      type: 'error',
                      center: true
                    });
              };
          })
      }
    }
  }
</script>
<style scoped>
  .center {
    margin-left: 30px;
    padding-top: 20px;
    margin-bottom: 20px;
    width: 80%;
  }
  .content2 {
    border: none;
  }

  .cen_table tr td {
    width: 160px;
    height: 40px;
    text-align: left;
    font-size:13px;
  }
  .phone-edit-icon{
     font-size: 20px;
     cursor: pointer;
  }
  .cen_table .edit-phone-ipt{

  }
</style>
