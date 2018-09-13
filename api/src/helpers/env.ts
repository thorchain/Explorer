import { config } from 'dotenv'
import * as path from 'path'

config({ path: path.resolve(__dirname, '..', '..', '.env') })

export const env = {
  ELASTICSEARCH_HOST: getEnvStr('ELASTICSEARCH_HOST'),
}

// function getEnvInt (key: string, defaultValue?: number): number {
//   const value = process.env[key]
//   if (value === undefined) {
//     if (defaultValue === undefined) { throw new Error('Required env variable "${key}" not found in .env') }
//     return defaultValue
//   }
//   return parseInt(value, 10)
// }

function getEnvStr (key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue === undefined) { throw new Error(`Required env variable "${key}" not found in .env`) }
    return defaultValue
  }
  return value
}
