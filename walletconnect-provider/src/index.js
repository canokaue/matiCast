/* eslint-env browser */

import WalletConnect from '@walletconnect/browser'
import { convertNumberToHex } from '@walletconnect/utils'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'

let XMLHttpRequest = null
let sessionPromise = null
let webconnector = null

const walletconnectMethods = [
  'eth_signTransaction',
  'eth_sendTransaction',
  'eth_sign',
  'eth_signTypedDataLegacy',
  'eth_signTypedData',
  'personal_sign',
]

// supported methods
const supportedMethods = ['eth_accounts', ...walletconnectMethods]

if (typeof window !== 'undefined' && window.XMLHttpRequest) {
  XMLHttpRequest = window.XMLHttpRequest
} else {
  throw new Error('XMLHttpRequest not found')
}

function getCallback(payload, cb) {
  return function(err, result) {
    const obj = {}
    const keys = ['id', 'jsonrpc']
    keys.forEach(key => {
      obj[key] = payload[key]
    })
    obj.result = result
    cb(err, obj)
  }
}

export default class WalletConnectProvider {
  constructor({
    host = 'http://localhost:8545',
    timeout = 0,
    user,
    password,
    headers,
    bridgeURL = 'https://bridge.walletconnect.org',

    showQRCode = true,
    callbacks = {},
  }) {
    this.host = host
    this.timeout = timeout
    this.user = user
    this.password = password
    this.headers = headers

    this.bridgeURL = bridgeURL

    this.connected = false

    this.showQRCode = showQRCode
    this.callbacks = callbacks
  }

  /**
   * Should be called to prepare new XMLHttpRequest
   *
   * @method prepareRequest
   * @param {Boolean} true if request should be async
   * @return {XMLHttpRequest} object
   */
  prepareRequest(isAsync = true) {
    const request = new XMLHttpRequest()
    request.open('POST', this.host, isAsync)
    if (this.user && this.password) {
      const authString = Buffer.from(this.user + ':' + this.password).toString(
        'base64'
      )
      request.setRequestHeader('Authorization', `Basic ${authString}`)
    }
    request.setRequestHeader('Content-Type', 'application/json')

    // set headers
    if (this.headers) {
      this.headers.forEach(header => {
        request.setRequestHeader(header.name, header.value)
      })
    }

    return request
  }

  /**
   * Should be called to make sync request
   *
   * @method send
   * @param {Object} payload
   * @return {Object} result
   */
  send(payload = {}) {
    let request = this.prepareRequest(false)

    try {
      request.send(JSON.stringify(payload))
    } catch (error) {
      throw new Error(`Invalid connection ${this.host}`)
    }

    let result = request.responseText
    try {
      result = JSON.parse(result)
    } catch (e) {
      throw new Error(`Invalid response ${request.responseText}`)
    }

    return result
  }

  async createWebconnector() {
    // create WebConnector
    webconnector = new WalletConnect({
      bridge: this.bridgeURL,
    })

    if (!webconnector.connected) {
      const d = new Promise((resolve, reject) => {
        // load connect
        webconnector.on('connect', (error, payload) => {
          if (error) {
            return reject(error)
          }

          // on connect callback
          this.callbacks.onConnect && this.callbacks.onConnect(error, payload)

          // close qr code
          if (this.showQRCode) {
            WalletConnectQRCodeModal.close()
          }

          // get provided accounts and chainId
          const { accounts /*, chainId */ } = payload.params[0]
          resolve(accounts)
        })

        webconnector.on('disconnect', (error, payload) => {
          if (error) {
            throw error
          }

          // on disconnect callback
          this.callbacks.onDisconnect &&
            this.callbacks.onDisconnect(error, payload)

          // close qr code
          if (this.showQRCode) {
            WalletConnectQRCodeModal.close()
          }
        })
      })

      return webconnector
        .createSession()
        .then(() => {
          // get uri for QR Code modal
          const uri = webconnector.uri

          // callback on session create
          this.callbacks.onCreate && this.callbacks.onCreate(uri)

          // show qr code if asked
          if (this.showQRCode) {
            // display QR Code modal
            WalletConnectQRCodeModal.open(uri, () => {
              webconnector = null
              sessionPromise = null
              this.callbacks.onAbort && this.callbacks.onAbort(uri)
            })
          }
        })
        .then(() => {
          return d
        })
        .catch(() => {
          webconnector = null
          sessionPromise = null
        })
    }

    return new Promise((resolve, reject) => {
      const _accounts =
        webconnector && webconnector.session && webconnector.session.accounts
      if (_accounts && _accounts.length) {
        resolve(_accounts)
      } else {
        webconnector.on('session_update', (error, payload) => {
          if (error) {
            return reject(error)
          }

          // on update
          this.callbacks.onUpdate && this.callbacks.onUpdate(error, payload)

          const { accounts } = payload.params[0]
          resolve(accounts)
        })
      }
    })
  }

  _sendAsync(payload, callback) {
    const request = this.prepareRequest(true)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.timeout !== 1) {
        let result = request.responseText
        let error = null

        try {
          result = JSON.parse(result)
        } catch (e) {
          error = new Error(`Invalid response ${request.responseText}`)
        }
        callback(error, result)
      }
    }

    request.ontimeout = () => {
      callback(new Error(`Connection timeout ${this.timeout}`))
    }

    try {
      request.send(JSON.stringify(payload))
    } catch (error) {
      callback(new Error(`Invalid connection ${this.host}`))
    }
  }

  /**
   * Should be used to make async request
   *
   * @method sendAsync
   * @param {Object} payload
   * @param {Function} callback triggered on end with (err, result)
   */
  sendAsync(payload, callback) {
    let p = Promise.resolve()
    if (supportedMethods.includes(payload.method)) {
      if (!sessionPromise) {
        // create WebConnector
        sessionPromise = this.createWebconnector()
      }
      p = sessionPromise

      if (walletconnectMethods.includes(payload.method)) {
        const fn = getCallback(payload, callback)
        if (payload.method === 'eth_sendTransaction') {
          payload.params.push(convertNumberToHex(payload.params[0].chainId))
        }
        return p
          .then(() => {
            return webconnector.sendCustomRequest(payload)
          })
          .then(result => {
            fn(null, result)
          })
          .catch(err => {
            fn(err, null)
          })
      } else if (payload.method === 'eth_accounts') {
        // call accounts
        return p
          .then(() => {
            let accounts = null
            if (webconnector && webconnector.session) {
              accounts = webconnector.session.accounts
            }
            getCallback(payload, callback)(null, accounts || [])
          })
          .catch(getCallback(payload, callback))
      }
    } else {
      // normal call
      return p
        .then(() => {
          this._sendAsync(payload, callback)
        })
        .catch(error => {
          callback(new Error(`Invalid connection ${error}`))
        })
    }
  }

  /**
   * Synchronously tries to make Http request
   *
   * @method isConnected
   * @return {Boolean} returns true if request haven't failed. Otherwise false
   */
  isConnected() {
    if (webconnector && webconnector.connected) {
      return true
    }

    return false
  }

  disconnect() {
    if (webconnector && webconnector.connected) {
      webconnector.killSession()
    }
  }
}
