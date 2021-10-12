import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel

// 所有注册码查询
export function getLabelList() {
    return Vue.prototype.$post('/label/getLabelCodeList')
}

// Like查询
export function getLikeCodeList(data) {
    return Vue.prototype.$post('/label/getLikeCodeList',data)
}


// 增加Code
export function addCodeList(data) {
    return Vue.prototype.$upload('/label/addCodeList',data)
}
