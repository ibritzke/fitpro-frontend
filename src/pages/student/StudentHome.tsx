import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";

/* ================= STYLES ================= */

const Container = styled.div`
  padding: 20px 16px 0;
`;

const BrandHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const Logo = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const TrainerName = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CardText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 12px;
`;

/* ================= TYPES ================= */

interface Trainer {
  id: string;
  name: string;
  logoUrl?: string;
}

interface TodayWorkout {
  workoutType: {
    name: string;
  };
}

/* ================= COMPONENT ================= */

const StudentHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);

  useEffect(() => {
    if (!user?.trainerId) return;

    // Buscar dados do personal
    api
      .get(`/trainers/${user.trainerId}`)
      .then((res) => setTrainer(res.data))
      .catch(() => setTrainer(null));

    // Buscar treino de hoje
    api
      .get(`/student-workouts/today/${user.id}`)
      .then((res) => setTodayWorkout(res.data))
      .catch(() => setTodayWorkout(null));
  }, [user]);

  return (
    <Container>
      <BrandHeader>
        {trainer?.logoUrl && <Logo src={trainer.logoUrl} alt="Logo do personal" />}
        <TrainerName>{trainer?.name || "Seu personal"}</TrainerName>
        <Subtitle>Treinos personalizados para você</Subtitle>
      </BrandHeader>

      <Card>
        <CardTitle>Treino de hoje</CardTitle>
        {todayWorkout ? (
          <>
            <CardText>{todayWorkout.workoutType.name}</CardText>
            <Button fullWidth onClick={() => navigate("/student/today")}>
              Iniciar treino
            </Button>
          </>
        ) : (
          <CardText>Hoje é dia de descanso 💆‍♂️</CardText>
        )}
      </Card>

      <Card>
        <CardTitle>Sua semana</CardTitle>
        <CardText>Veja todos os treinos planejados pelo seu personal.</CardText>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate("/student/week")}
        >
          Ver semana completa
        </Button>
      </Card>
    </Container>
  );
};

export default StudentHome;