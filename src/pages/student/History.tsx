import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const PageTitle = styled.h1`font-size: 22px; font-weight: 600; margin-bottom: 24px;`;

const List = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const Item = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const ItemLeft = styled.div``;
const ItemDate = styled.p`font-size: 11px; color: ${({ theme }) => theme.text.tertiary}; margin-top: 3px;`;

const Badge = styled.span<{ completed: boolean }>`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${({ completed, theme }) => completed ? theme.accent.success + "20" : theme.bg.secondary};
  color: ${({ completed, theme }) => completed ? theme.accent.success : theme.text.tertiary};
`;

interface HistoryItem {
  id: string;
  exerciseId: string;
  date: string;
  weight?: number;
  setsCompleted?: number;
  completed: boolean;
}

const StudentHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get(`/history/${user.id}`).then((r) => setHistory(r.data));
  }, [user]);

  return (
    <div>
      <PageTitle>Histórico</PageTitle>
      <List>
        {history.map((h) => (
          <Item key={h.id}>
            <ItemLeft>
              <p style={{ fontWeight: 500 }}>
                {h.weight ? `${h.weight}kg` : "Sem peso"} · {h.setsCompleted || 0} séries
              </p>
              <ItemDate>{new Date(h.date).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
              })}</ItemDate>
            </ItemLeft>
            <Badge completed={h.completed}>{h.completed ? "Concluído" : "Parcial"}</Badge>
          </Item>
        ))}
        {history.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Nenhum treino registrado ainda.</p>
        )}
      </List>
    </div>
  );
};

export default StudentHistory;