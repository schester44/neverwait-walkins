import decode from 'jwt-decode'

export const isAuthenticated = () => {
	try {
		decode(localStorage.getItem('AuthToken'))
	} catch (error) {
		return false
	}

	return true
}
