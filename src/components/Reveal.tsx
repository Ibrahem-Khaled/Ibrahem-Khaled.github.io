import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={`reveal ${inView ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
