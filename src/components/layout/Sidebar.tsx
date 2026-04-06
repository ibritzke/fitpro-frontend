import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";

const SidebarContainer = styled.aside`
  width: 220px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg.sidebar};
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
`;

const Logo = styled.div`
  padding: 0 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent.primary};
  letter-spacing: -0.5px;
`;

const NavSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #888;
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }

  &.active {
    background: ${({ theme }) => theme.accent.primary};
    color: #fff;
  }
`;

const SidebarBottom = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BottomBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #888;
  width: 100%;
  transition: all 0.15s;
  text-align: left;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }
`;

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarContainer>
      <Logo>FitPro</Logo>

      <NavSection>
        {user?.role === "ADMIN" && (
          <>
            <NavItem to="/admin/dashboard">Dashboard</NavItem>
            <NavItem to="/admin/trainers">Personais</NavItem>
          </>
        )}

        {user?.role === "TRAINER" && (
          <>
            <NavItem to="/trainer/dashboard">Dashboard</NavItem>
            <NavItem to="/trainer/students">Alunos</NavItem>
            <NavItem to="/trainer/categories">Categorias</NavItem>
            <NavItem to="/trainer/exercises">Exercícios</NavItem>
            <NavItem to="/trainer/workout-types">Tipos de Treino</NavItem>
            <NavItem to="/trainer/templates">Templates</NavItem>
          </>
        )}

        {user?.role === "STUDENT" && (
          <>
            <NavItem to="/student/today">Treino de Hoje</NavItem>
            <NavItem to="/student/history">Histórico</NavItem>
          </>
        )}
      </NavSection>

      <SidebarBottom>
        <BottomBtn onClick={toggleTheme}>
          {isDark ? "☀ Modo claro" : "☾ Modo escuro"}
        </BottomBtn>
        <BottomBtn onClick={handleLogout}>⎋ Sair</BottomBtn>
      </SidebarBottom>
    </SidebarContainer>
  );
};