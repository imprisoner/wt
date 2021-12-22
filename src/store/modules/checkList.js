export default {
  namespaced: true,
  state: () => ({
    list: []
  }),
  mutations: {
    addNewItem({list}, payload) {
      list.push(payload.resource)
    }, 
    editItem({list}, payload) {
      console.log(payload)
      const listPosition = list.findIndex(item => item.position === payload.position)
      list[listPosition] = payload.resource
    },
    deleteItem({list}, payload) {
      console.log(payload)
      const listPosition = list.findIndex(item => item.position === payload.position)
      list.splice(listPosition, 1)
    },
    clearList(state) {
      console.log('clearing list: ', state.list)
      state.list = []
      console.log('after clearing', state.list)
    }
  },
  getters: {
    checkList: ({ list }) => list,
    nullId: ({list}) => list.filter(item => item.id === null),
    unmatched: ({ list }, getters, rootState) => list.filter(item => rootState.parentAccounts.some(acc => item.account === acc.name) && !item.id),
    unknown: ({ list }, getters, rootState) =>   list.filter(item => !rootState.parentAccounts.some(acc => item.account === acc.name)),
  }
}