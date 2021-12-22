<template>
  <div class="loader-screen" v-if="show">
    <div class="loader-wrapper d-flex justify-content-center align-items-center">
      <strong>{{ message }}...</strong>
      <div class="spinner-border ms-5" role="status" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WLoaderScreen',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>

<style scoped>
.loader-screen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.397);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .loader-screen .loader-wrapper {
  position: absolute;
  top: calc(50vh - 16px);
  left: calc(50vw - 77px);
} */
</style>