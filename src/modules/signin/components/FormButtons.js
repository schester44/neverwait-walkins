import React from "react"
import styled from "styled-components"

const SecondaryButton = styled("div")`
	width: 80%;
	padding: 10px;
	margin: 0px auto 15px auto;
	border: 0;
	background: transparent;
	color: rgba(97, 178, 249, 1);
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
`

const PrimaryButton = styled("div")`
	width: 80%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: rgba(97, 178, 249, 1);
	color: rgba(40, 64, 91, 1);
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
	box-shadow: 0px 2px 10px rgba(32, 32, 32, 0.5);

	${props =>
		props.disabled &&
		`
		background: transparent;
		border: 2px solid #ccc;
		color: #ccc;
	`};
`

const FormButtons = ({ disabled, submitting, page, onNextButtonClick, onBackButtonClick }) => {
	return (
		<div>
			{!disabled && (
				<PrimaryButton submitting={submitting} onClick={onNextButtonClick}>
					{page === 1 ? "NEXT" : "CHECK IN"}
				</PrimaryButton>
			)}

			<SecondaryButton onClick={onBackButtonClick}>BACK</SecondaryButton>
		</div>
	)
}

export default FormButtons
