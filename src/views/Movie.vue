<template>
	<div id="moviePage">
		<!--电影详情-->
		<div class="header">
			<div class="filter" :style="{'background-image': 'url('+myTools.picFix(detailMovie.img)+')'}"></div>
			<div class="filter2"></div>
			<div class="moviemsg" @click="toMovieDetail()">
				<img :src="myTools.picFix(detailMovie.img)" class="pic"/>
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
			<!-- <p class="mright">></p> -->
			<img src="../assets/right.png" class="mright"/>
		</div>
		
		<!--时间信息-->
		<div class="timelist">
			<ul class="timeul">
				<li class="timeli" 
					v-for="ti in timelists" 
					:key="ti.date"
                	:class="{'active':ti.date==day }" 
                	@click="timemet(ti.date)">{{getweek(ti.date)}}</li>
			</ul>
		</div>
		
		<!--影院信息-->
		<div class="content">
			<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
				<li v-for='(stu,index) in cinemas' :key='index' @click="toShow(stu.id)">
					<p class="ctitle">{{stu.nm}}<span>&nbsp;&nbsp;<i>{{stu.sellPrice}}</i>元起</span></p>
					<div class="caddress">
						<p class="left">{{stu.addr}}</p>
						<p class="right">{{stu.distance}}</p>
					</div>
					<div class="tags">
						<div class="allowRefund" v-if="stu.tag.allowRefund">退</div>
						<div class="endorse" v-if="stu.tag.endorse">改签</div>
						<div class="snack" v-if="stu.tag.snack">小吃</div>
						<div class="vipTag" v-show="stu.tag.vipTag != null">{{stu.tag.vipTag}}</div>
						<div class="hallType" v-for="(htype,htindex) in stu.tag.hallType" :key="htindex">{{htype}}</div>
					</div>
					<div class="card" v-if="stu.promotion.cardPromotionTag != null">
						<img src="../assets/01.png" style="width: 15px;">
						<p class="cp">{{stu.promotion.cardPromotionTag}}</p>
					</div>
					<div class="showTimes">
                		近期场次：{{stu.showTimes}}
                    </div>
                    <hr style="height: .1px;color: gainsboro;margin-bottom: 0;"/>
				</li>
			</ul>
		</div>
		
	</div>
</template>

<script>
	//相关插件
	import qs from 'qs';//字符串转换模块
	import { Indicator } from 'mint-ui';//加载模块
	import { MessageBox } from 'mint-ui';//弹窗模块
	
	export default {
		created(){
			//接收传过来的电影ID
			this.id = this.$route.params.movieId;
			
			//电影详情数据获取
			this.axios.get('/ajax/detailmovie',{
				params:{
					movieId:this.id,
				}
			}).then((res)=>{
				this.detailMovie = res.data.detailMovie;//电影详情数据保存
				
				//提交修改
				this.$store.commit('changeHT',this.detailMovie.nm);
				
				//修改title
				var tit = document.getElementsByTagName('title')[0];
				tit.innerText=this.detailMovie.nm;
			})
			
			this.day = this.today();//获取今天
			this.ciid = this.$store.state.cityId;//获取城市ID
			
	        // 影院信息
	        this.getCinemas(this.today(),0,this.ciid);
			
		},
		data(){
			return{
				id:'',//电影id
				detailMovie:'',//电影详情数据
				cinemas:[],//影院信息数据
				limit:0,//偏移量
				loading:true,//滚动加载开关
				day:'',//对应日期
				timelists:[],//放映日期
				ciid:'',
			}
		},
		methods:{
	  		
	  		//人数处理（wish）
	  		sumFix(snum){
	  			if (snum > 10000) {
	  				snum *= 0.0001;
	  				snum = snum.toFixed(1) + "万";
	  			}
	  			return snum;
	  		},
	  		
	  		//获取今天
	  		today(){
	            let d = new Date();
	            let year = d.getFullYear();
	            let month = d.getMonth()+1;
	            let day = d.getDate();
	            if (day<10) {
					day = "0"+day;
				};
				if (month<10) {
					month = "0"+month;
				};
	            return year +'-'+month+'-'+day;
	        },
	        
	        //日期转换成周
	        getweek(date){
	        	let d = new Date(date);
	        	let month = d.getMonth()+1;
	        	let day = d.getDate();
	        	let dayindex = d.getDay();
				let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				
				let td = new Date();
				let tmonth = td.getMonth()+1;
				let tday = td.getDate();
				if ( tmonth == month ) {
					if (tday == day) {
						weekDay[dayindex] = "今天";
					}
					if(tday+1 == day){
						weekDay[dayindex] = "明天";
					}
					if(tday+2 == day){
						weekDay[dayindex] = "后天";
					}
				}
					
				
				if (day<10) {
					day = "0"+day;
				};
				if (month<10) {
					month = "0"+month;
				};
	        	return weekDay[dayindex]+month+"月"+day+"日";
	        },
	        
	        //日期更换
	        timemet(date){
	        	this.day = date;
	        	this.cinemas = [];
	        	this.getCinemas(this.day,0,this.ciid);//重新获取影院信息
	        },
	        
	        //滚动加载
	  		loadMore(){
	  			  this.loading=true;
	  			  Indicator.open('加载中...');
	  			  this.limit += 20;
				  this.getCinemas(this.day,this.limit,this.ciid);
	  		},
	  		
	  		//获取影院信息
	  		getCinemas(day,offset,cityid){
	            this.axios.post('/ajax/movie' ,qs.stringify({
	                movieId: this.id,
	                day: day,
	                offset: offset,
	                limit: 20,
	                districtId: -1,
	                lineId: -1,
	                hallType: -1,
	                brandId: -1,
	                serviceId: -1,
	                areaId: -1,
	                stationId: -1,
	                item: "",
	                updateShowDay: true,
	                reqId: 1545708329350,
	                cityId: cityid,
	            })
	         ).then((res)=>{
	         		if (res.data.cinemas.length==0) {
	                	Indicator.close();
	                	if (res.data.showDays.dates[0].date != this.day) {
		                	this.day = res.data.showDays.dates[0].date;
	                		this.getCinemas(this.day,0,this.ciid);
                		}else{
							if (this.cinemas.length == 0) {
								MessageBox.alert('暂无符合条件的影院！','提示');
							}else{
								MessageBox.alert('已经到底啦！','提示');
							}
	                	}
	                }else{
	                	if (res.data.cinemas.length > 3) {
	                		this.loading=false;
	                	}
		                this.cinemas = this.cinemas.concat(res.data.cinemas);//影院信息更新
		                Indicator.close();
		            }
	                this.timelists = res.data.showDays.dates;
	            })
	        },
	        
	        //跳转到影院信息页面
	        toShow(cinemaId){
	            this.$router.push({name:'show', 
	                params:{  cinemaId : cinemaId } ,
	                query:{movieId: this.id,}
	            })
			},

			//跳转电影详情
			toMovieDetail(){
				this.$router.push({name:'movieDetail', 
	                query:{movieId: this.id,}
	            })
			}
	        
		}
	}
</script>

<style scoped lang="scss">
	#moviePage{
		min-width: 320px;
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
				.pic{
					width: 110px;
					height: 150px;
					border: 2px solid white;
					display: inline-block;
				}
				.msgcontent{
					display: inline-block;
					color: white;
					margin-left: 15px;
					vertical-align: top;
					width: 48%;
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
		
		/*时间列表部分*/
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
		
		/*影院部分*/
		.content{
			li{
				padding: 10px 15px 0;
				>div{
					margin: 3px 0;
				}
			}
			.ctitle{
				font-size: 16px;
				
				span{
					color: #f03d37;
					font-size: 14px;
				}
				i{
					font-size: 18px;
					font-style:normal;
				}
			}
			.caddress{
				font-size: 14px;
				letter-spacing: -1px;
				color: gray;
				p{
					display: inline-block;
				}
				.left{
					width: 90%;
				}
				.right{
					margin-top: 3px;
					float: right;
				}
			}
			.tags{
			    height: 17px;
			    line-height: 17px;
			    margin-top: 4px;
			    margin-bottom: 4px;
			    overflow: hidden;
			    font-size: 0;
			    >div{
				    display: inline-block;
				    padding: 0 3px;
				    margin: 0 2px;
				    height: 15px;
				    line-height: 15px;
				    border-radius: 2px;
				    font-size: .6rem;
				    border: 1px solid #589daf;
				    color: #589daf;
			    }
			    .snack,.vipTag{
			    	border: 1px solid #f90;
				    color: #f90;
			    }
			}
			.card{
				>*{
					display: inline-block;
					font-size: 12px;
				}
				p{
					vertical-align: text-top;
					margin-left: 2px;
					color: gray;
				}
			}
			.showTimes{
				font-size: 12px;
				color: gray;
			}
		}
		
	}
</style>