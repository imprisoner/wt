<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      :class="labelStyle"
      title="Это поле обязательно для заполнения"
    >
      {{ label }}
      <b v-if="required">*</b>
    </label>
    <input
      class="form-control"
      :class="validClass"
      type="text"
      :id="inputId"
      v-model.trim="value"
      ref="input"
      @blur.lazy="validate($event.target.value)"
      @change.lazy="validate($event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'WTextfield',
  emits: ['update:modelValue', 'blur'],
  inject: ['form'],
  props: {
    modelValue: String,
    inputId: String,
    label: String,
    labelClass: String,
    minlength: Number,
    maxlength: Number,
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: null
    }
  },
  methods: {
    validate(value) {
      const errors = []
      if (this.required) {
        this.value.length < 1 ? errors.push(false) : null 
      }
      if (this.minlength) {
        this.value.length < this.minlength ? errors.push(false) : null
      }
      if (this.maxlength) {
        this.value.length > this.maxlength ? errors.push(false) : null
      }
      
      this.valid = errors.every(item => item)
    },
    focus() {
      this.$refs.input.focus()
    },
    reset() {
      this.value = ''
      this.valid = null
    }
  },
  computed: {
    validClass() {
      return this.valid === true ? 'is-valid' : this.valid === false ? 'is-invalid' : null
    },
     labelStyle() {
      return this.labelClass ? this.labelClass : 'form-label'
    },
    value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  created() {
    if (this.form)
      this.form.register(this)
  }
}
</script>