import { useState, useEffect, useRef } from 'react'

export default function CountUp({ end, duration = 1.4, prefix = '', suffix = '', decimals = 0, start = 0, delay = 0 }) {
  const [count, setCount] = useState(start)
  const startTimeRef = useRef(null)
  const frameRef = useRef(null)
  const endRef = useRef(end)

  useEffect(() => {
    endRef.current = end
    const startVal = start

    const animate = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = (now - startTimeRef.current) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startVal + (endRef.current - startVal) * eased
      setCount(current)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(endRef.current)
      }
    }

    startTimeRef.current = null
    const timer = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [end, duration, start, delay])

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('fr-FR')

  return <>{prefix}{display}{suffix}</>
}
