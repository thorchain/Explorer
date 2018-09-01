export function formatVersion (version: string) {
  const [major, minor] = version.split('.')

  return `V${major}.${minor}`
}
