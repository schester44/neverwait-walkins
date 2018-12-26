import React from "react"
import styled from "styled-components"

import Service from "./ServiceCard"

const Wrapper = styled("div")`
	padding-top: 50px;
	padding: 20px 0;

	display: flex;
	flex-wrap: wrap;
	flex: 1;
	max-height: 42%;
	overflow: auto;
`

const ServiceSelector = ({ selectedService, services, onSelect }) => {
	return (
		<Wrapper>
			{services.map(service => {
				return (
					<Service
						key={`service-${service.id}`}
						onClick={() => onSelect(service)}
						service={service}
						selected={selectedService === service.id}
					/>
				)
			})}
		</Wrapper>
	)
}

const areEqual = (prevProps, nextProps) => prevProps.selectedService === nextProps.selectedService

export default React.memo(ServiceSelector, areEqual)
