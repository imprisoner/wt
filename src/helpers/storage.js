export class Storage {

  constructor(storageName, initVal) {
    this._storageName = storageName
    if (window.sessionStorage.getItem(this.storageName) === null) {
      window.sessionStorage.setItem(this.storageName, JSON.stringify(initVal))
    }
  }

  getStorage() {
    return JSON.parse(window.sessionStorage.getItem(this.storageName))
  }
  setStorage(newVal) {
    return window.sessionStorage.setItem(this.storageName, JSON.stringify(newVal))
  }
  

  get storageName() {
    return this._storageName
  }

}