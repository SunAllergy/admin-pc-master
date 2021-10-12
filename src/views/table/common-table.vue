<template>
    <div class="className">
        <el-card class="anoCard">
            <div slot="header">
                <span>文章信息管理</span>
            </div>
            <div class="searchDiv">
                <el-input type="text" placeholder="请输作者" class="width1" v-model="author"></el-input>
                <el-select v-model="sch_status" clearable
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
                <el-table-column prop="title" label="文章标题"></el-table-column>
                <el-table-column prop="author" label="作者"></el-table-column>
                <el-table-column prop="createAt" label="创建时间"></el-table-column>
                <el-table-column prop="updateAt" label="修改时间"></el-table-column>
                <el-table-column prop="status" label="文章状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | tagClass">{{
                            scope.row.status | statusText
                            }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
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
        <el-dialog title="文章信息管理" :visible.sync="diaIsShow" class="diaForm">
            <el-form ref="diaForm" :model="formData" :rules="rules" label-width="140px">


                <el-form-item label="文章标题" prop="title">
                    <el-input type="text" placeholder="请输入文章标题" v-model="formData.title"></el-input>
                </el-form-item>

                <el-form-item label="文章内容" prop="content">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.content"></el-input>
                </el-form-item>

                <!--<el-form-item label="请插入图片" prop="name">
                  <el-input type="text" placeholder="图片" v-model="formData.name"></el-input>
                </el-form-item>-->
                <el-form-item label="插入图片" prop="photo">
                    <el-upload
                            action=""
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-error="handleAvatarError"
                            :http-request="submitUploadImgUrl">
                        <!--<img v-if="formData.gamePhoto" :src="formData.gamePhoto" width="300" height="120" class="avatar"/>-->
                        <img v-if="formData.photo" :src="formData.photo" width="300" height="120" class="avatar"/>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <!--<el-form-item label="获取当前时间" prop="timeNew">
                    <el-date-picker prop="timeNew" v-model="formData.time" type="datetime" placeholder="选择日期时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>-->
                <el-form-item label="文章状态" prop="status">
                    <el-select v-model="formData.status" placeholde="请选择状态">
                        <el-option v-for="item in options" :label="item.label" :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
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
    import {GetArticletList} from "@/service/article";
    import {AddArticlet} from "@/service/article";
    import {UpdateArticlet} from "@/service/article";
    import {LikeArticlet} from "@/service/article";
    import axios from "axios";

    export default {
        data() {
            return {

                /*图片*/
                imageUrl: "",
                /*url: process.env.VUE_APP_URL + "/sys/oss/upload",*/
                //url: "D:\\teamer\\file",

                /*作者*/
                author: "",

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
                diaIsShow: false,
                formData: {},
                editType: "",
                options: [
                    {label: "发布", value: 0},
                    {label: "取消发布", value: 1},
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
                if (val === 0) {
                    return "发布中";
                } else if (val === 1) {
                    return "取消发布";
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
                let {code, data, msg} = await GetArticletList();

                console.log(data);
                console.log(code);
                this.tableData = data;
            },

            imgFile(){
                this.formData.photo = this.imageUrl;
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

                this.formData = {"sch_status": this.sch_status, "author": this.author, "dateStart": this.dateStart};
                // eslint-disable-next-line no-undef


                let {code, data, msg} = await LikeArticlet(this.formData);
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
                this.formData.photo = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F11712326.s21i-11.faiusr.com%2F2%2FABUIABACGAAgpfm_wQUohqX7ugEw2AQ4kAM.jpg&refer=http%3A%2F%2F11712326.s21i-11.faiusr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636526274&t=61a4f2fb393adc68233d2b709941a509";
                console.log("#############")
                console.log(this.formData);
                console.log("#############")
                this.diaIsShow = true;
                /*this.formData.order = (Math.random() * 10e18).toString();
                this.formData.id = this.allList.length + 1;*/
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
            changeTab(form, type) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if (type === "update") {
                            // 改变整个表格数据
                            let start = (this.currentPage - 1) * this.pageSize;
                            this.allList[start + this.rowIndex] = Object.assign(
                                {},
                                this.formData
                            );
                            // 解决数组不能通过索引响应数据变化
                            this.$set(
                                this.tableData,
                                this.rowIndex,
                                Object.assign({}, this.formData)
                            );

                            console.log("########################")
                            console.log(this.formData)
                            console.log("########################")
                            UpdateArticlet(this.formData)
                            this.$notify({
                                title: "成功",
                                message: "数据已修改成功",
                                type: "success"
                            });
                        } else {
                            AddArticlet(this.formData);
                            window.location.reload();
                            this.tableData.unshift(Object.assign({}, this.formData));
                            this.allList.push(Object.assign({}, this.formData));
                        }
                        this.diaIsShow = false;
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
                        this.formData.photo = res.data.data;
                        console.log(this.formData)

                        this.$emit("handleSuccess", this.imageUrl);
                        //上传成功
                        //处理自己的逻辑
                        this.$message({
                            type: "success",
                            message: "上传成功！"
                        });
                        /*this.vm.$set(this.formData,"gamePhoto",res.data.data);*/
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
