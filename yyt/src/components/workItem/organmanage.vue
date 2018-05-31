// <input name=""  v-model="user" id="" cols="30" rows="10"   @focus="setUser()"/>
<template>
    <section>
     <div class="page-funcarea clearfix">
      <div class="pageFuncarea-ipt fl clearfix">
              <span for="" class="fl">机构查询：</span><el-input  placeholder="机构名称"  v-model="searchinfo.text" class="fl" style="width:200px"></el-input>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
          <el-button type="success" @click="getGroupList()">查询</el-button>
      </div>
     </div>
      <div class="page-table-box">
          <div class="pagetable-top clearfix">
                <div class="block fr">
                <el-pagination  @size-change="handleSizeChange"   @current-change="handleCurrentChange" :current-page.sync="searchinfo.page_num" :page-size="searchinfo.page_size" layout="total, prev, pager, next" :total="searchinfo.total_records">
                </el-pagination>
              </div>
          </div>
          <!-- 固定列表格 -->
          <template>
            <el-table  :data="tableData"    style="width: 100%">
              <el-table-column fixed prop="group_code"  align="center" label="机构代码">
              </el-table-column>
              <el-table-column prop="group_name" align="center" label="机构名称"  >
              </el-table-column>
              <el-table-column prop="contact_tel" align="center" label="联系电话"  >
              </el-table-column>
              <el-table-column  prop="create_time" align="center" label="创建时间" >
              </el-table-column>
              <el-table-column fixed="right"  label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" class="tablebtn" @click="groupChange(scope.$index, tableData)">编辑</el-button>
                </template>
              </el-table-column> 
            </el-table>
          </template>
      </div> 
    </section>
</template>
<script>
import {getGroupList} from '../../axios/axios';
export default {
  name: '',
  data () {
    return {
        searchinfo:{
         text:'',
         page_num:1,
         page_size:8,
         total_records:0,
         ic_no:'',
         start_time:'',
         end_time:''
       },
       tableData: [
        ],
        cardNum:""
    }
  },
  mounted(){
    this.getGroupList();
  },
  methods:{
      getGroupList(page_num,page_size){
        let _this = this;
        let time = this.time;
        let params ={
           'group_name':_this.searchinfo.text,
           'page_num':(page_num)?(page_num):1,
           'page_size':(page_size)?(page_size):(_this.searchinfo.page_size)
        };
        console.log(params)
        getGroupList(params).then((res) => {
           console.log(res)
           if(res.code=="200000"){
                this.tableData = res.data;
                this.searchinfo.page_num = (res.page_info.page_num)*1;
                this.searchinfo.page_size = (res.page_info.page_size)*1;
                this.searchinfo.total_records = (res.page_info.total_records)*1;
           };
          //NProgress.done();
        });
      },
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        // groupBasicInfo
      },
      handleCurrentChange(val) {
         let _this = this;
         let page_num = val*1;
        _this.getGroupList(page_num,_this.searchinfo.page_size);
      },
      groupChange(index, rows) {
        let _this = this;
        let data1 = rows[index].group_id;
        let data2 = rows[index].group_type;
        let odata = {};
        odata.group_id = data1;
        odata.group_type = data2;
        _this.$store.commit('SENDGROUPID', odata);
        _this.$router.push({path: '/groupBasicInfo'});
      }
  }
}
</script>
<style scoped>
.el-table .el-button--text{
    color: #19AC4D;
}
</style>

