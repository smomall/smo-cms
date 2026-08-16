export const useAPI = createUseFetch(callerOptions => ({
  $fetch: useNuxtApp().$api,
  ...callerOptions
}))
