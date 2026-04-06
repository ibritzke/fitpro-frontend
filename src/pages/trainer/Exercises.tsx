import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, InputWrapper, Label, Select } from "../../components/ui/Input";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`font-size: 22px; font-weight: 600;`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const List = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const Item = styled(Card)`
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemInfo = styled.div``;
const ItemName = styled.p`font-size: 14px; font-weight: 500;`;
const ItemSub = styled.p`font-size: 12px; color: ${({ theme }) => theme.text.secondary};`;

const Actions = styled.div`display: flex; gap: 8px;`;

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
`;

const ModalBox = styled(Card)`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h2`font-size: 17px; font-weight: 600;`;

interface Category { id: string; name: string; }
interface Subcategory { id: string; name: string; categoryId: string; }
interface Exercise {
  id: string;
  name: string;
  category: Category;
  subcategory?: Subcategory;
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterCat, setFilterCat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExercises = async () => {
    const res = await api.get("/exercises", {
      params: filterCat ? { categoryId: filterCat } : {},
    });
    setExercises(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchSubcategories = async (catId: string) => {
    if (!catId) return setSubcategories([]);
    const res = await api.get(`/subcategories/category/${catId}`);
    setSubcategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchExercises(); }, [filterCat]);
  useEffect(() => { fetchSubcategories(categoryId); }, [categoryId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/exercises", {
        name,
        categoryId,
        subcategoryId: subcategoryId || undefined,
      });
      setShowModal(false);
      setName(""); setCategoryId(""); setSubcategoryId("");
      fetchExercises();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este exercício?")) return;
    await api.delete(`/exercises/${id}`);
    fetchExercises();
  };

  return (
    <div>
      <Header>
        <PageTitle>Exercícios</PageTitle>
        <Button onClick={() => setShowModal(true)}>+ Novo exercício</Button>
      </Header>

      <Filters>
        <Select
          style={{ maxWidth: 220 }}
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </Filters>

      <List>
        {exercises.map((ex) => (
          <Item key={ex.id}>
            <ItemInfo>
              <ItemName>{ex.name}</ItemName>
              <ItemSub>
                {ex.category.name}
                {ex.subcategory ? ` · ${ex.subcategory.name}` : ""}
              </ItemSub>
            </ItemInfo>
            <Actions>
              <DeleteBtn onClick={() => handleDelete(ex.id)}>Excluir</DeleteBtn>
            </Actions>
          </Item>
        ))}
        {exercises.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", padding: 32 }}>
            Nenhum exercício cadastrado.
          </p>
        )}
      </List>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Novo exercício</ModalTitle>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                <Label>Nome do exercício *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Supino reto"
                  required
                />
              </InputWrapper>
              <div style={{ display: "flex", gap: 10 }}>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" fullWidth loading={loading}>
                  Criar
                </Button>
              </div>
            </form>
          </ModalBox>
        </Modal>
      )}
    </div>
  );
};

export default Exercises;