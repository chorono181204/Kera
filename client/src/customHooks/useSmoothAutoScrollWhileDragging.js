import { useEffect, useRef } from 'react'

export function useSmoothAutoScrollWhileDragging(containerRef, isDragging, options = {}) {
  const threshold = options.threshold || 80
  const maxSpeed = options.maxSpeed || 25

  const animationRef = useRef(null)

  useEffect(() => {
    if (!isDragging || !containerRef?.current) return

    const container = containerRef.current

    const getSpeed = (cursor, edge, maxEdge, axis = 'x') => {
      let distance = 0

      if (cursor < edge + threshold) {
        distance = cursor - edge
        return -Math.ceil((1 - distance / threshold) * maxSpeed)
      }

      if (cursor > maxEdge - threshold) {
        distance = maxEdge - cursor
        return Math.ceil((1 - distance / threshold) * maxSpeed)
      }

      return 0
    }

    const step = (e) => {
      const rect = container.getBoundingClientRect()
      const { clientX, clientY } = e

      const dx = getSpeed(clientX, rect.left, rect.right, 'x')
      const dy = getSpeed(clientY, rect.top, rect.bottom, 'y')

      if (dx !== 0 || dy !== 0) {
        container.scrollBy(dx, dy)
        animationRef.current = requestAnimationFrame(() => step(e))
      }
    }

    const handleMove = (e) => {
      cancelAnimationFrame(animationRef.current)
      step(e)
    }

    document.addEventListener('dragover', handleMove)

    return () => {
      document.removeEventListener('dragover', handleMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isDragging, containerRef, maxSpeed, threshold])
}
