import styled from "styled-components";

interface AvatarProps {
  name: string;
  onClick?: () => void;
}

const Circle = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: ${({ theme }) => theme.accent.primary};
  color: #fff;
  border: none;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const Avatar = ({ name, onClick }: AvatarProps) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return <Circle onClick={onClick}>{initials}</Circle>;
};
