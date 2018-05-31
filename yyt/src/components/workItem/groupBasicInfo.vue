<template>
   <section>
       <div class="page-table-box">
           <ul class="page-tabbtn clearfix">
             <li v-bind:class="{active:tabFlag==1,fl:true}" @click="tabClick(1)">医院信息</li>
             <li v-bind:class="{active:tabFlag==2,fl:true}" @click="tabClick(2)">联系人信息</li>
           </ul>
           <!-- 联系人信息 v-show="tabFlag==2"-->
          <el-form v-show="tabFlag==2"  :model="ruleForm2"  :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="业务联系人 :" prop="yewuPerson">
                  <el-input type="text" v-model="ruleForm2.yewuPerson" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话 :">
                  <el-input type="number" v-model="ruleForm2.yewuPhone" auto-complete="off"></el-input>
                </el-form-item>
                  <el-form-item label="联系人Email :" prop="yewuEmail">
                  <el-input type="text" v-model="ruleForm2.yewuEmail" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="运维联系人 :" prop="yunweiPerson">
                  <el-input type="text" v-model="ruleForm2.yunweiPerson" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="联系人电话 :">
                   <el-input type="number" v-model="ruleForm2.yunweiPhone" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="联系人Email :" prop="yunweiEmail">
                  <el-input type="text" v-model="ruleForm2.yunweiEmail" auto-complete="off"></el-input>
                </el-form-item>
                 <!-- <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="ruleForm2.age"></el-input>
                  </el-form-item> --> 
            </el-form>
            <!-- 医院信息  v-show="tabFlag==1"-->
            <el-form  v-show="tabFlag==1"  status-icon  :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
                <el-form-item label="代码 :" >
                  <!-- <el-input type="text"  auto-complete="off"  v-model="ruleForm1.group_code"  :disabled="true"></el-input> -->
                  <p style="text-align:left;padding-left:15px;">{{ruleForm1.group_code}}</p>
                </el-form-item>
                <el-form-item label="名称 :" >
                  <!-- <el-input type="text"  auto-complete="off"  v-model="ruleForm1.group_name" :disabled="true"></el-input> -->
                  <p style="text-align:left;padding-left:15px;">{{ruleForm1.group_name}}</p>
                </el-form-item>
                <el-form-item label="图标 :" style="text-align: left;">
                    <img v-bind:src="ruleForm1.logo_url" alt=""   style="max-width:100%;" >
                    <el-upload class="upload-demo" name="uploadfile" :http-request="upload" action="string"  :on-preview="handlePreview" :on-remove="handleRemove"  :before-upload="beforeAvatarUpload"  :limit="1" :file-list="fileList2" >
                         <el-button size="small" type="primary"><i class="iconfont icon-icon--"></i>点击上传</el-button>
                     </el-upload>
                </el-form-item>
                 <el-form-item label="地址 :" >
                  <el-input type="text"  v-model="ruleForm1.address" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="医院电话 :">
                   <el-input type="number"  v-model="ruleForm1.contact_tel" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="医院网址 :" >
                  <el-input type="text"  v-model="ruleForm1.website"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="医院简介 :">
                 <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"   v-model="ruleForm1.group_desc"  placeholder="请输入内容" ></el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button type="primary"  class="fl" @click="submitForm('ruleForm1')">提交</el-button> -->
                  <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
                <!-- </el-form-item> -->
            </el-form>
            <div class="clearfix elform-btn"> 
                    <el-button type="primary" class="fl"  @click="submitFormEnd()">提交</el-button>
                    <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
            </div>
       </div>
   </section>
</template>
<script>
import {changeGroupInfo,getGroupInfo,upLoadPicFrom,downLoadImg} from '../../axios/axios';
export default {
  name: '',
  data() {
      // let checkAge = (rule, value, callback) => {
      //   if (!value) {
      //     return callback(new Error('字段不能为空！'));
      //   }
      //   setTimeout(() => {
      //     if (!Number.isInteger(value)) {
      //         callback(new Error('请输入数字值'));
      //     } else {
      //       if (value < 18) {
      //         callback(new Error('必须年满18岁'));
      //       } else {
      //         callback();
      //       }
      //     }
      //   }, 1000);
      // };
      let checkEmail=(rule,value, callback) =>{
           if(value){
              let  re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
              if (re.test(value)) {
                    return callback();
                } else {
                    return callback(new Error('邮箱地址非法！')); 
                }
           }else{
                return callback(new Error('邮箱地址不能为空！'));
           }
      };
      let yWTextRule = (rule,value, callback) => {
        if (!value) {
           return callback(new Error('业务联系人不能为空！'));
        }else{
           return callback();
        }
      };
      let yunWTextRule = (rule,value, callback) => {
         console.log(value);
        if (!value) {
           return callback(new Error('运维联系人不能为空！'));
        }else{
           return callback();
        }
      };
      let owebsite = (rule,value, callback) => {
        console.log(value);
        if (!value) {
            return callback(new Error('网址不能为空！'));
        }else{
            let  re = '^(http(s)?:\/\/)?(www\.)?[\w-]+\.\w{2,4}(\/)?$';
            let  reg=new RegExp(re); 
            if (reg.test(value)) {
                  return callback();
            } else {
                 return callback(new Error('请输入正确格式的网址！')); 
            } 
        }
      };
      return {
        ruleForm1:{
          group_id:'',
          group_code:'',
          group_type:'',
          group_name:'',
          logo_url:'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
          address:'',
          contact_tel:'',
          website:'',
          group_desc:'',
          },
        ruleForm2:{
            yewuPerson:'',
            yewuPhone:'',
            yewuEmail:'',
            yunweiPerson:'',
            yunweiPhone:'',
            yunweiEmail:''
          },
        rules1:{
           website:[
             {validator: owebsite, trigger: 'blur'}
             ]
        },
        rules2: {
          yunweiPerson: [
            { validator: yunWTextRule, trigger: 'blur' }
          ],
          yewuPerson:[
            { validator: yWTextRule, trigger: 'blur' }
          ],
          yewuEmail:[
            { validator:checkEmail, trigger: 'blur' }
          ],
          yunweiEmail: [
            { validator: checkEmail, trigger: 'blur' }
          ]
          // phone: [
          //   { validator: checkAge, trigger: 'blur' }
          // ]
        },
        fileList2: [],
        tabFlag:1,
        imgKey:''
      };
  },
  mounted(){
    let _this = this;
    _this.ruleForm1.group_id = this.$store.state.group_id,
    this.$store.state.group_id = null;
    _this.ruleForm1.group_type = this.$store.state.group_type,
    this.$store.state.group_type = null;
    _this.getGroupInfo();
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
          let _this = this;
          let flag = false;
          flag = this.submitForm('ruleForm1');
          flag = this.submitForm('ruleForm2');
          if(flag){
                let params = {
                        'group_id': _this.ruleForm1.group_id,
                        'group_code':_this.ruleForm1.group_code,
                        'group_name':_this.ruleForm1.group_name,
                        'group_type':_this.ruleForm1.group_type,
                        'logo_url':_this.imgKey,
                        'group_desc':_this.ruleForm1.group_desc,
                        'address':_this.ruleForm1.address,
                        'contact_tel':_this.ruleForm1.contact_tel,
                        'website':_this.ruleForm1.website,
                        'busi_linkman':_this.ruleForm2.yewuPerson,
                        'busi_contact_tel':_this.ruleForm2.yewuPhone,
                        'busi_contact_email':_this.ruleForm2.yewuEmail,
                        'oper_linkman':_this.ruleForm2.yunweiPerson,
                        'oper_contact_tel':_this.ruleForm2.yunweiPhone,
                        'oper_contact_email':_this.ruleForm2.yunweiEmail
                 }; 
                //  console.log(params);
                changeGroupInfo(params).then((res) => {
                  if(res.code=="200000"){
                         let msg = res.msg;
                         this.$message({
                            type: 'success',
                            message: msg,
                            center: true
                          });
                          _this.downLoadImg();//下载 图片
                           this.$router.go(-1);
                  }else{
                        let msg = res.msg;
                         this.$message({
                            type: 'error',
                            message: msg,
                            center: true
                          });
                  };
                  //NProgress.done();
              });
          }else{
             
          } 
      },
      resetForm(formName) {
          this.$refs[formName].resetFields();
      },
      upload(item){
            let _this = this;
            let formData = new FormData();
            formData.append('uploadfile', item.file);
            upLoadPicFrom(formData).then(res => {
              console.log('上传图片接口-数据', res)
              if(res.ret=="20000"||res.ret==20000){
                 _this.imgKey = res.data;
                 _this.downLoadImg();
              }else{
                  _this.$message({
                  message: "上传失败，请重新上传",
                  type: 'error',
                   center: true
                });
              }
            }).catch(err => {
               _this.$message({
                  message: "上传失败，请重新上传",
                  type: 'error',
                   center: true
                });
            })
      },
      downLoadImg(){
             let params = {
                    'key':this.imgKey  
                 }; 
                downLoadImg(params).then((res) => {
                  let msg = res.data;
                  if(res.ret=="20000"||res.ret==20000){
                         let img = res.data;
                          this.ruleForm1.logo_url = "data:*;base64,"+img;
                           this.fileList2 = [];
                  }else{
                        this.$message({
                            message:msg,
                            type: 'error',
                            center: true
                          });
                        this.fileList2 = [];
                  };
                  //NProgress.done();
              });
      },
      /***查询机构具体信息****/
      getGroupInfo(){
           let _this = this;
            let params = {
                  'group_id':_this.ruleForm1.group_id,
            }; 
           getGroupInfo(params).then((res) => {
                  console.log(res);
                  if(res.code=="200000"){
                       let data = res.data;
                           _this.ruleForm1.group_id = data.group_id;
                           _this.ruleForm1.group_code = data.group_code;
                           _this.ruleForm1.group_name = data.group_name;
                           _this.imgKey = data.logo_url;
                           _this.ruleForm1.address = data.address;
                           _this.ruleForm1.contact_tel = data.contact_tel;
                            _this.ruleForm1.website = data.website;
                            _this.ruleForm1.group_desc = data.group_desc;
                             _this.ruleForm2.yewuPerson = data.busi_linkman;
                            _this.ruleForm2.yewuPhone = data.busi_contact_tel;
                            _this.ruleForm2.yewuEmail = data.busi_contact_email;  
                            _this.ruleForm2.yunweiPerson = data.oper_linkman;  
                             _this.ruleForm2.yunweiPhone = data.oper_contact_tel;
                            _this.ruleForm2.yunweiEmail = data.oper_contact_email;  
                            _this.downLoadImg();//下载图片
                  };
                  //NProgress.done();
            });  
      },
      tabClick(num){
       this.tabFlag = num;
     },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      /**限制上传文件**/
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG&&!isPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG || isPNG && isLt2M;
      }
   }
}
</script>

<style scoped>
.right-box{
  padding-top:20px;
}
/****基本资料*******/
.page-tabbtn{
    border-bottom:1px solid #DFE2E5;
}
.page-tabbtn li{
   cursor: pointer;
   font-size: 14px; 
   font-weight: 500;  
   padding:15px 28px 15px;
}
.page-table-box .page-tabbtn li.active{
  color: #13823A;
  border-bottom: 2px solid #13823A;
  margin-bottom: -1px;
}
.page-table-box .el-form{
  margin-top:13px;
  width:30%;
}
.page-table-box .elform-btn{
  width:30%;
  margin-left:100px;
  padding-bottom: 20px;
  
}
.page-table-box .icon-icon--{
  font-size:18px;
  padding-right: 5px;
  line-height: 18px;
}
</style>


