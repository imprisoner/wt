import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/my-account",
    name: "MyAccount",
    meta: {
      heading: 'Мой аккаунт'
    },
    component: () => import("../views/MyAccount.vue")
  },
  {
    path: "/tables",
    name: "Tables",
    meta: {
      heading: 'Данные по УЗ'
    },
    component: () => import("../views/Tables.vue")
  },
  {
    path: "/manager",
    alias: "/",
    name: "Manager",
    meta: {
      heading: 'Менеджер УЗ'
    },
    component: () => import("@/views/Manager.vue")
  },
  {
    path: '/:notFound(.*)',
    name: "NotFound",
    component: () => import("@/views/NotFound.vue")
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import("@/views/Test.vue")
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})


router.beforeEach(async (to, from, next) => {
  const hasAccounts = store.getters.hasAccounts
  const hasSessionData = store.getters.hasSessionData
  const hasCollection = store.getters.hasCollection

  if (to.name !== 'Test') {
    if (!hasAccounts && to.name !== 'MyAccount') {
      store.commit('toast/NEW', { type: 'primary', message: 'Зарегистрируйте аккаунты Wialon для работы' })
      next({ name: 'MyAccount' })
    }
    else if (!hasSessionData) {
      await store.dispatch('getWialonSessionData', store.state.parentAccounts)

      if (to.name === 'Tables') {
        store.commit('toast/NEW', { type: 'info', message: 'Добавьте список учётных записей и запросите данные, чтобы продолжить работу' })
        next({ name: 'Manager' })
      } else next()

    }
    else if (!hasCollection && to.name === 'Tables') {
      store.commit('toast/NEW', { type: 'info', message: 'Добавьте список учётных записей и запросите данные, чтобы продолжить работу' })
      next({ name: 'Manager' })
    }
    else next()
  } else next()
})
export default router