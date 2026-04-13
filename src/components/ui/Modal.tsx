
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 420px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;
