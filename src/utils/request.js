import axios from 'axios'
import cfg from "../configs";

// https://segmentfault.com/q/1010000009530504 看这里

axios.defaults.baseURL = `${cfg.apiUrl}`

// 请求拦截器
axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem(cfg.constant.token);
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        // 在请求发送之前做一些处理
        config.headers['JWT'] = token
        return config;
    },
    error => Promise.reject(error)
);


// 响应拦截器
axios.interceptors.response.use(
    response => {
        const JSON = response.data
        return JSON
    },
    error => {
        return Promise.reject(error)
    }
)


export function request_get(url, param) {
    return axios.get(url + mapToParam(param))
        .then((res) => {
            return Promise.resolve(res.data)
        })
}


export function request_post(url, data) {

    return axios.post(url, data)
        .then((res) => Promise.resolve(res.data))
        .catch((err) => {
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


function mapToParam(map) {
    let idx = 0
    let param = ""
    let arr = Object.keys(map)
    let len = arr.length

    for (let k in map) {

        if (idx === len - 1) { // 拼接时，不包括最后一个&字符
            param += k
            param += "="
            param += map[k]
        } else {
            param += k
            param += "="
            param += map[k]
            param += "&"
        }
    }
    return param;
}
