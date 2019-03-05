import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//重置样式
import '@/css/reset.css';
//axios
import axios from 'axios';
//引入mintUI
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);
//阻止启动生产消息
Vue.config.productionTip = false
//请求接口一
let myrequest = axios.create({
	baseURL:'http://maoyan.bluej.cn'
})
Vue.prototype.axios = myrequest;
//请求接口二
let myrequest2 = axios.create({
	baseURL:'http://59.110.231.183:3001'
})
Vue.prototype.axios2 = myrequest2;

//自定义工具库
import tools from './js/tools.js';
Vue.prototype.myTools = tools;

// swiper 插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */);

//电影列表组件
import molist from './components/molist/';
Vue.use(molist);

//如需星星评分，则需引入相关组件./components/star/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
