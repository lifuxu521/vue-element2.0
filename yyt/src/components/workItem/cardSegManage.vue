<template>
  <section>
    <div class="page-funcarea clearfix">
      <div class="pageFuncarea-ipt fl clearfix">
        <span for="" class="fl">机构查询：</span>
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
        <span for="" class="fl">卡段查询：</span>
        <el-input placeholder="请输入卡段" v-model="searchinfo.seg_no" class="fl"></el-input>
      </div>
      <div class="pageFuncarea-btn clearfix fl">
        <el-button type="success" @click="getcardsegList()">查询</el-button>
        <el-button @click="resSetSearch()">重置</el-button>
      </div>
    </div>
    <div class="page-table-box">
      <div class="pagetable-top clearfix">
        <el-button type="success" class="fl" @click="addCardSeg()"><i class="iconfont icon-tianjiashenfenzheng"></i>新增</el-button>
        <div class="block fr">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="searchinfo.page_num" :page-size="searchinfo.page_size"
                         layout="total, prev, pager, next" :total="searchinfo.total_records">
          </el-pagination>
        </div>
      </div>
      <!-- 固定列表格 -->
      <template>
        <el-table :data="tableData" style="width:100%">
          <el-table-column fixed prop="group_name" align="center" label="机构名称">
            <!-- width="15%" -->
          </el-table-column>
          <el-table-column prop="seg_no" align="center" label="卡段">
            <!-- width="14%" -->
          </el-table-column>
          <el-table-column prop="total_amt" align="center" label="总数量" :formatter="oparseInt">
            <!-- width="13%" -->
          </el-table-column>
          <el-table-column prop="used_amt" align="center" label="已发数量" :formatter="oparseInt">
            <!-- width="20%"-->
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 新增卡段弹出层 -->
    <el-dialog title="新增卡段" :visible.sync="dialogFormVisible" class="addcardseg-box" width="25%">
      <el-form :model="form">
        <el-form-item label="医院机构 ：" :label-width="formLabelWidth">
          <el-select v-model="form.group_id" placeholder="请选择">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.group_name"
              :value="item.group_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡号段 ： " :label-width="formLabelWidth">
          <el-input v-model="form.seg_no" auto-complete="off" placeholder="请输入卡前N位号段"></el-input>
        </el-form-item>
        <span class="dialog-info-text">注： 号段统一采用百号段进行管理，一个号段包含100个号</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCardInfo()">保 存</el-button>
        <el-button @click="closeCardSeg()">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
  import {getcardsegList, getGroupList, createCardseg, cancelCard} from '../../axios/axios';
  import util from '../../../static/commonJs/util';
  export default {
    name: '',
    data () {
      return {
        searchinfo: {
          page_num: 1,
          page_size: 8,
          total_records: 0,
          seg_no: '',
          start_time: '',
          end_time: '',
          group_id: ''
        },
        dialogFormVisible: false,
        form: {
          seg_no: '',
          group_id: ''
        },
        formLabelWidth: '120px',
        groupOptions: [],
        tableData: [],
        time: "",
        cardNum: ""
      }
    },
    mounted(){
      this.getGroupList();
      this.getcardsegList();
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);                                                                                    
      },
      handleCurrentChange(val) {
        let _this = this;
        let page_num = val * 1;
        _this.getcardsegList(page_num, _this.searchinfo.page_size);
      },
      oparseInt(row,column,cellValue){
         let str = util.oparseInt(cellValue);
         return str;
      },
      resSetSearch(){
        this.searchinfo.seg_no = "";
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
      getcardsegList(page_num, page_size){
        let _this = this;
        let time = this.time;
        let params = {
          'seg_no': _this.searchinfo.seg_no,
          'group_id': (_this.searchinfo.group_id) * 1,
          'page_num': (page_num) ? (page_num) * 1 : 1,
          'page_size': (page_size) ? (page_size) * 1 : (_this.searchinfo.page_size) * 1
        };
         //console.log(params)
        getcardsegList(params).then((res) => {
          console.log(res)
          if (res.code == "200000") {
            this.tableData = res.data;
            this.searchinfo.page_num = (res.page_info.page_num) * 1;
            this.searchinfo.page_size = (res.page_info.page_size) * 1;
            this.searchinfo.total_records = (res.page_info.total_records) * 1;
          }
          ;
          //NProgress.done();
        });
      },
      //新增卡段
      addCardSeg(){
        this.dialogFormVisible = true
      },
      //关闭新增
      closeCardSeg(){
        this.dialogFormVisible = false;
        this.form.seg_no = "";
        this.form.group_id = "";
      },
      saveCardInfo(){
        let _this = this;
        let params = {
          'seg_no': _this.form.seg_no,
          'group_id': _this.form.group_id
        };
        createCardseg(params).then((res) => {
          let msg = res.msg;
          if (res.code == "200000") {
            _this.form.seg_no = "";
            _this.form.group_id = "";
            _this.dialogFormVisible = false;
            _this.getcardsegList();
            _this.$message({
              message: msg,
              type: 'success',
              center: true
            });
          } else {
            _this.$message({
              message: msg,
              type: 'error',
              center: true
            });
          }
          ;
          //NProgress.done();
        });
      },
      //删除单条数据
      deleteRow(index, rows) {
        let _this = this;
        this.$confirm('确定要删除吗?', '提示', {
          type: 'warning',
        }).then(() => {
          console.log(rows[index]);
          let params = {
            'seg_no': rows[index].seg_no,
            'group_id': rows[index].group_id
          };
          cancelCard(params).then((res) => {
            let msg = res.msg;
            if (res.code == "200000") {
              _this.getcardsegList();
              _this.$message({
                message: msg,
                type: 'success',
                center: true
              });
            } else {
              _this.$message({
                message: msg,
                type: 'warning',
                center: true
              });
            }
            ;
            //NProgress.done();
          });
        }).catch(() => {

        });
      }
    }
  }
</script>
<style scoped>
  .el-table .el-button--text {
    color: #19AC4D;
  }
</style>
