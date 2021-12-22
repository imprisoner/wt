import {Toast } from '@/helpers/classes'

export default {
  namespaced: true,
  state: () => ({
    toastsContainer: []
  }),
  mutations: {
    NEW (state, payload) {
      // console.log(payload)
      const message = typeof payload === 'string' ? payload : payload.message
      const type = payload.type || null

      if(type === 'error') {
        console.error(message)
      }
      state.toastsContainer.push(new Toast(message, type))
    },
    REMOVE (state, payload) {
      state.toastsContainer = state.toastsContainer.filter(toast => toast.id !== payload)
    },
    CLEAR_CONTAINER (state) {
      state.toastsContainer = []
    }
  },
  getters: {
    toastsContainer: state => state.toastsContainer
  }
}