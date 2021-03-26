import {render} from 'react-dom'
import App from './app' //引入根组件
import memorydata from './utils/memmoryutil' // 本地用户数据仓库 
import localUtils from './utils/localstorageUtil' // 操作本地存储用户数据方法

const user = localUtils.getUserdata()
if(user && user._id) {
  memorydata.user = user
}

render(<App/>, document.getElementById('root'))