export default () =>
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (const key in changes) {
      const storageChange = changes[key]
      console.log(
        'Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue,
      )
    }
  })
