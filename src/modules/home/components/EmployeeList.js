import React from "react"
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import Employee from "./Employee"

const Wrapper = styled("div")`
	display: flex;
	padding: 20px 20px 40px 20px;
	height: 100%;
	flex: 1;
	overflow: auto;
`

const EmployeeList = ({ employees, history }) => {
	return (
		<Wrapper>
			{employees.map(employee => (
				<Employee
					employee={employee}
					key={employee.id}
					onClick={() => {
						history.push(`/sign-in/${employee.id}`)
					}}
				/>
			))}
		</Wrapper>
	)
}

export default withRouter(EmployeeList)
