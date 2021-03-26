/* 发送ajax异步请求模块， 是对axios进行二次封装的模块 */
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, method = 'get') {
  // 设置请求头
  const baseurl = 'http://120.55.193.14:5000'
  const finalurl = baseurl + url
  // 返回一个promise对象
  return new Promise((reslove, reject)=>{
    // 发送axios请求
    let promise 
    // 判断请求类型
    if(method === 'get') {
      promise = axios.get(finalurl, { params: data})
    }else {
      promise = axios.post(finalurl, data)
    }
    // 对返回promise进行调用
    promise.then(
      // 成功返回结果
      response => {
        reslove(response.data)
      }
    ).catch(
      // 失败则返回错误信息
      error => { 
        message.error("请求出错"+ error.message)
      }
    )
  })
}