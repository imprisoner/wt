import { createStore, storeKey } from "vuex";
import { getSessionData, fetchResourcesDetails, getTokenExpireDate } from '@/api/wialon'
// import { getSessionData, fetchResourcesDetails, getTokenExpireDate } from '@/mocks/mockapi'
import { UnitsData, ParentAccount, Toast } from '@/helpers/classes'
import { Storage } from '@/helpers/storage'
// module imports
import toast from './modules/toast'
import checkList from './modules/checkList'

const storage = new Storage('parent_accounts', [])

export default createStore({
  state: () => ({
    parentAccounts: null,
    wialonData: {},
    newCollection: {},
    wialonUnitsData: {},
    loader: {
      show: false,
      message: ''
    }
  }),
  actions: {
    async checkParentAccount({ state, dispatch, commit }, payload) {

      const storageValue = storage.getStorage()
      const inStorage = storageValue.find(item => item.name === payload.name)

      commit('setLoaderState', { show: true, message: 'Авторизация аккаунта в системе Wialon' })

      if (inStorage) {
        commit('setLoaderState', { show: false })
        commit('toast/NEW', { message: 'Такой аккаунт уже присутствует', type: 'info' })
        return null
      }

      let response

      try {
        response = await getTokenExpireDate(payload)
      } catch (error) {
        commit('toast/NEW', error)
        commit('setLoaderState', 'off')
        return null
      }

      const account = new ParentAccount(
        payload.name,
        payload.token,
        response.expires
      )

      storageValue.push(account)
      storage.setStorage(storageValue)
      commit('setParentAccounts')
      commit('setLoaderState', { show: false })
      return account

    },
    checkExistence({ state, commit }, payload) {
      // при повторной проверке, если аккаунты добавлялись после таблицы
      if(payload.error) {
        payload.error = null
      }
      
      let item

      if (state.wialonData[payload.account]) {

        item = state.wialonData[payload.account].find(item => {
          return item.nm === payload.name
        })
      } else {
        payload.error = 'noparent'
        return
      }

      if (!item) {
        console.log(payload)
        payload.error = 'nomatch'
        return
      }


      // напрямую меняет состояние!!!
      payload.id = item.id
      // напрямую меняет состояние!!!
    },
    async getWialonSessionData({ getters, commit, dispatch }, payload) {

      commit('setLoaderState', { show: true, message: 'Запрос данных сессии' })

      let error
      // mock function
      for (const account of payload) {
        let response
        try {
          response = await getSessionData(account.token)
        } catch (e) {
          commit('toast/NEW', { type: 'error', message: e.error })
          error = true
          break
        }

        if (!response.error) {
          commit('setWialonData', { name: account.name, list: response })
        } else {
          commit('toast/NEW', { message: response.error, type: 'error' })
          break
        }
      }

      commit('setLoaderState', { show: false })
      if (error) return false
      return true
    },

    async setNewCollectionData({ state, commit, getters }) {
      commit('setLoaderState', { show: true, message: 'Запрос детальной информации' })
      commit('sortAndValidateNewCollection', getters['checkList/checkList'])
      let data = new Set()
      let error
      for (const account of state.parentAccounts) {

        const idList = state.newCollection[account.name].map(resource => resource.id)
        try {
          data = await fetchResourcesDetails(account.token, idList)
        } catch (e) {
          commit('toast/NEW', { type: 'error', message: e.error })
          error = true
          break
        }
        // mock function
        // data = await fetchResourcesDetails(account.name)

        commit('setNewCollectionData', { account: account.name, data })
      }
      if (error) {
        commit('setLoaderState', { show: false })
        return false
      }
      commit('spreadUnitsDataByResource')
      commit('setLoaderState', { show: false })
      return true
    },
  },
  mutations: {
    setParentAccounts(state) {
      const accounts = storage.getStorage()

      state.parentAccounts = accounts
    },
    setWialonData(state, payload) {
      state.wialonData[payload.name] = payload.list
      console.log('wialon data has been set to state')
    },
    setNewCollectionData(state, payload) {
      state.wialonUnitsData[payload.account] = payload.data
    },

    sortAndValidateNewCollection(state, newCollection) {
      state.parentAccounts.forEach(account => {
        newCollection.forEach((resource, i) => {
          if (resource.id === null) resource.position = -1
          resource.position = i
        })

        state.parentAccounts.forEach(account => {
          state.newCollection[account.name] = newCollection.filter(item => {
            if (item.id === null) return false
            return item.account === account.name
          })
        });
      });
    },
    spreadUnitsDataByResource(state) {
      for (const account of state.parentAccounts) {
        state.newCollection[account.name].forEach(resource => {
            
            const current = state.wialonUnitsData[account.name][resource.id]
            if (current) {
              const units = current.services['avl_unit']
              const activeUnits = current.services['activated_units']
              
              resource.units = new UnitsData(units, activeUnits)
            } else {
              resource.error = 'Нет данных по объектам от Wialon'
            }
         
        })
      }
    },
    setLoaderState(state, payload) {
      state.loader = payload
    }
  },
  getters: {
    parentAccounts: state => state.parentAccounts,
    wialonData: state => state.wialonData,
    newCollection: state => state.newCollection,
    wialonUnitsData: state => state.wialonUnitsData,
    renderList: state => Object.values(state.newCollection).flat().sort((a, b) => a.position - b.position),
    hasAccounts: state => state.parentAccounts.length,
    hasSessionData: state => Object.keys(state.wialonData).length === state.parentAccounts.length,
    hasCollection: state => Object.keys(state.newCollection).length,
    loader: state => state.loader
  },
  modules: {
    toast, checkList
  }
})