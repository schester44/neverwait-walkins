import React, { PureComponent } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { withRouter } from "react-router-dom"
import { withApollo } from "react-apollo"

import format from "date-fns/format"
import addMinutes from "date-fns/add_minutes"
import isAfter from "date-fns/is_after"

import { CREATE_CUSTOMER, UPSERT_APPOINTMENT } from "../../../graphql/mutations"

import { DB_DATE_STRING } from "../../../constants"
import ServiceSelector from "../components/ServiceSelector"
import CustomerForm from "../components/CustomerForm"
import FormButtons from "../components/FormButtons"
import { isBefore, subMinutes } from "date-fns"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Content = styled("div")`
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
`

const Header = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	h1 {
		padding-top: 20px;
		font-family: marguerite;
		font-size: 62px;
	}
`

class Form extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			page: 1,
			selectedService: undefined,
			isSubmitting: false,
			appointment: {
				userId: props.employeeId,
				locationId: props.locationId,
				services: []
			},
			customer: {
				firstName: "",
				lastName: ""
			}
		}

		this.allServices = props.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	}

	handleSubmit = async () => {
		this.setState({ isSubmitting: true })

		// Add up all service durations. We'll use this to calculate the endTime (startTime + duration = endTime)
		const duration = this.state.appointment.services.reduce((acc, id) => {
			return acc + this.allServices[id].duration
		}, 0)

		try {
			const {
				data: { CreateCustomer }
			} = await this.props.client.mutate({
				mutation: CREATE_CUSTOMER,
				variables: {
					input: this.state.customer
				}
			})

			if (!CreateCustomer.ok) {
				throw new Error("Failed to create the customer account. Please see the receptionist.")
			}

			const customerId = CreateCustomer.customer.id

			// We're adding duration + 4 minutes to each appointments endTime. if the new endTime is before the next appointments start time then we can assume there is a gap of at least N + 4 minutes. We should insert the employe there since theres room for the appointment.

			// sort by startTime so appointments are in the order of which they occur
			const sortedAppointments = [...this.props.appointments].sort(
				(a, b) => new Date(a.startTime) - new Date(b.startTime)
			)

			const lastAppt = sortedAppointments.find((appointment, index) => {
				if (index === sortedAppointments.length - 1) return true

				const next = sortedAppointments[index + 1]

				if (isBefore(addMinutes(appointment.endTime, duration + 4), next.startTime)) {
					console.log("found it", appointment.endTime, next.startTime, duration)
					return true
				}
			})

			const now = new Date()
			const checkInTime = format(now, DB_DATE_STRING)

			// If the appointment hasn't been completed or if its end time is after right now then it can be considered to still be in progress. If its still in progress than set the start time of this appointment to the endTime of the last appointment else set it to right now
			const startTime =
				!lastAppt || isBefore(lastAppt.endTime, subMinutes(now, 4))
					? checkInTime
					: format(addMinutes(lastAppt.endTime, 2), DB_DATE_STRING)

			const endTime = format(addMinutes(startTime, duration), DB_DATE_STRING)

			console.log({
				input: {
					...this.state.appointment,
					startTime,
					endTime,
					customerId
				}
			})

			const {
				data: { upsertAppointment }
			} = await this.props.client.mutate({
				mutation: UPSERT_APPOINTMENT,
				variables: {
					input: {
						...this.state.appointment,
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
			this.props.history.push({
				pathname: "/finished",
				appointment: upsertAppointment.appointment
			})
		} catch (error) {
			console.log("error", error)
			this.setState({ isSubmitting: false })
		}
	}

	handleInputChange = ({ target: { name, value } }) => {
		this.setState({
			customer: {
				...this.state.customer,
				[name]: value
			}
		})
	}

	handleServiceSelection = service => {
		this.setState({
			selectedService: service.id,
			appointment: {
				...this.state.appointment,
				services: [service.id]
			}
		})
	}

	incrementPage = () => {
		this.setState({ page: this.state.page + 1 })
	}

	decrementPage = () => {
		if (this.state.page === 1) {
			return this.props.history.push("/")
		}

		this.setState({ page: this.state.page - 1 })
	}

	handleNextButton = () => {
		if (this.state.isSubmitting) return

		if (this.state.page === 1) {
			this.incrementPage()
		} else {
			this.handleSubmit()
		}
	}

	render() {
		const buttonDisabled =
			this.state.page === 1 ? this.state.customer.firstName.length === 0 : this.state.appointment.services.length === 0

		return (
			<Wrapper>
				<Header>
					<h1>Lorenzo's</h1>
				</Header>

				<Content>
					{this.state.page === 1 ? (
						<CustomerForm fields={this.state.customer} onInputChange={this.handleInputChange} />
					) : (
						<ServiceSelector
							services={this.props.services}
							selectedService={this.state.selectedService}
							onSelect={this.handleServiceSelection}
						/>
					)}

					<FormButtons
						disabled={buttonDisabled}
						submitting={this.state.isSubmitting}
						page={this.state.page}
						onNextButtonClick={this.handleNextButton}
						onBackButtonClick={this.decrementPage}
					/>
				</Content>
			</Wrapper>
		)
	}
}

export default compose(
	withRouter,
	withApollo
)(Form)
