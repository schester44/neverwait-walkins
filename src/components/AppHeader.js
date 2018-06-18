import React, { Component } from "react"
import styled from "styled-components"
import format from "date-fns/format"

const Wrapper = styled("div")`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 50px 100px;
	width: 100%;
	opacity: 0.2;

	h1 {
		font-family: "marguerite";
	}

	.date-and-time {
		text-align: right;
		.date {
			font-size: 20px;
		}

		.time {
			font-size: 32px;
		}
	}
`

class AppHeader extends Component {
	state = {
		time: new Date()
	}

	componenDidMount() {
		this.timer = setInterval(() => {
			this.setState({ time: new Date() })
		}, 1000 * 60)
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextState.time !== this.state.time
	}

	componentWillUnmount() {
		if (this.timer) clearInterval(this.timer)
	}

	render() {
		return (
			<Wrapper>
				<div className="date-and-time">
					<div className="date">{format(this.state.time, "dddd, MMMM Do")}</div>
					<div className="time">{format(this.state.time, "hh:mma")}</div>
				</div>
			</Wrapper>
		)
	}
}

export default AppHeader
