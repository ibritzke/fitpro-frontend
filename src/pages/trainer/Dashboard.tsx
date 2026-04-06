import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 28px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled(Card)`
  padding: 20px;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StudentRow = styled(Card)`
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.accent.primary};
  }
`;

const StudentInfo = styled.div``;

const StudentName = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const StudentEmail = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  background: ${({ active, theme }) => active ? theme.accent.success + "20" : theme.accent.danger + "20"};
  color: ${({ active, theme }) => active ? theme.accent.success : theme.accent.danger};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 14px;
`;

interface Student {
  id: string;
  name: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE";
  accessCode: string;
}

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students").then((res) => {
      setStudents(res.data.data || res.data);
    }).finally(() => setLoading(false));
  }, []);

  const activeStudents = students.filter((s) => s.status === "ACTIVE").length;

  return (
    <div>
      <PageTitle>Olá, {user?.name?.split(" ")[0]} 👋</PageTitle>
      <PageSub>Aqui está o resumo dos seus alunos</PageSub>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total de alunos</StatLabel>
          <StatValue>{students.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Ativos</StatLabel>
          <StatValue style={{ color: "#059669" }}>{activeStudents}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Inativos</StatLabel>
          <StatValue style={{ color: "#dc2626" }}>{students.length - activeStudents}</StatValue>
        </StatCard>
      </StatsGrid>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionTitle>Seus alunos</SectionTitle>
        <Button size="sm" onClick={() => navigate("/trainer/students")}>
          + Novo aluno
        </Button>
      </div>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : students.length === 0 ? (
        <EmptyState>Nenhum aluno cadastrado ainda.</EmptyState>
      ) : (
        <StudentList>
          {students.slice(0, 8).map((student) => (
            <StudentRow key={student.id} onClick={() => navigate(`/trainer/students/${student.id}`)}>
              <StudentInfo>
                <StudentName>{student.name}</StudentName>
                <StudentEmail>{student.email || "Sem email"}</StudentEmail>
              </StudentInfo>
              <Badge active={student.status === "ACTIVE"}>
                {student.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </Badge>
            </StudentRow>
          ))}
        </StudentList>
      )}
    </div>
  );
};

export default TrainerDashboard;