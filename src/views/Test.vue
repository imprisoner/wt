<template>
  <div class="col-3">
    <div v-if="form.valid">The Form is valid!</div>
    <w-form v-model="form.valid">
      <template #fieldset>
        <w-textfield
          v-model="form.name"
          label="Имя"
          :minlength="3"
          :maxlength="15"
          required
          class="mb-3"
        />
        <w-textfield
          v-model="form.surname"
          label="Фамилия"
          :minlength="3"
          :maxlength="15"
          required
          class="mb-3"
        />
      </template>
      <template #submit>
        <w-button gradient class="ms-auto">Submit</w-button>
      </template>
    </w-form>
    <form id="form">
      <h3>Simple form. Just form.</h3>
      <div>
        <label for="i1">Label for Input1</label>
        <input id="i1" type="email" required minlength="3" maxlength="10" />
      </div>
      <div>
        <label for="i2">Label for Input1</label>
        <input id="i2" type="text" required minlength="3" maxlength="10" />
      </div>
      <div>
        <button type="submit" @click="showValidity">Submit</button>
      </div>
    </form>
    <div>
      <h5>Validity</h5>
      <ul>
        <li v-for="(value, key) in vState" :key="key">{{key}}: {{vState[key]}}</li>
        <!-- <li>{{vState}}</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref, reactive, computed, onMounted } from 'vue'
// import { WForm, WButton, WTextfield } from '@/components/base/'
import WForm from '@/components/base/WForm.vue'
import WTextfield from '@/components/base/WTextfield.vue'
import WButton from '@/components/base/WButton.vue'

export default {
  name: 'Test',
  components: {
    WForm, WTextfield, WButton
  },
  data() {
    return {
      form: {
        valid: false,
        name: '',
        surname: ''
      },
      validity: null
    }
  },
  setup() {
    let validity
    onMounted(() => {

      const input1 = document.querySelector('#i1')
      // console.log(getCurrentInstance())
      const vArr = {}
      for (let key in input1.validity) {
        vArr[key] = input1.validity[key]
      }
      getCurrentInstance().data.validity = reactive(vArr)
    })
  },
  methods: {
    showValidity() {
      console.log(document.querySelector('#i1').validity)
      for(let key in document.querySelector('#i1').validity) {
        this.validity[key] = document.querySelector('#i1').validity[key]
      }
      console.log('This validity: ', this.validity)
    }
  },
  computed: {
    vState() {
      return this.validity
    }
  },
  mounted() {
    // console.log(this.validity.valueMissing)
  }
  // mounted() {
  //   console.log(this.validity)
  // }
}
</script>