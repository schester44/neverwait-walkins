import React, { useState } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { withRouter, Link } from "react-router-dom"
import { withApollo } from "react-apollo"

import format from "date-fns/format"
import addMinutes from "date-fns/add_minutes"

import { createCustomerMutation, upsertAppointmentMutation } from "../../graphql/mutations"
import getLastAppointment from "./utils/getLastAppointment"
import determineStartTime from "./utils/determineStartTime"

import ServiceSelector from "../../components/ServiceSelector"
import Input from "../../components/Input"
import Button from "../../components/Button"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Content = styled("div")`
	position: relative;
	width: 90%;
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-top: 25px;

	.button {
		position: absolute;
		bottom: 25px;
		left: 0;
		width: 100%;
	}

	h1 {
		font-weight: 100;
	}
`

const Header = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	a {
		text-decoration: none !important;
	}
	
	h1 {
		padding-top: 20px;
		font-family: marguerite;
		font-size: 62px;
		color: rgba(242, 209, 116, 1);
	}
`

const RootContainer = ({
	client,
	history,
	appointments = [],
	blockedTimes = [],
	employeeId,
	locationId,
	services = []
}) => {
	const [appointment, setAppointment] = useState({ userId: employeeId, locationId, services: [] })
	const [customer, setCustomer] = useState({ firstName: "Checkin App", contactNumber: "" })

	const [state, setState] = useState({
		isSubmitting: false,
		services: services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {}),
		selectedService: undefined
	})

	const btnDisabled = customer.contactNumber.length < 10 || !state.selectedService

	const handleSubmit = async () => {
		setState({ ...state, isSubmitting: true })

		// Add up all service durations. We'll use this to calculate the endTime (startTime + duration = endTime)
		const duration = appointment.services.reduce((acc, id) => {
			return acc + state.services[id].duration
		}, 0)

		try {
			const {
				data: { CreateCustomer }
			} = await client.mutate({
				mutation: createCustomerMutation,
				variables: {
					input: customer
				}
			})

			if (!CreateCustomer.ok) {
				throw new Error("Failed to create the customer account. Please see the receptionist.")
			}

			const lastAppt = getLastAppointment([...appointments, ...blockedTimes])
			const startTime = determineStartTime(lastAppt)
			const endTime = format(addMinutes(startTime, duration))
			const customerId = CreateCustomer.customer.id

			const {
				data: { upsertAppointment }
			} = await client.mutate({
				mutation: upsertAppointmentMutation,
				variables: {
					input: {
						...appointment,
						startTime,
						endTime,
						customerId
					}
				}
			})

			if (!upsertAppointment.ok) {
				throw new Error("Failed to create the appointment. Please see the receptionist.")
			}

			// show the Finished route and pass the appointment as route state so we can show the estimated start time
			history.push({ pathname: "/finished", appointment: upsertAppointment.appointment })
		} catch (error) {
			console.log("error", error)
			setState({ ...state, isSubmitting: true })
		}
	}

	return (
		<Wrapper>
			<Header>
				<Link to="/">
					<h1>Lorenzo's</h1>
				</Link>
			</Header>

			<Content>
				<h1>1. ENTER YOUR PHONE NUMBER</h1>
				<div className="form-input">
					<Input
						placeholder="Phone Number"
						type="number"
						pattern="\d*"
						name="contactNumber"
						value={customer.contactNumber}
						onChange={({ target: { value } }) => setCustomer({ ...customer, contactNumber: value })}
					/>
				</div>
				<h1 style={{ marginTop: 35 }}>2. SELECT A SERVICE</h1>

				<ServiceSelector
					services={services}
					selectedService={state.selectedService}
					onSelect={({ id }) => {
						setState({ ...state, selectedService: id })
						setAppointment({ ...appointment, services: [id] })
					}}
				/>

				<div className="button">
					<Button onClick={handleSubmit} disabled={btnDisabled}>
						{btnDisabled
							? customer.contactNumber.length < 10
								? "Enter valid phone number"
								: !state.selectedService
								? "Select a service"
								: "Form incomplete"
							: "Check In"}
					</Button>
				</div>
			</Content>
		</Wrapper>
	)
}

export default compose(
	withRouter,
	withApollo
)(RootContainer)
