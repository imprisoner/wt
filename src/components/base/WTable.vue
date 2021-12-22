<template>
  <table class="table" :class="style">
    <thead>
      <tr>
        <th scope="col" v-for="name in header">{{ name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td colspan="2">Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'WTable',
  props: {
    header: {
      type: Array,
      default() {
        return ['Колонка 1', 'Колонка 2', 'Колонка 3']
      }
    },
    hover: Boolean,
    striped: Boolean,
    bordered: Boolean,
    borderColor: {
      type: String,
      default: '',
      validator(value) {
        if (value) {
          const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
          return colors.includes(value)
        } else return
      }
    },
    color: {
      type: String,
      default: '',
      validator(value) {
        if (value) {
          const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
          return colors.includes(value)
        } else return
      }
    },
  },
  computed: {
    style() {
      return {
        ['table-' + this.color]: this.color,
        'table-hover': hover,
        'table-striped': striped,
        'table-bordered': bordered,
        'border-color': borderColor,
      }
    }
  }
}
</script>