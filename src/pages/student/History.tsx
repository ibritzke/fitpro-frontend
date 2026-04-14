import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const groupByDate = (items: HistoryItem[]) => {
  return items.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const key = new Date(item.date).toLocaleDateString("pt-BR");
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
};

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 14px 16px;

  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Main = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const DateText = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
`;

const Badge = styled.span<{ completed: boolean }>`
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;

  background: ${({ completed, theme }) =>
    completed ? `${theme.accent.success}20` : theme.bg.secondary};

  color: ${({ completed, theme }) =>
    completed ? theme.accent.success : theme.text.tertiary};
`;

interface HistoryItem {
  id: string;
  exerciseId: string;
  date: string;
  weight?: number;
  setsCompleted?: number;
  completed: boolean;
}

/* =========================
   COMPONENTE
========================= */

const StudentHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.id) return;
    api
      .get(`/history`)
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]));
  }, [user?.id]);

  const grouped = groupByDate(history);

  return (
    <div>
      <PageTitle>Histórico</PageTitle>

      <List>
        {Object.entries(grouped).map(([day, items]) => (
          <div key={day}>
            <PageTitle>{day}</PageTitle>

            <List>
              {items.map((h) => (
                <Item key={h.id}>
                  <Info>
                    <Main>
                      {h.weight ? `${h.weight}kg` : "Sem peso"} ·{" "}
                      {h.setsCompleted || 0} séries
                    </Main>

                    <DateText>
                      {new Date(h.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </DateText>
                  </Info>

                  <Badge completed={h.completed}>
                    {h.completed ? "Concluído" : "Parcial"}
                  </Badge>
                </Item>
              ))}
            </List>
          </div>
        ))}
        {history.length === 0 && (
          <p
            style={{
              color: "#888",
              textAlign: "center",
              padding: 40,
            }}
          >
            Nenhum treino registrado ainda.
          </p>
        )}
      </List>
    </div>
  );
};

export default StudentHistory;
