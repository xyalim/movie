import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Movie from './views/Movie.vue'
import Show from './views/Show.vue'
import City from './views/city.vue'
import Search from './views/Search.vue'
import MovieDetail from './views/MovieDetail.vue'

import Playing from './views/Playing.vue'
import Comming from './views/Comming.vue'

Vue.use(Router)

export default new Router({
//mode: 'history',
//base: process.env.BASE_URL,
  routes: [
  	{
  		path:'/',redirect:'/home'
  	},
    {
      path: '/home',
      name: 'home',
      component: Home,
      children:[
      	{path:'playing',component:Playing},
      	{path:'comming',component:Comming},
      	{path:'',redirect:'playing'}
      ]
    },
    {
    	path:'/movie/:movieId',
    	name:'movie',
    	component: () => import('./views/Movie.vue')
    },
    {
    	path:'/show/:cinemaId',
    	name:'show',
    	component: () => import('./views/Show.vue')
    },
    {
    	path:'/city',
    	name:'city',
    	component: () => import('./views/city.vue')
    },
    {
    	path:'/search',
    	name:'search',
    	component: Search
		},
		{
    	path:'/movieDetail/:movieId',
    	name:'movieDetail',
    	component: MovieDetail
    }
  ]
})
