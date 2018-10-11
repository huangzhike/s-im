import Vue from 'vue'

import App from './App'

import store from './store'
import router from './router'

import './common/rem';

import Vant from 'vant';
import 'vant/lib/vant-css/index.css';

Vue.use(Vant);

new Vue({
    el: '#app',
    router,
    store,
    // template: '<App/>',
    // components: {App}
    render: h => h(App),
})
