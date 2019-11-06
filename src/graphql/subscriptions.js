import { gql } from '@apollo/client'

export const appointmentsSubscription = gql`
	subscription onAppointmentsChange($locationId: ID!) {
		AppointmentsChange(locationId: $locationId) {
			employeeId
			isNewRecord
			appointment {
				id
				deleted
				status
				duration
				startTime
				endTime
			}
		}
	}
`
