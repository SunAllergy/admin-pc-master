<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>添加用户邀请码</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="创建人" class="width1" v-model="realName"></el-input>

        <el-select v-model="sch_status" clearable
                   class="width1" placeholde="选择状态">
          <el-option v-for="item in options" :label="item.label" :value="item.value"
                     :key="item.value"></el-option>
        </el-select>

        <el-date-picker v-model="dateStart" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTab">添加</el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="code" label="邀请码"></el-table-column>
        <el-table-column prop="realName" label="创建人"></el-table-column>
        <el-table-column prop="createAt" label="创建时间"></el-table-column>
        <el-table-column prop="thisName" label="使用人名称"></el-table-column>
        <el-table-column prop="status" label="账户状态">
          <template slot-scope="scope" label="使用状态">
            <el-tag :type="scope.row.status | tagClass">{{
              scope.row.status | statusText
              }}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              :current-page="currentPage"
              :total="total"
              class="fyDiv"
              @size-change="handleSize"
              @current-change="handlePage">
      </el-pagination>
    </el-card>

    <!--添加框-->
    <el-dialog title="添加用户邀请码" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaForm" :model="formData" :rules="rules" label-width="140px">

        <el-form-item label="请选输入成数量" prop="status" >
          <el-input
                  v-model="codeNumber"
                  type="text"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
          ></el-input>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  // import { getPageTab2 } from '@/api/table'
  // eslint-disable-next-line no-unused-vars

  import {getLabelList} from "@/service/code";
  import {getLikeCodeList} from "@/service/code";

  import {addCodeList} from "@/service/code";

  import axios from "axios";

  export default {
    data() {
      return {

        /*图片*/
        imageUrl: "",
        /*url: process.env.VUE_APP_URL + "/sys/oss/upload",*/
        url: "D:\\teamer\\file",

        /*手机号*/
        phone: "",

        /*真实姓名*/
        realName: "",

        /*性别*/
        sex: "",

        /*学校名称*/
        schoolName: "",

        /*Code数量*/
        codeNumber: "",

        /*账户状态*/
        /*status: "",*/

        /*当前时间*/
        timeNew: new Date(),
        tableData: [],
        allList: [],
        schArr: [],
        sch_order: "",
        sch_status: null,
        sexM: null,
        /*sch_date: null,*/
        dateStart: null,
        dateEnd: null,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40],
        diaIsShow: false,
        formData: {},
        editType: "",
        options: [
          {label: "未使用", value: 0},
          {label: "已使用", value: 1},
        ],

        numberCode: [
          {label: 5, value: 5},
          {label: 10, value: 10},
          {label: 20, value: 20},
          {label: 30, value: 30},
        ],

        SexMap: [
          {label: "男", value: "男"},
          {label: "女", value: "女"},
        ],

        rowIndex: 0,
        rules: {
          // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
          time: [
            {
              // type: 'datetime',
              required: true,
              message: "请输入时间",
              trigger: "change"
            }
          ],
          title: [{required: true, message: "请输入文章标题", trigger: "blur"}],
          content: [{required: true, message: "请输入文章内容", trigger: "blur"}],
          /*
           name: [{required: true, message: "请输入姓名", trigger: "blur"}],
           status: [
               {required: true, message: "请选择订单状态", trigger: "change"}
           ]*/
        },

        /*时间选择*/
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
      };
    },
    props: ["imageValue"],
    created() {
      /*this._getPageTab2();*/
      this.ArticleData();
      this.imageUrl = this.imageValue;
    },
    filters: {
      statusText(val) {
        if (val === undefined) return;
        if (val === "0") {
          return "未使用";
        } else if (val === "1") {
          return "已使用";
        }
      },




      tagClass(val) {
        if (val === undefined) return;
        if (val === 0) {
          return "success";
        } else if (val === 1) {
          return "info";
        }
      }
    },
    methods: {

      /*获取文章数据*/
      async ArticleData() {
        console.log("首次查询");
        let {code, data, msg} = await getLabelList();

        console.log(data);
        console.log(code);
        this.tableData = data;
      },



      handleSize(val) {
        this.pageSize = val;
        this.getPageData();
      },
      handlePage(val) {
        this.currentPage = val;
        this.getPageData();
      },
      _getPageTab2() {
        // getPageTab2()
        //   .then(res => {
        //     this.allList = res.data.tableList
        //     this.schArr = this.allList
        //     this.getPageData()
        //     this.total = res.data.total
        //   })
        //   .catch(error => {
        //     this.$message.error(error.message)
        //   })
      },
      getPageData() {
        let start = (this.currentPage - 1) * this.pageSize;
        let end = start + this.pageSize;
        this.tableData = this.schArr.slice(start, end);
      },
      // 查找
      searchTab: async function () {
        let arrList = [];


        const map = new Map();
        map.set("作者", this.author)
        map.set("状态", this.sch_status)
        map.set("开始时间", this.dateStart)

        console.log("###############")
        console.log(this.sch_status)
        console.log(this.author)
        console.log(this.dateStart)

        /*this.formData = {"realName": this.realName, "sex": this.sex, "schoolName": this.schoolName, "grade": this.grade, "sch_status": this.sch_status, "dateStart": this.dateStart};*/
        this.formData = {"realName": this.realName, "sch_status": this.sch_status, "dateStart": this.dateStart};
        // eslint-disable-next-line no-undef

        let {code, data, msg} = await getLikeCodeList(this.formData);
        console.log("@@@@@@@@@@@@@@@@@");
        console.log(code);
        console.log(data);
        this.tableData = data;
        console.log("@@@@@@@@@@@@@@@@@")

        /*let {code, data, msg} = LikeArticlet(this.formData);
        console.log(data);
        this.tableData = data;*/
        /* for (let item of this.allList) {

             if (
                 this.sch_order.trim() === "" &&
                 this.sch_status === null &&
                 this.sch_date === null
             ) {
                 arrList = this.allList;
                 break;
             } else if (
                 item.order.startsWith(this.sch_order) &&
                 (this.sch_status !== null ? item.status === this.sch_status : true) &&
                 (this.sch_date !== null ? item.time.startsWith(this.sch_date) : true)
             ) {
                 let obj = Object.assign({}, item);

                 arrList.push(obj);
             }
         }
         this.schArr = arrList;
         this.total = arrList.length;
         this.currentPage = 1;
         this.pageSize = 10;

         this.getPageData();*/
      },

      // add
      addTab() {

        this.formData = {};

        console.log("#############")
        console.log(this.formData);
        console.log("#############")
        this.diaIsShow = true;
        this.formData.order = (Math.random() * 10e18).toString();
        this.formData.id = this.allList.length + 1;
        this.editType = "add";
        this.$nextTick(() => {
          this.$refs.diaForm.clearValidate();
        });
        /**/

      },



      // 编辑
      editTable(index, row) {
        this.formData = Object.assign({}, row)

        this.editType = "update";
        this.diaIsShow = true;
        this.$nextTick(() => {
          this.$refs.diaForm.clearValidate();
        });
        this.rowIndex = index;
      },
      changeTab(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")
            console.log(this.codeNumber)
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")
            addCodeList(this.codeNumber);
            window.location.reload();
          } else {
            return;
          }
        });
      },


      /*图片上传*/
      submitUploadImgUrl(uploader) {
        //  图片不做处理的方式
        let form = new FormData();
        form.append("file", uploader.file);
        axios
                .post(this.url, form, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then(res => {
                  this.imageUrl = res.data.data.src;
                  this.$emit("handleSuccess", this.imageUrl);
                  //上传成功
                  //处理自己的逻辑
                  this.$message({
                    type: "success",
                    message: "上传成功！"
                  });
                })
                .catch(() => {
                  //上传失败
                  //处理自己的逻辑
                  this.$message({
                    type: "error",
                    message: "上传错误！"
                  });
                });
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpg";
        const isJPEG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error("上传头像图片只能是 JPG、JPEG、PNG 格式!");
        }
        if (!isLt5M) {
          this.$message.error("上传头像图片大小不能超过 5MB!");
        }
        return (isJPG || isJPEG || isPNG) && isLt5M;
      },
      handleAvatarError() {
        this.$message({
          type: "error",
          message: "上传错误！"
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .fyDiv {
    float: right;
    margin-top: 30px;
    padding-bottom: 20px;
  }

  .anoCard .el-table .el-button {
    padding: 8px 18px;
    font-size: 12px;
  }

  .searchDiv {
    margin-bottom: 20px;

    .el-button {
      padding: 11px 20px;
    }
  }

  .width1 {
    width: 180px;
    margin-right: 10px;
  }

  .diaForm {
    .el-input {
      width: 350px;
    }
  }

  /*图片上传*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
<style lang="scss">
  .anoCard {
    .el-card__body:after {
      content: "";
      clear: both;
      width: 0;
      height: 0;
      visibility: hidden;
      display: block;
    }
  }

  .diaForm .el-form-item__label {
    padding-right: 20px;
  }

  .searchDiv [class^="el-icon"] {
    color: #fff;
  }

  .readItm {
    color: indianred
  }
</style>
