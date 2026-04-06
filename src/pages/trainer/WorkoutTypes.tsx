import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input, InputWrapper, Label, Select, Textarea } from "../../components/ui/Input";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`font-size: 22px; font-weight: 600;`;
const Grid = styled.div`display: flex; flex-direction: column; gap: 16px;`;

const ExerciseRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.light};
  font-size: 13px;

  &:last-child { border-bottom: none; }
`;

const ExMeta = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 12px;
`;

const DeleteBtn = styled.button`
  color: ${({ theme }) => theme.accent.danger};
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover { background: ${({ theme }) => theme.accent.danger}15; }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

const ModalBox = styled(Card)`
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`font-size: 17px; font-weight: 600;`;
const Row2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;

interface Category { id: string; name: string; }
interface Subcategory { id: string; name: string; }
interface Exercise { id: string; name: string; }
interface WorkoutTypeExercise {
  id: string;
  exercise: Exercise;
  sets?: number;
  reps?: string;
  kg?: number;
  restTime?: number;
  observation?: string;
  videoUrl?: string;
}
interface WorkoutType {
  id: string;
  name: string;
  exercises: WorkoutTypeExercise[];
}

const WorkoutTypes: React.FC = () => {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showNewType, setShowNewType] = useState(false);
  const [showAddEx, setShowAddEx] = useState<string | null>(null);
  const [typeName, setTypeName] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [restTime, setRestTime] = useState("");
  const [observation, setObservation] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    const res = await api.get("/workout-types");
    setWorkoutTypes(res.data);
  };

  useEffect(() => { fetch(); api.get("/categories").then((r) => setCategories(r.data)); }, []);

  useEffect(() => {
    if (categoryId) {
      api.get(`/subcategories/category/${categoryId}`).then((r) => setSubcategories(r.data));
      api.get("/exercises", { params: { categoryId } }).then((r) => setExercises(r.data));
    }
  }, [categoryId]);

  const createType = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/workout-types", { name: typeName });
      setTypeName(""); setShowNewType(false);
      fetch();
    } finally { setLoading(false); }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/workout-types/exercises", {
        workoutTypeId: showAddEx,
        exerciseId,
        kg: kg ? parseFloat(kg) : undefined,
        reps: reps || undefined,
        sets: sets ? parseInt(sets) : undefined,
        restTime: restTime ? parseInt(restTime) : undefined,
        observation: observation || undefined,
        videoUrl: videoUrl || undefined,
      });
      setShowAddEx(null);
      setCategoryId(""); setSubcategoryId(""); setExerciseId("");
      setKg(""); setReps(""); setSets(""); setRestTime("");
      setObservation(""); setVideoUrl("");
      fetch();
    } finally { setLoading(false); }
  };

  const removeExercise = async (id: string) => {
    if (!confirm("Remover exercício?")) return;
    await api.delete(`/workout-types/exercises/${id}`);
    fetch();
  };

  const deleteType = async (id: string) => {
    if (!confirm("Excluir tipo de treino?")) return;
    await api.delete(`/workout-types/${id}`);
    fetch();
  };

  return (
    <div>
      <Header>
        <PageTitle>Tipos de Treino</PageTitle>
        <Button onClick={() => setShowNewType(true)}>+ Novo tipo</Button>
      </Header>

      <Grid>
        {workoutTypes.map((wt) => (
          <Card key={wt.id}>
            <CardHeader>
              <CardTitle>{wt.name}</CardTitle>
              <div style={{ display: "flex", gap: 8 }}>
                <Button size="sm" variant="secondary" onClick={() => setShowAddEx(wt.id)}>
                  + Exercício
                </Button>
                <DeleteBtn onClick={() => deleteType(wt.id)}>Excluir</DeleteBtn>
              </div>
            </CardHeader>
            {wt.exercises.length === 0 ? (
              <p style={{ fontSize: 13, color: "#888" }}>Nenhum exercício adicionado.</p>
            ) : (
              wt.exercises.map((ex) => (
                <ExerciseRow key={ex.id}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{ex.exercise.name}</p>
                    <ExMeta>
                      {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.kg && `${ex.kg}kg`, ex.restTime && `${ex.restTime}s descanso`]
                        .filter(Boolean).join(" · ")}
                    </ExMeta>
                    {ex.observation && <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{ex.observation}</p>}
                  </div>
                  <DeleteBtn onClick={() => removeExercise(ex.id)}>Remover</DeleteBtn>
                </ExerciseRow>
              ))
            )}
          </Card>
        ))}
        {workoutTypes.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Nenhum tipo de treino criado.</p>
        )}
      </Grid>

      {showNewType && (
        <Modal onClick={() => setShowNewType(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo tipo de treino</ModalTitle>
            <form onSubmit={createType} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Nome *</Label>
                <Input value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="ex: Treino A – Peito + Tríceps" required />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowNewType(false)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={loading}>Criar</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}

      {showAddEx && (
        <Modal onClick={() => setShowAddEx(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Adicionar exercício</ModalTitle>
            <form onSubmit={addExercise} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Categoria *</Label>
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </InputWrapper>
              <InputWrapper>
                <Label>Subcategoria</Label>
                <Select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </InputWrapper>
              <InputWrapper>
                <Label>Exercício *</Label>
                <Select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {exercises.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </Select>
              </InputWrapper>
              <Row2>
                <InputWrapper>
                  <Label>Séries</Label>
                  <Input type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="4" />
                </InputWrapper>
                <InputWrapper>
                  <Label>Repetições</Label>
                  <Input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="12" />
                </InputWrapper>
              </Row2>
              <Row2>
                <InputWrapper>
                  <Label>Kg</Label>
                  <Input type="number" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="60" />
                </InputWrapper>
                <InputWrapper>
                  <Label>Descanso (seg)</Label>
                  <Input type="number" value={restTime} onChange={(e) => setRestTime(e.target.value)} placeholder="60" />
                </InputWrapper>
              </Row2>
              <InputWrapper>
                <Label>Observação</Label>
                <Textarea value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Dicas de execução..." />
              </InputWrapper>
              <InputWrapper>
                <Label>Link do vídeo</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowAddEx(null)}>Cancelar</Button>
                <Button type="submit" fullWidth loading={loading}>Adicionar</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default WorkoutTypes;