/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Select, InputWrapper, Label, Input } from "../../components/ui/Input";

/* ================= HEADER ================= */

const BackBtn = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

const SubInfo = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 20px;
`;

/* ================= GRID ================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

/* ================= ACCESS CODE ================= */

const CodeBox = styled.div`
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

const CodeLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 6px;
`;

const CodeValue = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text.primary};
  font-family: monospace;
  word-break: break-all;
  margin-bottom: 10px;
`;

/* ================= SCHEDULE ================= */

const DayRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.light};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const DayLabel = styled.span`
  font-weight: 500;
  min-width: 80px;
`;

const WorkoutName = styled.span`
  color: ${({ theme }) => theme.text.secondary};
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

interface WorkoutType {
  id: string;
  name: string;
}

interface StudentWorkoutDay {
  id: string;
  dayOfWeek: number;
  workoutType: WorkoutType;
}

interface Student {
  id: string;
  name: string;
  email?: string;
  accessCode: string;
  status: string;
}

/* ================= COMPONENT ================= */

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [schedule, setSchedule] = useState<StudentWorkoutDay[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [selectedType, setSelectedType] = useState("");
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  /* ===== LÓGICA ORIGINAL (NÃO ALTERADA) ===== */

  const fetchAll = async () => {
    if (!id) return;
    try {
      const [s, sch, wt] = await Promise.all([
        api.get(`/students/${id}`),
        api.get(`/student-workouts/schedule/${id}`),
        api.get("/workout-types"),
      ]);
      setStudent(s.data);
      setSchedule(sch.data);
      setWorkoutTypes(wt.data);
    } catch (err: any) {
      console.error("fetchAll error:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const assign = async () => {
    if (selectedDay === "" || !selectedType) return;
    setLoading(true);
    try {
      await api.post("/student-workouts", {
        studentId: id,
        workoutTypeId: selectedType,
        dayOfWeek: Number(selectedDay),
      });
      await fetchAll();
      setSelectedDay("");
      setSelectedType("");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (dayId: string) => {
    await api.delete(`/student-workouts/${dayId}`);
    await fetchAll();
  };

  const savePin = async () => {
    if (!pin || pin.length < 4) {
      setPinMsg("PIN deve ter pelo menos 4 caracteres");
      return;
    }
    setPinLoading(true);
    try {
      await api.patch(`/students/${id}/pin`, { pin });
      setPinMsg("PIN atualizado com sucesso!");
      setPin("");
      await fetchAll();
    } catch {
      setPinMsg("Erro ao salvar PIN");
    } finally {
      setPinLoading(false);
    }
  };

  if (!student)
    return (
      <div style={{ padding: 32, color: "#888" }}>
        Carregando...
      </div>
    );

  return (
    <div>
      <BackBtn onClick={() => navigate("/trainer/students")}>
        ← Voltar
      </BackBtn>

      <PageTitle>{student.name}</PageTitle>
      <SubInfo>
        {student.email || "Sem email"} ·{" "}
        {student.status === "ACTIVE" ? "Ativo" : "Inativo"}
      </SubInfo>

      <CodeBox>
        <CodeLabel>Código de acesso atual</CodeLabel>
        <CodeValue>{student.accessCode}</CodeValue>

        <CodeLabel style={{ marginTop: 10 }}>
          Definir código personalizado
        </CodeLabel>

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <Input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ex: joao123 ou 1234"
            style={{ maxWidth: 220 }}
          />
          <Button size="sm" onClick={savePin} loading={pinLoading}>
            Salvar
          </Button>
        </div>

        {pinMsg && (
          <p
            style={{
              fontSize: 12,
              marginTop: 6,
              color: pinMsg.includes("sucesso")
                ? "#059669"
                : "#dc2626",
            }}
          >
            {pinMsg}
          </p>
        )}
      </CodeBox>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle>Semana de treinos</CardTitle>
          </CardHeader>

          {DAYS.map((day, idx) => {
            const assigned = schedule.find(
              (s) => s.dayOfWeek === idx,
            );
            return (
              <DayRow key={idx}>
                <DayLabel>{day}</DayLabel>

                {assigned ? (
                  <>
                    <WorkoutName>
                      {assigned.workoutType.name}
                    </WorkoutName>
                    <button
                      onClick={() => remove(assigned.id)}
                      style={{
                        fontSize: 12,
                        color: "#dc2626",
                        padding: "2px 8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remover
                    </button>
                  </>
                ) : (
                  <span style={{ color: "#666", fontSize: 12 }}>
                    Descanso
                  </span>
                )}
              </DayRow>
            );
          })}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atribuir treino</CardTitle>
          </CardHeader>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <InputWrapper>
              <Label>Dia da semana</Label>
              <Select
                value={selectedDay}
                onChange={(e) =>
                  setSelectedDay(
                    e.target.value === ""
                      ? ""
                      : parseInt(e.target.value),
                  )
                }
              >
                <option value="">Selecione o dia...</option>
                {DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </Select>
            </InputWrapper>

            <InputWrapper>
              <Label>Tipo de treino</Label>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Selecione o treino...</option>
                {workoutTypes.map((wt) => (
                  <option key={wt.id} value={wt.id}>
                    {wt.name}
                  </option>
                ))}
              </Select>
            </InputWrapper>

            <Button
              onClick={assign}
              fullWidth
              loading={loading}
              disabled={selectedDay === "" || !selectedType}
            >
              Salvar
            </Button>
          </div>
        </Card>
      </Grid>
    </div>
  );
};

export default StudentDetail;