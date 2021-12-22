export class Resource {
  _error = null
  get error() {
    return this._error
  }

  set error(val) {
    switch (val) {
      case 'nomatch':
        this._error = 'Нет совпадений'
        break;
      case 'noparent':
        this._error = 'Неизвестный аккаунт'
        break;
      default:
        this._error = val
        break;
    }
  }
  constructor(
    name = '',
    owner = '',
    account = '',
    position = null,
    id = null,
    units = null
  ) {
    this.name = name
    this.owner = owner
    this.account = account
    this.position = position
    this.id = id
    this.units = units
  }

}

export class SessionData {
  constructor(data = [], prop = '') {
    this[prop] = data
  }
}

export class ParentAccount {
  constructor(name = '', token = '', expires = null) {
    this.name = name
    this.token = token
    this.expires = expires
  }
}

export class UnitsData {
  constructor(units = {}, activeUnits = {}) {
    this.active = activeUnits.usage
    this.unactive = units.usage - activeUnits.usage
    this.all = units.usage
    this.limit = units.maxUsage
  }
}

export class Toast {
  constructor(message = '', type = '', dur = 5000) {
    this.id = new Date().getTime()
    this.message = message
    this.type = type === 'error' ? 'danger' : type
    this.dur = type === 'error' ? 0 : dur
  }
}

export class WialonError {
  type = 'error'
  constructor({ error, reason }) {

    switch (reason) {
      case 'WRONG_TOKEN_LENGTH':
        reason = 'НЕВЕРНЫЙ ТОКЕН'
        break;
      default:
        break;
    }

    this.message = `Код ошибки: ${error}. Вероятная причина: ${reason}`
  }
}