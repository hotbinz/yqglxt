import "babel-polyfill";
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
//import ElectronEvt from './libs/ElectronEvt';

Vue.use(VueRouter);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    //mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    //iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    //iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        this.currentPageName = this.$router.name;
    }
});
window.Hub = new Vue(); //创建事件中心
//ElectronEvt.registerListener();