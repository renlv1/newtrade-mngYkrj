import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '@/api/api'
import route from './router'

Vue.use(Vuex)
/*eslint-disable*/
export default new Vuex.Store({
  state: {
	  isLogin: false,
    loginFlag: false,
    drawOrder: 0,
    user: {},
    tempArr: [],
    historyRecord: {},
    ledgerObj: {},
    showLoading: false,
    navList: [],
    navActiveIndex: 0,
    addOreditFlag: '',
    editId: '',
    treeList: [],
	  bankList: [],
	  bossList: [],
    navArr: {},
    delList: [],
    headArr: [],
    route: '',
    menuShow: false,
    forbidS: false,
    screeningShow: false,
    navIndex: -1,
    helpMenu: []
  },
  mutations: {
	  SET_IS_LOGIN (state,data) {
		  state.isLogin = data
	  },
    SET_LEDGER (state, data) {
      state.ledgerObj = data
    },
    SET_LOGIN_FLAG(state,data) {
      state.loginFlag = data
    },
	  SET_BOSSLIST (state, data) {
			state.bossList = data
		},
  	SET_BANKLIST (state, data) {
		  state.bankList = data
	  },
    SET_TEMPARR(state, data) {
      state.tempArr = data
    },
    SET_DRAW(state, data) {
      state.drawOrder = data
    },
    SET_ACCOUNT(state,data){
      state.user = data
    },
    SET_DELLIST(state, data) {
      state.delList = data
    },
    CLEAR_ACCOUNT(state) {
      state.user = {}
    },
    SET_LIST_RECORD(state, data) {
      state.historyRecord = data
    },
    SET_LOADING(state, data) {
      state.showLoading = data
    },
    SET_NAV_LIST(state, data) {
      state.navList = data
    },
    SET_NAV_ACTIVE(state, data) {
      state.navActiveIndex = data
    },
    SET_NAV_ARR (state, data) {
      state.navArr = data
    },
    SET_PATH (state, data) {
      state.route = data
    },
    SET_MENU (state,data) {
      state.menuShow = data
    },
    SET_SCREENING (state,data) {
      state.screeningShow = data
    },
    SET_EDIT_FLAG(state, data) {
      state.addOreditFlag = data
    },
    SET_EDITID(state, data) {
      state.editId = data
    },
    SET_TREE_LIST(state, data) {
      state.treeList = data
    },
    SET_FORBID_FLAG(state, data) {
      state.forbidS = data
    },
    SET_HELP_MENU (state, data) {
      state.helpMenu = data
    }
  },
  actions: {
    // getDrawOrder({commit}) {
    //   fetch.post(`/finance/draw/drawAuditRecord`, {
	  //     userName: localStorage.getItem('userName')
    //   }).then(res => {
    //     commit('SET_DRAW', res.data.drawOrder)
    //   }).catch(err => {
    //     route.push('/login')
    //   })
    // },
    // 获取用户信息
    getUserInfo({commit}) {
      fetch.get(`/sys/user/info`).then(res => {
        commit('SET_ACCOUNT', res.data.user)
        if (window.location.hash.indexOf('login') > -1) {
          route.push('/blank')
        }
      }).catch(err => {
        route.push('/login')
      })
    },
    // 获取导航列表
    getNavList({commit}) {
      fetch.post('/sys/menu/nav').then(res => {
        commit('SET_NAV_LIST', res.data.menuList)
	      if (window.location.hash.indexOf('/login') > -1) {
		      route.push('/blank')
	      }
      }).catch(() => {
	      route.push('/login')
      })
    },
    getHelpMenu({commit}) {
      fetch.post('/system/menu/queryMenuList', {
        status: 1
      }).then(res => {
        const list = res.data.page.list || []
        if (!list.length) return
        const menu = list.filter(item => !item.parentId)
        list.forEach(item => {
          let menuItem = menu.find(_item => _item.id === item.parentId)
          if (menuItem) {
            if (menuItem.child) {
              menuItem.child.push(item)
            } else {
              menuItem.child = [item]
            }
          }
        })
        commit('SET_HELP_MENU', menu)
      }).catch(() => {
	      route.push('/login')
      })
    }
  }
})
