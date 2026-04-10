import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import {
  Input,
  InputWrapper,
  Label,
  Select,
  Textarea,
} from "../../components/ui/Input";

/* ================= HEADER ================= */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ================= LIST ================= */

const ExerciseRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.light};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const ExMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.secondary};
`;

const GlobalBadge = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 8px;
  background: ${({ theme }) => `${theme.accent.info}20`};
  color: ${({ theme }) => theme.accent.info};
`;

const DeleteBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.accent.danger};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => `${theme.accent.danger}15`};
  }
`;

/* ================= MODAL ================= */

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
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

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* ================= TYPES ================= */

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  name: string;
}

interface TemplateExercise {
  id: string;
  exercise: Exercise;
  sets?: number;
  reps?: string;
  kg?: number;
  restTime?: number;
  observation?: string;
  videoUrl?: string;
}

interface Template {
  id: string;
  name: string;
  description?: string;
  isGlobal: boolean;
  exercises: TemplateExercise[];
}

/* ================= COMPONENT ================= */

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [showNew, setShowNew] = useState(false);
  const [showAddEx, setShowAddEx] = useState<string | null>(null);
  const [showApply, setShowApply] = useState<Template | null>(null);

  const [applyName, setApplyName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");

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

  const fetchTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data);
  };

  useEffect(() => {
    fetchTemplates();
    api.get("/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setExercises([]);
      return;
    }
    api.get(`/subcategories/category/${categoryId}`).then((r) => setSubcategories(r.data));
    api.get("/exercises", { params: { categoryId } }).then((r) => setExercises(r.data));
  }, [categoryId]);

  const createTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/templates", {
        name: templateName,
        description: templateDesc,
      });
      setShowNew(false);
      setTemplateName("");
      setTemplateDesc("");
      fetchTemplates();
    } finally {
      setLoading(false);
    }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/templates/exercises", {
        templateId: showAddEx,
        exerciseId,
        kg: kg ? parseFloat(kg) : undefined,
        reps: reps || undefined,
        sets: sets ? parseInt(sets) : undefined,
        restTime: restTime ? parseInt(restTime) : undefined,
        observation: observation || undefined,
        videoUrl: videoUrl || undefined,
      });
      setShowAddEx(null);
      setCategoryId("");
      setSubcategoryId("");
      setExerciseId("");
      setKg("");
      setReps("");
      setSets("");
      setRestTime("");
      setObservation("");
      setVideoUrl("");
      fetchTemplates();
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showApply) return;
    setLoading(true);
    try {
      await api.post("/templates/apply", {
        templateId: showApply.id,
        name: applyName || showApply.name,
      });
      setShowApply(null);
      setApplyName("");
      alert("Template aplicado como novo tipo de treino!");
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Excluir template?")) return;
    await api.delete(`/templates/${id}`);
    fetchTemplates();
  };

  return (
    <div>
      <Header>
        <PageTitle>Templates</PageTitle>
        <Button onClick={() => setShowNew(true)}>+ Novo template</Button>
      </Header>

      <Grid>
        {templates.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle>
                {t.name}
                {t.isGlobal && <GlobalBadge>Global</GlobalBadge>}
              </CardTitle>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button size="sm" variant="secondary" onClick={() => { setShowApply(t); setApplyName(t.name); }}>
                  Usar template
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowAddEx(t.id)}>
                  + Exercício
                </Button>
                {!t.isGlobal && (
                  <DeleteBtn onClick={() => deleteTemplate(t.id)}>Excluir</DeleteBtn>
                )}
              </div>
            </CardHeader>

            {t.description && (
              <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                {t.description}
              </p>
            )}

            {t.exercises.length === 0 ? (
              <p style={{ fontSize: 13, color: "#888" }}>
                Nenhum exercício adicionado.
              </p>
            ) : (
              t.exercises.map((ex) => (
                <ExerciseRow key={ex.id}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{ex.exercise.name}</p>
                    <ExMeta>
                      {[ex.sets && `${ex.sets} séries`, ex.reps && `${ex.reps} reps`, ex.kg && `${ex.kg}kg`, ex.restTime && `${ex.restTime}s`]
                        .filter(Boolean)
                        .join(" · ")}
                    </ExMeta>
                  </div>
                </ExerciseRow>
              ))
            )}
          </Card>
        ))}

        {templates.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", padding: 40 }}>
            Nenhum template disponível.
          </p>
        )}
      </Grid>

      {/* MODAL NOVO TEMPLATE */}
      {showNew && (
        <Modal onClick={() => setShowNew(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo template</ModalTitle>
            <form onSubmit={createTemplate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Nome *</Label>
                <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} required />
              </InputWrapper>
              <InputWrapper>
                <Label>Descrição</Label>
                <Textarea value={templateDesc} onChange={(e) => setTemplateDesc(e.target.value)} />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowNew(false)}>Cancelar</Button>
                <Button type="submit" loading={loading} fullWidth>Criar</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}

      {/* MODAL ADICIONAR EXERCÍCIO */}
      {showAddEx && (
        <Modal onClick={() => setShowAddEx(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Adicionar exercício</ModalTitle>
            <form onSubmit={addExercise} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Categoria *</Label>
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </InputWrapper>
              <InputWrapper>
                <Label>Subcategoria</Label>
                <Select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </InputWrapper>
              <InputWrapper>
                <Label>Exercício *</Label>
                <Select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </Select>
              </InputWrapper>

              <Row2>
                <InputWrapper>
                  <Label>Séries</Label>
                  <Input value={sets} onChange={(e) => setSets(e.target.value)} />
                </InputWrapper>
                <InputWrapper>
                  <Label>Repetições</Label>
                  <Input value={reps} onChange={(e) => setReps(e.target.value)} />
                </InputWrapper>
              </Row2>

              <Row2>
                <InputWrapper>
                  <Label>Kg</Label>
                  <Input value={kg} onChange={(e) => setKg(e.target.value)} />
                </InputWrapper>
                <InputWrapper>
                  <Label>Descanso (seg)</Label>
                  <Input value={restTime} onChange={(e) => setRestTime(e.target.value)} />
                </InputWrapper>
              </Row2>

              <InputWrapper>
                <Label>Observação</Label>
                <Textarea value={observation} onChange={(e) => setObservation(e.target.value)} />
              </InputWrapper>

              <InputWrapper>
                <Label>Link do vídeo</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
              </InputWrapper>

              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowAddEx(null)}>Cancelar</Button>
                <Button type="submit" loading={loading} fullWidth>Adicionar</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}

      {/* MODAL APLICAR TEMPLATE */}
      {showApply && (
        <Modal onClick={() => setShowApply(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Usar template: {showApply.name}</ModalTitle>
            <form onSubmit={applyTemplate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputWrapper>
                <Label>Nome do novo tipo de treino</Label>
                <Input value={applyName} onChange={(e) => setApplyName(e.target.value)} />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowApply(null)}>Cancelar</Button>
                <Button type="submit" loading={loading} fullWidth>Criar tipo de treino</Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default Templates;