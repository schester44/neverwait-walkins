import * as Sentry from '@sentry/browser'

Sentry.init({
	environment: process.env.NODE_ENV,
	dsn: 'https://349f6a3dd120428ca75cf7fbe0aac152@sentry.io/1525497'
})

export const logError = error => Sentry.captureException(error)
