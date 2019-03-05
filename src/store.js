import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	//状态 也就是数据(类比vue组件里的data)
  state: {
			headerTitle:'电影',
			cityId:20,
			citynm:'广州',
  },
  //变异	也就是方法(类比vue组件methods)同步的方法
  mutations: {
			changeHT(state,payload){
				//state状态   payload	荷载(存放的参数)
				state.headerTitle = payload;
			},
			changeCI(state,payload){
				//state状态   payload	荷载(存放的参数)
				state.cityId = payload.id;
				state.citynm = payload.nm;
			}
  },
  //用于异步的方法
  actions: {

  }
})
