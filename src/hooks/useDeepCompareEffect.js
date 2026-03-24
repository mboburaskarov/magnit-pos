import { useEffect, useRef } from 'react'
import isEqual from '@utils/isEqual'

function useDeepCompareEffect(fn, deps, options) {
  const { initialEffect = true, debugKey } = options || {}
  const firstRender = useRef(true)
  const shouldCompare = useRef(initialEffect)
  const prevDeps = useRef(deps)
  useEffect(() => {
    if (debugKey) {
      console.group(`useDeepCompareEffect - ${debugKey}`)
    }
    const isSame = isEqual(deps, prevDeps.current)

    if ((firstRender.current || !isSame) && fn) {
      if (shouldCompare.current) {
        fn()
      }

      prevDeps.current = deps
    }

    if (debugKey) {
      console.groupEnd()
    }
    firstRender.current = false
    shouldCompare.current = true
  }, [deps, fn])
}
export default useDeepCompareEffect
