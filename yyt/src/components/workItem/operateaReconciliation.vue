<template>
  <section>
    <div class="page-funcarea clearfix">
      <div class="block fl">
         <span for="" class="fl label-page">日期：</span><el-date-picker v-model="time" type="daterange" :picker-options="pickerOptions" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" align="right"
                        format="yyyy-MM-dd" value-format="yyyyMMdd"></el-date-picker>
      </div>
      <div class="pageFuncarea-ipt fl clearfix">
        <span for="" class="fl">所属机构：</span>
        <el-select v-model="searchinfo.group_id" filterable placeholder="请选择所属机构">
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.group_name"
            :value="item.group_id">
          </el-option>
        </el-select>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
        <el-button type="success" @click="getGroupFeeList()">查询</el-button>
        <el-button @click="resSetSearch()">重置</el-button>
      </div>
    </div>
    <div class="page-table-box">
      <div class="pagetable-top clearfix">
        <el-button type="success" class="fl" @click="excel_down()"><i class="iconfont icon-xiazai"></i>下载</el-button>
        <div class="block fr">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="searchinfo.page_num" :page-size="searchinfo.page_size"
                         layout="total, prev, pager, next" :total="searchinfo.total_records">
          </el-pagination>
        </div>
      </div>
      <!-- 固定列表格 -->
      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="group_name"  align="center" label="机构名称">
          </el-table-column>
          <el-table-column  prop="close_month" align="center" label="结算月份">
          </el-table-column>
          <el-table-column prop="pay_amt" align="right" label="缴费金额" :formatter="toDecimal">
          </el-table-column>
          <el-table-column prop="recharge_amt" align="right" label="充值金额" :formatter="toDecimal">
          </el-table-column>
          <el-table-column prop="adjust_amt" align="right" label="调整金额" :formatter="toDecimal">
          </el-table-column>
          <el-table-column prop="close_amt" align="right" label="结余金额" :formatter="toDecimal">
          </el-table-column>
           <el-table-column prop="State" align="center" label="状态" :formatter="aRState">
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" min-width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="downloadiInfo(scope.$index, tableData)">明细下载　|</el-button>
              <el-button type="text" size="small" @click="addAccountAdjustment(scope.$index, tableData)">调账　|</el-button>
              <el-button type="text" size="small" @click="addExamine(scope.$index, tableData)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 审核弹出层 -->
    <el-dialog title="结算审核" :visible.sync="dialogExamineVisible" class="addcardseg-box" width="40%" Examine>
      <el-form>
        <el-form-item label="结算审核 ：" style="width: 251px">
          <el-radio v-model="radio" label="1">通过</el-radio>
          <el-radio v-model="radio" label="2">不通过</el-radio>
        </el-form-item>
        <el-form-item label="审核说明 ：" style="display: flex;">
          <el-input type="textarea" :rows="6" resize="none" style="width: 405px;" v-model="input_textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:table;margin:0 auto;">
        <el-button type="primary" @click="saveExamine()">保 存</el-button>
        <el-button @click="closeExamine()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 调帐弹出层 -->
    <el-dialog title="调帐处理" :visible.sync="dialogAccountAdjustmentVisible" class="addcardseg-box" width="40%">
      <el-form>
        <el-form-item label="调账整理 ：" style="width: 237px">
          <el-radio v-model="radio_type" label="1">补发</el-radio>
          <el-radio v-model="radio_type" label="2">补扣</el-radio>
        </el-form-item>
        <el-form-item label="金额 ：" style="width: 282px">
          <el-input style="width: 156px;" v-model="amount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="调账说明 ：" style="display: flex;">
          <el-input type="textarea" :rows="6" resize="none" style="width: 405px;" v-model="textarea_type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:table;margin:0 auto;">
        <el-button type="primary" @click="saveAccountAdjustment()">保 存</el-button>
        <el-button @click="closeAccountAdjustment()">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import {getGroupFeeList, getGroupList,settlementAudit,institutionalReconciliation,downLoadImg} from '../../axios/axios';
  import util from '../../../static/commonJs/util';
  import JSZip from 'jszip'
  export default {
    name: '',
    data () {
      return {
        searchinfo: {
          group_id:'',
          page_num: 1,
          page_size: 8,
          total_records: 0,
          ic_no: '',
          start_time: '',
          end_time: ''
        },
        groupOptions: [],
        tableData: [],
        list:[],
        itemData:{},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        time: "",
        dialogExamineVisible: false,
        dialogAccountAdjustmentVisible: false,
        radio: '1',
        input_textarea: '',
        department: [
          {
            users: '通过'
          },
          {
            users: "不通过"
          }
        ],
        radio_type: '1',
        textarea_type: '',
        amount: '',
      }
    },
    mounted(){
      this.getGroupList();
      this.getGroupFeeList(1,-1);
      this.getGroupFeeList();
    },
    methods: {
      toDecimal(row,column,cellValue){
         let str = util.toDecimal(cellValue);
         return str;
      },
      aRState(row,column,cellValue){
         let str = util.aRState(cellValue);
         return str;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      resSetSearch(){
        this.time = "";
        this.searchinfo.ic_no = "";
        this.searchinfo.group_id = "";
      },
      getGroupList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          'page_size': -1
        };
        console.log(params)
        getGroupList(params).then((res) => {
          console.log(res)
          if (res.code == "200000") {
            this.groupOptions = res.data;
          }
          ;
        });
      },
      getGroupFeeList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          'group_id': _this.searchinfo.group_id? _this.searchinfo.group_id:null,
          'ic_no': _this.searchinfo.ic_no,
          'page_num': (page_num) ? (page_num) : 1,
          'page_size': (page_size) ? (page_size) : (_this.searchinfo.page_size),
          'start_time': time? time[0] : '',
          'end_time': time? time[1] : ''
        };
        getGroupFeeList(params).then((res) => {
          if (res.code == "200000") {
            if(page_size=="-1"||page_size==-1){
                _this.list = [];
                res.data.map((item) => {
                    item.State = util.aRState(item.State);
                    return item;
                });
                _this.list = res.data;
            }else{
                this.tableData = res.data;
                this.searchinfo.page_num = (res.page_info.page_num) * 1;
                this.searchinfo.page_size = (res.page_info.page_size) * 1;
                this.searchinfo.total_records = (res.page_info.total_records) * 1;
            }
          }
          ;
          //NProgress.done();
        });
      },

      //审核
      addExamine(index, rows){
        this.itemData =  rows[index];
        this.dialogExamineVisible = true;
        this.input_textarea = '';
      },
      //关闭审核
      closeExamine(){
         this.itemData = {};
        this.dialogExamineVisible = false;
        this.input_textarea = '';
      },
      //保存审核
      saveExamine(){
        if(!this.input_textarea){
           this.$message({
              message: '请输入审核说明',
              type: 'warning',
               center: true,
           });
           return;
        };
        var date=new Date;
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month =(month<10 ? "0"+month:month);
        var mydate = (year.toString()+month.toString());
        let params = {
          'group_id':this.searchinfo.group_id?this.searchinfo.group_id:this.$store.state.loginInfo.group_id,
          'rpt_month':this.itemData.close_month,
          'audit_type':'sys',
          'audit_state':this.radio,
          'audit_desc':this.input_textarea
        };
        settlementAudit(params).then(res=>{
//          console.log(res);
          if(res.code == 200000){
            this.$message({
              message: res.msg,
              type: 'success',
              center: true
            });
            this.dialogExamineVisible = false;
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              center: true
            });
          }

        })
//        createCardseg(params).then((res) => {
//          let msg = res.msg;
//          if (res.code == "200000") {
//            _this.form.seg_no = "";
//            _this.form.group_id = "";
//            _this.dialogFormVisible = false;
//            _this.getcardsegList();
//            _this.$message({
//              message: msg,
//              type: 'success',
//              center: true
//            });
//          } else {
//            _this.$message({
//              message: msg,
//              type: 'error',
//              center: true
//            });
//          }
//          ;
//          //NProgress.done();
//        });
      },
      //调账
      addAccountAdjustment(index, rows){
        this.itemData =  rows[index];
        this.dialogAccountAdjustmentVisible = true;
        this.amount = '';
        this.textarea_type = ''
      },
      //关闭调账
      closeAccountAdjustment(){
        this.itemData = {};
        this.dialogAccountAdjustmentVisible = false;
        this.amount = '';
        this.textarea_type = ''
      },
      //保存调账
      saveAccountAdjustment(){
        if(!this.amount){
            this.$message({
              message: '请输入金额',
              type: 'warning',
               center: true,
            });
            return;
        };
        if(!this.textarea_type){
           this.$message({
              message: '请输入调账说明',
              type: 'warning',
               center: true,
           });
           return;
        };
        let params1 = {
          'group_id':this.searchinfo.group_id?this.searchinfo.group_id:this.$store.state.loginInfo.group_id,
          'audit_type':'sys',
          'rpt_month': this.itemData.close_month,
          'adjust_type':this.radio_type,
          'amount':Number(this.amount),
          'remark':this.textarea_type
        };
        institutionalReconciliation(params1).then(res=>{
//          console.log(res);
          if(res.code == 200000){
            this.$message({
              message: res.msg,
              type: 'success',
              center: true
            });
            this.getGroupFeeList();
            this.dialogAccountAdjustmentVisible = false;
          }else{
            this.$message({
              message: res.msg,
              type: 'error',
              center: true
            });
          }

        })
      },
      downloadiInfo(index, rows){
        let item = rows[index];
        let params = {
            'key':item.file_url
        }; 
        downLoadImg(params).then((res) => {
          let msg = res.data;
          if(res.ret=="20000"||res.ret==20000){
              let resData = res.data;// Base64.decode(res.data);
              this.zip_down(resData,item.file_name);
          }else{
                this.$message({
                    message:msg,
                    type: 'warning',
                    center: true
                });
          };
          //NProgress.done();
      });
     },
     zip_down(resData,name){
        let zip = new JSZip(); 
        let time = util.formatDate.format(new Date(),'yyyyMMddhhmmss'); 
        let zipFile = zip.folder(time);
        zipFile.file(name, resData, {base64: true});
         zip.generateAsync({type:"blob"}).then(function(content) {
              saveAs(content, "结算明细.zip");
        });
      },
      excel_down(){
          let _this = this;
          _this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['机构名称','结算月份', '缴费金额', '充值金额', '调整金额', '结余金额','状态']
            const filterVal = ['group_name','close_month', 'pay_amt', 'recharge_amt', 'adjust_amt', 'close_amt','State']
            const list = _this.list
            const data = _this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '结算列表',
              autoWidth: _this.autoWidth
            })
            _this.downloadLoading = false
          })
          // });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }
  }
</script>
