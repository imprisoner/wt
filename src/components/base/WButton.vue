<template>
  <div v-if="icon" class="btn" :class="style">
    <slot></slot>
    <i :class="`bi-${icon}`"></i>
  </div>
  <button v-else class="btn d-block" :class="style" type="submit">
    <slot></slot>
  </button>
</template>

<script functional>
export default {
  name: 'WButton',
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary',
      validator(value) {
        const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        return colors.includes(value)
      }
    },
    icon: {
      type: [String, Boolean],
      default: false
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
        ['btn-outline-' + this.color]: this.outlined,
        ['btn-' + this.color]: !this.outlined
      }
    }
  }
}
</script>