import { useState, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";

const Container = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.bg.card};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadPreview = styled.div`
  margin-top: 8px;
  text-align: center;
`;


export const Account: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("logo", file);

      await api.post("/users/me/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Logo atualizado com sucesso!");
      refreshUser?.(); // Atualiza o auth context se essa doc/prop for implementada
    } catch {
      alert("Erro ao enviar a logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Title>Conta</Title>

      <Card>
        <p>
          <strong>Usuário:</strong> {user?.name}
        </p>
        <p>
          <strong>Papel:</strong> {user?.role}
        </p>
      </Card>

      {user?.role === "TRAINER" && (
        <Card>
          <p>
            <strong>Logo do aplicativo para alunos</strong>
          </p>
          <p style={{ fontSize: 13, color: "#888" }}>
            Esta imagem aparecerá como fundo no aplicativo dos seus alunos.
          </p>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "Enviando..." : "📤 Escolher imagem"}
          </Button>
          <FileInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleLogoUpload}
          />
          {user?.logoUrl && !uploading && (
            <UploadPreview>
              <img
                src={import.meta.env.VITE_API_URL + user?.logoUrl}
                alt="Logo do Personal"
                style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 8, marginTop: 10, opacity: 0.5 }}
              />
            </UploadPreview>
          )}
        </Card>
      )}

      <Card>
        <Button variant="secondary" onClick={toggleTheme}>
          {isDark ? "☀ Mudar para modo claro" : "☾ Mudar para modo escuro"}
        </Button>
      </Card>

      <Card>
        <Button variant="danger" onClick={logout}>
          ⎋ Sair da conta
        </Button>
      </Card>
    </Container>
  );
};

export default Account;