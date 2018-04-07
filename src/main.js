import "babel-polyfill";
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import axios from 'axios';
import store from './store';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
//import ElectronEvt from './libs/ElectronEvt';

Vue.use(VueRouter);
Vue.use(iView);
axios.defaults.baseURL = '/api';//'http://119.28.193.146/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.axios = axios;

// 路由配置
const RouterConfig = {
    //mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    //iView.LoadingBar.start();
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.app.token) {  // 通过vuex state获取当前的token是否存在
            Util.title(to.meta.title);
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else
        Util.title(to.meta.title);
        next();
});

router.afterEach((to, from, next) => {
    //iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    store.commit('removeToken');
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
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