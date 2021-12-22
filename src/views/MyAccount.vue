<template>
  <div class="row justify-content-between">
    <aside class="col-3">
      <account-form @result="validateFormData" @upload="fileParsing"></account-form>
    </aside>
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
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { parseExcel, validateExcel } from '@/helpers/spreadsheets'
import AccountForm from '@/components/MyAccount/AccountForm.vue'

export default {
  name: 'MyAccount',
  components: {
    AccountForm
  },
  data() {
    return {
      showTokens: false
    }
  },
  methods: {
    ...mapActions(['checkParentAccount', 'getWialonSessionData', 'checkExistence']),
    ...mapMutations(['toast/NEW']),
    async validateFormData(formData) {

      const newAccount = await this.checkParentAccount(formData)

      if (newAccount === null) {
        return
      }

      await this.getWialonSessionData([newAccount])

      // искать id, если checkList не пуст и есть УЗ с id === null
      // это можно перенести в store
      if (this.nullId.length) {
        this.nullId.forEach(item => this.checkExistence(item))
      }

    },
    async fileParsing({ file, sheet }) {
     
      let xlsx
      try {
        xlsx = await parseExcel(file, sheet)
      } catch (e) {
        console.error(e)
        this['toast/NEW']({ type: 'error', message: 'Такого листа не существет в вашем файле!' })
        return
      }


      const isValidXlsx = validateExcel(xlsx, 'credentials')

      if (!isValidXlsx) {
        this['toast/NEW']({ type: 'error', message: 'Таблица неверно форматирована' })
        return
      }

      for (const row of xlsx) {

        const {name, token} = row
        
          await this.validateFormData({name, token})
      }
      

      this.$nextTick(async () => {
        if (this.unmatched.length) {
          setTimeout(() => {
            this['toast/NEW']({ message: 'Есть несовпадения по учётным записям', type: 'warning' })
          }, 0)
        }
        if (this.unknown.length) {
          setTimeout(() => {
            this['toast/NEW']({ message: 'Есть незарегистрированные аккаунты', type: 'warning' })
          }, 0)
        }
      })
    },
    toggleTokens() {
      this.showTokens = !this.showTokens
    }
  },
  computed: {
    ...mapGetters({
      parentAccounts: 'parentAccounts',
      nullId: 'checkList/nullId',
      unmatched: 'checkList/unmatched',
      unknown: 'checkList/unknown'
    })
  }
}
</script>