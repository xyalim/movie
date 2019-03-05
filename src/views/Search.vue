<template>
	<div class="search">
        <div class='search-top'>
            <div>
                <input type="text" v-model='searchMsg' placeholder="搜索">
                <p @click="toSearch()">GO</p>
            </div>
        </div>
        
        <div class="search-main">
            <div v-if='history'>
                <div class="search-history" v-for='(item,index) in kw' :key="index" >
                    <div class="history-left">
                        <img src="../assets/history.png" alt="">
                    </div>
                    <div class="history-kw" @click="meHistory(index)">{{item}}</div>
                    <div class="history-right" @click="meDel(index)">
                        <img src="../assets/del.png" alt="">
                    </div>
                </div>
            </div>
            <div style="height:1px;"></div>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
                <molist v-if="moviesList" :movieList="moviesList" v-on:type="toMovie" type='search'></molist>
            </div>
            <!-- <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading">
                <li v-for="movies in moviesList" :key='movies.id' @click="toMovie(movies.id)">
                    <img v-lazy="myTools.picFix(movies.img)" alt="" class='moviesimg'/>
                    <div class="details">
                        <h5>{{movies.nm}}
                            <div class="nmtag" v-show="movies.version=='v3d imax'">
                                <p class="tagleft">3D</p>
                                <p class="tagright">IMAX</p>
                            </div>
                            <div class="nmtag" v-show="movies.version=='v2d imax'">
                                <p class="tagleft">2D</p>
                                <p class="tagright">IMAX</p>
                            </div>
                            <div class="nmtag" v-show="movies.version=='v3d'">
                                <p class="tagleft">3D</p>
                            </div>
                        </h5>
                        
                        <p v-show="movies.globalReleased">
                            <span v-if="movies.sc != 0">观众评&nbsp;<i>{{movies.sc}}</i></span>
                            <span v-if="movies.sc == 0">暂无评分</span>
                        </p>
                        <p v-show="!movies.globalReleased"><span><i>{{movies.wish}}</i>&nbsp;</span>人想看</p>
                        <p v-if="movies.star != null">主演：<span class="star">{{movies.star}}</span></p>
                        <p>{{movies.pubDesc}}</p>
                        <p class="btn" v-show="movies.globalReleased">购票</p>
                        <p class="btny" v-show="!movies.globalReleased">预售</p>
                    </div>
                    
                </li>
                
            </ul> -->
        </div>
    </div>
</template>

<script>
//加载插件
import { Indicator } from 'mint-ui';
//弹出框插件
import { MessageBox } from 'mint-ui';
export default {
    created(){
        this.cityId = this.$store.state.cityId;//获取城市ID

        var local = localStorage.getItem('movieHistory');
        local = JSON.parse(local);
        if(local){  // 如果有搜索记录缓存
            this.kw = local;
        };
        // console.log(this.kw)

        //提交修改
        this.$store.commit('changeHT','搜索');
        
        //修改title
        var tit = document.getElementsByTagName('title')[0];
        tit.innerText='搜索';
    },
    data(){
        return{
            moviesList:[],//列表存放
            searchMsg:'',//keyword
            cityId :'',//城市id
            reqOffset:'',//请求偏移量
            reqLimit:20,//请求返回量
            loading:false,//加载开关
            kw:[],//历史记录保存
            history:true,//历史搜索开关
        }
    },
    methods:{
        //搜索首次加载请求
        getFlist(){
            if (this.kw.indexOf(this.searchMsg) == -1) {
                this.kw.unshift(this.searchMsg);
                var val = JSON.stringify( this.kw );
                localStorage.setItem('movieHistory',val);
            }
            this.axios2.get('/search',{
                params:{
                    kw: this.searchMsg,
                    cityId: this.cityId,
                    stype: -1,      
                }
            }).then((res)=>{
                // console.log(res.data.movies.list)
                this.moviesList = res.data.movies.list;
                if (this.moviesList.length !== 0) {
                    //加载更多
                    this.getlist();
                }
            });
            
        },
        //加载更多
        getlist(){
            this.reqOffset = this.moviesList.length;
            // console.log('Offset:',this.reqOffset)
            this.axios2.get('/searchList',{
                params:{
                    keyword:this.searchMsg,
                    ci:this.cityId,
                    offset:this.reqOffset,
                    limit:this.reqLimit
                }
            }).then((res)=>{//res.data.movies
                // console.log(res)
                Indicator.close();
                this.loading = false;
                if (res.data.total==0) {
                    this.loading = true;
                    MessageBox.alert('已经到底啦！','提示');
                    return;
                }
                this.moviesList=this.moviesList.concat(res.data.movies);
                // console.log(this.moviesList)
            });
        },
        //到底加载
  		loadMore(){
  			if (this.moviesList.length == 0) {
  				return false;
  			}
              this.loading = true;
              Indicator.open('加载中...');
              this.getlist();
        },
        //搜索按钮
        toSearch(){
            this.history = false;
            this.moviesList = [];
            this.getFlist()
        },
        //跳转电影详情页
        toMovie(id){
  			this.$router.push({path:`/movieDetail/${id}?movieId=${id}`})
        },
        //点击历史记录执行搜索
        meHistory(index){
            // console.log(this.kw[index]);
            this.searchMsg = this.kw[index];
            this.toSearch();
        },
        //删除单条历史记录
        meDel(index){
           this.kw.splice(index,1);
        //    console.log(this.kw);
           var val = JSON.stringify( this.kw );
           localStorage.setItem('movieHistory',val);
        }
    }
}
</script>

<style scoped lang="scss">
	.search{
        background: #F5F5F5;
        //搜索顶部
        .search-top{
            position: fixed;
            top: 40px;
            left: 0;
            padding: 8px 0;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e5e5e5;
            width: 100%;
            z-index: 9;
            >div{
                padding: 0 0 0 10px;
                margin: 0 10px;
                border: 1px solid #e6e6e6;
                border-radius: 5px;
                background-color: #fff;
                input{
                    border: none;
                    font-size: 13px;
                    color: #333;
                    line-height: 20px;
                    padding: 4px 0;
                    width: calc(100% - 40px);
                }
                p{
                    font-size: 13px;
                    width: 39px;
                    display: inline-block;
                    line-height: 30px;
                    text-align: center;
                    border-left: 1px solid #e6e6e6;
                }
            }
            
        }
        
        //内容部分样式
        .search-main{
            margin-top: 50px;
            z-index: 1;
            // 历史搜索
            .search-history{
                height: 50px;
                border-bottom: 1px solid gainsboro;
                position: relative;
                &>div{
                    display: inline-block;
                    position: absolute;
                }
                .history-left{
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    img{
                        width: 100%;
                    }
                }
                .history-kw{
                    width: 72%;
                    line-height: 48px;
                    font-size: 16px;
                    top: 50%;
                    left:45px;
                    transform: translateY(-50%);
                }
                .history-right{
                    width: 40px;
                    height: 40px;
                    text-align: center;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    img{
                        width: 24px;
                        margin-top: 8px;
                    }
                }
            }
            ul{
                margin: 10px 0;
                list-style: none;
                min-width: 320px;
            }
            li{
                position: relative;
                margin-bottom: 10px;
                width: calc(100% - 10px);
                border-bottom: 1px solid gainsboro;
                padding-left: 10px;
            }
            .moviesimg{
                margin-top: 5px;
                display: inline-block;
                width: 64px;
                height: 90px;
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
                margin-top: 5px;
                width: 100%;
                display: inline-block;
                .htitle{
                    font-size: 17px;
                    margin-top: 5px;	
                    display: inline-block;
                    max-width: 65%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    margin-right: 5px;
                }
            }
            .nmtag{
                p{
                    font-size: 12px;
                    color: white;
                    display: inline-block;
                    margin: 0;
                    padding: 0 1px;
                    line-height: 14px;
                }
                display: inline-block;
                border: 0.5px solid #3c9fe6;
                border-radius: 2px;
                vertical-align: bottom;
                height: 14px;
                font-size: 12px;
                .tagleft{
                    background-color: #3c9fe6;
                    border-radius: 1px 0 0 1px;
                }
                .tagright{
                    color: #3c9fe6;
                }
            }
            p{
                margin-top: 5px;
                color: #666;
                font-size: 13px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .star{
                color: #666;
            }
            .btn,.btny{
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
                top: 50%;
                transform: translateY(-50%);
            }
            .btny{
                background-color: #3c9fe6;
            }
            i{
                font-style:normal;
                color: #faaf00;
            }
        }
    }
</style>