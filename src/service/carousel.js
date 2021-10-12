import Vue from "vue";
import { post, get, del, put, upload, exportExcel } from "./index";
/* eslint-disable */
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$del = del
Vue.prototype.$put = put
Vue.prototype.$upload = upload
Vue.prototype.$exportExcel = exportExcel

// 查询所有轮播图
export function getCarouselAll() {
    return Vue.prototype.$get('/carousel/getCarouselAll')
}
// 新增轮播图
export function AddArticlet(data) {
    return Vue.prototype.$post('/carousel/addCarousel',data)
}

// 修改单个轮播图
export function UpdateArticlet(data) {
    return Vue.prototype.$post('/carousel/UpdateCarousel',data)
}

// 查询轮播图
export function LikeArticlet(map) {
    return Vue.prototype.$post('/carousel/LikeArticlet',map)
}

