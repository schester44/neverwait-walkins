import decode from "jwt-decode"

export const isAuthenticated = () => {
	try {
		decode(localStorage.getItem("AuthToken"))
	} catch (error) {
		return false
	}

	return true
}

export const getTokenPayload = () => {
	try {
		return decode(localStorage.getItem("AuthToken"))
	} catch (error) {
		console.log(error)
		return {}
	}
}
