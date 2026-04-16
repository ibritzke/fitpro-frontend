/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

/* ================= HEADER ================= */

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
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
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ExName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const Weight = styled.div`
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const SetsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

/* ================= SERIES ================= */

const SetCircle = styled.div<{ done?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ done, theme }) =>
    done ? theme.accent.success : theme.bg.secondary};

  color: ${({ done, theme }) => (done ? "#fff" : theme.text.secondary)};
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
  user-select: none;

  transition: all 0.1s;

  &:active {
    transform: scale(0.97);
  }
`;

/* ================= TIMER ================= */

const TimerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimerBox = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border-radius: 20px;
  padding: 32px;
  min-width: 220px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const TimerSeconds = styled.div`
  font-size: 48px;
  font-weight: 700;
`;

/* ================= TYPES ================= */

interface ExerciseData {
  id: string;
  sets: number;
  reps: string;
  kg: number;
  restTime?: number;
  observation?: string;
  videoUrl?: string;
  exercise: {
    id: string;
    name: string;
  };
}

interface WorkoutDay {
  workoutType: {
    name: string;
    exercises: ExerciseData[];
  };
}

/* ================= COMPONENT ================= */

const StudentToday: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workoutCompletedToday, setWorkoutCompletedToday] = useState(false);
  const todayKey = `student:${user?.id}:today:${new Date().toISOString().slice(0, 10)}`;
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      if (!saved) return {};
      return JSON.parse(saved).progress || {};
    } catch {
      return {};
    }
  });
  const [editedWeights, setEditedWeights] = useState<Record<string, number>>(
    () => {
      try {
        const saved = localStorage.getItem(todayKey);
        if (!saved) return {};
        return JSON.parse(saved).editedWeights || {};
      } catch {
        return {};
      }
    },
  );
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ active: boolean; seconds: number }>({
    active: false,
    seconds: 0,
  });

  useEffect(() => {
    if (!user) return;

    api
      .get(`/history/${user.id}`)
      .then((res) => {
        const today = new Date().toDateString();

        const completedToday = res.data.some((h: any) => {
          return h.completed && new Date(h.date).toDateString() === today;
        });

        setWorkoutCompletedToday(completedToday);
      })
      .catch(() => {
        setWorkoutCompletedToday(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    api
      .get(`/student-workouts/today/${user.id}`)
      .then((res) => setWorkout(res.data))
      .catch(() => setWorkout(null));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const payload = {
      progress,
      editedWeights,
    };

    localStorage.setItem(todayKey, JSON.stringify(payload));
  }, [progress, editedWeights, user]);

  useEffect(() => {
    if (!timer.active || timer.seconds <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => ({ ...t, seconds: t.seconds - 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const todayLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  if (!workout) {
    return (
      <>
        <PageTitle>Treino de hoje</PageTitle>
        <Sub>{todayLabel}</Sub>
        <p style={{ padding: 40, textAlign: "center", color: "#888" }}>
          Nenhum treino para hoje
        </p>
      </>
    );
  }
  if (workoutCompletedToday) {
    return (
      <ExCard
        style={{
          background: "linear-gradient(135deg, #16a34a20, #16653420)",
          borderColor: "#22c55e",
        }}
      >
        <ExName>✅ Treino concluído</ExName>
        <p style={{ fontSize: 13, marginTop: 6 }}>
          Você já finalizou o treino de hoje.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/student/history")}
          >
            Ver histórico
          </Button>

          <Button size="sm" onClick={() => navigate("/student/week")}>
            Ver semana
          </Button>
        </div>
      </ExCard>
    );
  }
  return (
    <>
      {timer.active && (
        <TimerOverlay>
          <TimerBox>
            <p>Descanso</p>
            <TimerSeconds>{timer.seconds}s</TimerSeconds>
            <Button onClick={() => setTimer({ active: false, seconds: 0 })}>
              Pular descanso
            </Button>
          </TimerBox>
        </TimerOverlay>
      )}

      <PageTitle>Treino de hoje</PageTitle>
      <Sub>
        {todayLabel} · {workout.workoutType.name}
      </Sub>

      {workout.workoutType.exercises.map((ex) => {
        const done = progress[ex.exercise.id] || 0;
        const weight = editedWeights[ex.exercise.id] ?? ex.kg;

        return (
          <ExCard key={ex.exercise.id}>
            <ExHeader>
              <ExName>{ex.exercise.name}</ExName>

              <Weight onClick={() => setEditingWeight(ex.exercise.id)}>
                {editingWeight === ex.exercise.id ? (
                  <input
                    type="number"
                    autoFocus
                    value={weight}
                    onChange={(e) =>
                      setEditedWeights((p) => ({
                        ...p,
                        [ex.exercise.id]: Number(e.target.value),
                      }))
                    }
                    onBlur={() => setEditingWeight(null)}
                    style={{ width: 60 }}
                  />
                ) : (
                  `${weight} kg`
                )}
              </Weight>
            </ExHeader>

            {ex.observation && (
              <p style={{ fontSize: 12, marginBottom: 8 }}>
                📝 {ex.observation}
              </p>
            )}

            {ex.videoUrl && (
              <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer">
                ▶️ Ver vídeo
              </a>
            )}

            <SetsRow>
              {Array.from({ length: ex.sets }).map((_, idx) => {
                const isDone = idx < done;

                return (
                  <SetCircle
                    key={idx}
                    done={isDone}
                    onClick={async () => {
                      if (workoutCompletedToday) return;
                      if (isDone) return;

                      const next = done + 1;
                      setProgress((p) => ({
                        ...p,
                        [ex.exercise.id]: next,
                      }));

                      if (ex.restTime) {
                        setTimer({ active: true, seconds: ex.restTime });
                      }

                      if (next === ex.sets) {
                        await api.post("/history", {
                          exerciseId: ex.exercise.id,
                          weight,
                          setsCompleted: ex.sets,
                          completed: true,
                        });
                      }
                    }}
                  >
                    {isDone ? "✅" : `${idx + 1}x${ex.reps}`}
                  </SetCircle>
                );
              })}
            </SetsRow>
          </ExCard>
        );
      })}

      <Button
        fullWidth
        onClick={() => {
          localStorage.removeItem(todayKey);
          navigate("/student/week");
        }}
      >
        ✅ Finalizar treino
      </Button>
    </>
  );
};

export default StudentToday;
