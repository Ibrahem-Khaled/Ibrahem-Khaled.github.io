import { useEffect, useState } from 'react'
import { TYPING_STRINGS } from '../data/content'
import type { Lang } from '../types'

export function useTyping(lang: Lang): string {
  const [text, setText] = useState('')

  useEffect(() => {
    let stringIdx = 0
    let charIdx = 0
    let deleting = false
    let timer = 0

    const strings = TYPING_STRINGS[lang]
    setText('')

    const tick = () => {
      const current = strings[stringIdx % strings.length]
      if (deleting) {
        charIdx--
        setText(current.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          stringIdx++
        }
        timer = window.setTimeout(tick, 50)
      } else {
        charIdx++
        setText(current.slice(0, charIdx))
        if (charIdx === current.length) {
          deleting = true
          timer = window.setTimeout(tick, 1800)
        } else {
          timer = window.setTimeout(tick, 90)
        }
      }
    }

    timer = window.setTimeout(tick, 400)
    return () => window.clearTimeout(timer)
  }, [lang])

  return text
}
