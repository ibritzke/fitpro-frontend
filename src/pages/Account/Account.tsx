import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../../components/ui/Button";

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <Container>
      <Title>Conta</Title>

      <Card>
        <p>
          <strong>Usuário:</strong> {user?.name}
        </p>
        <p>
          <strong>Papel:</strong> {user?.role}
        </p>
      </Card>

      <Card>
        <Button variant="secondary" onClick={toggleTheme}>
          {isDark ? "☀ Mudar para modo claro" : "☾ Mudar para modo escuro"}
        </Button>
      </Card>

      <Card>
        <Button variant="danger" onClick={logout}>
          ⎋ Sair da conta
        </Button>
      </Card>
    </Container>
  );
};

export default Account;