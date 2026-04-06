import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: ${({ theme }) => theme.bg.secondary};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  transition: border 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  background: ${({ theme }) => theme.bg.secondary};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent.primary};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  background: ${({ theme }) => theme.bg.secondary};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent.primary};
  }
`;