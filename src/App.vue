<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/logo.png" width="50" height="50" />
        Wialon-Tables
      </a>
      <h3>{{ $route.meta.heading }}</h3>
      <ul class="navbar-nav mb-2 mb-lg-0">
        <router-link class="nav-link" to="/my-account">Аккаунты</router-link>
        <router-link class="nav-link" to="/manager">Менеджер</router-link>
        <router-link class="nav-link" to="/tables">Данные</router-link>
        <router-link class="nav-link" to="/test">Тестовая</router-link>
      </ul>
    </div>
  </header>
  <main class="page-wrapper">
    <div class="container-fluid">
      <div></div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path"></component>
        </transition>
      </router-view>
    </div>
    <teleport to="body">
      <w-loader-screen :show="loader.show" :message="loader.message"/>
      <w-toasts-container></w-toasts-container>
    </teleport>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import WLoaderScreen from '@/components/base/WLoaderScreen.vue'
import WToastsContainer from '@/components/base/WToastsContainer.vue'

// vuex
const store = useStore()
const loader = computed(() => store.getters.loader)

store.commit('setParentAccounts')
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.page-wrapper {
  position: relative;
  height: calc(100vh - 76px);
  overflow: hidden;
  padding: 50px 0;
}
</style>
