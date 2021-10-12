import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel


// 图片上传/查询
export function getImgFile(file) {
    return Vue.prototype.$post('/imgs/getImgFile',file)
}

