<template>
    <ul>
        <li v-for="movies in movieList" :key='movies.id' @click="reData(movies.id)">
            <img v-lazy="myTools.picFix(movies.img)" alt="" class='moviesimg'/>
            <div class="details">
                <h5>
                    <div class="htitle">{{movies.nm}}</div>
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
                <p v-if="type=='playing'">{{movies.showInfo}}</p>
                <p v-if="type=='comming'">{{movies.rt}}上映</p>
                <p v-if="type=='search'">{{movies.pubDesc}}</p>
                <p class="btn" v-if="type=='playing' && movies.globalReleased">详情</p>
                <p class="btny" v-if="type=='playing' && !movies.globalReleased">预售</p>
                <p class="btn" v-if="type=='comming' && movies.showst == 1" style="background-color: #faaf00;">详情</p>
                <p class="btny" v-if="type=='comming' && movies.showst == 4">预售</p>
            </div>
            <div style="margin-top:10px;"></div>
        </li>
        
    </ul>
</template>
<script>
export default {
    props:{
        movieList:{
            type:Array,
            default:[]
        },
        type:String
    },
    created(){

    },
    data(){
        return{

        }
    },
    methods:{
  		//返回相关参数
  		reData(data){
  			this.$emit("type",data)
  		}
	}
    
}
</script>
<style lang="scss" scoped>
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
    vertical-align: super;
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
    margin-top: 3px;
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
</style>
