'use strict'
const Module = require('module')
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
const main = arg('--bootstrap-file') || path.join(process.execPath, '../../../boot.js')
process.versions.node = '20.5.1' // spoof node to workaround deps which throw if not node - TODO: remove platform deps which do this
Module.load(main, { imports: { fs: 'bare-fs', 'fs/promises': 'bare-fs/promises', 'os': 'bare-os', 'child_process': 'bare-subprocess', events: 'bare-events', http: 'bare-http1' }})