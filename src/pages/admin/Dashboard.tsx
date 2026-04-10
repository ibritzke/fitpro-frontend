import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;

  @media (min-width: 769px) {
    font-size: 22px;
    margin-bottom: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 769px) {
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const StatCard = styled(Card)`
  padding: 20px;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 600;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
`;

const TrainerRow = styled(Card)`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 10px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TrainerName = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const TrainerMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

const Badge = styled.span<{ active: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;

  background: ${({ active }) =>
    active ? "rgba(5,150,105,0.15)" : "rgba(220,38,38,0.15)"};

  color: ${({ active }) => (active ? "#059669" : "#dc2626")};
`;

interface DashboardData {
  summary: {
    totalTrainers: number;
    activeTrainers: number;
    inactiveTrainers: number;
    totalStudents: number;
  };
  trainers: {
    id: string;
    name: string;
    status: string;
    lastLogin?: string;
    _count: { students: number };
  }[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = () =>
    api.get("/admin/dashboard").then((r) => setData(r.data));

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id: string) => {
    await api.patch(`/admin/trainers/${id}/status`);
    fetchData();
  };

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <PageTitle>Painel Admin</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total personais</StatLabel>
          <StatValue>{data.summary.totalTrainers}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Ativos</StatLabel>
          <StatValue style={{ color: "#059669" }}>
            {data.summary.activeTrainers}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Inativos</StatLabel>
          <StatValue style={{ color: "#dc2626" }}>
            {data.summary.inactiveTrainers}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Total alunos</StatLabel>
          <StatValue>{data.summary.totalStudents}</StatValue>
        </StatCard>
      </StatsGrid>

      <SectionTitle>Personais</SectionTitle>

      {data.trainers.map((t) => (
        <TrainerRow key={t.id}>
          <div>
            <TrainerName>{t.name}</TrainerName>
            <TrainerMeta>
              {t._count.students} alunos ·{" "}
              {t.lastLogin
                ? `Último acesso: ${new Date(
                    t.lastLogin
                  ).toLocaleDateString("pt-BR")}`
                : "Nunca acessou"}
            </TrainerMeta>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Badge active={t.status === "ACTIVE"}>
              {t.status === "ACTIVE" ? "Ativo" : "Inativo"}
            </Badge>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => toggleStatus(t.id)}
            >
              {t.status === "ACTIVE" ? "Inativar" : "Ativar"}
            </Button>
          </div>
        </TrainerRow>
      ))}
    </div>
  );
};

export default AdminDashboard;
