<template>
  <div id="app">
  	<mt-header fixed :title="headerTitle" style="background-color: #f03d37;">
		    <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
				<mt-button icon="more" slot="right" @click.native="tohome()"></mt-button>
  	</mt-header>
    <router-view/>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
	export default {
		created(){
			var newStyles = document.createElement('style');
			newStyles.setAttribute('id','sty');
			document.head.appendChild(newStyles);
		},
		data(){
			return {

			}
		},
		computed:{
			headerTitle(){//数据依赖更新是，计算属性重新触发更新
				return this.$store.state.headerTitle
			}
		},
		methods:{
			tohome(){
				MessageBox.confirm('', { 
					 message: '返回首页？', 
					 title: '提示', 
					 confirmButtonText: '确定', 
					 cancelButtonText: '取消' 
				}).then(action => { 
						 if (action == 'confirm') {     //确认的回调
						 	 this.$router.push({path:"/home/playing"})
						 }
				}).catch(err => { 
						 if (err == 'cancel') {     //取消的回调
						 	console.log('cancel');
						 }
				});
			}
		}
	}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 40px;
  .mint-header.is-fixed {
	    z-index: 10!important;
	}
	image[lazy=loading] {
	  width: 100%;
	  height: 100%;
	  margin: auto;
	}
}
#nav {
	text-align: center;
  div{
		display: inline-block;
	}
  a {
    font-weight: bold;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    &.router-link-active {
      color: #f03d37;
    }
  }
}
</style>
