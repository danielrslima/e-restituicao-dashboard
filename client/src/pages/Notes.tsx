import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";

interface Note {
  id: number;
  formId: number;
  conteudo: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export default function Notes() {
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [novaNotaConteudo, setNovaNotaConteudo] = useState("");
  const [editandoNota, setEditandoNota] = useState<Note | null>(null);

  const { data: formularios } = trpc.irpf.list.useQuery({});
  const { data: notas } = trpc.notes.list.useQuery(
    selectedFormId ? { formId: selectedFormId } : { formId: 0 }
  );

  const criarNotaMutation = trpc.notes.create.useMutation({
    onSuccess: () => {
      setNovaNotaConteudo("");
    },
  });

  const atualizarNotaMutation = trpc.notes.update.useMutation({
    onSuccess: () => {
      setEditandoNota(null);
    },
  });

  const deletarNotaMutation = trpc.notes.delete.useMutation();

  const handleCriarNota = () => {
    if (!selectedFormId || !novaNotaConteudo.trim()) return;

    criarNotaMutation.mutate({
      formId: selectedFormId,
      conteudo: novaNotaConteudo,
    });
  };

  const handleAtualizarNota = () => {
    if (!editandoNota || !editandoNota.conteudo.trim()) return;

    atualizarNotaMutation.mutate({
      id: editandoNota.id,
      conteudo: editandoNota.conteudo,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notas e Observações</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Formulários */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formulários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {formularios?.map((form: any) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedFormId(form.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedFormId === form.id
                        ? "bg-blue-50 border-blue-300"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium text-sm">{form.nomeCliente}</p>
                    <p className="text-xs text-gray-500">{form.cpf}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas do Formulário Selecionado */}
        <div className="lg:col-span-2">
          {selectedFormId ? (
            <div className="space-y-4">
              {/* Adicionar Nova Nota */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Nota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Digite sua observação aqui..."
                    value={novaNotaConteudo}
                    onChange={(e) => setNovaNotaConteudo(e.target.value)}
                    className="min-h-24"
                  />
                  <Button
                    onClick={handleCriarNota}
                    disabled={!novaNotaConteudo.trim()}
                    className="w-full"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Nota
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Notas */}
              <div className="space-y-3">
                {notas?.map((nota: Note) => (
                  <Card key={nota.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-gray-500">
                          {new Date(nota.criadoEm).toLocaleString("pt-BR")}
                        </p>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditandoNota(nota)}
                              >
                                <EditIcon className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Nota</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                <Textarea
                                  value={editandoNota?.conteudo || ""}
                                  onChange={(e) =>
                                    setEditandoNota(
                                      editandoNota
                                        ? {
                                            ...editandoNota,
                                            conteudo: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  className="min-h-24"
                                />
                                <Button
                                  onClick={handleAtualizarNota}
                                  className="w-full"
                                >
                                  Salvar Alterações
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletarNotaMutation.mutate({ id: nota.id })}
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {nota.conteudo}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Selecione um formulário para adicionar notas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
