import gql from "graphql-tag"

export const LOCATION_QUERY = gql`
	query LocationQuery($startTime: String!, $endTime: String!) {
		location {
			id
			name
			employees(input: { where: { bookingEnabled: true } }) {
				id
				firstName
				services {
					id
					name
					price
					duration
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
			}
		}
	}
`
