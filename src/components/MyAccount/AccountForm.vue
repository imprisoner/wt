<template>
  <w-form v-model="valid" @submit.prevent="validate">
    <template #title>
      <h3 class="fs-3 mb-3">Добавьте Ваши аккаунты Wialon</h3>
    </template>
    <template #fieldset>
      <w-textfield
        class="mb-3"
        label="Имя аккаунта Wialon"
        v-model="account.name"
        ref="accountName"
        required
      />
      <w-textfield class="mb-3" label="Токен" v-model="account.token" required />
    </template>
    <template #buttons>
      <w-button class="d-block ms-auto mb-5" color="primary">Добавить</w-button>
    </template>
    <template #footer>
      <input
        class="form-control form-control-sm"
        id="fileInput"
        type="file"
        accept=".ods, .xlsx, application/vnd.oasis.opendocument.spreadsheet, application/vnd.ms-excel"
        @change="fileHandler"
        @click="clearFileInput"
      />
    </template>
    <teleport to="body">
      <w-modal v-model:show="modal" @proceed="upload" @cancel="cancelUpload">
        <template #title>Введите название листа</template>
        <template #default>
          <w-textfield input-id="sheet" v-model.trim="xlsx.sheet" />
          <!-- <input type="text" class="form-control" v-model.trim="xlsx.sheet" id="sheet" /> -->
        </template>
        <template #cancel>Отмена</template>
        <template #proceed>Ок</template>
      </w-modal>
    </teleport>
  </w-form>
</template>

<script>
import WForm from '@/components/base/WForm.vue'
import WTextfield from '@/components/base/WTextfield.vue'
import WButton from '@/components/base/WButton.vue'
import WModal from '@/components/base/WModal.vue'

export default {
  name: 'AccountForm',
  components: { WForm, WTextfield, WButton, WModal },
  emits: ['result', 'upload'],
  data() {
    return {
      valid: false,
      account: {
        name: '',
        token: ''
      },
      modal: false,
      xlsx: {
        file: null,
        sheet: ''
      }
    }
  },
  methods: {
    validate(e) {
      if (this.valid) {
        this.$emit('result', { ...this.account })
      }
      this.$refs.accountName.focus()
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
      this.$emit('upload', { ...this.xlsx })
      this.xlsx.file = null
      this.xlsx.sheet = ''
    },
  }
}
</script>