const exec = require('child_process').exec
const component = process.argv[2] || 'button'
const describeBlockNameArgv = process.argv[3] || ''

// for whole test suites
// vue-cli-service test:unit lib/input

// for one specific test suite
// vue-cli-service test:unit lib/input --grep="Input Component Tests"

let cmd = `vue-cli-service test:unit lib/${component}`
if (describeBlockNameArgv) {
  cmd += ` --grep="${describeBlockNameArgv.split('=')[1]}"`
}
console.log(`cmd=${cmd}`)
exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`)
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})
