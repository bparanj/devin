// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  compatibilityDate: '2024-12-29',
  // Type assertion for alpha version content configuration
  ...(({
    content: {
      documentDriven: true,
      api: {
        baseURL: '/api/_content'
      }
    }
  } as any))
})
