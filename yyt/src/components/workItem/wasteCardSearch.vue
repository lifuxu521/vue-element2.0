<template>
   <section>
     <div class="page-funcarea clearfix">
      <div class="block fl">
            <span for="" class="fl label-page">日期：</span><el-date-picker   v-model="time"  type="daterange"  :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  align="right"  format="yyyy-MM-dd" value-format="yyyyMMdd"></el-date-picker>
      </div>
       <div class="pageFuncarea-ipt fl clearfix">
        <span for="" class="fl">作废类型：</span>
        <el-select v-model="searchinfo.state" filterable placeholder="请选择类型" >
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.state_name"
            :value="item.state_id">
          </el-option>
        </el-select>
      </div>
      <div class="pageFuncarea-ipt fl clearfix">
              <span for="" class="fl">卡号：</span><el-input  placeholder="请输入卡号"  v-model="searchinfo.ic_no" class="fl"></el-input>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
          <el-button type="success" @click="getwatsteCardList()" >查询</el-button>
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
              <el-table-column fixed prop="open_group_name"  align="center" label="机构名称" >
              </el-table-column>
              <el-table-column prop="ic_no" align="center" label="卡号"  >
              </el-table-column>
              <el-table-column prop="user_name" align="center" label="姓名" >
              </el-table-column>
              <el-table-column  prop="cert_type" align="center" label="证件类型" :formatter="cert_type">
              </el-table-column>
              <el-table-column prop="cert_num" align="center" label="证件号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="state" align="center" label="作废类型" :formatter="state">
              </el-table-column>
               <el-table-column prop="open_time" align="center" label="发卡日期" :formatter="formatTime">
              </el-table-column>
              <el-table-column prop="update_time" align="center" label="作废日期" :formatter="formatTime">
              </el-table-column>
            </el-table>
          </template>
      </div>
   </section>
</template>
<script>
import {getwatsteCardList} from '../../axios/axios';
import util from '../../../static/commonJs/util';
import index from '../../router';
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
         end_time:'',
         state:''
       },
       stateOptions:[
          {state_name:'挂失',state_id:'3'},
          {state_name:'注销',state_id:'0'},
          {state_name:'废卡',state_id:'9'}
       ],
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
      this.getwatsteCardList(1,-1);
      this.getwatsteCardList();
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
  methods:{
     formatTime(row,column,cellValue){
        let time = util.strFilter(cellValue,10)
        return time;
     },
    cert_type(row,column,cellValue){
         let str = util.cert_type(cellValue);
         return str;
     },
     state(row,column,cellValue){
         let str = util.state(cellValue);
         return str;
     },
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
         let _this = this;
         let page_num = val * 1;
        _this.getwatsteCardList(page_num, _this.searchinfo.page_size);
      },
     resSetSearch(){
        this.searchinfo.ic_no = "";
        this.searchinfo.state = null;
        this.time = "";
     },
    getwatsteCardList(page_num,page_size){
          let _this = this;
          let time = this.time;
          let params = {
            // 'group_id':_this.searchinfo.group_id,
            // 'group_id':_this.$store.state.loginInfo.group_id
            'state':_this.searchinfo.state,
            'ic_no':_this.searchinfo.ic_no,
            'page_num':(page_num)?(page_num):1,
            'page_size':(page_size)?(page_size):(_this.searchinfo.page_size),
            'start_time':time?time[0]:'',
            'end_time':time?time[1]:''
          };
          console.log(params);
          getwatsteCardList(params).then((res) => {
            if(res.code=="200000"){
                if(page_size=="-1"||page_size==-1){
                    _this.list = [];
                    res.data.map((item) => {
                        item.cert_type = util.cert_type(item.cert_type);
                        item.state = util.state(item.state);
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
            const tHeader = ['机构名称', '卡号', '姓名', '证件类型', '证件号','作废类型','发卡日期','作废日期']
            const filterVal = ['open_group_name', 'ic_no', 'user_name', 'cert_type', 'cert_num','state','open_time','update_time']
            const list = _this.list
            const data = _this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '废卡列表',
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
