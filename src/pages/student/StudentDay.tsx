/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Sub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 16px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

interface WorkoutDay {
  workoutType: {
    name: string;
    exercises: any[];
  };
}

const DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const StudentDay: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);

  const dayIndex = Number(day);
  const isToday = dayIndex === new Date().getDay();

  useEffect(() => {
    if (!user) return;

    api
      .get(`/student-workouts/day/${user.id}/${dayIndex}`)
      .then((res) => setWorkout(res.data))
      .catch(() => setWorkout(null));
  }, [user, dayIndex]);

  if (!workout) {
    return (
      <div>
        <Title>{DAYS[dayIndex]}</Title>
        <p style={{ color: "#888", padding: 40 }}>
          Nenhum treino para este dia
        </p>
      </div>
    );
  }

  return (
    <div>
      <Title>{DAYS[dayIndex]}</Title>
      <Sub>{workout.workoutType.name}</Sub>

      {workout.workoutType.exercises.map((ex) => (
        <Card key={ex.exercise.id}>
          <strong>{ex.exercise.name}</strong>

          {ex.observation && (
            <p style={{ fontSize: 12, marginTop: 6 }}>📝 {ex.observation}</p>
          )}

          {ex.videoUrl && (
            <a
              href={ex.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, display: "block", marginTop: 6 }}
            >
              ▶️ Ver vídeo
            </a>
          )}

          <p style={{ fontSize: 12, marginTop: 8 }}>
            {ex.sets} séries · {ex.reps} reps · {ex.kg} kg
          </p>
        </Card>
      ))}

      {!isToday && (
        <Sub style={{ marginTop: 16 }}>
          Este treino é apenas para visualização
        </Sub>
      )}
    </div>
  );
};

export default StudentDay;
