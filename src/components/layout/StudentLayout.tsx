import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { BottomNav } from "./BottomNav";

/* ================= STYLES ================= */

const Wrapper = styled.div<{ $bg?: string }>`
  min-height: 100vh;
  padding: 16px;
  padding-bottom: calc(96px + env(safe-area-inset-bottom)); /* espaço do menu inferior */
  position: relative;

  background-color: ${({ theme }) => theme.bg.primary};

  /* Imagem do personal apenas como detalhe visual */
  ${({ $bg }) =>
    $bg &&
    `
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url(${$bg});
        background-repeat: no-repeat;
        background-position: center top 120px;
        background-size: 280px auto;
        opacity: 0.05; 
        pointer-events: none;
      }
    `}

  @media (min-width: 768px) {
    padding-bottom: 0;
  }
`;

/* ================= COMPONENT ================= */

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);

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

  return (
    <Wrapper $bg={logo || undefined}>
      {children}
      <BottomNav />
    </Wrapper>
  );
};
