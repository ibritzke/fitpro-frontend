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

const ExName = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

/* ================= SETS ================= */

const SetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const SetNum = styled.div<{ done?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ done, theme }) =>
    done ? theme.accent.success : theme.bg.secondary};
  color: ${({ done, theme }) => (done ? "#fff" : theme.text.tertiary)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

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
  id: string; // id da relação WorkoutTypeExercise
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
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const navigate = useNavigate();
  const [exerciseProgress, setExerciseProgress] = useState<
    Record<string, number>
  >({});
  const [editedWeights, setEditedWeights] = useState<Record<string, number>>(
    {},
  );
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ seconds: number; active: boolean }>({
    seconds: 0,
    active: false,
  });

  useEffect(() => {
    if (!user) return;

    api
      .get(`/student-workouts/today/${user.id}`)
      .then((r) => setWorkout(r.data))
      .catch(() => setWorkout(null));
  }, [user]);

  useEffect(() => {
    if (!timer.active || timer.seconds <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => ({
        ...t,
        seconds: t.seconds - 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const todayLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  if (!workout) {
    return (
      <div>
        <PageTitle>Treino de hoje</PageTitle>
        <Sub>{todayLabel}</Sub>
        <p style={{ padding: 40, textAlign: "center", color: "#888" }}>
          Nenhum treino para hoje
        </p>
      </div>
    );
  }

  return (
    <div>
      {timer.active && (
        <TimerOverlay>
          <TimerBox>
            <p>Descanso</p>
            <TimerSeconds>{timer.seconds}s</TimerSeconds>
            <Button
              variant="secondary"
              onClick={() => setTimer({ seconds: 0, active: false })}
            >
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
        const done = exerciseProgress[ex.exercise.id] || 0;
        const weight = editedWeights[ex.exercise.id] ?? ex.kg;

        return (
          <ExCard key={ex.exercise.id}>
            {/* timer.active */}
            <ExName>{ex.exercise.name}</ExName>

            {/* Observação */}
            {ex.observation && (
              <p style={{ fontSize: 12, marginBottom: 8 }}>
                📝 {ex.observation}
              </p>
            )}

            {/* Vídeo */}
            {ex.videoUrl && (
              <a
                href={ex.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  marginBottom: 8,
                  display: "inline-block",
                }}
              >
                ▶️ Ver vídeo
              </a>
            )}

            {Array.from({ length: ex.sets }).map((_, setIdx) => {
              const isDone = setIdx < done;

              return (
                <SetRow key={setIdx}>
                  <SetNum done={isDone}>{isDone ? "✓" : setIdx + 1}</SetNum>

                  {/* Peso editável */}
<></>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => setEditingWeight(ex.exercise.id)}
                  >
                    {editingWeight === ex.exercise.id ? (
                      <input
                        type="number"
                        autoFocus
                        value={weight}
                        onBlur={() => setEditingWeight(null)}
                        onChange={(e) =>
                          setEditedWeights((prev) => ({
                            ...prev,
                            [ex.exercise.id]: Number(e.target.value),
                          }))
                        }
                        style={{
                          width: 60,
                          padding: 4,
                        }}
                      />
                    ) : (
                      <span>{weight} kg</span>
                    )}
                  </div>

                  <span>{ex.reps} reps</span>

                  <Button
                    size="sm"
                    disabled={isDone}
                    onClick={async () => {
                      const next = done + 1;

                      setExerciseProgress((prev) => ({
                        ...prev,
                        [ex.exercise.id]: next,
                      }));

                      // Inicia descanso
                      if (ex.restTime) {
                        setTimer({
                          seconds: ex.restTime,
                          active: true,
                        });
                      }

                      // Finalizou todas as séries → salva histórico
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
                    {isDone ? "✅" : "Concluir"}
                  </Button>
                </SetRow>
              );
            })}
          </ExCard>
        );
      })}

      <Button
        fullWidth
        style={{ marginBottom: 24 }}
        onClick={() => navigate("/student/week")}
      >
        ✅ Finalizar treino
      </Button>
    </div>
  );
};

export default StudentToday;
