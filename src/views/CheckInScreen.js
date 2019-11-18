import React from "react";
import styled from "styled-components";

import EmployeeList from "../components/EmployeeList";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    padding: 0px 0 0 0;
    text-align: center;

    h1 {
      padding-top: 80px;
      font-size: 60px;
      line-height: 1;
      color: rgba(242, 209, 116, 1);
    }
  }

  ${({ isLorenzo }) =>
    isLorenzo
      ? `
		.header {
			font-family: marguerite;

			h1 {
				font-size: 120px;
			}
		}
	`
      : `
		.header {
			font-family: Domus;
		}
	`}
`;

export const Config = styled("div")`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 34px;
  text-align: center;
`;

const configPlaceholder = (
  <Config>
    Your account is not configured correctly to work with this app.
    <p style={{ fontSize: 24, marginTop: 7, textAlign: "center" }}>
      Have you assigned staff members to this location? Also, at least one staff
      account needs the "Booking" setting enabled, as well as a service assigned
      to them.
    </p>
  </Config>
);

const MultiResource = ({
  employees,
  location,
  firstAvailableStack,
  setFirstAvailableStack
}) => {
  const isLorenzo = location.company.name === `Lorenzo's`;

  return (
    <Wrapper isLorenzo={isLorenzo}>
      <div className="header">
        <h1>{location.company.name}</h1>
      </div>

      {employees.length === 0 ? (
        configPlaceholder
      ) : (
        <EmployeeList
          isFirstAvailableButtonEnabled={
            location?.settings?.walkins?.isFirstAvailableButtonEnabled || false
          }
          firstAvailableStack={firstAvailableStack}
          setFirstAvailableStack={setFirstAvailableStack}
          employees={employees}
        />
      )}
    </Wrapper>
  );
};

export default MultiResource;
