/* ── BUG WARS · run lifecycle helpers ── */

import { initAudio, setMuted, startMusic } from './audio'
import { useGame } from './store'
import { resetWorld, weapon } from './world'

export const LOCK_EVENT = 'bugwars-lock'

export function requestLock() {
  window.dispatchEvent(new Event(LOCK_EVENT))
}

export function startRun() {
  initAudio()
  resetWorld()
  weapon.ammo = 14
  const st = useGame.getState()
  st.resetHud()
  st.setIntermission(4)
  startMusic()
}

export function applyMute(muted: boolean) {
  setMuted(muted)
}

export function toggleMuteAndApply() {
  const st = useGame.getState()
  st.toggleMute()
  applyMute(useGame.getState().muted)
}
