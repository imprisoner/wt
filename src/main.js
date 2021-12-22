import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'


const app = createApp(App)


let handleOutsideClick
let handleEscapeKeydown

app.directive('closable', {
  beforeMount(el, binding, vnode) {

    const { handler, exclude } = binding.value      // This variable indicates if the clicked element is excluded
    // Here's the click/touchstart handler
    // (it is registered below)
    handleOutsideClick = (e) => {
      e.stopPropagation()
      // Get the handler method name and the exclude array
      // from the object used in v-closable
      let clickedOnExcludedEl = false
      if (binding.instance !== null) {
        exclude.forEach((refName) => {
          // We only run this code if we haven't detected
          // any excluded element yet
          if (!clickedOnExcludedEl) {
            // Get the element using the reference name
            const excludedEl = binding.instance.$refs[refName]
            if (excludedEl !== null)
              clickedOnExcludedEl = excludedEl.contains(e.target)
            // See if this excluded element
            // is the same element the user just clicked on
          }
        })      // We check to see if the clicked element is not
        // the dialog element and not excluded
        if (!el.contains(e.target) && !clickedOnExcludedEl) {
          // If the clicked element is outside the dialog
          // and not the button, then call the outside-click handler
          // from the same component this directive is used in
          binding.instance[handler]()
        }
      }
    }
    // register Escape keydown
    handleEscapeKeydown = (e) => {
      e.stopPropagation()
      if(e.key === 'Escape') {
        binding.instance[handler]()
      }
    }
    // Register click/touchstart/keydown event listeners on the whole page
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleEscapeKeydown)
  },
  unmounted() {
    // If the element that has v-closable is removed, then
    // unbind click/touchstart listeners from the whole page
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchstart', handleOutsideClick)
    document.removeEventListener('keydown', handleEscapeKeydown)
  }
})


app.use(router)
  .use(store)
  .mount('#app')