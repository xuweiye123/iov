'use strict'

const fs = require('fs')
const path = require('path')
const tar = require('tar')


const content = fs.readFileSync(path.resolve(__dirname, '../package.json'))
let packageJson = JSON.parse(content)
console.log('当前版本号:', packageJson.version)
const files = fs.readdirSync(path.resolve(__dirname, '../dist/'))
console.log('打包文件:', files)
const tarFileName = `dist/monitor-ui-V${packageJson.version}.tar.gz`
tar.c(
  {
    gzip: true,
    prefix: 'monitor-ui',
    cwd: 'dist/'
  },
  files
).pipe(fs.createWriteStream(tarFileName))

console.log('打包完成:', tarFileName)
