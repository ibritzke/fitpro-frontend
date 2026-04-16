import React, { useState } from "react";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
/**
 * Layout principal do app.
 * Estrutura em "App Shell", padrão usado por apps modernos:
 * - Sidebar fixa no desktop
 * - Layout fluido e centralizado
 * - Preparado para Sidebar móvel (drawer)
 */
const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg.card};

  /* Mobile: Sidebar deixa de ocupar espaço fixo */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Wrapper do conteúdo para permitir Header + Main.
 * Facilita evolução futura (breadcrumbs, top actions etc.)
 */
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

/**
 * Área principal de conteúdo.
 * Limite de largura dá sensação de "app profissional"
 * (Notion, Linear, Vercel, etc.)
 */
const Main = styled.main`
  flex: 1;
  width: 100%;
  padding: 24px;
  overflow-y: auto;

  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ContentWrapper>
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <Main>{children}</Main>
      </ContentWrapper>

      {/* Menu inferior somente no mobile */}
      <BottomNav />
    </LayoutContainer>
  );
};
