import { useState, useEffect } from 'react'

export const useLoadingProgress = (isLoading, duration = 2000) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      return
    }

    const interval = 50 // Update every 50ms
    const totalSteps = duration / interval
    const increment = 100 / totalSteps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      
      // Add some randomness to make it feel more natural
      const randomVariation = (Math.random() - 0.5) * 5
      const newProgress = Math.min(95, currentProgress + randomVariation)
      
      setProgress(Math.round(newProgress))

      if (currentProgress >= 95) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isLoading, duration])

  return progress
}

export default useLoadingProgress