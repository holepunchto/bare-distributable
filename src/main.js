'use strict'
global.process = require('bare-process')
const Module = require('bare-module')
const path = require('path')

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
Module.load(main, {
  builtins: {
    events: require('bare-events'),
    fs: require('bare-fs'),
    'fs/promises': require('bare-fs/promises'),
    http: require('bare-http1'),
    module: Module,
    os: require('bare-os'),
    path: require('bare-path'),
    process: global.process,
    child_process: require('bare-subprocess'),
    repl: require('bare-repl'),
    url: require('bare-url'),
    'bare-pipe': require('bare-pipe'),
    'bare-tty': require('bare-tty'),
  }
})