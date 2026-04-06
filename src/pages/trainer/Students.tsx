import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, InputWrapper, Label } from "../../components/ui/Input";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const StudentCard = styled(Card)`
  cursor: pointer;
  transition: border 0.15s;
  &:hover { border-color: ${({ theme }) => theme.accent.primary}; }
`;

const Name = styled.p`font-size: 15px; font-weight: 500; margin-bottom: 4px;`;
const Email = styled.p`font-size: 12px; color: ${({ theme }) => theme.text.secondary}; margin-bottom: 12px;`;

const CodeBox = styled.div`
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  word-break: break-all;
`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  float: right;
  background: ${({ active, theme }) => active ? theme.accent.success + "20" : theme.accent.danger + "20"};
  color: ${({ active, theme }) => active ? theme.accent.success : theme.accent.danger};
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalBox = styled(Card)`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ModalTitle = styled.h2`font-size: 17px; font-weight: 600;`;

interface Student {
  id: string;
  name: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE";
  accessCode: string;
}

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudents = () => {
    api.get("/students").then((res) => setStudents(res.data.data || res.data));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/students", { name, email: email || undefined });
      setShowModal(false);
      setName(""); setEmail("");
      fetchStudents();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header>
        <PageTitle>Alunos</PageTitle>
        <Button onClick={() => setShowModal(true)}>+ Novo aluno</Button>
      </Header>

      <Grid>
        {students.map((s) => (
          <StudentCard key={s.id} onClick={() => navigate(`/trainer/students/${s.id}`)}>
            <Badge active={s.status === "ACTIVE"}>{s.status === "ACTIVE" ? "Ativo" : "Inativo"}</Badge>
            <Name>{s.name}</Name>
            <Email>{s.email || "Sem email"}</Email>
            <CodeBox>Código: {s.accessCode}</CodeBox>
          </StudentCard>
        ))}
      </Grid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo aluno</ModalTitle>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Nome *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome completo" />
              </InputWrapper>
              <InputWrapper>
                <Label>Email (opcional)</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={loading}>Criar aluno</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default Students;