import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";

/* ================= HEADER ================= */

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

const Sub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 20px;
`;

/* ================= EXERCISE CARD ================= */

const ExCard = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ExHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const ExInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ExName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const ExCat = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

/* ================= SETS ================= */

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SetNum = styled.div<{ status: "done" | "active" | "pending" }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;

  background: ${({ status, theme }) =>
    status === "done"
      ? theme.accent.success
      : status === "active"
      ? theme.accent.warning
      : theme.bg.secondary};

  color: ${({ status, theme }) =>
    status === "done" || status === "active"
      ? "#fff"
      : theme.text.tertiary};
`;

const SetData = styled.div<{ active?: boolean }>`
  flex: 1;
  background: ${({ theme }) => theme.bg.secondary};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.accent.warning : "transparent"};
  border-radius: 12px;
  padding: 12px 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;
`;

const SetVal = styled.span`
  font-size: 15px;
  font-weight: 600;

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.text.tertiary};
    margin-left: 4px;
  }
`;

/* ================= TIMER OVERLAY ================= */

const TimerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 300;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

const TimerTitle = styled.p`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

const TimerSub = styled.p`
  color: #aaa;
  font-size: 13px;
`;

const RingWrap = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
`;

const TimerCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TimerSecs = styled.p`
  font-size: 42px;
  font-weight: 700;
  color: #fff;
`;

const TimerLabel = styled.p`
  font-size: 12px;
  color: #aaa;
`;

/* ================= DATA ================= */

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

/* ================= TYPES ================= */

interface ExerciseData {
  id: string;
  sets: number;
  reps: string;
  kg: number;
  restTime: number;
  videoUrl?: string;
  exercise: {
    id: string;
    name: string;
    category: { name: string };
    subcategory?: { name: string };
  };
}

interface WorkoutDay {
  workoutType: { name: string; exercises: ExerciseData[] };
}

/* ================= COMPONENT ================= */

const StudentToday: React.FC = () => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState({ active: false, seconds: 0, total: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;

    api
      .get(`/student-workouts/today/${user.id}`)
      .then((r) => setWorkout(r.data))
      .catch(() => setWorkout(null));
  }, [user]);

  const startTimer = (seconds: number) => {
    setTimer({ active: true, seconds, total: seconds });

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds <= 1) {
          clearInterval(intervalRef.current!);
          return { ...prev, active: false, seconds: 0 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
  };

  const today = new Date().getDay();
  const circumference = 2 * Math.PI * 60;
  const progress =
    timer.total > 0 ? (timer.seconds / timer.total) * circumference : 0;

  if (!workout)
    return (
      <div>
        <PageTitle>Treino de hoje</PageTitle>
        <Sub>{DAYS[today]}</Sub>
        <p style={{ padding: 40, textAlign: "center", color: "#888" }}>
          Nenhum treino para hoje
        </p>
      </div>
    );

  return (
    <div>
      <PageTitle>Treino de hoje</PageTitle>
      <Sub>
        {DAYS[today]} · {workout.workoutType.name}
      </Sub>

      {workout.workoutType.exercises.map((ex, exIdx) => {
        const done = completedSets[exIdx] || 0;

        return (
          <ExCard key={ex.id}>
            <ExHeader>
              <ExInfo>
                <ExName>{ex.exercise.name}</ExName>
                <ExCat>{ex.exercise.category.name}</ExCat>
              </ExInfo>
            </ExHeader>

            <SetsList>
              {Array.from({ length: ex.sets }).map((_, setIdx) => {
                const status =
                  setIdx < done
                    ? "done"
                    : setIdx === done
                    ? "active"
                    : "pending";

                return (
                  <SetRow key={setIdx}>
                    <SetNum status={status}>
                      {status === "done" ? "✓" : setIdx + 1}
                    </SetNum>

                    <SetData
                      active={status === "active"}
                      onClick={() => {
                        if (setIdx !== done) return;

                        setCompletedSets((prev) => ({
                          ...prev,
                          [exIdx]: done + 1,
                        }));

                        if (ex.restTime) startTimer(ex.restTime);
                      }}
                    >
                      <SetVal>
                        {ex.reps}
                        <span>reps</span>
                      </SetVal>
                      <SetVal>
                        {ex.kg}
                        <span>kg</span>
                      </SetVal>
                    </SetData>
                  </SetRow>
                );
              })}
            </SetsList>
          </ExCard>
        );
      })}

      {timer.active && (
        <TimerOverlay>
           <TimerSub>Prepare-se para a próxima série</TimerSub>
          <TimerTitle>Descanso</TimerTitle>
          <RingWrap>
            <svg width="160" height="160">
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#333"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                stroke="#E8593C"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <TimerCenter>
              <TimerSecs>{timer.seconds}</TimerSecs>
              <TimerLabel>segundos</TimerLabel>
            </TimerCenter>
          </RingWrap>
          <Button variant="secondary" onClick={() => setTimer({ ...timer, active: false })}>
            Pular descanso
          </Button>
        </TimerOverlay>
      )}
    </div>
  );
};

export default StudentToday;
