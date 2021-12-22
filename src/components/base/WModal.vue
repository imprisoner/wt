<template>
  <transition name="fade" mode="out-in">
    <div v-if="show">
      <div class="modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <slot name="title">Title</slot>
              </h5>
              <button type="button" class="btn-close" v-if="closeButton" @click="close"></button>
            </div>
            <div class="modal-body">
              <slot>Content</slot>
            </div>
            <div class="modal-footer">
              <w-button v-if="cancelButton" color="secondary" @click="cancel">
                <slot name="cancel"></slot>
              </w-button>
              <w-button color="primary" @click="proceed">
                <slot name="proceed"></slot>
              </w-button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </transition>
</template>

<script>
import WButton from '@/components/base/WButton.vue'

export default {
  name: 'WModal',
  components: {
    WButton
  },
  emits: ['cancel', 'proceed', 'close', 'update:show'],
  props: {
    closeButton: {
      type: Boolean,
      default: false
    },
    cancelButton: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
      this.$emit('update:show', false)
    },
    proceed() {
      this.$emit('proceed')
      this.$emit('update:show', false)
    },
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style>
.modal {
  display: block;
}
</style>