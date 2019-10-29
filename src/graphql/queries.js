import gql from 'graphql-tag'

export const locationDataQuery = gql`
	query LocationQuery($startTime: String!, $endTime: String!) {
		location {
			company {
				name
			}
			id
			name
			employees(input: { where: { bookingEnabled: true } }) {
				id
				firstName
				services {
					id
					name
					sources(input: { where: { type: "default" } }) {
						price
						duration
					}
				}
				appointments(
					input: { where: { status: { not: "completed" }, startTime: { gte: $startTime }, endTime: { lte: $endTime } } }
				) {
					id
					status
					duration
					startTime
					endTime
				}
				blockedTimes(input: { where: { startTime: { gte: $startTime }, endTime: { lte: $endTime } } }) {
					id
					startTime
					endTime
				}
			}
		}
	}
`

export const searchCustomers = gql`
	query searchCustomers($input: CustomerSearchInput!) {
		searchCustomers(input: $input) {
			id
			firstName
			lastName
			appointments {
				past {
					id
					services {
						id
					}
				}
			}
		}
	}
`
