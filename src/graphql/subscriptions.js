import gql from "graphql-tag"

export const APPOINTMENTS_SUBSCRIPTION = gql`
	subscription onAppointmentsChange($locationId: ID!) {
		AppointmentsChange(locationId: $locationId) {
			employeeId
			appointment {
				id
				status
				duration
				startTime
				endTime
			}
		}
	}
`
