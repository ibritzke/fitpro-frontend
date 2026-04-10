/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input, Label, InputWrapper } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";

/* ================= LAYOUT ================= */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg.tertiary};
  padding: 16px;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 400px;

  @media (min-width: 769px) {
    padding: 40px;
  }
`;

/* ================= HEADER ================= */

const Logo = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent.primary};
  margin-bottom: 6px;

  @media (min-width: 769px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 28px;
`;

/* ================= TABS ================= */

const Tabs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  background: ${({ $active, theme }) =>
    $active ? theme.bg.card : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.text.primary : theme.text.tertiary};

  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.border.light : "transparent"};
`;

/* ================= FORM ================= */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.accent.danger};
  background: ${({ theme }) => `${theme.accent.danger}15`};
  padding: 10px 14px;
  border-radius: 8px;
`;

/* ================= COMPONENT ================= */

const Login: React.FC = () => {
  const [tab, setTab] = useState<"trainer" | "student">("trainer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, studentLogin, user } = useAuth();
  const navigate = useNavigate();

  /* ===== LÓGICA ORIGINAL (NÃO ALTERADA) ===== */

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (user.role === "TRAINER") {
      navigate("/trainer/dashboard");
    } else {
      navigate("/student/today");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "trainer") {
        await login(email, password);
      } else {
        await studentLogin(code);
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const error = err as any;
        setError(
          error.response?.data?.error || "Erro ao fazer login",
        );
      } else {
        setError("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= JSX ================= */

  return (
    <Container>
      <Box>
        <Logo>FitPro</Logo>
        <Subtitle>Plataforma de treinos personalizados</Subtitle>

        <Tabs>
          <Tab
            $active={tab === "trainer"}
            onClick={() => setTab("trainer")}
            type="button"
          >
            Personal / Admin
          </Tab>
          <Tab
            $active={tab === "student"}
            onClick={() => setTab("student")}
            type="button"
          >
            Aluno
          </Tab>
        </Tabs>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {tab === "trainer" ? (
            <>
              <InputWrapper>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <Label>Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </InputWrapper>
            </>
          ) : (
            <InputWrapper>
              <Label>Código de acesso</Label>
              <Input
                type="text"
                placeholder="Cole o código enviado pelo seu personal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </InputWrapper>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default Login;