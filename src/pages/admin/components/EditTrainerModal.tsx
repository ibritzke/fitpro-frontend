import { useState } from "react";
import { api } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { Input, InputWrapper, Label } from "../../../components/ui/Input";
import { Overlay, ModalBox } from "../../../components/ui/Modal";

interface Props {
  trainer: {
    id: string;
    name: string;
    email: string;
  };
  onClose: () => void;
  onSaved: () => void;
}

export const EditTrainerModal = ({ trainer, onClose, onSaved }: Props) => {
  const [name, setName] = useState(trainer.name);
  const [email, setEmail] = useState(trainer.email);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await api.patch(`/trainers/${trainer.id}`, { name, email });
    setLoading(false);
    onSaved();
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h3>Editar personal</h3>

        <InputWrapper>
          <Label>Nome</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </InputWrapper>

        <InputWrapper>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </InputWrapper>

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth loading={loading} onClick={save}>
            Salvar
          </Button>
        </div>
      </ModalBox>
    </Overlay>
  );
};