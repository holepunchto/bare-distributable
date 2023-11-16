'use strict'
const Module = require('module')
Module._builtins.fs = require('bare-fs')
Module._builtins['fs/promises'] = require('bare-fs/promises')
Module._builtins['child_process'] = require('bare-subprocess')
Module._builtins.http = require('bare-http1')
Module._builtins.repl = require('bare-repl')
Module._builtins.url = require('bare-url')
Module._builtins['bare-pipe'] = require('bare-pipe')
Module._builtins['bare-tty'] = require('bare-tty')
global.process = require('bare-process')
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
  imports: {
    events: "bare-events",
    os: "bare-os",
    path: "bare-path",
    pipe: "bare-pipe",
    tty: "bare-tty",
    fs: "bare-fs",
    "fs/promises": "bare-fs/promises",
    child_process: "bare-subprocess",
    http: "bare-http1",
    repl: "bare-repl",
    url: "bare-url"
  }
})