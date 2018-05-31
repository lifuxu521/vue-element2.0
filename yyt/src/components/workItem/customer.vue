<template>
  <section>
    <div class="pageinfo-top">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <div class="info-top-lf"><i class="info-icon info-user" :style="{backgroundImage: 'url(' + icon + ')'}"></i>
            </div>
            <div class="info-top-rt">
              <span class="infotext-top">昨日发卡数量</span>
              <span class="infotext-center">{{query_day_open_amount}}</span>
              <span class="infotext-bottom">本月发卡数量：{{query_month_open_amount}}</span>
              <!--<span class="infotext-bottom">{{}}</span>-->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <div class="info-top-lf"><i class="info-icon info-yetcharge"
                                        :style="{backgroundImage: 'url(' + icon + ')'}"></i></div>
            <div class="info-top-rt">
              <span class="infotext-top">昨日收费金额</span>
              <span class="infotext-center">￥{{query_day_pay_amount}}</span>
              <span class="infotext-bottom">本月合计金额：￥{{query_month_pay_amount}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <div class="info-top-lf"><i class="info-icon info-yesbusiness"
                                        :style="{backgroundImage: 'url(' + icon + ')'}"></i></div>
            <div class="info-top-rt">
              <span class="infotext-top">昨日业务笔数</span>
              <span class="infotext-center">{{query_day_busi_amount}}笔</span>
              <span class="infotext-bottom">本月合计笔数：{{query_month_busi_amount}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="pageinfo-chart">
      <div v-show="tabtoggleNum == 0" :style="{height: 336+'px'}">
        <div style="text-align: left" class="page_nav">
          <el-tooltip class="item" effect="light" placement="bottom-start" :popper-class="toolTipClass">
            <!--<i class="iconfont icon-wenhao"></i>-->
            <!--<span>业务趋势图</span>-->
            <div slot="content">该数据为您显示：一段时间内该医院的发卡量、缴费金额、<br/>业务量、充值金额、昨日退卡数的统计数据。</div>
            <span style="cursor: pointer">业务趋势图<i class="iconfont icon-wenhao" style="color:#e6a23c;margin-left:5px;font-size:14px;"></i></span>
          </el-tooltip>
          &nbsp&nbsp&nbsp&nbsp
          <span class="demonstration">日期&nbsp:&nbsp</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            align="right"
            unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            format="yyyy-MM-dd" value-format="yyyyMMdd" @change="EchartsprevData" >
          </el-date-picker>
          <!-- &nbsp&nbsp&nbsp&nbsp
          <span>机构查询：</span>
          <el-select v-model="searchinfo.group_id" filterable placeholder="请选择所属机构" @change="EchartsprevData">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.group_name"
              :value="item.group_id">
            </el-option>
          </el-select> -->
        </div>
        <EchartsBox v-bind:EchartsList='EchartsList' v-bind:xAxis='xAxis'></EchartsBox>
      </div>
    </div>
    <!-- <div class="page-table-box">
      <div class="pagetable-top clearfix">
        <el-button type="success" class="fl"><i class="iconfont icon-xiazai"></i>下载</el-button>
        <div class="block fr">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="currentPage" :page-size="100" layout="total, prev, pager, next"
                         :total="1000">
          </el-pagination>
        </div>
      </div> -->
      <!-- 固定列表格 -->
      <!--<template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="date" align="center" label="卡号">
          </el-table-column>
          <el-table-column prop="name" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="province" align="center" label="证件类型">
          </el-table-column>
          <el-table-column prop="city" align="center" label="证件号">
          </el-table-column>
          <el-table-column prop="address" align="center" label="状态">
          </el-table-column>
          <el-table-column prop="zip" align="center" label="发卡日期">
          </el-table-column>
          <el-table-column prop="time" align="center" label="注销日期">
          </el-table-column>
         <el-table-column fixed="right"  label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>-->
    <!-- </div> -->
  </section>
</template>
<script>
  import icon from '@/assets/icon.png'
  import util from '../../../static/commonJs/util'
  import {requestDayData,requestMonthData,getGroupList} from '../../axios/axios';
  import EchartsBox from '@/components/workItem/EchartsBox';  //引入 ehcarts 图表
  export default {
    name: '',
    components: {
      EchartsBox
    },
    data () {
      return {
        pickerOptions2: {
          shortcuts: [
            {
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
        value1:[new Date((new Date().getTime() - 24 * 60 * 60 * 1000*7)),new Date()],
        icon: icon,
        currentPage: 5,
        tableData: [
         ],
        tabToggleData: [
          {title: '发卡量统计', display: true},
          {title: '缴费金额统计', display: false},
          {title: '业务量统计', display: false},
        ],
        tabtoggleNum: 0,
        query_day_open_amount: '',
        query_day_pay_amount: '',
        query_day_busi_amount: '',
        query_month_open_amount: '',
        query_month_pay_amount: '',
        query_month_busi_amount: '',
        EchartsList:[],
        xAxis:[],
        toolTipClass: 'page-login-toolTipClass',
        searchinfo: {
          group_id: ''
        },
        groupOptions:[],
      }
    },
    mounted(){
      this.getprevData();
      this.getprevMonth();
      this.EchartsprevData();
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      getprevData(){
        let curDate = new Date();
        let preDate = util.formatDate.format(new Date(curDate.getTime() - 24 * 60 * 60 * 1000), 'yyyyMMdd'); //前一天
        let params1 = {
          'group_id': this.$store.state.loginInfo.group_id,
          "busi_type": "open",
          "start_day": preDate,
          "end_day": preDate
        };
        requestDayData(params1).then(res => {
          this.query_day_open_amount =  util.oparseInt(res.data?res.data[0].amount:0) + '张'
        });
        let params2 = {
          'group_id': this.$store.state.loginInfo.group_id,
          "busi_type": "pay",
          "start_day": preDate,
          "end_day": preDate
        };
        requestDayData(params2).then(res => {
          this.query_day_pay_amount =  util.toDecimal(res.data?res.data[0].amount:0)
        });
        let params3 = {
          'group_id': this.$store.state.loginInfo.group_id,
          "busi_type": "busi",
          "start_day": preDate,
          "end_day": preDate
        };
        requestDayData(params3).then(res => {
          this.query_day_busi_amount =  util.oparseInt(res.data?res.data[0].amount:0);
        });
        // post  /card/rpt/close/query_day
      },
      getprevMonth(){
        let curDate = new Date();
        let preMonth = util.formatDate.format(new Date(curDate.getTime() - 24 * 60 * 60 * 1000), 'yyyyMM');
        let thisDate = curDate.getDate();
        if (thisDate == 1) {

        } else {
          let params1 = {
            'group_id': this.$store.state.loginInfo.group_id,
            "busi_type": "open",
            "start_month": preMonth,
            "end_month": preMonth
          };
          requestMonthData(params1).then(res => {
            this.query_month_open_amount = util.oparseInt(res.data?res.data[0].amount:0);
          });
          let params2 = {
            'group_id': this.$store.state.loginInfo.group_id,
            "busi_type": "pay",
            "start_month": preMonth,
            "end_month": preMonth
          };
          requestMonthData(params2).then(res => {
            this.query_month_pay_amount = util.toDecimal(res.data?res.data[0].amount:0);
          });
          let params3 = {
            'group_id': this.$store.state.loginInfo.group_id,
            "busi_type": "busi",
            "start_month": preMonth,
            "end_month": preMonth
          };
          requestMonthData(params3).then(res => {
            this.query_month_busi_amount = util.oparseInt(res.data?res.data[0].amount:0);
          });
        }

      },
      EchartsprevData(val){
        this.EchartsList = [];
        this.xAxis = [];
        let start_day = "";
        let end_day = "";
        if(!val){
           start_day = util.formatDate.format(this.value1[0], 'yyyyMMdd');
           end_day =  util.formatDate.format(this.value1[1], 'yyyyMMdd');
        }else{
          start_day = this.value1[0];
          end_day = this.value1[1];
        }
        let reg = /-| |:/g;
        let group_id =  this.$store.state.loginInfo.group_id;
        let params1 = {
          'group_id':group_id ,
          "busi_type": "open",
          "start_day": start_day,
          "end_day": end_day
        };
        requestDayData(params1).then(res => {
          let obj = {};
          let data = [];
          obj.name = '发卡量';
          obj.type = 'line';
          if(res.data){
              res.data.map((a) => {
                 data.push(a.amount);
              });
              this.EchartsList.push(obj);
          }else{
          };
          obj.data = data;
        });
        let params2 = {
          'group_id': group_id,
          "busi_type": "busi",
          "start_day": start_day,
          "end_day": end_day
        };
        requestDayData(params2).then(res => {
          let obj_busi = {};
          let data = [];
          obj_busi.name = '业务量';
          obj_busi.type = 'line';
          if(res.data){
              res.data.map((a) => {
                  data.push(a.amount);
                  this.xAxis.push(a.rpt_day);
              });
              this.EchartsList.push(obj_busi);
          }else{
          };
          obj_busi.data = data;
        });
        let params3 = {
          'group_id': group_id,
          "busi_type": "pay",
          "start_day": start_day,
          "end_day": end_day
        };
        requestDayData(params3).then(res => {
          let obj_pay = {};
          let data = [];
          obj_pay.name = '收费金额';
          obj_pay.type = 'line';
          obj_pay.formatter ='{data}￥';
          if(res.data){
              res.data.map((a) => {
                data.push(a.amount);
              });
              this.EchartsList.push(obj_pay);
          }else{
          };
          obj_pay.data = data;
        });
        
      },
      tabToggleClick(key){
        this.tabToggleData.map((item, index) => {
          item.display = false;
          if (key == index) {
            this.tabtoggleNum = key;
            item.display = true;
          }
        })
      },
      getGroupList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          'page_size': -1
        };
        getGroupList(params).then((res) => {
          if (res.code == "200000") {
            this.groupOptions = res.data;
            this.searchinfo.group_id = res.data[0].group_id;
          };
        });
      },
    }
  }
</script>
<style>
  .pageinfo-chart {
    margin: 0 19px;
    background: #ffffff;
    height: 438px;
    border: 1px solid #E2E2E2;
  }

  .page_nav {
    margin-top: 10px;
    border-bottom: 1px solid rgba(226, 226, 226, 1);
    height: 50px;
  }
  .page-login-toolTipClass{
    background: #FEF3EB !important;
    color: #A48268 !important;
    border:1px solid #FCCCA7 !important;
  }
  .el-tooltip__popper[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #FEF3EB !important;
    border-top-width: 0 !important;
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow::after{
    border-top-color: #FEF3EB !important;
    border-bottom-width: 0 !important;
  }
</style>
