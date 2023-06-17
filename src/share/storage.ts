export async function getLocalValue(key: string): Promise<unknown> {
  const values = await chrome.storage.local.get(key)
  return values[key]
}

export async function getLocalValues(
  keys: string[],
): Promise<{ [key: string]: unknown }> {
  const values = await chrome.storage.local.get(keys)
  const returnValues: { [key: string]: any } = {}
  for (const key of keys) {
    returnValues[key] = values[key]
  }
  return returnValues
}

export async function setLocalValue(items: { [key: string]: any }): Promise<void> {
  await chrome.storage.local.set(items)
}
