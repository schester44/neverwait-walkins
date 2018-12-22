import React from "react"
import styled from "styled-components"

import EmployeeList from "../components/EmployeeList"

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	height: 100%;

	.header {
		padding: 0px 0 0 0;
		text-align: center;
		font-family: marguerite;

		h1 {
			padding-top: 80px;
			font-size: 120px;
			line-height: 1;
			color: rgba(242, 209, 116, 1.0);
		}
	}
`

const MultiResource = ({ employees }) => {	
	return (
		<Wrapper>
			<div className="header">
				<h1>Lorenzo's</h1>
			</div>

			<EmployeeList employees={employees} />
		</Wrapper>
	)
}

export default MultiResource
