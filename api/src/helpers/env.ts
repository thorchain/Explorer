import { config } from 'dotenv'

config()

export const env = {
  ELASTICSEARCH_HOST: getEnvStr('ELASTICSEARCH_HOST'),
  TENDERMINT_RPC_REST: getEnvStr('TENDERMINT_RPC_REST'),
  TENDERMINT_RPC_WS: getEnvStr('TENDERMINT_RPC_WS'),
  THORCHAIN_LCD_REST: getEnvStr('THORCHAIN_LCD_REST'),
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
    if (defaultValue === undefined) { throw new Error('Required env variable "${key}" not found in .env') }
    return defaultValue
  }
  return value
}
