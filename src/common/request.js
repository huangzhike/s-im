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
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token;
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            // config.headers['X-Token'] = token
        }
        return config;
    },
    error => Promise.reject(error)
);


// 响应拦截器
axios.interceptors.response.use(
    response => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const {code} = dataAxios
        // 根据 code 进行判断
        if (code === 200) {
            return dataAxios.data
        } else {
            const err = new Error(data.msg)
            err.data = data
            err.response = response
            throw err
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误'
                    break
                default:
                    break
            }
        }

        return Promise.reject(error)
    }
)


/**
 * [request_get 封装get请求]
 * @param  {[string]} url [请求地址]
 * @return {[object]}     [promise]
 */
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

    url= `${config.apiUrl}${url} `

    return axios.post(url, data)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}

/**
 * [request_put 封装put请求]
 * @param  {[string]} url  [请求地址]
 * @return {[object]}      [promise]
 */
export function request_put(url) {
    return axios.put(url)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}

/**
 * [request_delete 封装delete请求]
 * @param  {[string]} url  [请求地址]
 * @return {[object]}      [promise]
 */
export function request_delete(url) {
    return axios.delete(url)
        .then((res) => {
            return Promise.resolve(res.data)
        })
}
