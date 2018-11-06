import axios from 'axios'
import config from "../configs";

// https://segmentfault.com/q/1010000009530504 看这里

axios.defaults.baseURL = 'http://localhost:8080'

// 请求拦截器
axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('userToken');
        // 在请求发送之前做一些处理
        if (token) {
            config.headers.common['Authorization'] = 'Bearer ' + token;
            // config.headers['X-Token'] = token
        }
        return config;
    },
    error => Promise.reject(error)
);


// 响应拦截器
axios.interceptors.response.use(
    response => {
        const JSON = response.data
        const {code, data} = JSON
        if (code === 200) {
            return data
        } else {
            throw new Error(data.msg)
        }
    },
    error => {
        return Promise.reject(error)
    }
)


export function request_get(url) {
    return axios.get(url)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}

/**
 * [request_post 封装post请求]
 * @param  {[string]} url  [请求地址]
 * @param  {[object]} data [数据]
 * @return {[object]}      [promise]
 */
export function request_post(url, data) {

    url = `${config.apiUrl}${url} `

    return axios.post(url, data)
        .then((res) => Promise.resolve(res.data)).catch((err) => {
        })
}


export function request_put(url) {
    return axios.put(url)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}


export function request_delete(url) {
    return axios.delete(url)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}
