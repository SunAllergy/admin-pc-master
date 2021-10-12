import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel

// 查询所有比赛
export function getGameList() {
    return Vue.prototype.$get('/game/getGameList')
}

// 修改比赛
export function UpdateGame(data) {
    return Vue.prototype.$upload('/game/UpdateGame',data)
}

// 增加比赛
export function AddGame(data) {
    return Vue.prototype.$upload('/game/AddGame',data)
}


// 检索文章
export function LikeGame(map) {
    return Vue.prototype.$post('/game/LikeGame',map)
}
