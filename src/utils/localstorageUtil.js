/* 操作用户数据到本地方法 */
import store from 'store'

export default {

  /*保存用户数据 */
  saveUserdata (user){
    store.set('userkey', user)
  },
  /* 获取用户数据 */
  getUserdata () {
    return store.get('userkey') || {}
  },
  /* 删除用户数据 */
  deleteUserdat (userkey) {
    store.remove('userkey')
  }
}



