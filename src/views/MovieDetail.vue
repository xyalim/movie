<template>
    <div class="MDetail">
        <!--电影详情-->
        <div id="video-box" :style="movieBox">
            <video controls class="video" :src="videourl"></video>
        </div>
		<div class="header" :style="{'margin-top':isplay}">
			<div class="filter" :style="{'background-image': 'url('+myTools.picFix(detailMovie.img)+')'}"></div>
			<div class="filter2"></div>
			<div class="moviemsg">
				<img :src="myTools.picFix(detailMovie.img)" class="pic" @click="toplay()"/>
                <img src="../assets/play.png" alt="" class="play" @click="toplay()">
				<div class="msgcontent">
					<h5 class="mtitle">{{detailMovie.nm}}</h5>
					<p style="font-size: 12px;">{{detailMovie.enm}}</p>
					<p>
						<span v-if="detailMovie.sc != 0 && detailMovie.globalReleased"><i>{{detailMovie.sc}}</i>({{sumFix(detailMovie.snum)}}人评)</span>
						<span v-if="detailMovie.sc == 0 && detailMovie.globalReleased">暂无评分</span>
						<span v-if="!detailMovie.globalReleased" class="pwish">{{detailMovie.wish}}人想看</span>
					</p>
					<p>{{detailMovie.cat}}</p>
					<p>{{detailMovie.src}}/{{detailMovie.dur}}分钟</p>
					<p>{{detailMovie.pubDesc}}</p>
				</div>
			</div>
		</div>
		<div class="introduce">
			<div class="movie-introduce">
				<p class="tomovie-button" v-if="detailMovie.showst==3||detailMovie.showst==4" @click="toMovie()">查看影院信息</p>
				<p class="tomovie-button" v-else style='background: #FE9A00;'>暂无影院信息</p>
				<p>{{detailMovie.dra}}</p>
			</div>
			<div class="movie-photo">
				<h4>媒体库</h4>
				<swiper ref="mySwiper" :options="swiperOption">
					<swiper-slide v-for="(most,index) in detailMovie.photos" :key='index' >
						<div class="swimg">
							<img :src="myTools.picFixs(most,180,140)" alt="">
						</div>
					</swiper-slide>
				</swiper>
				<!-- @touchmove.prevent 遮罩层阻止默认滚动事件 -->
				<div class="toPhoto" v-if="toPhotoflag" @touchmove.prevent>
					<p @click="toPhotoflag=!toPhotoflag">关闭</p>
					<img :src="myTools.picFixs(toPhoto,320,300)" />
				</div>

				<div v-if="noPhoto" style="text-align: center;">暂无资料</div>
			</div>
			<div class="movie-comments">
				<h4>讨论</h4>
				<div class="hot">热门</div>
				<ul>
					<li v-for="(item,index) in hotComments" :key="index">
						<div class="comments-ava">
							<img :src="item.avatarUrl" alt="">
						</div>
						<div class="comments-context">
							<p class="nick">{{item.nick}}</p>
							<p class="score">给这部作品打了{{item.score}}分</p>
							<p class="content">{{item.content}}</p>
							<p class="time">{{dateFix(item.time)}}</p>
						</div>
					</li>
				</ul>
				<div v-if="comflag" style="text-align: center;">暂无热门评论</div>
				<!-- ------------------------------------------------------------------- -->
				<div class="hot" style='background: #FE9A00;'>最新</div>
				<ul>
					<li v-for="(item,index) in newComments" :key="index">
						<div class="comments-ava">
							<img :src="item.avatarUrl" alt="">
						</div>
						<div class="comments-context">
							<p class="nick">{{item.nick}}</p>
							<p class="score">给这部作品打了{{item.score}}分</p>
							<p class="content">{{item.content}}</p>
							<p class="time">{{dateFix(item.time)}}</p>
						</div>
					</li>
				</ul>
				<div v-if="!newcomflag" class="hot" style='background: #FF5722;' @click="moreComment()">加载更多</div>
				<div v-if="newcomflag" style="text-align: center;">暂无最新评论</div>
			</div>
		</div>
        
    </div>
</template>

<script>
//弹出框插件
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
export default {
    created(){
        //接收传过来的电影ID
		this.id = this.$route.params.movieId;
        this.axios.get('/ajax/detailmovie',{
            params:{
                movieId:this.id,
            }
        }).then((res)=>{
			this.detailMovie = res.data.detailMovie;//电影详情数据保存
			if (this.detailMovie.photos.length === 0) {
				this.noPhoto = true;
			}
			// console.log(this.detailMovie.photos.length === 0)
            //提交修改
            this.$store.commit('changeHT',this.detailMovie.nm);
            
            //修改title
            var tit = document.getElementsByTagName('title')[0];
            tit.innerText=this.detailMovie.nm;
		})
		//评论首次加载
		this.getComments(1);
    },
    data(){
        return{
            id:'',//电影id
			detailMovie:'',//电影详情数据
			noPhoto:false,//暂无资料显示
			isplay:'0px',//视频播放窗口弹出后控制header的margin-top
			movieBox:'height:0px;display:none;',//视频播放窗口样式
			videourl:'',//预告片链接
			//swiper轮播图
			swiperOption: {
				slidesPerView: "auto",//两侧的张数
				spaceBetween: 2,//轮播图之间的间隙
				on:{
					click:()=>{
						// console.log(this.$refs.mySwiper.swiper.clickedIndex)
						this.toPhoto = this.detailMovie.photos[this.$refs.mySwiper.swiper.clickedIndex]
						this.toPhotoflag = true;
					},
				},
			},
			toPhoto:'',//放大图片url
			toPhotoflag:false,//放大图片开关
			hotComments:[],//热门评论
			comflag:false,//控制“暂无热门评论”开关
			newComments:[],//最新评论
			newcomflag:false,//控制“暂无最新评论”开关
        }
    },
    methods:{
			//评论请求，type == 1为首次加载，type == 2为最新评论非首次加载的加载更多
	  		getComments(type){
				const of = this.newComments.length;
				this.axios2.get('/comments',{
					params:{
						movieId:this.id,
						userId:-1,
						offset:of,
						limit:15,
						ts:0,
						type:3
					}
				}).then((res)=>{
					// console.log(res.data.data.hotComments)
					if (type == 1) {
						this.hotComments = res.data.data.hotComments;
						this.newComments = res.data.data.comments;
						if (this.hotComments.length === 0) {
							this.comflag = true;
						}
						if (this.newComments.length === 0) {
							this.newcomflag = true;
						}
					}else{
						if (res.data.data.comments.length !== 0) {
							this.newComments = this.newComments.concat(res.data.data.comments);
							Indicator.close();
						}else{
							MessageBox.alert('已经没有更多评论了！','提示');
							Indicator.close();
						}
					}
					
				})
			  },
	  		//人数处理（wish）
	  		sumFix(snum){
	  			if (snum > 10000) {
	  				snum *= 0.0001;
	  				snum = snum.toFixed(1) + "万";
	  			}
	  			return snum;
			},
			dateFix(getd){//时间处理
				var d = new Date(getd)
				var y = d.getFullYear();
				var m = d.getMonth()+1;
				var ds = d.getDate();
				var h = d.getHours();
				var min = d.getMinutes();
				var x = y + '-' + this.add(m) +'-'+this.add(ds)+' '+this.add(h)+':'+this.add(min);

				var nd = new Date();
				var y1 = nd.getFullYear();
				var m1 = nd.getMonth()+1;
				var ds1 = nd.getDate();
				var h1 = nd.getHours();
				var min1 = nd.getMinutes();
				
					if (y==y1 && m == m1 && ds==ds1) {
						if (h1 == h) {
							var sum = min1 - min;
							if (sum < 31) {
								if (sum == 0) {
									x = "刚刚"
								}else{
									x = sum + "分钟前"
								}
							}
						}
						if ((h1 - h) == 1) {
							min1 = min1 + 60;
							var sum = min1 - min;
							if (sum < 31) {
								if (sum == 0) {
									x = "刚刚"
								}else{
									x = sum + "分钟前"
								}
							}
						}
					}
				
				return x;
			},
			add(some){//时间处理（少于10则加0）
				if (some < 10) {
					some = "0" + some; 
				}
				return some;
			},
            toplay(){//预告片展示
                if (!this.detailMovie.videourl) {
					MessageBox.alert('暂无预告片！','Sorry');
					return;
				}
				if (this.isplay == '0px') {
					this.videourl = this.detailMovie.videourl;
					this.isplay = '180px';
					this.movieBox = 'height:180px;display:block;';
				}else{
					this.videourl = '';
					this.isplay = '0px';
					this.movieBox = 'height:0px;display:none;';
				}
                
			},
			//跳转电影详情页
			toMovie(){
				this.$router.push({name:"movie",params:{
					movieId:this.id
				}})
			},
			//加载更多评论
			moreComment(){
				Indicator.open('加载中...');
				this.getComments(2);
			}
    }
}
</script>


<style lang="scss" scoped>
    .MDetail{
        /*电影详情部分*/
		.header{
			overflow: hidden;
			position:relative;
			min-width: 320px;
			height: 188px;
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
				background-color: rgba(0,0,0,0.4);
				top: 0;
    			left: 0;
				position: absolute;
				width: 100%;
				height: 188px;
    			z-index: -1;
			}
			.moviemsg{
				padding: 18px 15px 18px 15px;
				width: 100%;
                position: relative;
				.pic{
					width: 110px;
					height: 150px;
					border: 2px solid white;
					display: inline-block;
				}
                .play{
                    position: absolute;
                    width: 36px;
                    bottom: 25px;
                    left: 90px;
                }

				.msgcontent{
					display: inline-block;
					color: white;
					margin-left: 15px;
					vertical-align: top;
					width: 50%;
					min-width: 150px;
					i{
					    font-weight: 700;
						font-size: 16px;
						color: #faaf00;
						font-style:normal;
					}
					.pwish{
						color: #faaf00;
						font-weight: 700;
					}
					p{
						font-size: 14px;
						margin-top: 6px;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.mtitle{
						font-size: 18px;
					    margin-top: 2px;
					    font-weight: 700;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
			}
			.mright{
				position: absolute;
				right: 5px;
				top: 50%;
				transform: translateY(-50%);
			    width: 32px;
			}
		}
        #video-box{
            position: fixed;
			width: 100%;
			top:40px;
			left: 0;
			background: black;
			z-index: 9;
            .video{
                width: 100%;
                height: 100%;
            }
        }
		.introduce{
			width: 100%;
			.movie-introduce{
				width: 100%;
				p{
					margin: 10px;
					color: #555;
					line-height: 22px;
					font-size: 14px;
				}
				.tomovie-button{
					width: 90%;
					margin: 10px auto;
					border-radius:5px;
					background: #e54847;
					color: white;
					text-align: center;
					font-size: 18px;
					line-height: 36px;
				}
			}
			.movie-comments,.movie-photo{
				h4{
					color: #555;
					margin: 10px;
				}
				.swiper-slide{
					width:90px !important; 
					height:70px;
					margin-left: 10px;
					.swimg{
						img{
							width:90px;
							height: 70px;
						}
					}
				}
				.toPhoto{
					position: fixed;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					z-index: 10;
					background: rgba(0,0,0,0.8);
					img{
						width: 100%;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
					}
					p{
						border-radius: 50%;
						width: 40px;
						height: 40px;
						position: absolute;
						right: 20px;
						top: 20px;
						text-align: center;
						font-size: 14px;
						background: rgba(255, 255, 255, 0.6);
						color: white;
						line-height: 40px;
						z-index: 11;
					}
				}
			}
			.movie-comments{
				.hot{
					width: 100%;
					margin: 10px auto;
					background: #e54847;
					color: white;
					text-align: center;
					font-size: 18px;
					line-height: 36px;
				}
				ul{
					li{
						margin: 10px 0 5px 10px;
						border-bottom: 1px solid gainsboro;
						.comments-ava{
							// 头像
							width: 20%;
							display: inline-block;
							vertical-align: top;
							text-align: center;
							img{
								width: 48px;
								height: 48px;
								border-radius:50%; 
							}
						}
						.comments-context{
							display: inline-block;
							width: 74%;
							.nick,.content{
								//昵称
								font-size: 14px;

							}
							.score,.time{
								//打分
								font-size: 12px;
								color: #999;
								margin: 2px 0 5px;
								
							}
							.content{//内容
								
							}
							.time{//时间
								margin-top: 10px;
								float: right;
							}
						}
					}
				}
			}
		}
        
    }
</style>
