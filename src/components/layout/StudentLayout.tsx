import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { BottomNav } from "./BottomNav";
import { useNavigate } from "react-router-dom";

/* ================= STYLES ================= */

const Wrapper = styled.div<{ $bg?: string }>`
  min-height: 100vh;
  padding: 16px;
  padding-bottom: calc(
    96px + env(safe-area-inset-bottom)
  );
  position: relative;
  z-index: 0;
  background-color: ${({ theme }) => theme.bg.primary};

  ${({ $bg }) =>
    $bg &&
    `
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background-image: url(${$bg});
        background-repeat: no-repeat;
        background-position: center top 120px;
        background-size: 280px auto;
        opacity: 0.05;
        pointer-events: none;
      }
    `}

  @media (min-width: 769px) {
    padding-bottom: 24px;
    padding-top: 0;
  }
`;

const DesktopShell = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    min-height: 100vh;
    background: ${({ theme }) => theme.bg.primary};
  }
`;

const DesktopSidebar = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg.sidebar};
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow-y: auto;
`;

const SidebarLogo = styled.div`
  padding: 0 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent.primary};
`;

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
`;

const SidebarLink = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? "#fff" : "#888")};
  background: ${({ theme, $active }) =>
    $active ? theme.accent.primary : "transparent"};
  border: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.accent.primary : "rgba(255,255,255,0.06)"};
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

const SidebarBottomBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #888;
  background: transparent;
  border: none;
  text-align: left;
  width: 100%;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.06);
    color: #fff;
  }
`;

const DesktopContent = styled.main<{ $bg?: string }>`
  flex: 1;
  padding: 32px;
  max-width: 860px;
  width: 100%;
  position: relative;
  z-index: 0;

  ${({ $bg }) =>
    $bg &&
    `
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background-image: url(${$bg});
        background-repeat: no-repeat;
        background-position: center top 120px;
        background-size: 280px auto;
        opacity: 0.05;
        pointer-events: none;
      }
    `}
`;

const MobileOnly = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

/* ================= COMPONENT ================= */

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string | null>(null);

  const currentPath = window.location.pathname;

  const navItems = [
    { label: "🏠 Início", path: "/student/home" },
    { label: "📅 Semana", path: "/student/week" },
    { label: "▶️ Hoje", path: "/student/today" },
    { label: "📊 Histórico", path: "/student/history" },
    { label: "👤 Perfil", path: "/student/profile" },
  ];

  useEffect(() => {
    if (!user?.trainerId) return;

    api
      .get(`/trainers/${user.trainerId}`)
      .then((res) => {
        if (res.data?.logoUrl) {
          setLogo(res.data.logoUrl);
        }
      })
      .catch(() => setLogo(null));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* DESKTOP */}
      <DesktopShell>
        <DesktopSidebar>
          <SidebarLogo>FitPro</SidebarLogo>
          <SidebarNav>
            {navItems.map((item) => (
              <SidebarLink
                key={item.path}
                $active={currentPath === item.path}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </SidebarLink>
            ))}
          </SidebarNav>
          <SidebarBottom>
            <SidebarBottomBtn onClick={toggleTheme}>
              {isDark ? "☀ Modo claro" : "☾ Modo escuro"}
            </SidebarBottomBtn>
            <SidebarBottomBtn onClick={handleLogout}>
              ⎋ Sair
            </SidebarBottomBtn>
          </SidebarBottom>
        </DesktopSidebar>
        <DesktopContent $bg={logo || undefined}>{children}</DesktopContent>
      </DesktopShell>

      {/* MOBILE */}
      <MobileOnly>
        <Wrapper $bg={logo || undefined}>
          {children}
          <BottomNav />
        </Wrapper>
      </MobileOnly>
    </>
  );
};
