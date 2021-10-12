<template>

  <!--比赛管理-->
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>App首页轮播图管理</span>
      </div>
      <div class="searchDiv">
        <el-input type="text" placeholder="轮播主题名称" class="width1" v-model="carouselContent"></el-input>

        <el-select v-model="carouselType" clearable
                   class="width1" placeholde="选择状态">
          <el-option v-for="item in options" :label="item.label" :value="item.value"
                     :key="item.value"></el-option>
        </el-select>

        <!--<el-date-picker class="width1" v-model="sch_date" type="date" placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>-->

        <!--<el-date-picker  class="width1" v-model="dateStart" type="datetime" placeholder="选择开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>-->

        <el-date-picker
                v-model="dateStart"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
        </el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="searchTab()">搜索</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTab">添加</el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="carouselTheme" label="图片主题"></el-table-column>
        <el-table-column prop="carouselContent" label="图片内容"></el-table-column>
        <el-table-column prop="founder" label="创建人名称"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" ></el-table-column>
        <el-table-column prop="modifier" label="修改人名称"></el-table-column>
        <el-table-column prop="carouselType" label="使用状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.carouselType | tagClass">{{
              scope.row.carouselType | statusText
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editTable(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog title="APP轮播图信息" :visible.sync="diaIsShows" class="diaForm">
      <el-form ref="diaForm" :model="formDatas" :rules="rules" label-width="140px">


        <el-form-item  label="图片主题" prop="carouselTheme">
          <el-input type="text" placeholder="请输入图片主题" v-model="formDatas.carouselTheme"></el-input>
        </el-form-item>

        <el-form-item label="图片内容" prop="carouselContent">
          <el-input type="textarea" :rows="2" placeholder="请输入图片内容" v-model="formDatas.carouselContent"></el-input>
        </el-form-item>

        <!--<el-form-item label="请插入图片" prop="name">
          <el-input type="text" placeholder="图片" v-model="formDatas.name"></el-input>
        </el-form-item>-->
        <el-form-item label="插入图片" prop="phoneCarousel">
          <el-upload
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-error="handleAvatarError"
                  :http-request="submitUploadImgUrl">
            <!--<img v-if="formDatas.gamePhoto" :src="formDatas.gamePhoto" width="300" height="120" class="avatar"/>-->
            <img v-if="formDatas.phoneCarousel" :src="formDatas.phoneCarousel" width="300" height="120" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="App轮播状态" prop="carouselType">
          <el-select v-model="formDatas.carouselType" placeholde="请选择类型">
            <el-option v-for="item in options" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)">确认</el-button>
          <el-button @click="diaIsShows = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  // import { getPageTab2 } from '@/api/table'
  // eslint-disable-next-line no-unused-vars
  import { getCarouselAll } from "@/service/carousel";
  import {UpdateArticlet} from "@/service/carousel";
  import {AddArticlet} from "@/service/carousel";
  import {LikeArticlet} from "@/service/carousel";

  /*图片上传*/

  import axios from "axios";

  export default {
    data() {
      return {

        /*图片*/
        imageUrl: "",
        /*url: process.env.VUE_APP_URL + "/sys/oss/upload",*/
        //url: process.env.VUE_APP_URL +"D:\\img",
        /*轮播名称*/
        carouselContent: "",

        /*比赛类型*/
        gameType: "",

        /*轮播状态*/
        carouselType: "",

        /*当前时间*/
        timeNew: new Date(),
        tableData: [],
        allList: [],
        schArr: [],
        sch_order: "",
        sch_status: null,
        /*sch_date: null,*/
        dateStart: null,
        dateEnd: null,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40],
        diaIsShows: false,
        formDatas: {},
        editType: "",
        options: [
          {label: "使用中", value: 0},
          {label: "未使用", value: 1},
        ],
        rowIndex: 0,

        /*必填*/
        rules: {
          // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
          carouselContent: [{required: true, message: "请输入图片主题", trigger: "blur"}],
          carouselTheme: [{required: true, message: "请输入内容", trigger: "blur"}],
          imgUrl: [{required: true, message: "请选择图片", trigger: "blur"}],
          carouselType: [{required: true, message: "请输入此轮播状态", trigger: "blur"}],


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
      this.ArticleDataAppCarousel();
      //this.imageUrl = this.imageValue;
    },
    filters: {
      statusText(val) {
        if (val === undefined) return;
        if (val === 0) {
          return "使用中";
        } else if (val === 1) {
          return "未使用";
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

      /*获取轮播数据*/
      async ArticleDataAppCarousel() {
        console.log("首次查询APP轮播图");
        let {code, data, msg} = await getCarouselAll();

        console.log(data);
        this.tableData = data;
      },


      imgFile(){
        this.formDatas.imgUrl = this.imageUrl;
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
        map.set("轮播名称", this.carouselContent)
        map.set("使用状态", this.carouselType)
        map.set("开始时间", this.dateStart)

        console.log("###############")
        console.log(this.carouselContent)
        console.log(this.carouselType)
        console.log(this.dateStart)

        this.formDatas = {"carouselContent": this.carouselContent, "carouselType": this.carouselType, "dateStart": this.dateStart};

        let {code, data, msg} = await LikeArticlet(this.formDatas);
        console.log("@@@@@@@@@@@@@@@@@");
        console.log(code);
        console.log(data);
        this.tableData = data;
        console.log("@@@@@@@@@@@@@@@@@")

        /*let {code, data, msg} = LikeArticlet(this.formDatas);
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
        this.formDatas = {};
        this.formDatas.phoneCarousel = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F11712326.s21i-11.faiusr.com%2F2%2FABUIABACGAAgpfm_wQUohqX7ugEw2AQ4kAM.jpg&refer=http%3A%2F%2F11712326.s21i-11.faiusr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636526274&t=61a4f2fb393adc68233d2b709941a509";
        console.log("#############")
        console.log(this.formDatas);
        console.log("#############")
        this.diaIsShows = true;
        /*this.formDatas.order = (Math.random() * 10e18).toString();
        this.formDatas.id = this.allList.length + 1;*/
        this.editType = "add";
        this.$nextTick(() => {

          this.$refs.diaForm.clearValidate();
        });
        /**/

      },


      // 编辑
      editTable(index, row) {
        this.formDatas = Object.assign({}, row)

        this.editType = "update";
        this.diaIsShows = true;
        this.$nextTick(() => {
          this.$refs.diaForm.clearValidate();
        });
        this.rowIndex = index;
      },
      changeTab(form, type) {
        this.$refs[form].validate(valid => {
          if (valid) {
            if (type === "update") {
              // 改变整个表格数据
              let start = (this.currentPage - 1) * this.pageSize;
              this.allList[start + this.rowIndex] = Object.assign({},this.formDatas);
              // 解决数组不能通过索引响应数据变化
              this.$set(
                      this.tableData,
                      this.rowIndex,
                      Object.assign({}, this.formDatas)
              );

              console.log("########################")
              console.log(this.formDatas)
              console.log("########################")
              UpdateArticlet(this.formDatas)
              this.$notify({
                title: "成功",
                message: "数据已修改成功",
                type: "success"
              });
            } else {

              console.log("%%%%开始")
              console.log(this.formDatas)
              AddArticlet(this.formDatas);
              console.log("%%%%结束")


              setTimeout(function () {
                //内容3秒后执行
                window.location.reload();
              }, 2000);

              this.tableData.unshift(Object.assign({}, this.formDatas));
              this.allList.push(Object.assign({}, this.formDatas));
            }
            this.diaIsShows = false;
          } else {
            return;
          }
        });
      },


      /*图片上传*/
      submitUploadImgUrl(uploader) {
        //  图片不做处理的方式
        let form = new FormData();

        console.log("图片图片图片图片图片");
        console.log(uploader);
        console.log("图片图片图片图片图片");

        form.append("file", uploader.file);
        axios
                /*.post(this.url, form, {*/
                .post("http://localhost:8800/teamer/imgs/getImgFile", form, {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                })
                .then(res => {
                  this.imageUrl = res.data.data;
                  this.formDatas.phoneCarousel = res.data.data;

                  console.log("赋值成功")
                  console.log(this.formDatas)
                  console.log(this.formDatas.phoneCarousel)
                  console.log("赋值成功")
                  //this.$emit("handleSuccess", this.imageUrl);
                  //上传成功
                  //处理自己的逻辑
                  this.$message({
                    type: "success",
                    message: "上传成功！"
                  });
                  //this.vm.$set(this.formDatas,"imgUrl",res.data.data);
                })
                .catch(() => {
                  //上传失败
                  //处理自己的逻辑
                  this.$message({
                    type: "error",
                    message: "上传错误！"
                  });
                });
        this.imgFile();

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
</style>
