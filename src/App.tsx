import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Loader from './components/Loader'
import CursorGlow from './components/CursorGlow'
import BackgroundImage from './components/BackgroundImage'
import Navbar from './components/Navbar'
import FloatingButtons from './components/FloatingButtons'
import Home from './pages/Home'

const Games = lazy(() => import('./pages/Games'))
const TicTacToe = lazy(() => import('./pages/games/TicTacToe'))
const BugWars = lazy(() => import('./pages/games/BugWars'))

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="loader-ring" />
    </div>
  )
}

/** routes that render fullscreen without the site chrome */
function useFullscreenRoute() {
  const { pathname } = useLocation()
  return pathname.startsWith('/games/bug-wars')
}

function Shell() {
  const fullscreen = useFullscreenRoute()

  return (
    <>
      {!fullscreen && <BackgroundImage />}
      <ScrollReset />
      {!fullscreen && <Loader />}
      {!fullscreen && <CursorGlow />}
      {!fullscreen && <Navbar />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/bug-wars" element={<BugWars />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      {!fullscreen && <FloatingButtons />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppProvider>
  )
}
