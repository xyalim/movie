<template>
	<!--电影列表-->
	<div class="playing" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
		<molist v-if="movieList" :movieList="movieList" v-on:type="getType" type='playing'></molist>
	</div>
</template>

<script>
//加载插件
import { Indicator } from 'mint-ui';
//弹出框插件
import { MessageBox } from 'mint-ui';


export default {
  name: 'playing',
  created(){
  	//http://m.maoyan.com == /maoyan
  	//请求 -- 本地服务器(webpack的devServer) -- 猫眼的服务器
  	this.axios.get('/ajax/movieOnInfoList',{
				params:{
					token: ''
				}
			}).then((res)=>{
				//电影ID保存，用于加载
				this.moviesIds = res.data.movieIds;
				this.moviesIds.splice(0,12);
			this.loadMore(this.moviesIds);
				this.loading = false;//加载开关
			
			//电影信息保存
				this.movieList = res.data.movieList;
		});
		//修改顶部导航
		this.$store.commit('changeHT','正在热映')
		//修改title
		var tit = document.getElementsByTagName('title')[0];
		tit.innerText="电影";
  },
  data(){
  	return{
  		moviesIds:[],//电影ID
  		movieList:[],//电影信息
			loading:true,//无限加载开关
  	}
  },
  methods:{
  		
  		//跳转电影详情页
  		getType(data){
  			this.$router.push({name:"movie",params:{
  				movieId:data
  			}})
  		},
  		
  		//到底加载
  		loadMore(){
  			if (this.movieList.length == 0) {
  				return false;
  			}
  			this.loading = true;
  			let a = this.moviesIds.splice(0,12);
  			if (a.length != 0) {
  			  Indicator.open('加载中...');
			  setTimeout(() => {
				this.getmovies(a.join(','));//加载请求
			  }, 1000);
  			}else{
  				MessageBox.alert('已经到底啦！','提示');
  			}
  		},
  		
  		//加载请求
  		getmovies(a){
            this.axios.get('/ajax/moreComingList' ,{
			    params: {
			      	token:'',
					movieIds: a
			    }
			  }
          ).then((res)=>{
           		this.movieList = this.movieList.concat(res.data.coming);//更新列表
			    Indicator.close();
                this.loading = false;
            })
       },
	},
}
</script>

