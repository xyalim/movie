<template>
	<div class="comming">
		<!--顶部轮播部分-->
		<div class="movie-box">
			<p class="title">近期最受期待</p>
            <swiper ref="mySwiper" :options="swiperOption">
                <swiper-slide  v-for="(most,index) in mostmovies" :key='most.id' >
                	<div class="swimg">
                		<div class="like" @click.stop="addlike(index)">
                			<img src="../assets/like.png" v-if="most.wishst == 0"/>
                			<img src="../assets/likes.png" v-if="most.wishst == 1"/>
                		</div>
	                    <img :src="myTools.picFix(most.img)" alt="">
	                    <div class="wish"><span>{{most.wish}}人想看</span></div>
                	</div>
                	<div class="msg">
                		<h5>{{most.nm}}</h5>
                		<p>{{handledate(most.comingTitle)}}</p>
                	</div>
                </swiper-slide>
            </swiper>
        </div>
        
		<hr style="height: 10px;background-color: #d4d4d457;border: 0;"/>
		
		<!--电影信息部分-->
		<div class="commoives" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
			
			<div v-for="(comti,comtidinex) in commingTitle" :key="comtidinex">
				<p class="titleweek">{{comti}}</p>
				<!-- 电影信息组件 -->
				<molist v-if="comlists" :movieList="handleMList(comti)" v-on:type="toMovieDetail" type='comming'></molist>
			</div>
			
		</div>
		
	</div>
</template>

<script>
	//相关loading和信息弹出插件
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';

export default {
  name: 'comming',
  created(){
  	//数据请求，电影信息获取（非轮播图部分）
  	this.axios.get('/ajax/comingList',{
		params:{
			ci: 20,
			token:'',
			limit: 10
		}
	}).then((res)=>{
		//电影ID获取
		this.commovieIds = res.data.movieIds;
  		this.commovieIds.splice(0,10);
  		
		  this.comlists = res.data.coming;//电影信息保存（非轮播图部分）
  		this.handletitle();//日期归类处理
  		this.loading = false;//滚动加载开关
  	});
  	
  	this.getmost();//电影信息获取（轮播图部分）
  	this.$store.commit('changeHT','即将上映');//顶部标题更改
  },
  data(){
  	return{
  		commovieIds:[],//存放电影id
  		comlists:[],//存放电影信息
  		commingTitle:[],//日期归类
  		loading:true,//滚动加载开关
  		mostmovies:[],//轮播图部分电影信息
  		mostoffset:0,//轮播图部分偏移量
  		
  		//swiper轮播图
  		swiperOption: {
          slidesPerView: "auto",//两侧的张数
          spaceBetween: 20,//轮播图之间的间隙
          on:{
          	//检测到最后一张轮播图事件
		    reachEnd: ()=>{
		    	if (this.mostoffset != 0) {
		    		this.getmost();//电影信息获取（轮播图部分）
		    	}
		    	
			},
			click:()=>{
				this.toMovieDetail(this.mostmovies[this.$refs.mySwiper.swiper.clickedIndex].id)
			},
		  },
        }
  	}
  },
  computed:{
		headerCity(){//数据依赖更新是，计算属性重新触发更新
			return this.$store.state.cityId
		}
	},
  methods:{
	  	//处理要传入组件的电影信息数组
		handleMList(str){
			const moviesListArr = [];
			this.comlists.forEach((item) => {
				if (item.comingTitle === str) {
					moviesListArr.push(item);
				}
			});
			return moviesListArr;
		},
  		
  		//滚动加载
  		loadMore(){
  			this.loading=true;
  			let a = this.commovieIds.splice(0,10);
  			if (a.length != 0) {
  			  Indicator.open('加载中...');
			  this.getnewcom(a.join(','));//电影信息获取（非轮播图部分）
  			}else{
  				MessageBox.alert('已经到底啦！','提示');
  			}
  		},
  		
  		//电影信息获取（非轮播图部分）
  		getnewcom(a){
            this.axios.get('/ajax/moreComingList' ,{
			    params: {
			    	ci: 20,
			      	token:'',
			      	limit: 10,
					movieIds: a
			    }
			  }
          ).then((res)=>{
           		this.comlists = this.comlists.concat(res.data.coming);//电影信息更新
           		this.handletitle();//日期归类处理
			    Indicator.close();
                this.loading = false;
            })
        },
        
        //日期归类处理
        handletitle(){
        	for (let i = 0;i<this.comlists.length;i++) {
			    let bFlag = true;
			    if(this.commingTitle.length == 0){
			        this.commingTitle.push(this.comlists[i].comingTitle);
			    }
			    for(let j=0;j<this.commingTitle.length;j++){
			        if(this.comlists[i].comingTitle == this.commingTitle[j]){
			            bFlag = false;
			        }
			    }
			    if(bFlag){
			       this.commingTitle.push(this.comlists[i].comingTitle); 
			    }
				
	  		}
        },
        
        //电影信息获取（轮播图部分）
        getmost(){
        	this.axios.get('/ajax/mostExpected',{
			    params: {
			      	ci: 20,
					limit: 10,
					offset: this.mostoffset,
					token:'',
			    }
			  }
           ).then((res)=>{
                if (res.data.coming.length==0) {
                	MessageBox.alert('这里没有内容了，先去看看其他吧！','提示');
                	return;
                }
                this.mostmovies = this.mostmovies.concat(res.data.coming);//信息更新
                this.mostoffset += 10;//偏移量更新
            })
        },
        
        //日期去掉周数
        handledate(nm){
        	return nm = nm.substring(0, nm.length - 3);
        },
        
        //点赞
        addlike(index){
        	var newItem =  this.mostmovies[index];
            if(this.mostmovies[index].wishst){
                newItem.wishst--;
                this.mostmovies.splice( index,1, newItem);
            }else{
                newItem.wishst++;
                this.mostmovies.splice( index,1, newItem);
            }
		},

		//跳转电影详情页
		toMovieDetail(id){
			this.$router.push({path:`/movieDetail/${id}?movieId=${id}`})
		}
        
	},
}
	
</script>

<style scoped lang="scss">
	.commoives{
		margin: 10px 0;
		list-style: none;
		min-width: 320px;
	}
	.titleweek{
		font-size: 14px;
		color: #333;
		padding: 0 0 5px 10px;
	    font-weight: 700;
	}
	
	/*轮播图部分*/
	.movie-box{
        /*background-color: grey;*/
        padding-left: 10px;
        margin-bottom: 20px;
        .title{
        	margin: 12px 0;
		    font-size: 14px;
		    color: #333;
        }
    }
    .swiper-slide{
        width:85px !important; 
        height:157px;
        .swimg{
        	position: relative;
	        img{
	        	position: absolute;
	            width:100%;
	            height:115px;
	        }
	        div{
	        	position: absolute;
	        	width: 28px;
	        	height: 28px;
	        	background-color: rgba(0,0,0,.4);
	        	z-index: 9;
	        	img{
	        		margin: 5px 0 0 5px;
	        		width: 15px;
	        		height: 15px;
	        	}
	        }
	        .like{
	        	border-radius: 0 0 6px 0;
	        }
	        .wish{
	        	width: 100%;
	        	height: 20px;
		        position: absolute;
		        top: 95px;
		        text-align: center;
	        	span{
	        	    font-size: 11px;
	    			font-weight: 600;
		        	z-index: 9;
		        	color: #faaf00;
		        }
	        }
	        
	    }
	    
	    .msg{
	    	width: 85px;
	    	position: absolute;
	    	bottom: 0;
	    	overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
	    	h5{
	    		font-size: 13px;
	    		font-weight: 500;
	    		color: black;
	    	}
	    	p{
	    		font-size: 12px;
	    		margin: 0;
	    	}
	    }
    }
</style>