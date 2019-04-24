//plugins 
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import PortalVue from 'portal-vue'
//componets
import App from './App.vue'
import Dashboard from './components/Dashboard.vue'
import Home from './components/Home.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Mypage from './views/user/Mypage.vue'
import Balance from './views/user/Balance.vue'
//store
//import {store} from './store/Index.js';
Vue.use(PortalVue);
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);

axios.defaults.baseURL = 'http://localhost:8000/api';

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'home',
        component: Home

    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {

            auth: false
        }
    },
    {
        path: '/balance',
        name: 'balance',
        component: Balance,
        meta: {

            auth: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            auth: false
        }
    },
    {
        path: '/mypage:id',
        name: 'Mypage',
        component: Mypage,
        meta: {
            auth: false
        }
    },
        {
        path: '/*',
        name: 'login',
        component: Login,
        meta: {
            auth: false
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            auth: true
        }
    }]
});

Vue.router = router
Vue.use(require('@websanova/vue-auth'), {
   auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
   http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
});
App.router = Vue.router

new Vue(App).$mount('#app');
