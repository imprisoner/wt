<template>
  <div class="row justify-content-between">
    <div class="col-3">
      <h3 class="fs-3 mb-3">Добавьте Ваши аккаунты Wialon</h3>
      <w-form v-model="valid">
          <template #fieldset>
            <w-textfield
              class="mb-3"
              label="Имя аккаунта Wialon"
              v-model="account.name"
              ref="accountName"
              required
            />
            <w-textfield
              class="mb-3"
              label="Токен"
              v-model="account.token"
              :validation="() => { }"
              required
            />
          </template>
          <template #submit>
              <w-button class="d-block ms-auto" color="primary" @click="validate">Добавить</w-button>
          </template>
      </w-form>
    </div>
    <div class="col-8">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Аккаунт</th>
            <th scope="col">Истекает</th>
            <th scope="col" v-if="showTokens">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, i) in parentAccounts">
            <th scope="row">{{ i + 1 }}</th>
            <td>{{ account.name }}</td>
            <td>{{ account.expires }}</td>
            <td v-if="showTokens">{{ account.token }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { resetForm } from '@/helpers/utils'
import WButton from '@/components/base/WButton.vue'
import WTextfield from '@/components/base/WTextfield.vue'
import WForm from '@/components/base/WForm.vue'

export default {
  name: 'MyAccount',
  components: {
    WButton,
    WTextfield,
    WForm
  },
  data() {
    return {
      valid: false,
      account: {
        name: '',
        token: ''
      },
      showTokens: false
    }
  },
  methods: {
    ...mapActions(['checkParentAccount', 'getWialonSessionData', 'checkExistence']),
    async validate() {
      // validation
      // logic
      console.log('Validating')

      const newAccount = await this.checkParentAccount({ ...this.account })

      if (newAccount === null) {
        return
      }
      
      await this.getWialonSessionData([newAccount])

      console.log('starting null ID search')
      if (this.nullId.length) {
        this.nullId.forEach(item => this.checkExistence(item))
      }


      resetForm(this.account)
      this.$refs.accountName.focus()
    },
    toggleTokens() {
      this.showTokens = !this.showTokens
    }
  },
  computed: {
    ...mapGetters({
      parentAccounts: 'parentAccounts',
      // checkList: 'checkList/checkList',
      nullId: 'checkList/nullId'
    })
  }
}
</script>