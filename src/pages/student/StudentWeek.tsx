import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const Container = styled.div`
  padding: 16px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DayCard = styled.div<{ $today?: boolean; $hasWorkout?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  cursor: pointer;

  background: ${({ theme, $today, $hasWorkout }) =>
    $today
      ? theme.accent.primary + "20"
      : $hasWorkout
        ? theme.bg.card
        : theme.bg.secondary};

  border: 1px solid
    ${({ theme, $today }) =>
      $today ? theme.accent.primary : theme.border.light};

  transition: transform 0.1s;

  &:active {
    transform: scale(0.98);
  }
`;

const DayLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const WorkoutName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

const Badge = styled.span<{ $rest?: boolean }>`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ theme, $rest }) =>
    $rest ? theme.bg.secondary : theme.accent.success + "20"};
  color: ${({ theme, $rest }) =>
    $rest ? theme.text.tertiary : theme.accent.success};
`;

interface WeekWorkout {
  dayOfWeek: number;
  workoutType: {
    name: string;
  };
}

interface HistoryItem {
  id: string;
  exerciseId: string;
  date: string;
  weight?: number;
  setsCompleted?: number;
  completed: boolean;
}

const StudentWeek: React.FC = () => {
  const { user } = useAuth();
  const [week, setWeek] = useState<WeekWorkout[]>([]);
  const navigate = useNavigate();
  const today = new Date().getDay();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => {
    if (!user) return;
    api.get("/history?days=7").then((res) => setHistory(res.data));
    api
      .get(`/student-workouts/week/${user.id}`)
      .then((res) => setWeek(res.data))
      .catch(() => setWeek([]));
  }, [user]);

  const isDayCompleted = (dayIndex: number) => {
    return history.some((h) => {
      const d = new Date(h.date);
      return d.getDay() === dayIndex && h.completed;
    });
  };

  const getWorkoutForDay = (dayIndex: number) =>
    week.find((w) => w.dayOfWeek === dayIndex);

  return (
    <Container>
      <Header>
        <Title>Treinos da Semana</Title>
        <Subtitle>Acompanhe seu plano completo</Subtitle>
      </Header>

      <List>
        {DAYS.map((day, index) => {
          const workout = getWorkoutForDay(index);
          const isToday = index === today;

          return (
            <DayCard
              key={index}
              $today={isToday}
              $hasWorkout={!!workout}
              onClick={() => navigate(`/student/day/${index}`)}
            >
              <DayLeft>
                <DayName>{day}</DayName>
                <WorkoutName>
                  {workout ? workout.workoutType.name : "Descanso"}
                </WorkoutName>
              </DayLeft>

              <Badge $rest={!workout}>
                {isDayCompleted(index)
                  ? "✅ Concluído"
                  : isToday
                    ? "Hoje"
                    : workout
                      ? "Treino"
                      : "Descanso"}
              </Badge>
            </DayCard>
          );
        })}
      </List>
    </Container>
  );
};

export default StudentWeek;
