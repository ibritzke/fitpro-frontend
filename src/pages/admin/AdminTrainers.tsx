import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, InputWrapper, Label } from "../../components/ui/Input";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`font-size: 22px; font-weight: 600;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const UserCard = styled(Card)`padding: 16px;`;
const Name = styled.p`font-weight: 500; margin-bottom: 4px;`;
const Email = styled.p`font-size: 12px; color: ${({ theme }) => theme.text.secondary}; margin-bottom: 8px;`;

const Meta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 10px;
`;

const CardActions = styled.div`display: flex; gap: 8px; margin-top: 10px;`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  background: ${({ active, theme }) => active ? theme.accent.success + "20" : theme.accent.danger + "20"};
  color: ${({ active, theme }) => active ? theme.accent.success : theme.accent.danger};
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalBox = styled(Card)`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`font-size: 17px; font-weight: 600;`;
const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.accent.danger};
  background: ${({ theme }) => theme.accent.danger}15;
  padding: 10px 14px;
  border-radius: 8px;
`;

interface Trainer {
  id: string;
  name: string;
  email: string;
  status: string;
  lastLogin?: string;
  _count: { students: number };
}

const AdminTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrainers = () => {
    api.get("/admin/trainers").then((res) => setTrainers(res.data));
  };

  useEffect(() => { fetchTrainers(); }, []);

  const createTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/admin/trainers", { name, email, password });
      setName(""); setEmail(""); setPassword("");
      setShowModal(false);
      fetchTrainers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar personal");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/admin/trainers/${id}/status`);
    fetchTrainers();
  };

  return (
    <div>
      <Header>
        <PageTitle>Personais</PageTitle>
        <Button onClick={() => setShowModal(true)}>+ Novo personal</Button>
      </Header>

      <Grid>
        {trainers.map((t) => (
          <UserCard key={t.id}>
            <Badge active={t.status === "ACTIVE"} style={{ float: "right" }}>
              {t.status === "ACTIVE" ? "Ativo" : "Inativo"}
            </Badge>
            <Name>{t.name}</Name>
            <Email>{t.email}</Email>
            <Meta>
              {t._count.students} aluno{t._count.students !== 1 ? "s" : ""} ·{" "}
              {t.lastLogin
                ? `Último acesso: ${new Date(t.lastLogin).toLocaleDateString("pt-BR")}`
                : "Nunca acessou"}
            </Meta>
            <CardActions>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleStatus(t.id)}
              >
                {t.status === "ACTIVE" ? "Inativar" : "Ativar"}
              </Button>
            </CardActions>
          </UserCard>
        ))}
        {trainers.length === 0 && (
          <p style={{ color: "#888", padding: 20 }}>Nenhum personal cadastrado.</p>
        )}
      </Grid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo personal</ModalTitle>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <form
              onSubmit={createTrainer}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <InputWrapper>
                <Label>Nome *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" fullWidth loading={loading}>
                  Criar personal
                </Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default AdminTrainers;