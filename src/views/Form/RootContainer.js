import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useParams, Link } from 'react-router-dom'
import { useMutation, useLazyQuery } from '@apollo/client'

import { produce } from 'immer'
import { FiArrowLeft } from 'react-icons/fi'

import { searchCustomers as searchCustomersQuery } from '../../graphql/queries'
import {
	findOrCreateCustomerMutation,
	createWalkinAppointmentMutation
} from '../../graphql/mutations'

import ServiceSelector from '../../components/ServiceSelector'
import Input from '../../components/Input'
import Button from '../../components/Button'

const Wrapper = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;

	.action-button {
		position: fixed;
		background: rgba(25, 30, 33, 1);
		left: 0;
		width: 100%;
		bottom: 0;
		z-index: 99999;
		padding: 20px;
	}
`

const Content = styled('div')`
	position: relative;
	width: 90%;
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-top: 15px;

	h1 {
		font-weight: 100;
	}
`

const Header = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	a {
		text-decoration: none !important;
	}

	.back-btn {
		color: #fff;
		font-size: 48px;
		position: fixed;
		top: 16px;
		left: 16px;
	}

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

const ActiveCustomer = styled('div')`
	width: 100%;
	text-align: center;
	font-size: 40px;
	color: white;
	padding-top: 40px;
	padding-bottom: 25px;
`

const RootContainer = ({ company, employees, locationId }) => {
	const { employeeId } = useParams()
	console.log('[Form RootContainer]')

	const [findOrCreateCustomer, { loading: customerLoading }] = useMutation(
		findOrCreateCustomerMutation
	)
	const [createAppointment, { loading: upsertLoading }] = useMutation(
		createWalkinAppointmentMutation
	)

	const [
		searchCustomers,
		{ data: { searchCustomers: customerSearchResults = [] } = {} }
	] = useLazyQuery(searchCustomersQuery)

	const employee = employees.find(emp => Number(emp.id) === Number(employeeId))
	const history = useHistory()

	const services = employee.services || []

	const [state, setState] = useState({
		customer: {
			firstName: '',
			lastName: '',
			phoneNumber: ''
		},
		appointment: {
			userId: employeeId,
			locationId,
			services: []
		},
		selectedServicesCount: {},
		selectedServiceIds: {}
	})

	const activeCustomer =
		state.customer.phoneNumber.length === 10 ? customerSearchResults[0] : undefined

	React.useEffect(() => {
		setState(prevState => {
			return produce(prevState, draftState => {
				if (!activeCustomer) {
					// if the activecustomer changes and there isn't one then reset the services
					draftState.appointment.services = []
					draftState.selectedServiceIds = {}
					draftState.selectedServicesCount = {}
				}
			})
		})
	}, [activeCustomer])

	useEffect(() => {
		if (state.customer.phoneNumber.length < 10) return

		searchCustomers({
			variables: {
				input: {
					term: state.customer.phoneNumber
				}
			}
		})
	}, [searchCustomers, state.customer])

	const handleSubmit = async () => {
		let customerId = (activeCustomer || {}).id

		if (!customerId) {
			const { data } = await findOrCreateCustomer({
				variables: {
					input: { ...state.customer, acceptsMarketing: true, appointmentNotifications: 'sms' }
				}
			})

			customerId = data?.findOrCreateCustomer?.id
		}

		const { data } = await createAppointment({
			mutation: createWalkinAppointmentMutation,
			variables: {
				input: {
					...state.appointment,
					customerId
				}
			}
		})

		// show the Finished route and pass the appointment as route state so we can show the estimated start time
		history.push({ pathname: '/finished', state: { appointment: data.createWalkinAppointment } })
	}

	const btnDisabled =
		// need a valid phone number
		state.customer.phoneNumber.length < 10 ||
		// require a name if there isn't a found customer
		(!activeCustomer && state.customer.firstName.length === 0) ||
		// need services
		state.appointment.services.length === 0 ||
		// load states
		customerLoading ||
		upsertLoading

	return (
		<Wrapper>
			<Header isLorenzo={company.name === `Lorenzo's`}>
				<Link to="/">
					<FiArrowLeft className="back-btn" />
					<h1>{company.name}</h1>
				</Link>
			</Header>

			<Content>
				<h1>1. ENTER YOUR INFO</h1>
				<div className="form-input">
					<Input
						placeholder="Phone Number"
						type="number"
						pattern="\d*"
						name="phoneNumber"
						value={state.customer.phoneNumber}
						onChange={({ target: { value } }) => {
							setState(prevState =>
								produce(prevState, draftState => {
									if (value.length <= 10) {
										draftState.customer.phoneNumber = value
									}
								})
							)
						}}
					/>
				</div>

				{!activeCustomer && (
					<div className="form-input" style={{ display: 'flex' }}>
						<Input
							placeholder="First Name"
							type="text"
							name="firstName"
							style={{ marginRight: 10 }}
							value={state.customer.firstName}
							onChange={({ target: { value } }) => {
								setState(prevState =>
									produce(prevState, draftState => {
										draftState.customer.firstName = value
									})
								)
							}}
						/>

						<Input
							placeholder="Last Name"
							type="text"
							name="lastName"
							value={state.customer.lastName}
							onChange={({ target: { value } }) => {
								setState(prevState =>
									produce(prevState, draftState => {
										draftState.customer.lastName = value
									})
								)
							}}
						/>
					</div>
				)}
				{activeCustomer && (
					<ActiveCustomer>Welcome back, {activeCustomer.firstName}!</ActiveCustomer>
				)}
				<h1 style={{ marginTop: 15, marginBottom: 15 }}>2. SELECT A SERVICE</h1>

				<ServiceSelector
					services={services}
					appointmentServices={state.appointment.services}
					selectedServices={state.selectedServiceIds}
					quantities={state.selectedServicesCount}
					onIncreaseQuantity={({ id }) => {
						setState(prev =>
							produce(prev, draft => {
								const index = prev.appointment.services.findIndex(
									service => Number(service.id) === Number(id)
								)

								draft.appointment.services[index].quantity++
								draft.selectedServicesCount[id]++
							})
						)
					}}
					onDecreaseQuantity={({ id }) => {
						setState(prev =>
							produce(prev, draft => {
								const index = prev.appointment.services.findIndex(
									service => Number(service.id) === Number(id)
								)

								if (prev.selectedServicesCount[id] !== 1) {
									draft.appointment.services[index].quantity--
									draft.selectedServicesCount[id]--
								}
							})
						)
					}}
					onSelect={({ id }) => {
						setState(prevState => {
							return produce(prevState, draftState => {
								const indexOfExisting = prevState.appointment.services.findIndex(
									service => Number(service.id) === Number(id)
								)

								if (indexOfExisting >= 0) {
									draftState.appointment.services.splice(indexOfExisting, 1)
									delete draftState.selectedServiceIds[id]
									delete draftState.selectedServicesCount[id]
								} else {
									draftState.appointment.services.push({ id, quantity: 1 })
									draftState.selectedServiceIds[id] = true
									draftState.selectedServicesCount[id] = 1
								}
							})
						})
					}}
				/>
			</Content>

			<div className="action-button">
				<Button style={{ margin: 0 }} onClick={handleSubmit} disabled={btnDisabled}>
					{btnDisabled
						? upsertLoading
							? 'Submitting'
							: state.customer.phoneNumber.length < 10
							? 'Enter valid phone number'
							: state.appointment.services.length === 0
							? 'Select a service'
							: 'Form incomplete'
						: 'Check In'}
				</Button>
			</div>
		</Wrapper>
	)
}

export default RootContainer
