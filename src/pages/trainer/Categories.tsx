/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  Input,
  InputWrapper,
  Label,
  Select,
} from "../../components/ui/Input";

/* ===================== HEADER ===================== */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;

  @media (min-width: 769px) {
    font-size: 22px;
  }
`;

/* ===================== GRID ===================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 769px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

/* ===================== SECTIONS ===================== */

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 14px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ===================== ITEM ===================== */

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  padding: 10px 14px;
  background: ${({ theme }) => theme.bg.secondary};
  border-radius: 8px;
  font-size: 14px;
`;

const ItemName = styled.span`
  font-size: 14px;
`;

const DeleteBtn = styled.button`
  color: ${({ theme }) => theme.accent.danger};
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => `${theme.accent.danger}15`};
  }
`;

/* ===================== TYPES ===================== */

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

/* ===================== COMPONENT ===================== */

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState("");
  const [subName, setSubName] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  /* ===== MESMA LÓGICA (NÃO ALTERADA) ===== */

  const fetchAll = async () => {
    const cats = await api.get("/categories");
    setCategories(cats.data);
  };

  const fetchSubs = async (catId: string) => {
    const subs = await api.get(`/subcategories/category/${catId}`);
    setSubcategories(subs.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedCat) fetchSubs(selectedCat);
    else setSubcategories([]);
  }, [selectedCat]);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: catName });
      setCatName("");
      fetchAll();
    } catch (err) {
      alert("Erro ao criar categoria. Tente novamente.");
    }
  };

  const createSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/subcategories", {
        name: subName,
        categoryId: selectedCat,
      });
      setSubName("");
      fetchSubs(selectedCat);
    } catch (err) {
      alert("Erro ao criar subcategoria. Tente novamente.");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Excluir esta categoria?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchAll();
    } catch (err) {
      alert("Erro ao excluir categoria. Tente novamente.");
    }
  };

  const deleteSubcategory = async (id: string) => {
    if (!confirm("Excluir esta subcategoria?")) return;
    try {
      await api.delete(`/subcategories/${id}`);
      if (selectedCat) fetchSubs(selectedCat);
    } catch (err) {
      alert("Erro ao excluir subcategoria. Tente novamente.");
    }
  };

  /* ===================== JSX ===================== */

  return (
    <div>
      <Header>
        <PageTitle>Categorias</PageTitle>
      </Header>

      <Grid>
        {/* ===== CATEGORIAS ===== */}
        <Card>
          <SectionTitle>Categorias</SectionTitle>

          <form
            onSubmit={createCategory}
            style={{ display: "flex", gap: 8, marginBottom: 16 }}
          >
            <Input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Nova categoria..."
              required
            />
            <Button type="submit" size="sm">
              Adicionar
            </Button>
          </form>

          <List>
            {categories.map((c) => (
              <Item key={c.id}>
                <ItemName>{c.name}</ItemName>
                <DeleteBtn onClick={() => deleteCategory(c.id)}>
                  Excluir
                </DeleteBtn>
              </Item>
            ))}

            {categories.length === 0 && (
              <p style={{ fontSize: 13, color: "#888" }}>
                Nenhuma categoria cadastrada.
              </p>
            )}
          </List>
        </Card>

        {/* ===== SUBCATEGORIAS ===== */}
        <Card>
          <SectionTitle>Subcategorias</SectionTitle>

          <InputWrapper style={{ marginBottom: 12 }}>
            <Label>Categoria</Label>
            <Select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </InputWrapper>

          {selectedCat && (
            <>
              <form
                onSubmit={createSubcategory}
                style={{ display: "flex", gap: 8, marginBottom: 16 }}
              >
                <Input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Nova subcategoria..."
                  required
                />
                <Button type="submit" size="sm">
                  Adicionar
                </Button>
              </form>

              <List>
                {subcategories.map((s) => (
                  <Item key={s.id}>
                    <ItemName>{s.name}</ItemName>
                    <DeleteBtn
                      onClick={() => deleteSubcategory(s.id)}
                    >
                      Excluir
                    </DeleteBtn>
                  </Item>
                ))}

                {subcategories.length === 0 && (
                  <p style={{ fontSize: 13, color: "#888" }}>
                    Nenhuma subcategoria cadastrada.
                  </p>
                )}
              </List>
            </>
          )}
        </Card>
      </Grid>
    </div>
  );
};

export default Categories;