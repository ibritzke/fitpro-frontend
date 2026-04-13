import { useState } from "react";
import { api } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { Input, InputWrapper, Label } from "../../../components/ui/Input";
import { Overlay, ModalBox } from "../../../components/ui/Modal";

export const ResetTrainerPasswordModal = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await api.patch(`/trainers/${id}/password`, { password });
    setLoading(false);
    onClose();
    alert("Senha atualizada");
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h3>Resetar senha</h3>

        <InputWrapper>
          <Label>Nova senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputWrapper>

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth loading={loading} onClick={save}>
            Atualizar senha
          </Button>
        </div>
      </ModalBox>
    </Overlay>
  );
};
