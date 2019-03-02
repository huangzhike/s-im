import Vue from 'vue'

import App from './App'

import store from './store'
import router from './router'



import ElementUI from 'element-ui'


import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


let vue = new Vue({
    el: '#app',
    router,
    store,
    // template: '<App/>',
    // components: {App}
    render: h => h(App),
})

export default vue;
