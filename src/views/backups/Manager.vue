<template>
  <div>
    <div class="row justify-content-between">
      <div class="col-3">
        <aside>
          <h3 class="fs-3 mb-3">
            {{ mode === 'add' ? 'Добавить' : 'Редактировать' }}
            <br />учётную запись
          </h3>
          <form @submit.prevent>
            <div class="mb-3">
              <label for="name" class="form-label" title="Это поле обязательно для заполнения">
                Имя
                <b>*</b>
              </label>
              <input
                type="text"
                class="form-control"
                v-model.trim="newResource.name"
                ref="nameInput"
                id="name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="owner" class="form-label">Владелец</label>
              <input type="text" class="form-control" v-model.trim="newResource.owner" id="owner" />
            </div>
            <div class="mb-3">
              <label for="account" class="form-label" title="Это поле обязательно для заполнения">
                Аккаунт
                <b>*</b>
              </label>
              <select class="form-select" id="account" v-model.trim="newResource.account" required>
                <!-- id="owner" -->
                <option selected value>Выберите аккаунт</option>
                <option
                  v-for="account in parentAccounts"
                  :key="account.name"
                  :value="account.name"
                >{{ account.name }}</option>
              </select>
            </div>

            <w-button
              v-if="mode === 'add'"
              type="submit"
              color="primary"
              class="d-block ms-auto"
              :gradient="true"
              @click="addNewItem(newResource)"
            >Добавить</w-button>
            <div class="mb-3 d-flex" v-if="mode === 'edit'">
              <w-button
                type="submit"
                class="d-block"
                color="secondary"
                gradient
                outlined
                @click="turnAddMode"
              >Отмена</w-button>
              <w-button
                type="submit"
                class="d-block ms-auto"
                color="success"
                gradient
                outlined
                @click="editItem()"
              >Изменить</w-button>
            </div>
            <div class="mt-5">
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
          </form>
        </aside>
      </div>
      <!-- end Col -->
      <div class="col-8">
        <header class="p-3 border-bottom border-secondary border-2 bg-light">
          <div class="row justify-content-end">
            <div class="col-6 d-flex align-items-center">
              <label
                for="renderList"
                class="fs-6 fw-bold me-5"
                title="Это поле обязательно для заполнения"
              >
                Фильтр
                <b></b>
              </label>
              <select class="form-select" id="renderList" v-model="renderListVal">
                <!-- id="owner" -->
                <option value="checkList">Все</option>
                <option value="unmatched">Нет совпадений</option>
                <option value="unknown">Неизвестный аккаунт</option>
              </select>
            </div>
          </div>
        </header>
        <div class="table-wrapper">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Имя</th>
                <th scope="col">Владелец</th>
                <th scope="col">Аккаунт</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(resource, i) in renderList"
                :key="i"
                class="align-middle"
                :class="{
                  'table-active': activeRow === i,
                  'null-id': resource.id === null
                }"
                :title="resource.error"
              >
                <th scope="row">{{ i + 1 }}</th>
                <td>{{ resource.name }}</td>
                <td>{{ resource.owner }}</td>
                <td>{{ resource.account }}</td>
                <td class="button-holder">
                  <div class>
                    <w-button
                      icon="pencil-fill"
                      color="success"
                      gradient
                      outlined
                      @click="turnEditMode(i)"
                    />
                    <w-button
                      icon="trash-fill"
                      color="danger"
                      gradient
                      outlined
                      @click="deleteItem(i)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
            <!-- end Table -->
          </table>
        </div>
        <!-- end Col -->
      </div>
    </div>
    <!-- end Row -->
    <w-floating-button
      v-if="checkList.length"
      icon="arrow-right"
      color="primary"
      gradient
      title="Запросить данные"
      @click="validateNewData()"
    ></w-floating-button>
    <teleport to="body">
      <w-modal v-model:show="modals.warnPopup" @proceed="setNewData">
        <template #title>Хотите продолжить?</template>
        <template #default>
          <p>Помеченные красным цветом учётные записи не будут включены в таблицу данных</p>
        </template>
        <template #cancel>Отмена</template>
        <template #proceed>Ок</template>
      </w-modal>
      <w-modal
        v-model:show="modals.sheetPopup"
        @proceed="fileParsing(true)"
        @cancel="fileParsing(false)"
      >
        <template #title>Введите название листа</template>
        <template #default>
          <input type="text" class="form-control" v-model.trim="sheetName" id="sheetName" />
        </template>
        <template #cancel>Отмена</template>
        <template #proceed>Ок</template>
      </w-modal>
    </teleport>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { Resource } from '@/helpers/classes'
import { parseExcel, validateExcel } from '@/helpers/spreadsheets'
import { resetForm } from '@/helpers/utils'
import WFloatingButton from '@/components/base/WFloatingButton.vue'
import WButton from '@/components/base/WButton.vue'
import WModal from '@/components/base/WModal.vue'
import router from '@/router'


export default {
  name: 'Manager',
  components: {
    WFloatingButton,
    WButton,
    WModal
  },
  data() {
    return {
      mode: 'add',
      activeRow: -1,
      newResource: {
        name: '',
        owner: '',
        account: ''
      },
      renderListVal: 'checkList',
      modals: {
        warnPopup: false,
        sheetPopup: false
      },
      sheetName: '',
      file: ''
    }
  },
  methods: {
    ...mapActions(['checkExistence', 'setNewCollectionData']),
    ...mapMutations(['toast/NEW', 'checkList/addNewItem', 'checkList/editItem', 'checkList/editItem', 'checkList/deleteItem', 'checkList/clearList']),
    clearList() {
      this['checkList/clearList']()
    },
    clearFileInput(e) {
      e.target.value = ''
    },
    fileHandler(e) {
      this.file = e.target.files[0]
      this.modals.sheetPopup = true
    },
    async fileParsing(ok) {
      if (!ok) {
        return
      }


      let xlsx
      try {
        xlsx = await parseExcel(this.file, this.sheetName)
      } catch (e) {
        console.error(e)
        this['toast/NEW']({ type: 'error', message: 'Такого листа не существет в вашем файле!' })
        this.sheetName = ''
        this.file = ''
        return
      }


      const isValidXlsx = validateExcel(xlsx)

      if (!isValidXlsx) {
        this['toast/NEW']({ type: 'error', message: 'Таблица неверно форматирована' })
        e.target.value = ''
        return
      }


      this['checkList/clearList']()

      this.$nextTick(async () => {
        for (const row of xlsx) {
          await this.addNewItem(row)
        }

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
    async addNewItem(item) {
      const isValid = this.validateNewResource(item)
      if (!isValid) return
      
      // some names after XLSX parsing are typeof number
      if(typeof item.name === 'number') item.name = item.name.toString()

      const newItem = new Resource(item.name, item.owner, item.account, (item.__rowNum__ - 1))

      await this.checkExistence(newItem)

      // 
      this['checkList/addNewItem']({ resource: newItem })
      // 

      resetForm(this.newResource)
      this.$refs.nameInput.focus()
    },
    editItem() {
      const isValid = this.validateNewResource(this.newResource)
      if (!isValid) return

      const current = this[this.renderListVal][this.activeRow]

      // fill the form with values
      this.newResource.name = current.name
      this.newResource.owner = current.owner
      // 
      
      const { name, owner, account } = this.newResource
      const newItem = new Resource(name, owner, account, current.position)
      this.checkExistence(newItem)
      // 
      this['checkList/editItem']({ resource: newItem, position: newItem.position })
      // 
      this.turnAddMode()
    },
    deleteItem(i) {
      // 
      this.activeRow = i

      const current = this[this.renderListVal][this.activeRow]
      console.log(current)
      this['checkList/deleteItem'](current)

      this.activeRow = -1
    },
    turnEditMode(i) {
      resetForm(this.newResource)
      this.mode = 'edit'
      this.activeRow = i

      const current = this[this.renderListVal][this.activeRow]

      // fill the form with values
      this.newResource.name = current.name
      this.newResource.owner = current.owner
      // 

      this.$refs.nameInput.focus()
    },
    turnAddMode() {
      resetForm(this.newResource)
      this.mode = 'add'
      this.activeRow = -1
    },

    validateNewResource(item) {
      for (const prop in item) {
        if (prop === 'owner' && !item[prop]) {
          item[prop] = 'не указан'
          continue
        }

        if (!item[prop]) {
          return false
        }
      }

      return true
    },

    validateNewData() {
      if (this.unmatched.length || this.unknown.length) this.modals.warnPopup = true
      else this.setNewData()
    },
    async setNewData() {
    
        const isTablesReady = await this.setNewCollectionData(this.checkList)

        if(!isTablesReady) return

        router.push({ name: 'Tables' })
    }
  },
  computed: {
    ...mapGetters({
      checkList: 'checkList/checkList',
      unmatched: 'checkList/unmatched',
      unknown: 'checkList/unknown',
      wialonData: 'wialonData',
      parentAccounts: 'parentAccounts',
      wialonUnitsData: 'wialonUnitsData',
    }),
    renderList() {
      return this[this.renderListVal]
    }
  },
}
</script>

<style scoped>
.table-wrapper {
  max-height: calc(100vh - 176px - 2rem);
  overflow-y: scroll;
}

td {
  height: 60px;
}

td.button-holder {
  width: 120px;
}

.table-hover tr .button-holder > div {
  display: none;
}
.table-hover tr:hover .button-holder > div {
  display: table-cell;
}
td.button-holder .btn:not(:last-child) {
  margin-right: 5px;
}

tr.null-id {
  background: rgba(216, 137, 137, 0.281);
}
</style>
