import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/* ---------- UI ---------- */

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const Label = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

const Value = styled.p`
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 14px;
  padding: 16px;
  background: ${({ theme }) => theme.accent.primary};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.85;
  }
`;

/* ---------- TYPES ---------- */

interface HistoryItem {
  date: string;
  completed: boolean;
}

/* ---------- UTILS ---------- */

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isSameWeek = (date: Date, now: Date) => {
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
};

const calculateStreak = (history: HistoryItem[]) => {
  let streak = 0;
  const day = new Date();

  while (
    history.some(
      (h) => h.completed && isSameDay(new Date(h.date), day)
    )
  ) {
    streak++;
    day.setDate(day.getDate() - 1);
  }

  return streak;
};

/* ---------- COMPONENT ---------- */

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [planned, setPlanned] = useState(0);

  useEffect(() => {
    if (!user) return;

    api.get(`/history/student/${user.id}`).then((res) => {
      setHistory(res.data);
    });

    api.get(`/student-workouts/schedule/${user.id}`).then((res) => {
      setPlanned(res.data.length);
    });
  }, [user]);

  const completedThisWeek = useMemo(
    () =>
      history.filter(
        (h) =>
          h.completed &&
          isSameWeek(new Date(h.date), new Date())
      ).length,
    [history]
  );

  const streak = useMemo(
    () => calculateStreak(history),
    [history]
  );

  return (
    <>
      <PageTitle>Início</PageTitle>

      <Cards>
        <Card>
          <Label>📊 Esta semana</Label>
          <Value>
            {completedThisWeek} / {planned} treinos
          </Value>
        </Card>

        <Card>
          <Label>🔥 Sequência atual</Label>
          <Value>{streak} dias</Value>
        </Card>

        <PrimaryButton onClick={() => navigate("/student/today")}>
          ▶️ Iniciar treino de hoje
        </PrimaryButton>
      </Cards>
    </>
  );
};

export default StudentHome;