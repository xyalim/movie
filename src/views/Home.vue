<template>
  <div class="home">
  	
  	<div class="homeNav">
  		
  		<div class="navsel" @click="toCity">{{citynm}} <p></p></div>
  		
  		<div class="link" @click="isActive=true">
  			<div :class="{active:isActive}">
  				<p @click='one'>正在热映</p>
  			</div>
  		</div>
  		
  		<div class="link" @click="isActive=false">
  			<div :class="{active:!isActive}">
  				<p @click='two'>即将上映</p>
  			</div>
  		</div>

			<div class="navsearch" @click="toSearch">
  			<img src="../assets/search.png"/>
  		</div>
  		
  	</div>
  	
  	<router-view/>
	  
  </div>
</template>

<script>

export default {
  name: 'home',
  created(){
		if(this.$route.path == "/home/comming"){
			this.isActive = false;
		}else{
			this.isActive = true;
		}
  },
  computed:{
		citynm(){//数据依赖更新是，计算属性重新触发更新
			return this.$store.state.citynm
		}
	},
  data(){
  	return{
  		isActive:true,
  	}
  },
  methods:{
		one(){
			this.$router.push({path:"/home/playing"})
		},
		two(){
			this.$router.push({path:"/home/comming"})
		},
  	toCity(){
  			this.$router.push({name:"city"})
			},
		toSearch(){
			this.$router.push({name:"search"})
		}
	},
	watch:{
		$route(){
			if(this.$route.path == "/home/comming"){
				this.isActive = false;
			}else{
				this.isActive = true;
			}
		}
	}
}
</script>

<style scoped lang="scss">
	.homeNav{
		height: 44px;
		border-bottom: 1px solid gainsboro;
		display: flex;
		.navsel{
			width:20%;
			text-align: center;
			display: inline-block;
			line-height: 44px;
			position: relative;
			p{
		    border: 5px solid;
		    border-left-color: transparent;
		    border-right-color: transparent;
		    border-bottom-color: transparent;
		    position: absolute;
		    right: 0;
		    top: 50%;
		    transform: translateY(-50%);
			}
		}

		.navsearch{
			width:16%;
			height: 44px;
			text-align: center;
			display: inline-block;
			line-height: 44px;
			position: relative;
			img{
				width: 30px;
    		padding-top: 7px;
			}
		}

		.link{
			display: inline-block;
			width: 32%;
			>div{
					text-align: center;
					width: 65%;
				 	font-size: 16px;
			    color: #666;
			    margin: 0 auto;
			    font-weight: bold;
			    line-height: 44px;
			}
		}
		.active{
			border-bottom: 2px solid #f03d37;
			p{
				color: #f03d37;
			}
		}
		
	}
	
	
</style>
