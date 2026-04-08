import { useEffect, useState } from 'react'

export default function PageTransition({ children }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <div
      style={{
        animation: show ? 'pageEnter 0.3s ease-out' : 'pageExit 0.3s ease-out',
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  )
}
