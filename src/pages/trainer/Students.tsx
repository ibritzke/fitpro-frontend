import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, InputWrapper, Label } from "../../components/ui/Input";

/* ===================== HEADER ===================== */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

/* ===================== GRID ===================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

/* ===================== CARD ===================== */

const StudentCard = styled(Card)`
  cursor: pointer;
  transition: border 0.15s;
  padding: 14px;

  &:hover {
    border-color: ${({ theme }) => theme.accent.primary};
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
`;

const Name = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const Email = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 10px;
`;

/* ===================== CODE ===================== */

const CodeBox = styled.div`
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  word-break: break-all;
`;

/* ===================== BADGE ===================== */

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  white-space: nowrap;

  background: ${({ active, theme }) =>
    active
      ? `${theme.accent.success}20`
      : `${theme.accent.danger}20`};

  color: ${({ active, theme }) =>
    active ? theme.accent.success : theme.accent.danger};
`;

/* ===================== MODAL ===================== */

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const ModalBox = styled(Card)`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
`;

/* ===================== TYPES ===================== */

interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE";
  accessCode: string;
}

/* ===================== COMPONENT ===================== */

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== LÓGICA ORIGINAL (NÃO ALTERADA) ===== */

  const fetchStudents = () => {
    api
      .get("/students")
      .then((res) => setStudents(res.data.data || res.data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/students", {
        name,
        email: email || undefined,
        phone: phone || undefined,
      });
      setShowModal(false);
      setName("");
      setEmail("");
      setPhone("");
      fetchStudents();
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Certeza que deseja excluir este aluno?")) {
      await api.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  /* ===================== JSX ===================== */

  return (
    <div>
      <Header>
        <PageTitle>Alunos</PageTitle>
        <Button onClick={() => setShowModal(true)}>
          + Novo aluno
        </Button>
      </Header>

      <Grid>
        {students.map((s) => (
          <StudentCard
            key={s.id}
            onClick={() =>
              navigate(`/trainer/students/${s.id}`)
            }
          >
            <CardTop>
              <div>
                <Name>{s.name}</Name>
                <Email>{s.email || "Sem email"}</Email>
                {s.phone && <Email style={{marginTop: -8}}>Tel: {s.phone}</Email>}
              </div>
              <Badge active={s.status === "ACTIVE"}>
                {s.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </Badge>
            </CardTop>

            <CodeBox>
              Código de acesso: {s.accessCode}
            </CodeBox>
            <div style={{ marginTop: 12 }}>
              <Button size="sm" variant="secondary" style={{ background: "#fee2e2", color: "#dc2626", borderColor: "#fca5a5" }} onClick={(e) => deleteStudent(s.id, e)}>
                Excluir
              </Button>
            </div>
          </StudentCard>
        ))}
      </Grid>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo aluno</ModalTitle>

            <form
              onSubmit={handleCreate}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <InputWrapper>
                <Label>Nome *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome completo"
                />
              </InputWrapper>

              <InputWrapper>
                <Label>Email (opcional)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </InputWrapper>

              <InputWrapper>
                <Label>Telefone (opcional)</Label>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                >
                  Criar aluno
                </Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default Students;