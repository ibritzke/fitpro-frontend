import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
`;
const Sub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 24px;
`;

const ExCard = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
`;

const ExHeader = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ExInfo = styled.div`
  flex: 1;
`;
const ExName = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
`;
const ExCat = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SetNum = styled.div<{ status: "done" | "active" | "pending" }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
  background: ${({ status, theme }) =>
    status === "done"
      ? theme.accent.success
      : status === "active"
        ? theme.accent.warning
        : theme.bg.secondary};
  color: ${({ status, theme }) =>
    status === "done" || status === "active" ? "#fff" : theme.text.tertiary};
`;

const SetData = styled.div<{ active?: boolean }>`
  flex: 1;
  background: ${({ theme }) => theme.bg.secondary};
  border: 1px solid
    ${({ active, theme }) => (active ? theme.accent.warning : "transparent")};
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border 0.15s;
`;

const SetVal = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  span {
    font-size: 11px;
    color: ${({ theme }) => theme.text.tertiary};
    margin-left: 3px;
  }
`;

const TimerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  gap: 16px;
`;

const TimerTitle = styled.p`
  color: #fff;
  font-size: 18px;
  font-weight: 500;
`;
const TimerSub = styled.p`
  color: #888;
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
  color: #fff;
  font-size: 42px;
  font-weight: 600;
  line-height: 1;
`;
const TimerLabel = styled.p`
  color: #888;
  font-size: 12px;
  margin-top: 4px;
`;

const NextBox = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 14px 20px;
  text-align: center;
  min-width: 240px;
`;

const NextLabel = styled.p`
  color: #888;
  font-size: 11px;
  margin-bottom: 4px;
`;
const NextName = styled.p`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
`;

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

interface ExerciseData {
  id: string;
  sets: number;
  reps: string;
  kg: number;
  restTime: number;
  observation?: string;
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

const StudentToday: React.FC = () => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>(
    {},
  );
  const [timer, setTimer] = useState<{
    active: boolean;
    seconds: number;
    total: number;
    nextExName: string;
  }>({
    active: false,
    seconds: 0,
    total: 0,
    nextExName: "",
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/student-workouts/today/${user.id}`)
      .then((r) => setWorkout(r.data))
      .catch(() => setWorkout(null))
      .finally(() => setLoading(false));
  }, [user]);

  const startTimer = (seconds: number, nextExName: string) => {
    setTimer({ active: true, seconds, total: seconds, nextExName });
    if (intervalRef.current) clearInterval(intervalRef.current);
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

  const skipTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer((prev) => ({ ...prev, active: false }));
  };

  const handleSetClick = (
    exIdx: number,
    setIdx: number,
    restTime: number,
    nextExName: string,
  ) => {
    const key = `${exIdx}`;
    const current = completedSets[key] || 0;
    if (setIdx !== current) return;

    setCompletedSets((prev) => ({ ...prev, [key]: current + 1 }));

    api
      .post("/history", {
        studentId: user?.id,
        exerciseId: workout?.workoutType.exercises[exIdx].exercise.id,
        weight: workout?.workoutType.exercises[exIdx].kg,
        setsCompleted: current + 1,
        completed:
          current + 1 >= (workout?.workoutType.exercises[exIdx].sets || 0),
      })
      .catch(() => {});

    if (restTime > 0) startTimer(restTime, nextExName);
  };

  const today = new Date().getDay();
  const circumference = 2 * Math.PI * 60;
  const progress =
    timer.total > 0 ? (timer.seconds / timer.total) * circumference : 0;

  if (loading)
    return (
      <div style={{ padding: 32, color: "#888" }}>Carregando treino...</div>
    );

  if (!workout)
    return (
      <div>
        <PageTitle>Treino de hoje</PageTitle>
        <Sub>{DAYS[today]}</Sub>
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>
            Nenhum treino para hoje
          </p>
          <p style={{ fontSize: 13 }}>
            Seu personal ainda não atribuiu um treino para {DAYS[today]}.
          </p>
        </div>
      </div>
    );

  const exercises = workout.workoutType.exercises;

  return (
    <div>
      <PageTitle>Treino de hoje</PageTitle>
      <Sub>
        {DAYS[today]} · {workout.workoutType.name}
      </Sub>

      {exercises.map((ex, exIdx) => {
        const done = completedSets[`${exIdx}`] || 0;
        const nextEx = exercises[exIdx + 1];

        return (
          <ExCard key={ex.id}>
            <ExHeader>
              <ExInfo>
                <ExName>{ex.exercise.name}</ExName>
                <ExCat>
                  {ex.exercise.category.name}
                  {ex.exercise.subcategory
                    ? ` · ${ex.exercise.subcategory.name}`
                    : ""}
                </ExCat>
              </ExInfo>
              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: "#7c3aed" }}
                >
                  Ver vídeo
                </a>
              )}
            </ExHeader>

            <SetsList>
              {Array.from({ length: ex.sets || 0 }).map((_, setIdx) => {
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
                      onClick={() =>
                        handleSetClick(
                          exIdx,
                          setIdx,
                          ex.restTime || 60,
                          nextEx?.exercise.name || "",
                        )
                      }
                    >
                      <SetVal>
                        {ex.reps}
                        <span>reps</span>
                      </SetVal>
                      <span style={{ color: "#555", fontSize: 10 }}>·</span>
                      <SetVal>
                        {ex.kg || 0}
                        <span>kg</span>
                      </SetVal>
                    </SetData>
                  </SetRow>
                );
              })}
            </SetsList>

            {ex.observation && (
              <p
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 10,
                  fontStyle: "italic",
                }}
              >
                {ex.observation}
              </p>
            )}
          </ExCard>
        );
      })}

      {timer.active && (
        <TimerOverlay>
          <TimerTitle>Descansando...</TimerTitle>
          <TimerSub>Próxima: {timer.nextExName || "Próxima série"}</TimerSub>

          <RingWrap>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="6"
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#E8593C"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <TimerCenter>
              <TimerSecs>{timer.seconds}</TimerSecs>
              <TimerLabel>segundos</TimerLabel>
            </TimerCenter>
          </RingWrap>

          {timer.nextExName && (
            <NextBox>
              <NextLabel>Próximo exercício</NextLabel>
              <NextName>{timer.nextExName}</NextName>
            </NextBox>
          )}

          <Button variant="secondary" onClick={skipTimer}>
            Pular descanso
          </Button>
        </TimerOverlay>
      )}
    </div>
  );
};

export default StudentToday;
