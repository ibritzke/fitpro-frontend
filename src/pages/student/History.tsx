import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

/* =========================
   TÍTULO DA PÁGINA
========================= */

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;

  @media (min-width: 769px) {
    font-size: 22px;
    margin-bottom: 24px;
  }
`;

/* =========================
   LISTA
========================= */

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* =========================
   ITEM
========================= */

const Item = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 14px 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemMain = styled.p`
  font-weight: 500;
  font-size: 14px;
`;

const ItemDate = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
`;

/* =========================
   BADGE
========================= */

const Badge = styled.span<{ completed: boolean }>`
  align-self: flex-start;

  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;

  background: ${({ completed, theme }) =>
    completed
      ? `${theme.accent.success}20`
      : theme.bg.secondary};

  color: ${({ completed, theme }) =>
    completed ? theme.accent.success : theme.text.tertiary};

  @media (min-width: 640px) {
    align-self: center;
  }
`;

/* =========================
   TIPOS
========================= */

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
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/history/${user.id}`).then((res) => setHistory(res.data));
  }, [user]);

  return (
    <div>
      <PageTitle>Histórico</PageTitle>

      <List>
        {history.map((h) => (
          <Item key={h.id}>
            <ItemLeft>
              <ItemMain>
                {h.weight ? `${h.weight}kg` : "Sem peso"} ·{" "}
                {h.setsCompleted || 0} séries
              </ItemMain>

              <ItemDate>
                {new Date(h.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ItemDate>
            </ItemLeft>

            <Badge completed={h.completed}>
              {h.completed ? "Concluído" : "Parcial"}
            </Badge>
          </Item>
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