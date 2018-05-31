<template>
   <section>
     <div class="page-funcarea clearfix">
      <div class="block fl">
            <span for="" class="fl label-page">日期：</span><el-date-picker   v-model="time"  type="daterange"  :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  align="right"   format="yyyy-MM-dd" value-format="yyyyMMdd"></el-date-picker>
      </div>
      <div class="pageFuncarea-ipt fl clearfix">
              <span for="" class="fl">卡号：</span><el-input  placeholder="请输入卡号"  v-model="searchinfo.ic_no" class="fl"></el-input>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
          <el-button type="success" @click="getPaySearch()">查询</el-button>
          <el-button @click="resSetSearch()">重置</el-button>
      </div>
     </div>
      <div class="page-table-box">
          <div class="pagetable-top clearfix">
              <el-button type="success" class="fl" @click="excel_down()"><i class="iconfont icon-xiazai"></i>下载</el-button>
                <div class="block fr">
                <el-pagination  @size-change="handleSizeChange"   @current-change="handleCurrentChange" :current-page.sync="searchinfo.page_num" :page-size="searchinfo.page_size" layout="total, prev, pager, next" :total="searchinfo.total_records">
                </el-pagination>
              </div>
          </div>
          <!-- 固定列表格 -->
          <template>
            <el-table  :data="tableData"    style="width: 100%">
              <el-table-column fixed prop="create_time"  align="center" label="操作时间" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="ic_no" align="center" label="卡号" >
              </el-table-column>
              <el-table-column prop="user_name" align="center" label="姓名"  >
              </el-table-column>
              <el-table-column  prop="inout_flag" align="center" label="缴退标识" :formatter="inout_flag">
              </el-table-column>
              <el-table-column prop="amount" align="right" label="金额" :formatter="toDecimal">
              </el-table-column>
              <el-table-column prop="oper_code" align="center" label="设备号" >
              </el-table-column>
              <el-table-column prop="busi_code" align="center" label="业务类型" :formatter="busi_code">
              </el-table-column>
               <el-table-column prop="order_id" align="center" label="订单号" >
              </el-table-column>
              <!-- <el-table-column fixed="right"  label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
      </div>
   </section>
</template>
<script>
import {getPaySearchList} from '../../axios/axios';
import util from '../../../static/commonJs/util';
export default {
  name: '',
  data () {
    return {
       searchinfo:{
         page_num:1,
         page_size:8,
         total_records:0,
         ic_no:'',
         start_time:'',
         end_time:''
       },
       list:[],
       tableData: [
        ],
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
        time:""
    }
  },
  mounted(){
    this.getPaySearch(1,-1);
    this.getPaySearch();
  },
  methods:{
      toDecimal(row,column,cellValue){
         let str = util.toDecimal(cellValue);
         return str;
      },
      inout_flag(row,column,cellValue){
         let str = util.inout_flag(cellValue);
         return str;
      },
      busi_code(row,column,cellValue){
         let str = util.busi_code(cellValue);
         return str;
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          let _this = this;
          let page_num = val*1;
          _this.getPaySearch(page_num,_this.searchinfo.page_size);
      },
      resSetSearch(){
        this.time = "";
        this.searchinfo.ic_no = "";
     },
      getPaySearch(page_num,page_size){
        let _this = this;
        let time = this.time;
        let params = {
           'group_id':this.$store.state.loginInfo.group_id,
           'ic_no':_this.searchinfo.ic_no,
           'page_num':(page_num)?(page_num):1,
           'page_size':(page_size)?(page_size):(_this.searchinfo.page_size),
           'start_time':time?time[0]:'',
           'end_time':time?time[1]:''
        };
        getPaySearchList(params).then((res) => {
           if(res.code=="200000"){
               if(page_size=="-1"||page_size==-1){
                    _this.list = [];
                    res.data.map((item) => {
                        item.inout_flag = util.inout_flag(item.inout_flag);
                        item.busi_code = util.busi_code(item.busi_code);
                        return item;
                    });
                    _this.list = res.data;
                }else{
                  this.tableData = res.data;
                  this.searchinfo.page_num = (res.page_info.page_num)*1;
                  this.searchinfo.page_size = (res.page_info.page_size)*1;
                  this.searchinfo.total_records = (res.page_info.total_records)*1;
                }
           };
          //NProgress.done();
        });
      },
      excel_down(){
          let _this = this;
          _this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['操作时间', '卡号', '姓名', '缴退标识', '金额','设备号','业务类型','订单号']
            const filterVal = ['create_time', 'ic_no', 'user_name', 'inout_flag', 'amount','oper_code','busi_code','order_id']
            const list = _this.list
            const data = _this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '缴费列表',
              autoWidth: _this.autoWidth
            })
            _this.downloadLoading = false
          })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
  }
}
</script>
