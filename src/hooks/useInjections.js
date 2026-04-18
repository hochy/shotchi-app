import { useAppState } from '../context/AppStateContext'

export const useInjections = () => {
  const {
    injections,
    streaks,
    characterState,
    loading,
    refresh,
    logInjection
  } = useAppState()

  return {
    injections,
    streaks,
    characterState,
    loading,
    error: null, // Error handling can be added to context later
    refresh,
    logInjection
  }
}
