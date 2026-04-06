/* eslint-disable react-hooks/set-state-in-effect */
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`font-size: 15px; font-weight: 500; margin-bottom: 14px;`;

const List = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 8px;
  font-size: 14px;
`;

const DeleteBtn = styled.button`
  color: ${({ theme }) => theme.accent.danger};
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover { background: ${({ theme }) => theme.accent.danger}15; }
`;

interface Category { id: string; name: string; }
interface Subcategory { id: string; name: string; categoryId: string; }

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  const fetchAll = async () => {
    const cats = await api.get("/categories");
    setCategories(cats.data);
  };

  const fetchSubs = async (catId: string) => {
    const subs = await api.get(`/subcategories/category/${catId}`);
    setSubcategories(subs.data);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { if (selectedCat) fetchSubs(selectedCat); }, [selectedCat]);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/categories", { name: catName });
    setCatName("");
    fetchAll();
  };

  const createSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/subcategories", { name: subName, categoryId: selectedCat });
    setSubName("");
    fetchSubs(selectedCat);
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    fetchAll();
  };

  const deleteSubcategory = async (id: string) => {
    await api.delete(`/subcategories/${id}`);
    if (selectedCat) fetchSubs(selectedCat);
  };

  return (
    <div>
      <Header>
        <PageTitle>Categorias</PageTitle>
      </Header>

      <Grid>
        <Card>
          <SectionTitle>Categorias</SectionTitle>
          <form onSubmit={createCategory} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Nova categoria..." required />
            <Button type="submit" size="sm">Adicionar</Button>
          </form>
          <List>
            {categories.map((c) => (
              <Item key={c.id}>
                <span>{c.name}</span>
                <DeleteBtn onClick={() => deleteCategory(c.id)}>Excluir</DeleteBtn>
              </Item>
            ))}
          </List>
        </Card>

        <Card>
          <SectionTitle>Subcategorias</SectionTitle>
          <InputWrapper style={{ marginBottom: 12 }}>
            <Label>Categoria</Label>
            <Select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </InputWrapper>
          {selectedCat && (
            <>
              <form onSubmit={createSubcategory} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <Input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Nova subcategoria..." required />
                <Button type="submit" size="sm">Adicionar</Button>
              </form>
              <List>
                {subcategories.map((s) => (
                  <Item key={s.id}>
                    <span>{s.name}</span>
                    <DeleteBtn onClick={() => deleteSubcategory(s.id)}>Excluir</DeleteBtn>
                  </Item>
                ))}
              </List>
            </>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default Categories;