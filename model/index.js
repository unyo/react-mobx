import { observable, computed } from 'mobx'

export default class Model {
  constructor(data = {}) {
    if (!_.isEmpty(data)) {
      this.parse(data)
    }
  }
  @observable data
  handleFetch(requestUrl, options) {
    return fetch(requestUrl, options).then((resp) => {
      if (resp.ok) return resp.text().then((text) => {
        if (text.length=='0') {
          console.log(`WARNING: empty response from the service ${requestUrl}`)
        }
        try {
          text = JSON.parse(text)
        } catch (e) {
          console.log('unable to parse response JSON')
        }
        return text
      })
      return resp.text().then((error) => {
        try {
          error = JSON.parse(error)
        } catch (e) {
          console.log('unable to parse error json')
        }
        return Promise.reject(error)
      })
    })
  }
  request({method: method, url: url, body: body}={method: 'get', url: this.url, body: null}) {
    const requestUrl = url || this.url
    var options = {
      method: method,
      headers: {
        'Authorization': 'Bearer '+localStorage['ocean_auth_token'],
        'Content-Type': 'application/json'
      },
      body: body
    }
    return this.handleFetch(requestUrl, options)
  }
  parse(data) {
    Object.assign(this, data)
    return data
  }
  fetch(options = {}) {
    return this.request().then((data) => {
      if (options.parse===undefined || options.parse===true) {
        this.data = this.parse(data)
      }
      return data
    })
  }
  create() {
    return this.request({method: 'post', body: JSON.stringify(this.data)})
  }
  update() {
    return this.request({method: 'put', body: JSON.stringify(this.data)})
  }
  destroy() {
    return this.request({method: 'delete', body: JSON.stringify(this.data)})
  }
  clone() {
    return Object.assign(Object.create(this), this)
  }
}
