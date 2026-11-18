import { useCallback, useEffect, useState } from 'react'

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

function aiMove(board: Cell[]): number | undefined {
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
  const corners = [0, 2, 6, 8].filter((i) => empty.includes(i))
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)]
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function TicTacToeIsland() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [busy, setBusy] = useState(false)

  const winner = getWinner(board)
  const line = winningLine(board)
  const isFull = board.every((c) => c !== null)
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

  useEffect(() => {
    if (finished) return
    const xCount = board.filter((c) => c === 'X').length
    const oCount = board.filter((c) => c === 'O').length
    if (xCount <= oCount) return

    setBusy(true)
    const timer = window.setTimeout(() => {
      setBoard((prev) => {
        const move = aiMove(prev)
        if (move === undefined) return prev
        const next = [...prev]
        next[move] = 'O'
        return next
      })
      setBusy(false)
    }, 380)
    return () => window.clearTimeout(timer)
  }, [board, finished])

  const status =
    winner === 'X'
      ? 'You win'
      : winner === 'O'
        ? 'AI wins'
        : finished
          ? 'Draw'
          : busy
            ? 'AI thinking...'
            : 'Your turn (X)'

  return (
    <div className="mx-auto max-w-sm border border-ink bg-paper-alt p-6">
      <div className="mb-4 flex items-center justify-between border-b border-rule pb-3 font-mono text-xs">
        <span className="uppercase tracking-wider text-ink-muted">Status</span>
        <span className="font-semibold text-accent" aria-live="polite">{status}</span>
      </div>

      <div
        role="grid"
        aria-label="Tic-Tac-Toe board"
        className="grid grid-cols-3 gap-2"
      >
        {board.map((cell, i) => {
          const highlight = line?.includes(i) ?? false
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              onClick={() => play(i)}
              disabled={cell !== null || finished}
              aria-label={`Cell ${i + 1}: ${cell ?? 'empty'}`}
              className="flex aspect-square items-center justify-center border font-mono text-3xl font-semibold transition-colors"
              style={{
                borderColor: highlight ? '#C8430A' : '#DAD5C9',
                backgroundColor: highlight ? '#F9EAE3' : '#F6F4EF',
                color: cell === 'X' ? '#121211' : '#C8430A',
              }}
            >
              {cell}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={reset}
        className="btn-primary mt-5 w-full font-mono text-xs uppercase tracking-wider"
      >
        Reset Board
      </button>
    </div>
  )
}
