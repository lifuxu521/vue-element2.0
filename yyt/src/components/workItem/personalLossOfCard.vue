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
          <td>{{centerData.contact_tel}}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      <button v-bind:disabled = "isable"  class="confirm_report" ref="confirm_report" @click="confirm_report()">{{isable?"挂失中":"确认挂失"}}</button>
    </div>
  </div>
</template>
<script>
  import icon from '@/assets/icon.png'
  import {personalCenter, lossOfCard} from '../../axios/axios';
  export default{
    data(){
      return {
        ic_no: '',
        oper_code: '',
        centerData: {},
        isable:false
      }
    },
    filters:{
     cert_type(val){
       console.log(val);
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
    created(){
      this.ic_no = this.$store.state.loginInfo.ic_no;
    },
    mounted(){
//      console.log(this.$store.state.loginInfo);
      this.getpersonData()

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
          console.log(res)
          this.centerData = res.data;
          if(res.data.state!="1"||res.data.state!=1){
              this.isable = true;
              this.$refs.confirm_report.style.background = '#E79A9C';
          }
        })
      },

      confirm_report(){
        let _this = this;
        this.$confirm('挂失后无法受理业务和缴费，是否继续?', '信息', {
          type: 'warning',
        }).then(() => {
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
            cert_type: this.centerData.cert_type,
            cert_num: this.centerData.cert_num,
            user_name: this.centerData.user_name,
            contact_tel: this.centerData.contact_tel,
            chnl_type: 'counter',
            oper_code: this.$store.state.loginInfo.loginName,
          };
          console.log(params)
          lossOfCard(params).then(res => {
            console.log(res)
            if(res.code == 200000){
              this.$message({
                message: '卡挂失成功',
                type: 'success',
                center:true
              });
              this.isable = true;
              this.$refs.confirm_report.style.background = '#E79A9C';
//              document.getElementsByClassName("confirm_report")[0].style({'background':'#E79A9C'});
//              document.getElementsByClassName("confirm_report")[0].innerHTML = '挂失中'
            }else{
               this.$message({
                  message: '卡挂失失败',
                  type: 'error',
                  center: true
            });
            }
          })
        }).catch(() => {

        });


      }
    }
  }
</script>
<style scoped>

  .header {
    height: 70px;
    line-height: 70px;
    text-align: left;
    border-bottom: 1px solid #CCCCCC;
  }

  .header p {
    margin-left: 30px;
  }

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

  .footer {
    margin-top: 30px;
    text-align: left;
  }

  .footer button {
    margin-left:2%;
    width: 200px;
    height: 32px;
    text-align: center;
    color: white;
    background: #D85A5E;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    font-size: 14px;
  }
</style>
