export function resetForm(form = {}) {
  for (let key in form) {
    form[key] = ''
  }
}