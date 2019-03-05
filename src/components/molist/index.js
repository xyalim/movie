import MoList from './MoList.vue';

const molist = {
    install:function(Vue) {
        Vue.component('Molist', MoList)
    }
}

export default molist;