import * as Sentry from '@sentry/browser'

const isProd = process.env.NODE_ENV === 'production'

Sentry.init({
	environment: process.env.NODE_ENV,
	dsn: process.env.REACT_APP_SENTRY_DSN,
	integrations(integrations) {
		if (!isProd) {
			return integrations.filter(integration => integration.name !== 'Breadcrumbs')
		}

		return integrations
	}
})

export const logError = error => isProd && Sentry.captureEvent(error)