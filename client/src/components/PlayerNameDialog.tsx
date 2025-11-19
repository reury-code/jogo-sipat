import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getRanking } from "@/types/ranking";

interface PlayerNameDialogProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel?: () => void;
}

export default function PlayerNameDialog({
  isOpen,
  onConfirm,
  onCancel,
}: PlayerNameDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Por favor, digite seu nome!");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Nome deve ter pelo menos 2 caracteres!");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Nome deve ter no máximo 20 caracteres!");
      return;
    }

    // Verificar se o nome já existe no ranking (case-insensitive)
    const ranking = getRanking();
    const nameExists = ranking.some(
      (entry) => entry.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (nameExists) {
      setError("Este nome já está no ranking! Escolha outro nome.");
      return;
    }

    onConfirm(trimmedName);
    setName("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClose = () => {
    setName("");
    setError("");
    onCancel?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-md bg-gradient-to-br from-purple-900 to-indigo-900 border-4 border-purple-400 text-white"
        onInteractOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-game-title text-center text-yellow-300">
            🎮 BEM-VINDO, AGENTE!
          </DialogTitle>
          <DialogDescription className="text-center text-purple-200 text-base">
            Digite seu nome para entrar no ranking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Digite seu nome..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="text-center text-xl font-game-body bg-white/90 text-purple-900 border-4 border-purple-300 focus:border-yellow-400 placeholder:text-purple-400"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm text-center font-game-body">
                {error}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="btn-3d w-full bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white font-game-title text-xl py-6 rounded-2xl uppercase border-4 border-green-300"
          >
            <span className="text-stroke-sm">▶️ COMEÇAR JOGO</span>
          </Button>
        </div>

        <div className="text-center text-xs text-purple-300">
          Seus dados ficam salvos apenas no seu navegador
        </div>
      </DialogContent>
    </Dialog>
  );
}
