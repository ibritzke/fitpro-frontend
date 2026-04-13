import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";

/* ================= STYLES ================= */

const Container = styled.div`
  padding: 24px 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Logo = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent.primary};
  color: #fff;
  font-size: 32px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 12px;
`;

const Name = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

const Sub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 24px;
`;

const Section = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
`;

const Switch = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme, $active }) =>
    $active ? theme.accent.primary : theme.bg.secondary};
  position: relative;
  border: none;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: ${({ $active }) => ($active ? "26px" : "4px")};
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

/* ================= TYPES ================= */

interface Trainer {
  id: string;
  name: string;
  logoUrl?: string;
}

/* ================= COMPONENT ================= */

const StudentProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const initials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  }, [user]);

  useEffect(() => {
    if (!user?.trainerId) return;

    api
      .get(`/trainers/${user.trainerId}`)
      .then((res) => setTrainer(res.data))
      .catch(() => setTrainer(null));
  }, [user]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.location.reload(); // simples e seguro
  };

  return (
    <Container>
      {trainer?.logoUrl && <Logo src={trainer.logoUrl} alt="Logo do personal" />}

      <Avatar>{initials}</Avatar>

      <Name>{user?.name}</Name>
      <Sub>Aluno de {trainer?.name || "Personal"}</Sub>

      <Section>
        <Row>
          <Label>Tema escuro</Label>
          <Switch $active={dark} onClick={toggleTheme} />
        </Row>
      </Section>

      <Section>
        <Button variant="secondary" fullWidth onClick={logout}>
          Sair da conta
        </Button>
      </Section>
    </Container>
  );
};

export default StudentProfile;