// tslint:disable-next-line:no-var-requires
const pjson = require('../../package.json')

export function version () {
  return pjson.version
}
