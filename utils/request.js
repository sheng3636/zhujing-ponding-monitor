import axios from 'axios'
import {
  ElMessage
} from 'element-plus'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // url = base url + request url
  // baseURL: 'http://139.226.71.181:8089/prod-api/', // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 1000 * 30 // 请求超时
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 如果您想获得http信息， 如头或状态
   * 请返回response => response
   */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 您还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data

    // 如果自定义代码不是0，则判断为错误。
    if (res.code !== 0) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

// 查询接口请求方法
export const apiGet = (url, {
  params = {},
  headers = {}
} = {}) => {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params,
      headers: headers
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// post充当get接口请求方法
export const apiGetPost = (url, {
  data = {},
  headers = {}
} = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url: url,
      data: data,
      headers: headers
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export default service