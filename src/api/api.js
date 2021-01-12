import axios from 'axios'
import qs from 'qs'
import store from '../store';
import { Message } from 'element-ui'
import router from '../router';

let ax = axios.create({
  withCredentials: true, // 允许cookie
  baseURL: process.env.VUE_APP_BASE_PATH, // 接口地址
})

/*eslint-disable*/
// 添加响应拦截器
ax.interceptors.response.use(res => {
  // 关掉loading
  store.commit('SET_LOADING', false)
	if (res.data.code || res.data.code === 0) {
		if (res.data.code === 202) {
			// 未登录状态
			store.commit('CLEAR_ACCOUNT')
			router.push('/login')
		} else if (res.data.code !== 0) {
			// 接口返回异常
			Message.error(res.data.msg)
			throw res.data
			if (err.code === 1005) {
				return res
			}
		} else {
			return res
		}
	} else {
		if (res.data.code === 202) {
			// 未登录状态
			store.commit('CLEAR_ACCOUNT')
			router.push('/login')
		}
		return res
	}

})

export default {
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        url,
        method: 'get',
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: (url, params) => {
    if (params && params.loading) {
      store.commit('SET_LOADING', params.loading)
      delete params.loading
    }

    // 删除参数值为空的参数
    for (let i in params) {
      if(params[i] === '') {
        delete params[i]
      }
    }

    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post2: (url, params, cancelToken) => { // 可以取消的请求
    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params),
        cancelToken
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
	postArr2: (url, params) => {
		return new Promise((resolve, reject) => {
			ax({
				method: 'post',
				url,
				data: params
			}).then(res => {
				resolve(res.data)
			}).catch(err => {
				reject(err)
			})
		})
	},
	postArr: (url, params) => {
		if (params && params.loading) {
			store.commit('SET_LOADING', params.loading)
			delete params.loading
		}

		// 删除参数值为空的参数
		for (let i in params) {
			if(params[i] === '') {
				delete params[i]
			}
		}

		return new Promise((resolve, reject) => {
			ax({
				method: 'post',
				url,
				data: params,
				paramsSerializer: function(params) {
					return qs.stringify(params, {arrayFormat: 'repeat'})
				}
			}).then(res => {
				resolve(res.data)
			}).catch(err => {
				reject(err)
			})
		})
	},
  postFormdata: (url, params) => {
    return new Promise((resolve, reject) => {
      ax.post(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
