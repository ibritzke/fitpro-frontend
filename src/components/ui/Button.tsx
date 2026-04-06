import styled, { css } from "styled-components";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;

  ${({ size = "md" }) =>
    size === "sm" && css`padding: 6px 12px; font-size: 12px;`}
  ${({ size = "md" }) =>
    size === "md" && css`padding: 10px 18px; font-size: 14px;`}
  ${({ size = "md" }) =>
    size === "lg" && css`padding: 13px 24px; font-size: 15px;`}

  ${({ fullWidth }) => fullWidth && css`width: 100%;`}

  ${({ variant = "primary", theme }) =>
    variant === "primary" && css`
      background: ${theme.accent.primary};
      color: #fff;
      &:hover { background: ${theme.accent.secondary}; }
      &:active { transform: scale(0.98); }
    `}

  ${({ variant, theme }) =>
    variant === "secondary" && css`
      background: ${theme.bg.secondary};
      color: ${theme.text.primary};
      border: 1px solid ${theme.border.light};
      &:hover { background: ${theme.bg.tertiary}; }
    `}

  ${({ variant, theme }) =>
    variant === "danger" && css`
      background: ${theme.accent.danger};
      color: #fff;
      &:hover { opacity: 0.9; }
    `}

  ${({ variant, theme }) =>
    variant === "ghost" && css`
      background: transparent;
      color: ${theme.text.secondary};
      &:hover { background: ${theme.bg.secondary}; color: ${theme.text.primary}; }
    `}

  ${({ loading }) =>
    loading && css`opacity: 0.7; cursor: not-allowed; pointer-events: none;`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;