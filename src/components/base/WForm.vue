<template>
  <form @submit.prevent="onSubmit">
    <slot name="title"></slot>
    <slot></slot>
    <fieldset>
      <slot name="fieldset"></slot>
    </fieldset>
    <slot name="buttons"></slot>
    <slot name="footer"></slot>
  </form>
</template>

<script>
export default {
  name: 'WForm',
  provide() {
    return { form: this }
  },
  emits: ['update:modelValue', 'submit'],
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      inputs: []
    }
  },
  methods: {
    register(input) {
      this.inputs.push(input)
    },
    reset() {
      this.inputs.forEach(input => input.reset())
    },
    onSubmit(e) {
      this.inputs.forEach(input => { input.validate() })
      this.value = this.inputs.filter(input => !input.valid).length === 0
      this.$nextTick(() => {
        if (this.value) {
          this.$emit('submit', e)
          this.reset()
          this.value = false
        } else return
      })

    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  }
}
</script>