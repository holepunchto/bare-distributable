'use strict'
const process = require('bare-process')
const Module = require('bare-module')
const path = require('bare-path')
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
// TODO: remove after `is-core-module` dep is gone (by replacing `resolve` in `script-linker`)
process.versions.node = '99.99.99'

const events = require('bare-events')
const fs = require('bare-fs')
const fsp = require('bare-fs/promises')
const http = require('bare-http1')
const os = require('bare-os')
const child_process = require('bare-subprocess')
const repl = require('bare-repl')
const url = require('bare-url')
global.process = process
Module.load(main, {
  builtins: {
    events, fs, http, os, path, child_process, repl, url,
    'fs/promises': fsp,
    module: Module,
    process: process,
    'bare-module': Module,
    'bare-process': process,
    'bare-events': events,
    'bare-fs': fs,
    'bare-fs/promises': fsp,
    'bare-http1': http,
    'bare-os': os,
    'bare-path': path,
    'bare-repl': repl,
    'bare-url': url,
    'bare-pipe': require('bare-pipe'),
    'bare-tty': require('bare-tty')
  }
})