import { useState, useEffect } from 'react'
import throttle from 'lodash/fp/throttle'

export default ({
  activeSectionDefault = 0,
  offsetPx = 0,
  sectionElementRefs = [],
  throttleMs = 100,
  root = window,
}) => {
  const [activeSection, setActiveSection] = useState(activeSectionDefault)

  const handle = throttle(throttleMs, (e) => {
    let currentSectionId = activeSection
    for (let i = 0; i < sectionElementRefs.length; i++) {
      const section = sectionElementRefs[i].current
      // Needs to be a valid DOM Element
      if (!section || !(section instanceof Element)) continue
      // GetBoundingClientRect returns values relative to viewport
      if (section.getBoundingClientRect().top + offsetPx < 0) {
        currentSectionId = i
        continue
      }
      // No need to continue loop, if last element has been detected
      break
    }

    setActiveSection(currentSectionId)
  })

  useEffect(() => {
    root.addEventListener('scroll', handle)
    root.addEventListener('click', handle)
    // Run initially
    handle()

    return () => {
      root.removeEventListener('scroll', handle)
      root.removeEventListener('click', handle)
    }
  }, [sectionElementRefs, offsetPx])

  return activeSection
}
