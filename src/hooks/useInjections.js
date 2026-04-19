import { useAppState } from '../context/AppStateContext'

export const useInjections = () => {
  const {
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
    injections,
    weightEntries,
    sideEffects,
    streaks,
    characterState,
    loading,
    error: null, // Error handling can be added to context later
    refresh,
    logInjection,
    logWeight
  }
}
