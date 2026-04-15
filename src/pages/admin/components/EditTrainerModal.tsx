import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { Button } from "../../../components/ui/Button";
import { Input, InputWrapper, Label } from "../../../components/ui/Input";
import { Overlay, ModalBox } from "../../../components/ui/Modal";

interface Props {
  trainer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  onClose: () => void;
  onSaved: () => void;
}

export const EditTrainerModal = ({ trainer, onClose, onSaved }: Props) => {
  const [name, setName] = useState(trainer.name);
  const [email, setEmail] = useState(trainer.email);
  const [phone, setPhone] = useState(trainer.phone || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(trainer.name);
    setEmail(trainer.email);
    setPhone(trainer.phone || "");
  }, [trainer]);

  const save = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    await api.patch(`/admin/${trainer.id}`, { name, email, phone });
    setLoading(false);
    onSaved();
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h3>Editar personal</h3>

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          <InputWrapper>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </InputWrapper>

          <InputWrapper>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </InputWrapper>

          <InputWrapper>
            <Label>Telefone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </InputWrapper>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Salvar
            </Button>
          </div>
        </form>
      </ModalBox>
    </Overlay>
  );
};