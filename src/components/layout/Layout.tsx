import React from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <Main>{children}</Main>
    </LayoutContainer>
  );
};