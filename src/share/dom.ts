export function useObserver() {
  const dispatchs: Map<Node, (record: MutationRecord) => void> = new Map()
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(mutation => {
      // console.log('mutation', mutation.target, mutation.type)
      if (mutation.type === 'characterData') {
        const element = mutation.target.parentElement
        element && dispatchs.get(element)?.(mutation)
      } else {
        dispatchs.get(mutation.target)?.(mutation)
      }
    })
  })

  function addObserve(
    target: Node,
    options: MutationObserverInit,
    dispatch: (record: MutationRecord) => void,
  ) {
    dispatchs.set(target, dispatch)
    observer.observe(target, options)
  }

  function removeObserve(target: Node) {
    if (dispatchs.has(target)) {
      dispatchs.delete(target)
    }
  }

  function disconnect() {
    observer.disconnect()
  }

  return {
    addObserve,
    removeObserve,
    disconnect,
  }
}
