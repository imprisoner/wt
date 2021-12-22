<template>
  <div>
    <label :for="inputId" :class="labelStyle">
      {{ label }}
      <b v-if="required">*</b>
    </label>
    <select
      class="form-select"
      :id="inputId"
      v-model="value"
      ref="select"
      @blur="validate"
      @change="validate"
    >
      <option selected value>{{ emptyOption }}</option>
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option[optionValue] || option.value"
      >{{ option[optionLabel] || option.label }}</option>
    </select>
  </div>
</template>


<script>
export default {
  name: 'WSelect',
  emits: ['update:modelValue', 'blur'],
  inject: {
    form: {
      default: null
    }
  },
  props: {
    modelValue: String,
    options: {
      type: Array,
      default: () => [
        { label: 'Опция 1', value: 'option1' },
        { label: 'Опция 2', value: 'option2' },
        { label: 'Опция 3', value: 'option3' }
      ]
    },
    emptyOption: {
      type: String,
      default: 'Выберите значение из списка'
    },
    inputId: String,
    label: String,
    labelClass: String,
    required: {
      type: Boolean,
      default: false
    },
    optionLabel: String,
    optionValue: String
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
        !this.value ? errors.push(false) : null
      }

      this.valid = errors.every(item => item)
    },
    focus() {
      this.$refs.select.focus()
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
  setup() {
    // const form = inject('form')
    // console.log(form)
    // if (form) return form

  },
  created() {
    if (this.form !== null)
      this.form.register(this)
  }
}
</script>