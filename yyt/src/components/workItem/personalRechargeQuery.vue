<template>
  <section>
    <div class="page-table-box" style="border: none;">
      <div class="pagetable-top clearfix">
        <div class="block fl">
          <span class="demonstration">缴费日期&nbsp:&nbsp</span>
          <el-date-picker v-model="time" type="daterange" :picker-options="pickerOptions" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd"
                          value-format="yyyyMMdd" @change="getRefundsList()"></el-date-picker>
        </div>
        <div class="block fr">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="searchinfo.page_num" :page-size="searchinfo.page_size"
                         layout="total, prev, pager, next" :total="searchinfo.total_records">
          </el-pagination>
        </div>
      </div>
      <!-- 固定列表格 -->
      <template>
        <el-table :data="tableData" style="width: 100%;font-size: 12px;background: #f5f5f5" stripe>
          <el-table-column prop="create_time" align="center" label="操作时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ic_no" align="center" label="卡号">
          </el-table-column>
          <el-table-column prop="user_name" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="inout_flag" align="center" label="充退标识" :formatter="inout_flag">
          </el-table-column>
          <el-table-column prop="amount" align="center" label="金额">
          </el-table-column>
          <el-table-column prop="chnl_type" align="center" label="渠道类型">
          </el-table-column>
          <el-table-column prop="oper_code" align="center" label="设备号/操作员">
          </el-table-column>
        </el-table>
      </template>
    </div>
  </section>
</template>
<script>
  import {getBusiRefundsList, getGroupList} from '../../axios/axios';
  import util from '../../../static/commonJs/util';
  export default {
    name: '',
    data () {
      return {
        searchinfo: {
          page_num: 1,
          page_size: 8,
          total_records: 0,
          ic_no: '',
          group_id: ''
        },
        groupOptions: [],
        tableData: [],
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
        time: ""
      }
    },
    mounted(){
      // this.getGroupList();
      this.getBusiRefundsList();
//      console.log(this.$store.state.loginInfo)
    },
    methods: {
      inout_flag(row, column, cellValue){
        let str = util.inout_flag(cellValue);
        return str;
      },
      busi_code(row, column, cellValue){
        let str = util.busi_code(cellValue);
        return str;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        let _this = this;
        let page_num = val * 1;
        _this.getBusiRefundsList(page_num, _this.searchinfo.page_size);
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
          };
        });
      },
      getRefundsList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          // 'group_id':this.$store.state.loginInfo.group_id,
          'ic_no': this.$store.state.loginInfo.ic_no,
          'page_num': page_num ? page_num : 1,
          'page_size': (page_size) ? (page_size) : (_this.searchinfo.page_size),
          'start_time': time[0] ? time[0] : '',
          'end_time': time[1] ? time[1] : '',
        };
//        console.log(params);
        getBusiRefundsList(params).then((res) => {
          console.log(res)
          if (res.code == "200000") {
            this.tableData = res.data;
            this.searchinfo.page_num = (res.page_info.page_num) * 1;
            this.searchinfo.page_size = (res.page_info.page_size) * 1;
            this.searchinfo.total_records = (res.page_info.total_records) * 1;
            res.data.map((item, i) => {
              if (item.chnl_type == 'counter') {
                item.chnl_type = '窗口'
              } else if (item.chnl_type == 'self') {
                item.chnl_type = '自助机'
              }
              let result = (item.amount.toString()).indexOf(".");
              if (result == -1) {
                this.tableData[i].amount = this.tableData[i].amount + '.00'
              } else {
                this.tableData.amount = parseFloat(Math.round(this.tableData.amount * 100) / 100)
              }
            })
          }else{
            this.tableData = [];
            this.searchinfo.page_num = '' * 1;
            this.searchinfo.page_size = '' * 1;
            this.searchinfo.total_records = '' * 1;
          }
        });
      },
      getBusiRefundsList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          // 'group_id':this.$store.state.loginInfo.group_id,
          'ic_no': this.$store.state.loginInfo.ic_no,
          'page_num': page_num ? page_num : 1,
          'page_size': (page_size) ? (page_size) : (_this.searchinfo.page_size),
          'start_time': time[0] ? time[0] : '',
          'end_time': time[1] ? time[1] : '',
        };
//        console.log(params);
        getBusiRefundsList(params).then((res) => {
          console.log(res)
          if (res.code == "200000") {
            this.tableData = res.data;
            this.searchinfo.page_num = (res.page_info.page_num) * 1;
            this.searchinfo.page_size = (res.page_info.page_size) * 1;
            this.searchinfo.total_records = (res.page_info.total_records) * 1;
            res.data.map((item, i) => {
              if (item.chnl_type == 'counter') {
                item.chnl_type = '窗口'
              } else if (item.chnl_type == 'self') {
                item.chnl_type = '自助机'
              }
              let result = (item.amount.toString()).indexOf(".");
              if (result == -1) {
                this.tableData[i].amount = this.tableData[i].amount + '.00'
              } else {
                this.tableData.amount = parseFloat(Math.round(this.tableData.amount * 100) / 100)
              }
            })
          }
          ;
          //NProgress.done();
        });
      }
    }
  }
</script>
<style scoped>
  .demonstration {
    font-size: 14px;
  }

  .page-table-box {
    padding: 20px 5px;
  }
</style>
