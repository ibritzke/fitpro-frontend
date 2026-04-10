import React from "react";
import styled from "styled-components";

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
}

const HeaderContainer = styled.header`
  height: 56px;
 background: ${({ theme }) => theme.bg.primary};
  border-bottom: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;

  @media (min-width: 769px) {
    height: 64px;
    padding: 0 24px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuButton = styled.button`
  font-size: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <HeaderContainer>
      <Left>
        <MenuButton onClick={onMenuClick}>☰</MenuButton>
        {title && <Title>{title}</Title>}
      </Left>

      <Right>{/* futuras ações/avatar */}</Right>
    </HeaderContainer>
  );
};
