import decode from "jwt-decode"

export default () => {
	try {
        decode(localStorage.getItem("AuthToken"))
	} catch (error) {
		return false
	}

	return true
}
