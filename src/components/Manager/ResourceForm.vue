<template>
  <w-form v-model="valid" @submit="validate" ref="form">
    <template #title>
      <h3 class="fs-3 mb-3">
        {{ mode === 'add' ? 'Добавить' : 'Редактировать' }}
        <br />учётную запись
      </h3>
    </template>
    <template #fieldset>
      <w-textfield
        class="mb-3"
        label="Имя"
        input-id="name"
        required
        ref="nameInput"
        v-model="newResource.name"
      />

      <w-textfield class="mb-3" label="Владелец" input-id="owner" v-model="newResource.owner" />

      <w-select
        class="mb-3"
        label="Аккаунт"
        inputId="account"
        empty-option="Выберите аккаунт"
        :options="parentAccounts"
        option-label="name"
        option-value="name"
        required
        v-model="newResource.account"
      />
    </template>
    <template #buttons>
      <div class="mb-5 d-flex">
        <template v-if="mode === 'add'">
          <w-button
            color="primary"
            class="d-block ms-auto"
            gradient
          >Добавить</w-button>
        </template>
        <template v-if="mode === 'edit'">
          <w-button
            color="secondary"
            class="d-block"
            gradient
            outlined
            @click="turnAddMode"
          >Отмена</w-button>
          <w-button
            @click="validate"
            color="success"
            class="d-block ms-auto"
            gradient
            outlined
          >Изменить</w-button>
        </template>
      </div>
    </template>
    <template #footer>
      <div>
        <label for="fileInput" class="form-label">
          Загрузить
          <b>.xlsx</b> или
          <b>.ods</b> файл:
        </label>
        <input
          class="form-control form-control-sm"
          id="fileInput"
          type="file"
          accept=".ods, .xlsx, application/vnd.oasis.opendocument.spreadsheet, application/vnd.ms-excel"
          @change="fileHandler"
          @click="clearFileInput"
        />
      </div>
    </template>
    <teleport to="body">
      <w-modal v-model:show="modal" @proceed="upload" @cancel="cancelUpload">
        <template #title>Введите название листа</template>
        <template #default>
          <w-textfield input-id="sheet" v-model.trim="xlsx.sheet" />
        </template>
        <template #cancel>Отмена</template>
        <template #proceed>Ок</template>
      </w-modal>
    </teleport>
  </w-form>
</template>

<script>
import { mapGetters } from 'vuex'
import WButton from '@/components/base/WButton.vue'
import WForm from '@/components/base/WForm.vue'
import WTextfield from '@/components/base/WTextfield.vue'
import WSelect from '@/components/base/WSelect.vue'
import WModal from '@/components/base/WModal.vue'

export default {
  name: 'ResourceForm',
  components: {
    WButton,
    WForm,
    WTextfield,
    WSelect,
    WModal
  },
  emits: ['update:mode', 'upload', 'result'],
  props: {
    mode: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'edit'].includes(val)
      }
    }
  },
  data() {
    return {
      valid: false,
      newResource: {
        name: '',
        owner: 'Не указан',
        account: ''
      },
      modal: false,
      xlsx: {
        file: null,
        sheet: ''
      }
    }
  },
  methods: {
    turnAddMode(e) {
      e.preventDefault();
      this.$refs.form.reset()
      this.$emit('update:mode', 'add')
    },
    validate() {
      console.log('validating edition form')
      if (this.valid) {
        console.log('form is valid, emitting result')
        this.$emit('result', { ...this.newResource })
      }
      this.$refs.nameInput.focus()
    },
    // File Input
    clearFileInput(e) {
      e.target.value = ''
    },
    fileHandler(e) {
      this.xlsx.file = e.target.files[0]
      this.modal = true
    },
    cancelUpload() {
      this.xlsx.file = null
      this.xlsx.sheet = ''
      this.modal = false
    },
    upload() {
      this.$emit('upload', {...this.xlsx})
      this.xlsx.file = null
      this.xlsx.sheet = ''
    },
  },
  computed: {
    ...mapGetters(['parentAccounts']),
    // selectOptions() {
    //   return this.parentAccounts.map(item => ({label: item.name, value: item.name}))
    // }
  },
}
</script>