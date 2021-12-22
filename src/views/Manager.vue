<template>
  <div>
    <div class="row justify-content-between">
      <aside class="col-3">
        <resource-form
          v-model:mode="mode"
          @upload="fileParsing"
          @result="mode === 'add' ? addNewItem($event) : editItem($event)"
          ref="resourceForm"
        />
        <!-- @result="addNewItem" -->
      </aside>
      <!-- end Col -->
      <div class="col-8">
        <header class="p-3 border-bottom border-secondary border-2 bg-light">
          <div class="row justify-content-end">
            <w-select
              class="col-6 d-flex align-items-center"
              label="Фильтр"
              label-class="fs-6 fw-bold me-5"
              input-id="filter"
              :options="filterOptions"
              empty-option="Выберите фильтр"
              v-model="renderListVal"
            />
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
    </teleport>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { Resource } from '@/helpers/classes'
import { parseExcel, validateExcel } from '@/helpers/spreadsheets'
import WFloatingButton from '@/components/base/WFloatingButton.vue'
import ResourceForm from '@/components/Manager/ResourceForm.vue'
import WButton from '@/components/base/WButton.vue'
import WSelect from '@/components/base/WSelect.vue'
import WModal from '@/components/base/WModal.vue'
import router from '@/router'


export default {
  name: 'Manager',
  components: {
    WFloatingButton,
    WModal,
    WSelect,
    WButton,
    ResourceForm
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
      selectOptions: [

      ],
      renderListVal: 'checkList',
      modals: {
        warnPopup: false,
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

    async fileParsing({ file, sheet }) {

      let xlsx
      try {
        xlsx = await parseExcel(file, sheet)
      } catch (e) {
        console.error(e)
        this['toast/NEW']({ type: 'error', message: 'Такого листа не существет в вашем файле!' })
        // this.sheetName = ''
        // this.file = ''
        return
      }


      const isValidXlsx = validateExcel(xlsx, 'resources')

      if (!isValidXlsx) {
        this['toast/NEW']({ type: 'error', message: 'Таблица неверно форматирована' })
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
      // console.log(item)
      // const isValid = this.validateNewResource(item)
      // if (!isValid) return

      // some names after XLSX parsing are typeof number

      let position

      if (item.__rowNum__) {
        if (typeof item.name === 'number') item.name = item.name.toString()
        position = item.__rowNum__ - 1
      } else {
        position = this['checkList/addNewItem'].length
      }


      const newItem = new Resource(item.name, item.owner, item.account, position)

      await this.checkExistence(newItem)

      // 
      this['checkList/addNewItem']({ resource: newItem })
      // 

    },
    editItem(item) {
      console.log('Editing: ', item)
      console.log('Position: ', this.currentItem.position)


      const { name, owner, account } = item
      const newItem = new Resource(name, owner, account, this.currentItem.position)
      this.checkExistence(newItem)
      // 
      this['checkList/editItem']({ resource: newItem, position: newItem.position })
      // 
      this.turnAddMode()
    },
    deleteItem(i) {
      this.activeRow = i
      this['checkList/deleteItem'](this.currentItem)
      this.activeRow = -1
    },
    turnEditMode(i) {
      this.mode = 'edit'
      this.activeRow = i

      // fill the form with values
      this.$refs.resourceForm.newResource.name = this.currentItem.name
      this.$refs.resourceForm.newResource.owner = this.currentItem.owner
      this.$refs.resourceForm.newResource.account = this.currentItem.account
    },
    turnAddMode() {
      this.mode = 'add'
      this.activeRow = -1
    },
    validateNewData() {
      if (this.unmatched.length || this.unknown.length) this.modals.warnPopup = true
      else this.setNewData()
    },
    async setNewData() {

      const isTablesReady = await this.setNewCollectionData(this.checkList)

      if (!isTablesReady) return
      console.log('ready to navigate Tables')
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
    },
    currentItem() {
      return this[this.renderListVal][this.activeRow]
    },
    filterOptions() {
      return [
        {
          label: 'Все',
          value: 'checkList'
        },
        {
          label: 'Нет совпадений',
          value: 'unmatched'
        },
        {
          label: 'Неизвестный аккаунт',
          value: 'unknown'
        }
      ]
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