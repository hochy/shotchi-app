import { useAppState } from '../context/AppStateContext'

export const useInjections = () => {
  const {
    session,
    injections,
    weightEntries,
    sideEffects,
    streaks,
    characterState,
    loading,
    refresh,
    logInjection,
    logWeight
  } = useAppState()

  return {
    session,
    injections,
    weightEntries,
    sideEffects,
    streaks,
    characterState,
    loading,
    error: null,
    refresh,
    logInjection,
    logWeight
  }
}
