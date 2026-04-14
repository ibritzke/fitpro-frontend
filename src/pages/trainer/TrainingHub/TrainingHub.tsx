import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card } from "../../../components/ui/Card";

const Grid = styled.div`
  display: grid;
  gap: 16px;
`;

const Item = styled(Card)`
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

export default function TrainingHub() {
  const navigate = useNavigate();

  return (
    <Grid>
      <Item onClick={() => navigate("/trainer/exercises")}>🏋️ Exercícios</Item>
      <Item onClick={() => navigate("/trainer/categories")}>📂 Categorias</Item>
      <Item onClick={() => navigate("/trainer/workout-types")}>📋 Tipos de treino</Item>
      <Item onClick={() => navigate("/trainer/templates")}>🧩 Templates</Item>
    </Grid>
  );
}