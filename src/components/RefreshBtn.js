import React from 'react'

const RefreshBtn = () => {
	const [count, setCount] = React.useState(0)

	React.useEffect(() => {
		let timeout = window.setTimeout(() => {
			setCount(0)
		}, 2000)

		if (count === 3) {
			window.location.reload()
		}

		return () => window.clearTimeout(timeout)
	}, [count])

	return (
		<div
			onClick={() => setCount(count => count + 1)}
			style={{ position: 'fixed', top: 0, right: 0, width: 100, height: 100 }}
		/>
	)
}

export default RefreshBtn