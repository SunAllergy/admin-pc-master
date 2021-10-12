import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel

// 查询所有文章
export function GetArticletList() {
    return Vue.prototype.$get('/article/GetArticletList')
}
// 新增文章
export function AddArticlet(data) {
    return Vue.prototype.$upload('/article/AddArticlet',data)
}

// 修改单个文章
export function UpdateArticlet(data) {
    return Vue.prototype.$upload('/article/UpdateArticlet',data)
}

// 检索文章
export function LikeArticlet(map) {
    return Vue.prototype.$post('/article/LikeArticlet',map)
}

