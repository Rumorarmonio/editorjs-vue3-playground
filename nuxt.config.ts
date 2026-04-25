export default defineNuxtConfig({
  compatibilityDate: '2026-04-25',
  css: ['~/styles/main.scss'],
  devtools: { enabled: true },
  ssr: true,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/styles/shared" as *;',
        },
      },
    },
  },
})
