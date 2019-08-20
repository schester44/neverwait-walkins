import decode from 'jwt-decode'
import * as Sentry from '@sentry/browser'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
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
}

Sentry.configureScope(scope => {
	const storedToken = localStorage.getItem('AuthToken')

	if (!storedToken) return

	const token = decode(storedToken)

	scope.setTag('has_token', !!token)

	if (!token) return

	scope.setExtra('locationId', token.locationId)
	scope.setExtra('companyId', token.companyId)
})

export const logError = error => {
	if (!isProd) {
		console.log(error)
		return
	}

	Sentry.withScope(scope => {
		if (error.data) {
			scope.setExtra('data', error.data)
		}

		Sentry.captureEvent(error)
	})
}
