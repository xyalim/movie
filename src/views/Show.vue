<template>
	<div id="show">
		<!--地址信息-->
		<div class="cinemainfo">
			<h5>{{cinema.nm}}</h5>
			<p>{{cinema.addr}}</p>
		</div>
		
		<!--轮播图-->
		<div class="header">
	        <div class="filter" :style="{'background-image': 'url('+imgurl+')'}"></div>
			<div class="filter2"></div>
	        <div class="movie-box">
	            <swiper ref="mySwiper" :options="swiperOption">
	                <swiper-slide  v-for="(movies,mind) in showData.movies" :key='mind' >
	                	<div class="imgbox" :class="{'active' : mind == mindex}">
	                		<img :src="myTools.picFix(movies.img)" alt="">
	                	</div>
	                </swiper-slide>
	            </swiper>
	        </div>
	        
        </div>
        
        <!--电影信息-->
        <div class="moviemsg">
        	<h5>{{moviesmsg.nm}}&nbsp;
        		<span v-if="moviesmsg.sc != 0">{{moviesmsg.sc}}分</span>
        		<span v-if="moviesmsg.sc == 0">暂无评分</span>
        	</h5>
        	<p>{{moviesmsg.desc}}</p>
        </div>
        
        <!--时间信息-->
		<div class="timelist" :class="{'marg':showData.vipInfo==null}">
			<ul class="timeul">
				<li class="timeli" 
					v-for="(ti,tii) in moviesmsg.shows" 
					:key="tii"
                	:class="{'active':ti.showDate==day }" 
                	@click="timemet(ti.showDate,tii)">{{ti.dateShow}}</li>
			</ul>
		</div>
		
		<!--电影场次-->
		<div class="moviesshow">
			<div class="mshowtitle" v-for="(ite,ind) in showData.vipInfo" :key="ind">
				<div class="msleft">{{handleka(ite.tag)}}</div>
				<div class="mscont">{{ite.title}}</div>
				<div class="msright">{{ite.process}}</div>
			</div>
			<div class="nothing" v-if="showlist.length == 0">
				<div>
					<img src="../assets/movie.png"/>
					<p>暂无信息，先去看看其他吧！</p>
				</div>
			</div>
			<div class="showlist" v-for="slist in showlist">
				<div class="zeroFlag" v-if="slist.zeroFlag != null">{{slist.zeroFlag}}</div>
				<div class="scene1">
					<p class="time">{{slist.tm}}</p>
					<p class="etime">{{handletime(slist.tm)}}散场</p>
				</div>
				<div class="scene2">
					<p class="lan">{{slist.lang}}{{slist.tp}}</p>
					<p class="elan">{{slist.th}}</p>
				</div>
				<div class="scene3">
					<div class="price">
						<p class="pri">
							￥<i v-html="slist.sellPr"></i>
						</p>
						<div class="vpri" v-if="slist.vipPrice != null">
							<p>{{slist.vipPriceName}}</p>
							<span>￥<i>{{slist.vipPrice}}</i></span>
						</div>
					</div>
					<p class="eprice"><span v-if="slist.extraDesc == null">&nbsp;</span>{{slist.extraDesc}}</p>
				</div>
				<div class="scene4">购票</div>
			</div>
		</div>
		
		<hr style="height: 10px;background-color: #d4d4d457;border: 0;"/>
		
		<!--小吃信息部分-->
		<div class="eatmsg" v-if="eatlist.totalCount !== 0">
			<div class="eatmsg-title">影院超值套餐</div>
			<div v-for="eatitem in eatlist.dealList" class="listcontext">
				<p class="tag" v-if="eatitem.cardTag != null">HOT</p>
				<img v-lazy="myTools.picFix(eatitem.imageUrl)" alt="" class='moviesimg'/>
	    		<div class="details">
	    			<h5>
	    				<p class="titletag" v-if="eatitem.recommendPersonNum==1">单人</p>
	    				<p class="titletag" v-if="eatitem.recommendPersonNum==2">双人</p>
	    				<p class="titletag" v-if="eatitem.recommendPersonNum==3">多人</p>
	    				<p class="titletag" v-if="eatitem.recommendPersonNum==0">其他服务</p>
	    				{{eatitem.title}}
	    			</h5>
	    			<p class="price">￥<span>{{eatitem.price}}</span></p>
	    			<p class="sell">{{eatitem.curNumberDesc}}</p>
	    			<p class="btn">去购买</p>
	    		</div>
			</div>
			
			
		</div>
		
    </div>
</template>

<script>
	export default {
		created(){
	        this.cinemaId = this.$route.params.cinemaId;//影院ID
	        this.movieId = this.$route.query.movieId;//电影ID
			
			//影院信息数据获取
	        this.axios.get('/ajax/cinemaDetail',{
	            params:{
	                cinemaId: this.cinemaId ,
	                movieId: this.movieId ,
	            }
	        }).then((res)=>{
	        	// console.log(res)
	            this.showData = res.data.showData;//电影信息
	            this.cinema = res.data.cinemaData;//影院信息
				this.eatlist = res.data.dealList;//小吃信息
	            
	            //woff字体相关（电影价格显示）
	            var sty = document.getElementById('sty');
				sty.innerHTML=`
					@font-face {
					font-family: 'matrix';
					src: url(${res.data.stone.fonts.woff}) format('woff');
					}`
				
	            //初始化swiper索引
	            for (let i=0;i<this.showData.movies.length;i++) {
	            	if (this.showData.movies[i].id == this.movieId) {
			    		this.swiper.slideTo(i, 500, false);//转到指定页数
			    		this.mindex = i;//轮播图下标
			    		this.imgurl = this.myTools.picFix(this.showData.movies[i].img);//背景图片地址更换
			    		this.moviesmsg = this.showData.movies[i];//单条电影信息
			    		this.day = this.moviesmsg.shows[0].showDate;//电影放映日期信息
			    		this.showlist = this.moviesmsg.shows[0].plist;//单条电影信息场次信息
			    		
	            	}
	            }
				//提交修改
				this.$store.commit('changeHT',res.data.cinemaData.nm);
				
				//修改title
				var tit = document.getElementsByTagName('title')[0];
				tit.innerText=res.data.cinemaData.nm;
	        })
	       
	    },
	    computed: {  
		    swiper() {  
		      return this.$refs.mySwiper.swiper;
		    }
		}, 
	    data() {
	        return {
		      	cinemaId:'',//影院ID
	            movieId:'',//电影ID
	            cinema:'',//影院信息
	            showData:'',//电影信息数组
	            imgurl:'',//背景图片更换
	            moviesmsg:[],//单条电影信息
	            showlist:[],//单条电影信息场次信息
	            eatlist:[],//小吃信息数组
	            day:'',//电影放映日期信息
	            mindex:'',//轮播图下标
	            
	            //轮播图
		        swiperOption: {
		          slidesPerView: "auto",//两侧的张数
		          spaceBetween: 5,//轮播图之间的间隙
		          centeredSlides:true,//是否居中
		          slideToClickedSlide:true,//点击居中
		          initialSlide:0,//初始化索引
		          on:{
			            slideChangeTransitionEnd:()=>{
			              //背景同步
					      this.imgurl = this.myTools.picFix(this.showData.movies[this.swiper.activeIndex].img);
					      
					      //下标更新
					      this.mindex = this.swiper.activeIndex;
					      
					      //相关电影和场次更换
					      this.changemsg(this.swiper.activeIndex);
					    },
				    },
		        }
	        
	        }
	    },
	    methods:{
	        
	        //电影放映日期及单条电影场次信息
	        timemet(date,index){
	        	this.day = date;
	        	this.showlist = this.moviesmsg.shows[index].plist;
	        },
	        
	        //更新电影放映日期，场次信息，电影信息
	        changemsg(index){
	        	this.moviesmsg = this.showData.movies[index];//电影
	        	this.day = this.moviesmsg.shows[0].showDate;//日期
	        	this.showlist = this.moviesmsg.shows[0].plist;//场次
	        },
	        
	        //办卡信息处理
	        handleka(ka){
	        	return ka.substring(0, ka.length - 1);
	        },
	        
	        //电影散场时间处理
	        handletime(time){
	        	let h = Number(time.substring(0,2));
	        	let m = Number(time.substring(3,time.length));
	        	let addh = parseInt(this.moviesmsg.dur/60);
	        	let addm = this.moviesmsg.dur%60;
	        	
	        	h += addh;
	        	m += addm;
	        	if (h>=24) {
	        		h-=24;
	        	}
	        	if (m > 59) {
	        		m -= 60
	        		h+=1;
	        	}
	        	if (h < 10) {
	        		h = "0"+h;
	        	}
	        	if (m < 10) {
	        		m = "0"+m;
	        	}
	        	return h + ":" + m;
	        }
	        
	    }
 	}
</script>

<style lang="scss" scoped>

#show{
    width: 100%;
    /*影院信息*/
    .cinemainfo{
    	width: 70%;
    	padding: 15px;
    	>*{
    		width: 100%;
    		overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
    	}
    	h5{
    		font-size: 16px;
    	}
    	p{
    		font-size: 14px;
    		color: grey;
    	}
    }
    
    /*电影轮播*/
    .header{
		overflow: hidden;
		position:relative;
		min-width: 320px;
		height: 135px;
		
		.filter{
			top: 0;
			left: 0;
			background-repeat: no-repeat;
			background-size: 100%;
			position: absolute;
			width: 100%;
			height: 188px;
			-webkit-filter: blur(15px);
			filter: blur(15px);
			z-index: -1;
		}
		.filter2{
			background-color: #40454d;
			opacity: .55;
			top: 0;
			left: 0;
			position: absolute;
			width: 100%;
			height: 188px;
			z-index: -1;
		}
	    .swiper-slide{
	    	padding: 10px 0;
	        width:80px !important; 
	        height:115px;
	        .imgbox{
	        	width:100%;
	            height:100%;
	            opacity: 0.5;
	            transform:scale(0.8);
	            transition: all 0.3s;
	            
		        img{
		            width:100%;
	            	height:100%;
		        }
	        }
	        .active{
	         	border: 2px solid white;
	         	box-sizing: border-box;
	        	opacity: 1;
	        	transform:scale(1);
	        }
	        .active:after{
	        	content:"";
	        	border: 5px solid white;
			    border-left-color: transparent;
			    border-right-color: transparent;
			    border-bottom-color: transparent;
			    position: absolute;
			    bottom: -12px;
			    left: 50%;
			    transform: translateX(-50%);
	        }
	    }
	    
	}
	/*电影信息*/
	.moviemsg{
		padding: 15px;
		text-align: center;
		border-bottom: 1px solid #d4d4d457;
		h5{
			font-size: 17px;
			span{
				color: #ffb400;
			}
		}
		p{
			font-size: 13px;
			color: grey;
		}
	}
	
	/*时间列表部分*/
	.marg{
		margin-bottom: 10px;
	}
	.timelist{
		width: 100%;
		overflow-x: scroll;
		text-align: center;
		.timeul{
			width:100%;
			white-space: nowrap;
        	display: flex;
			.timeli{
				margin-left: 10px;
				min-width: 110px;
	            height: 43px;
	            font-size: 14px;
	            font-weight: 700;
	            color: gray;
	            line-height: 43px;
	            box-sizing: border-box;
			}
			.active{
				color: #F03D37;
				border-bottom: 2px solid #F03D37;
			}
		}
	}
	/*场次列表*/
	.moviesshow{
		min-width: 310px;
		.mshowtitle{
			position: relative;
			padding:15px 15px;
			background-color:#fff5ea;
			>div{
				display: inline-block;
				font-size: 12px;
				color: #fa9600;
			}
			.msleft{
				color: white;
				background-color: #fa9600;
				padding: 0 5px;
				border-radius: 3px;
				margin-right: 10px;
			}
			.msright{
			position: absolute;
			color: grey;
			right: 15px;
			}
		}
		.nothing{
			background-color: #F0F0F0;
			width: 100%;
			height: 30%;
			text-align: center;
			div{
				padding:20px 0;
				p{
					padding-top: 10px;
					color: gray;
				}
			}
		}
		.showlist{
			padding: 10px 0 10px 10px;
			border-bottom: 1px solid #d4d4d457;
			position: relative;
			min-width: 310px;
			.zeroFlag{
				position: absolute;
				top:0;
				background-color: #a3cfd9;
				color: #fff;
			    padding: 0 3px;
			    height: 15px;
			    line-height: 15px;
			    font-size: 10px;
			    border-radius: 2px;
			    -webkit-transform: scale(.8);
			    transform: scale(.8);
			    -webkit-transform-origin: left;
			    transform-origin: left;
			}
			>div{
				display: inline-block;
				margin-right: 15px;
			}
			.scene1{
				width: 18%;
				vertical-align: text-bottom;
				.time{
					font-size: 20px;
				}
				.etime{
					margin-top: 3px;
					font-size: 12px;
					color: grey;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.scene2{
				width: 22%;
				vertical-align: text-bottom;
				.lan{
					font-size: 14px;
				}
				.elan{
					margin-top: 5px;
					font-size: 12px;
					color: grey;
					
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
			.scene3{
				width: 35%;
				letter-spacing: -1px;
				.price{
					font-size: 10px;
					color: #f03d37;
					p{
						display: inline-block;
						span{
							font-size: 10px;
						}
					}
					i{
						font-style: normal;
					}
					.pri{
						margin-right: 3px;
						i{
							font-size: 18px;
							font-family: matrix;
						}
					}
					.vpri{
						padding:0 2px 0 0;
						border: 0.5px solid #f90;
						border-radius: 2px;
						display: inline-block;
						color: #f90;
						p{
							color: white;
							background-color: #f90;
						}
					}
				}
				.eprice{
					margin-top: 5px;
					font-size: 12px;
					color: grey;
				}
			}
			.scene4{
				width: 25%;
				position: absolute;
				right: 0;
				top: 50%;
			    -webkit-transform: translateY(-50%);
			    transform: translateY(-50%);
		        width: 45px;
			    height: 28px;
			    line-height: 28px;
			    font-size: 12px;
			    background-color: #f03d37;
			    color: #fff;
			    border-radius: 4px;
			    text-align: center;
			}
		}
	}
	/*小吃部分*/
	.eatmsg{
		margin: 10px 10px;
		min-width: 310px;
		.eatmsg-title{
			font-weight: 700;
			line-height: 36px;
			height: 36px;
			font-size: 16px;
			color: #666;
			border-bottom: 1px solid gainsboro;
		}
		.tag{
		    position: absolute;
		    left: 0;
		    top: 0px;
		    display: inline-block;
		    height: 18px;
		    line-height: 18px;
		    background-color: #fa5939;
		    font-size: 12px;
		    padding: 0 5px;
		    color: #fff;
		    border-radius: 0 0 5px 0;
		}
		.titletag{
			display: inline-block;
		    vertical-align: top;
		    margin-top: 2px;
		    margin-right: 7px;
		    padding: 0 4px;
		    font-size: 10px;
		    line-height: 15px;
		    height: 15px;
		    background: #f90;
		    border-radius: 2px;
		    color: #fff;
		}
		.listcontext{
			position: relative;
			margin-bottom: 10px;
			width: 100%;
			border-bottom: 1px solid gainsboro;
		}
		.moviesimg{
			margin-top: 5px;
			display: inline-block;
			width: 95px;
			height: 95px;
		}
		.details{
			margin-left: 10px;
			width: 60%;
			min-width: 150px;
			display: inline-block;
			vertical-align: top;
	
			padding-bottom: 2px;
		}
		h5{
			display: inline-block;
			font-size: 14px;
			margin-top: 5px;
		}
		p{
			margin-top: 5px;
			color: #666;
			font-size: 13px;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.price{
			position: absolute;
			left: 100px;
			bottom: 0;
			font-size: 14px;
			color: #f03d37;
			span{
				font-size: 18px;
			}
		}
		.sell{
		    display: inline-block;
		    position: absolute;
		    bottom: 34px;
		    right: 10px;
		    line-height: 16px;
		    height: 16px;
		    font-size: 12px;
		    color: #999;
		}
		.btn{
			position: absolute;
			font-size: 12px;
			width: 46px;
		    height: 28px;
		    cursor: pointer;
		    line-height: 28px;
			text-align: center;
			border-radius: 5px;
			color: white;
			background-color: #f03d37;
			right: 10px;
			bottom: 5px;
			
		}
    }
}
</style>
