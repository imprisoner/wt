<template>
  <div class="toast align-items-center">
    <div class="toast-header" :class="headerStyle">
      <strong class="me-auto">{{ headerText }}</strong>
      <i class="btn-close me-2 m-auto" :class="closeBtnStyle" @click="remove"></i>
    </div>
    <div class="toast-body">{{ item.message }}</div>
  </div>
</template>

<script>
export default {
  name: 'WToast',
  inheritAttrs: false,
  emits: ['remove'],
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    remove() {
      this.$emit('remove', this.item.id)
    }
  },
  computed: {
    headerStyle() {
      return {
        ['bg-' + this.item.type]: this.item.type,
        'text-white': ['primary', 'success', 'danger', 'info', 'dark'].includes(this.item.type)
      }
    },
    headerText() {
      switch (this.item.type) {
        case 'primary':
          return 'Оповещение';
        case 'success':
          return 'Успешно';
        case 'danger':
          return 'Ошибка';
        case 'warning':
          return 'Предупреждение';
        case 'info':
          return 'Информация'
      }
    },
    closeBtnStyle() {
      return {
        'btn-close-white': this.isWhite
      }
    },
    isWhite() {
      return ['primary', 'success', 'danger', 'info', 'dark'].includes(this.item.type)
    }
  },
  mounted() {
    if (this.item.dur) {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        this.remove()
      }, this.item.dur)
    }
  }
}
</script>

<style scoped>
.toast {
  display: block;
  /* position: absolute;
  bottom: 80px;
  left: calc(50vw - 175px); */
}
/* .toast-body {
  padding-right: 2rem;
} */
/* .btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0;
} */
</style>