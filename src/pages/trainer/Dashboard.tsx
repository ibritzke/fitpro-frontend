import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

/* ===================== HEADER ===================== */

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

const PageSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 24px;
`;

/* ===================== STATS ===================== */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 28px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const StatCard = styled(Card)`
  padding: 16px;

  @media (min-width: 769px) {
    padding: 20px;
  }
`;

const StatLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.p`
  font-size: 26px;
  font-weight: 600;

  @media (min-width: 769px) {
    font-size: 28px;
  }
`;

/* ===================== SECTION ===================== */

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

/* ===================== LIST ===================== */

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StudentRow = styled(Card)`
  padding: 12px 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.accent.primary};
  }

  @media (min-width: 769px) {
    padding: 14px 18px;
  }
`;

const StudentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StudentName = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const StudentEmail = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
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

/* ===================== EMPTY ===================== */

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.text.tertiary};
  font-size: 14px;
`;

/* ===================== TYPES ===================== */

interface Student {
  id: string;
  name: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE";
  accessCode: string;
}

/* ===================== COMPONENT ===================== */

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/students")
      .then((res) => {
        setStudents(res.data.data || res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeStudents = students.filter(
    (s) => s.status === "ACTIVE",
  ).length;

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
          <StatValue style={{ color: "#059669" }}>
            {activeStudents}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Inativos</StatLabel>
          <StatValue style={{ color: "#dc2626" }}>
            {students.length - activeStudents}
          </StatValue>
        </StatCard>
      </StatsGrid>

      <SectionHeader>
        <SectionTitle>Seus alunos</SectionTitle>
        <Button
          size="sm"
          onClick={() => navigate("/trainer/students")}
        >
          + Novo aluno
        </Button>
      </SectionHeader>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : students.length === 0 ? (
        <EmptyState>Nenhum aluno cadastrado ainda.</EmptyState>
      ) : (
        <StudentList>
          {students.slice(0, 8).map((student) => (
            <StudentRow
              key={student.id}
              onClick={() =>
                navigate(`/trainer/students/${student.id}`)
              }
            >
              <StudentInfo>
                <StudentName>{student.name}</StudentName>
                <StudentEmail>
                  {student.email || "Sem email"}
                </StudentEmail>
              </StudentInfo>

              <Badge active={student.status === "ACTIVE"}>
                {student.status === "ACTIVE"
                  ? "Ativo"
                  : "Inativo"}
              </Badge>
            </StudentRow>
          ))}
        </StudentList>
      )}
    </div>
  );
};

export default TrainerDashboard;
