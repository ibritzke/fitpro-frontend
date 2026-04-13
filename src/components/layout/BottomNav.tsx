
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  height: 60px;
  background: ${({ theme }) => theme.bg.card};
  border-top: 1px solid ${({ theme }) => theme.border.light};

  display: flex;
  justify-content: space-around;
  align-items: center;

  z-index: 100;

  /* SOME NO DESKTOP */
  @media (min-width: 768px) {
    display: none;
  }
`;

const Item = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.accent.primary};
  }
`;

const Icon = styled.span`
  font-size: 20px;
`;

export const BottomNav = () => {
  return (
    <Nav>
      <Item to="/student/home">
        <Icon>🏠</Icon>
        Início
      </Item>

      <Item to="/student/week">
        <Icon>📅</Icon>
        Semana
      </Item>

      <Item to="/student/today">
        <Icon>▶️</Icon>
        Hoje
      </Item>

      <Item to="/student/history">
        <Icon>📊</Icon>
        Histórico
      </Item>

      <Item to="/student/profile">
        <Icon>👤</Icon>
        Perfil
      </Item>
    </Nav>
  );
};
