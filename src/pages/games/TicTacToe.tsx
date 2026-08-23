import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ui } from '../../data/ui'
import Footer from '../../components/Footer'

type Cell = 'X' | 'O' | null

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(b: Cell[]): Cell {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
  }
  return null
}

function winningLine(b: Cell[]): number[] | null {
  for (const line of LINES) {
    const [a, c, d] = line
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return line
  }
  return null
}

function aiMove(board: Cell[]): number {
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v): v is number => v !== null)

  for (const i of empty) {
    const copy = [...board]
    copy[i] = 'O'
    if (getWinner(copy) === 'O') return i
  }
  for (const i of empty) {
    const copy = [...board]
    copy[i] = 'X'
    if (getWinner(copy) === 'X') return i
  }
  if (empty.includes(4)) return 4
  const corners = [0, 2, 6, 8].filter(i => empty.includes(i))
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function TicTacToe() {
  const { lang } = useApp()
  const t = ui[lang]

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [busy, setBusy] = useState(false)

  const winner = getWinner(board)
  const line = winningLine(board)
  const isFull = board.every(c => c !== null)
  const finished = winner !== null || isFull

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null))
    setBusy(false)
  }, [])

  const play = (i: number) => {
    if (board[i] !== null || finished || busy) return
    const next = [...board]
    next[i] = 'X'
    setBoard(next)
  }

  // AI turn
  useEffect(() => {
    if (finished) return
    const xCount = board.filter(c => c === 'X').length
    const oCount = board.filter(c => c === 'O').length
    if (xCount <= oCount) return // not AI's turn yet

    setBusy(true)
    const timer = window.setTimeout(() => {
      setBoard(prev => {
        const move = aiMove(prev)
        if (move === undefined) return prev
        const next = [...prev]
        next[move] = 'O'
        return next
      })
      setBusy(false)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [board, finished])

  const status = winner === 'X' ? t.youWin : winner === 'O' ? t.aiWin : finished ? t.drawGame : busy ? t.oTurn : t.xTurn

  return (
    <>
      <main id="main-content" className="pt-16 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-ink hover:text-white transition-colors mb-8">
            ← {t.backHome}
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">⭕ {lang === 'en' ? 'Tic-Tac-Toe' : 'إكس أو'}</h1>
          <p className="text-muted-ink text-sm mb-8">{t.tttHowTo}</p>

          <div
            className="glass rounded-2xl p-6 inline-block"
            role="grid"
            aria-label={lang === 'en' ? 'Tic-Tac-Toe board' : 'رقعة إكس أو'}
          >
            <p className="font-mono text-sm font-semibold text-accent mb-4 min-h-[1.25rem]" aria-live="polite" style={lang === 'en' ? undefined : { fontFamily: "'Tajawal',sans-serif" }}>
              {status}
            </p>
            <div className="grid grid-cols-3 gap-2.5 w-[300px] max-w-full mx-auto">
              {board.map((cell, i) => {
                const highlight = line?.includes(i) ?? false
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    onClick={() => play(i)}
                    disabled={cell !== null || finished}
                    aria-label={`${i + 1}: ${cell ?? '-'}`}
                    className={`aspect-square rounded-xl text-4xl font-bold transition-all duration-200 flex items-center justify-center ${
                      cell ? '' : 'hover:border-accent'
                    }`}
                    style={{
                      border: '1px solid var(--surface-border)',
                      background: highlight ? 'var(--accent-dim)' : 'var(--surface-card)',
                      borderColor: highlight ? 'var(--accent)' : undefined,
                    }}
                  >
                    <span style={{ color: cell === 'X' ? 'var(--accent)' : '#7dd3fc' }}>{cell}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={reset}
              className="btn-accent mt-6 py-2.5! text-sm"
            >
              ↻ {t.restart}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
