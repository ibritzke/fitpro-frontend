import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";

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

const SetData = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;

/* ================= TYPES ================= */

interface ExerciseData {
  sets: number;
  reps: string;
  kg: number;
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
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!user) return;

    api
      .get(`/student-workouts/today/${user.id}`)
      .then((r) => setWorkout(r.data))
      .catch(() => setWorkout(null));
  }, [user]);

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
      <PageTitle>Treino de hoje</PageTitle>
      <Sub>{todayLabel} · {workout.workoutType.name}</Sub>

      {workout.workoutType.exercises.map((ex, exIdx) => {
        const done = completedSets[exIdx] || 0;

        return (
          <ExCard key={ex.exercise.id}>
            <ExName>{ex.exercise.name}</ExName>

            {Array.from({ length: ex.sets }).map((_, setIdx) => (
              <SetRow key={setIdx}>
                <SetNum done={setIdx < done}>
                  {setIdx < done ? "✓" : setIdx + 1}
                </SetNum>

                <SetData
                  onClick={async () => {
                    if (setIdx !== done) return;

                    const next = done + 1;

                    setCompletedSets((prev) => ({
                      ...prev,
                      [exIdx]: next,
                    }));

                    // ✅ AO FINALIZAR TODAS AS SÉRIES → SALVA HISTÓRICO
                    if (next === ex.sets) {
                      await api.post("/history", {
                        exerciseId: ex.exercise.id,
                        weight: ex.kg,
                        setsCompleted: ex.sets,
                        completed: true,
                      });
                    }
                  }}
                >
                  <span>{ex.reps} reps</span>
                  <span>{ex.kg} kg</span>
                </SetData>
              </SetRow>
            ))}
          </ExCard>
        );
      })}

      <Button
        fullWidth
        style={{ marginBottom: 24 }}
        onClick={() => (window.location.href = "/student/week")}
      >
        ✅ Finalizar treino
      </Button>
    </div>
  );
};

export default StudentToday;