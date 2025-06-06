import { useEffect, useRef } from 'react'

export function useStableAutoScrollWhileDragging(containerRef, isDragging, options = {}) {
  const threshold = options.threshold || 80
  const scrollSpeed = options.speed || 40

  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isDragging || !containerRef?.current) return

    const container = containerRef.current
    let direction = { x: 0, y: 0 }

    const handleDragOver = (e) => {
      const rect = container.getBoundingClientRect()

      direction.x = 0
      direction.y = 0

      if (e.clientX < rect.left + threshold) direction.x = -1
      else if (e.clientX > rect.right - threshold) direction.x = 1

      if (e.clientY < rect.top + threshold) direction.y = -1
      else if (e.clientY > rect.bottom - threshold) direction.y = 1
    }

    const scrollLoop = () => {
      if (direction.x !== 0 || direction.y !== 0) {
        container.scrollBy(direction.x * scrollSpeed, direction.y * scrollSpeed)
      }
    }

    document.addEventListener('dragover', handleDragOver)
    intervalRef.current = setInterval(scrollLoop, 16) // ~60fps

    return () => {
      document.removeEventListener('dragover', handleDragOver)
      clearInterval(intervalRef.current)
    }
  }, [isDragging, containerRef, threshold, scrollSpeed])
}
