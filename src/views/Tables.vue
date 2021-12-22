<template>
  <div>
    <div class="row justify-content-between">
      <div class="col-12">
        <div class="table-wrapper">
          <table class="table table-hover" id="export">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Учётная запись</th>
                <th scope="col">Активно</th>
                <th scope="col">Отключено</th>
                <th scope="col">Всего</th>
                <th scope="col">Лимит</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(resource, i) in renderList" :key="resource.id">
                <th scope="row">{{ i }}</th>
                <td>{{ resource.name }}</td>
                <td>{{ resource.error || resource.units.active }}</td>
                <td>{{ resource.error || resource.units.unactive }}</td>
                <td>{{ resource.error || resource.units.all }}</td>
                <td>{{ resource.error || resource.units.limit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <w-floating-button
      v-if="renderList.length"
      icon="box-arrow-right"
      color="success"
      gradient
      @click="showModal"
      title="Экспортировать таблицу в Excel"
    ></w-floating-button>
    <teleport to="body">
      <w-modal
        v-model:show="modal"
        :cancel-button="false"
        close-button
        @proceed="exportTableData"
      >
        <template #title>Параметры экспорта</template>
        <template #>
          <div class="mb-3">
            <label for="name" class="form-label" title="Это поле обязательно для заполнения">
              Имя таблицы
              <b>*</b>
            </label>
            <input type="text" class="form-control" v-model="exporting.name" id="name" />
          </div>
          <div class="mb-3">
            <label for="ext" class="form-label" title="Это поле обязательно для заполнения">
              Желаемое расширение
              <b>*</b>
            </label>
            <select class="form-select" v-model="exporting.ext" id="ext">
              <option value>Выберите расширение</option>
              <option value="xlsx">
                <b>.xlsx</b>
              </option>
              <option value="ods">
                <b>.ods</b>
              </option>
            </select>
          </div>
        </template>
        <template #proceed>Экспортировать</template>
      </w-modal>
    </teleport>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseHTML } from '@/helpers/spreadsheets'
import WFloatingButton from '@/components/base/WFloatingButton.vue'
import WModal from '@/components/base/WModal.vue'
export default {
  name: 'Tables',
  components: {
    WFloatingButton,
    WModal
  },
  data() {
    return {
      exporting: {
        name: '',
        ext: 'xlsx'
      },
      modal: false
    }
  },
  methods: {
    exportTableData() {
      const table = document.querySelector('#export')
      parseHTML(table, this.exporting)
    },
    showModal() {
      this.modal = true
    }
  },
  computed: {
    ...mapGetters(['renderList'])

  }
}
</script>

<style scoped>
.table-wrapper {
  max-height: calc(100vh - 176px);
  overflow-y: scroll;
}
</style>