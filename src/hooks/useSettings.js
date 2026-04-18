import { useAppState } from '../context/AppStateContext'

export const useSettings = () => {
  const {
    settings,
    loading,
    refreshing,
    updateSettings,
    refresh
  } = useAppState()

  return {
    settings,
    loading,
    saving: refreshing,
    updateSettings,
    refresh
  }
}
