import React from "react";
import { BeatLoader } from "react-spinners";
import styled from "styled-components";

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoadingSpinner = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <SpinnerWrapper>
        <BeatLoader color="#84cc16" size={15} margin={10} margin-bottom={10} />
      </SpinnerWrapper>
    );
  }

  return children;
};

export default LoadingSpinner;
