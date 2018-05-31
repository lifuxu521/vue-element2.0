<template>
   <section>
     <div class="page-funcarea clearfix">
      <div class="block fl">
           <span for="" class="fl label-page">日期：</span><el-date-picker   v-model="time"  type="daterange"  format="yyyy-MM-dd" value-format="yyyyMMdd"  :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  align="right"></el-date-picker>
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
      <div class="pageFuncarea-ipt fl clearfix">
              <span for="" class="fl">卡号：</span><el-input  placeholder="请输入卡号"  v-model="searchinfo.ic_no" class="fl"></el-input>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
          <el-button type="success" @click="getRefundsList()">查询</el-button>
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
              <el-table-column fixed prop="group_name"  align="center" label="机构名称">
              </el-table-column>
              <el-table-column  prop="create_time"  align="center" label="操作时间" show-overflow-tooltip >
              </el-table-column>
              <el-table-column prop="ic_no" align="center" label="卡号"  >
              </el-table-column>
              <el-table-column prop="user_name" align="center" label="姓名"  >
              </el-table-column>
              <el-table-column  prop="inout_flag" align="center" label="充退标志" :formatter="inout_flag" >
              </el-table-column>
              <el-table-column prop="amount" align="right" label="金额" :formatter="toDecimal">
              </el-table-column>
              <el-table-column prop="chnl_type" align="center" label="渠道类型" :formatter="chnl_type">
              </el-table-column>
              <el-table-column prop="oper_code" align="center" label="设备号/操作员" >
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
import {getRefundsList,getGroupList} from '../../axios/axios';
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
         group_id:''
       },
      groupOptions: [],
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
    this.getGroupList();
    this. getRefundsList(1,-1);
    this. getRefundsList();
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
     chnl_type(row,column,cellValue){
         let str = util.chnl_type(cellValue);
         return str;
     },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
         let _this = this;
         let page_num = val*1;
         _this.getRefundsList(page_num,_this.searchinfo.page_size);
      },
      resSetSearch(){
        this.time = "";
        this.searchinfo.ic_no = "";
        this.searchinfo.group_id = "";
     },
     getGroupList(page_num,page_size){
        let _this = this;
        let time = this.time;
         let params ={
          'page_size':-1
        };
        console.log(params)
        getGroupList(params).then((res) => {
           console.log(res)
           if(res.code=="200000"){
                this.groupOptions = res.data;
           };
        });
      },
      getRefundsList(page_num,page_size){
          let _this = this;
          let time = this.time;
          let group_id = (_this.searchinfo.group_id)?parseInt(_this.searchinfo.group_id):null;
          let params = {
            'group_id':group_id,
            'ic_no':_this.searchinfo.ic_no,
            'page_num':page_num?page_num:1,
            'page_size':(page_size)?(page_size):(_this.searchinfo.page_size),
             'start_time':time?time[0]:'',
             'end_time':time?time[1]:''
          };
        getRefundsList(params).then((res) => {
           if(res.code=="200000"){
                 if(page_size=="-1"||page_size==-1){
                    _this.list = [];
                    res.data.map((item) => {
                        item.inout_flag = util.inout_flag(item.inout_flag);
                        item.chnl_type = util.chnl_type(item.chnl_type);
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
            const tHeader = ['机构名称','操作时间', '卡号', '姓名', '充退标志', '金额','渠道类型','设备号/操作员']
            const filterVal = ['group_name','create_time', 'ic_no', 'user_name', 'inout_flag', 'amount','chnl_type','oper_code']
            const list = _this.list
            const data = _this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '充值退款',
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
