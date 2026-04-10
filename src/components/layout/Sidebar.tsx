import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";

/**
 * Props recebidas do Layout
 * isOpen: controla visibilidade no mobile
 * onClose: fecha o drawer
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Overlay usado apenas no mobile.
 * Clicar fora da Sidebar fecha o menu.
 */
const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 260px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg.sidebar};
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
  z-index: 1000;

  /* Desktop */
  position: sticky;
  top: 0;

  /* Mobile: vira drawer */
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.div`
  padding: 0 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent.primary};
  letter-spacing: -0.5px;
`;

const NavSection = styled.nav`
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
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  &.active {
    background: ${({ theme }) => theme.accent.primary};
    color: #fff;
  }
`;

const SidebarBottom = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /**
   * Fecha a Sidebar no mobile ao navegar
   * (UX de app nativo)
   */
  const handleNavigate = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />

      <SidebarContainer isOpen={isOpen}>
        <Logo>FitPro</Logo>

        <NavSection>
          {user?.role === "ADMIN" && (
            <>
              <NavItem to="/admin/dashboard" onClick={handleNavigate}>
                Dashboard
              </NavItem>
              <NavItem to="/admin/trainers" onClick={handleNavigate}>
                Personais
              </NavItem>
            </>
          )}

          {user?.role === "TRAINER" && (
            <>
              <NavItem to="/trainer/dashboard" onClick={handleNavigate}>
                Dashboard
              </NavItem>
              <NavItem to="/trainer/students" onClick={handleNavigate}>
                Alunos
              </NavItem>
              <NavItem to="/trainer/categories" onClick={handleNavigate}>
                Categorias
              </NavItem>
              <NavItem to="/trainer/exercises" onClick={handleNavigate}>
                Exercícios
              </NavItem>
              <NavItem to="/trainer/workout-types" onClick={handleNavigate}>
                Tipos de Treino
              </NavItem>
              <NavItem to="/trainer/templates" onClick={handleNavigate}>
                Templates
              </NavItem>
            </>
          )}

          {user?.role === "STUDENT" && (
            <>
              <NavItem to="/student/today" onClick={handleNavigate}>
                Treino de Hoje
              </NavItem>
              <NavItem to="/student/history" onClick={handleNavigate}>
                Histórico
              </NavItem>
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
    </>
  );
};
