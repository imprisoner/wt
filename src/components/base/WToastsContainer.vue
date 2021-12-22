<template>
  <transition-group name="list" tag="div" class="toast-container position-fixed bottom-0 end-0 p-3">
    <w-toast
    v-for="toast in toasts"
    :key="toast.id"
    :item="toast"
    @remove="removeToast(toast.id)"
    ></w-toast>
  </transition-group>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import WToast from '@/components/base/WToast.vue'
export default {
  name: 'WToastsContainer',
  components: {
    WToast
  },
  methods: {
    ...mapMutations({
      removeToast: 'toast/REMOVE'
    }),
  },
  computed: {
    ...mapGetters({
      toasts: 'toast/toastsContainer'
    })
  }
}
</script>