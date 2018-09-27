export const env = {
  LCD_API_HOST: getEnvStr('LCD_API_HOST', 'http://localhost:1317/'),
  REACT_APP_API_HOST: getEnvStr('REACT_APP_API_HOST'),
}

function getEnvStr (key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue === undefined) { throw new Error(`Required env variable "${key}" not found in .env`) }
    return defaultValue
  }
  return value
}
