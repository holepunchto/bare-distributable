'use strict'
const Module = require('module')
const path = require('path')
const events = require('events')
Module._builtins.fs = require('bare-fs')
Module._builtins['fs/promises'] = require('bare-fs/promises')
Module._builtins.os = require('bare-os')
Module._builtins.child_process = require('bare-subprocess')
Module._builtins.http = require('bare-http1')
Module._builtins.repl = require('bare-repl')
Module._builtins.url = require('bare-url')
const arg = (flag) => {
  const argv = process.argv
  for (let index = argv.length - 1; index >= 0; index--) {
    const item = argv[index]
    let value = (item === flag) ? argv[index + 1] : null
    if (value?.[0] === '-' && isNaN(value)) value = ''
    if (item.startsWith(flag + '=')) value = item.split('=')[1].trim()
    if (value === null) continue
    if (value === undefined) value = ''
    const end = value.length - 1
    if ((value[0] === '"' || value[0] === '\'') && (value[end] === '"' || value[end] === '\'')) value = value.slice(1, -1)
    return value
  }
  return false
}
const main = arg('--bootstrap-file') || path.join(process.execPath, '..', '..', '..', '..', '..', 'boot.js')
process.versions.node = '20.5.1' // spoof node to workaround deps which throw if not node - TODO: remove platform deps which do this

class AbortError extends Error {
  ABORT_ERR = 20
  TIMEOUT_ERR = 23
  code = 20
  message = 'The operation was aborted'
}
class TimeoutError extends AbortError { 
  code = 23 
  message = 'The operation was aborted due to a timeout'
}

class AbortSignal extends events {
  aborted = false
  reason = null
  #onabort = null
  static timeout (ms) {
    const ac = new AbortController()
    setTimeout(() => {
      ac.abort(new TimeoutError())
    }, ms)
    return ac.signal
  }
  get onabort () {
    return this.#onabort
  }
  set onabort (fn) {
    if (this.#onabort) this.off('abort', this.#onabort)
    this.on('abort', fn)
  }
}

class AbortController extends events {
  constructor () {
    super()
    this.signal = new AbortSignal()
  }
  abort (reason) {
    const signal = this.signal
    if (!signal.aborted) {
      signal.aborted = true
      signal.reason = reason || new AbortError()
      signal.emit('abort')
    }
  }
  throwIfAborted () {
    if (this.signal.reason) throw this.signal.reason
  }
}

global.AbortController = AbortController
global.AbortSignal = AbortSignal

Module.load(main)