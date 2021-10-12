import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel

// 登录
export function login(data) {
    return Vue.prototype.$post('/user/login', data)
}
export function getUser(data) {
    return Vue.prototype.$get('/user/getUser')
}
/*查询所有用户基本信息*/
export function getUserListWeb() {
    return Vue.prototype.$get('/user/getUserListWeb')
}

/*修改用户基本信息*/
export function updateUserWeb(data) {
    return Vue.prototype.$upload('/user/updateUserWeb',data)
}

/*用户信息模糊查询*/
export function LikeName(map) {
    return Vue.prototype.$upload('/user/LikeName',map)
}
