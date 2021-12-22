<template>
  <div class="btn btn-floating"
  :class="style"
  >
    <i :class="'bi-' + icon"></i>
  </div>
</template>

<script functional>
export default {
  name: 'FloatingButton',
  props: {
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '',
      validator(value) {
        const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        return colors.includes(value)
      }
    },
    gradient: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      return {
        'bg-gradient': this.gradient,
        ['btn-' + this.color]: true
      }
    }
  }
}
</script>

<style scoped>
.btn-floating {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 28px;
  box-shadow: 5px 5px 30px #000;
}
</style>