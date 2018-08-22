import React from "react"
import styled from "styled-components"

import Input from "../../../components/Input"

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	padding-top: 50px;

	h1 {
		margin: 20px 0;
		font-weight: 100;
		text-align: center;
	}

	.buttons {
		width: 80%;
	}

	.form {
		width: 90%;
		background: rgba(69, 69, 82, 1);
		padding: 20px 40px;
		border-radius: 5px;
		box-shadow: 0px 2px 10px rgba(32, 32, 32, 0.5);
	}

	.form-input {
		width: 100%;
	}
`

const CustomerForm = ({ onInputChange, fields }) => {
	return (
		<Wrapper>
			<div className="form">
				<h1>ENTER YOUR NAME</h1>
				<div className="form-input">
					<Input label="First Name" type="text" name="firstName" value={fields.firstName} onChange={onInputChange} />
				</div>

				<div className="form-input">
					<Input label="Last Name" type="text" name="lastName" value={fields.lastName} onChange={onInputChange} />
				</div>
			</div>
		</Wrapper>
	)
}

export default CustomerForm
