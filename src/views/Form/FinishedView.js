import React from 'react'
import { useHistory, Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'

import Button from '../../components/Button'

const Wrapper = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.estimated-time {
		margin-bottom: 50px;
		color: white;

		span {
			color: red;
		}
	}
`

const Header = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	h1 {
		padding-top: 20px;
		color: rgba(242, 209, 116, 1);

		${({ isLorenzo }) =>
			isLorenzo
				? `
			font-family: marguerite;
			font-size: 62px;
		`
				: `
			font-family: Domus;
			font-size: 48px;
		`}
	}
`

const Content = styled('div')`
	position: relative;
	width: 90%;
	flex: 1;
	display: flex;
	flex-direction: column;
	text-align: center;

	.body {
		padding-top: 50px;
	}

	.finished-btn {
		position: absolute;
		bottom: 25px;
		left: 0;
		width: 100%;
	}

	h1 {
		margin-bottom: 50px;
		font-size: 3em;
	}

	p {
		opacity: 0.8;
		line-height: 1;
		font-size: 40px;

		span {
			font-size: 30px;
			opacity: 0.6;
		}
	}
`

const vowels = {
	a: true,
	e: true,
	i: true,
	o: true,
	u: true,
}

const Finished = ({ location: { company, settings } }) => {
	console.log('[FinishedView]')

	const history = useHistory()

	const { appointment } = history.location.state

	React.useEffect(() => {
		const timeout = window.setTimeout(() => {
			history.push('/')
		}, 30000)

		return () => window.clearTimeout(timeout)
	})

	if (!appointment) {
		return <Redirect to="/" />
	}

	return (
		<Wrapper>
			<Header isLorenzo={company.name === `Lorenzo's`}>
				<h1>{company.name}</h1>
			</Header>

			<Content>
				<div className="body">
					<p style={{ textAlign: 'center', color: 'rgba(45, 240, 163, 1.0)' }}>Success!</p>

					<p style={{ textAlign: 'center' }}>
						<span>
							You have created
							{vowels[appointment.services[0].name.charAt(0).toLowerCase()] ? ' an ' : ' a '}
						</span>
						<br />
						{appointment.services[0].name} appointment
						<br />
						<span>with {appointment.employee.firstName}.</span>
					</p>

					<h1 style={{ margin: '50px 0', color: 'white' }}>
						You can expect to be in the chair around:
						<span style={{ color: 'rgba(242, 209, 116, 1)' }}>
							{' '}
							{format(appointment.startTime, 'h:mma')}.
						</span>
					</h1>

					{settings.walkins.confirmationText && (
						<p style={{ lineHeight: 1.3 }}>{settings.walkins.confirmationText}</p>
					)}
				</div>

				<Link to="/">
					<Button className="finished-btn">Finish</Button>
				</Link>
			</Content>
		</Wrapper>
	)
}

export default Finished
