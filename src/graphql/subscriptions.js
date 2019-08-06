import gql from "graphql-tag"

export const blockedTimesSubscription = gql`
	subscription onBlockedTimeChange($locationId: ID!) {
		BlockedTimeChange(locationId: $locationId) {
			employeeId
			deleted
			blockedTime {
				id
				startTime
				endTime
			}
		}
	}
`

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
