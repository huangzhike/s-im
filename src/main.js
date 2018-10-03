import Vue from 'vue'

import App from './App'
import './common/rem';
import store from './store'
import router from './router'

import axios from 'axios'

import Vant from 'vant';
import 'vant/lib/vant-css/index.css';

Vue.use(Vant);


// axios.defaults.baseURL = 'http://localhost:8080'
// axios.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('userToken');
//         if (token) {
//             // Bearer是JWT的认证头部信息
//             config.headers.common['Authorization'] = 'Bearer ' + token;
//         }
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );


new Vue({
    el: '#app',
    router,
    store,
    // template: '<App/>',
    // components: {App}
    render: h => h(App),
})
